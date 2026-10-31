import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { LangProvider } from './LangContext.jsx';
import App from './App.jsx';
import './styles.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>
);

// /en/ and /ko/ arrive already built as HTML, so React takes over that markup;
// the bare / page (and the dev server) start empty and are drawn from scratch
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
