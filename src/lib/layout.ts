import type { Link, TimelineEvent, Weight } from '../types';
import { ms } from './time';

export const LABEL_W = 140;
export const AXIS_H = 44;
export const LANE_H = 90;
export const CLUSTER_PX = 14;

const RADIUS: Record<Weight, number> = { 1: 5, 2: 7, 3: 9 };
export function eventRadius(w: Weight): number {
  return RADIUS[w];
}

export type XScale = (t: number) => number;

export interface Cluster {
  events: TimelineEvent[];
  cx: number;
  threadId: string;
}

function groupByLane(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const byLane = new Map<string, TimelineEvent[]>();
  for (const ev of events) {
    const arr = byLane.get(ev.threadId) ?? [];
    arr.push(ev);
    byLane.set(ev.threadId, arr);
  }
  return byLane;
}

/** Point events closer than CLUSTER_PX in one lane collapse into a cluster; periods never cluster. */
function clusterLane(lane: TimelineEvent[], threadId: string, xFor: XScale, out: { singles: TimelineEvent[]; clusters: Cluster[] }) {
  const sorted = [...lane].sort((a, b) => ms(a.date) - ms(b.date));
  const used = new Set<string>();
  for (const ev of sorted) {
    if (used.has(ev.id)) continue;
    const ex = xFor(ms(ev.date));
    const near = sorted.filter(o => !used.has(o.id) && !o.endDate && Math.abs(xFor(ms(o.date)) - ex) < CLUSTER_PX);
    if (near.length > 1 && !ev.endDate) {
      near.forEach(n => used.add(n.id));
      const cx = near.reduce((s, n) => s + xFor(ms(n.date)), 0) / near.length;
      out.clusters.push({ events: near, cx, threadId });
    } else {
      used.add(ev.id);
      out.singles.push(ev);
    }
  }
}

export function clusterEvents(events: TimelineEvent[], xFor: XScale): { singles: TimelineEvent[]; clusters: Cluster[] } {
  const out = { singles: [] as TimelineEvent[], clusters: [] as Cluster[] };
  groupByLane(events).forEach((lane, threadId) => clusterLane(lane, threadId, xFor, out));
  return out;
}

export interface PlacedLabel {
  id: string;
  x: number;
  bx: number;
  by: number;
  bw: number;
}

const CHAR_W = 7;
const ROW_OFFSETS = [0, -22, 22, -44, 44];

function overlaps(placed: PlacedLabel[], lx: number, lw: number, by: number): boolean {
  return placed.some(p => p.bx < lx + lw + 3 && p.bx + p.bw > lx - 3 && Math.abs(p.by - by) < 15);
}

/** Greedy label placement: right of the marker first, then alternate rows above/below. */
export interface Scales {
  xFor: XScale;
  yFor: (threadId: string) => number;
}

export function placeLabels(singles: TimelineEvent[], { xFor, yFor }: Scales, laneCount: number): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  const top = AXIS_H + 8;
  const bottom = AXIS_H + laneCount * LANE_H - 8;
  const sorted = [...singles].sort((a, b) => ms(a.date) - ms(b.date));
  for (const ev of sorted) {
    const ey = yFor(ev.threadId);
    if (ey < 0) continue;
    const ex = xFor(ms(ev.date));
    const lw = ev.title.length * CHAR_W;
    const lx = ex + eventRadius(ev.weight) + 6;
    const row = ROW_OFFSETS.find(off => {
      const by = ey + off;
      return by >= top && by <= bottom && !overlaps(placed, lx, lw, by);
    });
    if (row !== undefined) placed.push({ id: ev.id, x: ex, bx: lx, by: ey + row, bw: lw });
  }
  return placed;
}

export function relatedIds(focusId: string | null, links: Link[]): Set<string> {
  const rel = new Set<string>();
  if (!focusId) return rel;
  for (const lk of links) {
    if (lk.from === focusId || lk.to === focusId) {
      rel.add(lk.from);
      rel.add(lk.to);
    }
  }
  return rel;
}

export interface Pt {
  x: number;
  y: number;
}

export function linkPath({ x: x1, y: y1 }: Pt, { x: x2, y: y2 }: Pt, sameLane: boolean): string {
  if (sameLane) return `M ${x1} ${y1} C ${x1} ${y1 - 38}, ${x2} ${y2 - 38}, ${x2} ${y2}`;
  const cx1 = x1 + (x2 - x1) * 0.42;
  const cx2 = x2 - (x2 - x1) * 0.42;
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

export interface Emphasis {
  focusId: string | null;
  related: Set<string>;
  query: string;
}

export function matchesQuery(ev: TimelineEvent, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return ev.title.toLowerCase().includes(q) || ev.body.toLowerCase().includes(q);
}

/** Opacity of an event given search and focus state. */
export function eventOpacity(ev: TimelineEvent, em: Emphasis): number {
  if (!matchesQuery(ev, em.query)) return 0.15;
  if (!em.focusId) return 1;
  if (ev.id === em.focusId || em.related.has(ev.id)) return 1;
  return 0.22;
}
