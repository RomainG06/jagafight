import { Helmet } from 'react-helmet-async'

export default function PolitiqueConfidentialite() {
    return (
        <>
            <Helmet>
                <title>Politique de confidentialité — Jaga Fight</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="font-title text-5xl text-[#F5F5F0] mb-10">POLITIQUE DE CONFIDENTIALITÉ</h1>

                <div className="space-y-8 text-[#F5F5F0]/70 text-sm leading-relaxed">
                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Responsable du traitement</h2>
                        <p>
                            <strong className="text-[#F5F5F0]">Jaga Fighting Team</strong> — Hicham KILIC<br />
                            Email : contact@jagafight.fr
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Données collectées</h2>
                        <p>Dans le cadre du formulaire de préinscription, nous collectons :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Prénom et nom</li>
                            <li>Adresse email</li>
                            <li>Numéro de téléphone (optionnel)</li>
                            <li>Tranche d'âge (optionnel)</li>
                            <li>Type d'activité souhaitée (optionnel)</li>
                            <li>Message libre (optionnel)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Finalité du traitement</h2>
                        <p>
                            Ces données sont collectées uniquement dans le but de vous recontacter lors de l'ouverture de l'école Jaga Fight
                            à Cagnes-sur-Mer. Elles ne seront pas utilisées à d'autres fins ni cédées à des tiers.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Base légale</h2>
                        <p>
                            Le traitement est fondé sur votre consentement explicite, recueilli lors de la soumission du formulaire
                            (case RGPD obligatoire).
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Durée de conservation</h2>
                        <p>
                            Vos données sont conservées pendant 12 mois à compter de leur collecte, puis supprimées.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Hébergement des données</h2>
                        <p>
                            Les données sont stockées sur <strong className="text-[#F5F5F0]">Supabase</strong> (infrastructure PostgreSQL sur AWS EU-West).
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Vos droits</h2>
                        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Droit d'accès à vos données</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l'effacement ("droit à l'oubli")</li>
                            <li>Droit d'opposition au traitement</li>
                            <li>Droit à la portabilité</li>
                        </ul>
                        <p className="mt-3">
                            Pour exercer ces droits, contactez-nous à :{' '}
                            <a href="mailto:contact@jagafight.fr" className="text-[#eb0071] hover:underline">
                                contact@jagafight.fr
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Cookies</h2>
                        <p>
                            Ce site n'utilise pas de cookies de traçage ou d'analyse. Seuls les cookies techniques nécessaires au
                            fonctionnement du site peuvent être présents.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-title text-2xl text-[#F5F5F0] mb-3">Réclamation</h2>
                        <p>
                            En cas de litige, vous pouvez adresser une réclamation à la{' '}
                            <a
                                href="https://www.cnil.fr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#eb0071] hover:underline"
                            >
                                CNIL (Commission Nationale de l'Informatique et des Libertés)
                            </a>.
                        </p>
                    </section>

                    <p className="text-[#F5F5F0]/30 text-xs pt-4 border-t border-white/10">
                        Dernière mise à jour : mai 2026
                    </p>
                </div>
            </div>
        </>
    )
}
