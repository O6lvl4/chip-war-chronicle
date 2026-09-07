/** Tiny on-device profiler, enabled with `?perf=1`; read by the PerfHud overlay. */
export interface PerfStats {
  blitMs: number;
  blitMax: number;
  paintMs: number;
  paintMax: number;
  paints: number;
  commits: number;
  commitMs: number;
  commitMax: number;
  scrolls: number;
  longFrames: number;
}

export const perf: PerfStats & { enabled: boolean } = {
  enabled: typeof location !== 'undefined' && /[?&]perf=1/.test(location.search),
  blitMs: 0, blitMax: 0, paintMs: 0, paintMax: 0, paints: 0, commits: 0, commitMs: 0, commitMax: 0, scrolls: 0, longFrames: 0,
};

/** Records how long a pan commit took from request to the new image being on screen. */
export function noteCommit(ms: number) {
  if (!perf.enabled) return;
  perf.commitMs = ms;
  perf.commitMax = Math.max(perf.commitMax, ms);
}

export function timed<T>(key: 'blit' | 'paint', fn: () => T): T {
  if (!perf.enabled) return fn();
  const t0 = performance.now();
  const out = fn();
  const dt = performance.now() - t0;
  if (key === 'blit') { perf.blitMs = dt; perf.blitMax = Math.max(perf.blitMax, dt); }
  else { perf.paintMs = dt; perf.paintMax = Math.max(perf.paintMax, dt); perf.paints++; }
  return out;
}

export function count(key: 'commits' | 'scrolls' | 'longFrames') {
  if (perf.enabled) perf[key]++;
}
