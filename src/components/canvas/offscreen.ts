import type { BoardPaint } from './BoardCanvas';
import type { Chip } from '../../lib/board';
import { drawChip, drawGrid, drawLinks } from './boardPaint';

/**
 * The wide offscreen render behind the visible canvas. `err` is the sub-pixel offset the image
 * is drawn at relative to the true geometry (kept below half a device pixel), which lets a pan
 * commit copy the previous image by a whole number of device pixels instead of repainting it.
 */
export interface Offscreen {
  canvas: HTMLCanvasElement;
  last: BoardPaint | null;
  err: number;
}

export function makeOffscreen(): Offscreen {
  return { canvas: document.createElement('canvas'), last: null, err: 0 };
}

export function dprFor(p: BoardPaint): number {
  return Math.min(window.devicePixelRatio || 1, p.geom.width < 640 ? 1.5 : 2);
}

/** Applies an x-map to chips, links and the grid; labeled chips keep their width. */
function withXMap(p: BoardPaint, m: (x: number) => number): BoardPaint {
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

function drawAll(ctx: CanvasRenderingContext2D, p: BoardPaint) {
  drawGrid(ctx, p);
  drawLinks(ctx, p);
  for (const c of p.chips) {
    const ev = p.eventsById.get(c.id);
    if (ev) drawChip(ctx, p, c, ev);
  }
}

const SAME: (keyof BoardPaint)[] = ['win', 'eventsById', 'links', 'pal', 'colorOf', 'emphasis', 'hoveredId', 'measure'];

/** Horizontal distance (css px) the previous image has to move to match `p`, or null if it cannot be reused. */
function panDelta(off: Offscreen, p: BoardPaint): number | null {
  const q = off.last;
  if (!q || p.xMap || q.xMap) return null;
  if (!SAME.every(k => q[k] === p[k])) return null;
  const g = p.geom;
  if (q.board.lanes !== p.board.lanes || q.geom.pxPerMs !== g.pxPerMs || q.geom.width !== g.width || q.geom.labelW !== g.labelW) return null;
  return g.xFor(q.viewStart) - q.geom.xFor(q.viewStart);
}

function setup(off: Offscreen, p: BoardPaint) {
  const w = p.geom.renderR - p.geom.renderL;
  const h = p.win.height;
  const dpr = dprFor(p);
  const pw = Math.ceil(w * dpr);
  const ph = Math.ceil(h * dpr);
  const resized = off.canvas.width !== pw || off.canvas.height !== ph;
  if (resized) { off.canvas.width = pw; off.canvas.height = ph; }
  return { w, h, dpr, pw, ph, resized };
}

/** Renders the wide (pre-render range) board; a pure pan copies the previous image and paints only the new strip. */
export function paintOffscreen(off: Offscreen, raw: BoardPaint) {
  const ctx = off.canvas.getContext('2d');
  if (!ctx) return;
  const s = setup(off, raw);
  const d = s.resized ? null : panDelta(off, raw);
  const di = d === null ? 0 : Math.round((d - off.err) * s.dpr);
  if (d === null || Math.abs(di) >= s.pw) { paintFull(ctx, off, raw, s); return; }
  if (di === 0) { off.last = raw; return; }
  off.err = off.err - d + di / s.dpr;
  const p = withXMap(raw, x => x + off.err);
  // Move the previous image by a whole number of device pixels; 'copy' clears whatever it does not cover
  // (and ignores any alpha/dash state the last chip left behind).
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'copy';
  ctx.drawImage(off.canvas, di, 0);
  ctx.restore();
  // Device-pixel strip that just came into the render range.
  const sx = di > 0 ? 0 : s.pw + di;
  const sw = Math.abs(di);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.rect(sx, 0, sw, s.ph); ctx.clip();
  ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
  ctx.translate(-p.geom.renderL, -p.win.top);
  const l = p.geom.renderL + sx / s.dpr - 2;
  const r = l + sw / s.dpr + 4;
  drawAll(ctx, { ...p, chips: p.chips.filter(c => c.x1 >= l && c.x0 <= r) });
  ctx.restore();
  off.last = raw;
}

function paintFull(ctx: CanvasRenderingContext2D, off: Offscreen, raw: BoardPaint, s: { w: number; h: number; dpr: number }) {
  off.err = 0;
  const p = raw.xMap ? withXMap(raw, raw.xMap) : raw;
  ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
  ctx.clearRect(0, 0, s.w, s.h);
  ctx.translate(-p.geom.renderL, -p.win.top);
  drawAll(ctx, p);
  // A zoom preview must not be reused as the base of a pan copy.
  off.last = raw.xMap ? null : raw;
}
