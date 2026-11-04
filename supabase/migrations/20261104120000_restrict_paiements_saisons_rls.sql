-- Restreint les droits sur paiements et saisons aux admins.
--
-- Avant : `paiements_auth` et `saisons_admin` (FOR ALL, USING auth.uid() IS NOT NULL)
-- laissaient n'importe quel membre connecté lire/modifier/supprimer tous les
-- paiements et créer/modifier/supprimer les saisons.
--
-- Côté code, seuls les écrans admin (AdminPaiements, AdminFicheMembre,
-- AdminSaisons) accèdent à `paiements` et écrivent dans `saisons`.
-- L'espace membre ne fait que lire `saisons` (couvert par `saisons_read`).
--
-- Les règles admin SELECT / UPDATE / DELETE existent déjà sur paiements ;
-- il ne manquait que l'INSERT (utilisé par AdminFicheMembre).

-- paiements -----------------------------------------------------------------
drop policy if exists "paiements_auth" on public.paiements;

create policy "Admins can insert paiements"
  on public.paiements
  for insert
  to authenticated
  with check ((select public.is_admin()));

-- saisons -------------------------------------------------------------------
-- `saisons_read` (SELECT, USING true) est conservée : lecture publique.
drop policy if exists "saisons_admin" on public.saisons;

create policy "Admins can insert saisons"
  on public.saisons
  for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update saisons"
  on public.saisons
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete saisons"
  on public.saisons
  for delete
  to authenticated
  using ((select public.is_admin()));
