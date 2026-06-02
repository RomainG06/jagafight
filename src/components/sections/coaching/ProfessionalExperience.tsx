const experiences = [
    {
        title: 'Directeur de Centre Communal d\'Action Sociale (CCAS)',
        desc: 'Gestion d\'une structure sociale au service des publics vulnérables. Management d\'équipes et pilotage de projets d\'insertion.',
    },
    {
        title: 'Directeur de cinéma CGR',
        desc: 'Direction opérationnelle d\'un établissement culturel majeur. Organisation, gestion et animation d\'une équipe.',
    },
    {
        title: 'Gestion de la salle IFO à Montluçon',
        desc: 'Création et développement d\'un club de sports de combat, de la structuration aux premiers résultats sportifs.',
    },
    {
        title: 'Organisation de galas "Gladiators Battle"',
        desc: '5 éditions organisées, diffusées sur Canal+. Production complète : sportifs, logistique, communication, partenaires.',
    },
    {
        title: 'Encadrement de jeunes dans quartiers prioritaires',
        desc: 'Programmes de prévention et d\'insertion via le sport de combat. Accompagnement individualisé et ancrage territorial.',
    },
]

export default function ProfessionalExperience() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Parcours
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        EXPÉRIENCE<br />PROFESSIONNELLE
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experiences.map((exp) => (
                        <div
                            key={exp.title}
                            className="border border-white/10 p-6 hover:border-[#8B0020]/40 transition-colors"
                        >
                            <div className="w-8 h-0.5 bg-[#8B0020] mb-4" />
                            <h3 className="text-[#F5F5F0] text-sm mb-3">{exp.title}</h3>
                            <p className="text-sm text-[#F5F5F0]/50 leading-relaxed">{exp.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
