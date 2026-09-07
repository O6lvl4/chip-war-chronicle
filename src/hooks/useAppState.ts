import { useCallback, useMemo, useState } from 'react';
import type { TimelineEvent } from '../types';
import type { ViewInfo } from '../board/Board';
import { readUrl } from '../lib/urlState';

export type DrawerMode = 'none' | 'event' | 'sql';

interface Params {
  events: TimelineEvent[];
  threadIds: string[];
}

/** Everything the shell needs: selection, lanes, search, theme, drawer, and the board's last reported view. */
export function useAppState({ events, threadIds }: Params) {
  const [url] = useState(readUrl);
  const [selectedId, setSelectedId] = useState<string | null>(url.sel ?? null);
  const [activeIds, setActiveIds] = useState<string[]>(() => url.lanes?.filter(id => threadIds.includes(id)) ?? threadIds);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(() => url.dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [sqlOpen, setSqlOpen] = useState(false);
  const [view, setView] = useState<ViewInfo | null>(null);

  const sortedIds = useMemo(() => events
    .filter(ev => activeIds.includes(ev.threadId))
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .map(e => e.id), [events, activeIds]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return new Set<string>();
    return new Set(events.filter(ev => ev.title.toLowerCase().includes(q) || ev.body.toLowerCase().includes(q)).map(e => e.id));
  }, [events, query]);

  const select = useCallback((id: string | null) => { setSelectedId(id); if (id) setSqlOpen(false); }, []);

  /** Id of the previous / next event along the active lanes, relative to the selection. */
  const neighbour = useCallback((delta: -1 | 1): string | null => {
    const idx = selectedId ? sortedIds.indexOf(selectedId) : -1;
    const next = Math.max(0, Math.min(sortedIds.length - 1, idx + delta));
    return sortedIds[next] ?? null;
  }, [selectedId, sortedIds]);

  const toggleLane = useCallback((id: string) => setActiveIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]), []);

  const toggleSql = useCallback(() => { setSqlOpen(o => !o); setSelectedId(null); }, []);
  const closeDrawer = useCallback(() => { setSelectedId(null); setSqlOpen(false); }, []);
  const toggleDark = useCallback(() => setDark(d => !d), []);

  let drawerMode: DrawerMode = 'none';
  if (sqlOpen) drawerMode = 'sql';
  else if (selectedId) drawerMode = 'event';

  return {
    initial: url.level !== undefined && url.center !== undefined ? { level: url.level, center: url.center } : null,
    selectedId, select, neighbour, activeIds, toggleLane, query, setQuery, matches,
    dark, toggleDark, sqlOpen, toggleSql, drawerMode, closeDrawer, view, setView,
  };
}

export type AppState = ReturnType<typeof useAppState>;
