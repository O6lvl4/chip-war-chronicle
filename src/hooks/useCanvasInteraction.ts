import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { DAY } from '../lib/time';

interface Params {
  svgRef: RefObject<SVGSVGElement | null>;
  viewStart: number;
  viewEnd: number;
  labelW: number;
  onViewChange: (s: number, e: number) => void;
}

interface Gesture {
  start: number;   // view at gesture start
  end: number;
  sx: number;      // single pointer: x at start; pinch: midpoint at start
  dist: number;    // pinch: distance at start (0 for pan)
}

const ZOOM_STEP = 1.18;
const MIN_SPAN = 14 * DAY;
const DRAG_PX = 4;

function zoomAround(t: number, start: number, end: number, factor: number): [number, number] {
  const ns = t - (t - start) * factor;
  const ne = t + (end - t) * factor;
  if (ne - ns < MIN_SPAN) return [t - MIN_SPAN / 2, t + MIN_SPAN / 2];
  return [ns, ne];
}

/** New [start, end] for a two-finger pinch, keeping the time under the midpoint fixed. */
function pinch(g: Gesture, plot: { labelW: number; width: number }, mid: number, dist: number): [number, number] {
  const plotW = plot.width - plot.labelW;
  const px0 = plotW / (g.end - g.start);
  const tMid = g.start + (g.sx - plot.labelW) / px0;
  const px1 = px0 * (dist / Math.max(g.dist, 1));
  const span = Math.max(plotW / px1, MIN_SPAN);
  const start = tMid - (mid - plot.labelW) / (plotW / span);
  return [start, start + span];
}

/** Mouse + touch interaction for the timeline SVG: wheel zoom, drag/one-finger pan, pinch zoom. */
export function useCanvasInteraction({ svgRef, viewStart, viewEnd, labelW, onViewChange }: Params) {
  const [isDragging, setIsDragging] = useState(false);
  const pointers = useRef(new Map<number, number>());
  const gesture = useRef<Gesture | null>(null);
  const moved = useRef(false);

  const plot = () => ({ labelW, width: svgRef.current?.getBoundingClientRect().width ?? 1000 });
  const localX = (e: { clientX: number }) => e.clientX - (svgRef.current?.getBoundingClientRect().left ?? 0);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const mx = e.clientX - el.getBoundingClientRect().left;
      if (mx < labelW) return;
      const factor = e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      const pxPerMs = (el.getBoundingClientRect().width - labelW) / (viewEnd - viewStart);
      onViewChange(...zoomAround(viewStart + (mx - labelW) / pxPerMs, viewStart, viewEnd, factor));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [svgRef, viewStart, viewEnd, labelW, onViewChange]);

  const beginGesture = () => {
    const xs = [...pointers.current.values()];
    if (xs.length >= 2) gesture.current = { start: viewStart, end: viewEnd, sx: (xs[0] + xs[1]) / 2 - (svgRef.current?.getBoundingClientRect().left ?? 0), dist: Math.abs(xs[0] - xs[1]) };
    else if (xs.length === 1) gesture.current = { start: viewStart, end: viewEnd, sx: xs[0], dist: 0 };
    else gesture.current = null;
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('.evt-hit')) return;
    pointers.current.set(e.pointerId, e.clientX);
    svgRef.current?.setPointerCapture(e.pointerId);
    moved.current = false;
    beginGesture();
    setIsDragging(true);
  };

  const onDragMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e.clientX);
    const xs = [...pointers.current.values()];
    if (xs.length >= 2) {
      moved.current = true;
      onViewChange(...pinch(g, plot(), (xs[0] + xs[1]) / 2 - (svgRef.current?.getBoundingClientRect().left ?? 0), Math.abs(xs[0] - xs[1])));
      return;
    }
    const dx = e.clientX - g.sx;
    if (Math.abs(dx) > DRAG_PX) moved.current = true;
    const pxPerMs = (plot().width - labelW) / (g.end - g.start);
    onViewChange(g.start - dx / pxPerMs, g.end - dx / pxPerMs);
  };

  const endDrag = (e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) { gesture.current = null; setIsDragging(false); }
    else beginGesture();
  };

  const onDoubleClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    const mx = localX(e);
    if (mx < labelW) return;
    const pxPerMs = (plot().width - labelW) / (viewEnd - viewStart);
    const t = viewStart + (mx - labelW) / pxPerMs;
    const span = (viewEnd - viewStart) / 3;
    onViewChange(t - span, t + span);
  };

  /** True when the pointer travelled far enough that the following click should not select. */
  const wasDrag = () => moved.current;

  return { isDragging, localX, wasDrag, onPointerDown, onDragMove, endDrag, onDoubleClick };
}
