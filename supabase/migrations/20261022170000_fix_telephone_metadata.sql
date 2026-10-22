-- Utilise une clé de métadonnée non ambiguë et empêche qu'une adresse
-- e-mail soit enregistrée dans membres.telephone.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  metadata_telephone text := NULLIF(BTRIM(COALESCE(
    new.raw_user_meta_data->>'telephone',
    new.raw_user_meta_data->>'phone'
  )), '');
BEGIN
  IF metadata_telephone LIKE '%@%' THEN
    metadata_telephone := NULL;
  END IF;

  INSERT INTO public.membres (user_id, civilite, nom, prenom, email, telephone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'civilite',
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom',
    new.email,
    metadata_telephone
  )
  ON CONFLICT (user_id) DO UPDATE
    SET telephone = EXCLUDED.telephone
    WHERE membres.telephone IS NULL
       OR BTRIM(membres.telephone) = ''
       OR LOWER(BTRIM(membres.telephone)) = LOWER(BTRIM(EXCLUDED.email));

  RETURN new;
END;
$$;

-- Nettoie les lignes dans lesquelles l'e-mail a été copié dans telephone.
UPDATE public.membres
SET telephone = NULL
WHERE telephone IS NOT NULL
  AND email IS NOT NULL
  AND LOWER(BTRIM(telephone)) = LOWER(BTRIM(email));

-- Récupère ensuite un vrai numéro depuis les métadonnées Auth lorsqu'il
-- existe. La clé historique "phone" reste prise en charge pour les comptes
-- créés avant cette correction.
WITH auth_metadata AS (
  SELECT
    id,
    NULLIF(BTRIM(COALESCE(
      raw_user_meta_data->>'telephone',
      raw_user_meta_data->>'phone'
    )), '') AS telephone
  FROM auth.users
)
UPDATE public.membres AS membre
SET telephone = auth_metadata.telephone
FROM auth_metadata
WHERE membre.user_id = auth_metadata.id
  AND membre.telephone IS NULL
  AND auth_metadata.telephone IS NOT NULL
  AND auth_metadata.telephone NOT LIKE '%@%';
