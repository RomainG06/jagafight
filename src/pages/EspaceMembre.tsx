import { useEffect, useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import type { Membre, Adhesion, Document, Saison } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
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
    return !!(m?.nom && m?.prenom && m?.date_naissance && m?.telephone)
}
function isAdhesionComplete(a: Adhesion | null) {
    return !!(a?.disciplines?.length && a?.formule_tarifaire)
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
            supabase.from('membres').select('*, adhesions(*), documents(*)').eq('user_id', userId).maybeSingle(),
            supabase.from('saisons').select('*').order('date_debut', { ascending: false }),
        ])
        console.log('membreRes:', membreRes)
        console.log('saisonsRes:', saisonsRes)
        console.log(activeSection, "??")

        const raw = membreRes.data as (Membre & { adhesions: Adhesion[]; documents: Document[] }) | null
        const m: Membre | null = raw ? (({ adhesions: _a, documents: _d, ...rest }) => rest)(raw) as Membre : null
        setMembre(m)
        setSaisons((saisonsRes.data ?? []) as Saison[])
        console.log(saisons, saisonsRes.data)

        if (raw) {
            const adhesions = (raw.adhesions ?? []) as Adhesion[]
            adhesions.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
            console.log('RAW:', raw)
            console.log('RAW ADHESIONS:', raw?.adhesions)
            console.log('SAISONS API:', saisonsRes.data)
            setAdhesion(adhesions[0] ?? null)
            setDocuments((raw.documents ?? []) as Document[])
        }

        setLoading(false)
    }, [userId])

    useEffect(() => { fetchData() }, [fetchData])

    function handleSaved() {
        fetchData()
        setSavedFeedback(true)
        setTimeout(() => setSavedFeedback(false), 2500)
    }

    const completion = [
        isProfilComplete(membre),
        isAdhesionComplete(adhesion),
        isDocumentsComplete(documents),
        isUrgenceComplete(membre),
        isLegalComplete(adhesion),
    ]
    const pct = Math.round((completion.filter(Boolean).length / completion.length) * 100)

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
                            className="h-1 bg-[#eb0071] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                {savedFeedback && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                        ✓ Enregistré avec succès.
                    </div>
                )}

                <div className="flex flex-col md:flex-row">
                    {/* Sidebar navigation */}
                    <nav className="md:w-56 md:border-r md:border-white/10 md:min-h-screen px-4 py-6 flex-shrink-0">
                        <ul className="space-y-1">
                            {SECTIONS.map((s, i) => {
                                const done = completion[i]
                                return (
                                    <li key={s.id}>
                                        <button
                                            onClick={() => setActiveSection(s.id)}
                                            className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-colors cursor-pointer ${activeSection === s.id
                                                ? 'text-[#F5F5F0] bg-white/5 border-l-2 border-[#eb0071]'
                                                : 'text-[#F5F5F0]/50 hover:text-[#F5F5F0] hover:bg-white/3'
                                                }`}
                                        >
                                            <span>{s.label}</span>
                                            {done && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    {/* Section content */}
                    <main className="flex-1 px-6 py-8 max-w-4xl mx-auto">
                        <h2 className="font-title text-2xl tracking-widest uppercase text-[#F5F5F0] mb-6">
                            {SECTIONS.find(s => s.id === activeSection)?.label}
                        </h2>

                        {activeSection === 'profil' && (
                            <ProfilSection membre={membre} userId={userId} onSaved={handleSaved} />
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
                    </main>
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
