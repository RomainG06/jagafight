const activities = [
    {
        number: '01',
        title: 'Cours de Muay Thaï',
        public: 'Enfants · Ados · Adultes',
        objective: 'Apprentissage, discipline, confiance en soi',
        tag: 'Pratique principale',
    },
    {
        number: '02',
        title: 'Self-défense',
        public: 'Femmes victimes de violences',
        objective: 'Sécurité, reconstruction',
        tag: 'Accompagnement',
    },
    {
        number: '03',
        title: 'Ateliers bien-être',
        public: 'Personnes âgées',
        objective: 'Mobilité, lien social, santé',
        tag: 'Bien-être',
    },
    {
        number: '04',
        title: "Stages d'aguerrissement",
        public: "Forces de l'ordre · Pros sécurité",
        objective: 'Renforcement physique et mental',
        tag: 'Pro & Élite',
    },
    {
        number: '05',
        title: 'Remobilisation par le sport',
        public: 'Jeunes en difficulté',
        objective: 'Prévention, repères, encadrement',
        tag: 'Social',
    },
    {
        number: '06',
        title: 'Parcours de formation diplômante',
        public: 'Jeunes · Adultes en insertion',
        objective: 'Qualification, professionnalisation',
        tag: 'Formation',
    },
    {
        number: '07',
        title: 'Événements sportifs',
        public: 'Grand public',
        objective: 'Rayonnement local',
        tag: 'Événementiel',
    },
]

export default function ActivitiesSection() {
    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Activités
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        CE QUE NOUS PROPOSONS
                    </h2>
                </div>

                <div className="border-t border-white/10">
                    {activities.map((activity) => (
                        <div
                            key={activity.title}
                            className="group relative border-b border-white/10 py-6 flex items-center gap-6 sm:gap-10 hover:bg-white/[0.03] transition-colors duration-200 px-2"
                        >
                            {/* Barre rouge au hover */}
                            <div className="absolute left-0 top-0 h-full w-0.5 bg-[#8B0020] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                            {/* Numéro */}
                            <span className="font-title text-3xl sm:text-4xl text-white/10 group-hover:text-[#8B0020]/40 transition-colors duration-300 w-12 shrink-0 text-right select-none">
                                {activity.number}
                            </span>

                            {/* Titre */}
                            <h3 className="font-title text-lg sm:text-2xl text-[#F5F5F0] group-hover:text-white transition-colors duration-200 flex-1 min-w-0 leading-tight">
                                {activity.title}
                            </h3>

                            {/* Méta */}
                            <div className="hidden md:flex flex-col items-end gap-1 shrink-0 text-right">
                                <span className="text-xs text-[#F5F5F0]/40 leading-snug">{activity.public}</span>
                                <span className="text-xs text-[#F5F5F0]/60 leading-snug">{activity.objective}</span>
                            </div>

                            {/* Tag */}
                            <span className="hidden lg:block text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B0020] border border-[#8B0020]/40 px-2.5 py-1 shrink-0">
                                {activity.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
