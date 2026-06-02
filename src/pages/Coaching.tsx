import { Link } from 'react-router-dom'
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
                    <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Page 2
                    </span>
                    <h1 className="font-title text-6xl sm:text-8xl text-[#F5F5F0]">MES COACHINGS</h1>
                </div>
            </section> */}

            <CoachHero />
            <ProfessionalExperience />
            <CoachingCards />

            {/* Citation coach */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <blockquote className="border border-[#8B0020]/40 p-10 relative">
                        <div className="font-title text-6xl text-[#8B0020]/20 absolute top-4 left-6 leading-none">"</div>
                        <p className="font-title text-2xl sm:text-3xl text-[#F5F5F0] leading-tight">
                            Chaque entraînement est aussi une opportunité de grandir, de s'insérer et de reconstruire.
                        </p>
                        <footer className="mt-4 text-sm text-[#F5F5F0]/40 tracking-wide">
                            — Hicham KILIC, Coach Jaga Fight
                        </footer>
                    </blockquote>
                    <div className="mt-12">
                        <Link
                            to="/preinscription"
                            className="inline-flex items-center px-8 py-4 bg-[#8B0020] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#a3002a] transition-colors"
                        >
                            Me préinscrire
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
