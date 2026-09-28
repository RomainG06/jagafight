import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Paiement, Membre } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'

interface PaiementRow extends Paiement {
    membre_nom?: string
    membre_prenom?: string
}

interface PaiementForm {
    mode: Paiement['mode']
    montant: string
    statut: Paiement['statut']
    date_paiement: string
    reference: string
    notes: string
}

const MODE_LABELS: Record<string, string> = {
    especes: 'Espèces', cheque: 'Chèque', cb: 'CB', virement: 'Virement',
}
const STATUT_STYLES: Record<string, string> = {
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

export default function AdminPaiements() {
    const [rows, setRows] = useState<PaiementRow[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatut, setFilterStatut] = useState('')
    const [filterMode, setFilterMode] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [error, setError] = useState('')
    const [form, setForm] = useState<PaiementForm>({
        mode: 'especes', montant: '', statut: 'en_attente',
        date_paiement: '', reference: '', notes: '',
    })

    async function fetchData() {
        const [paRes, mRes] = await Promise.all([
            supabase.from('paiements').select('*').order('created_at', { ascending: false }),
            supabase.from('membres').select('id, nom, prenom'),
        ])
        const membresMap: Record<string, { nom: string; prenom: string }> = {}
        for (const m of (mRes.data ?? []) as Membre[]) {
            if (m.id) membresMap[m.id] = { nom: m.nom, prenom: m.prenom }
        }
        const enriched: PaiementRow[] = (paRes.data ?? []).map((p: Paiement) => ({
            ...p,
            membre_nom: membresMap[p.membre_id]?.nom,
            membre_prenom: membresMap[p.membre_id]?.prenom,
        }))
        setRows(enriched)
        setLoading(false)
    }

    // Fetching remote records is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void fetchData() }, [])

    function startEdit(paiement: PaiementRow) {
        if (!paiement.id) return
        setEditingId(paiement.id)
        setForm({
            mode: paiement.mode,
            montant: String(paiement.montant),
            statut: paiement.statut,
            date_paiement: paiement.date_paiement?.slice(0, 10) ?? '',
            reference: paiement.reference ?? '',
            notes: paiement.notes ?? '',
        })
        setError('')
        setFeedback('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function cancelEdit() {
        setEditingId(null)
        setError('')
    }

    async function updatePaiement() {
        if (!editingId) return
        const montant = Number(form.montant)
        if (!Number.isFinite(montant) || montant <= 0) {
            setError('Le montant doit être supérieur à 0.')
            return
        }

        setSaving(true)
        setError('')
        const { data, error: updateError } = await supabase
            .from('paiements')
            .update({
                mode: form.mode,
                montant,
                statut: form.statut,
                date_paiement: form.date_paiement || null,
                reference: form.reference.trim() || null,
                notes: form.notes.trim() || null,
            })
            .eq('id', editingId)
            .select('id')

        setSaving(false)
        if (updateError || !data?.length) {
            setError(updateError?.message ?? 'Le paiement n’a pas pu être modifié. Vérifiez les autorisations RLS.')
            return
        }

        setEditingId(null)
        setFeedback('Paiement modifié.')
        await fetchData()
    }

    async function deletePaiement(paiement: PaiementRow) {
        if (!paiement.id) return
        const confirmed = window.confirm(
            `Supprimer définitivement le paiement de ${paiement.montant} € de ${paiement.membre_prenom ?? ''} ${paiement.membre_nom ?? ''} ?`,
        )
        if (!confirmed) return

        setDeletingId(paiement.id)
        setError('')
        const { data, error: deleteError } = await supabase
            .from('paiements')
            .delete()
            .eq('id', paiement.id)
            .select('id')

        setDeletingId(null)
        if (deleteError || !data?.length) {
            setError(deleteError?.message ?? 'Le paiement n’a pas pu être supprimé. Vérifiez les autorisations RLS.')
            return
        }

        if (editingId === paiement.id) setEditingId(null)
        setFeedback('Paiement supprimé.')
        await fetchData()
    }

    const filtered = rows.filter(r => {
        const matchStatut = !filterStatut || r.statut === filterStatut
        const matchMode = !filterMode || r.mode === filterMode
        return matchStatut && matchMode
    })

    const totalEncaisse = rows.filter(r => r.statut === 'paye').reduce((s, r) => s + r.montant, 0)
    const totalAttente = rows.filter(r => r.statut === 'en_attente' || r.statut === 'partiel').reduce((s, r) => s + r.montant, 0)

    return (
        <AdminLayout>
            <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h1 className="font-title text-xl tracking-widest uppercase">Paiements</h1>
                </div>

                {feedback && (
                    <p role="status" className="mb-4 border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                        {feedback}
                    </p>
                )}
                {error && (
                    <p role="alert" className="mb-4 border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {editingId && (
                    <section aria-labelledby="edit-payment-title" className="mb-6 border border-[#eb0071]/40 bg-[#eb0071]/5 p-4 sm:p-5">
                        <h2 id="edit-payment-title" className="mb-4 text-sm uppercase tracking-widest text-[#F5F5F0]">
                            Modifier le paiement
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label htmlFor="edit-paiement-mode" className={LABEL}>Mode</label>
                                <select id="edit-paiement-mode" value={form.mode} onChange={e => setForm(current => ({ ...current, mode: e.target.value as Paiement['mode'] }))} className={SELECT}>
                                    <option value="especes">Espèces</option>
                                    <option value="cheque">Chèque</option>
                                    <option value="cb">CB</option>
                                    <option value="virement">Virement</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="edit-paiement-montant" className={LABEL}>Montant (€)</label>
                                <input id="edit-paiement-montant" type="number" inputMode="decimal" min="0.01" step="0.01" value={form.montant} onChange={e => setForm(current => ({ ...current, montant: e.target.value }))} className={INPUT} />
                            </div>
                            <div>
                                <label htmlFor="edit-paiement-statut" className={LABEL}>Statut</label>
                                <select id="edit-paiement-statut" value={form.statut} onChange={e => setForm(current => ({ ...current, statut: e.target.value as Paiement['statut'] }))} className={SELECT}>
                                    <option value="paye">Payé</option>
                                    <option value="partiel">Partiel</option>
                                    <option value="en_attente">En attente</option>
                                    <option value="echelonne">Échelonné</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="edit-paiement-date" className={LABEL}>Date</label>
                                <input id="edit-paiement-date" type="date" value={form.date_paiement} onChange={e => setForm(current => ({ ...current, date_paiement: e.target.value }))} className={INPUT} />
                            </div>
                            <div>
                                <label htmlFor="edit-paiement-reference" className={LABEL}>Référence</label>
                                <input id="edit-paiement-reference" autoComplete="off" value={form.reference} onChange={e => setForm(current => ({ ...current, reference: e.target.value }))} className={INPUT} />
                            </div>
                            <div>
                                <label htmlFor="edit-paiement-notes" className={LABEL}>Notes</label>
                                <input id="edit-paiement-notes" autoComplete="off" value={form.notes} onChange={e => setForm(current => ({ ...current, notes: e.target.value }))} className={INPUT} />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <button type="button" onClick={updatePaiement} disabled={saving} className="bg-[#eb0071] px-6 py-2 text-xs font-semibold uppercase tracking-widest text-[#F5F5F0] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                                {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
                            </button>
                            <button type="button" onClick={cancelEdit} className="px-4 py-2 text-xs text-[#F5F5F0]/50 hover:text-[#F5F5F0]">
                                Annuler
                            </button>
                        </div>
                    </section>
                )}

                {/* Agrégats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="border border-white/10 px-4 py-3">
                        <p className="text-xs text-[#F5F5F0]/40 tracking-widest uppercase mb-1">Total encaissé</p>
                        <p className="text-xl font-title text-green-400">{totalEncaisse.toFixed(2)} €</p>
                    </div>
                    <div className="border border-white/10 px-4 py-3">
                        <p className="text-xs text-[#F5F5F0]/40 tracking-widest uppercase mb-1">En attente</p>
                        <p className="text-xl font-title text-amber-400">{totalAttente.toFixed(2)} €</p>
                    </div>
                    <div className="border border-white/10 px-4 py-3">
                        <p className="text-xs text-[#F5F5F0]/40 tracking-widest uppercase mb-1">Total paiements</p>
                        <p className="text-xl font-title text-[#F5F5F0]">{rows.length}</p>
                    </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div>
                        <label htmlFor="paiements-statut" className="text-xs text-[#F5F5F0]/60 tracking-widest uppercase block mb-1">Statut</label>
                        <select
                            id="paiements-statut"
                            value={filterStatut}
                            onChange={e => setFilterStatut(e.target.value)}
                            className="bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-xs focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071]"
                        >
                            <option value="">Tous</option>
                            <option value="paye">Payé</option>
                            <option value="partiel">Partiel</option>
                            <option value="en_attente">En attente</option>
                            <option value="echelonne">Échelonné</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="paiements-mode" className="text-xs text-[#F5F5F0]/60 tracking-widest uppercase block mb-1">Mode</label>
                        <select
                            id="paiements-mode"
                            value={filterMode}
                            onChange={e => setFilterMode(e.target.value)}
                            className="bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-xs focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071]"
                        >
                            <option value="">Tous</option>
                            <option value="especes">Espèces</option>
                            <option value="cheque">Chèque</option>
                            <option value="cb">CB</option>
                            <option value="virement">Virement</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="md:hidden space-y-3">
                            {filtered.length === 0 ? (
                                <div className="text-center text-[#F5F5F0]/30 py-16 text-sm border border-white/10">
                                    Aucun paiement.
                                </div>
                            ) : filtered.map(p => (
                                <article key={p.id} className="border border-white/10 bg-white/[0.02] p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] tracking-widest uppercase text-[#F5F5F0]/40">Date</p>
                                            <p className="text-sm text-[#F5F5F0]/70">
                                                {p.date_paiement ? new Date(p.date_paiement).toLocaleDateString('fr-FR') : '—'}
                                            </p>
                                        </div>
                                        <span className={`text-xs border px-2 py-0.5 ${STATUT_STYLES[p.statut]}`}>
                                            {STATUT_LABELS[p.statut]}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-[10px] tracking-widest uppercase text-[#F5F5F0]/40 mb-1">Adhérent</p>
                                        <a href={`/admin/membres/${p.membre_id}`} className="text-[#F5F5F0] hover:text-[#eb0071] transition-colors text-sm">
                                            {p.membre_nom} {p.membre_prenom}
                                        </a>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-[10px] tracking-widest uppercase text-[#F5F5F0]/40 mb-1">Mode</p>
                                            <p className="text-sm text-[#F5F5F0]/60">{MODE_LABELS[p.mode]}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] tracking-widest uppercase text-[#F5F5F0]/40 mb-1">Montant</p>
                                            <p className="text-sm text-[#F5F5F0] font-medium">{p.montant} €</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] tracking-widest uppercase text-[#F5F5F0]/40 mb-1">Référence</p>
                                        <p className="text-xs text-[#F5F5F0]/30">{p.reference ?? '—'}</p>
                                    </div>
                                    <div className="flex items-center gap-4 border-t border-white/5 pt-3">
                                        <button type="button" onClick={() => startEdit(p)} className="text-xs text-[#eb0071] hover:underline">
                                            Modifier
                                        </button>
                                        <button type="button" onClick={() => deletePaiement(p)} disabled={deletingId === p.id} className="text-xs text-red-400 hover:underline disabled:opacity-50">
                                            {deletingId === p.id ? 'Suppression…' : 'Supprimer'}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[#F5F5F0]/40 text-xs tracking-widest uppercase">
                                        <th className="text-left py-3 px-3">Date</th>
                                        <th className="text-left py-3 px-3">Adhérent</th>
                                        <th className="text-left py-3 px-3">Mode</th>
                                        <th className="text-left py-3 px-3">Montant</th>
                                        <th className="text-left py-3 px-3">Statut</th>
                                        <th className="text-left py-3 px-3">Référence</th>
                                        <th className="text-right py-3 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center text-[#F5F5F0]/30 py-16 text-sm">
                                                Aucun paiement.
                                            </td>
                                        </tr>
                                    ) : filtered.map(p => (
                                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                            <td className="py-3 px-3 text-[#F5F5F0]/40 text-xs">
                                                {p.date_paiement ? new Date(p.date_paiement).toLocaleDateString('fr-FR') : '—'}
                                            </td>
                                            <td className="py-3 px-3">
                                                <a href={`/admin/membres/${p.membre_id}`} className="text-[#F5F5F0] hover:text-[#eb0071] transition-colors">
                                                    {p.membre_nom} {p.membre_prenom}
                                                </a>
                                            </td>
                                            <td className="py-3 px-3 text-[#F5F5F0]/60">{MODE_LABELS[p.mode]}</td>
                                            <td className="py-3 px-3 text-[#F5F5F0] font-medium">{p.montant} €</td>
                                            <td className="py-3 px-3">
                                                <span className={`text-xs border px-2 py-0.5 ${STATUT_STYLES[p.statut]}`}>
                                                    {STATUT_LABELS[p.statut]}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-[#F5F5F0]/30 text-xs">{p.reference ?? '—'}</td>
                                            <td className="py-3 px-3">
                                                <div className="flex justify-end gap-3">
                                                    <button type="button" onClick={() => startEdit(p)} className="text-xs text-[#eb0071] hover:underline">
                                                        Modifier
                                                    </button>
                                                    <button type="button" onClick={() => deletePaiement(p)} disabled={deletingId === p.id} className="text-xs text-red-400 hover:underline disabled:opacity-50">
                                                        {deletingId === p.id ? 'Suppression…' : 'Supprimer'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}
