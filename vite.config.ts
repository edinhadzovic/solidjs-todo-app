import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    solidPlugin(), 
    VitePWA(
      {
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],  
        manifest: {
          name: 'Name of your app',
          short_name: 'Short name of your app',
          description: 'Description of your app',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'icon128x128.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icon128x128.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'icon128x128.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            }
          ]
        }
      }
    )
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
