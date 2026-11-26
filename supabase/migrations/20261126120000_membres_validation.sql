-- Validation des adhérents par le club.
-- Un administrateur valide une fiche (date + auteur) pour la distinguer des inscriptions
-- en attente. Seuls les administrateurs peuvent valider ou retirer la validation.

alter table public.membres
    add column if not exists valide_le timestamptz,
    add column if not exists valide_par uuid references auth.users (id) on delete set null;

comment on column public.membres.valide_le is
  'Date de validation de l''adhérent par un administrateur du club (null = à valider).';
comment on column public.membres.valide_par is
  'Administrateur ayant validé l''adhérent.';

create index if not exists membres_valide_le_idx on public.membres (valide_le);

-- Étend la protection des champs réservés aux administrateurs (fédérations + validation).
-- valide_par est renseigné automatiquement avec l'administrateur connecté.
create or replace function public.membres_proteger_federations()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    -- Accès hors API (éditeur SQL, service role) : pas de restriction.
    if (select auth.role()) is distinct from 'authenticated' and (select auth.role()) is distinct from 'anon' then
        return new;
    end if;

    if (select public.is_admin()) then
        if tg_op = 'INSERT' or new.valide_le is distinct from old.valide_le then
            new.valide_par := case when new.valide_le is null then null else (select auth.uid()) end;
        end if;
        return new;
    end if;

    if tg_op = 'INSERT' then
        new.federations := '{}';
        new.valide_le := null;
        new.valide_par := null;
    else
        new.federations := old.federations;
        new.valide_le := old.valide_le;
        new.valide_par := old.valide_par;
    end if;
    return new;
end;
$$;

revoke all on function public.membres_proteger_federations() from public, anon, authenticated;

drop trigger if exists membres_proteger_federations on public.membres;
create trigger membres_proteger_federations
    before insert or update of federations, valide_le, valide_par on public.membres
    for each row execute function public.membres_proteger_federations();

notify pgrst, 'reload schema';
