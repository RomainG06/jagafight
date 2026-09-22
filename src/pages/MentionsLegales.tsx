import { Helmet } from 'react-helmet-async'

export default function MentionsLegales() {
    return (
        <>
            <Helmet>
                <title>Mentions légales — Jaga Fight</title>
                <meta name="description" content="Informations légales du site Jaga Fight : éditeur, hébergement, propriété intellectuelle et responsabilité." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="font-title text-5xl text-[#F5F5F0] mb-10">MENTIONS LÉGALES</h1>

                <div className="prose prose-invert max-w-none space-y-8 text-[#F5F5F0]/70 text-sm leading-relaxed">
                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Éditeur du site</h2>
                        <p>
                            <strong className="text-[#F5F5F0]">JAGA FIGHT</strong><br />
                            Forme juridique : association déclarée<br />
                            Numéro RNA : W061018019<br />
                            SIREN : 990 250 458<br />
                            SIRET du siège : 990 250 458 00017<br />
                            Responsable de publication : Hicham<br />
                            Siège social : 82 avenue de Grasse, 06800 Cagnes-sur-Mer, France<br />
                            Email : Agentpro.athlete@gmail.com<br />
                            Site web : www.jagafight.fr<br />
                            <a
                                href="https://annuaire-entreprises.data.gouv.fr/entreprise/jaga-fight-990250458"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#eb0071] hover:underline"
                            >
                                Consulter la fiche officielle de l’association
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Hébergement</h2>
                        <p>
                            <strong className="text-[#F5F5F0]">Vercel Inc.</strong><br />
                            440 N Barranca Ave #4133<br />
                            Covina, CA 91723, États-Unis<br />
                            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#eb0071] hover:underline">vercel.com</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Propriété intellectuelle</h2>
                        <p>
                            L'ensemble du contenu de ce site (textes, images, logos, structure) est la propriété exclusive de JAGA FIGHT.
                            Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Limitation de responsabilité</h2>
                        <p>
                            JAGA FIGHT s'efforce d'assurer l'exactitude des informations diffusées sur ce site.
                            Toutefois, la responsabilité de l'éditeur ne pourra être engagée en cas d'erreurs ou d'omissions.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Droit applicable</h2>
                        <p>
                            Le présent site est soumis au droit français. En cas de litige, les tribunaux français sont seuls compétents.
                        </p>
                    </section>
                </div>
            </div>
        </>
    )
}
