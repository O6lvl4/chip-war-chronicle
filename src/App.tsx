import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DATA_END, DATA_START, EVENTS, LINKS, THREADS } from './data';
import { useAppState } from './hooks/useAppState';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useDuckDB } from './hooks/useDuckDB';
import { themeFor } from './lib/palette';
import { writeUrl } from './lib/urlState';
import { perf } from './lib/perf';
import Board, { type BoardApi } from './board/Board';
import Header from './components/Header';
import Drawer from './components/Drawer';
import DrawerContent from './components/DrawerContent';
import Minimap from './components/Minimap';
import PerfHud from './components/PerfHud';

const THREAD_IDS = THREADS.map(t => t.id);
const DATASET = { threads: THREADS, events: EVENTS, links: LINKS };

export default function App() {
  const st = useAppState({ events: EVENTS, threadIds: THREAD_IDS });
  const board = useRef<BoardApi>(null);
  const eventsById = useMemo(() => new Map(EVENTS.map(e => [e.id, e])), []);
  const theme = useMemo(() => themeFor(st.dark), [st.dark]);

  // DuckDB-WASM (~35 MB) is only fetched the first time the SQL console opens.
  const [dbWanted, setDbWanted] = useState(false);
  if (st.sqlOpen && !dbWanted) setDbWanted(true);
  const db = useDuckDB(DATASET, dbWanted);

  /** Selecting from a list (drawer, SQL result, keyboard) also brings the event into view. */
  const selectAndCenter = useCallback((id: string) => {
    st.select(id);
    const ev = eventsById.get(id);
    if (ev) board.current?.centerOn(Date.parse(ev.date));
  }, [st, eventsById]);

  useKeyboardNav({
    clearSelection: st.closeDrawer,
    resetView: () => board.current?.fitAll(),
    zoom: factor => board.current?.zoomBy(factor < 1 ? 1 : -1),
    step: delta => { const id = st.neighbour(delta); if (id) selectAndCenter(id); },
  });

  useEffect(() => {
    writeUrl({ level: st.view?.level, center: st.view ? (st.view.start + st.view.end) / 2 : undefined, sel: st.selectedId ?? undefined, lanes: st.activeIds, dark: st.dark });
  }, [st.view, st.selectedId, st.activeIds, st.dark]);

  const centerRange = useCallback((s: number, e: number) => board.current?.centerOn((s + e) / 2), []);

  return (
    <div className={`app${st.dark ? ' dark' : ''}`}>
      <Header threads={THREADS} state={st} onFitAll={() => board.current?.fitAll()} />
      <div className="timeline-container">
        <Board threads={THREADS} events={EVENTS} links={LINKS} activeIds={st.activeIds} theme={theme}
          selectedId={st.selectedId} matches={st.matches} dataStart={DATA_START} dataEnd={DATA_END}
          initial={st.initial} onSelect={st.select} onIdle={st.setView} apiRef={board} />
        <div className="hint">横スワイプ / 横ホイール / ドラッグで移動 · 縦はスクロール · ⌘/Ctrl+ホイール・ピンチ・ダブルクリックで拡大</div>
        <Minimap threads={THREADS} events={EVENTS} activeThreadIds={st.activeIds}
          dataStart={DATA_START} dataEnd={DATA_END}
          viewStart={st.view?.start ?? DATA_START} viewEnd={st.view?.end ?? DATA_END}
          dark={st.dark} onViewChange={centerRange} />
        <Drawer mode={st.drawerMode} onClose={st.closeDrawer}>
          <DrawerContent state={st} db={db} eventsById={eventsById} onSelect={selectAndCenter} />
        </Drawer>
      </div>
      {perf.enabled && <PerfHud />}
    </div>
  );
}
