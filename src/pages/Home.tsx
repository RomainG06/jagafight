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
                <title>Club de Muay Thai à Saint-Laurent-du-Var (06) | Jaga Fight</title>
                <meta
                    name="description"
                    content="Jaga Fight est un club de Muay Thai (Boxe Thai) à Saint-Laurent-du-Var, proche de Cagnes-sur-Mer et Nice. Cours adultes, enfants, débutants et compétiteurs dans les Alpes-Maritimes."
                />
                <meta name="keywords" content="Muay Thaï (Boxe Thai) Saint-Laurent-du-Var, boxe thaï Cagnes-sur-Mer, boxe thaï Nice, cours boxe Antibes, club boxe Alpes-Maritimes, école boxe thaïlandaise Côte d'Azur, Jaga Fight" />
                <link rel="canonical" href="https://www.jagafight.fr/" />

                {/* Open Graph */}
                <meta property="og:title" content="Club de Muay Thai à Saint-Laurent-du-Var (06) | Jaga Fight" />
                <meta property="og:description" content="Cours de Boxe Thaï (Boxe Thai) et Muay Thaï dans les Alpes-Maritimes (06)." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jagafight.fr/" />
                <meta property="og:image" content="https://www.jagafight.fr/og-image.jpg" />
                <meta property="og:locale" content="fr_FR" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Club de Muay Thai à Saint-Laurent-du-Var (06) | Jaga Fight" />
                <meta name="twitter:description" content="Club de Muay Thai (Boxe Thai) à Saint-Laurent-du-Var, près de Cagnes-sur-Mer et Nice. Cours adultes, enfants, débutants et compétiteurs." />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-image.jpg" />

                {/* Structured Data - LocalBusiness */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": ["SportsActivityLocation", "LocalBusiness"],
                        "name": "Jaga Fight",
                        "description": "École de Muay Thaï à Saint-Laurent-du-Var proposant des cours collectifs, self-défense, stages et formations diplômantes",
                        "url": "https://www.jagafight.fr",
                        "logo": "https://www.jagafight.fr/logo.png",
                        "image": "https://www.jagafight.fr/og-image.jpg",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "864 Av. Pierre et Marie Curie",
                            "addressLocality": "Saint-Laurent-du-Var",
                            "addressRegion": "Alpes-Maritimes",
                            "postalCode": "06700",
                            "addressCountry": "FR"
                        },
                        "telephone": "+33 7 43 52 72 93",
                        "email": "agentpro.athlete@gmail.com",
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                            "opens": "09:00",
                            "closes": "21:00"
                        },
                        "priceRange": "€€",
                        "areaServed": [
                            {
                                "@type": "City",
                                "name": "Saint-Laurent-du-Var"
                            },
                            {
                                "@type": "City",
                                "name": "Cagnes-sur-Mer"
                            },
                            {
                                "@type": "City",
                                "name": "Nice"
                            },
                            {
                                "@type": "City",
                                "name": "Antibes"
                            },
                            {
                                "@type": "City",
                                "name": "Villeneuve-Loubet"
                            }
                        ],
                        "founder": {
                            "@type": "Person",
                            "name": "Oualid OUMERZOUK",
                            "award": "Champion du monde Nokento Full Fight 2017"
                        },
                        "employee": {
                            "@type": "Person",
                            "name": "Hicham",
                            "jobTitle": "Coach principal",
                            "award": "Champion d'Europe Muay Thaï"
                        }
                    })}
                </script>
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
                                Après le décès de Oualid, Hicham a repris le flambeau pour poursuivre cette mission. En 2026, Jaga Fight ouvre ses portes à Saint-Laurent-du-Var et accueille les pratiquants de toute la Côte d’Azur.
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
                            <a
                                href="/muay-thai"
                                className="block mt-3 text-sm text-[#F5F5F0]/60 hover:text-[#eb0071] transition-colors font-semibold"
                            >
                                Comprendre la culture du Muay Thaï →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <LocalSection />
        </>
    )
}
