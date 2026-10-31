# LEVERA website

React (Vite) version of the LEVERA site, in English and Korean.

## Run
1. Install Node.js 18+ (nodejs.org).
2. In this folder: `npm install`
3. `npm run dev` and open the address it prints (usually http://localhost:5173).

English lives at `/en/` and Korean at `/ko/`; `/` sends visitors to their language.

## Build and check
- `npm run build` writes the production site to `dist/`. After the normal build it pre-renders
  `dist/en/index.html` and `dist/ko/index.html` as finished HTML (page text, language tags, share
  previews, FAQ structured data) and writes `sitemap.xml` and `robots.txt` (`scripts/prerender.mjs`).
  Upload `dist/` to any static host.
- `npm test` runs the browser checks in `tests/site.test.mjs` against the build (uses the installed Chrome).
- Set the live domain in `site.config.js` (`SITE_URL`) before launch.
- `public/_headers` holds security and caching headers for Netlify / Cloudflare Pages; on Vercel,
  move them to `vercel.json`. Extend its Content-Security-Policy when the form backend adds services.

## Where things are
- `src/i18n.js`: all English and Korean text (`en` and `ko`).
- `src/styles.css`: all styling.
- `src/components/`: one component per page section (Hero, Handoff, Calculator, Book form, ...).
- `public/img/`: photos and logos; `public/img/thumb/` the small industry-picker thumbnails;
  `ind-*-640.webp` the phone-sized hero photos.
- `public/og/`: share-preview images (`og-en.jpg`, `og-ko.jpg`), taken from the hero section.
- `source-assets/`: full-size originals of resized graphics and images no longer used. Not deployed.
- `legacy/`: the original single-file static site, kept for reference. Not deployed.

The inquiry form is front-end only (`src/components/Book.jsx`, `submit`); connect it to your backend before launch.
The form draft saved in the browser holds only name, business and requirements (never email or phone)
and is cleared once the request is sent.
