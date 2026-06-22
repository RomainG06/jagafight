import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import TrainingSection from '../components/sections/home/TrainingSection'
import LocalSection from '../components/sections/home/LocalSection'

export default function Formations() {
    return (
        <>
            <Helmet>
                <title>Formations diplômantes — Jaga Fight</title>
                <meta
                    name="description"
                    content="Devenez coach de Muay Thaï avec Jaga Fight. Parcours certifiants CQP, BPJEPS, BMF, DEJEPS et DESJEPS. Accompagnement complet et partenariats fédéraux."
                />
                <meta name="keywords" content="formation coach Muay Thaï, CQP boxe thaï, BPJEPS sports de combat, devenir coach boxe, formation diplômante Cagnes-sur-Mer" />
                <link rel="canonical" href="https://www.jagafight.fr/formations" />
            </Helmet>

            {/* Hero section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
                        Votre parcours professionnel
                    </span>
                    <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl text-[#F5F5F0] mb-6">
                        FORMATIONS<br />DIPLÔMANTES
                    </h1>
                    <p className="text-lg text-[#F5F5F0]/70 max-w-2xl mx-auto leading-relaxed">
                        Transformez votre passion en métier. Jaga Fight vous accompagne vers les certifications reconnues pour devenir coach professionnel de Muay Thaï et sports de combat.
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
                    <Link
                        to="/preinscription"
                        className="inline-flex items-center px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-wide rounded hover:bg-[#d60066] transition-colors"
                    >
                        Candidater maintenant
                    </Link>
                </div>
            </section>
        </>
    )
}
