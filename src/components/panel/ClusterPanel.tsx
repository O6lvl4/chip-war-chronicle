import type { Thread, TimelineEvent } from '../../types';
import { fmtDate } from '../../lib/time';
import { threadColor } from '../../lib/palette';

interface Props {
  ids: string[];
  eventsById: Map<string, TimelineEvent>;
  threads: Thread[];
  dark: boolean;
  onSelect: (id: string) => void;
}

/** Members of a clicked cluster pill, so overlapping events are always reachable. */
export default function ClusterPanel({ ids, eventsById, threads, dark, onSelect }: Props) {
  const events = ids.map(id => eventsById.get(id)).filter((e): e is TimelineEvent => !!e);
  const thread = threads.find(t => t.id === events[0]?.threadId);
  const col = threadColor(thread, dark);
  return (
    <div className="panel-body">
      <div className="section-label">重なっている出来事 · {events.length}件</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: col, marginBottom: 10 }}>
        {thread?.name}
      </div>
      {events.map(ev => (
        <button key={ev.id} type="button" className="linked-card" onClick={() => onSelect(ev.id)}
          style={{ '--card-color': col } as React.CSSProperties}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: col, marginBottom: 4 }}>
            {fmtDate(ev.date)}{ev.endDate ? ` — ${fmtDate(ev.endDate)}` : ''}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{ev.title}</div>
        </button>
      ))}
      <p style={{ fontSize: 11, color: 'var(--text-sub)', marginTop: 8 }}>同じ日付の出来事は拡大しても分かれないため、ここから選べます。</p>
    </div>
  );
}
