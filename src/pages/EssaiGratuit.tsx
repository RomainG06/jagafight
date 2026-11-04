import { useEffect, useId, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MessageCircle, Phone } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import GoogleReviewsBadge from '../components/common/GoogleReviewsBadge'
import { courses, formatSlot, type Course, type Day } from '../data/planning'
import { PHONE_DISPLAY, PHONE_HREF, whatsappUrl } from '../data/contact'
import { CLUB_ID, SITE_URL } from '../data/club'

const PAGE_URL = `${SITE_URL}/essai-gratuit`
const TITLE = 'Cours d’essai gratuit de Muay Thaï à Saint-Laurent-du-Var | Jaga Fight'
const DESCRIPTION = 'Réservez votre premier cours offert chez Jaga Fight : Muay Thaï adultes, féminin, enfants, ados ou self défense à Saint-Laurent-du-Var. Réponse rapide par WhatsApp.'

const trialCourses = courses.filter(course => course.trial)

const steps = [
    { title: 'Choisissez votre cours', text: 'Sélectionnez la discipline et le jour qui vous conviennent.' },
    { title: 'On confirme sur WhatsApp', text: 'Votre demande arrive directement au club, on vous répond pour valider le créneau.' },
    { title: 'Venez vous entraîner', text: 'Prévoyez une tenue de sport et une bouteille d’eau. Le reste, on s’en occupe.' },
]

const schema = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${PAGE_URL}#webpage`,
            url: PAGE_URL,
            name: TITLE,
            description: DESCRIPTION,
            inLanguage: 'fr-FR',
            about: { '@id': CLUB_ID },
        },
        {
            '@type': 'Offer',
            '@id': `${PAGE_URL}#offre`,
            name: 'Cours d’essai gratuit — Muay Thaï ou self défense',
            price: '0',
            priceCurrency: 'EUR',
            url: PAGE_URL,
            availability: 'https://schema.org/InStock',
            offeredBy: { '@id': CLUB_ID },
        },
    ],
}

function buildMessage(course: Course | undefined, day: Day | undefined, firstName: string) {
    if (!course) return undefined
    const intro = firstName.trim() ? `Bonjour Jaga Fight, je m’appelle ${firstName.trim()}.` : 'Bonjour Jaga Fight !'
    const forWhom = course.category === 'jeunes' ? ' pour mon enfant' : ''
    const when = day ? `, le ${day.toLowerCase()} à ${formatSlot(course)}` : ''
    return `${intro} Je souhaite réserver un cours d’essai gratuit${forWhom} : ${course.name} (${course.audience.toLowerCase()})${when}. Merci !`
}

export default function EssaiGratuit() {
    const [courseId, setCourseId] = useState<string>()
    const [day, setDay] = useState<Day>()
    const [firstName, setFirstName] = useState('')
    const firstNameId = useId()

    // Présélection depuis un lien du type /essai-gratuit?cours=kids (lu après hydratation : la page est pré-rendue).
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('cours')
        const preset = trialCourses.find(item => item.id === id)
        if (!preset) return
        // Lecture unique de l'URL au montage : volontairement hors du rendu pour éviter un écart d'hydratation.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCourseId(preset.id)
        setDay(preset.days.length === 1 ? preset.days[0] : undefined)
    }, [])

    const course = trialCourses.find(item => item.id === courseId)
    const message = buildMessage(course, day, firstName)

    const selectCourse = (id: string) => {
        const next = trialCourses.find(item => item.id === id)
        setCourseId(id)
        setDay(next && next.days.length === 1 ? next.days[0] : undefined)
    }

    return (
        <>
            <Breadcrumb items={[{ name: 'Essai gratuit', url: PAGE_URL }]} />
            <Helmet>
                <title>{TITLE}</title>
                <meta name="description" content={DESCRIPTION} />
                <link rel="canonical" href={PAGE_URL} />
                <meta property="og:title" content={TITLE} />
                <meta property="og:description" content="Votre premier cours de Muay Thaï ou de self défense est offert chez Jaga Fight, à Saint-Laurent-du-Var." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={TITLE} />
                <meta name="twitter:description" content={DESCRIPTION} />
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.24),transparent_46%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">1er cours offert</p>
                    <h1 className="mt-4 font-title text-5xl leading-[0.9] text-[#F5F5F0] sm:text-7xl lg:text-8xl">COURS D’ESSAI GRATUIT</h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg">
                        Muay Thaï adultes, féminin, enfants, ados ou self défense : venez essayer gratuitement à Saint-Laurent-du-Var.
                        Débutants bienvenus, sans engagement.
                    </p>
                </div>
            </header>

            <div className="bg-[#0a0a0a] py-12 sm:py-20">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:px-8">
                    <section aria-labelledby="essai-form-title" className="border border-white/10 bg-[#0d0d0d]">
                        <h2 id="essai-form-title" className="bg-[#eb0071]/15 px-5 py-4 font-title text-3xl uppercase text-[#F5F5F0] sm:px-6">Réserver mon essai</h2>

                        <div className="space-y-8 px-5 py-6 sm:px-6">
                            <fieldset>
                                <legend className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">1. Quel cours ?</legend>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {trialCourses.map(item => {
                                        const checked = item.id === courseId
                                        return (
                                            <label
                                                key={item.id}
                                                className={`flex cursor-pointer flex-col border px-4 py-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#eb0071] ${checked ? 'border-[#eb0071] bg-[#eb0071]/10' : 'border-white/15 hover:border-white/40'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="cours"
                                                    value={item.id}
                                                    checked={checked}
                                                    onChange={() => selectCourse(item.id)}
                                                    className="sr-only"
                                                />
                                                <span className="text-sm uppercase tracking-wide text-[#F5F5F0]">{item.name}</span>
                                                <span className="mt-0.5 text-xs italic text-[#F5F5F0]/55">
                                                    {item.audience} · {item.days.join(', ')} · {formatSlot(item)}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </fieldset>

                            {course ? (
                                <fieldset>
                                    <legend className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">2. Quel jour ?</legend>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {course.days.map(item => {
                                            const checked = item === day
                                            return (
                                                <label
                                                    key={item}
                                                    className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#eb0071] ${checked ? 'border-[#eb0071] bg-[#eb0071]/10 text-[#F5F5F0]' : 'border-white/15 text-[#F5F5F0]/75 hover:border-white/40'}`}
                                                >
                                                    <input type="radio" name="jour" value={item} checked={checked} onChange={() => setDay(item)} className="sr-only" />
                                                    {item} · <span className="font-title text-lg">{formatSlot(course)}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </fieldset>
                            ) : null}

                            <div>
                                <label htmlFor={firstNameId} className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">
                                    {course ? '3.' : '2.'} Votre prénom <span className="normal-case tracking-normal text-[#F5F5F0]/40">(facultatif)</span>
                                </label>
                                <input
                                    id={firstNameId}
                                    type="text"
                                    autoComplete="given-name"
                                    value={firstName}
                                    onChange={event => setFirstName(event.target.value)}
                                    maxLength={40}
                                    className="mt-3 w-full border border-white/15 bg-[#0a0a0a] px-4 py-3 text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#eb0071] focus:outline-none"
                                    placeholder="Ex. Camille"
                                />
                            </div>

                            <div className="space-y-3">
                                {message ? (
                                    <p className="border-l-2 border-[#eb0071] bg-white/[0.03] px-4 py-3 text-sm italic leading-relaxed text-[#F5F5F0]/65" aria-live="polite">
                                        « {message} »
                                    </p>
                                ) : null}
                                <a
                                    href={whatsappUrl(message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2.5 rounded bg-[#eb0071] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                                >
                                    <MessageCircle aria-hidden="true" className="h-5 w-5" />
                                    Envoyer ma demande sur WhatsApp
                                </a>
                                <a
                                    href={PHONE_HREF}
                                    className="flex w-full items-center justify-center gap-2.5 rounded border border-white/30 px-6 py-3.5 text-sm text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                                >
                                    <Phone aria-hidden="true" className="h-4 w-4" />
                                    Je préfère appeler : {PHONE_DISPLAY}
                                </a>
                                <div className="flex justify-center pt-2">
                                    <GoogleReviewsBadge />
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-8">
                        <section aria-labelledby="essai-etapes">
                            <h2 id="essai-etapes" className="font-title text-3xl text-[#F5F5F0]">COMMENT ÇA SE PASSE ?</h2>
                            <ol className="mt-5 space-y-5">
                                {steps.map((step, index) => (
                                    <li key={step.title} className="flex gap-4">
                                        <span className="font-title text-3xl leading-none text-[#eb0071]">0{index + 1}</span>
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wide text-[#F5F5F0]">{step.title}</h3>
                                            <p className="mt-1 text-sm leading-relaxed text-[#F5F5F0]/60">{step.text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section aria-labelledby="essai-adresse" className="border-l-2 border-[#eb0071] bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-[#F5F5F0]/65">
                            <h2 id="essai-adresse" className="font-title text-2xl text-[#F5F5F0]">OÙ NOUS TROUVER</h2>
                            <p className="mt-2">864 Av. Pierre et Marie Curie<br />06700 Saint-Laurent-du-Var</p>
                            <p className="mt-2">À quelques minutes de Cagnes-sur-Mer et Nice.</p>
                            <p className="mt-3">
                                <a href="/planning" className="text-[#eb0071] underline-offset-4 hover:underline">Voir tout le planning</a>
                                {' · '}
                                <a href="/tarifs" className="text-[#eb0071] underline-offset-4 hover:underline">Voir les tarifs</a>
                            </p>
                        </section>

                        <section aria-labelledby="essai-inscription" className="border border-[#eb0071]/40 bg-[#eb0071]/10 px-5 py-5">
                            <h2 id="essai-inscription" className="font-title text-2xl text-[#F5F5F0]">DÉJÀ DÉCIDÉ ?</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/70">Inscrivez-vous directement en ligne : vous complétez votre dossier et déposez votre certificat médical depuis votre espace membre.</p>
                            <a href="/inscription" className="mt-4 inline-flex rounded bg-[#eb0071] px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white hover:opacity-90">S’inscrire au club</a>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    )
}
