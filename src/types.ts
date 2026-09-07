export type Weight = 1 | 2 | 3;

export type SourceTier = 'primary' | 'secondary';

export interface Thread {
  id: string;
  name: string;
  en: string;
  color: string;
  darkColor: string;
}

export interface TimelineEvent {
  id: string;
  threadId: string;
  date: string;       // ISO date string (UTC)
  endDate?: string;
  weight: Weight;
  title: string;
  body: string;
  source: string;     // short label of the source
  sourceUrl?: string; // verified URL, as close to primary as possible
  sourceTier?: SourceTier;
}

export interface Link {
  from: string;
  to: string;
  why: string;
}

export interface CrossSectionState {
  enabled: boolean;
  fixed: boolean;
  x: number;
}
