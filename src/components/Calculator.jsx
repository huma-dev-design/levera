import { useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { useTween } from '../hooks/index.js';
import { fmt, money } from '../utils.js';

const FEE = 2499;
const SALARIES = [600, 900, 1200];
const fill = (v, min, max) => ({ '--p': (v - min) / (max - min) * 100 + '%' });

export default function Calculator() {
  const { T } = useLang();
  const [h, setH] = useState(15);
  const [r, setR] = useState(90);
  const [sal, setSal] = useState(600);

  const year = h * 48, val = year * r, cost = sal * 12;
  const yearT = useTween(year), valT = useTween(val), costT = useTween(cost);
  const max = Math.max(val, cost);
  const worth = val > (cost + FEE) * 1.2;
  const hrs = n => fmt(T['calc.hrs'], { n });

  return (
    <section className="sec calc-sec" id="time" aria-labelledby="time-h"><div className="wrap">
      <div className="sec-head wide"><Tx as="h2" id="time-h" k="calc.h" /><Tx as="p" className="sub" k="calc.sub" /></div>
      <div className="calc">
        <div className="calc-l">
          <div className="fields">
            <div className="field"><div className="f-top"><Tx as="label" htmlFor="hrs" k="calc.l1" /><output id="hrsOut" htmlFor="hrs">{hrs(h)}</output></div>
              <input type="range" id="hrs" min="2" max="40" step="1" value={h} style={fill(h, 2, 40)} onChange={e => setH(+e.target.value)} />
              <div className="range-ends"><span>{hrs(2)}</span><span>{hrs(40)}</span></div></div>
            <div className="field"><div className="f-top"><Tx as="label" htmlFor="rate" k="calc.l2" /><output id="rateOut" htmlFor="rate">{'$' + r}</output></div>
              <input type="range" id="rate" min="25" max="300" step="5" value={r} style={fill(r, 25, 300)} onChange={e => setR(+e.target.value)} />
              <div className="range-ends"><span>$25</span><span>$300</span></div></div>
            <div className="field"><div className="f-top"><Tx className="lbl" id="salLbl" k="calc.l3" /></div>
              <div className="sal" role="group" aria-labelledby="salLbl" id="sal">
                {SALARIES.map(s => <button key={s} type="button" aria-pressed={s === sal} onClick={() => setSal(s)}>{money(s)}</button>)}
              </div></div>
          </div>
          <Tx as="p" className="fine calc-fine" k="calc.fine" />
        </div>
        <div className="result" aria-live="polite">
          <Tx as="p" className="k" k="calc.k" />
          <p className="r-big"><span id="yearHrs">{Math.round(yearT).toLocaleString('en-US')}</span><Tx as="small" k="calc.unit" /></p>
          <p className="r-sub" id="rSub">{fmt(T['calc.rsub'], { w: Math.round(year / 40) })}</p>
          <div className="cmp">
            <div className="cmp-row"><div><Tx k="calc.c1" /><b id="valOut">{money(valT)}</b></div><div className="meter"><i id="barVal" style={{ width: val / max * 100 + '%' }}></i></div></div>
            <div className="cmp-row"><div><span id="salName">{fmt(T['calc.salName'], { s: money(sal) })}</span><b id="costOut">{money(costT)}</b></div><div className="meter b"><i id="barCost" style={{ width: Math.max(3, cost / max * 100) + '%' }}></i></div></div>
          </div>
          <div className="fee-row"><Tx k="calc.fee" /><b>$2,499</b></div>
          <p className={'verdict' + (worth ? '' : ' w')} id="verdict">
            <svg viewBox="0 0 24 24" aria-hidden="true">{worth ? <path d="M5 12.5 9.5 17 19 7.5" /> : <path d="M12 8v5M12 16.5v.5M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z" />}</svg>
            <span>{worth ? T['calc.v1'] : T['calc.v2']}</span>
          </p>
          <Tx as="a" className="btn btn-green" href="#book" k="hero.cta1" />
        </div>
      </div>
    </div></section>
  );
}
