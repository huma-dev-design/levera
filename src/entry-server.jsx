import { renderToString } from 'react-dom/server';
import { LangProvider } from './LangContext.jsx';
import App from './App.jsx';

// Used only at build time, to write each language page as finished HTML.
export const render = lang => renderToString(<LangProvider initial={lang}><App /></LangProvider>);
export { I18N } from './i18n.js';
export { KO_FONTS } from './LangContext.jsx';
