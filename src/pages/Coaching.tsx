import { Helmet } from 'react-helmet-async'
import CoachHero from '../components/sections/coaching/CoachHero'
import ProfessionalExperience from '../components/sections/coaching/ProfessionalExperience'
import CoachingCards from '../components/sections/coaching/CoachingCards'

export default function Coaching() {
    return (
        <>
            <Helmet>
                <title>Coaching Muay Thaï — Hicham KILIC | Jaga Fight Cagnes-sur-Mer</title>
                <meta
                    name="description"
                    content="Hicham KILIC, Champion d'Europe de Muay Thaï, vous accompagne. Cours collectifs, particuliers, stages intensifs et formation diplômante à Cagnes-sur-Mer."
                />
                <meta name="keywords" content="coaching Muay Thaï Cagnes, cours boxe thaï 06, Hicham Kilic coach, formation BPJEPS Muay Thaï" />
                <link rel="canonical" href="https://www.jagafight.fr/coaching" />
            </Helmet>

            {/* Hero page */}
            {/*             <section className="py-16 bg-[#0a0a0a] border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Page 2
                    </span>
                    <h1 className="font-title text-6xl sm:text-8xl text-[#F5F5F0]">MES COACHINGS</h1>
                </div>
            </section> */}

            <CoachHero />
            <ProfessionalExperience />

            {/* Pour qui ? */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            Publics accompagnés
                        </span>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                            POUR QUI ?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Forces de l\'ordre',
                                desc: 'Préparation physique et mentale adaptée aux exigences des métiers de la sécurité. Gestion du stress, techniques d\'intervention, conditionnement intensif.',
                            },
                            {
                                title: 'Sportifs professionnels',
                                desc: 'Accompagnement technique et tactique pour les compétiteurs. Préparation aux combats, sparring de haut niveau, stratégie et performance.',
                            },
                            {
                                title: 'Jeunes en difficulté',
                                desc: 'Encadrement structurant pour retrouver des repères. Le sport comme levier d\'insertion, de reconstruction et de développement personnel.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="border border-white/10 p-8 hover:border-[#eb0071]/60 transition-colors">
                                <h3 className="font-title text-2xl text-[#F5F5F0] mb-4">{item.title}</h3>
                                <p className="text-[#F5F5F0]/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stages d'aguerrissement */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                                Stages intensifs
                            </span>
                            <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-6">
                                STAGES<br />D'AGUERRISSEMENT
                            </h2>
                            <p className="text-[#F5F5F0]/70 leading-relaxed mb-4">
                                Des stages intensifs conçus pour développer les capacités physiques, la résistance mentale et la gestion de situations exigeantes.
                            </p>
                            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed">
                                Une approche complète adaptée aux professionnels confrontés à des environnements à forte pression : forces de l'ordre, agents de sécurité, militaires et sportifs de haut niveau.
                            </p>
                        </div>
                        <div className="border border-[#eb0071]/40 p-8">
                            <ul className="space-y-4">
                                {[
                                    'Renforcement physique et cardio-vasculaire',
                                    'Techniques de combat et self-défense opérationnelle',
                                    'Gestion du stress et de l\'adrénaline',
                                    'Travail en conditions réalistes',
                                    'Accompagnement mental et tactique',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-[#eb0071] text-lg flex-shrink-0">✓</span>
                                        <span className="text-[#F5F5F0]/70">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Remobilisation par le sport */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 border border-[#eb0071]/40 p-8">
                            <ul className="space-y-4">
                                {[
                                    'Recréer des repères et une routine structurante',
                                    'Développer la confiance en soi et l\'estime personnelle',
                                    'Favoriser l\'engagement et la persévérance',
                                    'Travailler en groupe et créer du lien social',
                                    'Accompagnement individualisé et bienveillant',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-[#eb0071] text-lg flex-shrink-0">✓</span>
                                        <span className="text-[#F5F5F0]/70">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                                Insertion sociale
                            </span>
                            <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-6">
                                REMOBILISATION<br />PAR LE SPORT
                            </h2>
                            <p className="text-[#F5F5F0]/70 leading-relaxed mb-4">
                                Le sport comme outil éducatif pour redonner confiance, recréer des repères et favoriser l'engagement personnel.
                            </p>
                            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed">
                                Ce programme accompagne les jeunes en difficulté dans un cadre structurant, fondé sur l'effort, le respect et la progression. L'objectif : retrouver un équilibre et construire un projet personnel solide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <CoachingCards />

            {/* Citation coach */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <blockquote className="border border-[#eb0071]/40 p-10 relative">
                        <div className="font-title text-6xl text-[#eb0071]/20 absolute top-4 left-6 leading-none">"</div>
                        <p className="font-title text-2xl sm:text-3xl text-[#F5F5F0] leading-tight">
                            Chaque entraînement est aussi une opportunité de grandir, de s'insérer et de reconstruire.
                        </p>
                        <footer className="mt-4 text-sm text-[#F5F5F0]/40 tracking-wide">
                            — Hicham KILIC, Coach Jaga Fight
                        </footer>
                    </blockquote>
                    <div className="mt-12">
                        <p className="text-[#F5F5F0]/70 mb-6 leading-relaxed">
                            Vous souhaitez un accompagnement personnalisé ? Parlons de votre projet.
                        </p>
                        <a
                            href="mailto:contact@jagafight.fr"
                            className="inline-flex items-center px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#d60066] transition-colors"
                        >
                            Nous contacter
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
