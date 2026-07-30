# 📘 Guide Pratique — Utilisation des Nouveaux Composants SEO

## 1. Ajouter Breadcrumb à une page

### Exemple: Page Notre ADN

**Avant** (src/pages/NotreAdn.tsx):
```tsx
import { Helmet } from 'react-helmet-async'

export default function NotreAdn() {
    return (
        <>
            <Helmet>
                <title>Notre ADN — Jaga Fight</title>
                {/* ... autres meta tags ... */}
            </Helmet>
            
            {/* Contenu de la page */}
        </>
    )
}
```

**Après**:
```tsx
import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'

export default function NotreAdn() {
    return (
        <>
            <Breadcrumb 
                items={[
                    { name: 'Notre ADN', url: 'https://www.jagafight.fr/notre-adn' }
                ]} 
            />
            
            <Helmet>
                <title>Notre ADN — Jaga Fight</title>
                {/* ... autres meta tags ... */}
            </Helmet>
            
            {/* Contenu de la page */}
        </>
    )
}
```

---

## 2. Utiliser OptimizedImage dans un composant

### Exemple: CoachHero.tsx

**Avant** (src/components/sections/coaching/CoachHero.tsx):
```tsx
import coachImage from '../../../assets/coach.jpg'

export default function CoachHero() {
    return (
        <section>
            <img 
                src={coachImage} 
                alt="Hicham Kilic — coach Jaga Fight"
                className="w-full h-96 object-cover"
            />
        </section>
    )
}
```

**Après**:
```tsx
import OptimizedImage from '../../common/OptimizedImage'
import coachImage from '../../../assets/coach.jpg'

export default function CoachHero() {
    return (
        <section>
            <OptimizedImage
                src={coachImage}
                alt="Hicham Kilic — coach Jaga Fight Champion d'Europe Muay Thaï"
                width={1200}
                height={800}
                priority={true} // Image above-the-fold, pas de lazy loading
                sizes="(max-width: 768px) 100vw, 1200px"
                className="w-full h-96 object-cover"
            />
        </section>
    )
}
```

### Exemple: ValuesSection.tsx

**Avant**:
```tsx
<div className="grid md:grid-cols-3 gap-8">
    <div>
        <img src={respectImage} alt="Respect" />
        <h3>Respect</h3>
    </div>
    {/* ... autres valeurs ... */}
</div>
```

**Après**:
```tsx
import OptimizedImage from '../../common/OptimizedImage'

<div className="grid md:grid-cols-3 gap-8">
    <div>
        <OptimizedImage
            src={respectImage}
            alt="Respect — Valeur fondamentale de Jaga Fight Cagnes-sur-Mer"
            width={400}
            height={300}
            priority={false} // Below-the-fold, lazy loading activé
            sizes="(max-width: 768px) 100vw, 33vw"
        />
        <h3>Respect</h3>
    </div>
    {/* ... autres valeurs ... */}
</div>
```

---

## 3. Mettre à jour les données de contact réelles

### Dans src/pages/Home.tsx

**Ligne ~43-44**:
```tsx
// AVANT
"telephone": "+33-XXX-XXX-XXX",
"email": "contact@jagafight.fr",

// APRÈS (remplacer par vos vraies coordonnées)
"telephone": "+33 4 93 XX XX XX",
"email": "contact@jagafight.fr",
```

### Dans src/pages/Coaching.tsx

**Ligne ~39**:
```tsx
// AVANT
"telephone": "+33-XXX-XXX-XXX",

// APRÈS
"telephone": "+33 4 93 XX XX XX",
```

---

## 4. Optimiser les images de fond CSS

### Si vous avez une vraie image de fond dans HeroSection

**Avant** (renderer/HeroSection.tsx):
```tsx
<div className="bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
```

**Après** (utiliser une vraie balise img avec OptimizedImage):
```tsx
<div className="relative">
    <OptimizedImage
        src="/images/hero-bg.jpg"
        alt=""
        width={1920}
        height={1080}
        priority={true}
        className="absolute inset-0 w-full h-full object-cover opacity-20"
    />
    <div className="relative z-10">
        {/* Contenu par-dessus */}
    </div>
</div>
```

---

## 5. Ajouter une nouvelle page au site

### Checklist complète

1. **Créer le composant de page**
```tsx
// pages/nouveauservice/+Page.tsx
import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'

export default function NouveauService() {
    return (
        <>
            <Breadcrumb 
                items={[
                    { name: 'Nouveau Service', url: 'https://www.jagafight.fr/nouveau-service' }
                ]} 
            />
            
            <Helmet>
                <title>Nouveau Service — Jaga Fight</title>
                <meta 
                    name="description" 
                    content="Description optimisée SEO de 120-160 caractères avec mots-clés pertinents." 
                />
                <meta 
                    name="keywords" 
                    content="mots-clés, séparés, virgules, Cagnes-sur-Mer" 
                />
                <link rel="canonical" href="https://www.jagafight.fr/nouveau-service" />
                
                {/* Open Graph */}
                <meta property="og:title" content="Nouveau Service — Jaga Fight" />
                <meta property="og:description" content="Description pour réseaux sociaux." />
                <meta property="og:url" content="https://www.jagafight.fr/nouveau-service" />
                <meta property="og:image" content="https://www.jagafight.fr/og-nouveau-service.jpg" />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nouveau Service — Jaga Fight" />
                <meta name="twitter:description" content="Description pour Twitter." />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-nouveau-service.jpg" />
            </Helmet>
            
            {/* Contenu */}
        </>
    )
}
```

2. **Ajouter au script de génération sitemap**

Éditer `scripts/generate-sitemap.js`:
```javascript
const pages = [
  // ... pages existantes ...
  {
    path: '/nouveau-service',
    priority: '0.7', // Ajuster selon importance
    changefreq: 'monthly',
  },
];
```

3. **(Optionnel) Générer une image OG spécifique**

Éditer `scripts/generate-og-images.js`:
```javascript
const images = [
  // ... images existantes ...
  {
    name: 'og-nouveau-service.jpg',
    title: 'NOUVEAU SERVICE',
    subtitle: 'Description courte',
    baseImage: join(assetsDir, 'photo-pertinente.jpg'),
  },
];
```

4. **Regénérer les assets et tester**
```bash
npm run generate:sitemap
npm run generate:og  # Si nouvelle image OG
npm run build
```

5. **Valider le SEO**
- Rich Results Test: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Vérifier les meta tags dans le code source

---

## 6. Paramètres OptimizedImage

### Guide des paramètres

```tsx
<OptimizedImage
  src="/images/photo.jpg"        // Requis: chemin de l'image
  alt="Description SEO complète"  // Requis: texte alternatif descriptif
  width={800}                     // Optionnel: largeur en pixels
  height={600}                    // Optionnel: hauteur en pixels
  priority={false}                // Optionnel: true = pas de lazy loading
  sizes="100vw"                   // Optionnel: pour srcset responsive
  className="rounded-lg"          // Optionnel: classes CSS
/>
```

### Quand utiliser `priority={true}` ?

✅ **OUI** pour:
- Images above-the-fold (visibles immédiatement)
- Logo principal
- Image hero de la page
- Première image d'une galerie

❌ **NON** pour:
- Images en bas de page
- Galeries d'images
- Photos dans sections secondaires

### Guide `sizes` pour responsive

```tsx
// Image pleine largeur sur mobile, 50% sur desktop
sizes="(max-width: 768px) 100vw, 50vw"

// Image 100% mobile, 33% tablette, 25% desktop
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"

// Image fixe max 800px
sizes="(max-width: 800px) 100vw, 800px"
```

---

## 7. Valider le Structured Data

### Avec Google Rich Results Test

1. Aller sur: https://search.google.com/test/rich-results
2. Entrer l'URL de votre page (ex: https://www.jagafight.fr/coaching)
3. Cliquer "Test URL"
4. Vérifier les résultats:
   - ✅ "Valid items detected" = bon
   - ⚠️ "Warnings" = à améliorer mais pas bloquant
   - ❌ "Errors" = à corriger

### Types de structured data à vérifier

- **Page d'accueil**: LocalBusiness + BreadcrumbList
- **Page Coaching**: Person + BreadcrumbList
- **Page Formations**: Course + BreadcrumbList
- **Toutes pages**: BreadcrumbList

---

## 8. Checklist pré-déploiement

Avant chaque mise en production:

- [ ] `npm run generate:og` — Images OG générées
- [ ] `npm run generate:sitemap` — Sitemap à jour
- [ ] `npm run build` — Build sans erreurs
- [ ] Toutes les images ont des `alt` descriptifs
- [ ] Toutes les pages ont `<Breadcrumb>`
- [ ] Meta tags vérifiés (title, description, OG, Twitter)
- [ ] Numéros de téléphone réels (pas de XXX)
- [ ] Test Rich Results passé
- [ ] Test Facebook Debugger passé
- [ ] Lighthouse score > 90

---

## 9. Commandes utiles

```bash
# Développement
npm run dev

# Générer assets SEO
npm run generate:og
npm run generate:sitemap

# Build complet (génère automatiquement OG + sitemap)
npm run build

# Preview du build
npm run preview

# Tester avec Lighthouse
npx lighthouse http://localhost:4173 --view

# Vérifier erreurs TypeScript
npx tsc --noEmit
```

---

## 10. Ressources et documentation

### Outils de validation
- Rich Results Test: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Lighthouse: https://web.dev/measure/

### Documentation
- Schema.org: https://schema.org/
- Open Graph: https://ogp.me/
- Google Search Central: https://developers.google.com/search
- Web.dev: https://web.dev/

---

**Besoin d'aide ?** Consultez [SEO-IMPLEMENTATION.md](./SEO-IMPLEMENTATION.md) pour la documentation complète.
