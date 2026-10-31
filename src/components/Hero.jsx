import { useCallback, useEffect, useRef, useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { Tick } from './Icons.jsx';
import { img, reduce } from '../utils.js';

const IND = ['carrental', 'realestate', 'trucking', 'construction', 'property', 'accounting'];

export default function Hero() {
  const { lang, T } = useLang();
  const [ind, setInd] = useState('carrental');
  const [imgKey, setImgKey] = useState('carrental');
  const [out, setOut] = useState(false);
  const [on, setOn] = useState(0);
  const indRef = useRef(ind), imgRef = useRef(imgKey), tickTimer = useRef(), swapTimer = useRef(), auto = useRef();

  const showInd = useCallback((k, animate) => {
    indRef.current = k;
    setInd(k);
    clearTimeout(tickTimer.current);
    clearTimeout(swapTimer.current);
    if (animate && !reduce) {
      setOut(true);
      swapTimer.current = setTimeout(() => {
        // a changed src fades back in on load; the same src would never fire load
        if (imgRef.current === k) setOut(false);
        imgRef.current = k;
        setImgKey(k);
      }, 280);
      setOn(0);
      let i = 0;
      const go = () => { if (i < 4) { setOn(++i); tickTimer.current = setTimeout(go, 600); } };
      tickTimer.current = setTimeout(go, 450);
    } else {
      imgRef.current = k;
      setImgKey(k);
      setOut(false);
      setOn(Infinity);
    }
  }, []);

  // animate the first card, then cycle industries until someone picks one,
  // skipping turns while the hero is off-screen or the tab is in the background
  const sectionRef = useRef(null), inView = useRef(true);
  useEffect(() => {
    showInd(indRef.current, true);
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(es => { inView.current = es[0].isIntersecting; });
      io.observe(sectionRef.current);
    }
    if (!reduce) auto.current = setInterval(() => {
      if (document.hidden || !inView.current) return;
      showInd(IND[(IND.indexOf(indRef.current) + 1) % IND.length], true);
    }, 7000);
    return () => { io?.disconnect(); clearInterval(auto.current); clearTimeout(tickTimer.current); clearTimeout(swapTimer.current); };
  }, [showInd]);

  // switching language shows the current card complete, without animating
  const firstLang = useRef(true);
  useEffect(() => {
    if (firstLang.current) { firstLang.current = false; return; }
    clearTimeout(tickTimer.current);
    setOn(Infinity);
  }, [lang]);

  const pick = k => { clearInterval(auto.current); showInd(k, true); };
  const d = T.industries[ind];

  return (
    <section className="hero" id="top" ref={sectionRef}><div className="wrap hero-grid">
      <div>
        <Tx as="h1" k="hero.h1" />
        <Tx as="p" className="sub" k="hero.sub" />
        <p className="terms"><span><Tick /><Tx k="hero.t1" /></span><span><Tick /><Tx k="hero.t2" /></span></p>
        <div className="cta"><Tx as="a" className="btn btn-green" href="#book" k="hero.cta1" /><Tx as="a" className="btn btn-line" href="#work" k="hero.cta2" /></div>
        <Tx as="p" className="fine" k="hero.fine" />
      </div>
      <div className="visual">
        <div className="ind-pick"><Tx as="p" k="hero.pick" />
          <div className="seg" role="group" id="seg" aria-label={T['hero.pick']}>
            {IND.map(k => (
              <button key={k} type="button" aria-pressed={k === ind} onClick={() => pick(k)}><img src={img(`thumb/ind-${k}.webp`)} alt="" width="32" height="32" />{T.industries[k][0]}</button>
            ))}
          </div>
        </div>
        <div className="stage">
          <div className="photo"><img src={img(`ind-${imgKey}.webp`)} srcSet={`${img(`ind-${imgKey}-640.webp`)} 640w, ${img(`ind-${imgKey}.webp`)} 1100w`} sizes="(max-width: 720px) 92vw, 46vw" fetchpriority="high" alt={T.industries[imgKey][0]} id="heroImg" className={out ? 'out' : undefined} onLoad={() => setOut(false)} /></div>
          <div className="badge-top"><i></i><Tx k="hero.badge" /></div>
          <div className="done-card" aria-live="polite">
            <div className="dc-h"><strong id="dcTitle">{d[1]}</strong><Tx k="hero.cardBy" /></div>
            <ul className="dc-list" id="dcList">
              {d[2].map(([t, flag], i) => (
                <li key={ind + i} className={[flag ? 'flag' : '', i < on ? 'on' : ''].join(' ').trim() || undefined}><span className="tk"><Tick /></span><span>{t}</span></li>
              ))}
            </ul>
            <div className="dc-foot"><Tx k="hero.cardFoot" /><Tx as="b" k="hero.cardPay" /></div>
          </div>
        </div>
      </div>
    </div></section>
  );
}
