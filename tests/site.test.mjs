// Browser checks for the built site. Run with: npm run build && npm test
// Uses the Chrome installed on this computer.
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';

const PORT = 4173, BASE = `http://localhost:${PORT}`;
const server = spawn(`npx vite preview --port ${PORT} --strictPort`, { shell: true, stdio: 'ignore' });
const stop = () => { if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/t', '/f']); else server.kill(); };
for (let i = 0; i < 40; i++) { try { await fetch(BASE + '/en/'); break; } catch { await new Promise(r => setTimeout(r, 250)); } }

let failed = 0;
const ok = (name, pass) => { if (!pass) failed++; console.log((pass ? 'PASS ' : 'FAIL ') + name); };
const browser = await chromium.launch({ channel: 'chrome' });

try {
  // the pre-built pages carry their content, language and search data before any script runs
  const enHtml = await (await fetch(BASE + '/en/')).text();
  const koHtml = await (await fetch(BASE + '/ko/')).text();
  ok('pre-built English page has its text', enHtml.includes('How to Use Them.') && enHtml.includes('<html lang="en">'));
  ok('pre-built Korean page has its text', koHtml.includes('제대로 활용할') && koHtml.includes('<html lang="ko">'));
  ok('Korean fonts only on the Korean page', !enHtml.includes('Noto+Sans+KR') && koHtml.includes('Noto+Sans+KR'));
  ok('share previews and FAQ data', enHtml.includes('og:image') && enHtml.includes('"FAQPage"') && koHtml.includes('og-ko.jpg'));
  ok('sitemap, robots and tab icon', (await fetch(BASE + '/sitemap.xml')).ok && (await fetch(BASE + '/robots.txt')).ok && (await fetch(BASE + '/favicon.ico')).ok);

  const p = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = []; p.on('console', m => m.type() === 'error' && errors.push(m.text())); p.on('pageerror', e => errors.push(e.message));
  const bad = []; p.on('response', r => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()));
  const imgs = []; p.on('request', r => r.resourceType() === 'image' && imgs.push(r.url()));

  await p.goto(BASE + '/en/'); await p.waitForTimeout(3500);
  ok('picker loads small thumbnails, not full photos', imgs.filter(u => u.includes('/thumb/')).length === 6);
  ok('hero ticks animate', await p.locator('#dcList li.on').count() === 4);
  await p.click('#seg button:has-text("Trucking")'); await p.waitForTimeout(3200);
  ok('industry switch', (await p.textContent('#dcTitle')) === 'Lee Freight' && !((await p.getAttribute('#heroImg', 'class')) || '').includes('out'));
  await p.click('[lang=ko]'); await p.waitForTimeout(500);
  ok('Korean switch', (await p.evaluate(() => document.documentElement.lang)) === 'ko' && new URL(p.url()).pathname === '/ko/');
  ok('Korean fonts load after switching', await p.locator('#ko-fonts').count() === 1);
  await p.click('[lang=en]'); await p.waitForTimeout(300);
  await p.click('#tab-books'); ok('task tabs', await p.isVisible('#pn-books'));
  await p.focus('#tab-books'); await p.keyboard.press('ArrowRight'); ok('task tabs keyboard', await p.isVisible('#pn-support'));
  await p.locator('#baRange').fill('20'); ok('before/after slider', (await p.getAttribute('#ba', 'style')).includes('20%'));
  await p.click('#days button:has-text("Wed")'); ok('report day', (await p.textContent('#mailSubj')).includes('Wednesday'));
  await p.locator('#hrs').fill('40'); await p.click('#sal button:has-text("$1,200")'); await p.waitForTimeout(700);
  ok('calculator', (await p.textContent('#yearHrs')) === '1,920' && (await p.textContent('#costOut')) === '$14,400');
  ok('support weeks', (await p.locator('#weeks li').count()) === 4);
  await p.click('#faqList details:nth-child(3) summary'); await p.waitForTimeout(100);
  ok('FAQ one open at a time', (await p.locator('#faqList details[open]').count()) === 1);

  await p.click('#form button[type=submit]');
  ok('form validation', (await p.getAttribute('#f-name', 'aria-invalid')) === 'true' && (await p.evaluate(() => document.activeElement.id)) === 'f-name');
  await p.fill('#f-name', 'Sam Patel'); await p.fill('#f-email', 'sam@x.com'); await p.fill('#f-phone', '555 0100');
  const draft = await p.evaluate(() => localStorage.getItem('levera-draft') || '');
  ok('draft keeps the name but never email or phone', draft.includes('Sam Patel') && !draft.includes('sam@x.com') && !draft.includes('555 0100'));
  await p.fill('#f-biz', 'Patel Auto'); await p.check('#f-privacy'); await p.click('#form button[type=submit]');
  ok('thank-you screen', await p.isVisible('#thanks') && (await p.textContent('#thanks h3')) === 'Thank you, Sam.');
  ok('draft cleared after sending', (await p.evaluate(() => localStorage.getItem('levera-draft'))) === null);

  await p.setViewportSize({ width: 390, height: 800 }); await p.click('#menu');
  ok('mobile menu', await p.isVisible('#links a[href="#how"]'));
  ok('no console errors (incl. page take-over)', errors.length === 0); if (errors.length) console.log(errors);
  ok('no missing files', bad.length === 0); if (bad.length) console.log(bad);
} finally {
  await browser.close(); stop();
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
