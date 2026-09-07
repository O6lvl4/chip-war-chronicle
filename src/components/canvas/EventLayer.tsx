import type { CanvasGeom } from './geometry';
import type { TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { eventOpacity, eventRadius, LABEL_W, type Cluster, type Emphasis } from '../../lib/layout';
import { DAY, ms } from '../../lib/time';

export interface EventHandlers {
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onViewChange: (s: number, e: number) => void;
}

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  singles: TimelineEvent[];
  clusters: Cluster[];
  colorOf: (threadId: string) => string;
  emphasis: Emphasis;
  handlers: EventHandlers;
}

function DurationBar({ ev, geom, pal, col, op, focused, handlers }: {
  ev: TimelineEvent; geom: CanvasGeom; pal: Palette; col: string; op: number; focused: boolean; handlers: EventHandlers;
}) {
  const x1 = Math.max(geom.xFor(ms(ev.date)), LABEL_W);
  const x2 = Math.min(geom.xFor(ms(ev.endDate ?? ev.date)), geom.width);
  const cy = geom.yFor(ev.threadId);
  const w = Math.max(x2 - x1, 6);
  return (
    <g className="evt-hit" style={{ opacity: op, cursor: 'pointer' }}
      onClick={e => { e.stopPropagation(); handlers.onSelect(ev.id); }}
      onMouseEnter={() => handlers.onHover(ev.id)} onMouseLeave={() => handlers.onHover(null)}>
      <rect x={x1 + 3} y={cy - 7} width={w} height={14} rx={7} fill={col} opacity={0.3} />
      <rect x={x1} y={cy - 7} width={w} height={14} rx={7} fill={col} opacity={0.85} />
      <rect x={x1} y={cy - 7} width={w} height={14} rx={7} fill="none"
        stroke={focused ? '#fff' : pal.outline} strokeWidth={focused ? 2 : 1.5} />
    </g>
  );
}

function ClusterPill({ cl, geom, pal, col, handlers }: {
  cl: Cluster; geom: CanvasGeom; pal: Palette; col: string; handlers: EventHandlers;
}) {
  const cy = geom.yFor(cl.threadId);
  const zoomIn = () => {
    const ts = cl.events.map(ev => ms(ev.date));
    handlers.onViewChange(Math.min(...ts) - 7 * DAY, Math.max(...ts) + 7 * DAY);
  };
  return (
    <g className="evt-hit cluster-pill" style={{ cursor: 'zoom-in' }}
      onClick={e => { e.stopPropagation(); zoomIn(); }}>
      <circle cx={cl.cx + 2.5} cy={cy + 2.5} r={12} fill={pal.shadow} />
      <circle cx={cl.cx} cy={cy} r={12} fill={pal.surface} />
      <circle cx={cl.cx} cy={cy} r={12} fill={col + '22'} stroke={col} strokeWidth={2} />
      <text x={cl.cx} y={cy + 4.5} textAnchor="middle" fontFamily="'Fredoka', sans-serif"
        fontSize={11} fontWeight={600} fill={col}>
        {cl.events.length}
      </text>
    </g>
  );
}

function PointMarker({ ev, geom, pal, col, op, focused, handlers }: {
  ev: TimelineEvent; geom: CanvasGeom; pal: Palette; col: string; op: number; focused: boolean; handlers: EventHandlers;
}) {
  const ex = geom.xFor(ms(ev.date));
  const ey = geom.yFor(ev.threadId);
  const r = eventRadius(ev.weight);
  return (
    <g className="evt-hit" style={{ opacity: op, cursor: 'pointer' }}
      onClick={e => { e.stopPropagation(); handlers.onSelect(ev.id); }}
      onMouseEnter={() => handlers.onHover(ev.id)} onMouseLeave={() => handlers.onHover(null)}>
      {focused && <circle cx={ex} cy={ey} r={r + 7} fill={col} opacity={0.18} stroke={col} strokeWidth={1.5} />}
      <circle cx={ex + 2.5} cy={ey + 2.5} r={r + 1.5} fill={pal.shadow} />
      <circle cx={ex} cy={ey} r={r + 2} fill={pal.surface} />
      <circle cx={ex} cy={ey} r={r} fill={col} />
      <circle cx={ex} cy={ey} r={r} fill="none" stroke={pal.outline} strokeWidth={focused ? 2 : 1.5} />
    </g>
  );
}

/** Period bars, cluster pills and point markers, in that z-order. */
export default function EventLayer({ geom, pal, singles, clusters, colorOf, emphasis, handlers }: Props) {
  const visible = singles.filter(ev => geom.yFor(ev.threadId) >= 0);
  const periods = visible.filter(ev => ev.endDate);
  const points = visible.filter(ev => !ev.endDate);
  const common = (ev: TimelineEvent) => ({
    ev, geom, pal, handlers,
    col: colorOf(ev.threadId),
    op: eventOpacity(ev, emphasis),
    focused: ev.id === emphasis.focusId,
  });
  return (
    <g>
      {periods.map(ev => <DurationBar key={ev.id} {...common(ev)} />)}
      {clusters.filter(cl => geom.yFor(cl.threadId) >= 0).map(cl => (
        <ClusterPill key={`cl-${cl.threadId}-${cl.events[0].id}`} cl={cl} geom={geom} pal={pal}
          col={colorOf(cl.threadId)} handlers={handlers} />
      ))}
      {points.map(ev => <PointMarker key={ev.id} {...common(ev)} />)}
    </g>
  );
}
