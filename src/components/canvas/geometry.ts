import type { Thread } from '../../types';
import { AXIS_H, LABEL_W, LANE_H } from '../../lib/layout';

const COMPACT_LABEL_W = 56;
/** Narrow screens get a slim, vertical lane-label column. */
export function labelWidthFor(width: number): number {
  return width < 640 ? COMPACT_LABEL_W : LABEL_W;
}

/**
 * Everything a canvas layer needs to place things. All x values are screen pixels
 * (0 = left edge of the component); the pannable layer extends `slack` px beyond the
 * plot on both sides so that panning reveals content before the view is committed.
 */
export interface CanvasGeom {
  width: number;
  svgH: number;
  laneH: number;
  labelW: number;
  slack: number;
  /** Left / right screen x of the pre-rendered range. */
  renderL: number;
  renderR: number;
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
  const labelW = labelWidthFor(width);
  const plotW = Math.max(width - labelW, 1);
  const pxPerMs = plotW / (viewEnd - viewStart);
  // Lanes stretch to fill the viewport, never thinner than LANE_H.
  const laneH = Math.max(LANE_H, Math.floor((height - AXIS_H - 12) / Math.max(lanes.length, 1)));
  const totalH = AXIS_H + lanes.length * laneH;
  const laneIndex = new Map(lanes.map((t, i) => [t.id, i]));
  const slack = Math.round(plotW * 0.6);
  return {
    width,
    svgH: Math.max(totalH + 12, height),
    laneH,
    labelW,
    slack,
    renderL: labelW - slack,
    renderR: width + slack,
    lanes,
    xFor: t => labelW + (t - viewStart) * pxPerMs,
    tFor: x => viewStart + (x - labelW) / pxPerMs,
    yFor: threadId => {
      const i = laneIndex.get(threadId);
      return i === undefined ? -999 : AXIS_H + i * laneH + laneH / 2;
    },
  };
}
