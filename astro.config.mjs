import { defineConfig } from 'astro/config';
import { dark } from '@clerk/themes';
import markdoc from '@astrojs/markdoc';
import clerk from '@clerk/astro';
import node from '@astrojs/node';
import preact from '@astrojs/preact'; // ✅ you already added this

export default defineConfig({
  integrations: [
    markdoc(),
    clerk({
      appearance: { baseTheme: dark },
    }),
    preact()
  ],
  adapter: node({ mode: 'standalone' }),
  site: `https://${process.env.FT_DOCS_HOST}`,
  base: '/',
  output: process.env.FT_DOCS_FORCE_AUTH == '1' ? 'server' : 'static',
  trailingSlash: 'ignore',

  // ✅ ADD THIS TO MAKE JSX CONFIG WORK
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'preact'
    },
    build: {
      rollupOptions: {
        external: ['fsevents']
      }
    }
  }
});
