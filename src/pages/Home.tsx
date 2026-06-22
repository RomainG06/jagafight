import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/sections/home/HeroSection'
import ProfileSelector from '../components/sections/home/ProfileSelector'
import AboutSection from '../components/sections/home/AboutSection'
import ActivitiesSection from '../components/sections/home/ActivitiesSection'
import LocalSection from '../components/sections/home/LocalSection'

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Jaga Fight — École de Muay Thaï à Cagnes-sur-Mer</title>
                <meta
                    name="description"
                    content="Jaga Fight, école de Muay Thaï à Cagnes-sur-Mer. Cours collectifs, self-défense, stages, formation diplômante. Sport, éducation, transformation."
                />
                <meta name="keywords" content="Muay Thaï Cagnes-sur-Mer, cours boxe Cagnes, self-défense 06, école boxe thaïlandaise, Jaga Fight" />
                <link rel="canonical" href="https://www.jagafight.fr/" />
            </Helmet>

            <HeroSection />
            <ProfileSelector />
            <AboutSection />
            <div id="activites">
                <ActivitiesSection />
            </div>

            {/* Histoire & Valeurs — Résumé court */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Histoire résumée */}
                        <div>
                            <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                                Notre histoire
                            </span>
                            <h2 className="font-title text-4xl sm:text-5xl text-[#F5F5F0] mb-6">
                                L'HÉRITAGE JAGA
                            </h2>
                            <p className="text-[#F5F5F0]/70 leading-relaxed mb-4">
                                Fondée à Perpignan par Oualid OUMERZOUK, ancien légionnaire du 2e REP et champion du monde Nokento Full Fight 2017, Jaga Fight a été créée avec une vision exigeante : former des pratiquants complets, techniquement affûtés et mentalement solides.
                            </p>
                            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed mb-6">
                                Après le décès de Oualid, Hicham KILIC a repris le flambeau pour poursuivre cette mission. En 2025, Jaga Fight ouvre ses portes à Cagnes-sur-Mer avec le soutien de la Ville, de l'AFMT, de la FFKMDA et du Ministère des Sports.
                            </p>
                            <blockquote className="border-l-2 border-[#eb0071] pl-4 italic text-[#F5F5F0]/60 text-sm">
                                « Polir son esprit pour être fier de ce que l'on voit dans son miroir. »
                                <footer className="mt-2 text-xs text-[#F5F5F0]/40">— Oualid OUMERZOUK</footer>
                            </blockquote>
                        </div>

                        {/* Valeurs résumées */}
                        <div>
                            <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                                Nos valeurs
                            </span>
                            <h2 className="font-title text-4xl sm:text-5xl text-[#F5F5F0] mb-6">
                                CE QUI NOUS GUIDE
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: 'Respect',
                                        desc: 'Le respect de soi, de l\'adversaire et du collectif est le premier enseignement du Muay Thaï.',
                                    },
                                    {
                                        title: 'Discipline',
                                        desc: 'La régularité et l\'effort construisent le caractère. Chaque session est un pas vers la meilleure version de soi.',
                                    },
                                    {
                                        title: 'Inclusion',
                                        desc: 'Peu importe l\'âge, le niveau ou le parcours — Jaga Fight est ouvert à tous, sans exception.',
                                    },
                                ].map((value) => (
                                    <div key={value.title} className="flex gap-4">
                                        <div className="w-1 bg-[#eb0071] flex-shrink-0 rounded-full" />
                                        <div>
                                            <h3 className="font-title text-xl text-[#F5F5F0] mb-1">{value.title}</h3>
                                            <p className="text-sm text-[#F5F5F0]/60 leading-relaxed">{value.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="/notre-adn"
                                className="inline-block mt-6 text-sm text-[#eb0071] hover:text-[#ff0096] transition-colors font-semibold"
                            >
                                Découvrir toutes nos valeurs →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <LocalSection />
        </>
    )
}
