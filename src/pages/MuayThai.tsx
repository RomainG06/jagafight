import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'
import hichKnee from '../assets/hichKnee.jpg'
import respect from '../assets/muayph.jpeg'

const weapons = [
    {
        number: '01',
        title: 'Poings',
        description: 'Directs, crochets et uppercuts structurent les échanges à courte et moyenne distance.',
    },
    {
        number: '02',
        title: 'Coudes',
        description: 'Des armes de courte distance qui demandent précision, contrôle et maîtrise technique.',
    },
    {
        number: '03',
        title: 'Genoux',
        description: 'Ils s’utilisent à distance ou dans le corps-à-corps pour développer puissance et coordination.',
    },
    {
        number: '04',
        title: 'Jambes',
        description: 'Les frappes avec les tibias mobilisent tout le corps et donnent au Muay Thaï son rythme singulier.',
    },
]

const values = [
    {
        title: 'Respect',
        description: 'Respecter son professeur, ses partenaires, son adversaire, les règles et le lieu d’entraînement.',
    },
    {
        title: 'Discipline',
        description: 'Revenir, répéter et accepter la progression étape par étape, même lorsque l’apprentissage devient exigeant.',
    },
    {
        title: 'Maîtrise de soi',
        description: 'Apprendre à gérer son effort, ses émotions et sa puissance pour pratiquer avec justesse et sécurité.',
    },
    {
        title: 'Humilité',
        description: 'Rester disponible pour apprendre et reconnaître que la technique se construit tout au long de la pratique.',
    },
    {
        title: 'Solidarité',
        description: 'Progresser avec les autres, prendre soin de ses partenaires et contribuer à un collectif bienveillant.',
    },
    {
        title: 'Courage',
        description: 'Faire face à l’effort, au doute et à la difficulté sans confondre courage et prise de risque inutile.',
    },
]

const audiences = [
    {
        title: 'Débutants',
        description: 'Les bases se découvrent progressivement : posture, déplacements, garde, respiration et premières techniques.',
    },
    {
        title: 'Enfants & adolescents',
        description: 'Une pratique adaptée aide à développer coordination, attention, confiance et respect du cadre collectif.',
    },
    {
        title: 'Adultes',
        description: 'Le Muay Thaï permet de travailler la condition physique, de relâcher la pression et de progresser techniquement.',
    },
    {
        title: 'Compétiteurs',
        description: 'La préparation approfondit la tactique, la gestion de l’effort et la capacité à décider sous pression.',
    },
]

const questions = [
    {
        question: 'Faut-il être sportif pour commencer le Muay Thaï ?',
        answer: 'Non. L’entraînement peut être adapté à votre condition physique et à votre expérience. La régularité compte davantage que le niveau de départ.',
    },
    {
        question: 'Le Muay Thaï est-il réservé à la compétition ?',
        answer: 'Non. Beaucoup de pratiquants recherchent une activité physique complète, une meilleure confiance en soi ou le plaisir d’apprendre, sans objectif de combat.',
    },
    {
        question: 'Quelle différence entre Muay Thaï et boxe thaïlandaise ?',
        answer: 'Ces deux expressions désignent la même discipline. “Muay Thaï” est son nom thaïlandais ; “boxe thaïlandaise” est l’appellation courante en français.',
    },
    {
        question: 'Peut-on pratiquer le Muay Thaï à tout âge ?',
        answer: 'La pratique peut convenir à différents âges lorsque le contenu, l’intensité et l’encadrement sont adaptés au public et à sa condition.',
    },
]

const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Le Muay Thaï : histoire, culture et transmission des valeurs',
    description: 'Comprendre le Muay Thaï, l’art des 8 membres, sa culture, ses traditions et les valeurs transmises par Jaga Fight à Cagnes-sur-Mer.',
    mainEntityOfPage: 'https://www.jagafight.fr/muay-thai',
    image: 'https://www.jagafight.fr/og-image.jpg',
    author: {
        '@type': 'Organization',
        name: 'Jaga Fight',
        url: 'https://www.jagafight.fr',
    },
    publisher: {
        '@type': 'Organization',
        name: 'Jaga Fight',
        logo: {
            '@type': 'ImageObject',
            url: 'https://www.jagafight.fr/logo.png',
        },
    },
    about: ['Muay Thaï', 'Boxe thaïlandaise', 'Culture thaïlandaise', 'Valeurs du sport'],
}

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
}

export default function MuayThai() {
    return (
        <>
            <Breadcrumb
                items={[
                    { name: 'Le Muay Thaï', url: 'https://www.jagafight.fr/muay-thai' },
                ]}
            />

            <Helmet>
                <title>Muay Thaï : histoire, culture et valeurs | Jaga Fight</title>
                <meta
                    name="description"
                    content="Découvrez le Muay Thaï, l’art des 8 membres, sa culture et ses valeurs. Une transmission exigeante et accessible chez Jaga Fight à Cagnes-sur-Mer."
                />
                <link rel="canonical" href="https://www.jagafight.fr/muay-thai" />

                <meta property="og:title" content="Muay Thaï : histoire, culture et valeurs | Jaga Fight" />
                <meta
                    property="og:description"
                    content="Comprendre le Muay Thaï, ses techniques, ses traditions et les valeurs transmises chez Jaga Fight à Cagnes-sur-Mer."
                />
                <meta property="og:type" content="article" />
                <meta property="og:url" content="https://www.jagafight.fr/muay-thai" />
                <meta property="og:image" content="https://www.jagafight.fr/og-image.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Muay Thaï : histoire, culture et valeurs | Jaga Fight" />
                <meta
                    name="twitter:description"
                    content="Découvrez l’art des 8 membres, sa culture et les valeurs du Muay Thaï avec Jaga Fight."
                />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-image.jpg" />

                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>

            <article>
                <header className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a]">
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,0,113,0.18),transparent_42%)]" />
                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
                        <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                            Histoire • Culture • Transmission
                        </p>
                        <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl text-[#F5F5F0] leading-[0.92] text-balance max-w-4xl">
                            LE MUAY THAÏ,<br />BIEN PLUS QU’UN COMBAT
                        </h1>
                        <p className="mt-8 text-lg sm:text-xl text-[#F5F5F0]/70 max-w-2xl leading-relaxed text-pretty">
                            Art martial, sport de combat et héritage culturel thaïlandais, le Muay Thaï forme le corps autant que l’esprit. Sa pratique repose sur la technique, le respect et la transmission.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <a
                                href="#comprendre"
                                className="inline-flex justify-center px-7 py-3.5 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-wide rounded hover:bg-[#d60066] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] transition-colors"
                            >
                                Comprendre le Muay Thaï
                            </a>
                            <a
                                href="/inscription"
                                className="inline-flex justify-center px-7 py-3.5 border border-white/30 text-[#F5F5F0] font-semibold tracking-wide rounded hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] transition-[color,border-color]"
                            >
                                Découvrir nos cours
                            </a>
                        </div>
                    </div>
                </header>

                <nav aria-label="Sommaire de la page" className="bg-[#0d0d0d] border-b border-white/10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <p className="text-xs text-[#F5F5F0]/40 uppercase tracking-[0.18em] mb-3">Dans cette page</p>
                        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                            {[
                                ['#comprendre', 'Comprendre'],
                                ['#culture', 'Culture'],
                                ['#valeurs', 'Valeurs'],
                                ['#pratiquer', 'Pratiquer'],
                                ['#questions', 'Questions fréquentes'],
                            ].map(([href, label]) => (
                                <li key={href}>
                                    <a className="text-[#F5F5F0]/70 hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] transition-colors" href={href}>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <section id="comprendre" className="scroll-mt-24 py-20 sm:py-24 bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-center">
                            <div>
                                <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">L’art des 8 membres</p>
                                <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-none text-balance">
                                    QU’EST-CE QUE LE MUAY THAÏ ?
                                </h2>
                                <div className="mt-7 space-y-5 text-[#F5F5F0]/70 leading-relaxed text-pretty">
                                    <p>
                                        Le Muay Thaï, ou boxe thaïlandaise, est un sport de combat originaire de Thaïlande. Il est souvent appelé « art des 8 membres » parce qu’il mobilise les poings, les coudes, les genoux et les jambes. Le corps-à-corps, appelé clinch, fait également partie de son identité technique.
                                    </p>
                                    <p>
                                        Cette diversité développe la coordination, l’équilibre, l’endurance et la capacité à prendre une décision dans l’action. Mais apprendre le Muay Thaï ne consiste pas seulement à savoir frapper : il faut aussi savoir se placer, se protéger, contrôler sa puissance et travailler avec un partenaire.
                                    </p>
                                    <p>
                                        La pratique moderne peut prendre plusieurs formes : loisir, condition physique, apprentissage technique, self-défense ou compétition. Le contenu et l’intensité doivent toujours être adaptés à l’âge, à l’expérience et aux objectifs de chacun.
                                    </p>
                                </div>
                            </div>
                            <figure>
                                <img
                                    src={hichKnee}
                                    alt="Combat de Muay Thaï illustrant une technique de genou"
                                    width="960"
                                    height="640"
                                    loading="lazy"
                                    className="w-full aspect-[3/2] object-cover border border-white/10"
                                />
                                <figcaption className="mt-3 text-xs text-[#F5F5F0]/40">
                                    Le travail des genoux et du corps-à-corps fait partie de l’identité technique du Muay Thaï.
                                </figcaption>
                            </figure>
                        </div>

                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                            {weapons.map((weapon) => (
                                <div key={weapon.title} className="bg-[#0d0d0d] p-7">
                                    <span className="font-title text-4xl text-[#eb0071]">{weapon.number}</span>
                                    <h3 className="mt-2 font-title text-2xl text-[#F5F5F0]">{weapon.title}</h3>
                                    <p className="mt-3 text-sm text-[#F5F5F0]/60 leading-relaxed">{weapon.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="culture" className="scroll-mt-24 py-20 sm:py-24 bg-[#0d0d0d]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Un héritage vivant</p>
                            <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-none text-balance">
                                UNE CULTURE FONDÉE SUR LA GRATITUDE
                            </h2>
                            <p className="mt-7 text-lg text-[#F5F5F0]/70 leading-relaxed text-pretty">
                                Les traditions donnent au Muay Thaï une profondeur qui dépasse le résultat d’un combat. Elles rappellent que chaque pratiquant reçoit un savoir transmis par des professeurs, des camps et des générations d’athlètes.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="border-l-2 border-[#eb0071] pl-6 py-2">
                                <h3 className="font-title text-3xl text-[#F5F5F0]">Le Wai Kru</h3>
                                <p className="mt-3 text-[#F5F5F0]/65 leading-relaxed">
                                    Le Wai Kru est un rituel d’hommage accompli avant un combat. Il exprime la gratitude envers les professeurs et la lignée qui a transmis l’art. Dans la tradition sportive, il s’accompagne d’une séquence de mouvements appelée Ram Muay.
                                </p>
                            </div>
                            <div className="border-l-2 border-[#eb0071] pl-6 py-2">
                                <h3 className="font-title text-3xl text-[#F5F5F0]">Les symboles</h3>
                                <p className="mt-3 text-[#F5F5F0]/65 leading-relaxed">
                                    Le Mongkon porté sur la tête pendant le rituel et les Prajiad noués autour des bras peuvent accompagner le combattant. Leur sens appartient à une histoire, un camp et une transmission ; ils ne sont pas de simples accessoires.
                                </p>
                            </div>
                            <div className="border-l-2 border-[#eb0071] pl-6 py-2">
                                <h3 className="font-title text-3xl text-[#F5F5F0]">Le lien professeur–élève</h3>
                                <p className="mt-3 text-[#F5F5F0]/65 leading-relaxed">
                                    La technique se transmet par l’observation, la répétition et la correction. Le professeur pose un cadre ; l’élève apprend à l’écouter, à questionner avec respect et à devenir progressivement responsable de sa pratique.
                                </p>
                            </div>
                            <div className="border-l-2 border-[#eb0071] pl-6 py-2">
                                <h3 className="font-title text-3xl text-[#F5F5F0]">Une tradition qui évolue</h3>
                                <p className="mt-3 text-[#F5F5F0]/65 leading-relaxed">
                                    Le Muay Thaï est aujourd’hui pratiqué partout dans le monde, pour le loisir comme pour la compétition. Cette ouverture peut respecter ses racines lorsque la culture, les gestes et leur signification sont expliqués avec soin.
                                </p>
                            </div>
                        </div>

                        <aside className="mt-12 border border-[#eb0071]/40 bg-[#eb0071]/[0.06] p-7 sm:p-9">
                            <p className="text-xs text-[#eb0071] font-semibold tracking-[0.18em] uppercase">Les 5 piliers reconnus par l’IFMA</p>
                            <p className="mt-4 font-title text-3xl sm:text-4xl text-[#F5F5F0] text-balance">
                                Tradition · Respect · Honneur · Excellence · Fair-play
                            </p>
                        </aside>
                    </div>
                </section>

                <section id="valeurs" className="scroll-mt-24 py-20 sm:py-24 bg-[#0a0a0a]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
                            <div className="lg:sticky lg:top-24">
                                <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Grandir par la pratique</p>
                                <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-none text-balance">
                                    LES VALEURS SE TRANSMETTENT PAR L’ACTION
                                </h2>
                                <p className="mt-7 text-[#F5F5F0]/70 leading-relaxed text-pretty">
                                    Une valeur ne se résume pas à un mot affiché sur un mur. Elle se construit quand on salue son partenaire, que l’on contrôle un geste, que l’on accepte une correction ou que l’on aide quelqu’un à progresser.
                                </p>
                                <img
                                    src={respect}
                                    alt="Deux combattants de Muay Thaï se prennent dans les bras après un combat"
                                    width="1280"
                                    height="947"
                                    loading="lazy"
                                    className="mt-8 w-full aspect-[4/3] object-cover border border-white/10 grayscale"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {values.map((value, index) => (
                                    <div key={value.title} className="border border-white/10 p-7 hover:border-[#eb0071]/60 transition-colors">
                                        <span className="text-xs text-[#eb0071] font-semibold tracking-widest">0{index + 1}</span>
                                        <h3 className="mt-3 font-title text-3xl text-[#F5F5F0]">{value.title}</h3>
                                        <p className="mt-3 text-sm text-[#F5F5F0]/60 leading-relaxed">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pratiquer" className="scroll-mt-24 py-20 sm:py-24 bg-[#0d0d0d]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">À Cagnes-sur-Mer</p>
                            <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-none text-balance">
                                TRANSMETTRE LE MUAY THAÏ CHEZ JAGA FIGHT
                            </h2>
                            <p className="mt-7 text-lg text-[#F5F5F0]/70 leading-relaxed text-pretty">
                                Chez Jaga Fight, la progression technique s’inscrit dans un cadre exigeant et bienveillant. Chaque séance doit permettre de comprendre, d’essayer, de répéter et de progresser sans brûler les étapes.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {audiences.map((audience) => (
                                <div key={audience.title} className="bg-[#0a0a0a] border border-white/10 p-7">
                                    <h3 className="font-title text-2xl text-[#F5F5F0]">{audience.title}</h3>
                                    <p className="mt-3 text-sm text-[#F5F5F0]/60 leading-relaxed">{audience.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="border border-white/10 p-8">
                                <h3 className="font-title text-3xl text-[#F5F5F0]">Une séance progressive</h3>
                                <ol className="mt-6 space-y-4 text-[#F5F5F0]/65">
                                    <li><strong className="text-[#F5F5F0]">1. Préparer :</strong> mobilisation, échauffement et attention au corps.</li>
                                    <li><strong className="text-[#F5F5F0]">2. Comprendre :</strong> démonstration et explication de l’objectif technique.</li>
                                    <li><strong className="text-[#F5F5F0]">3. Répéter :</strong> travail aux paos, au sac ou avec un partenaire.</li>
                                    <li><strong className="text-[#F5F5F0]">4. Appliquer :</strong> exercices dirigés et situations adaptées au niveau.</li>
                                    <li><strong className="text-[#F5F5F0]">5. Récupérer :</strong> retour au calme et bilan des apprentissages.</li>
                                </ol>
                            </div>
                            <div className="border border-[#eb0071]/40 p-8 flex flex-col justify-between">
                                <div>
                                    <p className="text-[#eb0071] text-xs font-semibold tracking-[0.18em] uppercase">Votre premier pas</p>
                                    <h3 className="mt-3 font-title text-3xl text-[#F5F5F0]">Venez comme vous êtes</h3>
                                    <p className="mt-4 text-[#F5F5F0]/65 leading-relaxed">
                                        Vous n’avez pas besoin de connaître les codes ou d’être déjà en forme. L’encadrement sert précisément à vous donner des repères et à construire une pratique adaptée.
                                    </p>
                                </div>
                                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                    <a href="/inscription" className="inline-flex justify-center px-6 py-3 bg-[#eb0071] text-[#F5F5F0] font-semibold rounded hover:bg-[#d60066] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] transition-colors">
                                        S’inscrire
                                    </a>
                                    <a href="/coaching" className="inline-flex justify-center px-6 py-3 border border-white/25 text-[#F5F5F0] font-semibold rounded hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] transition-[color,border-color]">
                                        Voir le coaching
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="questions" className="scroll-mt-24 py-20 sm:py-24 bg-[#0a0a0a]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Questions fréquentes</p>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-none text-balance">
                            AVANT DE COMMENCER
                        </h2>

                        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                            {questions.map((item) => (
                                <details key={item.question} className="group py-6">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-[#F5F5F0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                                        <span>{item.question}</span>
                                        <span aria-hidden="true" className="text-2xl text-[#eb0071] transition-transform group-open:rotate-45">+</span>
                                    </summary>
                                    <p className="mt-4 max-w-3xl text-[#F5F5F0]/65 leading-relaxed text-pretty">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </article>
        </>
    )
}
