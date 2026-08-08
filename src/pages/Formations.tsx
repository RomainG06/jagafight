import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'
import TrainingSection from '../components/sections/home/TrainingSection'
import LocalSection from '../components/sections/home/LocalSection'

export default function Formations() {
    return (
        <>
            <Breadcrumb
                items={[
                    { name: 'Formations diplômantes', url: 'https://www.jagafight.fr/formations' }
                ]}
            />

            <Helmet>
                <title>Formation Coach Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer (06) | BPJEPS, CQP - Jaga Fight</title>
                <meta
                    name="description"
                    content="Devenez coach de Boxe Thaï (Muay Thaï) avec Jaga Fight à Cagnes-sur-Mer dans les Alpes-Maritimes (06). Formations CQP, BPJEPS, BMF, DEJEPS et DESJEPS reconnues pour enseigner les sports de combat."
                />
                <meta
                    name="keywords"
                    content="formation coach boxe thaï, formation coach muay thaï, BPJEPS sports de combat, CQP boxe thaï, devenir coach boxe thaï, formation BPJEPS Alpes-Maritimes, formation BPJEPS 06, Cagnes-sur-Mer, Nice"
                />
                <link rel="canonical" href="https://www.jagafight.fr/formations" />

                {/* Open Graph */}
                <meta property="og:title" content="Formation Coach Boxe Thaï (Muay Thaï) | Jaga Fight" />
                <meta
                    property="og:description"
                    content="Formez-vous au métier de coach de Boxe Thaï (Muay Thaï) à Cagnes-sur-Mer. CQP, BPJEPS, DEJEPS et DESJEPS."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jagafight.fr/formations" />
                <meta property="og:image" content="https://www.jagafight.fr/og-formations.jpg" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Formation Coach Boxe Thaï (Muay Thaï) | Jaga Fight" />
                <meta
                    name="twitter:title"
                    content="Formation Coach Boxe Thaï (Muay Thaï) | Jaga Fight"
                />

                <meta
                    name="twitter:description"
                    content="Devenez coach professionnel de Boxe Thaï (Muay Thaï) grâce aux formations Jaga Fight à Cagnes-sur-Mer."
                />
                <meta name="twitter:image" content="https://www.jagafight.fr/og-formations.jpg" />

                {/* Structured Data - Course */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        "name": "Formation professionnelle Coach Muay Thaï",
                        "description": "Parcours complet pour devenir coach professionnel de Muay Thaï, du CQP au DESJEPS. Formations diplômantes reconnues par le Ministère des Sports et les fédérations.",
                        "provider": {
                            "@type": "SportsActivityLocation",
                            "name": "Jaga Fight",
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Cagnes-sur-Mer",
                                "addressRegion": "Alpes-Maritimes",
                                "postalCode": "06800",
                                "addressCountry": "FR"
                            }
                        },
                        "courseCode": "CQP / BPJEPS / BMF / DEJEPS / DESJEPS",
                        "educationalCredentialAwarded": [
                            {
                                "@type": "EducationalOccupationalCredential",
                                "credentialCategory": "CQP",
                                "name": "Certificat de Qualification Professionnelle Moniteur Arts Martiaux"
                            },
                            {
                                "@type": "EducationalOccupationalCredential",
                                "credentialCategory": "BPJEPS",
                                "name": "Brevet Professionnel de la Jeunesse, de l'Éducation Populaire et du Sport mention Boxe Thaï"
                            },
                            {
                                "@type": "EducationalOccupationalCredential",
                                "credentialCategory": "BMF",
                                "name": "Brevet Moniteur Fédéral"
                            },
                            {
                                "@type": "EducationalOccupationalCredential",
                                "credentialCategory": "DEJEPS",
                                "name": "Diplôme d'État de la Jeunesse, de l'Éducation Populaire et du Sport"
                            },
                            {
                                "@type": "EducationalOccupationalCredential",
                                "credentialCategory": "DESJEPS",
                                "name": "Diplôme d'État Supérieur de la Jeunesse, de l'Éducation Populaire et du Sport"
                            }
                        ],
                        "hasCourseInstance": {
                            "@type": "CourseInstance",
                            "courseMode": "Blended",
                            "courseWorkload": "Variable selon le diplôme",
                            "instructor": {
                                "@type": "Person",
                                "name": "Hicham",
                                "jobTitle": "Formateur diplômé BPJEPS",
                                "award": "Champion d'Europe Muay Thaï"
                            }
                        },
                        "occupationalCredentialAwarded": "Coach professionnel de Muay Thaï",
                        "about": [
                            "Muay Thaï",
                            "Boxe Thaïlandaise",
                            "Pédagogie sportive",
                            "Formation professionnelle"
                        ]
                    })}
                </script>
            </Helmet>

            {/* Hero section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
                        Votre parcours professionnel
                    </span>
                    <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl text-[#F5F5F0] mb-6">
                        FORMATION COACH<br />
                        BOXE THAÏ
                    </h1>
                    <p className="text-lg text-[#F5F5F0]/70 max-w-2xl mx-auto leading-relaxed">
                        CQP • BPJEPS • BMF • DEJEPS • DESJEPS à Cagnes-sur-Mer (Alpes-Maritimes - 06)
                    </p>
                </div>
            </section>

            {/* Training certifications */}
            <TrainingSection />

            {/* Comment ça se passe */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            Le processus
                        </span>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                            COMMENT ÇA SE PASSE
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Tutorat individualisé',
                                desc: 'Un accompagnement personnalisé avec des coaches diplômés pour construire votre parcours de formation adapté à vos objectifs.',
                            },
                            {
                                step: '02',
                                title: 'Stages pratiques',
                                desc: 'Immersion en salle avec encadrement de cours réels, feedback terrain et développement de vos compétences pédagogiques.',
                            },
                            {
                                step: '03',
                                title: 'Préparation aux tests',
                                desc: 'Entraînement technique, physique et théorique pour réussir les tests d\'entrée et validations des certifications visées.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="border border-white/10 p-8 hover:border-[#eb0071]/60 transition-colors">
                                <span className="font-title text-5xl text-[#eb0071]/20 block mb-4">{item.step}</span>
                                <h3 className="font-title text-2xl text-[#F5F5F0] mb-3">{item.title}</h3>
                                <p className="text-[#F5F5F0]/60 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partenaires fédéraux */}
            <LocalSection />

            {/* CTA */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-title text-4xl sm:text-5xl text-[#F5F5F0] mb-6">
                        PRÊT À VOUS LANCER ?
                    </h2>
                    <p className="text-[#F5F5F0]/70 mb-8 leading-relaxed">
                        Contactez-nous pour échanger sur votre projet professionnel et construire ensemble votre parcours de formation.
                    </p>
                    <a
                        href="/preinscription"
                        className="inline-flex items-center px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-wide rounded hover:bg-[#d60066] transition-colors"
                    >
                        Candidater maintenant
                    </a>
                </div>
            </section>
        </>
    )
}
