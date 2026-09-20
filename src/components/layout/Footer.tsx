export default function Footer() {
    const year = new Date().getFullYear()

    // Structured Data - Organization
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "SportsOrganization",
        "name": "Jaga Fight",
        "url": "https://www.jagafight.fr",
        "logo": "https://www.jagafight.fr/logo.png",
        "description": "École de Muay Thaï à Cagnes-sur-Mer proposant cours collectifs, coaching individuel, stages et formations diplômantes",
        "email": "contact@jagafight.fr",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Cagnes-sur-Mer",
            "addressRegion": "Alpes-Maritimes",
            "postalCode": "06800",
            "addressCountry": "FR"
        },
        "areaServed": [
            "Cagnes-sur-Mer",
            "Nice",
            "Antibes",
            "Villeneuve-Loubet",
            "Saint-Laurent-du-Var",
            "Côte d'Azur",
            "Alpes-Maritimes"
        ],
        "founder": {
            "@type": "Person",
            "name": "Oualid OUMERZOUK"
        },
        "foundingDate": "2025",
        "slogan": "Sport, éducation, transformation"
    }

    return (
        <footer className="bg-[#0a0a0a] border-t border-white/10 mt-auto">
            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
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
                        <p className="mt-3 text-xs text-[#F5F5F0]/40 leading-relaxed">
                            <strong className="text-[#F5F5F0]/60">Zone desservie :</strong><br />
                            Cagnes-sur-Mer · Nice · Antibes<br />
                            Villeneuve-Loubet · Saint-Laurent-du-Var<br />
                            Toute la Côte d'Azur (06)
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-title text-lg tracking-wider text-[#F5F5F0] mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: "L'École" },
                                { to: '/coaching', label: 'Coaching' },
                                { to: '/mentions-legales', label: 'Mentions légales' },
                                { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
                            ].map(link => (
                                <li key={link.to}>
                                    <a
                                        href={link.to}
                                        className="text-sm text-[#F5F5F0]/50 hover:text-[#eb0071] transition-colors"
                                    >
                                        {link.label}
                                    </a>
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
                                    href="https://www.instagram.com/jagafight?stkn=MThnZTA0bnc1MnNnYw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 hover:text-[#ff0096] transition-colors"
                                    aria-label="Instagram Jaga Fight"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zm8.75 2.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                                    </svg>
                                    <span>Instagram</span>
                                </a>
                                {/*                                 <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#ff0096] transition-colors"
                                    aria-label="Facebook Jaga Fight"
                                >
                                    Facebook
                                </a> */}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#F5F5F0]/30">
                    <p>© {year} Jaga Fight — Tous droits réservés</p>
                    <p>
                        <a href="/mentions-legales" className="hover:text-[#eb0071]/60 transition-colors">
                            Mentions légales
                        </a>
                        {' · '}
                        <a href="/politique-confidentialite" className="hover:text-[#eb0071]/60 transition-colors">
                            RGPD
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
