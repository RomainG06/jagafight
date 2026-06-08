import { useEffect, useState } from 'react'
import { supabase, type Preinscription } from '../lib/supabase'

const STATUS_OPTIONS = ['nouveau', 'contacté', 'traité', 'annulé']

const STATUS_STYLES: Record<string, string> = {
    nouveau: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    contacté: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    traité: 'bg-green-500/10 text-green-400 border-green-500/30',
    annulé: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function AdminDashboard() {
    const [rows, setRows] = useState<Preinscription[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data, error: fetchError } = await supabase
            .from('preinscriptions')
            .select('*')
            .order('created_at', { ascending: false })

        if (fetchError) {
            setError('Erreur lors du chargement des données.')
        } else {
            setRows(data ?? [])
        }
        setLoading(false)
    }

    async function updateStatus(id: string, status: string) {
        const { error: updateError } = await supabase
            .from('preinscriptions')
            .update({ status })
            .eq('id', id)

        if (!updateError) {
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
    }

    function formatDate(dateStr?: string) {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#F5F5F0]">
            {/* Header */}
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="font-title text-xl tracking-widest uppercase">Admin — Jaga Fight</h1>
                    <span className="text-xs text-[#F5F5F0]/40 border border-white/10 px-2 py-0.5">
                        {rows.length} préinscription{rows.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors tracking-widest uppercase"
                >
                    Déconnexion
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-4 py-3">
                        {error}
                    </p>
                )}

                {!loading && !error && rows.length === 0 && (
                    <p className="text-center text-[#F5F5F0]/40 py-20">Aucune préinscription pour le moment.</p>
                )}

                {!loading && rows.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-[#F5F5F0]/40 text-xs tracking-widest uppercase">
                                    <th className="text-left py-3 px-3 font-semibold">Date</th>
                                    <th className="text-left py-3 px-3 font-semibold">Prénom</th>
                                    <th className="text-left py-3 px-3 font-semibold">Nom</th>
                                    <th className="text-left py-3 px-3 font-semibold">Email</th>
                                    <th className="text-left py-3 px-3 font-semibold">Téléphone</th>
                                    <th className="text-left py-3 px-3 font-semibold">Âge</th>
                                    <th className="text-left py-3 px-3 font-semibold">Activités</th>
                                    <th className="text-left py-3 px-3 font-semibold">Message</th>
                                    <th className="text-left py-3 px-3 font-semibold">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                                    >
                                        <td className="py-3 px-3 text-[#F5F5F0]/50 whitespace-nowrap text-xs">
                                            {formatDate(row.created_at)}
                                        </td>
                                        <td className="py-3 px-3">{row.prenom}</td>
                                        <td className="py-3 px-3">{row.nom}</td>
                                        <td className="py-3 px-3">
                                            <a
                                                href={`mailto:${row.email}`}
                                                className="text-[#eb0071] hover:text-[#ff0096] transition-colors"
                                            >
                                                {row.email}
                                            </a>
                                        </td>
                                        <td className="py-3 px-3 text-[#F5F5F0]/70">{row.tel ?? '—'}</td>
                                        <td className="py-3 px-3 text-[#F5F5F0]/70 whitespace-nowrap">{row.age ?? '—'}</td>
                                        <td className="py-3 px-3">
                                            {row.activites && row.activites.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {row.activites.map((a) => (
                                                        <span
                                                            key={a}
                                                            className="text-xs border border-white/10 px-1.5 py-0.5 text-[#F5F5F0]/60"
                                                        >
                                                            {a}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-[#F5F5F0]/30">—</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-[#F5F5F0]/60 max-w-xs">
                                            <span className="line-clamp-2">{row.message ?? '—'}</span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <select
                                                value={row.status ?? 'nouveau'}
                                                onChange={(e) => row.id && updateStatus(row.id, e.target.value)}
                                                className={`text-xs border px-2 py-1 bg-transparent focus:outline-none cursor-pointer transition-colors ${STATUS_STYLES[row.status ?? 'nouveau'] ?? STATUS_STYLES['nouveau']}`}
                                            >
                                                {STATUS_OPTIONS.map((s) => (
                                                    <option key={s} value={s} className="bg-[#0a0a0a] text-[#F5F5F0]">
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
