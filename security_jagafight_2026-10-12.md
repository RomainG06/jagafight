# Audit ciblé Jaga Fight — 12 octobre 2026

## Synthèse

Les protections HTTP contre l'encapsulation dans une iframe et une CSP restrictive pour les scripts sont effectivement présentes en production. Sans connexion, le navigateur est redirigé de /admin et /espace-membre vers /connexion. Les lectures directes anonymes de cinq tables contenant les données membres n'ont renvoyé aucune ligne. Aucune fuite de données personnelles n'a été constatée dans ces tests.

Cela ne certifie pas toutes les autorisations : les politiques Supabase distantes, les opérations d'écriture, les documents stockés et les accès d'un membre aux données d'un autre membre restent à vérifier. /membre renvoie HTTP 500 et ne correspond pas à la route membre du dépôt.

## Méthode

Lectures HTTP sans session sur /, /admin, /membre et /espace-membre ; vérification des redirections dans le navigateur sur /admin et /espace-membre ; inspection du code local pertinent ; lecture des scripts publics de /connexion pour identifier la configuration Supabase déployée ; six requêtes SELECT limitées à une ligne avec la clé publique anon du site, sans session utilisateur.

Aucune donnée personnelle ou clé n'a été écrite dans les sorties ou ce rapport. Aucune modification, création de compte, tentative de mot de passe ou opération d'écriture en production. La correspondance intégrale entre le dépôt et le déploiement n'a pas été établie ; les observations réseau priment pour les constats de production.

## Protections confirmées

- Sur les quatre chemins HTTP testés : X-Frame-Options: DENY et CSP frame-ancestors 'none'. Le navigateur doit refuser leur intégration dans une iframe.
- CSP script-src 'self', sans unsafe-inline ni unsafe-eval pour les scripts ; object-src 'none', base-uri 'self', form-action 'self'. Ce sont des protections supplémentaires, pas une preuve d'absence de XSS. style-src accepte unsafe-inline pour les styles uniquement.
- X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy et Strict-Transport-Security présents.
- /admin et /espace-membre : HTTP 200 avec coquille HTML sans données membres, Cache-Control: no-store, max-age=0 ; redirection vers /connexion constatée avec JavaScript actif, sans identification.
- Le code local masque les écrans administrateur sans session et sans rôle admin : src/components/ProtectedRoute.tsx:12, :17 et :30. Les pages administratives utilisent AdminLayout, qui enveloppe son contenu dans ProtectedRoute, src/components/layout/AdminLayout.tsx:80.
- Le code local masque l'espace membre sans session : src/components/MemberRoute.tsx:10 et :21 ; src/pages/EspaceMembre.tsx:312.
- Aucun usage de dangerouslySetInnerHTML, innerHTML, eval() ou new Function trouvé par recherche dans les fichiers TypeScript/TSX de src et pages. Cette recherche ciblée ne couvre pas toutes les sources possibles de XSS.

## Résultats des lectures anonymes Supabase

| Table | Réponse | Lignes retournées, limite 1 |
|---|---|---|
| membres | HTTP 200 | 0 |
| adhesions | HTTP 200 | 0 |
| documents | HTTP 200 | 0 |
| paiements | HTTP 200 | 0 |
| user_roles | HTTP 200 | 0 |
| saisons | HTTP 200 | 1 |

Une réponse 200 avec tableau vide ne prouve pas que RLS est activée : elle peut correspondre à un filtrage de sécurité ou à une table vide. Elle établit uniquement qu'aucune ligne n'a été exposée à ces requêtes. La lecture anonyme d'une saison n'est pas nécessairement un problème si ces informations sont destinées au public. La clé anon est prévue pour être publique ; elle ne doit jamais être confondue avec une clé service_role.

## JAGA-001 — Priorité élevée de vérification : autorisations de données

Statut : risque conditionnel, aucune vulnérabilité confirmée.

Preuve : les contrôles de navigation sont côté navigateur et les pages interrogent Supabase directement. src/contexts/AuthContext.tsx:27 lit user_roles pour déterminer isAdmin. Les politiques RLS et Storage ne sont pas définies dans les migrations disponibles du dépôt.

Impact si les politiques sont trop permissives : un membre pourrait lire ou modifier les données d'un autre membre, se donner un rôle administrateur ou accéder à des documents privés via l'API, indépendamment des redirections.

Action : examiner les politiques SELECT/INSERT/UPDATE/DELETE de toutes les tables exposées, particulièrement user_roles, les champs administratifs des adhésions/paiements et les relations vers membres. Vérifier l'isolation avec deux comptes membres de test et un compte administrateur, ainsi que les accès anonymes en écriture dans un environnement de test. Auditer aussi les fonctions RPC et vues exposées.

Limite : sans accès aux politiques distantes ni comptes de test, ces points ne peuvent pas être certifiés.

## JAGA-002 — Priorité moyenne de vérification : fichiers privés

Statut : contrôle externe requis.

Preuve : src/components/sections/espace-membre/DocumentsSection.tsx:103 envoie des fichiers au bucket documents. Les restrictions MIME et taille sont appliquées dans le navigateur, :60 et :66.

Impact conditionnel : accès aux pièces d'identité/certificats d'autres membres, écrasement de fichiers ou envoi de fichiers non autorisés si les règles Storage sont insuffisantes.

Action : confirmer que le bucket est privé, que les politiques imposent le propriétaire des chemins et les droits administrateur, et que les limites de taille/types sont imposées côté service. Aucun fichier existant n'a été téléchargé et aucun upload testé.

## JAGA-003 — Sévérité faible : erreur serveur sur /membre

Preuve : GET https://www.jagafight.fr/membre renvoie HTTP 500 et « An error occurred. » sans détail technique. La route définie dans le dépôt est /espace-membre.

Impact : URL inutilisable et mauvaise gestion d'un chemin absent ; aucune fuite ni contournement de connexion constaté.

Action : décider si /membre doit rediriger vers /espace-membre ou renvoyer une page 404, puis examiner la gestion des routes inconnues dans Vike et le rendu serveur, api/ssr.js:12. Aucun changement demandé ou effectué.

## Références

- [Supabase : Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [Supabase : clés API publiques et secrètes](https://supabase.com/docs/guides/getting-started/api-keys).

Les résultats d'audit des dépendances et de compilation datés du 22 septembre ne sont pas repris comme vérifications actuelles. Cet audit est ciblé sur l'accès sans connexion, les données et les protections HTTP.
