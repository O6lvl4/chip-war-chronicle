import { memo } from 'react';
import type { TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { eventOpacity, type Emphasis } from '../../lib/layout';
import { eventRadius, ROW_H, textWidth, type Chip } from '../../lib/board';

export interface ChipHandlers {
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

interface Props {
  chips: Chip[];
  eventsById: Map<string, TimelineEvent>;
  pal: Palette;
  colorOf: (threadId: string) => string;
  emphasis: Emphasis;
  handlers: ChipHandlers;
}

const H = ROW_H - 6;

const strokeOf = (selected: boolean, pal: Palette, fallback: string) => ({
  stroke: selected ? pal.accent : fallback,
  strokeWidth: selected ? 2.5 : 1.25,
});

/** Where the title goes: inside a wide enough duration bar (white), else after the marker / bar (ink). */
function titlePlacement(ev: TimelineEvent, c: Chip): { x: number; fill: string } {
  const r = eventRadius(ev.weight);
  if (!isBar(ev, c, H)) return { x: c.x0 + 2 * r + 8, fill: 'var(--text)' };
  if (c.barEnd - c.x0 >= textWidth(ev.title) + 2 * r + 14) return { x: c.x0 + 2 * r + 8, fill: '#fff' };
  return { x: c.barEnd + 6, fill: 'var(--text)' };
}

/** A duration only reads as a bar once it is wider than it is tall; shorter ones fall back to a round marker. */
function isBar(ev: TimelineEvent, c: Chip, minW: number): boolean {
  return !!ev.endDate && c.barEnd - c.x0 > minW;
}

function Marker({ ev, c, col }: { ev: TimelineEvent; c: Chip; col: string }) {
  const r = eventRadius(ev.weight);
  if (isBar(ev, c, H)) return <rect x={c.x0} y={c.y - H / 2} width={c.barEnd - c.x0} height={H} rx={H / 2} fill={col} opacity={0.85} />;
  return <circle cx={c.x0 + r + 3} cy={c.y} r={r - 0.5} fill={col} />;
}

interface ChipProps {
  ev: TimelineEvent;
  c: Chip;
  pal: Palette;
  col: string;
  op: number;
  selected: boolean;
  handlers: ChipHandlers;
}

/** A point event with its title: a rounded "programme" block with the coloured marker at the left. */
function LabeledChip({ ev, c, pal, col, op, selected, handlers }: ChipProps) {
  const title = titlePlacement(ev, c);
  return (
    <g className="evt-hit chip" style={{ opacity: op }}
      onClick={e => { e.stopPropagation(); handlers.onSelect(ev.id); }}
      onMouseEnter={() => handlers.onHover(ev.id)} onMouseLeave={() => handlers.onHover(null)}>
      <rect x={c.x0} y={c.y - H / 2} width={c.x1 - c.x0} height={H} rx={H / 2} fill={pal.surface} {...strokeOf(selected, pal, col)} />
      <Marker ev={ev} c={c} col={col} />
      <text x={title.x} y={c.y + 4} fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={11}
        fontWeight={ev.weight === 3 ? 700 : 500} fill={title.fill}>
        {ev.title}
      </text>
    </g>
  );
}

/** A point event without room for a title: just the marker, with a native tooltip. */
function DotChip({ ev, c, pal, col, op, selected, handlers }: ChipProps) {
  const r = eventRadius(ev.weight);
  const stroke = strokeOf(selected, pal, pal.outline);
  const cx = ev.endDate ? c.x0 + r : c.x;
  return (
    <g className="evt-hit" style={{ opacity: op }}
      onClick={e => { e.stopPropagation(); handlers.onSelect(ev.id); }}
      onMouseEnter={() => handlers.onHover(ev.id)} onMouseLeave={() => handlers.onHover(null)}>
      <title>{`${ev.date}  ${ev.title}`}</title>
      {isBar(ev, c, 2 * r + 2)
        ? <rect x={c.x0} y={c.y - r} width={c.barEnd - c.x0} height={2 * r} rx={r} fill={col} {...stroke} />
        : <circle cx={cx} cy={c.y} r={r} fill={col} {...stroke} />}
    </g>
  );
}

/** All events of the rendered range as programme-guide chips. */
function ChipLayer({ chips, eventsById, pal, colorOf, emphasis, handlers }: Props) {
  return (
    <g>
      {chips.map(c => {
        const ev = eventsById.get(c.id);
        if (!ev) return null;
        const props = { ev, c, pal, handlers, col: colorOf(ev.threadId), op: eventOpacity(ev, emphasis), selected: ev.id === emphasis.focusId };
        return c.labeled ? <LabeledChip key={c.id} {...props} /> : <DotChip key={c.id} {...props} />;
      })}
    </g>
  );
}

export default memo(ChipLayer);
