import { MessageCircle, Phone } from 'lucide-react'
import { usePageContext } from 'vike-react/usePageContext'
import { useAuth } from '../../contexts/auth-context'
import { PHONE_HREF, whatsappUrl } from '../../data/contact'

// Pages où la barre n'a pas de sens (espace privé, formulaires de compte).
const HIDDEN_PREFIXES = ['/admin', '/espace-membre', '/inscription', '/connexion', '/reset-password', '/essai-gratuit']

/** Barre d'action fixe en bas d'écran, mobile uniquement, pour les visiteurs. */
export default function MobileContactBar() {
    const { urlPathname } = usePageContext()
    const { session } = useAuth()

    if (session || HIDDEN_PREFIXES.some(prefix => urlPathname.startsWith(prefix))) {
        return null
    }

    const item = 'flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium uppercase tracking-wider focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#eb0071]'

    return (
        <>
            {/* Réserve la place de la barre pour ne pas masquer le pied de page */}
            <div aria-hidden="true" className="h-16 md:hidden" />
            <nav
                aria-label="Contact rapide"
                className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-[#0a0a0a]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
            >
                <a href={PHONE_HREF} className={`${item} text-[#F5F5F0]/80`}>
                    <Phone aria-hidden="true" className="h-5 w-5" />
                    Appeler
                </a>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={`${item} border-x border-white/10 text-[#F5F5F0]/80`}>
                    <MessageCircle aria-hidden="true" className="h-5 w-5" />
                    WhatsApp
                </a>
                <a href="/essai-gratuit" className={`${item} flex-[1.4] bg-[#eb0071] text-white`}>
                    <span className="font-title text-xl leading-none tracking-wide normal-case">1er cours</span>
                    offert
                </a>
            </nav>
        </>
    )
}
