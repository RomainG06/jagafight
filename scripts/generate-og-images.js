/**
 * Script de génération automatique des images Open Graph
 *
 * Génère :
 * - les images Open Graph 1200 × 630 ;
 * - le logo public ;
 * - la photo du coach ;
 * - un favicon PNG ;
 * - l’icône Apple Touch.
 *
 * Installation :
 * npm install --save-dev sharp
 *
 * Exécution :
 * node scripts/generate-og-images.js
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, "..", "public");
const assetsDir = join(__dirname, "..", "src", "assets");

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * Configuration des images Open Graph.
 */
const images = [
    {
        name: "og-image.jpg",
        title: "JAGA FIGHT",
        subtitle: "École de Muay Thaï à Cagnes-sur-Mer",
        baseImage: join(assetsDir, "hichKnee.jpg"),
        position: "center",
    },
    {
        name: "og-coaching.jpg",
        title: "COACHING PERSONNALISÉ",
        subtitle: "Hicham — Champion d’Europe",
        baseImage: join(assetsDir, "coach.jpg"),
        position: "center",
    },
    {
        name: "og-formations.jpg",
        title: "FORMATIONS DIPLÔMANTES",
        subtitle: "Devenez coach professionnel",
        baseImage: join(assetsDir, "engagement.jpg"),
        position: "center",
    },
];

/**
 * Échappe les caractères réservés XML/SVG.
 *
 * Sans cette fonction, un texte contenant &, <, >, " ou '
 * pourrait rendre le SVG invalide.
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
 * Découpe un texte en plusieurs lignes selon une longueur maximale.
 *
 * Cela évite que les titres trop longs dépassent de l’image.
 */
function wrapText(text, maxCharactersPerLine = 34) {
    const words = String(text).trim().split(/\s+/);
    const lines = [];

    let currentLine = "";

    for (const word of words) {
        const candidate = currentLine
            ? `${currentLine} ${word}`
            : word;

        if (
            candidate.length <= maxCharactersPerLine ||
            currentLine.length === 0
        ) {
            currentLine = candidate;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

/**
 * Génère des balises SVG <tspan> pour afficher plusieurs lignes.
 */
function createTspans(lines, x, firstY, lineHeight) {
    return lines
        .map((line, index) => {
            const y = firstY + index * lineHeight;

            return `<tspan x="${x}" y="${y}">${escapeXml(line)}</tspan>`;
        })
        .join("");
}

/**
 * Crée l’overlay SVG appliqué sur la photo de fond.
 */
function createTextOverlay(title, subtitle) {
    const safeTitle = escapeXml(title);
    const subtitleLines = wrapText(subtitle, 40);

    const subtitleStartY =
        subtitleLines.length > 1 ? 360 : 375;

    const subtitleTspans = createTspans(
        subtitleLines,
        600,
        subtitleStartY,
        44
    );

    const decorativeLineY =
        subtitleStartY +
        Math.max(subtitleLines.length - 1, 0) * 44 +
        48;

    const svg = `
    <svg
      width="${OG_WIDTH}"
      height="${OG_HEIGHT}"
      viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="backgroundGradient"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            stop-color="#0a0a0a"
            stop-opacity="0.58"
          />
          <stop
            offset="55%"
            stop-color="#0a0a0a"
            stop-opacity="0.72"
          />
          <stop
            offset="100%"
            stop-color="#0a0a0a"
            stop-opacity="0.94"
          />
        </linearGradient>
      </defs>

      <rect
        width="${OG_WIDTH}"
        height="${OG_HEIGHT}"
        fill="url(#backgroundGradient)"
      />

      <text
        x="600"
        y="290"
        font-family="Arial, Helvetica, sans-serif"
        font-size="68"
        font-weight="700"
        fill="#F5F5F0"
        text-anchor="middle"
        letter-spacing="2"
      >${safeTitle}</text>

      <text
        font-family="Arial, Helvetica, sans-serif"
        font-size="34"
        font-weight="500"
        fill="#eb0071"
        text-anchor="middle"
      >
        ${subtitleTspans}
      </text>

      <rect
        x="450"
        y="${decorativeLineY}"
        width="300"
        height="4"
        rx="2"
        fill="#eb0071"
      />
    </svg>
  `;

    return Buffer.from(svg);
}

/**
 * Génère toutes les images Open Graph.
 */
async function generateOpenGraphImages() {

    for (const config of images) {
        const outputPath = join(publicDir, config.name);

        try {
            const overlay = createTextOverlay(
                config.title,
                config.subtitle
            );

            await sharp(config.baseImage)
                .rotate()
                .resize(OG_WIDTH, OG_HEIGHT, {
                    fit: "cover",
                    position: config.position ?? "center",
                })
                .composite([
                    {
                        input: overlay,
                        top: 0,
                        left: 0,
                    },
                ])
                .jpeg({
                    quality: 88,
                    progressive: true,
                    mozjpeg: true,
                })
                .toFile(outputPath);

        } catch (error) {
            console.error(
                `❌ Erreur lors de la génération de ${config.name}:`,
                error instanceof Error ? error.message : error
            );
        }
    }
}

/**
 * Génère les images publiques complémentaires.
 */
async function generatePublicImages() {
    const logoSource = join(
        assetsDir,
        "white_logo_jaga.png"
    );

    const coachSource = join(assetsDir, "coach.jpg");

    try {
        await sharp(logoSource)
            .rotate()
            .resize(512, 512, {
                fit: "contain",
                background: {
                    r: 10,
                    g: 10,
                    b: 10,
                    alpha: 0,
                },
            })
            .png({
                compressionLevel: 9,
            })
            .toFile(join(publicDir, "logo.png"));

    } catch (error) {
        console.error(
            "❌ Erreur lors de la création de logo.png :",
            error instanceof Error ? error.message : error
        );
    }

    try {
        await sharp(coachSource)
            .rotate()
            .resize(800, 800, {
                fit: "cover",
                position: "center",
            })
            .jpeg({
                quality: 92,
                progressive: true,
                mozjpeg: true,
            })
            .toFile(join(publicDir, "coach-hicham.jpg"));

    } catch (error) {
        console.error(
            "❌ Erreur lors de la création de coach-hicham.jpg :",
            error instanceof Error ? error.message : error
        );
    }

    try {
        await sharp(logoSource)
            .rotate()
            .resize(32, 32, {
                fit: "contain",
                background: {
                    r: 10,
                    g: 10,
                    b: 10,
                    alpha: 0,
                },
            })
            .png({
                compressionLevel: 9,
            })
            .toFile(join(publicDir, "favicon-32x32.png"));

    } catch (error) {
        console.error(
            "❌ Erreur lors de la création du favicon :",
            error instanceof Error ? error.message : error
        );
    }

    try {
        await sharp(logoSource)
            .rotate()
            .resize(180, 180, {
                fit: "contain",
                background: {
                    r: 10,
                    g: 10,
                    b: 10,
                    alpha: 1,
                },
            })
            .png({
                compressionLevel: 9,
            })
            .toFile(join(publicDir, "apple-touch-icon.png"));

    } catch (error) {
        console.error(
            "❌ Erreur lors de la création de l’Apple Touch Icon :",
            error instanceof Error ? error.message : error
        );
    }
}

/**
 * Fonction principale.
 */
async function generateImages() {
    await mkdir(publicDir, {
        recursive: true,
    });

    await generateOpenGraphImages();
    await generatePublicImages();
}

generateImages().catch((error) => {
    console.error(
        "\n❌ La génération des images a échoué :",
        error instanceof Error ? error.message : error
    );

    process.exitCode = 1;
});