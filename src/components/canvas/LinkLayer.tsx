import { memo, useMemo } from 'react';
import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import type { Board } from '../../lib/board';
import { linkPath } from '../../lib/layout';
import { linkSegment, outsideWindow, type Seg, type VWindow } from './LinkCanvas';

interface Props {
  geom: CanvasGeom;
  board: Board;
  pal: Palette;
  links: Link[];
  eventsById: Map<string, TimelineEvent>;
  focusId: string | null;
  win: VWindow;
}

interface Hot {
  lk: Link;
  s: Seg;
}

/** Only the links touching the focused (selected or hovered) event, drawn as crisp SVG on top. */
function LinkLayer({ geom, board, pal, links, eventsById, focusId, win }: Props) {
  const hot = useMemo(() => {
    const out: Hot[] = [];
    if (!focusId) return out;
    for (const lk of links) {
      if (lk.from !== focusId && lk.to !== focusId) continue;
      const s = linkSegment(lk, eventsById, board, geom);
      if (s && !outsideWindow(s, win)) out.push({ lk, s });
    }
    return out;
  }, [focusId, links, eventsById, board, geom, win]);
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
