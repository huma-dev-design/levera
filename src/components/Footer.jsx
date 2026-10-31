import { Tx } from '../LangContext.jsx';
import { img } from '../utils.js';

export default function Footer() {
  return (
    <footer className="foot"><div className="wrap">
      <div className="foot-top">
        <div className="foot-brand"><img className="foot-logo" src={img('logo-horizontal-sm.webp')} alt="LEVERA" width="600" height="164" /><Tx as="p" k="ft.p" /></div>
        <nav className="foot-cols" aria-label="Footer">
          <div><Tx as="h4" k="ft.c1" /><ul><li><Tx as="a" href="#work" k="ft.l1" /></li><li><Tx as="a" href="#work" k="ft.l2" /></li><li><Tx as="a" href="#work" k="ft.l3" /></li><li><Tx as="a" href="#work" k="ft.l4" /></li></ul></div>
          <div><Tx as="h4" k="ft.c2" /><ul><li><Tx as="a" href="#how" k="nav.how" /></li><li><Tx as="a" href="#pricing" k="nav.pricing" /></li><li><Tx as="a" href="#faq" k="nav.faq" /></li><li><Tx as="a" href="#book" k="nav.cta" /></li></ul></div>
          <div><Tx as="h4" k="ft.c3" /><ul><li><a href="mailto:hello@levera.co">hello@levera.co</a></li><li><Tx as="a" href="#top" k="ft.privacy" /></li><li><Tx as="a" href="#top" k="ft.terms" /></li></ul></div>
        </nav>
      </div>
      <div className="giant-wrap" aria-hidden="true"><img className="giant" src={img('logo-wordmark.webp')} alt="" width="1200" height="327" loading="lazy" decoding="async" /></div>
      <div className="foot-bot"><span>© 2026 LEVERA. Powered by Sun Production.</span><Tx k="ft.tm" /><a className="to-top" href="#top"><Tx k="ft.top" /> ↑</a></div>
    </div></footer>
  );
}
