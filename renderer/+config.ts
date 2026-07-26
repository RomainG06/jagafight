// renderer/+config.ts
// Configuration Vike pour le pre-rendering

import type { Config } from 'vike/types'

export default {
    // Active le pre-rendering pour toutes les pages
    prerender: true,

    // Passe le pageContext au client
    passToClient: ['pageProps', 'urlPathname'],
} satisfies Config

