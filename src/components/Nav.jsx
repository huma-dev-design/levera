import { useEffect, useState } from 'react';
import { img } from '../utils.js';
import { Tx, useLang } from '../LangContext.jsx';

export default function Nav({ onLang }) {
  const { lang, T } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onS = () => setScrolled(scrollY > 8);
    addEventListener('scroll', onS, { passive: true });
    onS();
    return () => removeEventListener('scroll', onS);
  }, []);

  const closeOnLink = e => { if (e.target.closest('a')) setOpen(false); };

  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')} id="nav"><div className="wrap nav-in">
      <a className="logo" href="#top"><img src={img('logo-horizontal-sm.webp')} alt="LEVERA" width="600" height="164" /></a>
      <ul className={'links' + (open ? ' open' : '')} id="links" onClick={closeOnLink}>
        <li><Tx as="a" href="#work" k="nav.work" /></li><li><Tx as="a" href="#how" k="nav.how" /></li><li><Tx as="a" href="#pricing" k="nav.pricing" /></li><li><Tx as="a" href="#faq" k="nav.faq" /></li>
        <li className="m-only"><Tx as="a" href="#book" k="nav.cta" /></li>
      </ul>
      <div className="lang" role="group" aria-label="Language / 언어">
        <button type="button" aria-pressed={lang === 'en'} lang="en" onClick={() => onLang('en')}>EN</button>
        <button type="button" aria-pressed={lang === 'ko'} lang="ko" onClick={() => onLang('ko')}>한국어</button>
      </div>
      <Tx as="a" className="btn btn-green" href="#book" k="nav.cta" />
      <button className="menu" id="menu" aria-expanded={open} aria-controls="links" aria-label={T['nav.menu']} onClick={() => setOpen(o => !o)}><svg><use href="#i-menu" /></svg></button>
    </div></header>
  );
}
