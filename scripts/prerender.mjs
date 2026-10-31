// Writes dist/en/index.html and dist/ko/index.html as finished pages: the full page text,
// language tags, share previews and FAQ data for search engines, plus sitemap.xml and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL, LANGS } from '../site.config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const { render, I18N, KO_FONTS } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
const json = o => JSON.stringify(o).replace(/</g, '\\u003c');
const OG_LOCALE = { en: 'en_US', ko: 'ko_KR' };

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

for (const l of LANGS) {
  const T = I18N[l];
  const url = `${SITE_URL}/${l}/`;
  const title = esc(T['meta.title']), desc = esc(T['meta.desc']);
  const structured = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: 'LEVERA', url: SITE_URL, logo: `${SITE_URL}/icon-512.png` },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: l,
      mainEntity: T.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];
  const head = [
    `<link rel="canonical" href="${url}">`,
    l === 'ko' ? `<link rel="stylesheet" href="${KO_FONTS}">` : '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="LEVERA">`,
    `<meta property="og:locale" content="${OG_LOCALE[l]}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:image" content="${SITE_URL}/og/og-${l}.jpg">`,
    `<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json">${json(structured)}</script>`,
  ].filter(Boolean).join('\n');

  const page = template
    .replace('<html lang="en">', `<html lang="${l}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`)
    .replace('</head>', head + '\n</head>')
    .replace('<div id="root"></div>', `<div id="root">${render(l)}</div>`);
  fs.mkdirSync(path.join(dist, l), { recursive: true });
  fs.writeFileSync(path.join(dist, l, 'index.html'), page);
  console.log(`prerendered /${l}/ — ${strip(I18N[l]['meta.title'])}`);
}

const alternates = LANGS.map(a => `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE_URL}/${a}/"/>`).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(l => `  <url>\n    <loc>${SITE_URL}/${l}/</loc>\n${alternates}\n  </url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log('wrote sitemap.xml and robots.txt');
