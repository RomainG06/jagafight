import type { FormuleId } from './inscriptionConfig'

// Tarifs à mettre à jour dès que les montants sont connus
export const TARIFS: Record<FormuleId, number> = {
    enfant: 0,
    adulte: 0,
    'muay-thai-feminin': 0,
    famille: 0,
    'pro-sante': 0,
}

export function calculerTarif(formule: FormuleId, _codePromo?: string): number {
    return TARIFS[formule] ?? 0
}
