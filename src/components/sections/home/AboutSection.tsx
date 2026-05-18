export default function AboutSection() {
    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Texte */}
                    <div>
                        <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            L'École
                        </span>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-6 leading-tight">
                            PLUS QU'UNE SALLE<br />DE SPORT
                        </h2>
                        <p className="text-[#F5F5F0]/70 text-base leading-relaxed mb-6">
                            Jaga Fight est plus qu'une salle de sport. C'est un espace d'éducation,
                            de résilience et de reconstruction, ouvert à tous les publics : enfants,
                            adolescents, adultes, seniors, femmes en difficulté, forces de l'ordre.
                        </p>
                        <p className="text-[#F5F5F0]/70 text-base leading-relaxed">
                            Nous croyons que le sport de combat, pratiqué dans un cadre bienveillant
                            et exigeant, est un vecteur puissant de transformation personnelle et
                            d'insertion sociale.
                        </p>
                    </div>

                    {/* Accroche visuelle */}
                    <div className="relative">
                        <div className="border border-[#8B0020]/40 p-8 lg:p-12">
                            <p className="font-title text-3xl sm:text-4xl text-[#F5F5F0] leading-tight">
                                "Plus qu'un lieu d'entraînement —
                            </p>
                            <p className="font-title text-3xl sm:text-4xl text-[#8B0020] leading-tight mt-2">
                                un espace de vie."
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="font-title text-3xl text-[#8B0020]">120+</p>
                                    <p className="text-xs text-[#F5F5F0]/50 mt-1 tracking-wide">Licenciés dès la création</p>
                                </div>
                                <div>
                                    <p className="font-title text-3xl text-[#8B0020]">7</p>
                                    <p className="text-xs text-[#F5F5F0]/50 mt-1 tracking-wide">Activités proposées</p>
                                </div>
                                <div>
                                    <p className="font-title text-3xl text-[#8B0020]">2025</p>
                                    <p className="text-xs text-[#F5F5F0]/50 mt-1 tracking-wide">Ouverture Cagnes-sur-Mer</p>
                                </div>
                            </div>
                        </div>
                        {/* Accent décoratif */}
                        <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#8B0020]/20 -z-10" />
                    </div>
                </div>
            </div>
        </section>
    )
}
