import { useMemo } from 'react';
import type { CanvasGeom } from './geometry';
import type { Palette } from '../../lib/palette';
import { AXIS_H } from '../../lib/layout';
import { formatTick, generateTicks } from '../../lib/time';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  viewStart: number;
  viewEnd: number;
}

/** Time axis: tick lines, tick labels, the TODAY marker and the corner label. */
export default function Axis({ geom, pal, viewStart, viewEnd }: Props) {
  const { ticks, unit } = useMemo(() => generateTicks(viewStart, viewEnd), [viewStart, viewEnd]);
  const { xFor, width, svgH, labelW: LABEL_W } = geom;
  const todayX = xFor(Date.now());
  const todayVisible = todayX >= LABEL_W && todayX <= width;
  return (
    <>
      <rect x={0} y={0} width={width} height={AXIS_H} fill={pal.surface} />
      <line x1={0} y1={AXIS_H} x2={width} y2={AXIS_H} stroke={pal.outline} strokeWidth={2} />
      <g clipPath="url(#canvas-clip)">
        {ticks.map(t => {
          const tx = xFor(t);
          return (
            <g key={t}>
              <line x1={tx} y1={AXIS_H} x2={tx} y2={svgH} stroke={pal.ink} strokeWidth={0.5} opacity={0.08} />
              <text x={tx + 5} y={AXIS_H - 12} fontFamily="'Fredoka', sans-serif" fontSize={11} fontWeight={500}
                fill="var(--text-sub)">
                {formatTick(t, unit)}
              </text>
            </g>
          );
        })}
        {todayVisible && (
          <g>
            <line x1={todayX} y1={0} x2={todayX} y2={svgH} stroke={pal.accent}
              strokeWidth={1.5} strokeDasharray="5 3.5" opacity={0.8} />
            <rect x={todayX + 3} y={4} width={38} height={16} rx={4} fill={pal.accent} />
            <text x={todayX + 22} y={15.5} textAnchor="middle" fontFamily="'DM Mono', monospace"
              fontSize={8.5} fontWeight={500} fill="#fff" letterSpacing={0.5}>
              TODAY
            </text>
          </g>
        )}
      </g>
      <rect x={0} y={0} width={LABEL_W} height={AXIS_H} fill={pal.surface} />
      <text x={LABEL_W / 2} y={AXIS_H / 2 + 5} textAnchor="middle" fontFamily="'DM Mono', monospace"
        fontSize={9.5} letterSpacing={1.5} fill="var(--text-sub)" opacity={0.7}>
        {LABEL_W < 100 ? '' : 'TIMELINE'}
      </text>
    </>
  );
}
