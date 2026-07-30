import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../components/common/Breadcrumb'
import HistorySection from '../components/sections/home/HistorySection'
import ValuesSection from '../components/sections/home/ValuesSection'

export default function NotreAdn() {
    return (
        <>
            <Breadcrumb 
                items={[
                    { name: 'Notre ADN', url: 'https://www.jagafight.fr/notre-adn' }
                ]} 
            />
            
            <Helmet>
                <title>Notre ADN — Histoire, valeurs et équipe | Jaga Fight</title>
                <meta
                    name="description"
                    content="Découvrez l'histoire de Jaga Fight, nos 5 valeurs fondatrices et l'équipe qui porte le projet. De Perpignan à Cagnes-sur-Mer, une vision exigeante du Muay Thaï."
                />
                <meta name="keywords" content="histoire Jaga Fight, Oualid OUMERZOUK, Hicham KILIC, valeurs Muay Thaï, école sports de combat Cagnes" />
                <link rel="canonical" href="https://www.jagafight.fr/notre-adn" />
            </Helmet>

            {/* Hero section */}
            <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-6 block">
                        Qui sommes-nous
                    </span>
                    <h1 className="font-title text-6xl sm:text-7xl lg:text-8xl text-[#F5F5F0] mb-6">
                        NOTRE<br />ADN
                    </h1>
                    <p className="text-lg text-[#F5F5F0]/70 max-w-2xl mx-auto leading-relaxed">
                        Une histoire, des valeurs et une vision. Jaga Fight porte l'héritage de son fondateur Oualid et continue de transmettre une pratique exigeante et transformatrice.
                    </p>
                </div>
            </section>

            {/* Histoire */}
            <HistorySection />

            {/* Valeurs */}
            <ValuesSection />

            {/* L'équipe */}
            <section className="py-24 bg-[#0d0d0d]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            L'équipe
                        </span>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                            CEUX QUI PORTENT<br />LE PROJET
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12 max-w-4xl mx-auto">
                        {/* Hicham */}
                        <div className="border border-white/10 p-8 hover:border-[#eb0071]/60 transition-colors">
                            <h3 className="font-title text-3xl text-[#F5F5F0] mb-2">Hicham KILIC</h3>
                            <span className="text-[#eb0071] text-sm font-semibold tracking-wide block mb-4">
                                Directeur technique & Coach principal
                            </span>
                            <p className="text-[#F5F5F0]/70 leading-relaxed mb-4">
                                Plus de 20 ans d'expérience en Muay Thaï, 27 combats professionnels, Champion d'Europe 2018. Diplômé DEJEPS et DESJEPS, Hicham a repris le flambeau de Jaga Fight pour poursuivre la vision du fondateur.
                            </p>
                            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed">
                                Expert en accompagnement de publics variés (forces de l'ordre, jeunes en difficulté, sportifs de haut niveau), il porte une approche exigeante et bienveillante de la transmission.
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-[#F5F5F0]/50 mt-12 text-sm">
                        + Une équipe de coaches qualifiés et passionnés, engagés au quotidien pour transmettre l'art du Muay Thaï.
                    </p>
                </div>
            </section>
        </>
    )
}
