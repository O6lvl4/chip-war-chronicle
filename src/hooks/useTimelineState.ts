import { useCallback, useMemo, useState } from 'react';
import type { CrossSectionState, TimelineEvent } from '../types';
import { ms } from '../lib/time';

export type DrawerMode = 'none' | 'event' | 'section' | 'sql';

interface Params {
  events: TimelineEvent[];
  threadIds: string[];
  dataStart: number;
  dataEnd: number;
}

const CS_OFF: CrossSectionState = { enabled: false, fixed: false, x: -1 };

/** All view/selection state of the timeline plus the actions that mutate it. */
export function useTimelineState({ events, threadIds, dataStart, dataEnd }: Params) {
  const [view, setView] = useState({ start: dataStart, end: dataEnd });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeThreadIds, setActiveThreadIds] = useState<string[]>(threadIds);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [crossSection, setCrossSection] = useState<CrossSectionState>(CS_OFF);
  const [sqlOpen, setSqlOpen] = useState(false);

  const setRange = useCallback((start: number, end: number) => setView({ start, end }), []);

  const sortedIds = useMemo(() => events
    .filter(ev => activeThreadIds.includes(ev.threadId))
    .sort((a, b) => ms(a.date) - ms(b.date))
    .map(e => e.id), [events, activeThreadIds]);

  const centerOn = useCallback((id: string) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const t = ms(ev.date);
    setView(v => {
      const span = v.end - v.start;
      return { start: t - span * 0.4, end: t + span * 0.6 };
    });
  }, [events]);

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    setSqlOpen(false);
    if (id) centerOn(id);
  }, [centerOn]);

  const step = useCallback((delta: -1 | 1) => {
    const idx = selectedId ? sortedIds.indexOf(selectedId) : -1;
    const next = Math.max(0, Math.min(sortedIds.length - 1, idx + delta));
    const nid = sortedIds[next];
    if (nid) select(nid);
  }, [selectedId, sortedIds, select]);

  const zoom = useCallback((factor: number) => setView(v => {
    const mid = (v.start + v.end) / 2;
    const half = ((v.end - v.start) / 2) * factor;
    return { start: mid - half, end: mid + half };
  }), []);

  const resetView = useCallback(() => setView({ start: dataStart, end: dataEnd }), [dataStart, dataEnd]);

  const toggleThread = useCallback((id: string) => setActiveThreadIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);

  const toggleCrossSection = useCallback(() => {
    setCrossSection(cs => ({ enabled: !cs.enabled, fixed: false, x: -1 }));
    setSqlOpen(false);
  }, []);

  const moveCrossSection = useCallback((x: number, toggle?: boolean) => {
    setCrossSection(cs => {
      if (!toggle) return { ...cs, x };
      return { enabled: cs.enabled, fixed: !cs.fixed, x: cs.fixed ? -1 : x };
    });
  }, []);

  const toggleSql = useCallback(() => {
    setSqlOpen(o => !o);
    setSelectedId(null);
    setCrossSection(cs => ({ ...cs, fixed: false, x: -1 }));
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedId(null);
    setSqlOpen(false);
    setCrossSection(cs => ({ ...cs, fixed: false, x: -1 }));
  }, []);

  const drawerMode = drawerModeOf({ selectedId, sqlOpen, cs: crossSection });

  return {
    view, setRange, selectedId, activeThreadIds, toggleThread,
    query, setQuery, dark, toggleDark: () => setDark(d => !d),
    crossSection, toggleCrossSection, moveCrossSection,
    sqlOpen, toggleSql, drawerMode, closeDrawer,
    select, step, zoom, resetView,
  };
}

interface DrawerInputs {
  selectedId: string | null;
  sqlOpen: boolean;
  cs: CrossSectionState;
}

function drawerModeOf({ selectedId, sqlOpen, cs }: DrawerInputs): DrawerMode {
  if (sqlOpen) return 'sql';
  if (selectedId) return 'event';
  if (cs.enabled && cs.fixed && cs.x > 0) return 'section';
  return 'none';
}

export type TimelineState = ReturnType<typeof useTimelineState>;
