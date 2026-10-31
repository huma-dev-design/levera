import { Tx, useLang } from '../LangContext.jsx';
import { useReveal } from '../hooks/index.js';

export default function Steps() {
  const { T } = useLang();
  const ref = useReveal();
  const last = T.steps.length - 1;

  return (
    <section className="sec wrap" id="how" aria-labelledby="how-h">
      <div className="sec-head wide"><Tx as="h2" id="how-h" k="how.h" /><Tx as="p" className="sub" k="how.sub" /></div>
      <ol className="steps rv" id="stepList" ref={ref}>
        {T.steps.map(([h, desc, w], i) => (
          <li className={'step' + (i === last ? ' after' : '')} key={i}>
            <span className="n">{i + 1}</span>
            <h3>{h}</h3><p>{desc}</p><span className="when">{w}</span>
          </li>
        ))}
      </ol>
      <Tx as="p" className="fine steps-note" k="how.note" />
    </section>
  );
}
