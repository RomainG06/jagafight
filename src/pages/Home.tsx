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
                <title>Club de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer (06) | Jaga Fight</title>
                <meta
                    name="description"
                    content="Jaga Fight est un club de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer dans les Alpes-Maritimes (06), proche de Nice. Cours adultes, enfants, débutants et compétiteurs, self-défense, stages et formation."
                />
                <meta name="keywords" content="Muay Thaï Cagnes-sur-Mer, boxe thaï Nice, cours boxe Cagnes, muay thai antibes, boxe thai 06, école boxe thaïlandaise côte d'azur, club boxe alpes maritimes, self-défense Cagnes, Jaga Fight" />
                <link rel="canonical" href="https://www.jagafight.fr/" />

                {/* Open Graph */}
                <meta property="og:title" content="Club de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer (06) | Jaga Fight" />
                <meta property="og:description" content="Cours de Boxe Thaï et Muay Thaï dans les Alpes-Maritimes (06)." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jagafight.fr/" />
                <meta property="og:image" content="https://www.jagafight.fr/og-image.jpg" />
                <meta property="og:locale" content="fr_FR" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Club de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer (06) | Jaga Fight" />
                <meta name="twitter:description" content="Club de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer dans les Alpes-Maritimes (06), proche de Nice. Cours adultes, enfants, débutants et compétiteurs, self-défense, stages et formation." />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-image.jpg" />

                {/* Structured Data - LocalBusiness */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": ["SportsActivityLocation", "LocalBusiness"],
                        "name": "Jaga Fight",
                        "description": "École de Muay Thaï à Cagnes-sur-Mer proposant des cours collectifs, self-défense, stages et formations diplômantes",
                        "url": "https://www.jagafight.fr",
                        "logo": "https://www.jagafight.fr/logo.png",
                        "image": "https://www.jagafight.fr/og-image.jpg",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Cagnes-sur-Mer",
                            "addressRegion": "Alpes-Maritimes",
                            "postalCode": "06800",
                            "addressCountry": "FR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "43.6633",
                            "longitude": "7.1481"
                        },
                        "telephone": "+33-XXX-XXX-XXX",
                        "email": "contact@jagafight.fr",
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
                                "name": "Cagnes-sur-Mer"
                            },
                            {
                                "@type": "City",
                                "name": "Nice"
                            },
                            {
                                "@type": "City",
                                "name": "Antibes"
                            }
                        ],
                        "founder": {
                            "@type": "Person",
                            "name": "Oualid OUMERZOUK",
                            "award": "Champion du monde Nokento Full Fight 2017"
                        },
                        "employee": {
                            "@type": "Person",
                            "name": "Hicham KILIC",
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
