// Coordonnées du club — source unique pour les liens d'appel et WhatsApp.

export const PHONE_DISPLAY = '07 43 52 72 93'
export const PHONE_E164 = '+33743527293'
export const PHONE_HREF = `tel:${PHONE_E164}`

const WHATSAPP_NUMBER = '33743527293'

export const DEFAULT_WHATSAPP_MESSAGE = 'Bonjour Jaga Fight, je souhaite réserver mon cours d’essai gratuit.'

export function whatsappUrl(message: string = DEFAULT_WHATSAPP_MESSAGE) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
