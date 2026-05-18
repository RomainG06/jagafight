const certifications = ['CQP', 'BPJEPS', 'BMF', 'DEJEPS', 'DESJEPS']

export default function TrainingSection() {
    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Certifications badges */}
                    <div>
                        <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            Formation professionnelle
                        </span>
                        <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-6">
                            DEVENEZ<br />ENTRAÎNEUR
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {certifications.map((cert) => (
                                <span
                                    key={cert}
                                    className="px-4 py-2 border border-[#8B0020] text-[#8B0020] font-title text-lg tracking-wider"
                                >
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-6">
                        {[
                            {
                                title: 'Parcours certifiants reconnus',
                                desc: "L'école propose des parcours CQP, BPJEPS, BMF et DEJEPS/DESJEPS en partenariat avec les fédérations et organismes de formation agréés.",
                            },
                            {
                                title: 'Accompagnement complet',
                                desc: 'Tutorat individualisé, stages pratiques en salle, préparation aux tests d\'entrée et suivi tout au long du parcours.',
                            },
                            {
                                title: 'En partenariat institutionnel',
                                desc: 'Jaga Fight travaille avec les fédérations nationales et locales pour garantir la qualité et la reconnaissance des diplômes obtenus.',
                            },
                        ].map((item) => (
                            <div key={item.title} className="flex gap-4">
                                <div className="w-1 bg-[#8B0020] flex-shrink-0 rounded-full mt-1" />
                                <div>
                                    <h3 className="font-semibold text-[#F5F5F0] mb-1">{item.title}</h3>
                                    <p className="text-sm text-[#F5F5F0]/60 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
