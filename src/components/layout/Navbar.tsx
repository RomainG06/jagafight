import { memo, useState } from 'react'
import logo from '../../assets/white_logo_jaga.png';
import { useAuth } from '../../contexts/auth-context'
import { usePageContext } from 'vike-react/usePageContext';

const navLinks = [
    { to: '/', label: "L'École" },
    { to: '/coaching', label: 'Coaching' },
    { to: '/formations', label: 'Formations' },
    { to: '/notre-adn', label: 'Notre ADN' },
]

const Navbar = memo(function Navbar() {
    const { urlPathname } = usePageContext()
    const [menuOpen, setMenuOpen] = useState(false)
    const { session, isAdmin } = useAuth()

    const isActive = (to: string) =>
        to === '/' ? urlPathname === '/' : urlPathname.startsWith(to)
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#eb0071]">
                        <img src={logo} alt="Jaga Fight" width="1051" height="594" className="h-12 w-auto" />
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <a
                                key={link.to}
                                href={link.to}
                                onClick={(e) => {
                                    if (isActive(link.to)) {
                                        e.preventDefault()
                                    }
                                }}
                                className={`text-sm font-medium tracking-wide transition-colors ${isActive(link.to)
                                    ? 'text-[#eb0071] cursor-default'
                                    : 'text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA + burger */}
                    <div className="flex items-center gap-4">
                        {/* Auth CTA — desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {session && !isAdmin ? (
                                <a
                                    href="/espace-membre"
                                    className="text-sm font-medium text-[#eb0071] border border-[#eb0071]/40 px-4 py-1.5 hover:bg-[#eb0071]/10 transition-colors"
                                >
                                    Mon espace
                                </a>

                            ) : !session ? (
                                <>
                                    <a href="/connexion" className="text-sm text-[#F5F5F0]/60 hover:text-[#F5F5F0] transition-colors">
                                        Connexion
                                    </a>
                                    <a
                                        href="/inscription"
                                        className="text-sm font-medium text-[#F5F5F0] bg-[#eb0071] px-4 py-1.5 hover:opacity-90 transition-opacity rounded"
                                    >
                                        S'inscrire
                                    </a>
                                </>
                            ) : null}
                            {isAdmin && (
                                <a
                                    href="/admin"
                                    className="text-sm font-medium text-[#F5F5F0] bg-[#eb0071] px-4 py-1.5 hover:opacity-90 transition-opacity rounded"
                                >
                                    Admin
                                </a>
                            )}
                        </div>
                        {/* Burger mobile */}
                        <button
                            type="button"
                            className="md:hidden p-2 text-[#F5F5F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eb0071]"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                        >
                            <span aria-hidden="true" className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span aria-hidden="true" className={`block w-5 h-0.5 bg-current my-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                            <span aria-hidden="true" className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div id="mobile-navigation" className="md:hidden py-4 border-t border-white/10">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                <a
                                    key={link.to}
                                    href={link.to}
                                    onClick={(e) => {
                                        if (isActive(link.to)) {
                                            e.preventDefault()
                                        } else {
                                            setMenuOpen(false)
                                        }
                                    }}
                                    className={`text-base font-medium tracking-wide transition-colors ${isActive(link.to) ? 'text-[#eb0071] cursor-default' : 'text-[#F5F5F0]/70'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            {/* Auth links — mobile */}
                            {session && !isAdmin ? (
                                <a href="/espace-membre" className="text-base font-medium text-[#eb0071]" onClick={() => setMenuOpen(false)}>
                                    Mon espace
                                </a>
                            ) : !session ? (
                                <>
                                    <a href="/connexion" className="text-base font-medium text-[#F5F5F0]/70" onClick={() => setMenuOpen(false)}>
                                        Connexion
                                    </a>
                                    <a href="/inscription" className="text-base font-medium text-[#eb0071]" onClick={() => setMenuOpen(false)}>
                                        S'inscrire
                                    </a>
                                </>
                            ) : null}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
})

export default Navbar
