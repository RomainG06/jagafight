import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/sections/home/HeroSection'
import AboutSection from '../components/sections/home/AboutSection'
import ValuesSection from '../components/sections/home/ValuesSection'
import ActivitiesSection from '../components/sections/home/ActivitiesSection'
import HistorySection from '../components/sections/home/HistorySection'
import TrainingSection from '../components/sections/home/TrainingSection'
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
            <AboutSection />
            <ValuesSection />
            <ActivitiesSection />
            <HistorySection />
            <TrainingSection />
            <LocalSection />
        </>
    )
}
