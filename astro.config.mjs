// @ts-check
import { defineConfig } from 'astro/config';
import { dark } from '@clerk/themes';
import markdoc from '@astrojs/markdoc';
import clerk from '@clerk/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [
    markdoc(),
    clerk({
      appearance: {
        baseTheme: dark,
      },
    }),
  ],
  adapter: node({ mode: "standalone" }),
  site: `https://${process.env.FT_DOCS_HOST}`,
  base: '/',
  output: 'server', // Add this line to set the output to "server"
  trailingSlash: 'ignore',
  vite: {
    build: {
      rollupOptions: {
        external: [
          // https://stackoverflow.com/questions/71552229/vite-how-do-i-use-a-wildcard-in-rollupjs-build-rollupoptions-external
          "fsevents"
        ]
      }
    }
  }
});
