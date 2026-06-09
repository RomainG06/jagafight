import { Link } from 'react-router-dom'

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="bg-[#0a0a0a] border-t border-white/10 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Logo & baseline */}
                    <div>
                        <span className="font-title text-2xl tracking-widest text-[#F5F5F0]">
                            JAGA<span className="text-[#eb0071]"> FIGHT</span>
                        </span>
                        <p className="mt-3 text-sm text-[#F5F5F0]/50 leading-relaxed">
                            École de Muay Thaï à Cagnes-sur-Mer.<br />
                            Sport, éducation, transformation.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-title text-lg tracking-wider text-[#F5F5F0] mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: "L'École" },
                                { to: '/coaching', label: 'Coaching' },
                                { to: '/preinscription', label: 'Préinscription' },
                                { to: '/mentions-legales', label: 'Mentions légales' },
                                { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
                            ].map(link => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-[#F5F5F0]/50 hover:text-[#eb0071] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Réseaux & contact */}
                    <div>
                        <h3 className="font-title text-lg tracking-wider text-[#F5F5F0] mb-4">Contact & Réseaux</h3>
                        <ul className="space-y-2 text-sm text-[#F5F5F0]/50">
                            <li>
                                <a href="mailto:contact@jagafight.fr" className="hover:text-[#eb0071] transition-colors">
                                    contact@jagafight.fr
                                </a>
                            </li>
                            <li>Cagnes-sur-Mer, Alpes-Maritimes (06)</li>
                            <li className="flex gap-4 pt-2">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#ff0096] transition-colors"
                                    aria-label="Instagram Jaga Fight"
                                >
                                    Instagram
                                </a>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#ff0096] transition-colors"
                                    aria-label="Facebook Jaga Fight"
                                >
                                    Facebook
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#F5F5F0]/30">
                    <p>© {year} Jaga Fight — Tous droits réservés</p>
                    <p>
                        <Link to="/mentions-legales" className="hover:text-[#eb0071]/60 transition-colors">
                            Mentions légales
                        </Link>
                        {' · '}
                        <Link to="/politique-confidentialite" className="hover:text-[#eb0071]/60 transition-colors">
                            RGPD
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}
