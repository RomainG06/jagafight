import logoWhite from '../../../assets/white_logo_jaga.png'
import { useAuth } from '../../../contexts/auth-context'
import GoogleReviewsBadge from '../../common/GoogleReviewsBadge'

export default function HeroSection() {
    const { session } = useAuth()
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a]" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
                <h1 className="inline-block px-4 py-1.5 border border-[#eb0071]/60 text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-8 rounded-sm">
                    Club de Muay Thaï à Saint-Laurent-du-Var (06)
                </h1>

                {/* Logo visuel */}
                <img src={logoWhite} alt="Logo Jaga Fight - École Muay Thaï Saint-Laurent-du-Var" width="1051" height="594" loading="eager" fetchPriority="high" className="h-48 sm:h-64 lg:h-80 mb-6 mx-auto" />
                {/* Sous-titre */}
                <p className="text-lg sm:text-xl text-[#eb0071]/70 max-w-xl mx-auto mb-10 font-light tracking-wide">
                    Muay Thaï adultes, féminin, enfants, ados et self défense. Votre premier cours est offert.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!session && (
                        <a
                            href="/inscription"
                            className="px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:opacity-90 transition-opacity"
                        >
                            S'inscrire au club
                        </a>
                    )}
                    {session && (
                        <a
                            href="/espace-membre"
                            className="px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#eb0071] transition-colors"
                        >
                            Mon espace
                        </a>
                    )}
                    <a
                        href="/essai-gratuit"
                        className="px-8 py-4 border border-[#F5F5F0]/30 text-[#F5F5F0]/80 font-semibold tracking-widest uppercase text-sm rounded hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors"
                    >
                        Essai gratuit
                    </a>
                </div>
                <a href="/planning" className="mt-5 inline-block text-sm text-[#F5F5F0]/60 underline-offset-4 hover:text-[#F5F5F0] hover:underline">
                    Voir le planning des cours →
                </a>
                <div><GoogleReviewsBadge className="mt-6" /></div>
            </div>
        </section>
    )
}
