import { memo, useEffect } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import type { Board, Chip } from '../../lib/board';
import { eventRadius, ROW_H } from '../../lib/board';
import { eventOpacity, type Emphasis } from '../../lib/layout';
import { generateTicks } from '../../lib/time';

/** Vertical window of the board that is currently materialised (px, board coordinates). */
export interface VWindow {
  top: number;
  height: number;
}

export interface BoardPaint {
  geom: CanvasGeom;
  board: Board;
  win: VWindow;
  chips: Chip[];
  eventsById: Map<string, TimelineEvent>;
  links: Link[];
  pal: Palette;
  colorOf: (threadId: string) => string;
  emphasis: Emphasis;
  hoveredId: string | null;
  fontFamily: string;
  measure: (s: string) => number;
  viewStart: number;
  viewEnd: number;
  /** In-flight zoom preview: remaps every x without touching rows or glyphs. */
  xMap?: (x: number) => number;
}

/** Applies the preview x-map to chips, links and the grid; labeled chips keep their width. */
function withXMap(p: BoardPaint): BoardPaint {
  const m = p.xMap;
  if (!m) return p;
  const mapChip = (c: Chip): Chip => {
    const x0 = m(c.x0);
    const barEnd = m(c.barEnd);
    const x1 = c.labeled ? Math.max(x0 + (c.x1 - c.x0), barEnd) : m(c.x1);
    return { ...c, x: m(c.x), x0, x1, barEnd };
  };
  const chips = new Map<string, Chip>();
  for (const [id, c] of p.board.chips) chips.set(id, mapChip(c));
  return {
    ...p,
    xMap: undefined,
    chips: p.chips.map(mapChip),
    board: { ...p.board, chips },
    geom: { ...p.geom, xFor: t => m(p.geom.xFor(t)) },
  };
}

type Ctx = CanvasRenderingContext2D;
const H = ROW_H - 6;

interface Seg { x1: number; y1: number; x2: number; y2: number; sameLane: boolean }
interface Rect { x: number; y: number; w: number; h: number }

function segment(lk: Link, p: BoardPaint): Seg | null {
  const a = p.board.chips.get(lk.from);
  const b = p.board.chips.get(lk.to);
  if (!a || !b) return null;
  const { renderL, renderR } = p.geom;
  if (Math.max(a.x, b.x) < renderL || Math.min(a.x, b.x) > renderR) return null;
  const bottom = p.win.top + p.win.height;
  if ((a.y < p.win.top && b.y < p.win.top) || (a.y > bottom && b.y > bottom)) return null;
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, sameLane: p.eventsById.get(lk.from)?.threadId === p.eventsById.get(lk.to)?.threadId };
}

function traceLink(ctx: Ctx, s: Seg) {
  ctx.moveTo(s.x1, s.y1);
  if (s.sameLane) { ctx.bezierCurveTo(s.x1, s.y1 - 30, s.x2, s.y2 - 30, s.x2, s.y2); return; }
  const cx1 = s.x1 + (s.x2 - s.x1) * 0.42;
  const cx2 = s.x2 - (s.x2 - s.x1) * 0.42;
  ctx.bezierCurveTo(cx1, s.y1, cx2, s.y2, s.x2, s.y2);
}

function traceArrow(ctx: Ctx, s: Seg) {
  const cx2 = s.sameLane ? s.x2 : s.x2 - (s.x2 - s.x1) * 0.42;
  const cy2 = s.sameLane ? s.y2 - 30 : s.y2;
  const ang = Math.atan2(s.y2 - cy2, s.x2 - cx2);
  ctx.moveTo(s.x2, s.y2);
  ctx.lineTo(s.x2 - 6 * Math.cos(ang - 0.45), s.y2 - 6 * Math.sin(ang - 0.45));
  ctx.lineTo(s.x2 - 6 * Math.cos(ang + 0.45), s.y2 - 6 * Math.sin(ang + 0.45));
  ctx.closePath();
}

function strokeSet(ctx: Ctx, segs: Seg[], style: { color: string; width: number; alpha: number; dash: number[] }) {
  ctx.lineWidth = style.width;
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.color;
  ctx.globalAlpha = style.alpha;
  ctx.setLineDash(style.dash);
  ctx.beginPath(); for (const s of segs) traceLink(ctx, s); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); for (const s of segs) traceArrow(ctx, s); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawGrid(ctx: Ctx, p: BoardPaint) {
  const span = p.viewEnd - p.viewStart;
  const { ticks } = generateTicks(p.viewStart - span, p.viewEnd + span);
  const top = p.win.top;
  const bottom = top + p.win.height;
  ctx.strokeStyle = p.pal.ink;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (const t of ticks) { const x = p.geom.xFor(t); ctx.moveTo(x, top); ctx.lineTo(x, bottom); }
  ctx.stroke();
  ctx.globalAlpha = 1;
  const todayX = p.geom.xFor(Date.now());
  if (todayX < p.geom.renderL || todayX > p.geom.renderR) return;
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = p.pal.accent;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 3.5]);
  ctx.beginPath(); ctx.moveTo(todayX, top); ctx.lineTo(todayX, bottom); ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawLinks(ctx: Ctx, p: BoardPaint) {
  const focus = p.emphasis.focusId ?? p.hoveredId;
  const dim: Seg[] = [];
  const hot: Seg[] = [];
  for (const lk of p.links) {
    const s = segment(lk, p);
    if (!s) continue;
    const isHot = focus !== null && (lk.from === focus || lk.to === focus);
    (isHot ? hot : dim).push(s);
  }
  strokeSet(ctx, dim, { color: p.pal.ink, width: 1, alpha: p.emphasis.focusId ? 0.12 : 0.35, dash: [3, 2] });
  strokeSet(ctx, hot, { color: p.pal.accent, width: 2, alpha: 1, dash: [] });
}

function roundRect(ctx: Ctx, { x, y, w, h }: Rect, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

interface ChipStyle {
  col: string;
  r: number;
  focused: boolean;
  isBar: boolean;
  h: number;        // marker height (chip height for labeled chips, 2r for dots)
}

function chipStyle(p: BoardPaint, c: Chip, ev: TimelineEvent): ChipStyle {
  const r = eventRadius(ev.weight);
  const h = c.labeled ? H : 2 * r;
  return {
    col: p.colorOf(ev.threadId),
    r,
    focused: ev.id === p.emphasis.focusId || ev.id === p.hoveredId,
    isBar: !!ev.endDate && c.barEnd - c.x0 > h + 2,
    h,
  };
}

function drawMarker(ctx: Ctx, c: Chip, ev: TimelineEvent, st: ChipStyle) {
  ctx.fillStyle = st.col;
  if (st.isBar) {
    roundRect(ctx, { x: c.x0, y: c.y - st.h / 2, w: c.barEnd - c.x0, h: st.h }, st.h / 2);
    ctx.fill();
    if (!c.labeled) ctx.stroke();
    return;
  }
  let cx = c.x;
  if (c.labeled) cx = c.x0 + st.r + 3;
  else if (ev.endDate) cx = c.x0 + st.r;
  ctx.beginPath();
  ctx.arc(cx, c.y, c.labeled ? st.r - 0.5 : st.r, 0, Math.PI * 2);
  ctx.fill();
  if (!c.labeled) ctx.stroke();
}

function drawTitle(ctx: Ctx, p: BoardPaint, c: Chip, st: ChipStyle & { ev: TimelineEvent }) {
  const ev = st.ev;
  const inside = st.isBar && c.barEnd - c.x0 >= p.measure(ev.title) + 2 * st.r + 14;
  let tx = c.x0 + 2 * st.r + 8;
  if (st.isBar && !inside) tx = c.barEnd + 6;
  ctx.font = `${ev.weight === 3 ? 700 : 500} 11px ${p.fontFamily}`;
  ctx.fillStyle = inside ? '#fff' : p.pal.text;
  ctx.textBaseline = 'middle';
  ctx.fillText(ev.title, tx, c.y + 0.5);
}

function drawChip(ctx: Ctx, p: BoardPaint, c: Chip, ev: TimelineEvent) {
  const st = chipStyle(p, c, ev);
  ctx.globalAlpha = eventOpacity(ev, p.emphasis);
  ctx.lineWidth = st.focused ? 2.5 : 1.25;
  let stroke = p.pal.outline;
  if (st.focused) stroke = p.pal.accent;
  else if (c.labeled) stroke = st.col;
  ctx.strokeStyle = stroke;
  if (c.labeled) {
    roundRect(ctx, { x: c.x0, y: c.y - H / 2, w: c.x1 - c.x0, h: H }, H / 2);
    ctx.fillStyle = p.pal.surface;
    ctx.fill();
    ctx.stroke();
  }
  drawMarker(ctx, c, ev, st);
  if (c.labeled) drawTitle(ctx, p, c, { ...st, ev });
  ctx.globalAlpha = 1;
}

export function paintBoard(canvas: HTMLCanvasElement, raw: BoardPaint) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const p = withXMap(raw);
  const w = p.geom.renderR - p.geom.renderL;
  const h = p.win.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pw = Math.ceil(w * dpr);
  const ph = Math.ceil(h * dpr);
  if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.translate(-p.geom.renderL, -p.win.top);
  drawGrid(ctx, p);
  drawLinks(ctx, p);
  for (const c of p.chips) {
    const ev = p.eventsById.get(c.id);
    if (ev) drawChip(ctx, p, c, ev);
  }
}

/** Topmost chip under a board-space point, or null. */
export function hitChip(chips: Chip[], eventsById: Map<string, TimelineEvent>, x: number, y: number): Chip | null {
  for (let i = chips.length - 1; i >= 0; i--) {
    const c = chips[i];
    if (Math.abs(y - c.y) > H / 2 + 2) continue;
    const pad = c.labeled ? 2 : eventRadius(eventsById.get(c.id)?.weight ?? 1) + 3;
    if (x >= c.x0 - pad && x <= c.x1 + pad) return c;
  }
  return null;
}

interface Props {
  paint: BoardPaint;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

/** One canvas for grid, links and chips of the materialised window; re-painted only when its inputs change. */
function BoardCanvas({ paint, canvasRef }: Props) {
  const w = paint.geom.renderR - paint.geom.renderL;
  useEffect(() => {
    if (canvasRef.current) paintBoard(canvasRef.current, paint);
    // Re-paint once web fonts arrive so titles use the intended face.
    let alive = true;
    document.fonts?.ready.then(() => { if (alive && canvasRef.current) paintBoard(canvasRef.current, paint); });
    return () => { alive = false; };
  }, [paint, canvasRef]);
  return <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0, width: w, height: paint.win.height }} />;
}

export default memo(BoardCanvas);
