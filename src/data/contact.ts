// Coordonnées du club — source unique pour les liens d'appel, WhatsApp, Google et réseaux.

export const PHONE_DISPLAY = '07 43 52 72 93'
export const PHONE_E164 = '+33743527293'
export const PHONE_HREF = `tel:${PHONE_E164}`

const WHATSAPP_NUMBER = '33743527293'

export const DEFAULT_WHATSAPP_MESSAGE = 'Bonjour Jaga Fight, je souhaite réserver mon cours d’essai gratuit.'

export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const INSTAGRAM_URL = 'https://www.instagram.com/jagafight'

/** Fiche Google Maps du club (recherche par nom + adresse). */
export const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Jaga Fight, 864 Av. Pierre et Marie Curie, 06700 Saint-Laurent-du-Var')

/** Itinéraire Google Maps jusqu'au club. */
export const GOOGLE_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('864 Av. Pierre et Marie Curie, 06700 Saint-Laurent-du-Var')

/**
 * Avis Google du club.
 * TODO : remplacer `url` par le lien « Partager » de la fiche Google, et renseigner
 * `rating` / `count` (ex. 4.9 / 37) pour afficher la note. Laisser `null` tant
 * que la valeur réelle n'est pas connue : le badge s'affiche alors sans note.
 */
export const GOOGLE_REVIEWS = {
    url: GOOGLE_MAPS_URL,
    rating: null as number | null,
    count: null as number | null,
}
