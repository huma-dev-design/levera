import { Tx, useLang } from '../LangContext.jsx';

const tools = [['Excel', 1], ['Google Sheets', 1], ['QuickBooks', 1], ['Xero', 1], ['Google Workspace', 1], ['Microsoft 365', 1], ['Gmail'], ['Outlook'], ['Slack'], ['Zoom'], ['HubSpot'], ['Canva']];

export default function Tools() {
  const { T } = useLang();
  return (
    <section className="tools" aria-label={T['tools.aria']}><div className="wrap tools-in">
      <Tx as="p" k="tools.p" />
      <div className="track-wrap"><div className="track" id="track">
        {[...tools, ...tools].map(([t, c], i) => <span key={i} className={c ? 'core' : ''}>{t}</span>)}
      </div></div>
    </div></section>
  );
}
