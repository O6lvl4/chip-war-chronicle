import type { Thread, TimelineEvent } from '../../types';
import { elapsedStr, fmtDate, ms } from '../../lib/time';
import { threadColor } from '../../lib/palette';
import NCard from './NCard';

interface Props {
  threads: Thread[];
  events: TimelineEvent[];
  activeThreadIds: string[];
  csDate: number;
  dark: boolean;
  onSelect: (id: string) => void;
}

function latestBefore(events: TimelineEvent[], threadId: string, t: number): TimelineEvent | null {
  let best: TimelineEvent | null = null;
  for (const ev of events) {
    if (ev.threadId !== threadId || ms(ev.date) > t) continue;
    if (!best || ms(ev.date) > ms(best.date)) best = ev;
  }
  return best;
}

function Row({ thread, event, csDate, dark, onSelect }: {
  thread: Thread; event: TimelineEvent | null; csDate: number; dark: boolean; onSelect: (id: string) => void;
}) {
  const col = threadColor(thread, dark);
  const elapsed = event ? elapsedStr(ms(event.date), csDate) : '';
  return (
    <NCard color={col} style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, boxShadow: `2px 2px 0 ${col}55`, flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: col }}>{thread.name}</span>
        {elapsed && (
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-sub)',
            background: col + '18', padding: '2px 6px', borderRadius: 4 }}>
            {elapsed}
          </span>
        )}
      </div>
      {event ? (
        <button type="button" className="row-button" onClick={() => onSelect(event.id)}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{event.title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-sub)', marginTop: 4 }}>{fmtDate(event.date)}</div>
        </button>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>この日付以前に出来事なし</div>
      )}
    </NCard>
  );
}

/** "Where was each lane on this day": the latest event per active thread before csDate. */
export default function CrossSectionPanel({ threads, events, activeThreadIds, csDate, dark, onSelect }: Props) {
  const lanes = threads.filter(t => activeThreadIds.includes(t.id));
  return (
    <div className="panel-body">
      <div style={{ marginBottom: 14 }}>
        <div className="section-label">CROSS-SECTION</div>
        <div className="date-badge">{fmtDate(csDate)}</div>
      </div>
      {lanes.map(th => (
        <Row key={th.id} thread={th} event={latestBefore(events, th.id, csDate)} csDate={csDate} dark={dark} onSelect={onSelect} />
      ))}
    </div>
  );
}
