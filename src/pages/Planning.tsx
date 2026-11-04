import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'
import { courses, DAYS, formatTime, type Category, type Course, type Day } from '../data/planning'
import { PHONE_DISPLAY, PHONE_E164, PHONE_HREF } from '../data/contact'

const SITE_URL = 'https://www.jagafight.fr'
const PAGE_URL = `${SITE_URL}/planning`

const categoryStyles: Record<Category, { label: string; dot: string; border: string }> = {
    muay: { label: 'Muay Thaï', dot: 'bg-[#eb0071]', border: 'border-l-[#eb0071]' },
    self: { label: 'Self défense', dot: 'bg-[#8d173e]', border: 'border-l-[#8d173e]' },
    jeunes: { label: 'Enfants & ados', dot: 'bg-[#F04E98]', border: 'border-l-[#F04E98]' },
    fitness: { label: 'Fitness', dot: 'bg-[#F5F5F0]', border: 'border-l-[#F5F5F0]/70' },
}

const SCHEMA_DAYS: Record<Day, string> = {
    Lundi: 'https://schema.org/Monday',
    Mardi: 'https://schema.org/Tuesday',
    Mercredi: 'https://schema.org/Wednesday',
    Jeudi: 'https://schema.org/Thursday',
    Vendredi: 'https://schema.org/Friday',
    Samedi: 'https://schema.org/Saturday',
}

const sortByStart =(a: Course, b: Course) => a.start.localeCompare(b.start)

const coursesByDay = DAYS.map(day => ({
    day,
    items: courses.filter(course => course.days.includes(day)).sort(sortByStart),
}))

const location = {
    '@type': 'SportsActivityLocation',
    '@id': `${SITE_URL}/#club`,
    name: 'Jaga Fight',
    url: SITE_URL,
    telephone: PHONE_E164,
    address: {
        '@type': 'PostalAddress',
        streetAddress: '864 Av. Pierre et Marie Curie',
        addressLocality: 'Saint-Laurent-du-Var',
        addressRegion: 'Alpes-Maritimes',
        postalCode: '06700',
        addressCountry: 'FR',
    },
}

const planningSchema = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': `${PAGE_URL}#webpage`,
            url: PAGE_URL,
            name: 'Planning des cours de Muay Thaï | Jaga Fight Saint-Laurent-du-Var',
            description: 'Horaires des cours Jaga Fight : Muay Thaï adultes, féminin, enfants, ados, self défense et footing à Saint-Laurent-du-Var.',
            inLanguage: 'fr-FR',
            about: { '@id': `${SITE_URL}/#club` },
            mainEntity: { '@id': `${PAGE_URL}#cours` },
        },
        location,
        {
            '@type': 'ItemList',
            '@id': `${PAGE_URL}#cours`,
            name: 'Cours hebdomadaires Jaga Fight',
            itemListElement: courses.map((course, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'Event',
                    '@id': `${PAGE_URL}#${course.id}`,
                    name: `${course.name} — Jaga Fight`,
                    description: `Cours de ${course.name} (${course.audience.toLowerCase()}) chaque ${course.days.join(', ').toLowerCase()} à ${formatTime(course.start)} à Saint-Laurent-du-Var.`,
                    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                    eventStatus: 'https://schema.org/EventScheduled',
                    location: { '@id': `${SITE_URL}/#club` },
                    organizer: { '@type': 'SportsOrganization', name: 'Jaga Fight', url: SITE_URL },
                    eventSchedule: {
                        '@type': 'Schedule',
                        repeatFrequency: 'P1W',
                        byDay: course.days.map(day => SCHEMA_DAYS[day]),
                        startTime: `${course.start}:00`,
                        ...(course.end ? { endTime: `${course.end}:00` } : {}),
                        scheduleTimezone: 'Europe/Paris',
                    },
                    offers: { '@type': 'Offer', url: `${SITE_URL}/tarifs`, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
                },
            })),
        },
    ],
}

const TITLE = 'Planning des cours de Muay Thaï à Saint-Laurent-du-Var | Jaga Fight'
const DESCRIPTION = 'Horaires Jaga Fight : Muay Thaï adultes lun, mer, ven 19h30, féminin, enfants, ados, self défense et footing à Saint-Laurent-du-Var, près de Cagnes-sur-Mer.'

export default function Planning() {
    return (
        <>
            <Breadcrumb items={[{ name: 'Planning', url: PAGE_URL }]} />
            <Helmet>
                <title>{TITLE}</title>
                <meta name="description" content={DESCRIPTION} />
                <link rel="canonical" href={PAGE_URL} />
                <meta property="og:title" content={TITLE} />
                <meta property="og:description" content="Tous les horaires des cours Jaga Fight : Muay Thaï, self défense, enfants, ados et footing." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={PAGE_URL} />
                <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={TITLE} />
                <meta name="twitter:description" content={DESCRIPTION} />
                <script type="application/ld+json">{JSON.stringify(planningSchema)}</script>
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.24),transparent_46%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Saison 2026/2027</p>
                    <h1 className="mt-4 font-title text-6xl leading-[0.9] text-[#F5F5F0] sm:text-7xl lg:text-8xl">PLANNING</h1>
                    <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg">
                        Les horaires des cours de Muay Thaï, self défense et footing de Jaga Fight à Saint-Laurent-du-Var.
                        Adultes, femmes, enfants et ados : trouvez votre créneau.
                    </p>
                </div>
            </header>

            <div className="bg-[#0a0a0a] py-14 sm:py-20">
                <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 border-l-2 border-[#eb0071] pl-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Semaine type</p>
                            <h2 className="mt-2 font-title text-4xl text-[#F5F5F0] sm:text-5xl">HORAIRES DES COURS</h2>
                        </div>
                        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#F5F5F0]/60" aria-label="Légende">
                            {Object.values(categoryStyles).map(style => (
                                <li key={style.label} className="inline-flex items-center gap-2">
                                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                                    {style.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
                        {coursesByDay.map(({ day, items }) => (
                            <section key={day} aria-labelledby={`jour-${day}`} className="border border-white/10 bg-[#0d0d0d]">
                                <h3 id={`jour-${day}`} className="bg-[#eb0071]/15 px-4 py-3 font-title text-2xl uppercase tracking-wide text-[#F5F5F0]">
                                    {day}
                                </h3>
                                <ol className="divide-y divide-white/10">
                                    {items.map(course => (
                                        <li key={course.id} className={`border-l-2 px-4 py-3.5 ${categoryStyles[course.category].border}`}>
                                            <p className="font-title text-2xl leading-none text-[#F5F5F0]">
                                                <time dateTime={course.start}>{formatTime(course.start)}</time>
                                                {course.end ? (
                                                    <>
                                                        <span className="text-[#F5F5F0]/40"> – </span>
                                                        <time dateTime={course.end}>{formatTime(course.end)}</time>
                                                    </>
                                                ) : null}
                                            </p>
                                            <p className="mt-1.5 text-sm uppercase tracking-wide text-[#F5F5F0]">{course.name}</p>
                                            <p className="mt-0.5 text-xs italic text-[#F5F5F0]/50">{course.audience}</p>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        ))}
                    </div>

                    <section aria-labelledby="planning-disciplines" className="border border-white/10 bg-[#0d0d0d]">
                        <h2 id="planning-disciplines" className="bg-[#eb0071]/15 px-4 py-4 font-title text-3xl uppercase text-[#F5F5F0] sm:px-6">
                            Par discipline
                        </h2>
                        <div className="divide-y divide-white/10">
                            {courses.map(course => (
                                <article key={course.id} className="grid gap-1 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_8rem] sm:items-center sm:gap-4 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${categoryStyles[course.category].dot}`} />
                                        <div>
                                            <h3 className="text-sm uppercase tracking-wide text-[#F5F5F0] sm:text-base">{course.name}</h3>
                                            <p className="text-xs italic text-[#F5F5F0]/50 sm:text-sm">{course.audience}</p>
                                        </div>
                                    </div>
                                    <p className="pl-5.5 text-sm text-[#F5F5F0]/70 sm:pl-0">{course.days.join(' · ')}</p>
                                    <p className="pl-5.5 font-title text-xl text-[#F5F5F0] sm:pl-0 sm:text-right sm:text-2xl">
                                        {formatTime(course.start)}{course.end ? ` – ${formatTime(course.end)}` : ''}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside className="border-l-2 border-[#eb0071] bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-[#F5F5F0]/60">
                        Cours au 864 Av. Pierre et Marie Curie, 06700 Saint-Laurent-du-Var, à quelques minutes de Cagnes-sur-Mer et Nice.
                        Planning susceptible d’évoluer pendant les vacances scolaires : contactez Jaga Fight pour confirmer un créneau.
                        Consultez les <a href="/tarifs" className="text-[#eb0071] underline-offset-4 hover:underline">tarifs des abonnements</a> ou découvrez <a href="/muay-thai" className="text-[#eb0071] underline-offset-4 hover:underline">le Muay Thaï</a>.
                    </aside>
                </div>
            </div>

            <section className="border-t border-white/10 bg-[#0d0d0d] py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">Cours d’essai offert</p>
                    <h2 className="mt-4 font-title text-4xl text-[#F5F5F0] sm:text-5xl">VENEZ ESSAYER</h2>
                    <p className="mt-5 leading-relaxed text-[#F5F5F0]/65">Votre premier cours de Muay Thaï ou de self défense est offert. Choisissez un créneau et rejoignez-nous sur le tatami.</p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="/essai-gratuit" className="inline-flex justify-center rounded bg-[#eb0071] px-7 py-3.5 text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">Réserver mon essai gratuit</a>
                        <a href={PHONE_HREF} className="inline-flex justify-center rounded border border-white/30 px-7 py-3.5 text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">Appeler le {PHONE_DISPLAY}</a>
                    </div>
                </div>
            </section>
        </>
    )
}
