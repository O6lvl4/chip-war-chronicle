import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from 'react';
import { count, noteCommit } from '../lib/perf';

interface Params {
  scrollRef: RefObject<HTMLDivElement | null>;
  viewStart: number;
  viewEnd: number;
  pxPerMs: number;
  /** How far the offscreen render extends beyond the plot on each side (px). */
  slack: number;
  /** Scroll room on each side of the sticky frame (px). */
  spacer: number;
  /** `idle` is true when the scroll has stopped; a mid-fling commit may be kept local to the canvas. */
  onViewChange: (s: number, e: number, idle: boolean) => void;
  onShift: (dx: number) => void;
}

/** scrollLeft at which the committed [start, end] shows unshifted. */
interface Anchor {
  left: number;
  start: number;
  end: number;
  idle: boolean;
  at: number;
}

const IDLE_MS = 150;
/** Commit once the shift has used this fraction of the pre-rendered slack. */
const COMMIT_AT = 0.4;
const STALE_MS = 800;

export interface PanApi {
  /** Live horizontal shift of the rendered view (px). */
  dx: () => number;
  /** The view as displayed right now: the committed one shifted by the live pan. */
  effectiveView: () => { start: number; end: number };
  /** Commits [start, end] as the (app-level) view, keeping the current scroll position as the new zero. */
  commitView: (start: number, end: number) => void;
}

/**
 * Horizontal panning rides the browser's own scroller (inertia and axis locking included): the
 * board sits sticky inside a much wider strip, and every scroll event re-blits the offscreen
 * render shifted by (anchor − scrollLeft). The view is committed when the shift nears the edge
 * of the render or the scroll goes idle; the anchor is re-centred only when idle so momentum is
 * never interrupted.
 */
export function usePanScroll(p: Params): PanApi {
  const { scrollRef, viewStart, viewEnd, pxPerMs, slack, spacer, onViewChange, onShift } = p;
  const anchor = useRef<Anchor>({ left: spacer, start: viewStart, end: viewEnd, idle: true, at: 0 });
  const pending = useRef<Anchor | null>(null);
  const idle = useRef(0);
  const cb = useRef({ onViewChange, onShift, pxPerMs, slack });
  cb.current = { onViewChange, onShift, pxPerMs, slack };

  const dx = useCallback(() => {
    const el = scrollRef.current;
    return el ? anchor.current.left - el.scrollLeft : 0;
  }, [scrollRef]);

  const commitView = useCallback((start: number, end: number, isIdle = false) => {
    const el = scrollRef.current;
    pending.current = { left: el ? el.scrollLeft : spacer, start, end, idle: isIdle, at: performance.now() };
    count('commits');
    cb.current.onViewChange(start, end, isIdle);
  }, [scrollRef, spacer]);

  const effectiveView = useCallback(() => {
    const d = dx() / cb.current.pxPerMs;
    const { start, end } = anchor.current;
    return { start: start - d, end: end - d };
  }, [dx]);

  const commitPan = useCallback((isIdle: boolean) => {
    const v = effectiveView();
    const span = anchor.current.end - anchor.current.start;
    commitView(v.start, v.start + span, isIdle);
  }, [effectiveView, commitView]);

  // The committed view changed: adopt the pending anchor if this is our commit, else re-centre.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const q = pending.current;
    pending.current = null;
    if (q && q.start === viewStart && q.end === viewEnd) {
      anchor.current = q;
      noteCommit(performance.now() - q.at);
      if (q.idle && Math.abs(q.left - spacer) > spacer / 2) {
        const d = q.left - el.scrollLeft;
        el.scrollLeft = spacer;
        anchor.current = { ...q, left: spacer + d };
      }
    } else {
      el.scrollLeft = spacer;
      anchor.current = { left: spacer, start: viewStart, end: viewEnd, idle: true, at: 0 };
    }
    cb.current.onShift(anchor.current.left - el.scrollLeft);
  }, [scrollRef, viewStart, viewEnd, spacer]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const d = anchor.current.left - el.scrollLeft;
      count('scrolls');
      cb.current.onShift(d);
      window.clearTimeout(idle.current);
      if (pending.current && performance.now() - pending.current.at < STALE_MS) return;
      pending.current = null;
      if (Math.abs(d) > cb.current.slack * COMMIT_AT) { commitPan(false); return; }
      if (d !== 0) idle.current = window.setTimeout(() => commitPan(true), IDLE_MS);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); window.clearTimeout(idle.current); };
  }, [scrollRef, commitPan]);

  return useMemo(() => ({ dx, effectiveView, commitView: (s: number, e: number) => commitView(s, e, true) }), [dx, effectiveView, commitView]);
}
