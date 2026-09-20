import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Saison } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'

const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#eb0071] transition-colors'
const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'

export default function AdminSaisons() {
    const [saisons, setSaisons] = useState<Saison[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ label: '', date_debut: '', date_fin: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        setLoading(true)
        const { data } = await supabase.from('saisons').select('*').order('date_debut', { ascending: false })
        setSaisons((data ?? []) as Saison[])
        setLoading(false)
    }

    async function handleCreate(e: FormEvent) {
        e.preventDefault()
        setError('')
        if (!form.label) { setError('Le libellé est requis.'); return }
        setSaving(true)
        const { error: err } = await supabase.from('saisons').insert({
            label: form.label,
            date_debut: form.date_debut || undefined,
            date_fin: form.date_fin || undefined,
            active: false,
        })
        setSaving(false)
        if (err) { setError('Erreur lors de la création.'); return }
        setForm({ label: '', date_debut: '', date_fin: '' })
        setShowForm(false)
        fetchData()
    }

    async function toggleActive(saison: Saison) {
        if (!saison.active) {
            // Désactiver toutes les autres saisons avant d'activer celle-ci
            await supabase.from('saisons').update({ active: false }).neq('id', saison.id)
        }
        await supabase.from('saisons').update({ active: !saison.active }).eq('id', saison.id)
        fetchData()
    }

    async function deleteSaison(id: string) {
        if (!confirm('Supprimer cette saison ?')) return
        await supabase.from('saisons').delete().eq('id', id)
        fetchData()
    }

    return (
        <AdminLayout>
            <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-6">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="font-title text-xl tracking-widest uppercase">Saisons</h1>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="w-full sm:w-auto text-xs px-4 py-2 border border-white/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/40 transition-colors tracking-widest uppercase cursor-pointer"
                    >
                        + Nouvelle saison
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleCreate} className="border border-white/10 p-5 mb-6 space-y-4">
                        <h2 className="text-xs tracking-widest uppercase text-[#F5F5F0]/40">Nouvelle saison</h2>
                        <div>
                            <label className={LABEL}>Libellé *</label>
                            <input
                                value={form.label}
                                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                                placeholder="ex: 2026-2027"
                                className={INPUT}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={LABEL}>Date de début</label>
                                <input type="date" value={form.date_debut} onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))} className={INPUT} />
                            </div>
                            <div>
                                <label className={LABEL}>Date de fin</label>
                                <input type="date" value={form.date_fin} onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))} className={INPUT} />
                            </div>
                        </div>
                        {error && <p className="text-xs text-red-400">{error}</p>}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#eb0071] text-[#F5F5F0] text-xs font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 rounded cursor-pointer">
                                {saving ? 'Création…' : 'Créer'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer">
                                Annuler
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : saisons.length === 0 ? (
                    <p className="text-sm text-[#F5F5F0]/30 py-8 text-center">Aucune saison créée.</p>
                ) : (
                    <div className="space-y-3">
                        {saisons.map(s => (
                            <div key={s.id} className="border border-white/10 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <span className="text-sm text-[#F5F5F0] break-words">{s.label}</span>
                                    {(s.date_debut || s.date_fin) && (
                                        <span className="mt-1 block text-xs text-[#F5F5F0]/30 sm:mt-0 sm:ml-3 sm:inline">
                                            {s.date_debut ? new Date(s.date_debut).toLocaleDateString('fr-FR') : '?'}
                                            {' → '}
                                            {s.date_fin ? new Date(s.date_fin).toLocaleDateString('fr-FR') : '?'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                                    {s.active && (
                                        <span className="text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-0.5">
                                            Active
                                        </span>
                                    )}
                                    <button
                                        onClick={() => toggleActive(s)}
                                        className="text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-colors tracking-widest uppercase cursor-pointer"
                                    >
                                        {s.active ? 'Désactiver' : 'Activer'}
                                    </button>
                                    <button
                                        onClick={() => deleteSaison(s.id)}
                                        className="text-xs text-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
