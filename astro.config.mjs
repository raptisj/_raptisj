import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import robotsTxt from 'astro-robots-txt';
import webmanifest from 'astro-webmanifest';

// https://astro.build/config
export default defineConfig({
  site: "https://www.johnraptis.dev/",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    robotsTxt({
      sitemapBaseFileName: 'sitemap-index',
      policy: [
        {
          userAgent: 'Googlebot',
          allow: '/',
          crawlDelay: 2,
        },
      ],
    }),
    webmanifest({
      name: 'John Raptis',
      icon: './public/favicon.ico',
      lang: 'en-US',
      short_name: 'raptisj',
      description: "Personal blog of John Raptis",
      theme_color: '#8bc34a',
      background_color: '#8bc34a',
      display: 'standalone',
    }),
  ],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});