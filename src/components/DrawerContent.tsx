import { useMemo } from 'react';
import { LINKS, THREADS } from '../data';
import type { TimelineEvent } from '../types';
import type { AppState } from '../hooks/useAppState';
import type { DuckDBHandle } from '../hooks/useDuckDB';
import EventDetail from './panel/EventDetail';
import SqlConsole from './panel/SqlConsole';

interface Props {
  state: AppState;
  db: DuckDBHandle;
  eventsById: Map<string, TimelineEvent>;
  onSelect: (id: string) => void;
}

/** Picks the panel that matches the drawer mode. */
export default function DrawerContent({ state: st, db, eventsById, onSelect }: Props) {
  const knownIds = useMemo(() => new Set(eventsById.keys()), [eventsById]);
  if (st.drawerMode === 'sql') return <SqlConsole db={db} knownIds={knownIds} onSelect={onSelect} />;
  const ev = st.selectedId ? eventsById.get(st.selectedId) : undefined;
  if (!ev) return null;
  return <EventDetail ev={ev} threads={THREADS} eventsById={eventsById} links={LINKS} dark={st.dark} onSelect={onSelect} />;
}
