import { LABEL_W } from '../../lib/layout';

const COMPACT_LABEL_W = 56;
/** Narrow screens get a slim, vertical lane-label column. */
export function labelWidthFor(width: number): number {
  return width < 640 ? COMPACT_LABEL_W : LABEL_W;
}

/**
 * Horizontal geometry. All x values are screen pixels (0 = left edge of the component);
 * the pannable layer extends `slack` px beyond the plot on both sides so that panning
 * reveals content before the view is committed. Vertical placement comes from the Board.
 */
export interface CanvasGeom {
  width: number;
  labelW: number;
  slack: number;
  renderL: number;
  renderR: number;
  xFor: (t: number) => number;
  tFor: (x: number) => number;
}

export function makeGeom(width: number, viewStart: number, viewEnd: number): CanvasGeom {
  const labelW = labelWidthFor(width);
  const plotW = Math.max(width - labelW, 1);
  const pxPerMs = plotW / (viewEnd - viewStart);
  const slack = Math.round(plotW * 0.6);
  return {
    width,
    labelW,
    slack,
    renderL: labelW - slack,
    renderR: width + slack,
    xFor: t => labelW + (t - viewStart) * pxPerMs,
    tFor: x => viewStart + (x - labelW) / pxPerMs,
  };
}
