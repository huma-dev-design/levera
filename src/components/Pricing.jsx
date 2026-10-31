import { Tx, useLang } from '../LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { Check } from './Icons.jsx';
import { fmt } from '../utils.js';

const Cross = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" /></svg>;

export default function Pricing() {
  const { T } = useLang();
  const planRef = useReveal(), sideRef = useReveal();

  return (
    <section className="sec pricing" id="pricing" aria-labelledby="price-h"><div className="wrap">
      <div className="sec-head wide"><Tx as="h2" id="price-h" k="pr.h" /><Tx as="p" className="sub" k="pr.sub" /></div>
      <div className="price-grid">
        <article className="plan rv" ref={planRef}>
          <Tx as="h3" k="pr.name" />
          <p className="price"><b>$2,499</b><Tx k="pr.once" /></p>
          <Tx as="p" className="when-pay" k="pr.when" />
          <ul className="checks" id="prList">{T.incl.map(x => <li key={x}><Check />{x}</li>)}</ul>
          <Tx as="a" className="btn btn-light" href="#book" k="hero.cta1" />
        </article>
        <div className="side-p rv" style={{ '--d': '.08s' }} ref={sideRef}>
          <div className="box">
            <Tx as="h3" k="pr.qaH" />
            <ol className="wk-list" id="weeks">
              {T.weeks.map((t, i) => <li key={i}><span className="wk-n">{fmt(T['pr.wk'], { n: i + 1 })}</span><span>{t}</span></li>)}
            </ol>
            <Tx as="p" className="fine" k="pr.qaNote" />
          </div>
          <div className="box-row">
            <div className="box"><Tx as="h3" k="pr.payH" /><Tx as="p" k="pr.payP" /></div>
            <div className="box not-box"><Tx as="h3" k="pr.notH" />
              <ul className="not-list">{T.notIncl.map(x => <li key={x}><Cross />{x}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div></section>
  );
}
