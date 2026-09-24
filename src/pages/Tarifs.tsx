import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'

const formules = [
    {
        name: 'Muay Thaï adultes',
        frequency: '3 cours par semaine',
        benefits: ['Technique', 'Condition physique', 'Tous niveaux'],
        sixMonths: 250,
        oneYear: 420,
        accent: 'pink',
    },
    {
        name: 'Muay Thaï féminin',
        frequency: '1 cours par semaine + 1 cours de conditioning au choix',
        benefits: ['Apprentissage', 'Confiance', 'Bien-être', 'Tous niveaux'],
        sixMonths: 150,
        oneYear: 250,
        accent: 'pink',
    },
    {
        name: 'Conditioning',
        frequency: '3 cours par semaine',
        benefits: ['Renforcement', 'Cardio', 'Boxe', 'Tous niveaux'],
        sixMonths: 200,
        oneYear: 330,
        accent: 'green',
    },
    {
        name: 'Muay Thaï + conditioning',
        frequency: 'Accès aux 6 cours par semaine',
        benefits: ['Technique', 'Condition physique', 'Progression complète'],
        sixMonths: 320,
        oneYear: 520,
        accent: 'pink',
        featured: true,
    },
    {
        name: 'Enfants',
        frequency: '2 cours par semaine',
        benefits: ['Discipline', 'Respect', 'Plaisir'],
        sixMonths: 180,
        oneYear: 300,
        accent: 'pink',
    },
    {
        name: 'Ados',
        frequency: '2 cours par semaine',
        benefits: ['Progression', 'Confiance', 'Dépassement de soi'],
        sixMonths: 200,
        oneYear: 330,
        accent: 'pink',
    },
] as const

const priceSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Tarifs Jaga Fight — saison 2026/2027',
    url: 'https://www.jagafight.fr/tarifs',
    itemListElement: formules.flatMap((formule) => ([
        {
            '@type': 'Offer',
            name: `${formule.name} — 6 mois`,
            price: formule.sixMonths,
            priceCurrency: 'EUR',
            url: 'https://www.jagafight.fr/tarifs',
        },
        {
            '@type': 'Offer',
            name: `${formule.name} — 1 an`,
            price: formule.oneYear,
            priceCurrency: 'EUR',
            url: 'https://www.jagafight.fr/tarifs',
        },
    ])),
}

export default function Tarifs() {
    return (
        <>
            <Breadcrumb
                items={[
                    { name: 'Tarifs', url: 'https://www.jagafight.fr/tarifs' },
                ]}
            />

            <Helmet>
                <title>Tarifs Muay Thaï et conditioning 2026/2027 | Jaga Fight</title>
                <meta
                    name="description"
                    content="Consultez les tarifs indicatifs 2026/2027 des cours de Muay Thaï adultes, féminin, enfants, ados et conditioning chez Jaga Fight à Cagnes-sur-Mer."
                />
                <link rel="canonical" href="https://www.jagafight.fr/tarifs" />

                <meta property="og:title" content="Tarifs 2026/2027 | Jaga Fight" />
                <meta
                    property="og:description"
                    content="Découvrez les formules Muay Thaï et conditioning proposées par Jaga Fight pour la saison 2026/2027."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jagafight.fr/tarifs" />
                <meta property="og:image" content="https://www.jagafight.fr/og-image.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Tarifs 2026/2027 | Jaga Fight" />
                <meta
                    name="twitter:description"
                    content="Les formules et tarifs indicatifs de Jaga Fight pour la saison 2026/2027."
                />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-image.jpg" />

                <script type="application/ld+json">{JSON.stringify(priceSchema)}</script>
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.2),transparent_45%)]" />
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
                    <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                        Saison 2026 / 2027
                    </p>
                    <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl text-[#F5F5F0] leading-[0.92] text-balance">
                        FORMULES & TARIFS
                    </h1>
                    <p className="mt-7 text-lg sm:text-xl text-[#F5F5F0]/70 max-w-2xl mx-auto leading-relaxed text-pretty">
                        Choisissez le rythme qui correspond à vos objectifs, pour six mois ou pour une saison complète.
                    </p>
                </div>
            </header>

            <section aria-labelledby="pricing-heading" className="bg-[#0a0a0a] py-20 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                                Nos abonnements
                            </p>
                            <h2 id="pricing-heading" className="font-title text-4xl sm:text-5xl text-[#F5F5F0]">
                                TROUVEZ VOTRE FORMULE
                            </h2>
                        </div>
                        <p className="text-sm text-[#F5F5F0]/45">Montants indiqués en euros</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {formules.map((formule, index) => {
                            const isGreen = formule.accent === 'green'
                            const accentText = isGreen ? 'text-[#71e38d]' : 'text-[#eb0071]'
                            const accentBorder = isGreen ? 'border-[#71e38d]/50' : 'border-[#eb0071]/50'
                            const accentBackground = isGreen ? 'bg-[#71e38d]/10' : 'bg-[#eb0071]/10'

                            return (
                                <article
                                    key={formule.name}
                                    className={`relative flex flex-col border bg-[#0d0d0d] p-6 sm:p-7 transition-colors ${'featured' in formule && formule.featured ? 'border-[#eb0071]' : 'border-white/10 hover:border-white/25'}`}
                                >
                                    {'featured' in formule && formule.featured ? (
                                        <span className="absolute right-0 top-0 bg-[#eb0071] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
                                            Formule complète
                                        </span>
                                    ) : null}

                                    <span aria-hidden="true" className={`font-title text-4xl ${accentText} opacity-50`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="mt-5 font-title text-3xl uppercase text-[#F5F5F0] leading-none">
                                        {formule.name}
                                    </h3>
                                    <p className={`mt-3 text-sm font-semibold ${accentText}`}>
                                        {formule.frequency}
                                    </p>

                                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Bénéfices de la formule ${formule.name}`}>
                                        {formule.benefits.map((benefit) => (
                                            <li key={benefit} className="border border-white/10 px-2.5 py-1 text-xs text-[#F5F5F0]/55">
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                                        <div className={`border ${accentBorder} ${accentBackground} p-4`}>
                                            <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-[#F5F5F0]/55">6 mois</dt>
                                            <dd className={`mt-1 font-title text-4xl ${accentText}`}>{formule.sixMonths} €</dd>
                                        </div>
                                        <div className={`border ${accentBorder} ${accentBackground} p-4`}>
                                            <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-[#F5F5F0]/55">1 an</dt>
                                            <dd className={`mt-1 font-title text-4xl ${accentText}`}>{formule.oneYear} €</dd>
                                        </div>
                                    </dl>
                                </article>
                            )
                        })}
                    </div>

                    <aside className="mt-8 border-l-2 border-[#eb0071] bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-[#F5F5F0]/55">
                        Ces tarifs sont communiqués à titre indicatif pour la saison 2026/2027. Contactez Jaga Fight pour confirmer la disponibilité des cours et les modalités d’inscription.
                    </aside>
                </div>
            </section>

            <section className="border-t border-white/10 bg-[#0d0d0d] py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                        Rejoindre Jaga Fight
                    </p>
                    <h2 className="font-title text-4xl sm:text-5xl text-[#F5F5F0]">
                        PRÊT À MONTER SUR LE RING ?
                    </h2>
                    <p className="mt-5 text-[#F5F5F0]/65 leading-relaxed">
                        Créez votre espace membre pour commencer votre inscription ou contactez-nous si vous avez besoin d’aide pour choisir votre formule.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/inscription"
                            className="inline-flex justify-center rounded bg-[#eb0071] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#d60066] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                        >
                            S’inscrire
                        </a>
                        <a
                            href="mailto:Agentpro.athlete@gmail.com"
                            className="inline-flex justify-center rounded border border-white/30 px-7 py-3.5 font-semibold text-[#F5F5F0] transition-[color,border-color] hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                        >
                            Nous contacter
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
