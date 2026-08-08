export default function HistorySection() {
    return (
        <section className="py-24 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Notre histoire
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0]">
                        L'HISTOIRE DE JAGA
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Timeline */}
                    <div className="space-y-10 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-[#eb0071]/30">
                        {[
                            {
                                year: 'Fondation',
                                text: "Fondée à Perpignan par Oualid OUMERZOUK, Hicham, Mohamed et Julien. Oualid, ancien légionnaire du 2e REP et champion du monde Nokento Full Fight 2017, insuffle dès le départ une vision exigeante. L'école attire plus de 120 préinscrits dès sa création.",
                            },
                            {
                                year: 'Transmission',
                                text: "Après le décès de Oualid, Hicham reprend le flambeau et porte le projet à Cagnes-sur-Mer. L'esprit, les valeurs et la vision restent intacts.",
                            },
                            {
                                year: '2025–2026',
                                text: "Jaga Fight ouvre ses portes à Cagnes-sur-Mer, avec le soutien de la Ville, de l'AFMT, de la FFKMDA et du Ministère des Sports.",
                            },
                        ].map((item) => (
                            <div key={item.year} className="flex gap-8 pl-12 relative">
                                <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-[#eb0071] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-[#eb0071]" />
                                </div>
                                <div>
                                    <span className="font-title text-sm text-[#eb0071] tracking-widest block mb-1">{item.year}</span>
                                    <p className="text-[#F5F5F0]/70 text-base leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Citation Oualid */}
                    <blockquote className="mt-16 border border-[#eb0071]/40 p-8 relative">
                        <div className="font-title text-6xl text-[#eb0071]/20 absolute top-4 left-6 leading-none">"</div>
                        <p className="font-title text-2xl sm:text-3xl text-[#F5F5F0] leading-tight pl-6">
                            Polir son esprit pour être fier de ce que l'on voit dans son miroir.
                        </p>
                        <footer className="mt-4 pl-6 text-sm text-[#F5F5F0]/40 tracking-wide">
                            — Oualid OUMERZOUK, fondateur de Jaga Fight
                        </footer>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}
