import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { MessageCircle, X } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import { SITE_URL, CLUB_ADDRESS } from '../data/club'
import { whatsappUrl } from '../data/contact'
import {
    RESERVATION_HOURS,
    fetchDisponibilites,
    fetchProduits,
    formatPrice,
    imageUrl,
    reserver,
    shortRef,
    type Produit,
    type Variante,
} from '../lib/boutique'

const PAGE_URL = `${SITE_URL}/boutique`
const TITLE = 'Boutique Jaga Fight : t-shirts du club | Saint-Laurent-du-Var'
const DESCRIPTION = 'Les t-shirts Jaga Fight : réservez en ligne votre taille, elle est gardée 48 h, puis payez et récupérez-la directement au club à Saint-Laurent-du-Var.'

const steps = [
    { title: 'Réservez en ligne', text: 'Choisissez votre modèle et votre taille, laissez votre prénom et votre téléphone.' },
    { title: `Gardé ${RESERVATION_HOURS} h`, text: 'Votre article est mis de côté pour vous pendant 48 heures.' },
    { title: 'Payez au club', text: `Réglez et récupérez-le sur place, au ${CLUB_ADDRESS.street}.` },
]

type Selection = { produit: Produit; variante: Variante }
type Confirmation = { ref: string; expireLe: Date; message: string }

export default function Boutique() {
    const [produits, setProduits] = useState<Produit[] | null>(null)
    const [dispo, setDispo] = useState<Map<string, number>>(new Map())
    const [loadError, setLoadError] = useState(false)
    const [selection, setSelection] = useState<Selection | null>(null)

    const load = useCallback(async () => {
        try {
            const [items, availability] = await Promise.all([fetchProduits(), fetchDisponibilites()])
            setProduits(items)
            setDispo(availability)
            setLoadError(false)
        } catch {
            setLoadError(true)
            setProduits([])
        }
    }, [])

    useEffect(() => {
        // Catalogue chargé côté navigateur : il change sans redéploiement du site.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load()
    }, [load])

    return (
        <>
            <Breadcrumb items={[{ name: 'Boutique', url: PAGE_URL }]} />
            <Helmet>
                <title>{TITLE}</title>
                <meta name="description" content={DESCRIPTION} />
                <link rel="canonical" href={PAGE_URL} />
                <meta property="og:title" content={TITLE} />
                <meta property="og:description" content={DESCRIPTION} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.24),transparent_46%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Réservation en ligne · paiement au club</p>
                    <h1 className="mt-4 font-title text-6xl leading-[0.9] text-[#F5F5F0] sm:text-7xl lg:text-8xl">BOUTIQUE</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg">
                        Portez les couleurs du club. Réservez votre t-shirt Jaga Fight en ligne, payez et récupérez-le au club.
                    </p>
                </div>
            </header>

            <div className="bg-[#0a0a0a] py-12 sm:py-16">
                <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <ol className="grid gap-4 sm:grid-cols-3">
                        {steps.map((step, index) => (
                            <li key={step.title} className="flex gap-4 border border-white/10 bg-[#0d0d0d] p-5">
                                <span className="font-title text-3xl leading-none text-[#eb0071]">0{index + 1}</span>
                                <div>
                                    <h2 className="text-sm uppercase tracking-wide text-[#F5F5F0]">{step.title}</h2>
                                    <p className="mt-1 text-sm leading-relaxed text-[#F5F5F0]/60">{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <section aria-labelledby="produits-title">
                        <h2 id="produits-title" className="sr-only">Produits</h2>
                        {produits === null ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Chargement des produits">
                                {[0, 1, 2].map(i => <div key={i} className="aspect-[4/5] animate-pulse bg-white/5" />)}
                            </div>
                        ) : loadError ? (
                            <EmptyState text="La boutique n’a pas pu être chargée. Réessayez dans un instant ou contactez-nous." />
                        ) : produits.length === 0 ? (
                            <EmptyState text="Les t-shirts arrivent bientôt. Écrivez-nous pour être prévenu dès qu’ils sont disponibles." />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {produits.map(produit => (
                                    <ProductCard key={produit.id} produit={produit} dispo={dispo} onReserve={variante => setSelection({ produit, variante })} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {selection && (
                <ReservationDialog
                    selection={selection}
                    disponible={dispo.get(selection.variante.id) ?? 0}
                    onClose={() => setSelection(null)}
                    onReserved={load}
                />
            )}
        </>
    )
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="border border-white/10 bg-[#0d0d0d] px-6 py-12 text-center">
            <p className="mx-auto max-w-md text-[#F5F5F0]/70">{text}</p>
            <a
                href={whatsappUrl('Bonjour Jaga Fight, je suis intéressé(e) par les t-shirts du club.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded border border-white/30 px-6 py-3 text-sm text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071]"
            >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Nous écrire sur WhatsApp
            </a>
        </div>
    )
}

function ProductCard({ produit, dispo, onReserve }: { produit: Produit; dispo: Map<string, number>; onReserve: (variante: Variante) => void }) {
    const firstAvailable = produit.boutique_variantes.find(v => (dispo.get(v.id) ?? 0) > 0)
    const [selectedId, setSelectedId] = useState(firstAvailable?.id)
    // Si la taille choisie s'est épuisée entre-temps, on bascule sur la première taille encore disponible.
    const selected = produit.boutique_variantes.find(v => v.id === selectedId && (dispo.get(v.id) ?? 0) > 0) ?? firstAvailable
    const soldOut = !firstAvailable
    const src = imageUrl(produit.image_path)
    const groupName = useId()
    const [zoomed, setZoomed] = useState(false)

    return (
        <article className="flex flex-col border border-white/10 bg-[#0d0d0d]">
            <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                {src ? (
                    <button
                        type="button"
                        onClick={() => setZoomed(true)}
                        aria-label={`Agrandir la photo : ${produit.nom}`}
                        className="group block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#eb0071]"
                    >
                        {/* Fond flouté issu de la même photo : l'image entière reste visible, quel que soit son format. */}
                        <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
                        <img src={src} alt={produit.nom} loading="lazy" className="relative h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                    </button>
                ) : (
                    <div className="flex h-full items-center justify-center font-title text-4xl text-white/10">JAGA FIGHT</div>
                )}
                {soldOut && <span className="absolute left-3 top-3 bg-[#0a0a0a]/90 px-3 py-1 text-xs uppercase tracking-widest text-[#F5F5F0]">Épuisé</span>}
            </div>
            {zoomed && src && <ImageLightbox src={src} alt={produit.nom} onClose={() => setZoomed(false)} />}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-title text-2xl leading-tight text-[#F5F5F0]">{produit.nom}</h3>
                    <p className="font-title text-2xl text-[#eb0071]">{formatPrice(produit.prix_cents)}</p>
                </div>
                {produit.description && <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/60">{produit.description}</p>}

                {produit.boutique_variantes.length > 0 && (
                    <fieldset className="mt-4">
                        <legend className="text-xs uppercase tracking-[0.2em] text-[#F5F5F0]/50">Taille</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {produit.boutique_variantes.map(v => {
                                const available = (dispo.get(v.id) ?? 0) > 0
                                const checked = v.id === selected?.id
                                return (
                                    <label
                                        key={v.id}
                                        className={`min-w-11 border px-3 py-1.5 text-center text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#eb0071] ${!available ? 'cursor-not-allowed border-white/5 text-[#F5F5F0]/20 line-through' : checked ? 'cursor-pointer border-[#eb0071] bg-[#eb0071]/10 text-[#F5F5F0]' : 'cursor-pointer border-white/15 text-[#F5F5F0]/75 hover:border-white/40'}`}
                                    >
                                        <input type="radio" name={groupName} value={v.id} checked={checked} disabled={!available} onChange={() => setSelectedId(v.id)} className="sr-only" />
                                        {v.taille}
                                        {!available && <span className="sr-only"> (épuisée)</span>}
                                    </label>
                                )
                            })}
                        </div>
                    </fieldset>
                )}

                <div className="mt-auto pt-6">
                <button
                    type="button"
                    disabled={!selected}
                    onClick={() => selected && onReserve(selected)}
                    className="w-full rounded bg-[#eb0071] px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                >
                    {soldOut ? 'Épuisé' : 'Réserver'}
                </button>
                </div>
            </div>
        </article>
    )
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        closeRef.current?.focus()
        const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = overflow
        }
    }, [onClose])

    return (
        <div role="dialog" aria-modal="true" aria-label={alt} onClick={onClose} className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/90 p-4">
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 p-2 text-[#F5F5F0]/70 hover:text-[#F5F5F0]">
                <X aria-hidden="true" className="h-6 w-6" />
            </button>
            <img src={src} alt={alt} className="max-h-[90vh] max-w-full object-contain" />
        </div>
    )
}

function ReservationDialog({ selection, disponible, onClose, onReserved }: { selection: Selection; disponible: number; onClose: () => void; onReserved: () => void }) {
    const { produit, variante } = selection
    const [quantite, setQuantite] = useState(1)
    const [prenom, setPrenom] = useState('')
    const [telephone, setTelephone] = useState('')
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
    const firstFieldRef = useRef<HTMLSelectElement>(null)
    const titleId = useId()
    const maxQuantite = Math.max(1, Math.min(3, disponible))

    useEffect(() => {
        firstFieldRef.current?.focus()
        const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        const overflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = overflow
        }
    }, [onClose])

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        setError('')
        setSending(true)
        try {
            const result = await reserver({ varianteId: variante.id, quantite, prenom, telephone })
            const ref = shortRef(result.id)
            setConfirmation({
                ref,
                expireLe: result.expireLe,
                message: `Bonjour Jaga Fight, je m’appelle ${prenom.trim()}. Je viens de réserver ${quantite} × ${produit.nom} en taille ${variante.taille} (réf. ${ref}). Je passerai le payer au club.`,
            })
            onReserved()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'La réservation n’a pas pu être enregistrée.')
        } finally {
            setSending(false)
        }
    }

    const field = 'mt-2 w-full border border-white/15 bg-[#0a0a0a] px-4 py-3 text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#eb0071] focus:outline-none'
    const label = 'text-xs uppercase tracking-[0.2em] text-[#eb0071]'

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={event => event.stopPropagation()}
                className="max-h-[92vh] w-full max-w-md overflow-y-auto border border-white/10 bg-[#0d0d0d] p-6 sm:p-7"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id={titleId} className="font-title text-3xl text-[#F5F5F0]">{confirmation ? 'C’EST RÉSERVÉ !' : 'RÉSERVER'}</h2>
                        <p className="mt-1 text-sm text-[#F5F5F0]/60">{produit.nom} · taille {variante.taille} · {formatPrice(produit.prix_cents)}</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 text-[#F5F5F0]/60 hover:text-[#F5F5F0]">
                        <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                </div>

                {confirmation ? (
                    <div className="mt-6 space-y-4" aria-live="polite">
                        <p className="text-sm leading-relaxed text-[#F5F5F0]/80">
                            Votre article est gardé jusqu’au{' '}
                            <strong className="text-[#F5F5F0]">{confirmation.expireLe.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</strong>.
                            Payez et récupérez-le au club en donnant la référence <strong className="text-[#eb0071]">{confirmation.ref}</strong>.
                        </p>
                        <a
                            href={whatsappUrl(confirmation.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2.5 rounded bg-[#eb0071] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90"
                        >
                            <MessageCircle aria-hidden="true" className="h-5 w-5" />
                            Prévenir le club sur WhatsApp
                        </a>
                        <button type="button" onClick={onClose} className="w-full py-2 text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0]">Fermer</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="resa-quantite" className={label}>Quantité</label>
                            <select id="resa-quantite" ref={firstFieldRef} value={quantite} onChange={e => setQuantite(Number(e.target.value))} className={field}>
                                {Array.from({ length: maxQuantite }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="resa-prenom" className={label}>Prénom</label>
                            <input id="resa-prenom" required maxLength={60} autoComplete="given-name" value={prenom} onChange={e => setPrenom(e.target.value)} className={field} />
                        </div>
                        <div>
                            <label htmlFor="resa-telephone" className={label}>Téléphone</label>
                            <input id="resa-telephone" required type="tel" autoComplete="tel" inputMode="tel" pattern="\+?[0-9 .\-]{8,20}" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className={field} />
                        </div>
                        <p className="text-xs leading-relaxed text-[#F5F5F0]/45">
                            Total à régler au club : <strong className="text-[#F5F5F0]/80">{formatPrice(produit.prix_cents * quantite)}</strong>. Article gardé {RESERVATION_HOURS} h.
                            Votre prénom et votre téléphone servent uniquement à gérer cette réservation.
                        </p>
                        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                        <button type="submit" disabled={sending} className="w-full rounded bg-[#eb0071] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50">
                            {sending ? 'Réservation…' : 'Confirmer la réservation'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
