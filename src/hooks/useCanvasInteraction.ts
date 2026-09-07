import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { DAY } from '../lib/time';
import type { PanApi } from './usePanScroll';

/** What the board should show while a zoom gesture is in flight. */
export interface Preview {
  dx: number;       // horizontal translation in px (on top of the live pan)
  scale: number;    // horizontal stretch (1 = none)
  originX: number;  // screen x the stretch is anchored to
}

interface Params {
  /** Element whose left edge is screen x = 0 for the canvas, and which receives the wheel listener. */
  hostRef: RefObject<HTMLElement | null>;
  /** The native 2-D scroller that owns panning. */
  scrollRef: RefObject<HTMLDivElement | null>;
  labelW: number;
  pan: PanApi;
  onPreview: (p: Preview | null) => void;
}

interface Pinch {
  sx: number;      // midpoint (screen x) at start
  dist: number;    // distance at start
  last: Preview;
}

interface Drag {
  sx: number;
  sy: number;
  left: number;
  top: number;
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

/** ⌘ or Ctrl + wheel zooms; everything else is left to the native scroller. */
function isZoomWheel(e: WheelEvent): boolean {
  return e.ctrlKey || e.metaKey;
}

/**
 * Zoom gestures (pinch, ⌘+wheel, double-click) and mouse drag-to-scroll. Panning itself is native
 * scrolling (see usePanScroll); a zoom only stretches the rendered image while in flight and
 * commits the view once when it ends.
 */
export function useCanvasInteraction({ hostRef, scrollRef, labelW, pan, onPreview }: Params) {
  const [isDragging, setIsDragging] = useState(false);
  const pointers = useRef(new Map<number, number>());
  const pinch = useRef<Pinch | null>(null);
  const drag = useRef<Drag | null>(null);
  const moved = useRef(false);
  const wheel = useRef<{ p: Preview; timer: number }>({ p: NO_PREVIEW, timer: 0 });

  const rect = () => hostRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 1000, 500);
  const localX = (e: { clientX: number }) => e.clientX - rect().left;

  const commitRef = useRef((p: Preview) => {
    pan.commitView(...applyPreview(pan.effectiveView(), { labelW, width: rect().width }, p));
  });
  commitRef.current = (p: Preview) => {
    pan.commitView(...applyPreview(pan.effectiveView(), { labelW, width: rect().width }, p));
  };

  // Wheel: ⌘/Ctrl accumulates into one zoom preview committed after the wheel goes quiet;
  // plain wheel over the (non-scrolling) axis row is forwarded to the scroller.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!isZoomWheel(e)) {
        const sc = scrollRef.current;
        if (sc && !sc.contains(e.target as Node)) { e.preventDefault(); sc.scrollBy(e.shiftKey ? e.deltaY : e.deltaX, e.shiftKey ? 0 : e.deltaY); }
        return;
      }
      e.preventDefault();
      const w = wheel.current;
      if (w.p === NO_PREVIEW) w.p = { dx: 0, scale: 1, originX: e.clientX - el.getBoundingClientRect().left };
      w.p = { ...w.p, scale: w.p.scale * (e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP) };
      onPreview(w.p);
      window.clearTimeout(w.timer);
      w.timer = window.setTimeout(() => { const p = w.p; w.p = NO_PREVIEW; commitRef.current(p); }, SETTLE_MS);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [hostRef, scrollRef, onPreview]);

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

  const beginPinch = () => {
    const xs = [...pointers.current.values()];
    if (xs.length < 2) { pinch.current = null; return; }
    pinch.current = { sx: (xs[0] + xs[1]) / 2 - rect().left, dist: Math.abs(xs[0] - xs[1]), last: NO_PREVIEW };
  };

  const onPointerDown = (e: ReactPointerEvent<Element>) => {
    pointers.current.set(e.pointerId, e.clientX);
    moved.current = false;
    beginPinch();
    if (e.pointerType === 'touch') return; // one finger: native scrolling
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
    const sc = scrollRef.current;
    drag.current = { sx: e.clientX, sy: e.clientY, left: sc?.scrollLeft ?? 0, top: sc?.scrollTop ?? 0 };
    setIsDragging(true);
  };

  const onDragMove = (e: ReactPointerEvent<Element>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e.clientX);
    const g = pinch.current;
    const xs = [...pointers.current.values()];
    if (g && xs.length >= 2) {
      moved.current = true;
      const mid = (xs[0] + xs[1]) / 2 - rect().left;
      g.last = { dx: mid - g.sx, scale: Math.abs(xs[0] - xs[1]) / Math.max(g.dist, 1), originX: g.sx };
      onPreview(g.last);
      return;
    }
    const d = drag.current;
    const sc = scrollRef.current;
    if (!d || !sc) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) > DRAG_PX || Math.abs(dy) > DRAG_PX) moved.current = true;
    sc.scrollLeft = d.left - dx;
    sc.scrollTop = d.top - dy;
  };

  const endDrag = (e: ReactPointerEvent<Element>) => {
    const g = pinch.current;
    pointers.current.delete(e.pointerId);
    if (g) {
      if (moved.current) commitRef.current(g.last); else onPreview(null);
      pinch.current = null;
    }
    if (pointers.current.size === 0) { drag.current = null; setIsDragging(false); }
  };

  const onDoubleClick = (e: ReactMouseEvent<Element>) => {
    const mx = localX(e);
    if (mx < labelW) return;
    commitRef.current({ dx: 0, scale: 1.5, originX: mx });
  };

  const wasDrag = () => moved.current;

  return { isDragging, localX, wasDrag, onPointerDown, onDragMove, endDrag, onDoubleClick };
}
