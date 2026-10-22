-- Met à jour la fonction trigger handle_new_user pour inclure le téléphone
-- transmis dans les métadonnées lors de l'inscription (clé "phone").
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.membres (user_id, civilite, nom, prenom, email, telephone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'civilite',
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom',
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (user_id) DO UPDATE
    SET telephone = EXCLUDED.telephone
    WHERE membres.telephone IS NULL;

  RETURN new;
END;
$$;

-- Rattrape les inscriptions effectuées après l'ajout du champ au
-- formulaire mais avant la mise à jour du trigger. Une valeur déjà
-- renseignée dans membres reste prioritaire.
UPDATE public.membres AS membre
SET telephone = auth_user.raw_user_meta_data->>'phone'
FROM auth.users AS auth_user
WHERE membre.user_id = auth_user.id
  AND NULLIF(BTRIM(membre.telephone), '') IS NULL
  AND NULLIF(BTRIM(auth_user.raw_user_meta_data->>'phone'), '') IS NOT NULL;
