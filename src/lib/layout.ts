import type { Link, TimelineEvent, Weight } from '../types';
import { DAY } from './time';

export const LABEL_W = 140;
export const AXIS_H = 44;

/** Weight threshold for labels: the wider the view, the fewer labels survive. */
export function minLabelWeight(spanMs: number): Weight {
  const years = spanMs / (365.25 * DAY);
  if (years > 5) return 3;
  if (years > 2) return 2;
  return 1;
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
  if (sameLane) return `M ${x1} ${y1} C ${x1} ${y1 - 30}, ${x2} ${y2 - 30}, ${x2} ${y2}`;
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

/** Opacity of an event given search and selection state. */
export function eventOpacity(ev: TimelineEvent, em: Emphasis): number {
  if (!matchesQuery(ev, em.query)) return 0.15;
  if (!em.focusId) return 1;
  if (ev.id === em.focusId || em.related.has(ev.id)) return 1;
  return 0.25;
}
