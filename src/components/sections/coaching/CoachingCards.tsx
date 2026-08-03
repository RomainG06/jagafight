import formulasData from '../../../data/coachingFormulas.json'

type Formula = {
    id: string
    titre: string
    description: string
    niveau: string
    public: string
}

const formulas = formulasData as Formula[]

export default function CoachingCards() {
    return (
        <section className="py-24 bg-[#0d0d0d]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Formules
                    </span>
                    <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-4">
                        MES COACHINGS
                    </h2>
                    <p className="text-[#F5F5F0]/50 text-sm max-w-md mx-auto">
                        Tarifs et créneaux disponibles à l'ouverture. Préinscris-toi dès maintenant pour être contacté en priorité.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formulas.map((formula) => (
                        <div
                            key={formula.id}
                            className="flex flex-col border border-white/10 p-6 hover:border-[#eb0071]/40 transition-colors"
                        >
                            <div className="flex-1">
                                <span className="inline-block px-2 py-0.5 bg-[#eb0071]/20 text-[#eb0071] text-xs font-medium tracking-wide rounded mb-3">
                                    {formula.niveau}
                                </span>
                                <h3 className="font-title text-xl text-[#F5F5F0] mb-2">{formula.titre}</h3>
                                <p className="text-xs text-[#F5F5F0]/40 tracking-wide mb-4">{formula.public}</p>
                                <p className="text-sm text-[#F5F5F0]/60 leading-relaxed">{formula.description}</p>
                            </div>
                            <a
                                href="/preinscription"
                                className="mt-6 block text-center px-4 py-2.5 border border-[#eb0071] text-[#eb0071] text-sm font-semibold tracking-wide hover:bg-[#eb0071] hover:text-[#F5F5F0] transition-colors rounded"
                            >
                                Me préinscrire
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
