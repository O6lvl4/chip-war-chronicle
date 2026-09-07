import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { DAY } from '../lib/time';

interface Params {
  /** Element whose left edge is screen x = 0 for the canvas, and which receives the wheel listener. */
  hostRef: RefObject<HTMLElement | null>;
  viewStart: number;
  viewEnd: number;
  labelW: number;
  onViewChange: (s: number, e: number) => void;
  /** Pixel offset while panning; the canvas moves its composited layer with a CSS transform. */
  onPanPreview: (dx: number) => void;
}

interface Gesture {
  start: number;
  end: number;
  sx: number;      // one pointer: x at start; pinch: midpoint at start
  dist: number;    // pinch: distance at start (0 = pan)
}

const ZOOM_STEP = 1.18;
const MIN_SPAN = 14 * DAY;
const DRAG_PX = 4;
const WHEEL_SETTLE_MS = 120;

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

/** Coalesces rapid view updates (pinch, ⌘+wheel) into one per animation frame. */
function useFrameCoalescer(onViewChange: (s: number, e: number) => void) {
  const pending = useRef<[number, number] | null>(null);
  return useCallback((s: number, e: number) => {
    const first = pending.current === null;
    pending.current = [s, e];
    if (!first) return;
    requestAnimationFrame(() => {
      const v = pending.current;
      pending.current = null;
      if (v) onViewChange(v[0], v[1]);
    });
  }, [onViewChange]);
}

/**
 * Mouse + touch interaction for the timeline.
 * Scroll/drag pans at the current scale (previewed with a transform, committed once at the end);
 * only pinch, ⌘/Ctrl+wheel and double-click change the scale.
 */
export function useCanvasInteraction({ hostRef, viewStart, viewEnd, labelW, onViewChange, onPanPreview }: Params) {
  const [isDragging, setIsDragging] = useState(false);
  const pointers = useRef(new Map<number, number>());
  const gesture = useRef<Gesture | null>(null);
  const moved = useRef(false);
  const wheelPan = useRef({ dx: 0, timer: 0 });
  const view = useRef({ start: viewStart, end: viewEnd });
  view.current = { start: viewStart, end: viewEnd };
  const setViewSoon = useFrameCoalescer(onViewChange);

  const rect = () => hostRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 1000, 500);
  const plot = () => ({ labelW, width: rect().width });
  const pxPerMs = () => (rect().width - labelW) / (view.current.end - view.current.start);
  const localX = (e: { clientX: number }) => e.clientX - rect().left;

  const commitPan = useCallback((dx: number) => {
    const dt = dx / pxPerMs();
    const { start, end } = view.current;
    onViewChange(start - dt, end - dt);
    // The canvas clears the preview when the new view renders; this is a safety net if nothing re-rendered.
    requestAnimationFrame(() => requestAnimationFrame(() => onPanPreview(0)));
  }, [onViewChange, onPanPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const mx = e.clientX - el.getBoundingClientRect().left;
        if (mx < labelW) return;
        const { start, end } = view.current;
        setViewSoon(...zoomAround(start + (mx - labelW) / pxPerMs(), start, end, e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP));
        return;
      }
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelPan.current.dx -= delta;
      onPanPreview(wheelPan.current.dx);
      window.clearTimeout(wheelPan.current.timer);
      wheelPan.current.timer = window.setTimeout(() => {
        const dx = wheelPan.current.dx;
        wheelPan.current.dx = 0;
        commitPan(dx);
      }, WHEEL_SETTLE_MS);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [hostRef, labelW, setViewSoon, onPanPreview, commitPan]); // eslint-disable-line react-hooks/exhaustive-deps

  const beginGesture = () => {
    const xs = [...pointers.current.values()];
    const { start, end } = view.current;
    if (xs.length >= 2) gesture.current = { start, end, sx: (xs[0] + xs[1]) / 2 - rect().left, dist: Math.abs(xs[0] - xs[1]) };
    else if (xs.length === 1) gesture.current = { start, end, sx: xs[0], dist: 0 };
    else gesture.current = null;
  };

  const onPointerDown = (e: ReactPointerEvent<Element>) => {
    if ((e.target as Element).closest('.evt-hit')) return;
    pointers.current.set(e.pointerId, e.clientX);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    moved.current = false;
    beginGesture();
    setIsDragging(true);
  };

  const onDragMove = (e: ReactPointerEvent<Element>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e.clientX);
    const xs = [...pointers.current.values()];
    if (xs.length >= 2) {
      moved.current = true;
      setViewSoon(...pinch(g, plot(), (xs[0] + xs[1]) / 2 - rect().left, Math.abs(xs[0] - xs[1])));
      return;
    }
    const dx = e.clientX - g.sx;
    if (Math.abs(dx) > DRAG_PX) moved.current = true;
    onPanPreview(dx);
  };

  const endDrag = (e: ReactPointerEvent<Element>) => {
    const g = gesture.current;
    const x = pointers.current.get(e.pointerId);
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (g && g.dist === 0 && x !== undefined && moved.current) commitPan(x - g.sx);
      else onPanPreview(0);
      gesture.current = null;
      setIsDragging(false);
      return;
    }
    beginGesture();
  };

  const onDoubleClick = (e: ReactMouseEvent<Element>) => {
    const mx = localX(e);
    if (mx < labelW) return;
    const { start, end } = view.current;
    const t = start + (mx - labelW) / pxPerMs();
    const span = (end - start) / 3;
    onViewChange(t - span, t + span);
  };

  const wasDrag = () => moved.current;

  return { isDragging, localX, wasDrag, onPointerDown, onDragMove, endDrag, onDoubleClick };
}
