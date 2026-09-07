import { memo, useEffect, useRef } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { ms } from '../../lib/time';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  links: Link[];
  eventsById: Map<string, TimelineEvent>;
  dimmed: boolean;
}

export interface Seg {
  x1: number; y1: number; x2: number; y2: number; sameLane: boolean;
}

/** Screen-space endpoints of a link, or null when either end is hidden or the link is fully off the rendered range. */
export function linkSegment(lk: Link, byId: Map<string, TimelineEvent>, geom: CanvasGeom): Seg | null {
  const a = byId.get(lk.from);
  const b = byId.get(lk.to);
  if (!a || !b) return null;
  const y1 = geom.yFor(a.threadId);
  const y2 = geom.yFor(b.threadId);
  if (y1 < 0 || y2 < 0) return null;
  const x1 = geom.xFor(ms(a.date));
  const x2 = geom.xFor(ms(b.date));
  if (Math.max(x1, x2) < geom.renderL || Math.min(x1, x2) > geom.renderR) return null;
  return { x1, y1, x2, y2, sameLane: a.threadId === b.threadId };
}

function trace(ctx: CanvasRenderingContext2D, s: Seg) {
  ctx.moveTo(s.x1, s.y1);
  if (s.sameLane) {
    ctx.bezierCurveTo(s.x1, s.y1 - 38, s.x2, s.y2 - 38, s.x2, s.y2);
    return;
  }
  const cx1 = s.x1 + (s.x2 - s.x1) * 0.42;
  const cx2 = s.x2 - (s.x2 - s.x1) * 0.42;
  ctx.bezierCurveTo(cx1, s.y1, cx2, s.y2, s.x2, s.y2);
}

function drawArrow(ctx: CanvasRenderingContext2D, s: Seg) {
  // Approximate tangent at the end of the cubic (from the last control point).
  const cx2 = s.sameLane ? s.x2 : s.x2 - (s.x2 - s.x1) * 0.42;
  const cy2 = s.sameLane ? s.y2 - 38 : s.y2;
  const ang = Math.atan2(s.y2 - cy2, s.x2 - cx2);
  ctx.moveTo(s.x2, s.y2);
  ctx.lineTo(s.x2 - 6 * Math.cos(ang - 0.45), s.y2 - 6 * Math.sin(ang - 0.45));
  ctx.lineTo(s.x2 - 6 * Math.cos(ang + 0.45), s.y2 - 6 * Math.sin(ang + 0.45));
  ctx.closePath();
}

/**
 * All (non-highlighted) causal links drawn once onto a 2D canvas.
 * Hundreds of dashed SVG curves were the most expensive thing to rasterize; a canvas
 * costs a couple of milliseconds and is re-drawn only when the geometry changes.
 */
function LinkCanvas({ geom, pal, links, eventsById, dimmed }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = geom.renderR - geom.renderL;
  const h = geom.svgH;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(w * dpr);
    canvas.height = Math.ceil(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(-geom.renderL, 0);
    ctx.strokeStyle = pal.ink;
    ctx.fillStyle = pal.ink;
    ctx.lineWidth = 1;
    ctx.globalAlpha = dimmed ? 0.18 : 0.4;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    const segs: Seg[] = [];
    for (const lk of links) {
      const s = linkSegment(lk, eventsById, geom);
      if (s) { segs.push(s); trace(ctx, s); }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    for (const s of segs) drawArrow(ctx, s);
    ctx.fill();
  }, [geom, pal, links, eventsById, dimmed, w, h]);

  return (
    <canvas ref={ref} className="link-canvas"
      style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, pointerEvents: 'none' }} />
  );
}

export default memo(LinkCanvas);
