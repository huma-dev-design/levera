import { useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { Check } from './Icons.jsx';
import { fmt, img, reduce } from '../utils.js';

function ReportBlock({ cls, title, items, empty }) {
  if (!items.length && !empty) return null;
  return (
    <div className={'rp' + (cls && items.length ? ' ' + cls : '')}>
      <h4 className="rp-h"><i></i>{title}<b>{items.length}</b></h4>
      {items.length
        ? <ul>{items.map(x => <li key={x}>{cls ? <i></i> : <Check />}{x}</li>)}</ul>
        : <p className="none">{empty}</p>}
    </div>
  );
}

export default function Reporting() {
  const { T } = useLang();
  const [day, setDay] = useState(0);
  const [done, setDone] = useState(() => new Set());
  const [anim, setAnim] = useState(false);
  const ref = useReveal();

  const toggle = (i, checked) => setDone(prev => {
    const next = new Set(prev);
    checked ? next.add(i) : next.delete(i);
    return next;
  });
  const pickDay = i => { setDay(i); setAnim(!reduce); };

  const [doneL, prog, dec] = T.reports[day];

  return (
    <section className="sec wrap" aria-labelledby="rep-h">
      <div className="sec-head wide"><Tx as="h2" id="rep-h" k="rep.h" /><Tx as="p" className="sub" k="rep.sub" /></div>
      <div className="rep rv" ref={ref}>
        <div className="rep-top">
          <Tx as="p" k="rep.pick" />
          <div className="days" role="tablist" id="days" aria-label={T['rep.listT']}>
            {T.daysS.map((d, i) => <button key={i} type="button" role="tab" aria-selected={i === day} onClick={() => pickDay(i)}>{d}</button>)}
          </div>
        </div>
        <div className="rep-grid">
          <div className="sheet">
            <div className="sheet-h"><Tx as="strong" k="rep.listT" /><Tx k="rep.listS" /></div>
            <ul className="tasks-l" id="taskList">
              {T.weekly.map(([t, when, days], i) => (
                <li key={i} className={days.includes(day) ? 'today' : ''}>
                  <label><input type="checkbox" checked={done.has(i)} onChange={e => toggle(i, e.target.checked)} /><span>{t}</span></label>
                  {days.includes(day) ? <span className="tday">{T['rep.today']}</span> : null}<small>{when}</small>
                </li>
              ))}
            </ul>
          </div>
          <div className="mail">
            <div className="mail-meta"><img className="mail-av" src={img('person-ana.webp')} alt="" /><span><Tx k="rep.from" /> <Tx as="b" k="rep.fromV" /></span><span><Tx k="rep.subj" /> <b id="mailSubj">{fmt(T['rep.mailSubj'], { day: T.days[day] })}</b></span></div>
            <div className={'mail-body' + (anim ? ' enter' : '')} id="mailBody" aria-live="polite" key={day}>
              <ReportBlock title={T['rep.done']} items={doneL} />
              <ReportBlock cls="p" title={T['rep.prog']} items={prog} />
              <ReportBlock cls="d" title={T['rep.dec']} items={dec} empty={T['rep.none']} />
            </div>
          </div>
        </div>
      </div>
      <Tx as="p" className="fine rep-note" k="rep.note" />
    </section>
  );
}
