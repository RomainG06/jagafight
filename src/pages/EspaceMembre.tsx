import { useEffect, useState, useCallback } from 'react'
import { Lock } from 'lucide-react'
import { navigate } from 'vike/client/router'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import type { Membre, Adhesion, Document, Saison } from '../lib/supabase'
import { useAuth } from '../contexts/auth-context'
import MemberRoute from '../components/MemberRoute'
import ProfilSection from '../components/sections/espace-membre/ProfilSection'
import AdhesionSection from '../components/sections/espace-membre/AdhesionSection'
import DocumentsSection from '../components/sections/espace-membre/DocumentsSection'
import UrgenceSanteSection from '../components/sections/espace-membre/UrgenceSanteSection'
import LegalSignatureSection from '../components/sections/espace-membre/LegalSignatureSection'

type SectionId = 'profil' | 'adhesion' | 'documents' | 'urgence' | 'legal'

const SECTIONS: { id: SectionId; label: string }[] = [
    { id: 'profil', label: 'Mon profil' },
    { id: 'adhesion', label: 'Mon adhésion' },
    { id: 'documents', label: 'Mes documents' },
    { id: 'urgence', label: 'Urgence & Santé' },
    { id: 'legal', label: 'Légal & Signature' },
]

function isProfilComplete(m: Membre | null) {
    if (!(m?.civilite && m.nom && m.prenom && m.date_naissance && m.lieu_naissance
        && m.nationalite && m.adresse && m.cp && m.ville && m.telephone)) {
        return false
    }

    if (!m.est_mineur) return true

    return !!(m.responsable_nom && m.responsable_prenom && m.responsable_lien
        && m.responsable_tel && m.responsable_email)
}
function isAdhesionComplete(a: Adhesion | null) {
    return !!(a?.disciplines?.length && a?.formule_tarifaire && a?.mode_paiement)
}
function isDocumentsComplete(docs: Document[]) {
    return docs.some(d => d.type === 'certificat_medical')
}
function isUrgenceComplete(m: Membre | null) {
    return !!(m?.urgence_nom && m?.urgence_tel)
}
function isLegalComplete(a: Adhesion | null) {
    return !!a?.signature_base64
}

function getCompletion(
    membre: Membre | null,
    adhesion: Adhesion | null,
    documents: Document[]
) {
    return [
        { id: 'profil' as const, complete: isProfilComplete(membre) },
        { id: 'adhesion' as const, complete: isAdhesionComplete(adhesion) },
        { id: 'documents' as const, complete: isDocumentsComplete(documents) },
        { id: 'urgence' as const, complete: isUrgenceComplete(membre) },
        { id: 'legal' as const, complete: isLegalComplete(adhesion) },
    ]
}

const SECTION_HINTS: Record<SectionId, string> = {
    profil: 'Renseignez votre identité et votre adresse (et, pour un mineur, le responsable légal). Cette étape débloque les suivantes.',
    adhesion: 'Choisissez votre discipline, votre formule et votre mode de paiement.',
    documents: 'Déposez votre certificat médical. Le CERFA à faire remplir par votre médecin est téléchargeable dans cette section.',
    urgence: 'Indiquez une personne à prévenir en cas de besoin pendant un entraînement.',
    legal: 'Lisez le règlement intérieur et signez en ligne pour finaliser votre dossier.',
}

function NextStepCard({ completion, pct, onContinue }: {
    completion: { id: SectionId; complete: boolean }[]
    pct: number
    onContinue: (id: SectionId) => void
}) {
    const next = completion.find(section => !section.complete)
    const doneCount = completion.filter(section => section.complete).length

    if (!next) {
        return (
            <div className="mx-6 mt-4 border border-green-500/30 bg-green-500/10 px-5 py-4">
                <p className="text-sm font-semibold text-green-300">Votre dossier est complet, merci !</p>
                <p className="mt-1 text-sm text-[#F5F5F0]/70">
                    Le club va le vérifier. Le règlement de votre adhésion se fait au club : présentez-vous à votre prochain cours.
                </p>
            </div>
        )
    }

    const label = SECTIONS.find(section => section.id === next.id)?.label ?? ''

    return (
        <div className="mx-6 mt-4 flex flex-col gap-4 border border-[#eb0071]/40 bg-[#eb0071]/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">
                    {pct === 0 ? 'Bienvenue ! Finalisez votre inscription' : `Prochaine étape · ${doneCount + 1} sur ${completion.length}`}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#F5F5F0]">{label}</p>
                <p className="mt-1 text-sm text-[#F5F5F0]/65">{SECTION_HINTS[next.id]}</p>
                {pct === 0 && (
                    <p className="mt-2 text-xs text-[#F5F5F0]/45">
                        Votre inscription au club n’est validée qu’une fois les 5 sections complétées. Vos réponses sont enregistrées au fur et à mesure.
                    </p>
                )}
            </div>
            <button
                type="button"
                onClick={() => onContinue(next.id)}
                className="shrink-0 rounded bg-[#eb0071] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90 cursor-pointer"
            >
                {pct === 0 ? 'Commencer' : 'Continuer'}
            </button>
        </div>
    )
}

function EspaceMembreInner() {
    const { session } = useAuth()
    const [activeSection, setActiveSection] = useState<SectionId>('profil')
    const [membre, setMembre] = useState<Membre | null>(null)
    const [adhesion, setAdhesion] = useState<Adhesion | null>(null)
    const [documents, setDocuments] = useState<Document[]>([])
    const [saisons, setSaisons] = useState<Saison[]>([])
    const [loading, setLoading] = useState(true)
    const [savedFeedback, setSavedFeedback] = useState(false)

    const userId = session!.user.id

    const fetchData = useCallback(async () => {
        const [membreRes, saisonsRes] = await Promise.all([
            supabase
                .from('membres')
                .select('*, adhesions(*), documents(*)')
                .eq('user_id', userId)
                .maybeSingle(),

            supabase
                .from('saisons')
                .select('*')
                .order('date_debut', { ascending: false }),
        ])

        const raw = membreRes.data as (
            Membre & {
                adhesions: Adhesion[]
                documents: Document[]
            }
        ) | null

        const m: Membre | null = raw
            ? (({ adhesions, documents, ...rest }) => {
                void adhesions
                void documents
                return rest
            })(raw) as Membre
            : null

        const adhesions = [...(raw?.adhesions ?? [])] as Adhesion[]

        adhesions.sort(
            (a, b) =>
                (b.created_at ?? '').localeCompare(a.created_at ?? '')
        )

        const currentAdhesion = adhesions[0] ?? null
        const currentDocuments = (raw?.documents ?? []) as Document[]
        const currentSaisons = (saisonsRes.data ?? []) as Saison[]

        setMembre(m)
        setAdhesion(currentAdhesion)
        setDocuments(currentDocuments)
        setSaisons(currentSaisons)
        setLoading(false)

        // IMPORTANT : on retourne directement les valeurs fraîches
        return {
            membre: m,
            adhesion: currentAdhesion,
            documents: currentDocuments,
        }
    }, [userId])

    // Fetching remote records is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void fetchData() }, [fetchData])

    async function handleSaved() {
        const data = await fetchData()

        setSavedFeedback(true)
        setTimeout(() => setSavedFeedback(false), 2500)

        const completion = getCompletion(
            data.membre,
            data.adhesion,
            data.documents
        )

        const firstIncomplete = completion.find(section => !section.complete)

        if (firstIncomplete) {
            setActiveSection(firstIncomplete.id)
        }
    }

    const completion = getCompletion(
        membre,
        adhesion,
        documents
    )

    const pct = Math.round(
        (
            completion.filter(section => section.complete).length
            / completion.length
        ) * 100
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        await navigate('/')
    }

    return (
        <>
            <Helmet>
                <title>Mon espace — Jaga Fight</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="min-h-screen bg-[#0a0a0a] text-[#F5F5F0]">
                {/* Header */}
                <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors tracking-widest uppercase">
                            ← Jaga Fight
                        </a>
                        <span className="text-[#F5F5F0]/20">|</span>
                        <h1 className="font-title text-sm tracking-widest uppercase">
                            {membre?.prenom ? `Bonjour, ${membre.prenom}` : 'Mon espace'}
                        </h1>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-xs text-[#eb0071] hover:text-[#eb0071] transition-colors tracking-widest uppercase cursor-pointer"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Progress */}
                <div className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#F5F5F0]/40 tracking-widest uppercase">
                            Dossier complété à {pct}%
                        </span>
                        {pct === 100 && (
                            <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5">
                                ✓ Dossier complet
                            </span>
                        )}
                    </div>
                    <div className="h-1 bg-white/5 w-full">
                        <div
                            className="h-1 bg-[#eb0071] transition-[width] duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                <NextStepCard
                    completion={completion}
                    pct={pct}
                    onContinue={id => {
                        setActiveSection(id)
                        document.getElementById('espace-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                />

                {savedFeedback && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                        ✓ Enregistré avec succès.
                    </div>
                )}

                <div className="flex flex-col md:flex-row">
                    {/* Sidebar navigation */}
                    <nav className="md:w-56 md:border-r md:border-white/10 md:min-h-screen px-4 py-6 flex-shrink-0">
                        <ul className="space-y-1">
                            {SECTIONS.map(s => {
                                const done = completion.find(c => c.id === s.id)?.complete ?? false
                                const profilDone = completion.find(c => c.id === 'profil')?.complete ?? false
                                const locked = s.id !== 'profil' && !profilDone

                                return (
                                    <li key={s.id}>
                                        <button
                                            onClick={() => !locked && setActiveSection(s.id)}
                                            disabled={locked}
                                            title={locked ? 'Complétez votre profil pour débloquer cette section' : undefined}
                                            className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-colors ${locked
                                                ? 'text-[#F5F5F0]/30 cursor-not-allowed'
                                                : activeSection === s.id
                                                    ? 'text-[#F5F5F0] bg-white/5 border-l-2 border-[#eb0071] cursor-pointer'
                                                    : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-white/3 cursor-pointer'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {locked
                                                    ? <Lock className="w-3 h-3 opacity-50" />
                                                    : <span className="w-3" />
                                                }
                                                {s.label}
                                            </span>

                                            {done && !locked && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Section content */}
                    <div id="espace-section" className="flex-1 px-6 py-8 max-w-4xl mx-auto scroll-mt-20">
                        <h2 className="font-title text-2xl tracking-widest uppercase text-[#F5F5F0] mb-6">
                            {SECTIONS.find(s => s.id === activeSection)?.label}
                        </h2>

                        {activeSection === 'profil' && (
                            <ProfilSection membre={membre} userId={userId} documents={documents} onSaved={handleSaved} />
                        )}
                        {activeSection === 'adhesion' && (
                            <AdhesionSection
                                membreId={membre?.id ?? ''}
                                adhesion={adhesion}
                                saisons={saisons}
                                onSaved={handleSaved}
                            />
                        )}
                        {activeSection === 'documents' && membre?.id && (
                            <DocumentsSection
                                membreId={membre.id}
                                documents={documents}
                                onSaved={handleSaved}
                            />
                        )}
                        {activeSection === 'urgence' && (
                            <UrgenceSanteSection membre={membre} userId={userId} onSaved={handleSaved} />
                        )}
                        {activeSection === 'legal' && (
                            <LegalSignatureSection
                                adhesion={adhesion}
                                userId={userId}
                                onSaved={handleSaved}
                            />
                        )}

                        {(activeSection === 'adhesion' || activeSection === 'documents' || activeSection === 'legal') && !membre?.id && (
                            <p className="text-sm text-amber-400">
                                Enregistrez d'abord votre profil pour accéder à cette section.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default function EspaceMembre() {
    return (
        <MemberRoute>
            <EspaceMembreInner />
        </MemberRoute>
    )
}
