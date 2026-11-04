-- Fonction réservée aux admins : on retire aussi le droit d'exécution accordé par défaut au rôle anon.
revoke execute on function public.boutique_marquer_retiree(uuid) from anon;
