import type { Thread } from '../types';

export interface Palette {
  ink: string;
  text: string;
  surface: string;
  accent: string;
  outline: string;
  shadow: string;
  subtle: string;
}

const LIGHT: Palette = {
  ink: '#1A1A2E',
  text: '#1A1A2E',
  surface: '#FFFFFF',
  accent: '#E4000F',
  outline: '#1A1A2E',
  shadow: 'rgba(26,26,46,0.3)',
  subtle: 'rgba(0,0,0,0.015)',
};

const DARK: Palette = {
  ink: 'rgba(240,238,248,0.5)',
  text: '#F0EEF8',
  surface: '#1E2036',
  accent: '#FF3B4E',
  outline: 'rgba(240,238,248,0.5)',
  shadow: 'rgba(0,0,0,0.45)',
  subtle: 'rgba(255,255,255,0.02)',
};

export function paletteFor(dark: boolean): Palette {
  return dark ? DARK : LIGHT;
}

export function threadColor(thread: Thread | undefined, dark: boolean): string {
  if (!thread) return '#888';
  return dark ? thread.darkColor : thread.color;
}

export function colorLookup(threads: Thread[], dark: boolean): (threadId: string) => string {
  const map = new Map(threads.map(t => [t.id, threadColor(t, dark)]));
  return (threadId: string) => map.get(threadId) ?? '#888';
}
