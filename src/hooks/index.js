import { useEffect, useRef, useState } from 'react';
import { reduce } from '../utils.js';

/* Fades an element up when it first scrolls into view (the original .rv / .pre reveal). */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top <= innerHeight * 0.9) return;
    el.classList.add('pre');
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) { el.classList.remove('pre'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* Animates a number from its previous value to the new one (ease-out cubic, 450ms). */
export function useTween(to) {
  const [v, setV] = useState(to);
  const last = useRef(to);
  useEffect(() => {
    const from = last.current;
    last.current = to;
    if (reduce || from === to) { setV(to); return; }
    const t0 = performance.now();
    let raf;
    const st = now => {
      const k = Math.min(1, (now - t0) / 450), e = 1 - Math.pow(1 - k, 3);
      setV(from + (to - from) * e);
      if (k < 1) raf = requestAnimationFrame(st);
    };
    raf = requestAnimationFrame(st);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return v;
}
