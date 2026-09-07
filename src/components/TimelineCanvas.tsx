import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { CrossSectionState, Link, Thread, TimelineEvent } from '../types';
import { AXIS_H, minLabelWeight, relatedIds } from '../lib/layout';
import { buildBoard, ROW_H, textWidth, translateBoard } from '../lib/board';
import { colorLookup, paletteFor } from '../lib/palette';
import { useCanvasInteraction, type Preview } from '../hooks/useCanvasInteraction';
import { usePanScroll } from '../hooks/usePanScroll';
import { makeGeom } from './canvas/geometry';
import Lanes from './canvas/Lanes';
import { AxisFrame, AxisTicks } from './canvas/Axis';
import BoardCanvas, { hitChip, type BoardApi, type BoardPaint, type VWindow } from './canvas/BoardCanvas';
import CrossSectionOverlay from './canvas/CrossSectionOverlay';

interface Props {
  threads: Thread[];
  events: TimelineEvent[];
  links: Link[];
  activeThreadIds: string[];
  viewStart: number;
  viewEnd: number;
  selectedId: string | null;
  query: string;
  dark: boolean;
  crossSection: CrossSectionState;
  onViewChange: (s: number, e: number) => void;
  onSelect: (id: string | null) => void;
  onCrossSection: (x: number, toggle?: boolean) => void;
}

const FONT = '"M PLUS Rounded 1c", "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif';
/** Layout is computed relative to this instant so that a pan only translates it. */
const EPOCH = Date.UTC(2015, 0, 1);
/** Native scroll room on each side of the sticky frame, in plot widths. */
const SPACER_PLOTS = 4;

/** Real title widths from a scratch canvas (cached per title); re-created when fonts finish loading. */
function useMeasure(): (s: string) => number {
  const [ready, setReady] = useState(false);
  useEffect(() => { document.fonts?.ready.then(() => setReady(true)); }, []);
  return useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    const cache = new Map<string, number>();
    return (s: string) => {
      let w = cache.get(s);
      if (w === undefined) {
        if (ctx) { ctx.font = `500 11px ${FONT}`; w = ctx.measureText(s).width; } else w = textWidth(s);
        cache.set(s, w);
      }
      return w;
    };
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Only the visible part of the board (plus half a viewport above and below) is materialised. */
function useVerticalWindow(ref: React.RefObject<HTMLDivElement | null>, totalH: number): VWindow {
  const [win, setWin] = useState<VWindow>({ top: 0, height: 1600 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let current = win;
    const update = () => {
      const vh = el.clientHeight || 800;
      const margin = vh / 2;
      const visTop = el.scrollTop;
      const visBottom = visTop + vh;
      // The window must always cover what is on screen; beyond that, only move it in half-viewport steps.
      const covered = visTop >= current.top && visBottom <= Math.min(totalH, current.top + current.height);
      const settled = Math.abs(Math.max(0, visTop - margin) - current.top) < margin / 2;
      const oversized = current.height > vh + 2 * margin + 8 || current.top + current.height > totalH + 8;
      if (covered && settled && !oversized) return;
      const wantTop = Math.max(0, visTop - margin);
      current = { top: wantTop, height: Math.min(totalH - wantTop, vh + 2 * margin) };
      setWin(current);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => { el.removeEventListener('scroll', update); obs.disconnect(); };
  }, [ref, totalH]); // eslint-disable-line react-hooks/exhaustive-deps
  return win;
}

/**
 * The view the canvas renders. Mid-fling pan commits stay local (only the canvas re-renders);
 * the app-level view is updated when the scroll goes idle or a zoom lands. External changes
 * (minimap, centring on a selection) always win.
 */
function useLocalView(propStart: number, propEnd: number, onViewChange: (s: number, e: number) => void) {
  const [local, setLocal] = useState({ start: propStart, end: propEnd, fromStart: propStart, fromEnd: propEnd });
  const fresh = local.fromStart === propStart && local.fromEnd === propEnd;
  if (!fresh) setLocal({ start: propStart, end: propEnd, fromStart: propStart, fromEnd: propEnd });
  const commitView = useCallback((s: number, e: number, idle: boolean) => {
    if (idle) onViewChange(s, e);
    else setLocal(l => ({ ...l, start: s, end: e }));
  }, [onViewChange]);
  const v = fresh ? local : { start: propStart, end: propEnd };
  return { viewStart: v.start, viewEnd: v.end, commitView };
}

function useWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [w, setW] = useState(1000);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setW(e.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return w;
}

/**
 * Programme-guide layout inside one native 2-D scroller. The frame (lanes, axis-aligned canvas,
 * overlay) is sticky inside a much wider strip, so horizontal panning is the browser's own
 * scroll (inertia included) and each scroll event only re-blits the offscreen render. Zooms
 * re-render that image with every x remapped; the view is committed once per gesture.
 */
export default function TimelineCanvas(props: Props) {
  const { threads, events, links, activeThreadIds, selectedId,
    query, dark, crossSection, onViewChange, onSelect, onCrossSection } = props;
  const { viewStart, viewEnd, commitView } = useLocalView(props.viewStart, props.viewEnd, onViewChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const axisPanRef = useRef<HTMLDivElement>(null);
  const overlayPanRef = useRef<HTMLDivElement>(null);
  const boardApi = useRef<BoardApi>(null);
  const width = useWidth(containerRef);
  const [axisPreview, setAxisPreview] = useState<{ p: Preview; d: number } | null>(null);
  const [localCsX, setLocalCsX] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const lanes = useMemo(() => threads.filter(t => activeThreadIds.includes(t.id)), [threads, activeThreadIds]);
  const geom = useMemo(() => makeGeom(width, viewStart, viewEnd), [width, viewStart, viewEnd]);
  const { labelW, slack, renderL, renderR, pxPerMs } = geom;
  const spacer = Math.round(SPACER_PLOTS * (width - labelW));
  const pal = paletteFor(dark);
  const colorOf = useMemo(() => colorLookup(threads, dark), [threads, dark]);
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);
  const measure = useMeasure();

  // Rows are packed at the current scale only; a pan just translates the result.
  const minWeight = minLabelWeight(viewEnd - viewStart);
  const boardRel = useMemo(() => buildBoard({
    lanes, events: events.filter(ev => activeThreadIds.includes(ev.threadId)), xFor: t => (t - EPOCH) * pxPerMs, minWeight, measure,
  }), [lanes, events, activeThreadIds, pxPerMs, minWeight, measure]);
  const board = useMemo(() => translateBoard(boardRel, labelW - (viewStart - EPOCH) * pxPerMs), [boardRel, labelW, viewStart, pxPerMs]);
  const win = useVerticalWindow(scrollRef, board.totalH);
  const chips = useMemo(() => {
    const yMin = win.top - ROW_H;
    const yMax = win.top + win.height + ROW_H;
    return [...board.chips.values()].filter(c => c.x1 >= renderL && c.x0 <= renderR && c.y >= yMin && c.y <= yMax);
  }, [board, renderL, renderR, win]);

  const emphasis = useMemo(() => ({ focusId: selectedId, related: relatedIds(selectedId, links), query }), [selectedId, links, query]);
  const paint = useMemo<BoardPaint>(() => ({
    geom, board, win, chips, eventsById, links, pal, colorOf, emphasis, hoveredId, fontFamily: FONT, measure, viewStart, viewEnd,
  }), [geom, board, win, chips, eventsById, links, pal, colorOf, emphasis, hoveredId, measure, viewStart, viewEnd]);
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // A pan shift is one blit plus two CSS transforms; never a React render.
  const applyShift = useCallback((d: number) => {
    const tf = `translate3d(${d}px,0,0)`;
    if (axisPanRef.current) axisPanRef.current.style.transform = tf;
    if (overlayPanRef.current) overlayPanRef.current.style.transform = tf;
    boardApi.current?.shift(d);
  }, []);
  const pan = usePanScroll({ scrollRef, viewStart, viewEnd, pxPerMs, slack, spacer, onViewChange: commitView, onShift: applyShift });
  const getShift = pan.dx;

  // Zoom previews re-render the offscreen image with every x remapped (rows and glyphs untouched), once per frame.
  const frame = useRef(0);
  const onPreview = useCallback((p: Preview | null) => {
    cancelAnimationFrame(frame.current);
    if (!p) { setAxisPreview(null); boardApi.current?.repaint(paintRef.current); applyShift(pan.dx()); return; }
    frame.current = requestAnimationFrame(() => {
      const d = pan.dx();
      const xMap = (x: number) => p.originX + (x + d - p.originX) * p.scale + p.dx;
      boardApi.current?.repaint({ ...paintRef.current, xMap });
      if (axisPanRef.current) axisPanRef.current.style.transform = '';
      setAxisPreview({ p, d });
    });
  }, [applyShift, pan]);
  useLayoutEffect(() => { setAxisPreview(null); }, [viewStart, viewEnd]);
  const axisGeom = useMemo(() => {
    if (!axisPreview) return geom;
    const { p, d } = axisPreview;
    return { ...geom, xFor: (t: number) => p.originX + (geom.xFor(t) + d - p.originX) * p.scale + p.dx };
  }, [geom, axisPreview]);

  const ia = useCanvasInteraction({ hostRef: containerRef, scrollRef, labelW, pan, onPreview });

  /** Board-space point of a pointer event (x in committed-view screen coordinates, y = board y). */
  const boardPoint = (e: { clientX: number; clientY: number }) => {
    const sc = scrollRef.current;
    const top = sc ? sc.getBoundingClientRect().top - sc.scrollTop : 0;
    return { x: ia.localX(e) - pan.dx(), y: e.clientY - top };
  };

  const csX = crossSection.fixed ? crossSection.x : localCsX;
  const csDate = csX > labelW ? geom.tFor(csX) : null;
  const tracking = crossSection.enabled && !crossSection.fixed;

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    ia.onDragMove(e);
    if (e.pointerType === 'mouse' && !ia.isDragging) {
      const pt = boardPoint(e);
      const id = hitChip(chips, eventsById, pt.x, pt.y)?.id ?? null;
      if (id !== hoveredId) setHoveredId(id);
    }
    if (!tracking) return;
    const x = boardPoint(e).x;
    setLocalCsX(x);
    onCrossSection(x);
  };
  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (ia.wasDrag()) return;
    const pt = boardPoint(e);
    const hit = pt.x > labelW ? hitChip(chips, eventsById, pt.x, pt.y) : null;
    if (hit) { onSelect(hit.id === selectedId ? null : hit.id); return; }
    if (crossSection.enabled) onCrossSection(pt.x, true);
    else onSelect(null);
  };

  const innerW = renderR - renderL;
  const shift = `translate(${-renderL} 0)`;
  return (
    <div ref={containerRef} className={`timeline-stage${ia.isDragging ? ' dragging' : ''}${hoveredId ? ' over-chip' : ''}`}
      onPointerDown={ia.onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={ia.endDrag} onPointerCancel={ia.endDrag}
      onDoubleClick={ia.onDoubleClick} onClick={onClick}>
      <div className="axis-row" style={{ height: AXIS_H }}>
        <svg className="stage-static" width={width} height={AXIS_H}><AxisFrame geom={geom} pal={pal} /></svg>
        <div className="plot-viewport" style={{ left: labelW, width: width - labelW, height: AXIS_H }}>
          <div ref={axisPanRef} className="plot-pan" style={{ left: -slack, width: innerW, height: AXIS_H }}>
            <svg width={innerW} height={AXIS_H}><g transform={shift}><AxisTicks geom={axisGeom} pal={pal} viewStart={viewStart} viewEnd={viewEnd} /></g></svg>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="board-scroll">
        <div className="board" style={{ height: board.totalH, width: width + 2 * spacer }}>
          <div className="board-frame" style={{ width, height: board.totalH }}>
            <svg className="stage-static" width={width} height={board.totalH}>
              <Lanes threads={threads} board={boardRel} width={width} labelW={labelW} pal={pal} dark={dark} />
            </svg>
            <div className="plot-viewport" style={{ left: labelW, width: width - labelW, height: board.totalH }}>
              <div className="board-window" style={{ top: win.top, width: width - labelW, height: win.height }}>
                <BoardCanvas paint={paint} apiRef={boardApi} getShift={getShift} />
              </div>
            </div>
            {crossSection.enabled && csX > labelW && (
              <div ref={overlayPanRef} className="overlay-pan" style={{ width, height: board.totalH }}>
                <svg className="stage-overlay" width={width} height={board.totalH}>
                  <CrossSectionOverlay pal={pal} x={csX} date={csDate} fixed={crossSection.fixed} height={board.totalH} />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
