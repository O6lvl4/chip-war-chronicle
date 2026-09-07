import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import type { CrossSectionState, Link, Thread, TimelineEvent } from '../types';
import { AXIS_H, clusterEvents, minLabelWeight, placeLabels, relatedIds } from '../lib/layout';
import { colorLookup, paletteFor } from '../lib/palette';
import { ms } from '../lib/time';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';
import { makeGeom } from './canvas/geometry';
import Lanes from './canvas/Lanes';
import Axis from './canvas/Axis';
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

export default function TimelineCanvas(props: Props) {
  const { threads, events, links, activeThreadIds, viewStart, viewEnd, selectedId, hoveredId,
    query, dark, crossSection, onViewChange, onSelect, onHover, onCrossSection, onCluster } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const size = useElementSize(containerRef);
  const [localCsX, setLocalCsX] = useState(-1);

  const lanes = useMemo(() => threads.filter(t => activeThreadIds.includes(t.id)), [threads, activeThreadIds]);
  const geom = useMemo(() => makeGeom({ width: size.w, height: size.h, lanes, viewStart, viewEnd }), [size, lanes, viewStart, viewEnd]);
  const pal = paletteFor(dark);
  const colorOf = useMemo(() => colorLookup(threads, dark), [threads, dark]);
  const eventsById = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  const LABEL_W = geom.labelW;
  const ia = useCanvasInteraction({ svgRef, viewStart, viewEnd, labelW: LABEL_W, onViewChange });

  const visible = useMemo(() => events.filter(ev => {
    if (!activeThreadIds.includes(ev.threadId)) return false;
    const x1 = geom.xFor(ms(ev.date));
    const x2 = geom.xFor(ms(ev.endDate ?? ev.date));
    return x2 >= LABEL_W && x1 <= size.w;
  }), [events, activeThreadIds, geom, size.w]);
  const { singles, clusters } = useMemo(() => clusterEvents(visible, geom.xFor), [visible, geom]);
  const placed = useMemo(() => {
    const minW = minLabelWeight(viewEnd - viewStart);
    const bottom = AXIS_H + lanes.length * geom.laneH - 8;
    return placeLabels(singles.filter(ev => ev.weight >= minW), { xFor: geom.xFor, yFor: geom.yFor, bottom });
  }, [singles, geom, lanes.length, viewStart, viewEnd]);

  const focusId = selectedId ?? hoveredId;
  const emphasis = useMemo(() => ({ focusId, related: relatedIds(focusId, links), query }), [focusId, links, query]);

  const csX = crossSection.fixed ? crossSection.x : localCsX;
  const csDate = csX > LABEL_W ? geom.tFor(csX) : null;
  const tracking = crossSection.enabled && !crossSection.fixed;

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    ia.onDragMove(e);
    if (!tracking) return;
    const x = ia.localX(e);
    setLocalCsX(x);
    onCrossSection(x);
  };
  const onClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (ia.wasDrag() || (e.target as Element).closest('.evt-hit')) return;
    if (crossSection.enabled) onCrossSection(ia.localX(e), true);
    else onSelect(null);
  };
  const handlers = {
    onSelect: (id: string) => onSelect(id === selectedId ? null : id),
    onHover,
    onViewChange,
    onCluster,
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <svg ref={svgRef} width={size.w} height={geom.svgH}
        className={`timeline-svg${ia.isDragging ? ' dragging' : ''}`}
        onPointerDown={ia.onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={ia.endDrag} onPointerCancel={ia.endDrag}
        onDoubleClick={ia.onDoubleClick} onClick={onClick}>
        <defs>
          <clipPath id="canvas-clip">
            <rect x={LABEL_W} y={0} width={size.w - LABEL_W} height={geom.svgH} />
          </clipPath>
        </defs>
        <Lanes geom={geom} pal={pal} dark={dark} />
        <Axis geom={geom} pal={pal} viewStart={viewStart} viewEnd={viewEnd} />
        <g clipPath="url(#canvas-clip)">
          <LinkLayer geom={geom} pal={pal} links={links} eventsById={eventsById} focusId={focusId} />
          <EventLayer geom={geom} pal={pal} singles={singles} clusters={clusters}
            colorOf={colorOf} emphasis={emphasis} handlers={handlers} />
          <LabelLayer pal={pal} placed={placed} eventsById={eventsById} emphasis={emphasis} />
          {crossSection.enabled && csX > LABEL_W && (
            <CrossSectionOverlay pal={pal} x={csX} date={csDate} fixed={crossSection.fixed} svgH={geom.svgH} />
          )}
        </g>
      </svg>
    </div>
  );
}
