import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/**
 * Nahrádza placeholdre v index.html: OG obrázok, voliteľný blok og:url + canonical (len ak je VITE_SITE_URL).
 */
function htmlMetaPlaceholders(ogImageUrl: string, siteOrigin: string) {
  const siteBlock = siteOrigin
    ? `    <meta property="og:url" content="${siteOrigin}/" />
    <link rel="canonical" href="${siteOrigin}/" />
`
    : ''
  return {
    name: 'html-meta-placeholders',
    transformIndexHtml(html: string) {
      return html
        .split('__OG_IMAGE_URL__')
        .join(ogImageUrl)
        .split('__SITE_URL_BLOCK__')
        .join(siteBlock)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const origin = (env.VITE_SITE_URL || '').replace(/\/$/, '')
  const ogImageUrl = origin ? `${origin}/og-thumbnail.jpg` : '/og-thumbnail.jpg'

  return {
  plugins: [
    figmaAssetResolver(),
    htmlMetaPlaceholders(ogImageUrl, origin),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
