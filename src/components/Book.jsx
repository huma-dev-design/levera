import { useEffect, useRef, useState } from 'react';
import { Tx, useLang } from '../LangContext.jsx';
import { fmt, img, reduce, store } from '../utils.js';

const DRAFT_KEY = 'levera-draft';
// email and phone are never kept in the browser, so a shared computer does not expose them
const TEXT = { name: 'f-name', biz: 'f-biz', req: 'f-req' };
const EMPTY = { name: '', biz: '', email: '', phone: '', req: '', role: 0, budget: 0, privacy: false, mkt: false, web: '' };
const REQUIRED = ['name', 'biz', 'email'];

// the draft is saved under the field ids, same format as the original static page
const loadDraft = () => {
  const v = { ...EMPTY };
  try {
    const d = JSON.parse(store.get(DRAFT_KEY) || '{}');
    Object.entries(TEXT).forEach(([k, id]) => { if (d[id]) v[k] = d[id]; });
    if (d['f-role'] >= 0) v.role = d['f-role'];
    if (d['f-budget'] >= 0) v.budget = d['f-budget'];
  } catch {}
  return v;
};
const saveDraft = v => {
  const d = {};
  Object.entries(TEXT).forEach(([k, id]) => { d[id] = v[k]; });
  d['f-role'] = v.role;
  d['f-budget'] = v.budget;
  store.set(DRAFT_KEY, JSON.stringify(d));
};

export default function Book() {
  const { T } = useLang();
  const [v, setV] = useState(EMPTY);
  const [inv, setInv] = useState({});      // aria-invalid per field: true, false or unset
  const [showMsg, setShowMsg] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = useRef({});
  const thanksRef = useRef(null);
  const sectionRef = useRef(null);
  const [pre, setPre] = useState(false);

  // the background mark swings in the first time the section is reached
  useEffect(() => {
    const el = sectionRef.current;
    if (reduce || !('IntersectionObserver' in window) || el.getBoundingClientRect().top <= innerHeight) return;
    setPre(true);
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { setPre(false); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // restore the draft after the page has loaded; re-saving also drops any email/phone an older version stored
  useEffect(() => { const d = loadDraft(); setV(d); saveDraft(d); }, []);

  useEffect(() => { if (sent) thanksRef.current.focus({ preventScroll: true }); }, [sent]);

  const set = (k, val) => {
    const next = { ...v, [k]: val };
    setV(next);
    saveDraft(next);
    if (REQUIRED.includes(k) && inv[k] === true && String(val).trim()) setInv(i => ({ ...i, [k]: undefined }));
  };
  const field = k => ({ value: v[k], onChange: e => set(k, e.target.value), ref: el => { refs.current[k] = el; } });

  const submit = e => {
    e.preventDefault();
    if (v.web) return;
    const ok = { name: !!v.name.trim(), biz: !!v.biz.trim(), email: /^\S+@\S+\.\S+$/.test(v.email.trim()), privacy: v.privacy };
    setInv({ name: !ok.name, biz: !ok.biz, email: !ok.email, privacy: !ok.privacy });
    const bad = ['name', 'biz', 'email', 'privacy'].filter(k => !ok[k]);
    setShowMsg(bad.length > 0);
    if (bad.length) { refs.current[bad[0]].focus(); return; }
    // No backend yet: the request is not sent anywhere.
    store.remove(DRAFT_KEY);
    setSent(true);
  };

  const again = () => { setSent(false); setTimeout(() => refs.current.name.focus()); };
  const errText = k => (inv[k] === true ? T['e.' + k] : '');
  const ariaInv = k => (inv[k] === undefined ? undefined : String(inv[k]));

  return (
    <section className={'sec close' + (pre ? ' pre-o' : '')} id="book" aria-labelledby="book-h" ref={sectionRef}>
      <img className="mark" src={img('symbol-mark.webp')} alt="" aria-hidden="true" width="480" height="483" loading="lazy" decoding="async" />
      <div className="wrap close-in">
        <div><h2 id="book-h"><Tx className="ln" k="cta.h1" /><Tx className="ln" k="cta.h2" /></h2><Tx as="p" className="sub" k="cta.sub" />
          <div className="next">
            <Tx as="h3" k="cta.nextH" />
            <ol>{T.ctaNext.map((x, i) => <li key={i}><span>{i + 1}</span>{x}</li>)}</ol>
          </div>
          <p className="fee-line"><Tx k="cta.fee" /> <b>$2,499</b></p></div>
        <div id="formWrap">
          <form className="form" id="form" noValidate onSubmit={submit} hidden={sent}>
            <Tx as="h3" className="form-title" k="f.title" />
            <div className="ff"><Tx as="label" htmlFor="f-name" k="f.name" /><input id="f-name" name="name" autoComplete="name" placeholder={T['f.nameP']} aria-invalid={ariaInv('name')} {...field('name')} /><span className="err" id="e-name">{errText('name')}</span></div>
            <div className="ff"><Tx as="label" htmlFor="f-biz" k="f.biz" /><input id="f-biz" name="business" autoComplete="organization" placeholder={T['f.bizP']} aria-invalid={ariaInv('biz')} {...field('biz')} /><span className="err" id="e-biz">{errText('biz')}</span></div>
            <div className="ff"><Tx as="label" htmlFor="f-email" k="f.email" /><input id="f-email" name="email" type="email" autoComplete="email" placeholder={T['f.emailP']} aria-invalid={ariaInv('email')} {...field('email')} /><span className="err" id="e-email">{errText('email')}</span></div>
            <div className="ff"><Tx as="label" htmlFor="f-phone" k="f.phone" /><input id="f-phone" name="phone" type="tel" autoComplete="tel" placeholder={T['f.phoneP']} {...field('phone')} /></div>
            <div className="ff"><Tx as="label" htmlFor="f-role" k="f.role" />
              <select id="f-role" name="role" value={v.role} onChange={e => set('role', +e.target.value)}>{T.roles.map((o, i) => <option key={i} value={i}>{o}</option>)}</select></div>
            <div className="ff"><Tx as="label" htmlFor="f-budget" k="f.budget" />
              <select id="f-budget" name="budget" value={v.budget} onChange={e => set('budget', +e.target.value)}>{T.budgets.map((o, i) => <option key={i} value={i}>{o}</option>)}</select></div>
            <div className="ff full"><Tx as="label" htmlFor="f-req" k="f.req" /><textarea id="f-req" name="requirements" placeholder={T['f.reqP']} {...field('req')} /></div>
            <div className="hp" aria-hidden="true"><label htmlFor="f-web">Website</label><input id="f-web" name="website" tabIndex={-1} autoComplete="off" {...field('web')} /></div>
            <label className="consent"><input type="checkbox" id="f-privacy" name="privacy" checked={v.privacy} ref={el => { refs.current.privacy = el; }} onChange={e => setV({ ...v, privacy: e.target.checked })} /><Tx k="f.privacy" /></label>
            <label className="consent"><input type="checkbox" id="f-mkt" name="marketing" checked={v.mkt} onChange={e => setV({ ...v, mkt: e.target.checked })} /><Tx k="f.mkt" /></label>
            <Tx as="button" className="btn btn-green" type="submit" k="f.submit" />
            <p className="msg" id="msg" role="alert">{showMsg ? (inv.privacy ? T['e.privacy'] : T['e.check']) : ''}</p>
          </form>
          <div className="thanks" id="thanks" hidden={!sent} tabIndex={-1} ref={thanksRef}>
            <div className="ok-ic"><svg viewBox="0 0 24 24"><path d="M5 12.5 9.5 17 19 7.5" /></svg></div>
            <h3>{fmt(T['ty.h'], { name: v.name.trim().split(/\s+/)[0] || '' })}</h3>
            <Tx as="p" k="ty.p" />
            <Tx as="p" k="ty.next" />
            <Tx as="p" className="fine" k="ty.demo" />
            <Tx as="button" className="btn btn-line" type="button" id="again" k="ty.again" onClick={again} />
          </div>
        </div>
      </div>
    </section>
  );
}
