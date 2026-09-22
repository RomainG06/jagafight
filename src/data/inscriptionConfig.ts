export const DISCIPLINES = [
    { id: 'muay-thai', label: 'Muay Thaï' },
    { id: 'muay-thai-feminin', label: 'Muay Thaï Féminin' },
    { id: 'enfants', label: 'Enfants (6–12 ans)' },
    { id: 'ados', label: 'Ados (13–17 ans)' },
    { id: 'footing', label: 'Footing' },
] as const

export type DisciplineId = typeof DISCIPLINES[number]['id']

export const FORMULES = [
    { id: 'enfant', label: 'Enfant' },
    { id: 'adulte', label: 'Adulte' },
    { id: 'muay-thai-feminin', label: 'Muay Thaï Féminin' },
    { id: 'famille', label: 'Tarif Famille (dégressif)' },
    { id: 'pro-sante', label: 'Professionnel de santé' },
] as const

export type FormuleId = typeof FORMULES[number]['id']

export const REGLEMENT_VERSION = '1.0'
export const REGLEMENT_DATE = '01/09/2026'
export const CGV_VERSION = '1.0'
export const CGV_DATE = '01/09/2026'

export const DOC_TYPES = {
    CERTIFICAT_MEDICAL: 'certificat_medical',
    PHOTO_IDENTITE: 'photo_identite',
    LICENCE: 'licence',
    PIECE_IDENTITE: 'piece_identite',
} as const

export const DOC_ACCEPT = 'image/jpeg,image/png,application/pdf'
export const DOC_MAX_SIZE_MB = 1
