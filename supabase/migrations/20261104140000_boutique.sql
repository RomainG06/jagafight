-- Boutique : produits (t-shirts…), stock par taille et réservations à payer au club.
-- Les visiteurs ne lisent que le catalogue actif et réservent via la fonction
-- boutique_reserver ; tout le reste est réservé aux administrateurs.

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.boutique_produits (
    id uuid primary key default gen_random_uuid(),
    nom text not null check (char_length(btrim(nom)) between 1 and 120),
    description text check (description is null or char_length(description) <= 1000),
    prix_cents integer not null check (prix_cents >= 0),
    image_path text,
    actif boolean not null default true,
    ordre integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.boutique_variantes (
    id uuid primary key default gen_random_uuid(),
    produit_id uuid not null references public.boutique_produits (id) on delete cascade,
    taille text not null check (char_length(btrim(taille)) between 1 and 20),
    stock integer not null default 0 check (stock >= 0),
    ordre integer not null default 0,
    unique (produit_id, taille)
);

create index if not exists boutique_variantes_produit_idx on public.boutique_variantes (produit_id);

create table if not exists public.boutique_reservations (
    id uuid primary key default gen_random_uuid(),
    variante_id uuid references public.boutique_variantes (id) on delete set null,
    -- Copie du produit au moment de la réservation (reste lisible si le produit est supprimé)
    produit_nom text not null,
    taille text not null,
    prix_cents integer not null,
    quantite integer not null default 1 check (quantite between 1 and 3),
    prenom text not null check (char_length(btrim(prenom)) between 1 and 60),
    telephone text not null check (telephone ~ '^\+?[0-9 .-]{8,20}$'),
    statut text not null default 'en_attente' check (statut in ('en_attente', 'retiree', 'annulee')),
    expire_le timestamptz not null default (now() + interval '48 hours'),
    created_at timestamptz not null default now()
);

create index if not exists boutique_reservations_variante_idx on public.boutique_reservations (variante_id);
create index if not exists boutique_reservations_statut_idx on public.boutique_reservations (statut, expire_le);

comment on table public.boutique_reservations is
  'Réservations à payer et retirer au club. Une réservation en_attente dont expire_le est passé ne bloque plus le stock.';

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table public.boutique_produits enable row level security;
alter table public.boutique_variantes enable row level security;
alter table public.boutique_reservations enable row level security;

create policy "Catalogue visible par tous"
    on public.boutique_produits for select
    to anon, authenticated
    using (actif or (select public.is_admin()));

create policy "Admins gèrent les produits"
    on public.boutique_produits for all
    to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

create policy "Tailles visibles par tous"
    on public.boutique_variantes for select
    to anon, authenticated
    using (exists (
        select 1 from public.boutique_produits p
        where p.id = produit_id and (p.actif or (select public.is_admin()))
    ));

create policy "Admins gèrent les tailles"
    on public.boutique_variantes for all
    to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

-- Pas de lecture publique des réservations (données personnelles).
create policy "Admins gèrent les réservations"
    on public.boutique_reservations for all
    to authenticated
    using ((select public.is_admin()))
    with check ((select public.is_admin()));

-- ─── Disponibilités publiques ────────────────────────────────────────────────

-- Stock restant par taille = stock - réservations en attente non expirées.
create or replace function public.boutique_disponibilites()
returns table (variante_id uuid, disponible integer)
language sql
stable
security definer
set search_path = ''
as $$
    select v.id,
           greatest(v.stock - coalesce(sum(r.quantite) filter (
               where r.statut = 'en_attente' and r.expire_le > now()
           ), 0), 0)::integer
    from public.boutique_variantes v
    join public.boutique_produits p on p.id = v.produit_id and p.actif
    left join public.boutique_reservations r on r.variante_id = v.id
    group by v.id, v.stock;
$$;

revoke all on function public.boutique_disponibilites() from public;
grant execute on function public.boutique_disponibilites() to anon, authenticated;

-- ─── Réservation (visiteurs) ─────────────────────────────────────────────────

create or replace function public.boutique_reserver(
    p_variante_id uuid,
    p_quantite integer,
    p_prenom text,
    p_telephone text
)
returns table (reservation_id uuid, expire_le timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_variante public.boutique_variantes%rowtype;
    v_produit public.boutique_produits%rowtype;
    v_reserve integer;
    v_actives integer;
    v_tel text := btrim(p_telephone);
    v_prenom text := btrim(p_prenom);
begin
    if p_quantite is null or p_quantite not between 1 and 3 then
        raise exception 'QUANTITE_INVALIDE';
    end if;
    if v_prenom is null or char_length(v_prenom) not between 1 and 60 then
        raise exception 'PRENOM_INVALIDE';
    end if;
    if v_tel is null or v_tel !~ '^\+?[0-9 .-]{8,20}$' then
        raise exception 'TELEPHONE_INVALIDE';
    end if;

    -- Verrou sur la taille : deux réservations simultanées ne peuvent pas dépasser le stock.
    select * into v_variante from public.boutique_variantes where id = p_variante_id for update;
    if not found then
        raise exception 'TAILLE_INTROUVABLE';
    end if;

    select * into v_produit from public.boutique_produits where id = v_variante.produit_id and actif;
    if not found then
        raise exception 'PRODUIT_INDISPONIBLE';
    end if;

    -- Anti-abus : 3 réservations en cours maximum par numéro.
    select count(*) into v_actives
    from public.boutique_reservations r
    where regexp_replace(r.telephone, '[^0-9]', '', 'g') = regexp_replace(v_tel, '[^0-9]', '', 'g')
      and r.statut = 'en_attente' and r.expire_le > now();
    if v_actives >= 3 then
        raise exception 'TROP_DE_RESERVATIONS';
    end if;

    select coalesce(sum(r.quantite), 0) into v_reserve
    from public.boutique_reservations r
    where r.variante_id = v_variante.id and r.statut = 'en_attente' and r.expire_le > now();

    if v_variante.stock - v_reserve < p_quantite then
        raise exception 'STOCK_INSUFFISANT';
    end if;

    insert into public.boutique_reservations as r (variante_id, produit_nom, taille, prix_cents, quantite, prenom, telephone)
    values (v_variante.id, v_produit.nom, v_variante.taille, v_produit.prix_cents, p_quantite, v_prenom, v_tel)
    returning r.id, r.expire_le into reservation_id, expire_le;

    return next;
end;
$$;

revoke all on function public.boutique_reserver(uuid, integer, text, text) from public;
grant execute on function public.boutique_reserver(uuid, integer, text, text) to anon, authenticated;

-- ─── Retrait au club (admins) ────────────────────────────────────────────────

-- Marque la réservation comme retirée (payée) et décrémente le stock en une seule transaction.
create or replace function public.boutique_marquer_retiree(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_resa public.boutique_reservations%rowtype;
begin
    if not (select public.is_admin()) then
        raise exception 'ACCES_REFUSE';
    end if;

    select * into v_resa from public.boutique_reservations where id = p_reservation_id for update;
    if not found or v_resa.statut <> 'en_attente' then
        raise exception 'RESERVATION_NON_MODIFIABLE';
    end if;

    if v_resa.variante_id is not null then
        update public.boutique_variantes
        set stock = greatest(stock - v_resa.quantite, 0)
        where id = v_resa.variante_id;
    end if;

    update public.boutique_reservations set statut = 'retiree' where id = p_reservation_id;
end;
$$;

revoke all on function public.boutique_marquer_retiree(uuid) from public;
grant execute on function public.boutique_marquer_retiree(uuid) to authenticated;

-- ─── Photos des produits ─────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('boutique', 'boutique', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Admins ajoutent les photos boutique"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'boutique' and (select public.is_admin()));

create policy "Admins remplacent les photos boutique"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'boutique' and (select public.is_admin()))
    with check (bucket_id = 'boutique' and (select public.is_admin()));

create policy "Admins suppriment les photos boutique"
    on storage.objects for delete
    to authenticated
    using (bucket_id = 'boutique' and (select public.is_admin()));
