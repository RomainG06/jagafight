import respectImg from '../../../assets/respect.jpg'
import disciplineImg from '../../../assets/hichKnee.jpg'
import solidariteImg from '../../../assets/solidarite.jpg'
import inclusionImg from '../../../assets/inclusion.jpg'
import engagementImg from '../../../assets/engagement.jpg'

const values = [
    {
        title: 'Respect',
        description: "Le respect de soi, de l'adversaire et du collectif est le premier enseignement du Muay Thaï.",
        img: respectImg,
        imgPosition: 'object-center',
    },
    {
        title: 'Discipline',
        description: "La régularité et l'effort construit le caractère. Chaque session est un pas vers la meilleure version de soi.",
        img: disciplineImg,
        imgPosition: 'object-center',
    },
    {
        title: 'Solidarité',
        description: "On progresse ensemble. L'entraide et la bienveillance sont au cœur de notre pratique quotidienne.",
        img: solidariteImg,
        imgPosition: 'object-top',
    },
    {
        title: 'Inclusion',
        description: 'Peu importe l\'âge, le niveau ou le parcours — Jaga Fight est ouvert à tous, sans exception.',
        img: inclusionImg,
        imgPosition: 'object-center',
    },
    {
        title: 'Engagement',
        description: "S'engager, c'est se dépasser. Nous accompagnons chaque pratiquant dans ses objectifs avec exigence et bienveillance.",
        img: engagementImg,
        imgPosition: 'object-center',
    },
]

export default function ValuesSection() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
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
                            className="group overflow-hidden border border-white/10 hover:border-[#eb0071]/60 transition-all duration-300 "
                        >
                            {/* Image header */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={value.img}
                                    alt=""
                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${value.imgPosition}`}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                                {/* Red tint on hover */}
                                <div className="absolute inset-0 bg-[#eb0071]/0 group-hover:bg-[#eb0071]/20 transition-colors duration-300" />
                            </div>

                            {/* Text content */}
                            <div className="p-5 pt-4">
                                <h3 className="font-title text-xl text-[#F5F5F0] mb-2 group-hover:text-[#ff0096] transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-xs text-[#F5F5F0]/50 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
