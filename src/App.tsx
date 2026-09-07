import { useMemo } from 'react';
import { DATA_END, DATA_START, EVENTS, LINKS, THREADS } from './data';
import { useTimelineState } from './hooks/useTimelineState';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useDuckDB } from './hooks/useDuckDB';
import { labelWidthFor } from './components/canvas/geometry';
import Header from './components/Header';
import Drawer from './components/Drawer';
import TimelineCanvas from './components/TimelineCanvas';
import Minimap from './components/Minimap';
import DrawerContent from './components/DrawerContent';

const THREAD_IDS = THREADS.map(t => t.id);
const DATASET = { threads: THREADS, events: EVENTS, links: LINKS };

/** Cross-section x (px inside the canvas) → date, using the canvas width. */
function csDateFor(x: number, viewStart: number, viewEnd: number): number | null {
  const el = document.querySelector<HTMLElement>('.timeline-container');
  if (!el) return null;
  const labelW = labelWidthFor(el.offsetWidth);
  if (x <= labelW) return null;
  const pxPerMs = (el.offsetWidth - labelW) / (viewEnd - viewStart);
  return viewStart + (x - labelW) / pxPerMs;
}

export default function App() {
  const st = useTimelineState({ events: EVENTS, threadIds: THREAD_IDS, dataStart: DATA_START, dataEnd: DATA_END });
  const db = useDuckDB(DATASET);
  const eventsById = useMemo(() => new Map(EVENTS.map(e => [e.id, e])), []);

  useKeyboardNav({ clearSelection: st.closeDrawer, resetView: st.resetView, zoom: st.zoom, step: st.step });

  const csDate = st.drawerMode === 'section' ? csDateFor(st.crossSection.x, st.view.start, st.view.end) : null;

  return (
    <div className={`app${st.dark ? ' dark' : ''}`}>
      <Header threads={THREADS} state={st} dbReady={db.status === 'ready'} />

      <div className="timeline-container">
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          <TimelineCanvas
            threads={THREADS} events={EVENTS} links={LINKS}
            activeThreadIds={st.activeThreadIds}
            viewStart={st.view.start} viewEnd={st.view.end}
            selectedId={st.selectedId} hoveredId={st.hoveredId}
            query={st.query} dark={st.dark} crossSection={st.crossSection}
            onViewChange={st.setRange} onSelect={st.select}
            onHover={st.setHoveredId} onCrossSection={st.moveCrossSection}
            onCluster={st.openCluster}
          />
        </div>
        <Minimap threads={THREADS} events={EVENTS} activeThreadIds={st.activeThreadIds}
          dataStart={DATA_START} dataEnd={DATA_END}
          viewStart={st.view.start} viewEnd={st.view.end}
          dark={st.dark} onViewChange={st.setRange} />

        <Drawer mode={st.drawerMode} onClose={st.closeDrawer}>
          <DrawerContent state={st} db={db} eventsById={eventsById} csDate={csDate} />
        </Drawer>
      </div>
    </div>
  );
}
