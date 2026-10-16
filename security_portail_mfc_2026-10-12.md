# Analyse externe de sécurité — Portail MFC

Date : 12 octobre 2026, vers 14 h 52, heure de Paris.

## Synthèse

Le jeton fourni déclare une session Firebase avec des droits de super administrateur. S'il est authentique, non révoqué et accepté par une route, son détenteur peut agir avec les droits de cette session. Ce comportement est inhérent à une session et ne démontre pas à lui seul une faille du site. Son partage impose cependant une révocation immédiate.

Les lectures sans authentification de /dashboard et /membership ne montrent que l'écran de chargement. Aucun accès aux données privées n'a été confirmé. Plusieurs en-têtes de protection sont absents des réponses examinées. Cette analyse externe limitée ne permet pas de certifier la sécurité du portail.

## Périmètre et méthode

- Requêtes GET sans authentification vers https://portail.mfc-fightclub.fr/login, /dashboard et /membership ; examen des réponses HTTP, du HTML et de scripts JavaScript publics référencés par ces pages.
- Requête GET sans authentification vers /api/auth/session : réponse 405.
- Lecture des déclarations du jeton fourni, sans validation cryptographique ni test de révocation. Le jeton n'a pas été envoyé au portail, enregistré dans ce rapport ou reproduit.
- Aucun changement de données, aucune tentative de mot de passe, aucun test de charge.
- Le dépôt local Jaga Fight utilise Vike/Supabase et n'est pas identifié comme le code du portail Next.js/Firebase. Aucun constat sur ce dépôt n'est transposé au portail.

## 1. Priorité élevée — Session privilégiée divulguée

Preuve : le contenu fourni annonce alg=RS256, un émetteur session.firebase.google.com et admin=true, superAdmin=true, super_admin=true, role=super_admin. L'émission déclarée est le 12 octobre 2026 à 14:37:18 et l'expiration le 17 octobre 2026 à 14:37:18, heure de Paris, soit cinq jours. Ces informations sont des déclarations non vérifiées.

Impact : si le serveur accepte ce jeton, une personne le possédant pourrait usurper la session sur les routes qui s'appuient sur ce cookie.

Action : révoquer les sessions Firebase du compte via revokeRefreshTokens(uid), et vérifier que les routes protégées utilisent verifySessionCookie(cookie, true) afin de contrôler la révocation. Supprimer seulement le cookie du navigateur ne suffit pas à invalider une copie. Contrôler les journaux d'accès du compte et réduire la durée des sessions administrateur.

Limite : ni la signature, ni la révocation, ni les attributs réels du cookie (nom, Secure, HttpOnly, SameSite, domaine, chemin) n'ont été vérifiés. La présence des rôles dans un JWT ne prouve pas leur acceptation par le serveur. email_verified=false est également déclaré ; vérifier la politique de vérification des comptes administrateurs sans considérer ce seul champ comme une faille.

## 2. Sévérité moyenne — En-têtes de protection absents

Preuve : sur les trois réponses HTML examinées, absence de Content-Security-Policy, X-Frame-Options, X-Content-Type-Options et Referrer-Policy. Aucun élément meta de CSP n'a été observé dans le HTML examiné.

Impact : protections supplémentaires contre les injections de scripts, l'intégration du portail dans une page trompeuse et l'interprétation incorrecte des types de fichiers manquantes. Aucune exploitation XSS ou de clickjacking n'a été démontrée.

Action : déployer une CSP adaptée aux ressources utilisées, notamment frame-ancestors ; ajouter X-Content-Type-Options: nosniff et une Referrer-Policy adaptée. Valider la compatibilité des protections avec les fonctionnalités du portail.

## 3. Point de contrôle — Pages publiques, contrôle de connexion côté navigateur

Preuve : /dashboard et /membership répondent HTTP 200 sans cookie. Leur contenu visible contient « Chargement de votre espace… » et des liens juridiques, sans données de membre observées. Le script public /_next/static/chunks/app/(app)/layout-6c5d242899cc34ca.js contient une redirection vers /login en l'absence d'utilisateur après chargement.

Interprétation : une interface publique vide n'est pas une fuite de données. Une redirection côté navigateur ne constitue toutefois pas une frontière de sécurité pour les API, actions serveur ou données Firebase.

Action : vérifier les contrôles de session et de rôle sur chaque API/action serveur et les règles Firestore/Storage avec un compte de test. Tester les cas sans session, session invalide, expirée, révoquée et compte membre simple. Vérifier également l'accès aux ressources d'un autre membre.

## 4. Point de contrôle — Cache partagé des pages

Preuve : les trois pages renvoient Cache-Control: s-maxage=31536000 et x-nextjs-prerender: 1.

Interprétation : ce cache peut être légitime pour une interface statique publique. Aucune fuite entre utilisateurs n'est démontrée.

Action : vérifier que les réponses personnalisées, API privées et réponses authentifiées ne sont jamais mises dans un cache partagé ; appliquer private/no-store aux réponses sensibles selon leur usage.

## Vérifications nécessaires pour conclure

Examiner le code serveur de /api/auth/session, les fonctions qui vérifient les cookies, la déconnexion/révocation, les contrôles de rôle, les règles Firestore/Storage et les protections CSRF. Le script de connexion utilise un POST vers /api/auth/session avec un ID token en Authorization ; cette observation ne révèle pas l'implémentation serveur ni le nom du cookie créé.

Pour confirmer l'accès avec le jeton, il faut connaître le cookie attendu et distinguer les routes utilisant une session serveur de celles utilisant Firebase Auth dans le navigateur. Utiliser une session de test dédiée après révocation du jeton divulgué. Ne pas transmettre de nouveau jeton administrateur dans une conversation ou un rapport.

## Référence

[Documentation officielle Firebase : gestion des cookies de session](https://firebase.google.com/docs/auth/admin/manage-cookies).
