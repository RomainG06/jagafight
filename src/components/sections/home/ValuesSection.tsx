const values = [
    {
        icon: '🤝',
        title: 'Respect',
        description: "Le respect de soi, de l'adversaire et du collectif est le premier enseignement du Muay Thaï.",
    },
    {
        icon: '⚔️',
        title: 'Discipline',
        description: 'La régularité et l\'effort construit le caractère. Chaque session est un pas vers la meilleure version de soi.',
    },
    {
        icon: '🫂',
        title: 'Solidarité',
        description: 'On progresse ensemble. L\'entraide et la bienveillance sont au cœur de notre pratique quotidienne.',
    },
    {
        icon: '🌍',
        title: 'Inclusion',
        description: 'Peu importe l\'âge, le niveau ou le parcours — Jaga Fight est ouvert à tous, sans exception.',
    },
    {
        icon: '🔥',
        title: 'Engagement',
        description: "S'engager, c'est se dépasser. Nous accompagnons chaque pratiquant dans ses objectifs avec exigence et bienveillance.",
    },
]

export default function ValuesSection() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Nos valeurs
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        CE QUI NOUS GUIDE
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {values.map((value) => (
                        <div
                            key={value.title}
                            className="group border border-white/10 p-6 hover:border-[#8B0020]/60 transition-colors"
                        >
                            <span className="text-3xl mb-4 block">{value.icon}</span>
                            <h3 className="font-title text-2xl text-[#F5F5F0] mb-3 group-hover:text-[#8B0020] transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-sm text-[#F5F5F0]/50 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
