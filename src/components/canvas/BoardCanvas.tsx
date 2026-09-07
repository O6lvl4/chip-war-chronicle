import { memo, useLayoutEffect, useRef } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import type { Board, Chip } from '../../lib/board';
import { eventRadius } from '../../lib/board';
import type { Emphasis } from '../../lib/layout';
import { H } from './boardPaint';
import { dprFor, makeOffscreen, paintOffscreen, type Offscreen } from './offscreen';
import { timed } from '../../lib/perf';

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
export function blitBoard(visible: HTMLCanvasElement, off: Offscreen, p: BoardPaint, dx: number) {
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
  ctx.drawImage(off.canvas, Math.round((dx - p.geom.slack) * dpr), 0);
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
  /** Live pan shift (px) the visible canvas should show. */
  getShift: () => number;
}

/**
 * A viewport-sized visible canvas fed from a wider offscreen render. Pans are a single
 * drawImage per frame and zoom previews re-render the offscreen image; neither touches the DOM,
 * so no large composited layers exist on phones.
 */
function BoardCanvas({ paint, apiRef, getShift }: Props) {
  const visibleRef = useRef<HTMLCanvasElement>(null);
  const offRef = useRef<Offscreen | null>(null);
  const lastRef = useRef(paint);
  const w = paint.geom.width - paint.geom.labelW;

  useLayoutEffect(() => {
    offRef.current ??= makeOffscreen();
    const off = offRef.current;
    const shift = (dx: number) => { const v = visibleRef.current; if (v) timed('blit', () => blitBoard(v, off, lastRef.current, dx)); };
    const api: BoardApi = {
      repaint: p => { lastRef.current = p; timed('paint', () => paintOffscreen(off, p)); shift(getShift()); },
      shift,
    };
    apiRef.current = api;
    api.repaint(paint);
    // Re-paint once web fonts arrive so titles use the intended face.
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) api.repaint(paint); });
    return () => { alive = false; };
  }, [paint, apiRef, getShift]);

  return <canvas ref={visibleRef} style={{ position: 'absolute', left: 0, top: 0, width: w, height: paint.win.height }} />;
}

export default memo(BoardCanvas);
