import { useMemo } from 'react';
import { EVENTS, LINKS, THREADS } from '../data';
import type { TimelineEvent } from '../types';
import type { TimelineState } from '../hooks/useTimelineState';
import type { DuckDBHandle } from '../hooks/useDuckDB';
import EventDetail from './panel/EventDetail';
import CrossSectionPanel from './panel/CrossSectionPanel';
import SqlConsole from './panel/SqlConsole';

interface Props {
  state: TimelineState;
  db: DuckDBHandle;
  eventsById: Map<string, TimelineEvent>;
  csDate: number | null;
}

/** Picks the panel that matches the drawer mode. */
export default function DrawerContent({ state: st, db, eventsById, csDate }: Props) {
  const knownIds = useMemo(() => new Set(eventsById.keys()), [eventsById]);
  switch (st.drawerMode) {
    case 'event': {
      const ev = st.selectedId ? eventsById.get(st.selectedId) : undefined;
      return ev ? <EventDetail ev={ev} threads={THREADS} eventsById={eventsById} links={LINKS} dark={st.dark} onSelect={st.select} /> : null;
    }
    case 'section':
      return csDate === null ? null : (
        <CrossSectionPanel threads={THREADS} events={EVENTS} activeThreadIds={st.activeThreadIds}
          csDate={csDate} dark={st.dark} onSelect={st.select} />
      );
    case 'sql':
      return <SqlConsole db={db} knownIds={knownIds} onSelect={st.select} />;
    default:
      return null;
  }
}
