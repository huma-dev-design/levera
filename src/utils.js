export const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  remove(k) { try { localStorage.removeItem(k); } catch {} },
};

export const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
export const money = n => '$' + Math.round(n).toLocaleString('en-US');
export const stripTags = s => s.replace(/<[^>]+>/g, '');

// absolute image path, so pages under /en/ and /ko/ resolve the same files
export const img = f => import.meta.env.BASE_URL + 'img/' + f;
