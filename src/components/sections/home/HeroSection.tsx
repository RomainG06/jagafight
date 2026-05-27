import { Link } from 'react-router-dom'

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
                    backgroundImage: 'linear-gradient(#8B0020 1px, transparent 1px), linear-gradient(90deg, #8B0020 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
                {/* Badge */}
                <span className="inline-block px-4 py-1.5 border border-[#8B0020]/60 text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-8 rounded-sm">
                    École de Muay Thaï — Cagnes-sur-Mer
                </span>

                {/* Titre */}
                <h1 className="font-title text-6xl sm:text-8xl lg:text-[10rem] leading-none text-[#F5F5F0] mb-6">
                    JAGA<br />
                    <span className="text-[#8B0020]">FIGHT</span>

                </h1>

                {/* Sous-titre */}
                <p className="text-lg sm:text-xl text-[#F5F5F0]/70 max-w-xl mx-auto mb-10 font-light tracking-wide">
                    Sport, éducation, transformation. À Cagnes-sur-Mer.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/preinscription"
                        className="px-8 py-4 bg-[#8B0020] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#a3002a] transition-colors"
                    >
                        Me préinscrire
                    </Link>
                    <Link
                        to="/coaching"
                        className="px-8 py-4 border border-[#F5F5F0]/30 text-[#F5F5F0]/80 font-semibold tracking-widest uppercase text-sm rounded hover:border-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors"
                    >
                        Découvrir le coaching
                    </Link>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F5F5F0]/30 text-xs tracking-widest">
                    <span>DÉFILER</span>
                    <div className="w-px h-12 bg-gradient-to-b from-[#F5F5F0]/30 to-transparent" />
                </div>
            </div>
        </section>
    )
}
