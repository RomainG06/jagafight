const paths = [
    {
        eyebrow: 'Coaching',
        title: 'Être coaché individuellement',
        text: 'Accompagnement personnalisé, préparation physique et stages d’aguerrissement avec Hicham.',
        to: '/coaching',
    },
    {
        eyebrow: 'Formations',
        title: 'Devenir coach de Muay Thaï',
        text: 'Parcours certifiants CQP, BPJEPS, BMF, DEJEPS et DESJEPS, avec tutorat et stages en salle.',
        to: '/formations',
    },
]

export default function GoFurtherSection() {
    return (
        <section aria-labelledby="aller-plus-loin" className="border-t border-white/10 bg-[#0d0d0d] py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">Aller plus loin</span>
                <h2 id="aller-plus-loin" className="mb-10 font-title text-4xl text-[#F5F5F0] sm:text-5xl">COACHING & FORMATIONS</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {paths.map(path => (
                        <a
                            key={path.to}
                            href={path.to}
                            className="group border border-white/10 p-6 transition-colors hover:border-[#eb0071]/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] sm:p-8"
                        >
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">{path.eyebrow}</span>
                            <h3 className="mt-3 font-title text-3xl text-[#F5F5F0]">{path.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/60">{path.text}</p>
                            <span className="mt-5 inline-block text-sm font-semibold text-[#eb0071] transition-transform group-hover:translate-x-1">Découvrir →</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
