// Parcours d'inscription au club, réutilisé sur l'accueil, les tarifs et la page /inscription.

import { INSCRIPTION_CHECKLIST, INSCRIPTION_STEPS } from '../../data/inscription'

type Props = {
    /** Affiche le bouton « S'inscrire » sous les étapes */
    withCta?: boolean
    /** Variante compacte (colonne latérale de /inscription) */
    compact?: boolean
    className?: string
}

export default function InscriptionSteps({ withCta = true, compact = false, className = '' }: Props) {
    if (compact) {
        return (
            <div className={className}>
                <h2 className="font-title text-2xl text-[#F5F5F0]">VOTRE INSCRIPTION EN 4 ÉTAPES</h2>
                <ol className="mt-5 space-y-4">
                    {INSCRIPTION_STEPS.map((step, index) => (
                        <li key={step.title} className="flex gap-3">
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-title text-lg ${index === 0 ? 'bg-[#eb0071] text-white' : 'border border-white/20 text-[#F5F5F0]/60'}`}>{index + 1}</span>
                            <div>
                                <h3 className="text-sm text-[#F5F5F0]">{step.title}</h3>
                                <p className="mt-0.5 text-xs leading-relaxed text-[#F5F5F0]/50">{step.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
                <div className="mt-6 border-l-2 border-[#eb0071] bg-white/[0.03] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#eb0071]">À préparer</p>
                    <ul className="mt-2 space-y-1 text-xs leading-relaxed text-[#F5F5F0]/60">
                        {INSCRIPTION_CHECKLIST.map(item => <li key={item}>· {item}</li>)}
                    </ul>
                    <p className="mt-2 text-xs text-[#F5F5F0]/40">Pas tout sous la main ? Votre dossier s’enregistre au fur et à mesure, vous le terminez quand vous voulez.</p>
                </div>
            </div>
        )
    }

    return (
        <section aria-labelledby="comment-s-inscrire" className={`border-t border-white/10 bg-[#0a0a0a] py-20 ${className}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-[#eb0071]">Rejoindre le club</span>
                <h2 id="comment-s-inscrire" className="font-title text-4xl text-[#F5F5F0] sm:text-5xl">COMMENT S’INSCRIRE ?</h2>
                <p className="mt-4 max-w-2xl text-[#F5F5F0]/65">
                    L’inscription se fait entièrement en ligne, depuis votre espace membre : c’est là que vous complétez votre dossier et déposez vos documents.
                </p>

                <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {INSCRIPTION_STEPS.map((step, index) => (
                        <li key={step.title} className="border border-white/10 bg-[#0d0d0d] p-5">
                            <span className="font-title text-4xl leading-none text-[#eb0071]">0{index + 1}</span>
                            <h3 className="mt-3 text-sm uppercase tracking-wide text-[#F5F5F0]">{step.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/60">{step.text}</p>
                        </li>
                    ))}
                </ol>

                {withCta && (
                    <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <a
                            href="/inscription"
                            className="inline-flex justify-center rounded bg-[#eb0071] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
                        >
                            S’inscrire au club
                        </a>
                        <p className="text-sm text-[#F5F5F0]/50">
                            Pas encore décidé ?{' '}
                            <a href="/essai-gratuit" className="text-[#eb0071] underline-offset-4 hover:underline">Réservez d’abord un cours d’essai gratuit</a>
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
