import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Paiement, Membre } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'

interface PaiementRow extends Paiement {
    membre_nom?: string
    membre_prenom?: string
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

export default function AdminPaiements() {
    const [rows, setRows] = useState<PaiementRow[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatut, setFilterStatut] = useState('')
    const [filterMode, setFilterMode] = useState('')

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        setLoading(true)
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
                        <label className="text-xs text-[#F5F5F0]/60 tracking-widest uppercase block mb-1">Statut</label>
                        <select
                            value={filterStatut}
                            onChange={e => setFilterStatut(e.target.value)}
                            className="bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-xs focus:outline-none focus:border-[#eb0071]"
                        >
                            <option value="">Tous</option>
                            <option value="paye">Payé</option>
                            <option value="partiel">Partiel</option>
                            <option value="en_attente">En attente</option>
                            <option value="echelonne">Échelonné</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-[#F5F5F0]/60 tracking-widest uppercase block mb-1">Mode</label>
                        <select
                            value={filterMode}
                            onChange={e => setFilterMode(e.target.value)}
                            className="bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-xs focus:outline-none focus:border-[#eb0071]"
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center text-[#F5F5F0]/30 py-16 text-sm">
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
