import { Link } from 'react-router-dom'

const partners = [
  { name: 'Ville de Cagnes-sur-Mer', url: 'https://ville.cagnes.fr/' },
  { name: 'AFMT', url: 'https://www.afmt.fr/' },
  { name: 'FFKMDA', url: 'https://www.ffkmda.com/' },
  { name: 'Ministère des Sports', url: 'https://www.sports.gouv.fr/' },
]

export default function LocalSection() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ancrage */}
        <div className="text-center mb-16">
          <span className="text-[#8B0020] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            Ancrage local
          </span>
          <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-4">
            CAGNES-SUR-MER
          </h2>
          <p className="text-[#F5F5F0]/60 text-base max-w-md mx-auto">
            Jaga Fight s'implante au cœur de la Côte d'Azur pour 2025-2026,
            avec le soutien d'institutions locales et nationales.
          </p>
        </div>

        {/* Partenaires */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/10 text-[#F5F5F0]/60 text-sm font-medium tracking-wide hover:border-[#8B0020]/50 hover:text-[#F5F5F0] transition-colors"
            >
              {p.name}
            </a>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center bg-[#8B0020]/10 border border-[#8B0020]/30 p-10 sm:p-16">
          <h3 className="font-title text-4xl sm:text-5xl text-[#F5F5F0] mb-4">
            L'ÉCOLE OUVRE BIENTÔT
          </h3>
          <p className="text-[#F5F5F0]/60 mb-8 max-w-md mx-auto">
            Sois parmi les premiers à rejoindre Jaga Fight. Laisse-nous tes coordonnées et nous te contactons en priorité.
          </p>
          <Link
            to="/preinscription"
            className="inline-flex items-center px-8 py-4 bg-[#8B0020] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:bg-[#a3002a] transition-colors"
          >
            Me préinscrire maintenant
          </Link>
        </div>
      </div>
    </section>
  )
}
