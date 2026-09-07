import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { CrossSectionState, Link, Thread, TimelineEvent } from '../types';
import { AXIS_H, clusterEvents, minLabelWeight, placeLabels, relatedIds } from '../lib/layout';
import { colorLookup, paletteFor } from '../lib/palette';
import { ms } from '../lib/time';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { makeGeom } from './canvas/geometry';
import Lanes from './canvas/Lanes';
import { AxisFrame, AxisTicks } from './canvas/Axis';
import LinkCanvas from './canvas/LinkCanvas';
import LinkLayer from './canvas/LinkLayer';
import EventLayer from './canvas/EventLayer';
import LabelLayer from './canvas/LabelLayer';
import CrossSectionOverlay from './canvas/CrossSectionOverlay';

interface Props {
  threads: Thread[];
  events: TimelineEvent[];
  links: Link[];
  activeThreadIds: string[];
  viewStart: number;
  viewEnd: number;
  selectedId: string | null;
  hoveredId: string | null;
  query: string;
  dark: boolean;
  crossSection: CrossSectionState;
  onViewChange: (s: number, e: number) => void;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onCrossSection: (x: number, toggle?: boolean) => void;
  onCluster: (ids: string[]) => void;
}

function useElementSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 1000, h: 500 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return size;
}

/**
 * Layout: a static SVG (lanes, axis frame) at the back; a composited, pannable layer in the middle
 * holding a canvas for links plus an SVG for ticks/events/labels, pre-rendered one plot-width beyond
 * each edge; a static overlay SVG on top for the cross-section rule.
 */
export default function TimelineCanvas(props: Props) {
  const { threads, events, links, activeThreadIds, viewStart, viewEnd, selectedId, hoveredId,
    query, dark, crossSection, onViewChange, onSelect, onHover, onCrossSection, onCluster } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const size = useElementSize(containerRef);
  const [localCsX, setLocalCsX] = useState(-1);

  const lanes = useMemo(() => threads.filter(t => activeThreadIds.includes(t.id)), [threads, activeThreadIds]);
  const geom = useMemo(() => makeGeom({ width: size.w, height: size.h, lanes, viewStart, viewEnd }), [size, lanes, viewStart, viewEnd]);
  const { labelW, slack, renderL, renderR, svgH } = geom;
  const pal = paletteFor(dark);
  const colorOf = useMemo(() => colorLookup(threads, dark), [threads, dark]);
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  // Panning translates the composited layer only; the view commits once at the end.
  const onPanPreview = useCallback((dx: number) => {
    if (panRef.current) panRef.current.style.transform = dx ? `translate3d(${dx}px,0,0)` : '';
  }, []);
  useLayoutEffect(() => { if (panRef.current) panRef.current.style.transform = ''; }, [viewStart, viewEnd]);

  const ia = useCanvasInteraction({ hostRef: containerRef, viewStart, viewEnd, labelW, onViewChange, onPanPreview });

  const visible = useMemo(() => events.filter(ev => {
    if (!activeThreadIds.includes(ev.threadId)) return false;
    const x1 = geom.xFor(ms(ev.date));
    const x2 = geom.xFor(ms(ev.endDate ?? ev.date));
    return x2 >= renderL && x1 <= renderR;
  }), [events, activeThreadIds, geom, renderL, renderR]);
  const { singles, clusters } = useMemo(() => clusterEvents(visible, geom.xFor), [visible, geom]);
  const placed = useMemo(() => {
    const minW = minLabelWeight(viewEnd - viewStart);
    const bottom = AXIS_H + lanes.length * geom.laneH - 8;
    return placeLabels(singles.filter(ev => ev.weight >= minW), { xFor: geom.xFor, yFor: geom.yFor, bottom });
  }, [singles, geom, lanes.length, viewStart, viewEnd]);

  const focusId = selectedId ?? hoveredId;
  const emphasis = useMemo(() => ({ focusId, related: relatedIds(focusId, links), query }), [focusId, links, query]);

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
    onHover,
    onViewChange,
    onCluster,
  }), [onSelect, selectedId, onHover, onViewChange, onCluster]);

  const innerW = renderR - renderL;
  return (
    <div ref={containerRef} className={`timeline-stage${ia.isDragging ? ' dragging' : ''}`}
      onPointerDown={ia.onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={ia.endDrag} onPointerCancel={ia.endDrag}
      onDoubleClick={ia.onDoubleClick} onClick={onClick}>
      <svg className="stage-static" width={size.w} height={svgH}>
        <Lanes geom={geom} pal={pal} dark={dark} />
        <AxisFrame geom={geom} pal={pal} />
      </svg>
      <div className="plot-viewport" style={{ left: labelW, width: size.w - labelW, height: svgH }}>
        <div ref={panRef} className="plot-pan" style={{ left: -slack, width: innerW, height: svgH }}>
          <LinkCanvas geom={geom} pal={pal} links={links} eventsById={eventsById} dimmed={focusId !== null} />
          <svg width={innerW} height={svgH} style={{ position: 'absolute', left: 0, top: 0 }}>
            <g transform={`translate(${-renderL} 0)`}>
              <AxisTicks geom={geom} pal={pal} viewStart={viewStart} viewEnd={viewEnd} />
              <LinkLayer geom={geom} pal={pal} links={links} eventsById={eventsById} focusId={focusId} />
              <EventLayer geom={geom} pal={pal} singles={singles} clusters={clusters}
                colorOf={colorOf} emphasis={emphasis} handlers={handlers} />
              <LabelLayer pal={pal} placed={placed} eventsById={eventsById} emphasis={emphasis} />
            </g>
          </svg>
        </div>
      </div>
      {crossSection.enabled && csX > labelW && (
        <svg className="stage-overlay" width={size.w} height={svgH}>
          <CrossSectionOverlay pal={pal} x={csX} date={csDate} fixed={crossSection.fixed} svgH={svgH} />
        </svg>
      )}
    </div>
  );
}
