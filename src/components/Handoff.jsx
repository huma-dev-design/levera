import { useRef, useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { Check, Icon } from './Icons.jsx';
import { stripTags } from '../utils.js';

function Vignette({ v }) {
  const { T } = useLang();
  let body = null;
  if (v.rows) {
    body = v.rows.map(([a, b, c, t], i) => (
      <div className="li" key={i}><div className="m"><strong>{a}</strong><span>{b}</span></div><span className={'chip ' + t}>{c}</span></div>
    ));
  } else if (v.chat) {
    body = <div className="bub"><p className="in">{v.chat[0]}</p><p className="out">{v.chat[1]}</p><p className="in">{v.chat[2]}</p></div>;
  } else if (v.cal) {
    body = (
      <div className="cal"><span></span>{T.daysS.slice(0, 4).map(x => <span className="d" key={x}>{x}</span>)}
        <span>{T['cal.times'][0]}</span><div className="slot b">Kim</div><div className="slot f"></div><div className="slot b">Lee</div><div className="slot f"></div>
        <span>{T['cal.times'][1]}</span><div className="slot f"></div><div className="slot b">Park</div><div className="slot f"></div><div className="slot b">{T['cal.vendor']}</div>
        <span>{T['cal.times'][2]}</span><div className="slot"></div><div className="slot f"></div><div className="slot"></div><div className="slot f"></div>
        <span>{T['cal.times'][3]}</span><div className="slot b">Choi</div><div className="slot"></div><div className="slot f"></div><div className="slot"></div>
      </div>
    );
  } else if (v.flow) {
    body = (
      <div className="flow">{v.flow.map((x, i) => [
        i ? <div className="arrow" key={'a' + i}></div> : null,
        <div className={'node' + (i === 2 ? ' me' : '')} key={i}><i>{i + 1}</i>{x}</div>,
      ])}</div>
    );
  }
  return <div className="card"><div className="card-h">{v.t}<span>{v.s}</span></div>{body}</div>;
}

export default function Handoff() {
  const { T } = useLang();
  const [task, setTask] = useState('invoices');
  const [entered, setEntered] = useState(false);
  const tabRefs = useRef({});

  const select = (k, focus) => {
    setTask(k);
    setEntered(true);
    if (focus) tabRefs.current[k]?.focus();
  };
  const onKey = (e, i) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    select(T.tasks[(i + d + T.tasks.length) % T.tasks.length][0], true);
  };

  return (
    <section className="sec handoff" id="work" aria-labelledby="work-h"><div className="wrap">
      <div className="sec-head"><Tx as="h2" id="work-h" k="work.h" /><Tx as="p" className="sub" k="work.sub" /></div>
      <div className="board">
        <div className="task-groups" role="tablist" aria-orientation="horizontal" id="tabs" aria-label={stripTags(T['work.h'])}>
          {[[T['work.top'], 1], [T['work.more'], 0]].map(([label, top]) => (
            <div className="tg" role="presentation" key={top}>
              <span className="tg-l">{label}</span>
              <div className="tg-row" role="presentation">
                {T.tasks.map(([k, ic, name, , , , isTop], i) => !isTop === !top && (
                  <button className="tab" role="tab" id={'tab-' + k} aria-controls={'pn-' + k} aria-selected={k === task} tabIndex={k === task ? 0 : -1} key={k}
                    ref={el => { tabRefs.current[k] = el; }} onClick={() => select(k)} onKeyDown={e => onKey(e, i)}>
                    <Icon id={ic} /><span>{name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div id="panes">
          {T.tasks.map(([k, , name, desc, items, vig]) => (
            <div className={'pane' + (entered && k === task ? ' enter' : '')} role="tabpanel" id={'pn-' + k} aria-labelledby={'tab-' + k} hidden={k !== task} key={k}>
              <div className="pane-copy"><h3>{name}</h3><p className="sub">{desc}</p>
                <ul className="checks">{items.map(t => <li key={t}><Check />{t}</li>)}</ul>
              </div>
              <div className="vig"><Vignette v={vig} /><p className="vig-cap">{T['work.foot']}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div></section>
  );
}
