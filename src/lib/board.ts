import type { Thread, TimelineEvent, Weight } from '../types';
import { ms } from './time';

/** Programme-guide style layout: each lane packs its events into as many rows as needed so nothing overlaps. */

export const ROW_H = 26;
export const LANE_PAD = 7;
export const MAX_ROWS = 8;
const GAP = 6;

const RADIUS: Record<Weight, number> = { 1: 4, 2: 5.5, 3: 7 };
export function eventRadius(w: Weight): number {
  return RADIUS[w];
}

export type Measure = (s: string) => number;

/** Fallback text width at 11px when no canvas is available: CJK glyphs are square, Latin about half. */
export function textWidth(s: string): number {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0x2e80 ? 11 : 6.3;
  return w;
}

export interface Chip {
  id: string;
  x: number;        // marker centre (start date)
  x0: number;       // left edge of the occupied extent
  x1: number;       // right edge of the occupied extent (label included)
  barEnd: number;   // right edge of the duration bar (= x for point events)
  y: number;        // row centre
  labeled: boolean;
}

export interface LaneBox {
  id: string;
  top: number;
  height: number;
  rows: number;
}

export interface Board {
  lanes: LaneBox[];
  totalH: number;
  chips: Map<string, Chip>;
}

interface Extent {
  x0: number;
  x1: number;
  barEnd: number;
}

interface LaneCtx {
  xFor: (t: number) => number;
  measure: Measure;
  minWeight: Weight;
}

function extentOf(ev: TimelineEvent, lc: LaneCtx, labeled: boolean): Extent {
  const r = eventRadius(ev.weight);
  const x = lc.xFor(ms(ev.date));
  const barEnd = ev.endDate ? Math.max(lc.xFor(ms(ev.endDate)), x + 2 * r) : x;
  const x0 = ev.endDate ? x : x - r;
  const labelW = labeled ? lc.measure(ev.title) + 2 * r + 14 : 0;
  const x1 = Math.max(barEnd + (ev.endDate ? 0 : r), x0 + labelW);
  return { x0, x1, barEnd };
}

function firstFreeRow(rowEnds: number[], x0: number): number {
  return rowEnds.findIndex(end => end + GAP <= x0);
}

function leastLoadedRow(rowEnds: number[]): number {
  let best = 0;
  for (let i = 1; i < rowEnds.length; i++) if (rowEnds[i] < rowEnds[best]) best = i;
  return best;
}

/** Packs one lane's events into rows (greedy by start x). Labels are dropped when a lane is out of rows. */
function layoutLane(events: TimelineEvent[], lc: LaneCtx, top: number): { chips: Chip[]; rows: number } {
  const sorted = [...events].sort((a, b) => ms(a.date) - ms(b.date));
  const rowEnds: number[] = [];
  const chips: Chip[] = [];
  for (const ev of sorted) {
    let labeled = ev.weight >= lc.minWeight;
    let ext = extentOf(ev, lc, labeled);
    let row = firstFreeRow(rowEnds, ext.x0);
    if (row < 0 && rowEnds.length < MAX_ROWS) { rowEnds.push(-Infinity); row = rowEnds.length - 1; }
    if (row < 0 && labeled) { labeled = false; ext = extentOf(ev, lc, false); row = firstFreeRow(rowEnds, ext.x0); }
    if (row < 0) row = leastLoadedRow(rowEnds);
    rowEnds[row] = Math.max(rowEnds[row], ext.x1);
    chips.push({ id: ev.id, x: lc.xFor(ms(ev.date)), x0: ext.x0, x1: ext.x1, barEnd: ext.barEnd, y: top + LANE_PAD + row * ROW_H + ROW_H / 2, labeled });
  }
  return { chips, rows: Math.max(rowEnds.length, 1) };
}

export interface BoardInput {
  lanes: Thread[];
  events: TimelineEvent[];
  xFor: (t: number) => number;
  minWeight: Weight;
  /** Title width in px at the chip font; defaults to the CJK/Latin estimate. */
  measure?: Measure;
}

export function buildBoard({ lanes, events, xFor, minWeight, measure = textWidth }: BoardInput): Board {
  const lc: LaneCtx = { xFor, measure, minWeight };
  const byLane = new Map<string, TimelineEvent[]>();
  for (const ev of events) (byLane.get(ev.threadId) ?? byLane.set(ev.threadId, []).get(ev.threadId)!).push(ev);
  const boxes: LaneBox[] = [];
  const chips = new Map<string, Chip>();
  let top = 0;
  for (const lane of lanes) {
    const { chips: laneChips, rows } = layoutLane(byLane.get(lane.id) ?? [], lc, top);
    for (const c of laneChips) chips.set(c.id, c);
    const height = LANE_PAD * 2 + rows * ROW_H;
    boxes.push({ id: lane.id, top, height, rows });
    top += height;
  }
  return { lanes: boxes, totalH: top, chips };
}

/** The same layout shifted horizontally (a pan never changes rows). */
export function translateBoard(b: Board, dx: number): Board {
  const chips = new Map<string, Chip>();
  for (const [id, c] of b.chips) chips.set(id, { ...c, x: c.x + dx, x0: c.x0 + dx, x1: c.x1 + dx, barEnd: c.barEnd + dx });
  return { lanes: b.lanes, totalH: b.totalH, chips };
}
