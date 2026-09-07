import type { CanvasGeom } from './geometry';
import type { Link, TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { linkPath } from '../../lib/layout';
import { ms } from '../../lib/time';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  links: Link[];
  eventsById: Map<string, TimelineEvent>;
  focusId: string | null;
}

function pathFor(lk: Link, byId: Map<string, TimelineEvent>, geom: CanvasGeom): string | null {
  const a = byId.get(lk.from);
  const b = byId.get(lk.to);
  if (!a || !b) return null;
  const y1 = geom.yFor(a.threadId);
  const y2 = geom.yFor(b.threadId);
  if (y1 < 0 || y2 < 0) return null;
  return linkPath({ x: geom.xFor(ms(a.date)), y: y1 }, { x: geom.xFor(ms(b.date)), y: y2 }, a.threadId === b.threadId);
}

function linkOpacity(isHot: boolean, hasFocus: boolean): number {
  if (isHot) return 1;
  return hasFocus ? 0.18 : 0.4;
}

/** Causal links as bezier curves; the ones touching the focused event are highlighted. */
export default function LinkLayer({ geom, pal, links, eventsById, focusId }: Props) {
  return (
    <g>
      <defs>
        <marker id="arr-dim" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L6,3.5 z" fill={pal.ink} opacity={0.4} />
        </marker>
        <marker id="arr-hi" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L6,3.5 z" fill={pal.accent} />
        </marker>
      </defs>
      {links.map(lk => {
        const d = pathFor(lk, eventsById, geom);
        if (!d) return null;
        const isHot = focusId !== null && (lk.from === focusId || lk.to === focusId);
        return (
          <path key={`${lk.from}-${lk.to}`} d={d} fill="none"
            stroke={isHot ? pal.accent : pal.ink}
            strokeWidth={isHot ? 2 : 1}
            strokeDasharray={isHot ? undefined : '3 2'}
            markerEnd={isHot ? 'url(#arr-hi)' : 'url(#arr-dim)'}
            opacity={linkOpacity(isHot, focusId !== null)} />
        );
      })}
    </g>
  );
}
