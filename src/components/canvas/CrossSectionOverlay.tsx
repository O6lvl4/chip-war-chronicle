import type { Palette } from '../../lib/palette';
import { AXIS_H } from '../../lib/layout';
import { fmtDate } from '../../lib/time';

interface Props {
  pal: Palette;
  x: number;
  date: number | null;
  fixed: boolean;
  svgH: number;
}

/** The vertical cross-section rule with its date badge. */
export default function CrossSectionOverlay({ pal, x, date, fixed, svgH }: Props) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <line x1={x} y1={0} x2={x} y2={svgH} stroke={pal.accent} strokeWidth={2} strokeDasharray="6 4" opacity={0.9} />
      {date !== null && (
        <>
          <rect x={x + 4} y={4} width={74} height={18} rx={5} fill={pal.accent} stroke={pal.outline} strokeWidth={1} />
          <text x={x + 41} y={16.5} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize={9}
            fill="#fff" letterSpacing={0.3}>
            {fmtDate(date)}
          </text>
        </>
      )}
      {fixed && <circle cx={x} cy={AXIS_H} r={5} fill={pal.accent} stroke={pal.surface} strokeWidth={2} />}
    </g>
  );
}
