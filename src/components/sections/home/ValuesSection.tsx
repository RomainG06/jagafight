import respectImg from "../../../assets/respect.jpg";
import disciplineImg from "../../../assets/hichKnee.jpg";
import solidariteImg from "../../../assets/solidarite.jpg";
import inclusionImg from "../../../assets/inclusion.jpg";
import engagementImg from "../../../assets/engagement.jpg";

import OptimizedImage from "../../common/OptimizedImage";

const values = [
    {
        title: "Respect",
        description:
            "Le respect de soi, de l'adversaire et du collectif est le premier enseignement du Muay Thaï.",
        img: respectImg,
        imgPosition: "object-center",
        alt: "Respect et salut traditionnel en Muay Thaï - Valeur Jaga Fight",
    },
    {
        title: "Discipline",
        description:
            "La régularité et l'effort construit le caractère. Chaque session est un pas vers la meilleure version de soi.",
        img: disciplineImg,
        imgPosition: "object-center",
        alt: "Entraînement discipline Muay Thaï Cagnes-sur-Mer",
    },
    {
        title: "Solidarité",
        description:
            "On progresse ensemble. L'entraide et la bienveillance sont au cœur de notre pratique quotidienne.",
        img: solidariteImg,
        imgPosition: "object-top",
        alt: "Esprit d'équipe et solidarité boxe thaï Jaga Fight",
    },
    {
        title: "Inclusion",
        description:
            "Peu importe l'âge, le niveau ou le parcours — Jaga Fight est ouvert à tous, sans exception.",
        img: inclusionImg,
        imgPosition: "object-center",
        alt: "Cours Muay Thaï accessibles à tous - Inclusion Cagnes",
    },
    {
        title: "Engagement",
        description:
            "S'engager, c'est se dépasser. Nous accompagnons chaque pratiquant dans ses objectifs avec exigence et bienveillance.",
        img: engagementImg,
        imgPosition: "object-center",
        alt: "Dépassement de soi et engagement Muay Thaï Côte d'Azur",
    },
];

export default function ValuesSection() {
    return (
        <section className="bg-[#0a0a0a] py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">
                        Nos valeurs
                    </span>

                    <h2 className="font-title text-5xl text-[#F5F5F0] sm:text-6xl">
                        CE QUI NOUS GUIDE
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {values.map((value) => (
                        <article
                            key={value.title}
                            className="group overflow-hidden border border-white/10 transition-all duration-300 hover:border-[#eb0071]/60"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <OptimizedImage
                                    src={value.img}
                                    alt={value.alt}
                                    width={500}
                                    height={176}
                                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                                    pictureClassName="block h-full w-full"
                                    className={[
                                        "h-full w-full object-cover",
                                        "transition-transform duration-500",
                                        "group-hover:scale-105",
                                        value.imgPosition,
                                    ].join(" ")}
                                />

                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

                                <div className="pointer-events-none absolute inset-0 bg-[#eb0071]/0 transition-colors duration-300 group-hover:bg-[#eb0071]/20" />
                            </div>

                            <div className="p-5 pt-4">
                                <h3 className="font-title mb-2 text-xl text-[#F5F5F0] transition-colors duration-300 group-hover:text-[#ff0096]">
                                    {value.title}
                                </h3>

                                <p className="text-xs leading-relaxed text-[#F5F5F0]/50">
                                    {value.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}