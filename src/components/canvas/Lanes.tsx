import type { CanvasGeom } from './geometry';
import type { Palette } from '../../lib/palette';
import { threadColor } from '../../lib/palette';
import { AXIS_H } from '../../lib/layout';

interface Props {
  geom: CanvasGeom;
  pal: Palette;
  dark: boolean;
}

/** Lane backgrounds, dividers and the left-hand lane labels. */
export default function Lanes({ geom, pal, dark }: Props) {
  const { lanes, width, svgH, laneH: LANE_H, labelW: LABEL_W } = geom;
  const compact = LABEL_W < 100;
  const tint = dark ? '08' : '06';
  const bottomY = AXIS_H + lanes.length * LANE_H;
  return (
    <g>
      {lanes.map((t, i) => {
        const col = threadColor(t, dark);
        const y = AXIS_H + i * LANE_H;
        const fill = i % 2 === 0 ? pal.subtle : col + tint;
        return <rect key={t.id} x={0} y={y} width={width} height={LANE_H} fill={fill} />;
      })}
      {lanes.map((t, i) => (
        <line key={t.id} x1={0} y1={AXIS_H + i * LANE_H} x2={width} y2={AXIS_H + i * LANE_H}
          stroke={pal.ink} strokeWidth={0.5} opacity={0.1} />
      ))}
      <line x1={0} y1={bottomY} x2={width} y2={bottomY} stroke={pal.ink} strokeWidth={0.5} opacity={0.12} />

      <rect x={0} y={AXIS_H} width={LABEL_W} height={svgH} fill={pal.surface} />
      <line x1={LABEL_W} y1={0} x2={LABEL_W} y2={svgH} stroke={pal.outline} strokeWidth={2} />

      {lanes.map((t, i) => {
        const col = threadColor(t, dark);
        const cy = AXIS_H + i * LANE_H + LANE_H / 2;
        return (
          <g key={t.id}>
            <rect x={0} y={AXIS_H + i * LANE_H + 4} width={4} height={LANE_H - 8} fill={col} rx={2} />
            {compact ? (
              <text x={LABEL_W / 2 + 4} y={cy} textAnchor="middle" writingMode="tb"
                fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={11} fontWeight={700} fill={col}>
                {t.name}
              </text>
            ) : (
              <>
                <rect x={8} y={cy - 20} width={LABEL_W - 16} height={38} rx={8} fill={col + '12'} />
                <text x={LABEL_W / 2 + 2} y={cy - 4} textAnchor="middle"
                  fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={12} fontWeight={700} fill={col}>
                  {t.name}
                </text>
                <text x={LABEL_W / 2 + 2} y={cy + 12} textAnchor="middle"
                  fontFamily="'DM Mono', monospace" fontSize={8.5} letterSpacing={1.2} fill={col} opacity={0.7}>
                  {t.en}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
