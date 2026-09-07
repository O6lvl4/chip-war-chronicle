import { memo, useMemo } from 'react';
import type { CanvasGeom } from './geometry';
import type { Palette } from '../../lib/palette';
import { AXIS_H } from '../../lib/layout';
import { formatTick, generateTicks } from '../../lib/time';

interface FrameProps {
  geom: CanvasGeom;
  pal: Palette;
}

/** Static part of the axis row: background strip, base line, corner label. */
export const AxisFrame = memo(function AxisFrame({ geom, pal }: FrameProps) {
  const { width, labelW } = geom;
  return (
    <>
      <rect x={0} y={0} width={width} height={AXIS_H} fill={pal.surface} />
      <line x1={0} y1={AXIS_H - 1} x2={width} y2={AXIS_H - 1} stroke={pal.outline} strokeWidth={2} />
      <rect x={0} y={0} width={labelW} height={AXIS_H} fill={pal.surface} />
      <text x={labelW / 2} y={AXIS_H / 2 + 5} textAnchor="middle" fontFamily="'DM Mono', monospace"
        fontSize={9.5} letterSpacing={1.5} fill="var(--text-sub)" opacity={0.7}>
        {labelW < 100 ? '' : 'TIMELINE'}
      </text>
    </>
  );
});

/** Tick positions for the rendered range (one slack on each side). */
export function useTicks(viewStart: number, viewEnd: number) {
  const span = viewEnd - viewStart;
  return useMemo(() => generateTicks(viewStart - span, viewEnd + span), [viewStart, viewEnd, span]);
}

interface TickProps extends FrameProps {
  viewStart: number;
  viewEnd: number;
}

/** Tick labels in the axis row plus the TODAY badge; lives inside the axis pan layer. */
export const AxisTicks = memo(function AxisTicks({ geom, pal, viewStart, viewEnd }: TickProps) {
  const { ticks, unit } = useTicks(viewStart, viewEnd);
  const { xFor, renderL, renderR } = geom;
  const todayX = xFor(Date.now());
  return (
    <g>
      {ticks.map(t => {
        const tx = xFor(t);
        return (
          <g key={t}>
            <line x1={tx} y1={AXIS_H - 8} x2={tx} y2={AXIS_H} stroke={pal.ink} strokeWidth={1} opacity={0.35} />
            <text x={tx + 5} y={AXIS_H - 12} fontFamily="'Fredoka', sans-serif" fontSize={11} fontWeight={500} fill="var(--text-sub)">
              {formatTick(t, unit)}
            </text>
          </g>
        );
      })}
      {todayX >= renderL && todayX <= renderR && (
        <g>
          <rect x={todayX + 3} y={4} width={38} height={16} rx={4} fill={pal.accent} />
          <text x={todayX + 22} y={15.5} textAnchor="middle" fontFamily="'DM Mono', monospace" fontSize={8.5} fontWeight={500} fill="#fff" letterSpacing={0.5}>
            TODAY
          </text>
        </g>
      )}
    </g>
  );
});

interface GridProps extends TickProps {
  height: number;
}

/** Vertical gridlines and the TODAY rule across the board; lives inside the body pan layer. */
export const GridLines = memo(function GridLines({ geom, pal, viewStart, viewEnd, height }: GridProps) {
  const { ticks } = useTicks(viewStart, viewEnd);
  const { xFor, renderL, renderR } = geom;
  const todayX = xFor(Date.now());
  return (
    <g>
      {ticks.map(t => {
        const tx = xFor(t);
        return <line key={t} x1={tx} y1={0} x2={tx} y2={height} stroke={pal.ink} strokeWidth={0.5} opacity={0.08} />;
      })}
      {todayX >= renderL && todayX <= renderR && (
        <line x1={todayX} y1={0} x2={todayX} y2={height} stroke={pal.accent} strokeWidth={1.5} strokeDasharray="5 3.5" opacity={0.8} />
      )}
    </g>
  );
});
