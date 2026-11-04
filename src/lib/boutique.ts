// Accès aux données de la boutique (Supabase). Voir supabase/migrations/20261104120000_boutique.sql.
import { supabase } from './supabase'

export const BOUTIQUE_BUCKET = 'boutique'
export const RESERVATION_HOURS = 48
export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export type Variante = {
    id: string
    produit_id: string
    taille: string
    stock: number
    ordre: number
}

export type Produit = {
    id: string
    nom: string
    description: string | null
    prix_cents: number
    image_path: string | null
    actif: boolean
    ordre: number
    created_at: string
    boutique_variantes: Variante[]
}

export type Reservation = {
    id: string
    variante_id: string | null
    produit_nom: string
    taille: string
    prix_cents: number
    quantite: number
    prenom: string
    telephone: string
    statut: 'en_attente' | 'retiree' | 'annulee'
    expire_le: string
    created_at: string
}

export const formatPrice = (cents: number) =>
    (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: cents % 100 === 0 ? 0 : 2 })

export const imageUrl = (path: string | null) =>
    path ? supabase.storage.from(BOUTIQUE_BUCKET).getPublicUrl(path).data.publicUrl : null

const sortVariants = (produit: Produit): Produit => ({
    ...produit,
    boutique_variantes: [...produit.boutique_variantes].sort((a, b) => a.ordre - b.ordre || a.taille.localeCompare(b.taille)),
})

/** Produits avec leurs tailles (les visiteurs ne reçoivent que les produits actifs, via RLS). */
export async function fetchProduits() {
    const { data, error } = await supabase
        .from('boutique_produits')
        .select('*, boutique_variantes(*)')
        .order('ordre')
        .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Produit[]).map(sortVariants)
}

/** Quantité réservable par taille (stock - réservations en cours). */
export async function fetchDisponibilites() {
    const { data, error } = await supabase.rpc('boutique_disponibilites')
    if (error) throw error
    return new Map((data as Array<{ variante_id: string; disponible: number }>).map(row => [row.variante_id, row.disponible]))
}

const RESERVATION_ERRORS: Record<string, string> = {
    STOCK_INSUFFISANT: 'Cette taille vient d’être réservée. Choisissez une autre taille ou une quantité plus petite.',
    TROP_DE_RESERVATIONS: 'Vous avez déjà 3 réservations en cours. Passez au club les retirer avant d’en faire une nouvelle.',
    TELEPHONE_INVALIDE: 'Le numéro de téléphone n’est pas valide.',
    PRENOM_INVALIDE: 'Indiquez votre prénom.',
    QUANTITE_INVALIDE: 'La quantité doit être comprise entre 1 et 3.',
    PRODUIT_INDISPONIBLE: 'Ce produit n’est plus disponible.',
    TAILLE_INTROUVABLE: 'Cette taille n’est plus disponible.',
}

export async function reserver(input: { varianteId: string; quantite: number; prenom: string; telephone: string }) {
    const { data, error } = await supabase.rpc('boutique_reserver', {
        p_variante_id: input.varianteId,
        p_quantite: input.quantite,
        p_prenom: input.prenom,
        p_telephone: input.telephone,
    })
    if (error) {
        const code = Object.keys(RESERVATION_ERRORS).find(key => error.message.includes(key))
        throw new Error(code ? RESERVATION_ERRORS[code] : 'La réservation n’a pas pu être enregistrée. Réessayez ou contactez le club.')
    }
    const row = (data as Array<{ reservation_id: string; expire_le: string }>)[0]
    return { id: row.reservation_id, expireLe: new Date(row.expire_le) }
}

/** Référence courte lisible à donner au club (8 premiers caractères de l'id). */
export const shortRef = (id: string) => id.slice(0, 8).toUpperCase()

export const isExpired = (reservation: Reservation) =>
    reservation.statut === 'en_attente' && new Date(reservation.expire_le) <= new Date()
