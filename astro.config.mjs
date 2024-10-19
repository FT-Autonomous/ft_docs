// @ts-check
import { defineConfig } from 'astro/config';
import { dark } from '@clerk/themes'
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
  // site: 'https://ft-autonomous.github.io',
  site: `https://${process.env.FT_DOCS_HOST}`,
  base: '/ft_docs',
  output: 'static',
  trailingSlash: 'ignore'
});
