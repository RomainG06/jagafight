/**
 * Génération automatique du sitemap.xml
 *
 * Le sitemap est écrit dans public/sitemap.xml.
 * Vite/Vike le copiera ensuite dans dist/client/sitemap.xml.
 *
 * Exécution :
 * node scripts/generate-sitemap.js
 */

import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, "..", "public");
const outputPath = join(publicDir, "sitemap.xml");

const BASE_URL = "https://www.jagafight.fr";

/**
 * N’ajouter que les pages :
 * - publiques ;
 * - indexables ;
 * - canoniques ;
 * - renvoyant un statut HTTP 200.
 *
 * lastmod doit représenter une vraie modification du contenu.
 * Il peut être omis lorsqu’aucune date fiable n’est disponible.
 */
const pages = [
    {
        path: "/",
        lastmod: "2026-07-29",
    },
    {
        path: "/coaching",
        lastmod: "2026-07-29",
    },
    {
        path: "/formations",
        lastmod: "2026-07-29",
    },
    {
        path: "/notre-adn",
        lastmod: "2026-07-29",
    },
    {
        path: "/preinscription",
        lastmod: "2026-07-29",
    },
    {
        path: "/mentions-legales",
        lastmod: "2026-07-29",
    },
    {
        path: "/politique-confidentialite",
        lastmod: "2026-07-29",
    },
];

/**
 * Échappe les caractères réservés en XML.
 */
function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

/**
 * Normalise le chemin d’une page.
 *
 * La racine reste "/".
 * Les autres URL sont générées sans slash final.
 */
function normalizePath(path) {
    if (!path || path === "/") {
        return "/";
    }

    return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

/**
 * Vérifie sommairement une date au format YYYY-MM-DD.
 */
function isValidLastmod(value) {
    if (!value) {
        return true;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Génère une URL absolue et canonique.
 */
function createAbsoluteUrl(path) {
    const normalizedPath = normalizePath(path);

    if (normalizedPath === "/") {
        return `${BASE_URL}/`;
    }

    return `${BASE_URL}${normalizedPath}`;
}

/**
 * Génère le contenu XML du sitemap.
 */
function createSitemapXml() {
    const uniquePages = new Map();

    for (const page of pages) {
        const normalizedPath = normalizePath(page.path);

        if (!isValidLastmod(page.lastmod)) {
            throw new Error(
                `Date lastmod invalide pour "${normalizedPath}". ` +
                `Format attendu : YYYY-MM-DD.`
            );
        }

        if (uniquePages.has(normalizedPath)) {
            throw new Error(
                `URL présente plusieurs fois dans le sitemap : ${normalizedPath}`
            );
        }

        uniquePages.set(normalizedPath, {
            ...page,
            path: normalizedPath,
        });
    }

    const entries = [...uniquePages.values()]
        .map((page) => {
            const url = createAbsoluteUrl(page.path);

            const lastmodElement = page.lastmod
                ? `\n    <lastmod>${escapeXml(page.lastmod)}</lastmod>`
                : "";

            return [
                "  <url>",
                `    <loc>${escapeXml(url)}</loc>${lastmodElement}`,
                "  </url>",
            ].join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries,
        "</urlset>",
        "",
    ].join("\n");
}

/**
 * Écrit le sitemap dans public/.
 */
async function generateSitemap() {
    await mkdir(publicDir, {
        recursive: true,
    });

    const xml = createSitemapXml();

    await writeFile(outputPath, xml, "utf8");

    console.log("✅ Sitemap généré avec succès");
    console.log(`📄 ${pages.length} pages incluses`);
    console.log(`📍 ${outputPath}`);
    console.log(`🌐 ${BASE_URL}/sitemap.xml`);
}

generateSitemap().catch((error) => {
    console.error(
        "❌ Échec de la génération du sitemap :",
        error instanceof Error ? error.message : error
    );

    process.exitCode = 1;
});