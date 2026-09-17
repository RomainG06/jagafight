// renderer/+config.ts

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
    extends: [vikeReact],

    prerender: true,
    clientRouting: true,

    // passToClient: ['pageProps', 'urlPathname', 'routeParams'],
} satisfies Config