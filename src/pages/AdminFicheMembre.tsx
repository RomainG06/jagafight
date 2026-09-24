import { useEffect, useState, useCallback } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { navigate } from 'vike/client/router'
import { supabase } from '../lib/supabase'
import type { Membre, Adhesion, Document, Paiement } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'

const MODE_LABELS: Record<string, string> = {
    especes: 'Espèces', cheque: 'Chèque', cb: 'CB', virement: 'Virement',
}
const STATUT_PAIEMENT_STYLES: Record<string, string> = {
    paye: 'text-green-400 bg-green-500/10 border-green-500/20',
    partiel: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    en_attente: 'text-red-400 bg-red-500/10 border-red-500/20',
    echelonne: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
}
const STATUT_LABELS: Record<string, string> = {
    paye: 'Payé', partiel: 'Partiel', en_attente: 'En attente', echelonne: 'Échelonné',
}

const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-2 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors'
const SELECT = `${INPUT} appearance-none`

interface PaiementForm {
    mode: Paiement['mode']
    montant: string
    statut: Paiement['statut']
    date_paiement: string
    reference: string
    notes: string
}

export default function AdminFicheMembre() {
    const { routeParams } = usePageContext()
    const id = routeParams?.id
    const [membre, setMembre] = useState<Membre | null>(null)
    const [adhesion, setAdhesion] = useState<Adhesion | null>(null)
    const [documents, setDocuments] = useState<Document[]>([])
    const [paiements, setPaiements] = useState<Paiement[]>([])
    const [loading, setLoading] = useState(true)
    const [showPaiementForm, setShowPaiementForm] = useState(false)
    const [paiementForm, setPaiementForm] = useState<PaiementForm>({
        mode: 'especes', montant: '', statut: 'en_attente',
        date_paiement: new Date().toISOString().slice(0, 10), reference: '', notes: '',
    })
    const [savingPaiement, setSavingPaiement] = useState(false)
    const [editingPaiementId, setEditingPaiementId] = useState<string | null>(null)
    const [deletingPaiementId, setDeletingPaiementId] = useState<string | null>(null)
    const [deletingMembre, setDeletingMembre] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        if (!id) return
        const [mRes, aRes, dRes, pRes] = await Promise.all([
            supabase.from('membres').select('*').eq('id', id).single(),
            supabase.from('adhesions').select('*').eq('membre_id', id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
            supabase.from('documents').select('*').eq('membre_id', id),
            supabase.from('paiements').select('*').eq('membre_id', id).order('created_at', { ascending: false }),
        ])
        setMembre(mRes.data as Membre)
        setAdhesion(aRes.data as Adhesion | null)
        setDocuments((dRes.data ?? []) as Document[])
        setPaiements((pRes.data ?? []) as Paiement[])
        setLoading(false)
    }, [id])

    // Fetching remote records is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void fetchData() }, [fetchData])

    async function downloadDoc(doc: Document) {
        const { data } = await supabase.storage
            .from('documents-membres')
            .createSignedUrl(doc.storage_path, 60)
        if (data?.signedUrl) window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
    }

    function resetPaiementForm() {
        setPaiementForm({
            mode: 'especes', montant: '', statut: 'en_attente',
            date_paiement: new Date().toISOString().slice(0, 10), reference: '', notes: '',
        })
        setEditingPaiementId(null)
        setShowPaiementForm(false)
    }

    function startEditPaiement(paiement: Paiement) {
        if (!paiement.id) return
        setPaiementForm({
            mode: paiement.mode,
            montant: String(paiement.montant),
            statut: paiement.statut,
            date_paiement: paiement.date_paiement?.slice(0, 10) ?? '',
            reference: paiement.reference ?? '',
            notes: paiement.notes ?? '',
        })
        setEditingPaiementId(paiement.id)
        setShowPaiementForm(true)
        setError('')
    }

    async function savePaiement() {
        if (!id || !paiementForm.montant) return
        const montant = Number(paiementForm.montant)
        if (!Number.isFinite(montant) || montant <= 0) {
            setError('Le montant doit être supérieur à 0.')
            return
        }

        setSavingPaiement(true)
        setError('')

        const values = {
            membre_id: id,
            adhesion_id: adhesion?.id,
            mode: paiementForm.mode,
            montant,
            statut: paiementForm.statut,
            date_paiement: paiementForm.date_paiement || null,
            reference: paiementForm.reference.trim() || null,
            notes: paiementForm.notes.trim() || null,
        }

        const result = editingPaiementId
            ? await supabase.from('paiements').update(values).eq('id', editingPaiementId).select('id')
            : await supabase.from('paiements').insert(values).select('id')

        setSavingPaiement(false)
        if (result.error || !result.data?.length) {
            setError(result.error?.message ?? 'Le paiement n’a pas pu être enregistré. Vérifiez les autorisations RLS.')
            return
        }

        setFeedback(editingPaiementId ? 'Paiement modifié.' : 'Paiement ajouté.')
        resetPaiementForm()
        await fetchData()
    }

    async function deletePaiement(paiement: Paiement) {
        if (!paiement.id) return
        const confirmed = window.confirm(`Supprimer définitivement ce paiement de ${paiement.montant} € ?`)
        if (!confirmed) return

        setDeletingPaiementId(paiement.id)
        setError('')
        const { data, error: deleteError } = await supabase
            .from('paiements')
            .delete()
            .eq('id', paiement.id)
            .select('id')

        setDeletingPaiementId(null)
        if (deleteError || !data?.length) {
            setError(deleteError?.message ?? 'Le paiement n’a pas pu être supprimé. Vérifiez les autorisations RLS.')
            return
        }

        if (editingPaiementId === paiement.id) resetPaiementForm()
        setFeedback('Paiement supprimé.')
        await fetchData()
    }

    async function deleteMembre() {
        if (!id || !membre) return
        const confirmed = window.confirm(
            `Supprimer définitivement la fiche de ${membre.prenom} ${membre.nom} et ses données associées ?`,
        )
        if (!confirmed) return

        setDeletingMembre(true)
        setError('')
        const { data, error: deleteError } = await supabase
            .from('membres')
            .delete()
            .eq('id', id)
            .select('id')

        if (deleteError || !data?.length) {
            setDeletingMembre(false)
            setError(deleteError?.message ?? 'Le membre n’a pas pu être supprimé. Vérifiez les autorisations RLS et les relations de la base.')
            return
        }

        await navigate('/admin/membres')
    }

    async function generatePDF() {
        const { jsPDF } = await import('jspdf')
        const doc = new jsPDF()
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(18)
        doc.text('Jaga Fighting Team', 20, 20)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.text(`Adhérent : ${membre?.prenom} ${membre?.nom}`, 20, 40)
        doc.text(`Email : ${membre?.email ?? ''}`, 20, 50)
        doc.text(`Formule : ${adhesion?.formule_tarifaire ?? '—'}`, 20, 60)
        doc.setFontSize(14)
        doc.text('Paiements', 20, 80)
        doc.setFontSize(10)
        let y = 92
        paiements.forEach(p => {
            doc.text(`${p.date_paiement ?? '—'}  ${MODE_LABELS[p.mode]}  ${p.montant} €  ${STATUT_LABELS[p.statut]}`, 20, y)
            y += 10
        })
        doc.save(`recu-${membre?.nom}-${membre?.prenom}.pdf`)
        setFeedback('PDF généré.')
        setTimeout(() => setFeedback(''), 3000)
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6">
                <div className="mb-6 flex flex-col gap-3">
                    <a href="/admin/membres" className="text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors tracking-widest uppercase">
                        ← Adhérents
                    </a>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-title text-xl tracking-widest uppercase">
                            {membre?.prenom} {membre?.nom}
                        </h1>
                        {membre?.profil_complet && (
                            <span className="text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-0.5">✓ Complet</span>
                        )}
                        </div>
                        <button
                            type="button"
                            onClick={deleteMembre}
                            disabled={deletingMembre}
                            className="border border-red-500/30 px-3 py-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deletingMembre ? 'Suppression…' : 'Supprimer le membre'}
                        </button>
                    </div>
                </div>

                {feedback && (
                    <p role="status" className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2">{feedback}</p>
                )}
                {error && (
                    <p role="alert" className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2">{error}</p>
                )}

                {/* Identité */}
                <Section title="Identité">
                    <Row label="Civilité" value={membre?.civilite} />
                    <Row label="Prénom" value={membre?.prenom} />
                    <Row label="Nom" value={membre?.nom} />
                    <Row label="Date de naissance" value={membre?.date_naissance ? new Date(membre.date_naissance).toLocaleDateString('fr-FR') : undefined} />
                    <Row label="Lieu de naissance" value={membre?.lieu_naissance} />
                    <Row label="Nationalité" value={membre?.nationalite} />
                    <Row label="Adresse" value={[membre?.adresse, membre?.cp, membre?.ville].filter(Boolean).join(', ')} />
                    <Row label="Email" value={membre?.email} />
                    <Row label="Téléphone" value={membre?.telephone} />
                </Section>

                {membre?.est_mineur && (
                    <Section title="Responsable légal">
                        <Row label="Prénom / Nom" value={`${membre.responsable_prenom ?? ''} ${membre.responsable_nom ?? ''}`} />
                        <Row label="Lien" value={membre.responsable_lien} />
                        <Row label="Téléphone" value={membre.responsable_tel} />
                        <Row label="Email" value={membre.responsable_email} />
                    </Section>
                )}

                {/* Adhésion */}
                <Section title="Adhésion">
                    <Row label="Disciplines" value={(adhesion?.disciplines ?? []).join(', ') || undefined} />
                    <Row label="Statut" value={adhesion?.statut_pratique} />
                    {adhesion?.statut_pratique === 'competiteur' && <>
                        <Row label="Licence" value={adhesion.licence_numero} />
                        <Row label="Poids catégorie" value={adhesion.poids_categorie} />
                        <Row label="Palmarès" value={adhesion.palmares} />
                    </>}
                    <Row label="Formule" value={adhesion?.formule_tarifaire} />
                    <Row label="Montant" value={adhesion?.montant_calcule != null ? `${adhesion.montant_calcule} €` : undefined} />
                    <Row label="Date de début" value={adhesion?.date_debut_souhaitee ? new Date(adhesion.date_debut_souhaitee).toLocaleDateString('fr-FR') : undefined} />
                    {adhesion?.signature_horodatee && (
                        <Row label="Signé le" value={new Date(adhesion.signature_horodatee).toLocaleString('fr-FR')} />
                    )}
                </Section>

                {/* Contact urgence */}
                <Section title="Contact urgence">
                    <Row label="Nom" value={membre?.urgence_nom} />
                    <Row label="Lien" value={membre?.urgence_lien} />
                    <Row label="Téléphone" value={membre?.urgence_tel} />
                </Section>

                {membre?.sante_infos && (
                    <Section title="Informations santé">
                        <p className="text-sm text-[#F5F5F0]/60 whitespace-pre-wrap">{membre.sante_infos}</p>
                    </Section>
                )}

                {/* Documents */}
                <Section title="Documents">
                    {documents.length === 0 ? (
                        <p className="text-sm text-[#F5F5F0]/30">Aucun document.</p>
                    ) : documents.map(doc => (
                        <div key={doc.id} className="flex flex-col gap-2 py-2 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="text-sm text-[#F5F5F0]/70 capitalize">{doc.type.replace(/_/g, ' ')}</span>
                                {doc.date_validite && (
                                    <span className="block text-xs text-[#F5F5F0]/30 sm:ml-2 sm:inline">
                                        valide jusqu'au {new Date(doc.date_validite).toLocaleDateString('fr-FR')}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => downloadDoc(doc)}
                                className="text-xs text-[#eb0071] hover:underline cursor-pointer"
                            >
                                Télécharger
                            </button>
                        </div>
                    ))}
                </Section>

                {/* Paiements */}
                <Section title="Paiements">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={() => {
                                if (showPaiementForm) resetPaiementForm()
                                else {
                                    setEditingPaiementId(null)
                                    setShowPaiementForm(true)
                                    setError('')
                                }
                            }}
                            className="w-full sm:w-auto text-xs px-4 py-2 border border-white/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/40 transition-colors tracking-widest uppercase cursor-pointer"
                        >
                            {showPaiementForm ? 'Fermer le formulaire' : '+ Ajouter un paiement'}
                        </button>
                        <button
                            onClick={generatePDF}
                            className="w-full sm:w-auto text-xs px-4 py-2 border border-white/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/40 transition-colors tracking-widest uppercase cursor-pointer"
                        >
                            Générer reçu PDF
                        </button>
                    </div>

                    {showPaiementForm && (
                        <div className="border border-white/10 p-4 mb-4 space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label htmlFor="paiement-mode" className={LABEL}>Mode</label>
                                    <select id="paiement-mode" value={paiementForm.mode} onChange={e => setPaiementForm(p => ({ ...p, mode: e.target.value as Paiement['mode'] }))} className={SELECT}>
                                        <option value="especes">Espèces</option>
                                        <option value="cheque">Chèque</option>
                                        <option value="cb">CB</option>
                                        <option value="virement">Virement</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="paiement-montant" className={LABEL}>Montant (€)</label>
                                    <input id="paiement-montant" name="montant" type="number" inputMode="decimal" min="0" step="0.01" value={paiementForm.montant} onChange={e => setPaiementForm(p => ({ ...p, montant: e.target.value }))} className={INPUT} />
                                </div>
                                <div>
                                    <label htmlFor="paiement-statut" className={LABEL}>Statut</label>
                                    <select id="paiement-statut" value={paiementForm.statut} onChange={e => setPaiementForm(p => ({ ...p, statut: e.target.value as Paiement['statut'] }))} className={SELECT}>
                                        <option value="paye">Payé</option>
                                        <option value="partiel">Partiel</option>
                                        <option value="en_attente">En attente</option>
                                        <option value="echelonne">Échelonné</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="paiement-date" className={LABEL}>Date</label>
                                    <input id="paiement-date" name="date-paiement" type="date" value={paiementForm.date_paiement} onChange={e => setPaiementForm(p => ({ ...p, date_paiement: e.target.value }))} className={INPUT} />
                                </div>
                                <div>
                                    <label htmlFor="paiement-reference" className={LABEL}>Référence</label>
                                    <input id="paiement-reference" name="reference" autoComplete="off" value={paiementForm.reference} onChange={e => setPaiementForm(p => ({ ...p, reference: e.target.value }))} className={INPUT} />
                                </div>
                                <div>
                                    <label htmlFor="paiement-notes" className={LABEL}>Notes</label>
                                    <input id="paiement-notes" name="notes" autoComplete="off" value={paiementForm.notes} onChange={e => setPaiementForm(p => ({ ...p, notes: e.target.value }))} className={INPUT} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <button type="button" onClick={savePaiement} disabled={savingPaiement} className="px-6 py-2 bg-[#eb0071] text-[#F5F5F0] text-xs font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 cursor-not-allowed">
                                    {savingPaiement ? 'Enregistrement…' : editingPaiementId ? 'Enregistrer les modifications' : 'Enregistrer'}
                                </button>
                                <button type="button" onClick={resetPaiementForm} className="px-4 py-2 text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}

                    {paiements.length === 0 ? (
                        <p className="text-sm text-[#F5F5F0]/30">Aucun paiement enregistré.</p>
                    ) : paiements.map(p => (
                        <div key={p.id} className="flex flex-col gap-2 py-2.5 border-b border-white/5 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="text-[#F5F5F0]/40 text-xs">
                                    {p.date_paiement ? new Date(p.date_paiement).toLocaleDateString('fr-FR') : '—'}
                                </span>
                                <span className="text-[#F5F5F0]/60">{MODE_LABELS[p.mode]}</span>
                                <span className="text-[#F5F5F0] font-medium">{p.montant} €</span>
                                {p.reference && <span className="text-xs text-[#F5F5F0]/30">{p.reference}</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`text-xs border px-2 py-0.5 ${STATUT_PAIEMENT_STYLES[p.statut]}`}>
                                    {STATUT_LABELS[p.statut]}
                                </span>
                                <button type="button" onClick={() => startEditPaiement(p)} className="text-xs text-[#eb0071] hover:underline">
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deletePaiement(p)}
                                    disabled={deletingPaiementId === p.id}
                                    className="text-xs text-red-400 hover:underline disabled:opacity-50"
                                >
                                    {deletingPaiementId === p.id ? 'Suppression…' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    ))}
                </Section>
            </div>
        </AdminLayout>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6 border border-white/10 p-4 sm:p-5">
            <h2 className="text-sm tracking-widest uppercase text-[#F5F5F0] border-b border-white/10 pb-2 mb-4">
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </div>
    )
}

function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null
    return (
        <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
            <span className="text-[#F5F5F0]/40">{label}</span>
            <span className="text-[#F5F5F0]/80 break-words">{value}</span>
        </div>
    )
}
