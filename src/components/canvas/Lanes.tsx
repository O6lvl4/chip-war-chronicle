import { memo } from 'react';
import type { Thread } from '../../types';
import type { Board } from '../../lib/board';
import type { Palette } from '../../lib/palette';
import { threadColor } from '../../lib/palette';

interface Props {
  threads: Thread[];
  board: Board;
  width: number;
  labelW: number;
  pal: Palette;
  dark: boolean;
}

interface LabelProps {
  t: Thread;
  top: number;
  height: number;
  labelW: number;
  dark: boolean;
}

function LaneLabel({ t, top, height, labelW, dark }: LabelProps) {
  const col = threadColor(t, dark);
  const cy = top + height / 2;
  if (labelW < 100) {
    return (
      <text x={labelW / 2 + 4} y={cy} textAnchor="middle" writingMode="tb"
        fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={11} fontWeight={700} fill={col}>
        {t.name}
      </text>
    );
  }
  return (
    <>
      <rect x={8} y={cy - 20} width={labelW - 16} height={38} rx={8} fill={col + '12'} />
      <text x={labelW / 2 + 2} y={cy - 4} textAnchor="middle"
        fontFamily="'M PLUS Rounded 1c', sans-serif" fontSize={12} fontWeight={700} fill={col}>
        {t.name}
      </text>
      <text x={labelW / 2 + 2} y={cy + 12} textAnchor="middle"
        fontFamily="'DM Mono', monospace" fontSize={8.5} letterSpacing={1.2} fill={col} opacity={0.7}>
        {t.en}
      </text>
    </>
  );
}

/** Lane backgrounds, dividers and the left-hand lane labels; heights come from the board layout. */
function Lanes({ threads, board, width, labelW, pal, dark }: Props) {
  const tint = dark ? '08' : '06';
  const byId = new Map(threads.map(t => [t.id, t]));
  return (
    <g>
      {board.lanes.map((box, i) => {
        const t = byId.get(box.id);
        if (!t) return null;
        return (
          <g key={box.id}>
            <rect x={0} y={box.top} width={width} height={box.height} fill={i % 2 === 0 ? pal.subtle : threadColor(t, dark) + tint} />
            <line x1={0} y1={box.top} x2={width} y2={box.top} stroke={pal.ink} strokeWidth={0.5} opacity={0.1} />
          </g>
        );
      })}
      <line x1={0} y1={board.totalH - 0.5} x2={width} y2={board.totalH - 0.5} stroke={pal.ink} strokeWidth={0.5} opacity={0.12} />
      <rect x={0} y={0} width={labelW} height={board.totalH} fill={pal.surface} />
      <line x1={labelW} y1={0} x2={labelW} y2={board.totalH} stroke={pal.outline} strokeWidth={2} />
      {board.lanes.map(box => {
        const t = byId.get(box.id);
        if (!t) return null;
        return (
          <g key={box.id}>
            <rect x={0} y={box.top + 4} width={4} height={box.height - 8} fill={threadColor(t, dark)} rx={2} />
            <LaneLabel t={t} top={box.top} height={box.height} labelW={labelW} dark={dark} />
          </g>
        );
      })}
    </g>
  );
}

export default memo(Lanes);
