# Audit de sécurité — Jaga Fight

Date : 22 septembre 2026

## Synthèse

L’audit n’a trouvé aucune vulnérabilité critique confirmée dans le code du dépôt. Les dépendances, les en-têtes de production, les journaux contenant des données personnelles, l’ouverture de nouvelles fenêtres et la validation côté navigateur des documents ont été corrigés.

Deux contrôles importants restent à effectuer dans le tableau de bord Supabase : les politiques Row Level Security (RLS) des tables et les politiques du bucket de documents. Elles ne sont ni versionnées ni visibles dans ce dépôt, donc leur présence ne peut pas être certifiée ici.

## Sévérité élevée

### SEC-001 — Autorisation administrateur à confirmer dans Supabase

- **Règle :** REACT-AUTHZ-001 / Supabase RLS basics
- **Statut :** contrôle externe requis
- **Emplacement :** `src/components/ProtectedRoute.tsx:17`
- **Preuve :** l’accès à l’interface admin est filtré côté React avec `if (!isAdmin)`, tandis que les pages interrogent directement les tables Supabase depuis le navigateur.
- **Impact :** si les tables `membres`, `adhesions`, `documents`, `paiements`, `saisons` et `user_roles` n’ont pas de politiques RLS strictes, un utilisateur authentifié pourrait contourner l’interface et lire ou modifier des données administratives directement via l’API Supabase.
- **Correction :** activer RLS sur chaque table exposée, limiter les lignes membres à `(select auth.uid()) = user_id`, réserver les opérations administratives à une politique vérifiant `user_roles`, et indexer les colonnes utilisées par ces politiques.
- **Atténuation actuelle :** le composant `ProtectedRoute` masque les écrans admin, mais ce contrôle sert uniquement à l’expérience utilisateur.
- **Faux positif possible :** les politiques peuvent déjà exister dans le projet Supabase distant. Les exporter dans des migrations versionnées permettra de le vérifier et de les auditer.

## Sévérité moyenne

### SEC-002 — Validation serveur des documents à confirmer

- **Règle :** REACT-FILE-001 / Supabase Storage policies
- **Statut :** contrôle externe requis
- **Emplacement :** `src/components/sections/espace-membre/DocumentsSection.tsx:60`, `src/components/sections/espace-membre/DocumentsSection.tsx:105`
- **Preuve :** le navigateur limite désormais les documents à PDF, JPEG ou PNG et dérive l’extension du type MIME avant l’appel à `upload()`.
- **Impact :** un client modifié peut ignorer les contrôles du navigateur. Sans politique Storage et validation serveur, il pourrait envoyer un type ou une taille non autorisés, ou écrire dans le dossier d’un autre membre.
- **Correction :** imposer côté Supabase le propriétaire du chemin, la taille maximale, les types MIME autorisés et l’interdiction d’accès public au bucket. L’administrateur doit utiliser uniquement des URLs signées de courte durée.
- **Atténuation actuelle :** liste blanche MIME, limite de 5 Mo, noms de fichiers déterministes et URLs signées pendant 60 secondes.
- **Faux positif possible :** ces règles peuvent déjà être configurées dans Supabase mais ne sont pas présentes dans le dépôt.

### SEC-003 — En-têtes de sécurité incomplets

- **Règle :** REACT-CSP-001 / REACT-HEADERS-001
- **Statut :** corrigé
- **Emplacement :** `vercel.json:22`
- **Preuve :** une CSP limite maintenant les scripts à l’origine, bloque les objets et l’encapsulation, restreint les connexions à Supabase et autorise explicitement les polices Google. Une `Permissions-Policy` désactive caméra, géolocalisation et microphone.
- **Impact évité :** réduction de l’impact d’une injection de script, du clickjacking et de l’accès involontaire aux API sensibles du navigateur.
- **Correction appliquée :** CSP par en-tête Vercel, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` et `Permissions-Policy`.
- **Mitigation :** vérifier après déploiement que Vercel sert bien ces en-têtes sur toutes les routes.
- **Faux positif :** aucun dans la configuration versionnée ; le contrôle final doit se faire sur la réponse HTTP de production.

## Sévérité faible

### SEC-004 — Dépendances avec avis connus

- **Règle :** REACT-SUPPLY-001
- **Statut :** corrigé
- **Emplacement :** `package.json:41`, `package-lock.json`
- **Preuve :** l’audit initial signalait 5 avis élevés, 1 modéré et 1 faible, notamment dans Vite, Sharp, Browserslist et Nano ID.
- **Impact évité :** exposition du serveur de développement sur Windows, dénis de service dans les outils de build et vulnérabilités de traitement d’images.
- **Correction appliquée :** mise à jour de l’arbre npm, Sharp 0.35.4 et SVGO compatible. `npm audit` indique désormais 0 vulnérabilité.
- **Mitigation :** conserver `package-lock.json` et utiliser `npm ci` en intégration continue.
- **Faux positif :** plusieurs avis concernaient les outils de développement, mais leur correction réduit tout de même le risque de chaîne d’approvisionnement.

### SEC-005 — Données personnelles écrites dans la console

- **Règle :** minimisation des données et absence de secrets/journaux sensibles
- **Statut :** corrigé
- **Emplacement :** anciens journaux dans les pages membre, adhésion, documents et administration
- **Preuve :** le code journalisait les profils complets, les adhésions, les métadonnées de fichiers et des réponses Supabase.
- **Impact évité :** exposition accidentelle de données personnelles sur un poste partagé, lors d’une assistance ou dans un outil de collecte de journaux.
- **Correction appliquée :** suppression de tous les journaux applicatifs contenant ces données.
- **Mitigation :** si une télémétrie est ajoutée, journaliser seulement des identifiants techniques non personnels et des codes d’erreur.
- **Faux positif :** la configuration supprimait certains journaux au build, mais ils restaient visibles en développement.

## Vérifications réalisées

- ESLint : réussi sans erreur ni avertissement.
- TypeScript : compilation réussie.
- Build Vike/Vite : réussi, 9 pages pré-rendues.
- Dépendances : `npm audit` indique 0 vulnérabilité.
- Navigateur : accueil, navigation mobile et page de connexion vérifiés ; aucune erreur ni aucun avertissement dans la console.
