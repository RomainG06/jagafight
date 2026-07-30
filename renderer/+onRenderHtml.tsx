// renderer/+onRenderHtml.tsx
// Server-side rendering pour Vike avec react-helmet-async
export { onRenderHtml }

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { HelmetProvider } from 'react-helmet-async'
import type { OnRenderHtmlAsync } from 'vike/types'
import Layout from './Layout'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
    const { Page, urlPathname } = pageContext

    if (!Page) throw new Error('Page component is undefined')

    // Création du contexte Helmet
    const helmetContext: { helmet?: any } = {}

    // Premier rendu pour peupler le contexte Helmet
    ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <Layout pathname={urlPathname}>
                <Page />
            </Layout>
        </HelmetProvider>
    )

    // Deuxième rendu pour obtenir le HTML final avec les valeurs Helmet correctes
    const pageHtml = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <Layout pathname={urlPathname}>
                <Page />
            </Layout>
        </HelmetProvider>
    )

    // Extraction des meta tags de Helmet après le rendu
    const { helmet } = helmetContext

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/logo_jaga.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jaga Fight" />
        <meta property="og:locale" content="fr_FR" />
        ${helmet ? dangerouslySkipEscape(helmet.title?.toString() || '') : ''}
        ${helmet ? dangerouslySkipEscape(helmet.meta?.toString() || '') : ''}
        ${helmet ? dangerouslySkipEscape(helmet.link?.toString() || '') : ''}
        ${helmet ? dangerouslySkipEscape(helmet.script?.toString() || '') : ''}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

    return {
        documentHtml,
        pageContext: {}
    }
}
