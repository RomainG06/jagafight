import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vike from 'vike/plugin'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vike(), // Pre-rendering configuré dans renderer/+config.ts
    ViteImageOptimizer({
      // Optimisation automatique des images au build
      jpg: { quality: 85 },
      jpeg: { quality: 85 },
      png: { quality: 85 },
      webp: { quality: 85 },
      avif: { quality: 75 }, // AVIF compresse mieux, qualité légèrement inférieure OK
    }),
  ],

  // Configuration esbuild pour la minification
  esbuild: {
    drop: ['console', 'debugger'], // Supprime console.log et debugger en production
  },

  build: {
    // Optimisations pour la production
    rollupOptions: {
      output: {
        // Code splitting manuel pour optimiser les chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-helmet-async')) {
              return 'helmet';
            }
          }
        },
      },
    },
    // Minification avec esbuild (rapide et efficace)
    minify: 'esbuild',
    // Pas de sourcemap en production pour réduire la taille
    sourcemap: false,
    // Optimisation des chunks
    chunkSizeWarningLimit: 1000,
  },
})
