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
  pxPerMs: number;
  renderL: number;
  renderR: number;
  xFor: (t: number) => number;
  tFor: (x: number) => number;
}

export function makeGeom(width: number, viewStart: number, viewEnd: number): CanvasGeom {
  const labelW = labelWidthFor(width);
  const plotW = Math.max(width - labelW, 1);
  // Integer span so a pure pan (same span, new start) keeps the exact same scale and layout.
  const pxPerMs = plotW / Math.max(1, Math.round(viewEnd - viewStart));
  // Pre-render 1.5 plot widths on each side so a fling never outruns the image while a commit is rendering.
  const slack = Math.round(plotW * (width < 640 ? 1.5 : 0.8));
  return {
    width,
    labelW,
    slack,
    pxPerMs,
    renderL: labelW - slack,
    renderR: width + slack,
    xFor: t => labelW + (t - viewStart) * pxPerMs,
    tFor: x => viewStart + (x - labelW) / pxPerMs,
  };
}
