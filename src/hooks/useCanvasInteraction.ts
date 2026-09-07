import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import { LABEL_W } from '../lib/layout';
import { DAY } from '../lib/time';

interface Params {
  svgRef: RefObject<SVGSVGElement | null>;
  viewStart: number;
  viewEnd: number;
  pxPerMs: number;
  onViewChange: (s: number, e: number) => void;
}

const ZOOM_STEP = 1.18;
const MIN_SPAN = 14 * DAY;

function zoomAround(t: number, start: number, end: number, factor: number): [number, number] {
  const ns = t - (t - start) * factor;
  const ne = t + (end - t) * factor;
  if (ne - ns < MIN_SPAN) return [t - MIN_SPAN / 2, t + MIN_SPAN / 2];
  return [ns, ne];
}

/** Wheel zoom (non-passive) and drag-to-pan for the timeline SVG. */
export function useCanvasInteraction({ svgRef, viewStart, viewEnd, pxPerMs, onViewChange }: Params) {
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ sx: number; start: number; end: number } | null>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const mx = e.clientX - el.getBoundingClientRect().left;
      if (mx < LABEL_W) return;
      const factor = e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      const t = viewStart + (mx - LABEL_W) / pxPerMs;
      onViewChange(...zoomAround(t, viewStart, viewEnd, factor));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [svgRef, viewStart, viewEnd, pxPerMs, onViewChange]);

  const localX = (e: ReactMouseEvent<SVGSVGElement>) => e.clientX - (svgRef.current?.getBoundingClientRect().left ?? 0);

  const onMouseDown = (e: ReactMouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('.evt-hit')) return;
    drag.current = { sx: e.clientX, start: viewStart, end: viewEnd };
    setIsDragging(true);
  };
  const onDragMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dt = (e.clientX - drag.current.sx) / pxPerMs;
    onViewChange(drag.current.start - dt, drag.current.end - dt);
  };
  const endDrag = () => { drag.current = null; setIsDragging(false); };
  const onDoubleClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    const mx = localX(e);
    if (mx < LABEL_W) return;
    const t = viewStart + (mx - LABEL_W) / pxPerMs;
    const span = (viewEnd - viewStart) / 3;
    onViewChange(t - span, t + span);
  };

  return { isDragging, localX, onMouseDown, onDragMove, endDrag, onDoubleClick };
}
