import OptimizedImage from '../../common/OptimizedImage'

const sportStats = [
    { value: '+20 ans', label: 'de pratique' },
    { value: '18 ans', label: 'intensifs' },
    { value: '40', label: 'combats amateurs' },
    { value: '27', label: 'combats professionnels' },
]

const titles = [
    'Champion de France 2007–2015',
    "Champion d'Europe de Muay Thaï 2018",
    'Stagiaire régulier dans les camps de boxe en Thaïlande',
    'Champion du monde — équipes nationales',
]

const qualifications = [
    'DEJEPS Perfectionnement Sportif (Muay Thaï)',
    'DESJEPS Direction de structure et de projet sportif',
    "Formation à l'encadrement, la pédagogie et l'ingénierie de projet",
    'Certifié accompagnement éducatif et social via le sport',
]

export default function CoachHero() {
    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Photo du coach */}
                    <div className="relative">
                        <div className="aspect-[3/4] overflow-hidden border border-white/10">
                            <OptimizedImage
                                src="/coach-hicham.jpg"
                                alt="Hicham — coach principal de Jaga Fight"
                                width={800}
                                height={800}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#eb0071]/20 -z-10" />
                    </div>

                    {/* Infos coach */}
                    <div>
                        <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                            Votre coach
                        </span>
                        <h1 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] leading-tight mb-2">
                            Coaching Boxe Thaï avec Hicham
                        </h1>
                        <p className="font-title text-xl text-[#eb0071] tracking-wide mb-8">
                            Champion d'Europe de Muay Thaï
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {sportStats.map((s) => (
                                <div key={s.label} className="border border-white/10 p-4">
                                    <p className="font-title text-3xl text-[#eb0071]">{s.value}</p>
                                    <p className="text-xs text-[#F5F5F0]/50 mt-1 tracking-wide">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Titres */}
                        <div className="mb-8">
                            <h3 className="font-title text-xl text-[#F5F5F0] mb-4 tracking-wider">PALMARÈS</h3>
                            <ul className="space-y-2">
                                {titles.map((t) => (
                                    <li key={t} className="flex gap-3 items-start text-sm text-[#F5F5F0]/70">
                                        <span className="text-[#eb0071] mt-0.5 flex-shrink-0">▸</span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Qualifications */}
                        <div>
                            <h3 className="font-title text-xl text-[#F5F5F0] mb-4 tracking-wider">DIPLÔMES</h3>
                            <ul className="space-y-2">
                                {qualifications.map((q) => (
                                    <li key={q} className="flex gap-3 items-start text-sm text-[#F5F5F0]/70">
                                        <span className="text-[#eb0071] mt-0.5 flex-shrink-0">▸</span>
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
