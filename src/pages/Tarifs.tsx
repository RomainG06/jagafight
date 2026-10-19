import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'

type Subscription = { name: string; detail: string; sixMonths: string; oneYear: string }

const categories: Array<{ title: string; items: Subscription[] }> = [
    {
        title: 'Combats',
        items: [
            { name: 'Muay Thaï adultes', detail: '3 cours / semaine', sixMonths: '270 €', oneYear: '470 €' },
            { name: 'Muay Thaï féminin', detail: '1 cours / semaine', sixMonths: '170 €', oneYear: '270 €' },
            { name: 'Self defense', detail: '1 cours / semaine', sixMonths: '180 €', oneYear: '280 €' },
            { name: 'Enfants', detail: '2 cours / semaine', sixMonths: '180 €', oneYear: '300 €' },
            { name: 'Ados', detail: '2 cours / semaine', sixMonths: '220 €', oneYear: '350 €' },
            { name: 'Combattant', detail: 'Suivi personnalisé', sixMonths: '200 € / mois', oneYear: '200 € / mois' },
        ],
    },
    {
        title: 'Fitness',
        items: [
            { name: 'Cross training', detail: '3 cours / semaine', sixMonths: '250 €', oneYear: '380 €' },
            { name: 'Running', detail: '1 cours / semaine', sixMonths: '60 €', oneYear: '100 €' },
            { name: 'Stretching', detail: '1 cours / semaine', sixMonths: '60 €', oneYear: '100 €' },
        ],
    },
]

const packs: Subscription[] = [
    { name: 'Pack féminin', detail: 'Muay Thaï féminin + Self defense', sixMonths: '270 €', oneYear: '470 €' },
    { name: 'Pack forme', detail: 'Cross training + Running + Stretching', sixMonths: '280 €', oneYear: '450 €' },
]

const passes: Subscription[] = [
    { name: 'Pass 6 cours / semaine', detail: 'Muay Thaï + Cross training', sixMonths: '420 €', oneYear: '69 € / mois' },
    { name: 'Pack illimité', detail: 'Tout inclus', sixMonths: '650 €', oneYear: '79 € / mois' },
]

const sessions = [
    { name: '1 essai', detail: 'Muay Thaï / Self defense', price: 'Offert' },
    { name: '1 séance', detail: '', price: '20 €' },
    { name: 'Carnet 5 séances', detail: '', price: '90 €' },
    { name: 'Carnet 10 séances', detail: '', price: '160 €' },
]

const priceSchema = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Tarifs Jaga Fight — saison 2026/2027',
    url: 'https://www.jagafight.fr/tarifs',
    itemListElement: [...categories.flatMap(category => category.items), ...packs, ...passes].flatMap(item => [
        { '@type': 'Offer', name: `${item.name} — 6 mois`, price: item.sixMonths.replace(/[^0-9]/g, ''), priceCurrency: 'EUR', url: 'https://www.jagafight.fr/tarifs' },
        { '@type': 'Offer', name: `${item.name} — 1 an`, price: item.oneYear.replace(/[^0-9]/g, ''), priceCurrency: 'EUR', url: 'https://www.jagafight.fr/tarifs' },
    ]),
}

export default function Tarifs() {
    return (
        <>
            <Breadcrumb items={[{ name: 'Tarifs', url: 'https://www.jagafight.fr/tarifs' }]} />
            <Helmet>
                <title>Tarifs Muay Thaï, fitness et packs | Jaga Fight</title>
                <meta name="description" content="Tarifs Jaga Fight : Muay Thaï, self defense, cross training, packs, pass et carnets de séances à Saint-Laurent-du-Var, près de Cagnes-sur-Mer." />
                <link rel="canonical" href="https://www.jagafight.fr/tarifs" />
                <meta property="og:title" content="Tarifs Muay Thaï, fitness et packs | Jaga Fight" />
                <meta property="og:description" content="Formules Muay Thaï, fitness, packs, pass et séances à l’unité chez Jaga Fight." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jagafight.fr/tarifs" />
                <meta property="og:image" content="https://www.jagafight.fr/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <script type="application/ld+json">{JSON.stringify(priceSchema)}</script>
            </Helmet>

            <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.24),transparent_46%)]" />
                <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
                    <h1 className="font-title text-6xl leading-[0.9] text-[#F5F5F0] sm:text-7xl lg:text-8xl">TARIFS</h1>
                    <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg">Des formules pensées pour pratiquer, progresser et trouver votre rythme au sein de Jaga Fight.</p>
                </div>
            </header>

            <main className="bg-[#0a0a0a] py-14 sm:py-20">
                <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-3 border-l-2 border-[#eb0071] pl-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs  uppercase tracking-[0.2em] text-[#eb0071]">Offre de lancement</p>
                            <h2 className="mt-2 font-title text-4xl text-[#F5F5F0] sm:text-5xl">ABONNEMENTS</h2>
                        </div>
                        <p className="text-sm text-[#F5F5F0]/45">Montants indiqués en euros</p>
                    </div>

                    {categories.map(category => <SubscriptionTable key={category.title} title={category.title} items={category.items} />)}
                    <SubscriptionTable title="Packs" items={packs} />

                    <aside className="border border-[#eb0071]/40 bg-[#eb0071]/10 px-5 py-5 sm:flex sm:items-center sm:gap-6">
                        <h2 className="font-title text-3xl uppercase text-[#F5F5F0]">Packs famille</h2>
                        <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/75 sm:mt-0"><strong className="text-[#eb0071]">-10 %</strong> pour le 2ème membre · <strong className="text-[#eb0071]">-20 %</strong> à partir du 3ème membre.</p>
                    </aside>

                    <SubscriptionTable title="Pass" items={passes} />
                    <SessionTable />

                    <aside className="border-l-2 border-[#eb0071] bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-[#F5F5F0]/60">Tarifs communiqués à titre indicatif pour la saison 2026/2027. Contactez Jaga Fight pour confirmer la disponibilité des cours et les modalités d’inscription.</aside>
                </div>
            </main>

            <section className="border-t border-white/10 bg-[#0d0d0d] py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                    <p className="text-xs  uppercase tracking-[0.2em] text-[#eb0071]">Rejoindre Jaga Fight</p>
                    <h2 className="mt-4 font-title text-4xl text-[#F5F5F0] sm:text-5xl">PRÊT À COMMENCER ?</h2>
                    <p className="mt-5 leading-relaxed text-[#F5F5F0]/65">Créez votre espace membre pour vous inscrire, ou contactez-nous pour choisir la formule adaptée.</p>
                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="/inscription" className="inline-flex justify-center rounded bg-[#eb0071] px-7 py-3.5  text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">S’inscrire</a>
                        <a href="mailto:agentpro.athlete@gmail.com" className="inline-flex justify-center rounded border border-white/30 px-7 py-3.5  text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">Nous contacter</a>
                    </div>
                </div>
            </section>
        </>
    )
}

function SubscriptionTable({ title, items }: { title: string; items: Subscription[] }) {
    return (
        <section className="border border-white/10 bg-[#0d0d0d]" aria-labelledby={`tarifs-${title.toLowerCase()}`}>
            <div className="grid grid-cols-[minmax(0,1fr)_5.8rem_5.8rem] bg-[#eb0071]/15 sm:grid-cols-[minmax(0,1fr)_8rem_8rem]">
                <h2 id={`tarifs-${title.toLowerCase()}`} className="px-4 py-4 font-title text-3xl uppercase text-[#F5F5F0] sm:px-6">{title}</h2>
                <span className="flex items-center justify-center bg-[#8d173e] px-2 text-center text-xs  uppercase tracking-[0.12em] text-white sm:text-sm">6 mois</span>
                <span className="flex items-center justify-center bg-[#8d173e] px-2 text-center text-xs  uppercase tracking-[0.12em] text-white sm:text-sm">1 an</span>
            </div>
            <div className="divide-y divide-white/10">
                {items.map(item => (
                    <article key={item.name} className="grid grid-cols-[minmax(0,1fr)_5.8rem_5.8rem] items-center sm:grid-cols-[minmax(0,1fr)_8rem_8rem]">
                        <div className="px-4 py-4 sm:px-6">
                            <h3 className="text-sm  uppercase tracking-wide text-[#F5F5F0] sm:text-base">{item.name}</h3>
                            <p className="mt-1 text-xs italic text-[#F5F5F0]/50 sm:text-sm">{item.detail}</p>
                        </div>
                        <p className="px-2 text-center font-title text-xl text-[#F5F5F0] sm:text-2xl">{item.sixMonths}</p>
                        <p className="px-2 text-center font-title text-xl text-[#F5F5F0] sm:text-2xl">{item.oneYear}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

function SessionTable() {
    return (
        <section className="border border-white/10 bg-[#0d0d0d]" aria-labelledby="tarifs-carnets">
            <h2 id="tarifs-carnets" className="bg-[#eb0071]/15 px-4 py-4 font-title text-3xl uppercase text-[#F5F5F0] sm:px-6">Carnets & essai</h2>
            <div className="divide-y divide-white/10">
                {sessions.map(item => (
                    <article key={item.name} className="grid grid-cols-[minmax(0,1fr)_7rem] items-center px-4 py-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:px-6">
                        <div>
                            <h3 className="text-sm  uppercase tracking-wide text-[#F5F5F0] sm:text-base">{item.name}</h3>
                            {item.detail ? <p className="mt-1 text-xs italic text-[#F5F5F0]/50 sm:text-sm">{item.detail}</p> : null}
                        </div>
                        <p className={`text-center font-title text-xl sm:text-2xl ${item.price === 'Offert' ? 'text-[#eb0071]' : 'text-[#F5F5F0]'}`}>{item.price}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
