import { memo } from 'react';
import type { TimelineEvent } from '../../types';
import type { Palette } from '../../lib/palette';
import { eventOpacity, type Emphasis, type PlacedLabel } from '../../lib/layout';

interface Props {
  pal: Palette;
  placed: PlacedLabel[];
  eventsById: Map<string, TimelineEvent>;
  emphasis: Emphasis;
}

/** Event titles with a surface-coloured halo so they stay legible over links. */
function LabelLayer({ pal, placed, eventsById, emphasis }: Props) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      {placed.map(pl => {
        const ev = eventsById.get(pl.id);
        if (!ev) return null;
        return (
          <text key={`lbl-${pl.id}`} x={pl.bx} y={pl.by + 4.5}
            fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={11} fontWeight={500}
            fill="var(--text)"
            style={{ paintOrder: 'stroke', stroke: pal.surface, strokeWidth: 3.5, strokeLinejoin: 'round', opacity: eventOpacity(ev, emphasis) }}>
            {ev.title}
          </text>
        );
      })}
    </g>
  );
}

export default memo(LabelLayer);
