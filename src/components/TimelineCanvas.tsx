import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { CrossSectionState, Link, Thread, TimelineEvent } from '../types';
import { AXIS_H, minLabelWeight, relatedIds } from '../lib/layout';
import { buildBoard } from '../lib/board';
import { colorLookup, paletteFor } from '../lib/palette';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { makeGeom } from './canvas/geometry';
import Lanes from './canvas/Lanes';
import { AxisFrame, AxisTicks, GridLines } from './canvas/Axis';
import LinkCanvas from './canvas/LinkCanvas';
import LinkLayer from './canvas/LinkLayer';
import ChipLayer from './canvas/ChipLayer';
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
 * Programme-guide layout. An axis row (sticky) and a vertically scrolling board; both have a
 * composited, pannable layer that moves with a CSS transform while the user scrolls sideways.
 * Links are drawn on a canvas; events are rows of chips packed so that nothing overlaps.
 */
export default function TimelineCanvas(props: Props) {
  const { threads, events, links, activeThreadIds, viewStart, viewEnd, selectedId,
    query, dark, crossSection, onViewChange, onSelect, onCrossSection } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const axisPanRef = useRef<HTMLDivElement>(null);
  const bodyPanRef = useRef<HTMLDivElement>(null);
  const width = useWidth(containerRef);
  const [localCsX, setLocalCsX] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const lanes = useMemo(() => threads.filter(t => activeThreadIds.includes(t.id)), [threads, activeThreadIds]);
  const geom = useMemo(() => makeGeom(width, viewStart, viewEnd), [width, viewStart, viewEnd]);
  const { labelW, slack, renderL, renderR } = geom;
  const pal = paletteFor(dark);
  const colorOf = useMemo(() => colorLookup(threads, dark), [threads, dark]);
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  const board = useMemo(() => buildBoard({
    lanes, events: events.filter(ev => activeThreadIds.includes(ev.threadId)), xFor: geom.xFor, minWeight: minLabelWeight(viewEnd - viewStart),
  }), [lanes, events, activeThreadIds, geom, viewStart, viewEnd]);
  const chips = useMemo(() => [...board.chips.values()].filter(c => c.x1 >= renderL && c.x0 <= renderR), [board, renderL, renderR]);

  const onPanPreview = useCallback((dx: number) => {
    const t = dx ? `translate3d(${dx}px,0,0)` : '';
    if (axisPanRef.current) axisPanRef.current.style.transform = t;
    if (bodyPanRef.current) bodyPanRef.current.style.transform = t;
  }, []);
  useLayoutEffect(() => { onPanPreview(0); }, [viewStart, viewEnd, onPanPreview]);

  const ia = useCanvasInteraction({ hostRef: containerRef, viewStart, viewEnd, labelW, onViewChange, onPanPreview });

  const emphasis = useMemo(() => ({ focusId: selectedId, related: relatedIds(selectedId, links), query }), [selectedId, links, query]);
  const focusId = selectedId ?? hoveredId;

  const csX = crossSection.fixed ? crossSection.x : localCsX;
  const csDate = csX > labelW ? geom.tFor(csX) : null;
  const tracking = crossSection.enabled && !crossSection.fixed;

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    ia.onDragMove(e);
    if (!tracking) return;
    const x = ia.localX(e);
    setLocalCsX(x);
    onCrossSection(x);
  };
  const onClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (ia.wasDrag() || (e.target as Element).closest('.evt-hit')) return;
    if (crossSection.enabled) onCrossSection(ia.localX(e), true);
    else onSelect(null);
  };
  const handlers = useMemo(() => ({
    onSelect: (id: string) => onSelect(id === selectedId ? null : id),
    onHover: setHoveredId,
  }), [onSelect, selectedId]);

  const innerW = renderR - renderL;
  const shift = `translate(${-renderL} 0)`;
  return (
    <div ref={containerRef} className={`timeline-stage${ia.isDragging ? ' dragging' : ''}`}
      onPointerDown={ia.onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={ia.endDrag} onPointerCancel={ia.endDrag}
      onDoubleClick={ia.onDoubleClick} onClick={onClick}>
      <div className="axis-row" style={{ height: AXIS_H }}>
        <svg className="stage-static" width={width} height={AXIS_H}><AxisFrame geom={geom} pal={pal} /></svg>
        <div className="plot-viewport" style={{ left: labelW, width: width - labelW, height: AXIS_H }}>
          <div ref={axisPanRef} className="plot-pan" style={{ left: -slack, width: innerW, height: AXIS_H }}>
            <svg width={innerW} height={AXIS_H}><g transform={shift}><AxisTicks geom={geom} pal={pal} viewStart={viewStart} viewEnd={viewEnd} /></g></svg>
          </div>
        </div>
      </div>
      <div className="board-scroll">
        <div className="board" style={{ height: board.totalH, width }}>
          <svg className="stage-static" width={width} height={board.totalH}>
            <Lanes threads={threads} board={board} width={width} labelW={labelW} pal={pal} dark={dark} />
          </svg>
          <div className="plot-viewport" style={{ left: labelW, width: width - labelW, height: board.totalH }}>
            <div ref={bodyPanRef} className="plot-pan" style={{ left: -slack, width: innerW, height: board.totalH }}>
              <LinkCanvas geom={geom} board={board} pal={pal} links={links} eventsById={eventsById} dimmed={selectedId !== null} />
              <svg width={innerW} height={board.totalH} style={{ position: 'absolute', left: 0, top: 0 }}>
                <g transform={shift}>
                  <GridLines geom={geom} pal={pal} viewStart={viewStart} viewEnd={viewEnd} height={board.totalH} />
                  <LinkLayer geom={geom} board={board} pal={pal} links={links} eventsById={eventsById} focusId={focusId} />
                  <ChipLayer chips={chips} eventsById={eventsById} pal={pal} colorOf={colorOf} emphasis={emphasis} handlers={handlers} />
                </g>
              </svg>
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
