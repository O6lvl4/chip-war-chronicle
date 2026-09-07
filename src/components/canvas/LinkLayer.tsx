import { memo, useMemo } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { linkPath } from '../../lib/layout';
import { linkSegment, type Seg } from './LinkCanvas';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  links: Link[];
  eventsById: Map<string, TimelineEvent>;
  focusId: string | null;
}

interface Hot {
  lk: Link;
  s: Seg;
}

/** Only the links touching the focused event, drawn as crisp SVG on top of the canvas layer. */
function LinkLayer({ geom, pal, links, eventsById, focusId }: Props) {
  const hot = useMemo(() => {
    if (!focusId) return [] as Hot[];
    const out: Hot[] = [];
    for (const lk of links) {
      if (lk.from !== focusId && lk.to !== focusId) continue;
      const s = linkSegment(lk, eventsById, geom);
      if (s) out.push({ lk, s });
    }
    return out;
  }, [focusId, links, eventsById, geom]);
  if (hot.length === 0) return null;
  return (
    <g>
      <defs>
        <marker id="arr-hi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L6,3.5 z" fill={pal.accent} />
        </marker>
      </defs>
      {hot.map(({ lk, s }) => (
        <path key={`${lk.from}-${lk.to}`} fill="none" stroke={pal.accent} strokeWidth={2} markerEnd="url(#arr-hi)"
          d={linkPath({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }, s.sameLane)} />
      ))}
    </g>
  );
}

export default memo(LinkLayer);
