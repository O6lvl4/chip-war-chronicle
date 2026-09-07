import { memo, useEffect, useRef } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import type { Board } from '../../lib/board';

/** Vertical window of the board that is currently materialised (px, board coordinates). */
export interface VWindow {
  top: number;
  height: number;
}

interface Props {
  geom: CanvasGeom;
  board: Board;
  win: VWindow;
  pal: Palette;
  links: Link[];
  eventsById: Map<string, TimelineEvent>;
  dimmed: boolean;
}

/** True when a link cannot cross the vertical window at all. */
export function outsideWindow(s: Seg, win: VWindow): boolean {
  const bottom = win.top + win.height;
  return (s.y1 < win.top && s.y2 < win.top) || (s.y1 > bottom && s.y2 > bottom);
}

export interface Seg {
  x1: number; y1: number; x2: number; y2: number; sameLane: boolean;
}

/** Screen-space endpoints of a link, or null when an end is not on the board or the link is off the rendered range. */
export function linkSegment(lk: Link, byId: Map<string, TimelineEvent>, board: Board, geom: CanvasGeom): Seg | null {
  const a = board.chips.get(lk.from);
  const b = board.chips.get(lk.to);
  if (!a || !b) return null;
  if (Math.max(a.x, b.x) < geom.renderL || Math.min(a.x, b.x) > geom.renderR) return null;
  const sameLane = byId.get(lk.from)?.threadId === byId.get(lk.to)?.threadId;
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, sameLane };
}

function trace(ctx: CanvasRenderingContext2D, s: Seg) {
  ctx.moveTo(s.x1, s.y1);
  if (s.sameLane) {
    ctx.bezierCurveTo(s.x1, s.y1 - 30, s.x2, s.y2 - 30, s.x2, s.y2);
    return;
  }
  const cx1 = s.x1 + (s.x2 - s.x1) * 0.42;
  const cx2 = s.x2 - (s.x2 - s.x1) * 0.42;
  ctx.bezierCurveTo(cx1, s.y1, cx2, s.y2, s.x2, s.y2);
}

function drawArrow(ctx: CanvasRenderingContext2D, s: Seg) {
  const cx2 = s.sameLane ? s.x2 : s.x2 - (s.x2 - s.x1) * 0.42;
  const cy2 = s.sameLane ? s.y2 - 30 : s.y2;
  const ang = Math.atan2(s.y2 - cy2, s.x2 - cx2);
  ctx.moveTo(s.x2, s.y2);
  ctx.lineTo(s.x2 - 6 * Math.cos(ang - 0.45), s.y2 - 6 * Math.sin(ang - 0.45));
  ctx.lineTo(s.x2 - 6 * Math.cos(ang + 0.45), s.y2 - 6 * Math.sin(ang + 0.45));
  ctx.closePath();
}

/**
 * All (non-highlighted) causal links drawn once onto a 2D canvas: hundreds of dashed SVG
 * curves were the most expensive thing to rasterize; a canvas is re-drawn only when the
 * geometry or the board changes.
 */
function LinkCanvas({ geom, board, win, pal, links, eventsById, dimmed }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = geom.renderR - geom.renderL;
  const h = win.height;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, geom.width < 640 ? 1.5 : 2);
    canvas.width = Math.ceil(w * dpr);
    canvas.height = Math.ceil(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(-geom.renderL, -win.top);
    ctx.strokeStyle = pal.ink;
    ctx.fillStyle = pal.ink;
    ctx.lineWidth = 1;
    ctx.globalAlpha = dimmed ? 0.15 : 0.35;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    const segs: Seg[] = [];
    for (const lk of links) {
      const s = linkSegment(lk, eventsById, board, geom);
      if (s && !outsideWindow(s, win)) { segs.push(s); trace(ctx, s); }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    for (const s of segs) drawArrow(ctx, s);
    ctx.fill();
  }, [geom, board, win, pal, links, eventsById, dimmed, w, h]);

  return (
    <canvas ref={ref} className="link-canvas"
      style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, pointerEvents: 'none' }} />
  );
}

export default memo(LinkCanvas);
