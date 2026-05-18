const activities = [
    {
        title: 'Cours de Muay Thaï',
        public: 'Enfants, ados, adultes',
        objective: 'Apprentissage, discipline, confiance en soi',
        color: 'border-[#8B0020]',
    },
    {
        title: 'Self-défense',
        public: 'Femmes victimes de violences',
        objective: 'Sécurité, reconstruction',
        color: 'border-white/20',
    },
    {
        title: 'Ateliers bien-être',
        public: 'Personnes âgées',
        objective: 'Mobilité, lien social, santé',
        color: 'border-white/20',
    },
    {
        title: "Stages d'aguerrissement",
        public: 'Forces de l\'ordre / pros sécurité',
        objective: 'Renforcement physique et mental',
        color: 'border-white/20',
    },
    {
        title: 'Remobilisation par le sport',
        public: 'Jeunes en difficulté',
        objective: 'Prévention, repères, encadrement',
        color: 'border-white/20',
    },
    {
        title: 'Parcours de formation diplômante',
        public: 'Jeunes, adultes en insertion',
        objective: 'Qualification, professionnalisation',
        color: 'border-white/20',
    },
    {
        title: 'Événements sportifs',
        public: 'Grand public',
        objective: 'Rayonnement local',
        color: 'border-white/20',
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity, i) => (
                        <div
                            key={activity.title}
                            className={`border-l-2 ${activity.color} bg-white/5 p-6 hover:bg-white/8 transition-colors ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                        >
                            <h3 className="font-title text-xl text-[#F5F5F0] mb-3">{activity.title}</h3>
                            <div className="space-y-1">
                                <p className="text-xs text-[#8B0020] font-medium tracking-wide uppercase">
                                    {activity.public}
                                </p>
                                <p className="text-sm text-[#F5F5F0]/60">{activity.objective}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
