// Fiche club unique pour les données structurées (JSON-LD).
// Émise une seule fois par page (dans le Footer) ; les autres pages la référencent via CLUB_ID.

import { GOOGLE_MAPS_URL, INSTAGRAM_URL, PHONE_E164 } from './contact'

export const SITE_URL = 'https://www.jagafight.fr'
export const CLUB_ID = `${SITE_URL}/#club`

export const CLUB_ADDRESS = {
    street: '864 Av. Pierre et Marie Curie',
    postalCode: '06700',
    city: 'Saint-Laurent-du-Var',
}

export const clubSchema = {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'SportsOrganization'],
    '@id': CLUB_ID,
    name: 'Jaga Fight',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description: 'Club de Muay Thaï (boxe thaï) à Saint-Laurent-du-Var : cours adultes, féminin, enfants, ados, self défense, coaching et formations.',
    telephone: PHONE_E164,
    email: 'agentpro.athlete@gmail.com',
    priceRange: '€€',
    address: {
        '@type': 'PostalAddress',
        streetAddress: CLUB_ADDRESS.street,
        addressLocality: CLUB_ADDRESS.city,
        addressRegion: 'Alpes-Maritimes',
        postalCode: CLUB_ADDRESS.postalCode,
        addressCountry: 'FR',
    },
    hasMap: GOOGLE_MAPS_URL,
    sameAs: [INSTAGRAM_URL],
    areaServed: ['Saint-Laurent-du-Var', 'Cagnes-sur-Mer', 'Nice', 'Antibes', 'Villeneuve-Loubet'].map(name => ({ '@type': 'City', name })),
    founder: { '@type': 'Person', name: 'Oualid OUMERZOUK' },
    employee: { '@type': 'Person', name: 'Hicham', jobTitle: 'Directeur technique & coach principal' },
    foundingDate: '2025',
    slogan: 'Sport, éducation, transformation',
}
