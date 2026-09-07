import type { Thread } from '../../types';
import { AXIS_H, LABEL_W, LANE_H } from '../../lib/layout';

/** Everything a canvas layer needs to place things: scales, sizes, lanes. */
export interface CanvasGeom {
  width: number;
  svgH: number;
  laneH: number;
  lanes: Thread[];
  xFor: (t: number) => number;
  tFor: (x: number) => number;
  yFor: (threadId: string) => number;
}

export interface GeomInput {
  width: number;
  height: number;
  lanes: Thread[];
  viewStart: number;
  viewEnd: number;
}

export function makeGeom({ width, height, lanes, viewStart, viewEnd }: GeomInput): CanvasGeom {
  const pxPerMs = (width - LABEL_W) / (viewEnd - viewStart);
  // Lanes stretch to fill the viewport, never thinner than LANE_H.
  const laneH = Math.max(LANE_H, Math.floor((height - AXIS_H - 12) / Math.max(lanes.length, 1)));
  const totalH = AXIS_H + lanes.length * laneH;
  const laneIndex = new Map(lanes.map((t, i) => [t.id, i]));
  return {
    width,
    svgH: Math.max(totalH + 12, height),
    laneH,
    lanes,
    xFor: t => LABEL_W + (t - viewStart) * pxPerMs,
    tFor: x => viewStart + (x - LABEL_W) / pxPerMs,
    yFor: threadId => {
      const i = laneIndex.get(threadId);
      return i === undefined ? -999 : AXIS_H + i * laneH + laneH / 2;
    },
  };
}
