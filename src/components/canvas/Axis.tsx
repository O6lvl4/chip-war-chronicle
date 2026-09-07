import { memo, useMemo } from 'react';
import type { CanvasGeom } from './geometry';
import type { Palette } from '../../lib/palette';
import { AXIS_H } from '../../lib/layout';
import { formatTick, generateTicks } from '../../lib/time';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
}

/** Static part of the axis: background strip, base line, corner label. Never moves while panning. */
export const AxisFrame = memo(function AxisFrame({ geom, pal }: Props) {
  const { width, labelW } = geom;
  return (
    <>
      <rect x={0} y={0} width={width} height={AXIS_H} fill={pal.surface} />
      <line x1={0} y1={AXIS_H} x2={width} y2={AXIS_H} stroke={pal.outline} strokeWidth={2} />
      <rect x={0} y={0} width={labelW} height={AXIS_H} fill={pal.surface} />
      <text x={labelW / 2} y={AXIS_H / 2 + 5} textAnchor="middle" fontFamily="'DM Mono', monospace"
        fontSize={9.5} letterSpacing={1.5} fill="var(--text-sub)" opacity={0.7}>
        {labelW < 100 ? '' : 'TIMELINE'}
      </text>
    </>
  );
});

interface TickProps extends Props {
  viewStart: number;
  viewEnd: number;
}

/** Tick lines, tick labels and the TODAY marker; lives inside the pannable group. */
export const AxisTicks = memo(function AxisTicks({ geom, pal, viewStart, viewEnd }: TickProps) {
  // Ticks are generated one viewport wider on each side so panning reveals them before the commit.
  const span = viewEnd - viewStart;
  const { ticks, unit } = useMemo(() => generateTicks(viewStart - span, viewEnd + span), [viewStart, viewEnd, span]);
  const { xFor, svgH, renderL, renderR } = geom;
  const todayX = xFor(Date.now());
  const todayVisible = todayX >= renderL && todayX <= renderR;
  return (
    <g>
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
  );
});
