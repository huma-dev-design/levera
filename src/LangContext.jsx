import { createContext, useContext, useEffect, useState } from 'react';
import { I18N } from './i18n.js';
import { store } from './utils.js';

const LangContext = createContext(null);
const LANGS = ['en', 'ko'];
const BASE = import.meta.env.BASE_URL;

// /en/ and /ko/ are the language routes; the old #en / #ko links still work
const pathLang = () => LANGS.find(l => location.pathname.startsWith(BASE + l));
const hashLang = () => LANGS.find(l => location.hash === '#' + l);
const initialLang = () =>
  pathLang() || hashLang() || store.get('levera-lang') || ((navigator.language || '').startsWith('ko') ? 'ko' : 'en');
const urlFor = l => BASE + l + '/' + (hashLang() ? '' : location.hash);

// Korean fonts are only downloaded when the Korean page is shown
export const KO_FONTS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600&family=Noto+Serif+KR:wght@400;500&display=swap';
const loadKoreanFonts = () => {
  if (document.getElementById('ko-fonts')) return;
  const link = Object.assign(document.createElement('link'), { id: 'ko-fonts', rel: 'stylesheet', href: KO_FONTS });
  document.head.appendChild(link);
};

// initial is set when the page is pre-built for one language
export function LangProvider({ children, initial }) {
  const [lang, setLangState] = useState(() => initial || initialLang());
  const T = I18N[lang];

  useEffect(() => {
    if (pathLang() !== lang || hashLang()) history.replaceState(null, '', urlFor(lang));
    const onPop = () => { const l = pathLang(); if (l) setLangState(l); };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    store.set('levera-lang', lang);
    document.documentElement.lang = lang;
    if (lang === 'ko') loadKoreanFonts();
    document.title = T['meta.title'];
    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = T['meta.desc'];
  }, [lang, T]);

  const setLang = l => {
    if (pathLang() !== l) history.pushState(null, '', urlFor(l));
    setLangState(l);
  };

  return <LangContext.Provider value={{ lang, T, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/* Renders a translated string as HTML (some strings carry <em>/<span>/<a>), like data-i in the original. */
export function Tx({ k, as: Tag = 'span', ...rest }) {
  const { T } = useLang();
  return <Tag data-i={k} dangerouslySetInnerHTML={{ __html: T[k] }} {...rest} />;
}
