/** Shareable view state in the URL hash: level, centre instant, selection, lanes, theme. */
export interface UrlState {
  level?: number;
  center?: number;
  sel?: string;
  lanes?: string[];
  dark?: boolean;
}

export function readUrl(): UrlState {
  const p = new URLSearchParams(location.hash.replace(/^#/, ''));
  const out: UrlState = {};
  const l = p.get('l');
  if (l !== null && /^\d+$/.test(l)) out.level = Number(l);
  const t = p.get('t');
  if (t) { const ms = Date.parse(t); if (!Number.isNaN(ms)) out.center = ms; }
  const sel = p.get('sel');
  if (sel) out.sel = sel;
  const lanes = p.get('lanes');
  if (lanes) out.lanes = lanes.split(',').filter(Boolean);
  const theme = p.get('theme');
  if (theme === 'dark' || theme === 'light') out.dark = theme === 'dark';
  return out;
}

export function writeUrl(s: UrlState) {
  const p = new URLSearchParams();
  if (s.level !== undefined) p.set('l', String(s.level));
  if (s.center !== undefined) p.set('t', new Date(s.center).toISOString().slice(0, 10));
  if (s.sel) p.set('sel', s.sel);
  if (s.lanes) p.set('lanes', s.lanes.join(','));
  if (s.dark !== undefined) p.set('theme', s.dark ? 'dark' : 'light');
  const hash = `#${p.toString()}`;
  if (hash !== location.hash) history.replaceState(null, '', hash);
}
