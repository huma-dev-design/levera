import { useEffect, useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { useReveal } from '../hooks/index.js';
import { img, reduce } from '../utils.js';

export default function BeforeAfter() {
  const { T } = useLang();
  const [x, setX] = useState(50);
  const ref = useReveal();

  // a short wiggle the first time the slider comes into view, to show it can be dragged
  useEffect(() => {
    const el = ref.current;
    if (reduce || !('IntersectionObserver' in window)) return;
    let raf;
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const f = now => {
        const k = Math.min(1, (now - t0) / 1600);
        setX(50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k));
        if (k < 1) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [ref]);

  return (
    <section className="sec wrap" aria-labelledby="ba-h">
      <div className="sec-head"><Tx as="h2" id="ba-h" k="ba.h" /><Tx as="p" className="sub" k="ba.sub" /></div>
      <div className="ba rv" id="ba" ref={ref} style={{ '--x': x + '%' }}>
        <img src={img('late-night.webp')} alt={T['ba.alt1']} width="1280" height="800" loading="lazy" decoding="async" />
        <img className="after" src={img('assistant-desk.webp')} alt={T['ba.alt2']} width="1280" height="914" loading="lazy" decoding="async" />
        <div className="ba-line"></div>
        <input type="range" min="0" max="100" value={x} id="baRange" aria-label={T['ba.aria']} onChange={e => setX(+e.target.value)} />
        <div className="ba-knob"><svg><use href="#i-drag" /></svg></div>
        <div className="tag-b"><Tx as="b" k="ba.t1" /><Tx k="ba.d1" /></div>
        <div className="tag-a"><Tx as="b" k="ba.t2" /><Tx k="ba.d2" /></div>
      </div>
      <div className="ba-note"><Tx k="ba.n1" /><Tx k="ba.n2" /></div>
    </section>
  );
}
