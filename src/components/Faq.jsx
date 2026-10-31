import { useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { Icon } from './Icons.jsx';

export default function Faq() {
  const { T } = useLang();
  const [open, setOpen] = useState(0);

  // only one answer open at a time
  const onToggle = (e, i) => {
    if (e.currentTarget.open) setOpen(i);
    else setOpen(o => (o === i ? -1 : o));
  };

  return (
    <section className="sec wrap" id="faq" aria-labelledby="faq-h">
      <div className="faq">
        <div className="faq-side">
          <Tx as="h2" id="faq-h" k="faq.h" /><Tx as="p" className="sub" k="faq.sub" />
          <div className="faq-card">
            <Tx as="h3" k="faq.cardH" /><Tx as="p" k="faq.cardP" />
            <Tx as="a" className="btn btn-green" href="#book" k="nav.cta" />
          </div>
        </div>
        <div id="faqList">
          {T.faq.map(([q, a], i) => (
            <details className="qa" open={i === open} onToggle={e => onToggle(e, i)} key={i}>
              <summary><span className="qa-n">{String(i + 1).padStart(2, '0')}</span><span className="qa-q">{q}</span><Icon id="i-plus" /></summary><p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
