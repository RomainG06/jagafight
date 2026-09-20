import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Membre, Document } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'

interface MembreRow extends Membre {
    documents?: Document[]
    disciplines?: string[]
    statut_pratique?: string
    certif_date_validite?: string | null
    statut_paiement?: string
}

const LABEL_INPUT = 'text-xs text-[#F5F5F0]/60 tracking-widest uppercase block mb-1'
const SELECT = 'bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-xs focus:outline-none focus:border-[#eb0071]'

function certifStatus(dateStr?: string | null): 'valide' | 'expire-bientot' | 'expire' | 'absent' {
    if (!dateStr) return 'absent'
    const d = new Date(dateStr)
    const days = (d.getTime() - Date.now()) / 86400000
    if (days > 30) return 'valide'
    if (days > 0) return 'expire-bientot'
    return 'expire'
}

const CERTIF_BADGE: Record<string, string> = {
    valide: 'text-green-400 bg-green-500/10 border-green-500/20',
    'expire-bientot': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    expire: 'text-red-400 bg-red-500/10 border-red-500/20',
    absent: 'text-[#F5F5F0]/30 bg-white/5 border-white/10',
}
const CERTIF_LABEL: Record<string, string> = {
    valide: 'Valide', 'expire-bientot': 'Expire bientôt', expire: 'Expiré', absent: 'Absent',
}

export default function AdminMembres() {
    const [rows, setRows] = useState<MembreRow[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCertif, setFilterCertif] = useState('')
    const [filterStatut, setFilterStatut] = useState('')

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        setLoading(true)
        const [membresRes, adhesionsRes, docsRes] = await Promise.all([
            supabase.from('membres').select('*').order('created_at', { ascending: false }),
            supabase.from('adhesions').select('membre_id, disciplines, statut_pratique').order('created_at', { ascending: false }),
            supabase.from('documents').select('membre_id, type, date_validite'),
        ])

        const adhesionsByMembre: Record<string, { disciplines: string[]; statut: string }> = {}
        for (const a of adhesionsRes.data ?? []) {
            if (!adhesionsByMembre[a.membre_id]) {
                adhesionsByMembre[a.membre_id] = { disciplines: a.disciplines ?? [], statut: a.statut_pratique ?? '' }
            }
        }
        const certifByMembre: Record<string, string | null> = {}
        for (const d of docsRes.data ?? []) {
            if (d.type === 'certificat_medical') certifByMembre[d.membre_id] = d.date_validite
        }

        const enriched: MembreRow[] = (membresRes.data ?? []).map((m: Membre) => ({
            ...m,
            disciplines: adhesionsByMembre[m.id!]?.disciplines ?? [],
            statut_pratique: adhesionsByMembre[m.id!]?.statut ?? '',
            certif_date_validite: certifByMembre[m.id!] ?? null,
        }))

        setRows(enriched)
        setLoading(false)
    }

    function exportCSV() {
        const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Disciplines', 'Statut', 'Certif', 'Profil complet']
        const lines = filtered.map(r => [
            r.nom, r.prenom, r.email, r.telephone ?? '',
            (r.disciplines ?? []).join(' / '),
            r.statut_pratique ?? '',
            certifStatus(r.certif_date_validite),
            r.profil_complet ? 'Oui' : 'Non',
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        const csv = [headers.join(','), ...lines].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `adherents-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
    }

    const filtered = rows.filter(r => {
        const q = search.toLowerCase()
        const matchSearch = !q || [r.nom, r.prenom, r.email].some(v => v?.toLowerCase().includes(q))
        const matchCertif = !filterCertif || certifStatus(r.certif_date_validite) === filterCertif
        const matchStatut = !filterStatut || r.statut_pratique === filterStatut
        return matchSearch && matchCertif && matchStatut
    })

    return (
        <AdminLayout>
            <div className="px-4 py-6 sm:px-6">
                <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="font-title text-xl tracking-widest uppercase">
                        Adhérents
                        <span className="ml-3 text-xs text-[#F5F5F0]/40 border border-white/10 px-2 py-0.5 font-sans">
                            {filtered.length}
                        </span>
                    </h1>
                    <button
                        onClick={exportCSV}
                        className="w-full sm:w-auto text-xs px-4 py-2 border border-white/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/40 transition-colors tracking-widest uppercase cursor-pointer"
                    >
                        Exporter CSV
                    </button>
                </div>

                {/* Filtres */}
                <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:flex-wrap sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <label className={LABEL_INPUT}>Recherche</label>
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Nom, prénom, email…"
                            className="w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#eb0071] sm:w-56"
                        />
                    </div>
                    <div>
                        <label className={LABEL_INPUT}>Certificat</label>
                        <select value={filterCertif} onChange={e => setFilterCertif(e.target.value)} className={`w-full sm:w-auto ${SELECT}`}>
                            <option value="">Tous</option>
                            <option value="valide">Valide</option>
                            <option value="expire-bientot">Expire bientôt</option>
                            <option value="expire">Expiré</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>
                    <div>
                        <label className={LABEL_INPUT}>Statut</label>
                        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} className={`w-full sm:w-auto ${SELECT}`}>
                            <option value="">Tous</option>
                            <option value="loisir">Loisir</option>
                            <option value="competiteur">Compétiteur</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ── Mobile : cartes cliquables ── */}
                        <div className="block md:hidden space-y-2">
                            {filtered.length === 0 ? (
                                <p className="text-center text-[#F5F5F0]/30 py-16 text-sm">Aucun adhérent trouvé.</p>
                            ) : filtered.map(row => {
                                const cs = certifStatus(row.certif_date_validite)
                                return (
                                    <a
                                        key={row.id}
                                        href={`/admin/membres/${row.id}`}
                                        className="flex items-center justify-between gap-3 border border-white/10 px-4 py-3 hover:border-white/25 hover:bg-white/2 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#F5F5F0] font-medium truncate">
                                                    {row.nom} {row.prenom}
                                                </span>
                                                {row.profil_complet && (
                                                    <span className="text-xs text-green-400 flex-shrink-0">✓</span>
                                                )}
                                            </div>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                                <span className="text-xs text-[#F5F5F0]/40 truncate">{row.email}</span>
                                                {row.statut_pratique && (
                                                    <span className="text-xs text-[#F5F5F0]/40 capitalize">{row.statut_pratique}</span>
                                                )}
                                                {(row.disciplines ?? []).length > 0 && (
                                                    <span className="text-xs text-[#F5F5F0]/30">{(row.disciplines ?? []).join(', ')}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span className={`text-xs border px-2 py-0.5 ${CERTIF_BADGE[cs]}`}>
                                                {CERTIF_LABEL[cs]}
                                            </span>
                                            <span className="text-xs text-[#eb0071]">→</span>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>

                        {/* ── Desktop : tableau ── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[#F5F5F0]/40 text-xs tracking-widest uppercase">
                                        <th className="text-left py-3 px-3">Nom</th>
                                        <th className="text-left py-3 px-3">Email</th>
                                        <th className="text-left py-3 px-3">Disciplines</th>
                                        <th className="text-left py-3 px-3">Statut</th>
                                        <th className="text-left py-3 px-3">Certificat</th>
                                        <th className="text-left py-3 px-3">Dossier</th>
                                        <th className="text-left py-3 px-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center text-[#F5F5F0]/30 py-16 text-sm">
                                                Aucun adhérent trouvé.
                                            </td>
                                        </tr>
                                    ) : filtered.map(row => {
                                        const cs = certifStatus(row.certif_date_validite)
                                        return (
                                            <tr key={row.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                                <td className="py-3 px-3">
                                                    <span className="text-[#F5F5F0]">{row.nom} {row.prenom}</span>
                                                </td>
                                                <td className="py-3 px-3 text-[#F5F5F0]/60">
                                                    <a href={`mailto:${row.email}`} className="hover:text-[#eb0071] transition-colors">
                                                        {row.email}
                                                    </a>
                                                </td>
                                                <td className="py-3 px-3 text-[#F5F5F0]/60 text-xs">
                                                    {(row.disciplines ?? []).join(', ') || '—'}
                                                </td>
                                                <td className="py-3 px-3">
                                                    {row.statut_pratique
                                                        ? <span className="text-xs capitalize text-[#F5F5F0]/60">{row.statut_pratique}</span>
                                                        : <span className="text-[#F5F5F0]/20">—</span>}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className={`text-xs border px-2 py-0.5 ${CERTIF_BADGE[cs]}`}>
                                                        {CERTIF_LABEL[cs]}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    {row.profil_complet
                                                        ? <span className="text-xs text-green-400">✓ Complet</span>
                                                        : <span className="text-xs text-[#F5F5F0]/30">En cours</span>}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <a
                                                        href={`/admin/membres/${row.id}`}
                                                        className="text-xs text-[#eb0071] hover:underline"
                                                    >
                                                        Voir fiche →
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}
