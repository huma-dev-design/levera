import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL, LANGS } from './site.config.js';

const hreflang = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/">`).join('\n')
  + `\n<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`;

// The per-language pages (dist/en, dist/ko) are written by scripts/prerender.mjs after the build.
export default defineConfig({
  plugins: [react(), { name: 'levera-hreflang', transformIndexHtml: html => html.replace('</head>', hreflang + '\n</head>') }],
});
