// renderer/+onRenderClient.tsx
// Client-side hydration pour Vike
export { onRenderClient }

import { hydrateRoot } from 'react-dom/client'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import type { OnRenderClientAsync } from 'vike/types'
import Layout from './Layout'
import '../src/index.css' // Import des styles Tailwind

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
    const { Page, urlPathname } = pageContext

    if (!Page) {
        throw new Error('Client-side render error: Page component is undefined')
    }

    const container = document.getElementById('root')
    if (!container) {
        throw new Error('Root element not found')
    }

    hydrateRoot(
        container,
        <HelmetProvider>
            <Layout pathname={urlPathname}>
                <Page />
            </Layout>
        </HelmetProvider>
    )
}
