import { memo, useEffect, useRef } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import type { Board, Chip } from '../../lib/board';
import { eventRadius } from '../../lib/board';
import type { Emphasis } from '../../lib/layout';
import { drawChip, drawGrid, drawLinks, H } from './boardPaint';

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

function dprFor(p: BoardPaint): number {
  return Math.min(window.devicePixelRatio || 1, p.geom.width < 640 ? 1.5 : 2);
}

/** Renders the wide (pre-render range) board into the offscreen canvas. */
export function paintBoard(canvas: HTMLCanvasElement, raw: BoardPaint) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const p = withXMap(raw);
  const w = p.geom.renderR - p.geom.renderL;
  const h = p.win.height;
  const dpr = dprFor(p);
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

/** Copies the offscreen render onto the visible, viewport-sized canvas, shifted by `dx` px. */
export function blitBoard(visible: HTMLCanvasElement, off: HTMLCanvasElement, p: BoardPaint, dx: number) {
  const ctx = visible.getContext('2d');
  if (!ctx) return;
  const dpr = dprFor(p);
  const w = p.geom.width - p.geom.labelW;
  const h = p.win.height;
  const pw = Math.ceil(w * dpr);
  const ph = Math.ceil(h * dpr);
  if (visible.width !== pw || visible.height !== ph) { visible.width = pw; visible.height = ph; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, pw, ph);
  // The offscreen image starts `slack` px left of the plot.
  ctx.drawImage(off, Math.round((dx - p.geom.slack) * dpr), 0);
}

/** Imperative handle so gestures can redraw without going through React. */
export interface BoardApi {
  /** Re-render the offscreen image (optionally with an x-map) and show it unshifted. */
  repaint: (p: BoardPaint) => void;
  /** Show the current offscreen image shifted by dx px (pan preview). */
  shift: (dx: number) => void;
}

interface Props {
  paint: BoardPaint;
  apiRef: React.RefObject<BoardApi | null>;
}

/**
 * A viewport-sized visible canvas fed from a wider offscreen render. Pans are a single
 * drawImage per frame and zoom previews re-render the offscreen image; neither touches the DOM,
 * so no large composited layers exist on phones.
 */
function BoardCanvas({ paint, apiRef }: Props) {
  const visibleRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const lastRef = useRef(paint);
  const w = paint.geom.width - paint.geom.labelW;

  useEffect(() => {
    offRef.current ??= document.createElement('canvas');
    const off = offRef.current;
    const api: BoardApi = {
      repaint: p => { lastRef.current = p; paintBoard(off, p); if (visibleRef.current) blitBoard(visibleRef.current, off, p, 0); },
      shift: dx => { if (visibleRef.current) blitBoard(visibleRef.current, off, lastRef.current, dx); },
    };
    apiRef.current = api;
    api.repaint(paint);
    // Re-paint once web fonts arrive so titles use the intended face.
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) api.repaint(paint); });
    return () => { alive = false; };
  }, [paint, apiRef]);

  return <canvas ref={visibleRef} style={{ position: 'absolute', left: 0, top: 0, width: w, height: paint.win.height }} />;
}

export default memo(BoardCanvas);
