import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { CrossSectionState, Link, Thread, TimelineEvent } from '../types';
import { AXIS_H, minLabelWeight, relatedIds } from '../lib/layout';
import { buildBoard, ROW_H, textWidth } from '../lib/board';
import { colorLookup, paletteFor } from '../lib/palette';
import { useCanvasInteraction, type Preview } from '../hooks/useCanvasInteraction';
import { makeGeom } from './canvas/geometry';
import Lanes from './canvas/Lanes';
import { AxisFrame, AxisTicks } from './canvas/Axis';
import BoardCanvas, { hitChip, paintBoard, type BoardPaint, type VWindow } from './canvas/BoardCanvas';
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
      if (covered && settled) return;
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
 * Programme-guide layout. A sticky axis row and a vertically scrolling board. Both have a
 * composited, pannable layer moved/stretched with CSS transforms during gestures; the board
 * layer is a single canvas (grid, links, chips) so the DOM stays tiny on phones.
 */
export default function TimelineCanvas(props: Props) {
  const { threads, events, links, activeThreadIds, viewStart, viewEnd, selectedId,
    query, dark, crossSection, onViewChange, onSelect, onCrossSection } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const axisPanRef = useRef<HTMLDivElement>(null);
  const bodyPanRef = useRef<HTMLDivElement>(null);
  const boardCanvasRef = useRef<HTMLCanvasElement>(null);
  const width = useWidth(containerRef);
  const [axisPreview, setAxisPreview] = useState<Preview | null>(null);
  const [localCsX, setLocalCsX] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const lanes = useMemo(() => threads.filter(t => activeThreadIds.includes(t.id)), [threads, activeThreadIds]);
  const geom = useMemo(() => makeGeom(width, viewStart, viewEnd), [width, viewStart, viewEnd]);
  const { labelW, slack, renderL, renderR } = geom;
  const pal = paletteFor(dark);
  const colorOf = useMemo(() => colorLookup(threads, dark), [threads, dark]);
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);
  const measure = useMeasure();

  const board = useMemo(() => buildBoard({
    lanes, events: events.filter(ev => activeThreadIds.includes(ev.threadId)), xFor: geom.xFor, minWeight: minLabelWeight(viewEnd - viewStart), measure,
  }), [lanes, events, activeThreadIds, geom, viewStart, viewEnd, measure]);
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

  // Gestures never re-lay-out. A pan slides the composited layers with a transform; a zoom
  // re-paints the canvas with every x remapped (rows and glyphs untouched), once per frame.
  const zoomFrame = useRef(0);
  const onPreview = useCallback((p: Preview | null) => {
    const panOnly = !p || p.scale === 1;
    const transform = p && panOnly ? `translate3d(${p.dx}px,0,0)` : '';
    for (const el of [axisPanRef.current, bodyPanRef.current]) if (el) el.style.transform = transform;
    cancelAnimationFrame(zoomFrame.current);
    if (panOnly) {
      setAxisPreview(null);
      if (p === null && boardCanvasRef.current) paintBoard(boardCanvasRef.current, paintRef.current);
      return;
    }
    zoomFrame.current = requestAnimationFrame(() => {
      const xMap = (x: number) => p.originX + (x - p.originX) * p.scale + p.dx;
      if (boardCanvasRef.current) paintBoard(boardCanvasRef.current, { ...paintRef.current, xMap });
      setAxisPreview(p);
    });
  }, []);
  useLayoutEffect(() => { onPreview(null); }, [viewStart, viewEnd, onPreview]);
  const axisGeom = useMemo(() => {
    if (!axisPreview) return geom;
    const p = axisPreview;
    return { ...geom, xFor: (t: number) => p.originX + (geom.xFor(t) - p.originX) * p.scale + p.dx };
  }, [geom, axisPreview]);

  const ia = useCanvasInteraction({ hostRef: containerRef, viewStart, viewEnd, labelW, onViewChange, onPreview });

  /** Board-space point of a pointer event (x = screen x of the stage, y = board y). */
  const boardPoint = (e: { clientX: number; clientY: number }) => {
    const sc = scrollRef.current;
    const top = sc ? sc.getBoundingClientRect().top - sc.scrollTop : 0;
    return { x: ia.localX(e), y: e.clientY - top };
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
    const x = ia.localX(e);
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
        <div className="board" style={{ height: board.totalH, width }}>
          <svg className="stage-static" width={width} height={board.totalH}>
            <Lanes threads={threads} board={board} width={width} labelW={labelW} pal={pal} dark={dark} />
          </svg>
          <div className="plot-viewport" style={{ left: labelW, width: width - labelW, height: board.totalH }}>
            <div ref={bodyPanRef} className="plot-pan" style={{ left: -slack, top: win.top, width: innerW, height: win.height }}>
              <BoardCanvas paint={paint} canvasRef={boardCanvasRef} />
            </div>
          </div>
          {crossSection.enabled && csX > labelW && (
            <svg className="stage-overlay" width={width} height={board.totalH}>
              <CrossSectionOverlay pal={pal} x={csX} date={csDate} fixed={crossSection.fixed} height={board.totalH} />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
