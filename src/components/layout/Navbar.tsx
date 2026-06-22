import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../../assets/white_logo_jaga.png';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { to: '/', label: "L'École" },
        { to: '/coaching', label: 'Coaching' },
        { to: '/formations', label: 'Formations' },
        { to: '/notre-adn', label: 'Notre ADN' },
    ]

    const isActive = (to: string) =>
        to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img src={logo} alt="Jaga Fight" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={`text-sm font-medium tracking-wide transition-colors ${isActive(link.to)
                                    ? 'text-[#eb0071]'
                                    : 'text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
                                    }`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* CTA + burger */}
                    <div className="flex items-center gap-4">
                        {/* Burger mobile */}
                        <button
                            className="md:hidden p-2 text-[#F5F5F0]"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Menu"
                        >
                            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <div className={`w-5 h-0.5 bg-current my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                            <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`text-base font-medium tracking-wide transition-colors ${isActive(link.to) ? 'text-[#eb0071]' : 'text-[#F5F5F0]/70'
                                        }`}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
