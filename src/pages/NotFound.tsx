import { Helmet } from 'react-helmet-async'

export default function NotFound() {
    return (
        <>
            <Helmet>
                <title>Page introuvable — Jaga Fight</title>
                <meta name="description" content="La page que vous recherchez n'existe pas. Retournez à l'accueil pour découvrir notre école de Muay Thaï à Cagnes-sur-Mer." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-[#0a0a0a] text-white">
                <div className="text-center max-w-2xl">
                    {/* Code erreur */}
                    <h1 className="text-8xl md:text-9xl font-bold text-[#d4af37] mb-4">
                        404
                    </h1>

                    {/* Message */}
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        Page introuvable
                    </h2>

                    <p className="text-gray-400 mb-8 text-lg">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                        <br />
                        Retournez à l'accueil pour découvrir notre école de Muay Thaï à Cagnes-sur-Mer.
                    </p>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="/"
                            className="px-8 py-3 bg-[#d4af37] text-black font-semibold rounded hover:bg-[#c4a137] transition-colors"
                        >
                            Retour à l'accueil
                        </a>

                        <a
                            href="/coaching"
                            className="px-8 py-3 border border-white/20 rounded hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                        >
                            Découvrir le coaching
                        </a>
                    </div>

                    {/* Liens rapides */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-sm text-gray-500 mb-4">Liens utiles :</p>
                        <nav className="flex flex-wrap gap-6 justify-center text-sm">
                            <a href="/formations" className="hover:text-[#d4af37] transition-colors">
                                Formations
                            </a>
                            <a href="/notre-adn" className="hover:text-[#d4af37] transition-colors">
                                Notre ADN
                            </a>
                            <a href="/preinscription" className="hover:text-[#d4af37] transition-colors">
                                Pré-inscription
                            </a>
                            <a
                                href="mailto:contact@jagafight.fr"
                                className="hover:text-[#d4af37] transition-colors"
                            >
                                Contact
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}
