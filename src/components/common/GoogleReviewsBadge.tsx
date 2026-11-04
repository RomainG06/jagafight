import { Star } from 'lucide-react'
import { GOOGLE_REVIEWS } from '../../data/contact'

type Props = { className?: string }

/** Lien vers les avis Google du club, avec la note si elle est renseignée dans src/data/contact.ts. */
export default function GoogleReviewsBadge({ className = '' }: Props) {
    const { url, rating, count } = GOOGLE_REVIEWS
    const label = rating
        ? `${rating.toLocaleString('fr-FR', { minimumFractionDigits: 1 })}/5 sur Google${count ? ` · ${count} avis` : ''}`
        : 'Lire nos avis Google'

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-[#F5F5F0]/80 transition-colors hover:border-[#eb0071]/60 hover:text-[#F5F5F0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071] ${className}`}
        >
            <span className="flex text-[#FFC107]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </span>
            <span>{label}</span>
            <span aria-hidden="true" className="text-[#eb0071] transition-transform group-hover:translate-x-0.5">→</span>
        </a>
    )
}
