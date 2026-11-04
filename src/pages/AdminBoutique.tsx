import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/layout/AdminLayout'
import {
    BOUTIQUE_BUCKET,
    DEFAULT_SIZES,
    fetchProduits,
    formatPrice,
    imageUrl,
    isExpired,
    shortRef,
    type Produit,
    type Reservation,
} from '../lib/boutique'

const INPUT = 'w-full bg-white/5 border border-white/10 text-[#F5F5F0] px-4 py-2.5 text-sm focus:border-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071] transition-colors'
const LABEL = 'block text-xs font-semibold tracking-widest uppercase text-[#F5F5F0]/60 mb-2'
const BTN_PRIMARY = 'px-6 py-2.5 bg-[#eb0071] text-[#F5F5F0] text-xs font-semibold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 rounded cursor-pointer'
const BTN_GHOST = 'text-xs px-4 py-2 border border-white/20 text-[#F5F5F0]/60 hover:text-[#F5F5F0] hover:border-white/40 transition-colors tracking-widest uppercase cursor-pointer'

type SizeRow = { taille: string; stock: string }
type FormState = { id?: string; nom: string; prix: string; description: string; actif: boolean; sizes: SizeRow[]; image_path: string | null }

const emptyForm = (): FormState => ({
    nom: '',
    prix: '',
    description: '',
    actif: true,
    sizes: DEFAULT_SIZES.map(taille => ({ taille, stock: '0' })),
    image_path: null,
})

type ResaFilter = 'en_cours' | 'expirees' | 'historique'

export default function AdminBoutique() {
    const [produits, setProduits] = useState<Produit[]>([])
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState<FormState | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState<ResaFilter>('en_cours')

    const fetchData = useCallback(async () => {
        setLoading(true)
        const [produitsResult, resaResult] = await Promise.allSettled([
            fetchProduits(),
            supabase.from('boutique_reservations').select('*').order('created_at', { ascending: false }).limit(200),
        ])
        if (produitsResult.status === 'fulfilled') setProduits(produitsResult.value)
        if (resaResult.status === 'fulfilled') setReservations((resaResult.value.data ?? []) as Reservation[])
        setLoading(false)
    }, [])

    useEffect(() => {
        // Chargement initial des données depuis Supabase (système externe).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()
    }, [fetchData])

    function editProduit(produit: Produit) {
        const existing = produit.boutique_variantes.map(v => ({ taille: v.taille, stock: String(v.stock) }))
        setForm({
            id: produit.id,
            nom: produit.nom,
            prix: (produit.prix_cents / 100).toString().replace('.', ','),
            description: produit.description ?? '',
            actif: produit.actif,
            sizes: existing.length ? existing : emptyForm().sizes,
            image_path: produit.image_path,
        })
        setImageFile(null)
        setError('')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault()
        if (!form) return
        setError('')

        const prixCents = Math.round(Number(form.prix.replace(',', '.')) * 100)
        if (!form.nom.trim()) { setError('Le nom est requis.'); return }
        if (!Number.isFinite(prixCents) || prixCents < 0) { setError('Le prix n’est pas valide.'); return }
        const sizes = form.sizes
            .map(s => ({ taille: s.taille.trim(), stock: Math.max(0, Math.floor(Number(s.stock) || 0)) }))
            .filter(s => s.taille)
        if (new Set(sizes.map(s => s.taille)).size !== sizes.length) { setError('Deux tailles portent le même nom.'); return }

        setSaving(true)
        try {
            const payload = { nom: form.nom.trim(), prix_cents: prixCents, description: form.description.trim() || null, actif: form.actif }
            let produitId = form.id
            if (produitId) {
                const { error: err } = await supabase.from('boutique_produits').update(payload).eq('id', produitId)
                if (err) throw err
            } else {
                const { data, error: err } = await supabase.from('boutique_produits').insert(payload).select('id').single()
                if (err) throw err
                produitId = data.id as string
            }

            if (imageFile) {
                const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
                const path = `produits/${produitId}/${Date.now()}.${extension}`
                const { error: uploadError } = await supabase.storage.from(BOUTIQUE_BUCKET).upload(path, imageFile, { contentType: imageFile.type })
                if (uploadError) throw new Error('La photo n’a pas pu être envoyée (JPG, PNG ou WebP, 5 Mo maximum).')
                const { error: err } = await supabase.from('boutique_produits').update({ image_path: path }).eq('id', produitId)
                if (err) throw err
                if (form.image_path) await supabase.storage.from(BOUTIQUE_BUCKET).remove([form.image_path])
            }

            // Tailles : mise à jour / création, puis suppression de celles retirées du formulaire.
            if (sizes.length) {
                const { error: err } = await supabase
                    .from('boutique_variantes')
                    .upsert(sizes.map((s, ordre) => ({ produit_id: produitId, taille: s.taille, stock: s.stock, ordre })), { onConflict: 'produit_id,taille' })
                if (err) throw err
            }
            const previous = produits.find(p => p.id === produitId)?.boutique_variantes ?? []
            const removed = previous.filter(v => !sizes.some(s => s.taille === v.taille)).map(v => v.id)
            if (removed.length) {
                const { error: err } = await supabase.from('boutique_variantes').delete().in('id', removed)
                if (err) throw err
            }

            setForm(null)
            setImageFile(null)
            await fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l’enregistrement.')
        } finally {
            setSaving(false)
        }
    }

    async function toggleActif(produit: Produit) {
        await supabase.from('boutique_produits').update({ actif: !produit.actif }).eq('id', produit.id)
        fetchData()
    }

    async function deleteProduit(produit: Produit) {
        if (!confirm(`Supprimer « ${produit.nom} » ? Les réservations passées restent dans l’historique.`)) return
        await supabase.from('boutique_produits').delete().eq('id', produit.id)
        if (produit.image_path) await supabase.storage.from(BOUTIQUE_BUCKET).remove([produit.image_path])
        fetchData()
    }

    async function markRetiree(resa: Reservation) {
        if (!confirm(`Confirmer que ${resa.prenom} a payé et retiré ${resa.quantite} × ${resa.produit_nom} (${resa.taille}) ? Le stock sera mis à jour.`)) return
        const { error: err } = await supabase.rpc('boutique_marquer_retiree', { p_reservation_id: resa.id })
        if (err) alert('Impossible de mettre à jour cette réservation.')
        fetchData()
    }

    async function cancelResa(resa: Reservation) {
        if (!confirm(`Annuler la réservation de ${resa.prenom} ?`)) return
        await supabase.from('boutique_reservations').update({ statut: 'annulee' }).eq('id', resa.id)
        fetchData()
    }

    const visibleResas = reservations.filter(r => {
        if (filter === 'en_cours') return r.statut === 'en_attente' && !isExpired(r)
        if (filter === 'expirees') return isExpired(r)
        return r.statut !== 'en_attente'
    })
    const enCoursCount = reservations.filter(r => r.statut === 'en_attente' && !isExpired(r)).length

    return (
        <AdminLayout>
            <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 space-y-10">
                {/* ─── Réservations ─── */}
                <section>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="font-title text-xl tracking-widest uppercase">
                            Réservations boutique {enCoursCount > 0 && <span className="ml-2 rounded bg-[#eb0071] px-2 py-0.5 text-sm">{enCoursCount}</span>}
                        </h1>
                        <div className="flex gap-2" role="tablist" aria-label="Filtrer les réservations">
                            {([['en_cours', 'En cours'], ['expirees', 'Expirées'], ['historique', 'Historique']] as const).map(([key, label]) => (
                                <button
                                    key={key}
                                    role="tab"
                                    aria-selected={filter === key}
                                    onClick={() => setFilter(key)}
                                    className={`text-xs px-3 py-1.5 tracking-widest uppercase cursor-pointer border ${filter === key ? 'border-[#eb0071] text-[#F5F5F0]' : 'border-white/10 text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? null : visibleResas.length === 0 ? (
                        <p className="border border-white/10 py-6 text-center text-sm text-[#F5F5F0]/30">Aucune réservation.</p>
                    ) : (
                        <ul className="space-y-2">
                            {visibleResas.map(r => (
                                <li key={r.id} className="border border-white/10 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div className="min-w-0 text-sm">
                                        <p className="text-[#F5F5F0]">
                                            {r.quantite} × {r.produit_nom} <span className="text-[#F5F5F0]/50">· taille {r.taille}</span>
                                            <span className="ml-2 text-[#eb0071]">{formatPrice(r.prix_cents * r.quantite)}</span>
                                        </p>
                                        <p className="mt-1 text-xs text-[#F5F5F0]/50">
                                            {r.prenom} · <a href={`tel:${r.telephone.replace(/[^0-9+]/g, '')}`} className="underline-offset-2 hover:underline">{r.telephone}</a>
                                            {' · réf. '}{shortRef(r.id)}
                                            {' · '}
                                            {r.statut === 'en_attente'
                                                ? `${isExpired(r) ? 'expirée le' : 'gardée jusqu’au'} ${new Date(r.expire_le).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}`
                                                : r.statut === 'retiree' ? 'retirée' : 'annulée'}
                                        </p>
                                    </div>
                                    {r.statut === 'en_attente' && (
                                        <div className="flex flex-wrap gap-3">
                                            <button onClick={() => markRetiree(r)} className="text-xs px-3 py-1.5 bg-green-500/15 text-green-300 border border-green-500/30 hover:bg-green-500/25 tracking-widest uppercase cursor-pointer">
                                                Payée & retirée
                                            </button>
                                            <button onClick={() => cancelResa(r)} className="text-xs text-red-400/60 hover:text-red-400 cursor-pointer">
                                                Annuler
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* ─── Produits ─── */}
                <section>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="font-title text-xl tracking-widest uppercase">Produits</h2>
                        {!form && (
                            <button onClick={() => { setForm(emptyForm()); setImageFile(null); setError('') }} className={BTN_GHOST}>
                                + Nouveau produit
                            </button>
                        )}
                    </div>

                    {form && (
                        <form onSubmit={handleSave} className="border border-white/10 p-5 mb-6 space-y-4">
                            <h3 className="text-xs tracking-widest uppercase text-[#F5F5F0]/40">{form.id ? 'Modifier le produit' : 'Nouveau produit'}</h3>
                            <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                                <div>
                                    <label htmlFor="produit-nom" className={LABEL}>Nom *</label>
                                    <input id="produit-nom" value={form.nom} maxLength={120} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex. : T-shirt Jaga Fight noir" className={INPUT} />
                                </div>
                                <div>
                                    <label htmlFor="produit-prix" className={LABEL}>Prix (€) *</label>
                                    <input id="produit-prix" inputMode="decimal" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} placeholder="25" className={INPUT} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="produit-description" className={LABEL}>Description</label>
                                <textarea id="produit-description" rows={3} maxLength={1000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Matière, coupe, couleur…" className={INPUT} />
                            </div>
                            <div>
                                <label htmlFor="produit-photo" className={LABEL}>Photo {form.image_path && '(laisser vide pour garder l’actuelle)'}</label>
                                <div className="flex items-center gap-4">
                                    {(imageFile || form.image_path) && (
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.image_path) ?? undefined}
                                            alt=""
                                            className="h-20 w-20 shrink-0 object-cover border border-white/10"
                                        />
                                    )}
                                    <input id="produit-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="text-xs text-[#F5F5F0]/60 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-[#F5F5F0]" />
                                </div>
                            </div>

                            <fieldset>
                                <legend className={LABEL}>Tailles et stock</legend>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                                    {form.sizes.map((size, index) => (
                                        <div key={index} className="flex items-center gap-1 border border-white/10 p-2">
                                            <input
                                                aria-label="Taille"
                                                value={size.taille}
                                                maxLength={20}
                                                onChange={e => setForm({ ...form, sizes: form.sizes.map((s, i) => i === index ? { ...s, taille: e.target.value } : s) })}
                                                className="w-12 bg-transparent text-sm font-semibold text-[#F5F5F0] focus:outline-none"
                                            />
                                            <input
                                                aria-label={`Stock ${size.taille}`}
                                                type="number"
                                                min={0}
                                                value={size.stock}
                                                onChange={e => setForm({ ...form, sizes: form.sizes.map((s, i) => i === index ? { ...s, stock: e.target.value } : s) })}
                                                className="w-14 bg-white/5 px-2 py-1 text-sm text-[#F5F5F0]"
                                            />
                                            <button type="button" aria-label={`Retirer la taille ${size.taille}`} onClick={() => setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) })} className="ml-auto text-[#F5F5F0]/30 hover:text-red-400 cursor-pointer">×</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => setForm({ ...form, sizes: [...form.sizes, { taille: '', stock: '0' }] })} className="mt-2 text-xs text-[#eb0071] cursor-pointer">
                                    + Ajouter une taille
                                </button>
                                <p className="mt-1 text-xs text-[#F5F5F0]/30">Indiquez le stock réellement disponible au club. Il diminue automatiquement quand une réservation est marquée « payée & retirée ».</p>
                            </fieldset>

                            <label className="flex items-center gap-2 text-sm text-[#F5F5F0]/80">
                                <input type="checkbox" checked={form.actif} onChange={e => setForm({ ...form, actif: e.target.checked })} />
                                Visible sur le site
                            </label>

                            {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                                <button type="button" onClick={() => setForm(null)} className="px-4 py-2 text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] cursor-pointer">Annuler</button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[#eb0071] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : produits.length === 0 ? (
                        <p className="text-sm text-[#F5F5F0]/30 py-8 text-center">Aucun produit. Ajoutez votre premier t-shirt.</p>
                    ) : (
                        <ul className="space-y-3">
                            {produits.map(p => (
                                <li key={p.id} className="border border-white/10 p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                                    {p.image_path ? (
                                        <img src={imageUrl(p.image_path) ?? undefined} alt="" className="h-20 w-20 shrink-0 object-cover" />
                                    ) : (
                                        <div className="h-20 w-20 shrink-0 bg-white/5" aria-hidden="true" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-[#F5F5F0]">
                                            {p.nom} <span className="ml-2 text-[#eb0071]">{formatPrice(p.prix_cents)}</span>
                                            {!p.actif && <span className="ml-2 text-xs text-[#F5F5F0]/40 border border-white/10 px-1.5">masqué</span>}
                                        </p>
                                        <p className="mt-1 text-xs text-[#F5F5F0]/50">
                                            {p.boutique_variantes.length
                                                ? p.boutique_variantes.map(v => `${v.taille} : ${v.stock}`).join(' · ')
                                                : 'Aucune taille'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => editProduit(p)} className="text-xs text-[#F5F5F0]/60 hover:text-[#F5F5F0] tracking-widest uppercase cursor-pointer">Modifier</button>
                                        <button onClick={() => toggleActif(p)} className="text-xs text-[#F5F5F0]/40 hover:text-[#F5F5F0] tracking-widest uppercase cursor-pointer">{p.actif ? 'Masquer' : 'Afficher'}</button>
                                        <button onClick={() => deleteProduit(p)} className="text-xs text-red-400/50 hover:text-red-400 cursor-pointer">Supprimer</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AdminLayout>
    )
}
