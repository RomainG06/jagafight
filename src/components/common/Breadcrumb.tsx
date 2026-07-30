/**
 * Composant Breadcrumb avec structured data JSON-LD
 * Améliore le SEO et l'affichage dans les résultats Google
 */

import { Helmet } from 'react-helmet-async';

type BreadcrumbItem = {
    name: string;
    url: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    // Toujours inclure la page d'accueil
    const fullItems: BreadcrumbItem[] = [
        { name: 'Accueil', url: 'https://www.jagafight.fr' },
        ...items,
    ];

    // Génération du structured data JSON-LD
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: fullItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Helmet>
    );
}
