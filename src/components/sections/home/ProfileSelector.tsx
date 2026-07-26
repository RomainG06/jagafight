export default function ProfileSelector() {
    const profiles = [
        {
            title: 'Je veux pratiquer',
            description: 'Découvrir le Muay Thaï, la self-défense ou les ateliers bien-être',
            to: '#activites',
        },
        {
            title: 'Je veux être coaché',
            description: 'Accompagnement personnalisé, stages d\'aguerrissement, préparation physique',
            to: '/coaching',
        },
        {
            title: 'Je veux devenir coach',
            description: 'Parcours certifiants CQP, BPJEPS, BMF, DEJEPS et DESJEPS',
            to: '/formations',
        },
    ]

    const handleScrollToActivities = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.currentTarget.getAttribute('href') === '#activites') {
            e.preventDefault()
            const activitiesSection = document.getElementById('activites')
            if (activitiesSection) {
                activitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }
    }

    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Trouvez votre chemin
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        QUI ÊTES-VOUS ?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {profiles.map((profile) => (
                        <a
                            key={profile.title}
                            href={profile.to}
                            onClick={handleScrollToActivities}
                            className="group border border-white/10 p-8 hover:border-[#eb0071] transition-all duration-300 hover:scale-105"
                        >
                            <h3 className="font-title text-2xl text-[#F5F5F0] mb-3 group-hover:text-[#eb0071] transition-colors">
                                {profile.title}
                            </h3>
                            <p className="text-[#F5F5F0]/60 text-sm leading-relaxed">
                                {profile.description}
                            </p>
                            <div className="mt-6 flex items-center text-[#eb0071] text-sm font-semibold">
                                <span>Découvrir</span>
                                <svg
                                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
