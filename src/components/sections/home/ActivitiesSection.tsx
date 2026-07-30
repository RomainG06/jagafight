import React, { useState } from "react";

const activities = [
    {
        number: '01',
        title: 'Cours de Muay Thaï',
        public: 'Enfants · Ados · Adultes',
        objective: 'Apprentissage, discipline, confiance en soi',
        tag: 'Pratique principale',
        description:
            "Des séances adaptées à tous les niveaux pour découvrir et perfectionner la pratique du Muay Thaï. Au-delà de l'aspect sportif, les cours favorisent la discipline, le respect, la maîtrise de soi et le développement de la confiance personnelle."
    },
    {
        number: '02',
        title: 'Self-défense',
        public: 'Femmes victimes de violences',
        objective: 'Sécurité, reconstruction',
        tag: 'Accompagnement',
        description:
            "Un accompagnement bienveillant combinant techniques de protection, gestion du stress et renforcement de la confiance en soi. Ces ateliers visent à aider les participantes à retrouver un sentiment de sécurité et à se réapproprier leur espace de vie."
    },
    {
        number: '03',
        title: 'Ateliers bien-être',
        public: 'Personnes âgées',
        objective: 'Mobilité, lien social, santé',
        tag: 'Bien-être',
        description:
            "Des activités physiques douces et adaptées permettant d'entretenir la mobilité, l'équilibre et la condition physique tout en favorisant les échanges, la convivialité et le maintien du lien social."
    },
    {
        number: '04',
        title: "Stages d'aguerrissement",
        public: "Forces de l'ordre · Pros sécurité",
        objective: 'Renforcement physique et mental',
        tag: 'Pro & Élite',
        description:
            "Des stages intensifs conçus pour développer les capacités physiques, la résistance mentale et la gestion de situations exigeantes. Une approche complète adaptée aux professionnels confrontés à des environnements à forte pression."
    },
    {
        number: '05',
        title: 'Remobilisation par le sport',
        public: 'Jeunes en difficulté',
        objective: 'Prévention, repères, encadrement',
        tag: 'Social',
        description:
            "Le sport comme outil éducatif pour redonner confiance, recréer des repères et favoriser l'engagement personnel. Ce programme accompagne les jeunes dans un cadre structurant, fondé sur l'effort, le respect et la progression."
    },
    {
        number: '06',
        title: 'Parcours de formation diplômante',
        public: 'Jeunes · Adultes en insertion',
        objective: 'Qualification, professionnalisation',
        tag: 'Formation',
        description:
            "Des parcours de formation permettant l'acquisition de compétences reconnues et valorisables sur le marché du travail. L'objectif est de favoriser l'insertion professionnelle durable et l'accès à de nouvelles opportunités."
    },
    {
        number: '07',
        title: 'Événements sportifs',
        public: 'Grand public',
        objective: 'Rayonnement local',
        tag: 'Événementiel',
        description:
            "Organisation de rencontres, démonstrations et événements ouverts à tous afin de promouvoir la pratique sportive, renforcer la cohésion locale et créer des moments de partage autour des valeurs du sport."
    }
]

export default function ActivitiesSection() {
    const [activeActivity, setActiveActivity] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Activités
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        CE QUE NOUS PROPOSONS
                    </h2>
                </div>

                <div className="border-t border-white/10">
                    {activities.map((activity, index) => (
                        <React.Fragment key={index}>
                            <div
                                onMouseEnter={() => {
                                    setActiveActivity(index);
                                }}
                                onMouseLeave={() => setActiveActivity(null)}
                                onClick={() =>
                                    setActiveActivity(activeActivity === index ? null : index)
                                }
                                className="group relative border-b border-white/10 py-6 flex items-center gap-6 sm:gap-10 hover:bg-white/[0.03] transition-colors duration-200 px-2"
                            >
                                {/* Barre rouge au hover */}
                                <div className="absolute left-0 top-0 h-full w-0.5 bg-[#eb0071] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                                {/* Numéro */}
                                <span className="font-title text-3xl sm:text-4xl text-white/10 group-hover:text-[#ff0096]/40 transition-colors duration-300 w-12 shrink-0 text-right select-none">
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
                                <span className="hidden lg:block text-[10px] font-semibold tracking-[0.15em] uppercase text-[#eb0071] border border-[#eb0071]/40 px-2.5 py-1 shrink-0">
                                    {activity.tag}
                                </span>

                            </div>
                            {activeActivity === index && (
                                <p className="px-6 py-4 text-center text-sm text-[#F5F5F0]/60 leading-snug pointer-events-none">
                                    {activity.description}
                                </p>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}
