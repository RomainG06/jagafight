import { useState } from 'react'
import logo from '../../assets/white_logo_jaga.png';

interface NavbarProps {
    pathname?: string
}

export default function Navbar({ pathname = '/' }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = [
        { to: '/', label: "L'École" },
        { to: '/coaching', label: 'Coaching' },
        { to: '/formations', label: 'Formations' },
        { to: '/notre-adn', label: 'Notre ADN' },
    ]

    const isActive = (to: string) =>
        to === '/' ? pathname === '/' : pathname.startsWith(to)
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0">
                        <img src={logo} alt="Jaga Fight" className="h-12 w-auto" />
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
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
