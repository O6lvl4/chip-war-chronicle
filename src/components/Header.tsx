import type { Thread } from '../types';
import type { TimelineState } from '../hooks/useTimelineState';
import { threadColor } from '../lib/palette';
import { spanLabel } from '../lib/time';

interface Props {
  threads: Thread[];
  state: TimelineState;
  dbReady: boolean;
}

function ThreadChip({ thread, on, dark, onToggle }: { thread: Thread; on: boolean; dark: boolean; onToggle: () => void }) {
  const col = threadColor(thread, dark);
  return (
    <button type="button" className="thread-chip" aria-pressed={on} onClick={onToggle}
      style={{ '--chip-color': col } as React.CSSProperties}>
      <span className="dot" />
      {thread.name}
    </button>
  );
}

export default function Header({ threads, state, dbReady }: Props) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-main">半導体</span>
        <span className="brand-sub">と世界情勢</span>
        <span className="brand-range">2018–2026</span>
      </div>
      <div className="vsep" />
      <div className="chips">
        {threads.map(t => (
          <ThreadChip key={t.id} thread={t} on={state.activeThreadIds.includes(t.id)} dark={state.dark}
            onToggle={() => state.toggleThread(t.id)} />
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 8 }} />
      <div className="span-pill">{spanLabel(state.view.start, state.view.end)}</div>
      <div className="search-wrap">
        <input value={state.query} onChange={e => state.setQuery(e.target.value)} placeholder="検索…" aria-label="出来事を検索" />
        <span className="search-icon">🔍</span>
      </div>
      <button type="button" className={`n-btn${state.crossSection.enabled ? ' active' : ''}`} onClick={state.toggleCrossSection}>
        断面
      </button>
      <button type="button" className={`n-btn${state.sqlOpen ? ' active' : ''}`} onClick={state.toggleSql}
        title={dbReady ? 'DuckDB-WASM で SQL を実行' : 'DuckDB-WASM を起動中'}>
        SQL{dbReady ? '' : ' …'}
      </button>
      <button type="button" className="n-btn zoom-btn" onClick={() => state.zoom(0.7)} aria-label="拡大">＋</button>
      <button type="button" className="n-btn zoom-btn" onClick={() => state.zoom(1 / 0.7)} aria-label="縮小">－</button>
      <button type="button" className="n-btn" onClick={state.resetView}>全期間</button>
      <button type="button" className="n-btn theme-toggle" onClick={state.toggleDark} style={{ padding: '5px 10px', minWidth: 36 }}
        aria-label="テーマ切替">
        {state.dark ? '☀' : '☾'}
      </button>
    </header>
  );
}
