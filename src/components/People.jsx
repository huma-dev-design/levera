import { Tx, useLang } from '../LangContext.jsx';
import { img } from '../utils.js';

export default function People() {
  const { T } = useLang();
  return (
    <section className="sec wrap" aria-labelledby="people-h" style={{ paddingTop: 0 }}>
      <div className="sec-head"><Tx as="h2" id="people-h" k="ppl.h" /><Tx as="p" className="sub" k="ppl.sub" /></div>
      <div className="people" id="people">
        {T.people.map(([n, f, role, eng, exp, hrsZ, tools]) => (
          <article className="person" tabIndex={0} key={n}>
            <div className="ph"><img src={img(`${f}.webp`)} alt={n} width="640" height="720" loading="lazy" decoding="async" /><span className="lt">{T['ppl.badge']}</span></div>
            <div className="pb"><h3>{n}</h3><p className="role">{role}</p>
              <dl className="facts">
                <div><dt>{T['ppl.eng']}</dt><dd>{eng}</dd></div>
                <div><dt>{T['ppl.hours']}</dt><dd>{hrsZ}</dd></div>
                <div className="wide"><dt>{T['ppl.exp']}</dt><dd>{exp}</dd></div>
              </dl>
              <dl className="ptools"><div><dt>{T['ppl.tools']}</dt><dd>{tools.join(' · ')}</dd></div></dl>
            </div>
          </article>
        ))}
      </div>
      <Tx as="p" className="fine note" k="ppl.note" />
    </section>
  );
}
