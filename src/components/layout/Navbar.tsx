import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { to: '/', label: "L'École" },
        { to: '/coaching', label: 'Coaching' },
        { to: '/preinscription', label: 'Préinscription' },
    ]

    const isActive = (to: string) =>
        to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="font-title text-2xl tracking-widest text-[#F5F5F0] hover:text-[#8B0020] transition-colors">
                            JAGA<span className="text-[#8B0020]"> FIGHT</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.slice(0, 2).map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={`text-sm font-medium tracking-wide transition-colors ${isActive(link.to)
                                        ? 'text-[#8B0020]'
                                        : 'text-[#F5F5F0]/70 hover:text-[#F5F5F0]'
                                    }`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* CTA + burger */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/preinscription"
                            className="hidden sm:inline-flex items-center px-5 py-2 bg-[#8B0020] text-[#F5F5F0] text-sm font-semibold tracking-wide rounded hover:bg-[#a3002a] transition-colors"
                        >
                            Me préinscrire
                        </Link>

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
                                    className={`text-base font-medium tracking-wide transition-colors ${isActive(link.to) ? 'text-[#8B0020]' : 'text-[#F5F5F0]/70'
                                        }`}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                            <Link
                                to="/preinscription"
                                onClick={() => setMenuOpen(false)}
                                className="inline-flex items-center justify-center px-5 py-2.5 bg-[#8B0020] text-[#F5F5F0] text-sm font-semibold tracking-wide rounded hover:bg-[#a3002a] transition-colors mt-2"
                            >
                                Me préinscrire
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
