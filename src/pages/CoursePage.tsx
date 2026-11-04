import { Helmet } from 'react-helmet-async'
import { MessageCircle, Phone } from 'lucide-react'
import Breadcrumb from '../components/common/Breadcrumb'
import GoogleReviewsBadge from '../components/common/GoogleReviewsBadge'
import { CLUB_ADDRESS, CLUB_ID, SITE_URL } from '../data/club'
import { PHONE_DISPLAY, PHONE_HREF, whatsappUrl } from '../data/contact'
import { coursePages, findCoursePage } from '../data/coursePages'
import { courses, formatSlot, type Course, type Day } from '../data/planning'

const SCHEMA_DAYS: Record<Day, string> = {
    Lundi: 'https://schema.org/Monday',
    Mardi: 'https://schema.org/Tuesday',
    Mercredi: 'https://schema.org/Wednesday',
    Jeudi: 'https://schema.org/Thursday',
    Vendredi: 'https://schema.org/Friday',
    Samedi: 'https://schema.org/Saturday',
}

const toPrice = (value: string) => value.replace(/[^0-9]/g, '')

export default function CoursePage({ slug }: { slug: string }) {
    const page = findCoursePage(slug)
    const pageUrl = `${SITE_URL}/cours/${page.slug}`
    const pageCourses = page.courseIds.map(id => courses.find(course => course.id === id)).filter((c): c is Course => Boolean(c))
    const trialHref = `/essai-gratuit?cours=${page.trialId}`
    const others = coursePages.filter(item => item.slug !== page.slug)

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${pageUrl}#webpage`,
                url: pageUrl,
                name: page.title,
                description: page.description,
                inLanguage: 'fr-FR',
                about: { '@id': `${pageUrl}#cours` },
            },
            {
                '@type': 'Course',
                '@id': `${pageUrl}#cours`,
                name: page.h1,
                description: page.intro,
                inLanguage: 'fr-FR',
                provider: { '@id': CLUB_ID },
                offers: page.prices.map(price => ({
                    '@type': 'Offer',
                    name: `${price.name} — 6 mois`,
                    category: 'Abonnement',
                    price: toPrice(price.sixMonths),
                    priceCurrency: 'EUR',
                    url: `${SITE_URL}/tarifs`,
                })),
                hasCourseInstance: pageCourses.map(course => ({
                    '@type': 'CourseInstance',
                    name: course.name,
                    courseMode: 'Onsite',
                    location: { '@id': CLUB_ID },
                    courseSchedule: {
                        '@type': 'Schedule',
                        repeatFrequency: 'P1W',
                        byDay: course.days.map(day => SCHEMA_DAYS[day]),
                        startTime: `${course.start}:00`,
                        ...(course.end ? { endTime: `${course.end}:00` } : {}),
                        scheduleTimezone: 'Europe/Paris',
                    },
                })),
            },
        ],
    }

    const facts = [
        {
            label: 'Horaires',
            allPrimary: true,
            value: pageCourses.map(course => `${pageCourses.length > 1 ? `${course.audience} : ` : ''}${course.days.join(', ')} · ${formatSlot(course)}`),
        },
        { label: 'À partir de', value: [page.fromPrice] },
        { label: 'Lieu', value: [`${CLUB_ADDRESS.city}`, 'près de Cagnes-sur-Mer et Nice'] },
        { label: 'Essai', value: ['1er cours offert', 'sans engagement'] },
    ]

    return (
        <>
            <Breadcrumb items={[{ name: page.menuLabel, url: pageUrl }]} />
            <Helmet>
                <title>{page.title}</title>
                <meta name="description" content={page.description} />
                <link rel="canonical" href={pageUrl} />
                <meta property="og:title" content={page.title} />
                <meta property="og:description" content={page.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={page.title} />
                <meta name="twitter:description" content={page.description} />
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.24),transparent_46%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">{page.eyebrow}</p>
                    <h1 className="mt-4 max-w-4xl font-title text-5xl leading-[0.95] text-[#F5F5F0] sm:text-6xl lg:text-7xl">{page.h1.toUpperCase()}</h1>
                    <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg">{page.intro}</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a href="/inscription" className="inline-flex justify-center rounded bg-[#eb0071] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                            S’inscrire au club
                        </a>
                        <a href={trialHref} className="inline-flex justify-center rounded border border-white/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                            Essai gratuit
                        </a>
                        <a href={PHONE_HREF} className="inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm text-[#F5F5F0]/70 transition-colors hover:text-[#eb0071]">
                            <Phone aria-hidden="true" className="h-4 w-4" />
                            {PHONE_DISPLAY}
                        </a>
                    </div>
                    <GoogleReviewsBadge className="mt-6" />
                </div>
            </header>

            <div className="bg-[#0a0a0a] py-12 sm:py-16">
                <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
                    <dl className="grid grid-cols-2 border border-white/10 bg-[#0d0d0d] lg:grid-cols-4">
                        {facts.map((fact, index) => (
                            <div key={fact.label} className={`px-5 py-5 ${index % 2 === 1 ? 'border-l border-white/10' : ''} ${index >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}>
                                <dt className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">{fact.label}</dt>
                                {fact.value.map((line, lineIndex) => (
                                    <dd key={line} className={lineIndex === 0 ? 'mt-2 text-sm text-[#F5F5F0]' : 'allPrimary' in fact ? 'mt-1 text-sm text-[#F5F5F0]' : 'text-xs text-[#F5F5F0]/55'}>{line}</dd>
                                ))}
                            </div>
                        ))}
                    </dl>

                    <section aria-labelledby="benefices">
                        <h2 id="benefices" className="font-title text-4xl text-[#F5F5F0] sm:text-5xl">{page.benefitsTitle.toUpperCase()}</h2>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {page.benefits.map(benefit => (
                                <article key={benefit.title} className="border-l-2 border-[#eb0071] bg-white/[0.03] px-5 py-5">
                                    <h3 className="font-title text-2xl text-[#F5F5F0]">{benefit.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/65">{benefit.text}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section aria-labelledby="tarifs-cours" className="border border-white/10 bg-[#0d0d0d]">
                        <div className="grid grid-cols-[minmax(0,1fr)_5.8rem_5.8rem] bg-[#eb0071]/15 sm:grid-cols-[minmax(0,1fr)_8rem_8rem]">
                            <h2 id="tarifs-cours" className="px-4 py-4 font-title text-3xl uppercase text-[#F5F5F0] sm:px-6">Tarifs</h2>
                            <span className="flex items-center justify-center bg-[#8d173e] px-2 text-center text-xs uppercase tracking-[0.12em] text-white sm:text-sm">6 mois</span>
                            <span className="flex items-center justify-center bg-[#8d173e] px-2 text-center text-xs uppercase tracking-[0.12em] text-white sm:text-sm">1 an</span>
                        </div>
                        <div className="divide-y divide-white/10">
                            {page.prices.map(price => (
                                <div key={price.name} className="grid grid-cols-[minmax(0,1fr)_5.8rem_5.8rem] items-center sm:grid-cols-[minmax(0,1fr)_8rem_8rem]">
                                    <div className="px-4 py-4 sm:px-6">
                                        <h3 className="text-sm uppercase tracking-wide text-[#F5F5F0] sm:text-base">{price.name}</h3>
                                        <p className="mt-1 text-xs italic text-[#F5F5F0]/50 sm:text-sm">{price.detail}</p>
                                    </div>
                                    <p className="px-2 text-center font-title text-xl text-[#F5F5F0] sm:text-2xl">{price.sixMonths}</p>
                                    <p className="px-2 text-center font-title text-xl text-[#F5F5F0] sm:text-2xl">{price.oneYear}</p>
                                </div>
                            ))}
                        </div>
                        <p className="border-t border-white/10 px-4 py-3 text-xs text-[#F5F5F0]/55 sm:px-6">
                            {page.priceNote ? `${page.priceNote} ` : ''}
                            <a href="/tarifs" className="text-[#eb0071] underline-offset-4 hover:underline">Voir tous les tarifs et carnets de séances</a>
                        </p>
                    </section>

                    <section aria-labelledby="encadrement" className="grid gap-6 border border-white/10 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Encadrement</p>
                            <h2 id="encadrement" className="mt-2 font-title text-4xl text-[#F5F5F0]">HICHAM</h2>
                            <p className="text-sm text-[#F5F5F0]/55">Directeur technique & coach principal</p>
                        </div>
                        <p className="text-sm leading-relaxed text-[#F5F5F0]/70">
                            Plus de 20 ans d’expérience en Muay Thaï, 27 combats professionnels et champion d’Europe 2018.
                            Diplômé DEJEPS et DESJEPS, Hicham porte une approche exigeante et bienveillante de la transmission.{' '}
                            <a href="/notre-adn" className="text-[#eb0071] underline-offset-4 hover:underline">Découvrir le club</a>
                        </p>
                    </section>

                    <section aria-labelledby="faq">
                        <h2 id="faq" className="font-title text-4xl text-[#F5F5F0] sm:text-5xl">QUESTIONS FRÉQUENTES</h2>
                        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                            {page.faq.map(item => (
                                <details key={item.question} className="group py-4">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[#F5F5F0] marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                                        <h3 className="text-base">{item.question}</h3>
                                        <span aria-hidden="true" className="text-xl text-[#eb0071] transition-transform group-open:rotate-45">+</span>
                                    </summary>
                                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#F5F5F0]/65">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </section>

                    <nav aria-labelledby="autres-cours">
                        <h2 id="autres-cours" className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Nos autres cours</h2>
                        <ul className="mt-4 flex flex-wrap gap-3">
                            {others.map(item => (
                                <li key={item.slug}>
                                    <a href={`/cours/${item.slug}`} className="inline-block border border-white/15 px-4 py-2 text-sm text-[#F5F5F0]/80 transition-colors hover:border-[#eb0071] hover:text-[#F5F5F0]">
                                        {item.menuLabel}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="/planning" className="inline-block border border-white/15 px-4 py-2 text-sm text-[#F5F5F0]/80 transition-colors hover:border-[#eb0071] hover:text-[#F5F5F0]">
                                    Tout le planning
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <section className="border-t border-white/10 bg-[#0d0d0d] py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Rejoindre Jaga Fight</p>
                    <h2 className="mt-4 font-title text-4xl text-[#F5F5F0] sm:text-5xl">PRÊT À VOUS LANCER ?</h2>
                    <p className="mt-5 leading-relaxed text-[#F5F5F0]/65">
                        Inscrivez-vous en ligne et complétez votre dossier depuis votre espace membre, ou venez d’abord essayer : le premier cours est offert.
                        {' '}{CLUB_ADDRESS.street}, {CLUB_ADDRESS.postalCode} {CLUB_ADDRESS.city}.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="/inscription" className="inline-flex justify-center rounded bg-[#eb0071] px-7 py-3.5 text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                            S’inscrire au club
                        </a>
                        <a href={trialHref} className="inline-flex justify-center rounded border border-white/30 px-7 py-3.5 text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                            Essai gratuit
                        </a>
                        <a
                            href={whatsappUrl(`Bonjour Jaga Fight, j’ai une question sur le cours ${page.menuLabel}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded border border-white/30 px-7 py-3.5 text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                        >
                            <MessageCircle aria-hidden="true" className="h-4 w-4" />
                            Poser une question
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
