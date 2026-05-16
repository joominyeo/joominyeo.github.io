import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://joominyeo.github.io',
  integrations: [mdx()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',  // McMaster-Carr hover prefetch
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
