import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { DAY } from '../lib/time';

/** What the composited layers should show while a gesture is in flight. */
export interface Preview {
  dx: number;       // horizontal translation in px
  scale: number;    // horizontal stretch (1 = none)
  originX: number;  // screen x the stretch is anchored to
}

interface Params {
  /** Element whose left edge is screen x = 0 for the canvas, and which receives the wheel listener. */
  hostRef: RefObject<HTMLElement | null>;
  viewStart: number;
  viewEnd: number;
  labelW: number;
  onViewChange: (s: number, e: number) => void;
  onPreview: (p: Preview | null) => void;
}

interface Gesture {
  start: number;
  end: number;
  sx: number;      // one pointer: x at start; pinch: midpoint (screen x) at start
  dist: number;    // pinch: distance at start (0 = pan)
  last: Preview;   // most recent preview, used to commit
}

const ZOOM_STEP = 1.18;
const MIN_SPAN = 14 * DAY;
const DRAG_PX = 4;
const SETTLE_MS = 120;
const NO_PREVIEW: Preview = { dx: 0, scale: 1, originX: 0 };

/** New [start, end] after stretching the plot by `scale` around screen x `originX` and shifting it by `dx`. */
function applyPreview(view: { start: number; end: number }, plot: { labelW: number; width: number }, p: Preview): [number, number] {
  const plotW = plot.width - plot.labelW;
  const px0 = plotW / (view.end - view.start);
  const tOrigin = view.start + (p.originX - plot.labelW) / px0;
  const px1 = px0 * p.scale;
  const span = Math.max(plotW / px1, MIN_SPAN);
  const pxPerMs = plotW / span;
  const start = tOrigin - (p.originX + p.dx - plot.labelW) / pxPerMs;
  return [start, start + span];
}

type WheelKind = 'scroll' | 'zoom' | 'pan';

/** Plain vertical wheel scrolls the board natively; sideways / shift pans; ⌘ or Ctrl zooms. */
function classifyWheel(e: WheelEvent): WheelKind {
  if (e.ctrlKey || e.metaKey) return 'zoom';
  if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return 'pan';
  return 'scroll';
}

/**
 * Mouse + touch interaction for the timeline. Every gesture (drag, wheel pan, pinch, ⌘+wheel)
 * only moves or stretches the composited layers while in flight and commits the view once
 * when it ends, so nothing is re-laid-out mid-gesture.
 */
export function useCanvasInteraction({ hostRef, viewStart, viewEnd, labelW, onViewChange, onPreview }: Params) {
  const [isDragging, setIsDragging] = useState(false);
  const pointers = useRef(new Map<number, number>());
  const gesture = useRef<Gesture | null>(null);
  const moved = useRef(false);
  const wheel = useRef<{ p: Preview; timer: number }>({ p: NO_PREVIEW, timer: 0 });
  const view = useRef({ start: viewStart, end: viewEnd });
  view.current = { start: viewStart, end: viewEnd };

  const rect = () => hostRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 1000, 500);
  const plot = () => ({ labelW, width: rect().width });
  const localX = (e: { clientX: number }) => e.clientX - rect().left;

  const commit = useCallback((p: Preview) => {
    onViewChange(...applyPreview(view.current, plot(), p));
    // The canvas clears the preview when the new view renders; this is a safety net if nothing re-rendered.
    requestAnimationFrame(() => requestAnimationFrame(() => onPreview(null)));
  }, [onViewChange, onPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wheel: accumulate into one preview and commit after the wheel goes quiet.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const kind = classifyWheel(e);
      if (kind === 'scroll') return;
      e.preventDefault();
      const w = wheel.current;
      if (w.p === NO_PREVIEW) w.p = { dx: 0, scale: 1, originX: e.clientX - el.getBoundingClientRect().left };
      if (kind === 'zoom') w.p = { ...w.p, scale: w.p.scale * (e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP) };
      else w.p = { ...w.p, dx: w.p.dx - (e.deltaX === 0 ? e.deltaY : e.deltaX) };
      onPreview(w.p);
      window.clearTimeout(w.timer);
      w.timer = window.setTimeout(() => { const p = w.p; w.p = NO_PREVIEW; commit(p); }, SETTLE_MS);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [hostRef, onPreview, commit]);

  // Mobile Safari ignores touch-action for pinch: block browser zoom while two fingers are on the stage
  // (and its proprietary gesture events), so the pinch reaches our pointer handlers instead.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const blockMultiTouch = (e: TouchEvent) => { if (e.touches.length > 1) e.preventDefault(); };
    const blockGesture = (e: Event) => e.preventDefault();
    el.addEventListener('touchstart', blockMultiTouch, { passive: false });
    el.addEventListener('touchmove', blockMultiTouch, { passive: false });
    el.addEventListener('gesturestart', blockGesture);
    el.addEventListener('gesturechange', blockGesture);
    return () => {
      el.removeEventListener('touchstart', blockMultiTouch);
      el.removeEventListener('touchmove', blockMultiTouch);
      el.removeEventListener('gesturestart', blockGesture);
      el.removeEventListener('gesturechange', blockGesture);
    };
  }, [hostRef]);

  const beginGesture = () => {
    const xs = [...pointers.current.values()];
    const { start, end } = view.current;
    const base = { start, end, last: NO_PREVIEW };
    if (xs.length >= 2) gesture.current = { ...base, sx: (xs[0] + xs[1]) / 2 - rect().left, dist: Math.abs(xs[0] - xs[1]) };
    else if (xs.length === 1) gesture.current = { ...base, sx: xs[0], dist: 0 };
    else gesture.current = null;
  };

  const onPointerDown = (e: ReactPointerEvent<Element>) => {
    if ((e.target as Element).closest('.evt-hit')) return;
    pointers.current.set(e.pointerId, e.clientX);
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
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
      const mid = (xs[0] + xs[1]) / 2 - rect().left;
      g.last = { dx: mid - g.sx, scale: Math.abs(xs[0] - xs[1]) / Math.max(g.dist, 1), originX: g.sx };
    } else {
      const dx = e.clientX - g.sx;
      if (Math.abs(dx) > DRAG_PX) moved.current = true;
      g.last = { dx, scale: 1, originX: 0 };
    }
    onPreview(g.last);
  };

  const endDrag = (e: ReactPointerEvent<Element>) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) {
      // A finger lifted mid-pinch: commit what we have and restart from the remaining finger.
      if (g) commit(g.last);
      beginGesture();
      return;
    }
    if (g && moved.current) commit(g.last);
    else onPreview(null);
    gesture.current = null;
    setIsDragging(false);
  };

  const onDoubleClick = (e: ReactMouseEvent<Element>) => {
    const mx = localX(e);
    if (mx < labelW) return;
    commit({ dx: 0, scale: 1.5, originX: mx });
  };

  const wasDrag = () => moved.current;

  return { isDragging, localX, wasDrag, onPointerDown, onDragMove, endDrag, onDoubleClick };
}
