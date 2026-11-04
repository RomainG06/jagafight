import { MapPin, Phone } from 'lucide-react'
import GoogleReviewsBadge from '../../common/GoogleReviewsBadge'
import { GOOGLE_DIRECTIONS_URL, PHONE_DISPLAY, PHONE_HREF } from '../../../data/contact'
import { CLUB_ADDRESS } from '../../../data/club'

const partners = [
  { name: 'AFMT', url: 'https://www.afmt.fr/' },
  { name: 'FFKMDA', url: 'https://www.ffkmda.com/' },
  { name: 'Ministère des Sports', url: 'https://www.sports.gouv.fr/' },
  { name: 'UFSC', url: 'https://ufsc-france.fr/' },
  { name: 'ASPTT', url: 'https://asptt.com//' },
]

export default function LocalSection() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ancrage */}
        <div className="text-center mb-16">
          <span className="text-[#eb0071] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
            Ancrage local
          </span>
          <h2 className="font-title text-5xl sm:text-6xl text-[#F5F5F0] mb-4">
            SAINT-LAURENT-DU-VAR
          </h2>
          <p className="text-[#F5F5F0]/60 text-base max-w-md mx-auto">
            Jaga Fight est ouvert à Saint-Laurent-du-Var, au cœur de la Côte d'Azur,
            et accueille les pratiquants de Cagnes-sur-Mer, Nice, Antibes et des Alpes-Maritimes.
          </p>
          <address className="mt-8 not-italic text-[#F5F5F0]/80">
            {CLUB_ADDRESS.street}<br />{CLUB_ADDRESS.postalCode} {CLUB_ADDRESS.city}
          </address>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={GOOGLE_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-white/30 px-5 py-2.5 text-sm text-[#F5F5F0] transition-colors hover:border-[#eb0071] hover:text-[#eb0071] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]"
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Itinéraire Google Maps
            </a>
            <GoogleReviewsBadge />
          </div>
        </div>

        {/* Partenaires */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-white/10 text-[#F5F5F0]/60 text-sm font-medium tracking-wide hover:border-[#eb0071]/50 hover:text-[#F5F5F0] transition-colors"
            >
              {p.name}
            </a>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center bg-[#eb0071]/10 border border-[#eb0071]/30 p-10 sm:p-16">
          <h3 className="font-title text-4xl sm:text-5xl text-[#F5F5F0] mb-4">
            L'ÉCOLE EST OUVERTE
          </h3>
          <p className="text-[#F5F5F0]/60 mb-8 max-w-md mx-auto">
            Inscris-toi en ligne en quelques minutes, ou viens d’abord tester gratuitement ton premier cours.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/inscription"
            className="inline-flex items-center px-8 py-4 bg-[#eb0071] text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:opacity-90 transition-opacity"
          >
            S’inscrire au club
          </a>
          <a
            href="/essai-gratuit"
            className="inline-flex items-center px-8 py-4 border border-white/30 text-[#F5F5F0] font-semibold tracking-widest uppercase text-sm rounded hover:border-[#eb0071] hover:text-[#eb0071] transition-colors"
          >
            Essai gratuit
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-[#F5F5F0] text-sm rounded hover:border-[#eb0071] hover:text-[#eb0071] transition-colors"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          </div>
        </div>
      </div>
    </section>
  )
}
