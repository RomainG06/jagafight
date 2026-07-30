import logoWhite from '../../../assets/white_logo_jaga.png'
import OptimizedImage from '../../common/OptimizedImage'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center opacity-20" />
            {/* Grille décorative */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#eb0071 1px, transparent 1px), linear-gradient(90deg, #eb0071 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
                {/* Badge */}
                <span className="inline-block px-4 py-1.5 border border-[#eb0071]/60 text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-8 rounded-sm">
                    École de Muay Thaï — Cagnes-sur-Mer
                </span>

                {/* Titre H1 pour SEO */}
                <h1 className="sr-only">
                    Jaga Fight — École de Muay Thaï à Cagnes-sur-Mer, Côte d'Azur
                </h1>

                {/* Logo visuel */}
                <OptimizedImage
                    src={logoWhite}
                    alt="Logo Jaga Fight - École Muay Thaï Cagnes-sur-Mer"
                    width={640}
                    height={320}
                    priority
                    sizes="(max-width: 639px) 192px, (max-width: 1023px) 256px, 320px"
                    pictureClassName="block"
                    className="mx-auto mb-6 h-48 w-auto object-contain sm:h-64 lg:h-80"
                />

                {/* Sous-titre */}
                <p className="text-lg sm:text-xl text-[#eb0071]/70 max-w-xl mx-auto mb-10 font-light tracking-wide">
                    Sport, éducation, transformation. À Cagnes-sur-Mer.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/preinscription"
                        className="px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#eb0071] transition-colors"
                    >
                        Me préinscrire
                    </a>
                    <a
                        href="/coaching"
                        className="px-8 py-4 border border-[#F5F5F0]/30 text-[#F5F5F0]/80 font-semibold tracking-widest uppercase text-sm rounded hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors"
                    >
                        Découvrir le coaching
                    </a>
                </div>
            </div>
        </section>
    )
}
