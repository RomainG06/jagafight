// Fédérations auxquelles un adhérent peut être licencié (doit rester aligné avec la
// contrainte membres_federations_check de la base).

export const FEDERATIONS = [
    { id: 'AFMT', url: 'https://www.afmt.fr/' },
    { id: 'UFSC', url: 'https://ufsc-france.fr/' },
    { id: 'FFKMDA', url: 'https://www.ffkmda.com/' },
] as const

export type FederationId = typeof FEDERATIONS[number]['id']

export const FEDERATION_IDS: FederationId[] = FEDERATIONS.map(f => f.id)

/** Trie et filtre une liste de fédérations dans l'ordre de référence. */
export const normalizeFederations = (values?: readonly string[] | null): FederationId[] =>
    FEDERATION_IDS.filter(id => values?.includes(id))
