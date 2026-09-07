import type { TimelineEvent } from '../types';
import { EVENTS_SI } from './events-si';
import { EVENTS_PR } from './events-pr';
import { EVENTS_GP } from './events-gp';
import { EVENTS_AI } from './events-ai';
import { EVENTS_MM } from './events-mm';

export { THREADS } from './threads';
export { LINKS } from './links';

export const DATA_START = new Date('2018-01-01').getTime();
export const DATA_END = new Date('2026-12-31').getTime();

export const EVENTS: TimelineEvent[] = [
  ...EVENTS_SI, ...EVENTS_PR, ...EVENTS_GP, ...EVENTS_AI, ...EVENTS_MM,
];
