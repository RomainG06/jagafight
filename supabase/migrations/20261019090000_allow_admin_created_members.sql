-- Les adhérents saisis par un administrateur ne possèdent pas forcément
-- de compte Supabase Auth. Les inscriptions réalisées par le site continuent
-- d'enregistrer l'identifiant Auth dans cette colonne.
alter table public.membres
  alter column user_id drop not null;

comment on column public.membres.user_id is
  'Compte Supabase Auth pour les adhérents inscrits en ligne ; nul pour les fiches créées par un administrateur.';
