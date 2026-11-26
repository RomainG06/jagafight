-- Affiliations fédérales (licences) des adhérents.
-- Par défaut un adhérent n'est rattaché à aucune fédération ; seuls les administrateurs
-- peuvent en assigner une ou plusieurs (AFMT, UFSC, FFKMDA).

alter table public.membres
    add column if not exists federations text[] not null default '{}';

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'membres_federations_check'
          and conrelid = 'public.membres'::regclass
    ) then
        alter table public.membres
            add constraint membres_federations_check
            check (federations <@ array['AFMT', 'UFSC', 'FFKMDA']::text[]);
    end if;
end
$$;

comment on column public.membres.federations is
  'Fédérations auxquelles l''adhérent est licencié (AFMT, UFSC, FFKMDA). Modifiable uniquement par un administrateur.';

-- Les adhérents peuvent modifier leur propre fiche (RLS) : ce déclencheur empêche
-- qu'un non-administrateur change ses affiliations. Les accès hors API (éditeur SQL,
-- service role) ne sont pas concernés.
create or replace function public.membres_proteger_federations()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    if (select auth.role()) is distinct from 'authenticated' and (select auth.role()) is distinct from 'anon' then
        return new;
    end if;

    if (select public.is_admin()) then
        return new;
    end if;

    if tg_op = 'INSERT' then
        new.federations := '{}';
    else
        new.federations := old.federations;
    end if;
    return new;
end;
$$;

revoke all on function public.membres_proteger_federations() from public, anon, authenticated;

drop trigger if exists membres_proteger_federations on public.membres;
create trigger membres_proteger_federations
    before insert or update of federations on public.membres
    for each row execute function public.membres_proteger_federations();
