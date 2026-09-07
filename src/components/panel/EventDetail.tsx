import type { Link, Thread, TimelineEvent } from '../../types';
import { fmtDate } from '../../lib/time';
import { threadColor } from '../../lib/palette';
import NCard from './NCard';
import LinkedCard from './LinkedCard';
import SourceBadge from './SourceBadge';

interface Props {
  ev: TimelineEvent;
  threads: Thread[];
  eventsById: Map<string, TimelineEvent>;
  links: Link[];
  dark: boolean;
  onSelect: (id: string) => void;
}

interface Related {
  link: Link;
  event: TimelineEvent;
}

function resolve(links: Link[], byId: Map<string, TimelineEvent>, pick: (l: Link) => string): Related[] {
  const out: Related[] = [];
  for (const link of links) {
    const event = byId.get(pick(link));
    if (event) out.push({ link, event });
  }
  return out;
}

function RelatedList({ title, arrow, items, threads, dark, onSelect }: {
  title: string; arrow: string; items: Related[]; threads: Thread[]; dark: boolean; onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="section-label">
        <span style={{ color: 'var(--accent)', fontSize: 14 }}>{arrow}</span>
        {title}
      </div>
      {items.map(({ link, event }) => (
        <LinkedCard key={event.id} ev={event} why={link.why}
          color={threadColor(threads.find(t => t.id === event.threadId), dark)} onSelect={onSelect} />
      ))}
    </div>
  );
}

/** Full detail of one selected event, with its causes and effects. */
export default function EventDetail({ ev, threads, eventsById, links, dark, onSelect }: Props) {
  const thread = threads.find(t => t.id === ev.threadId);
  const col = threadColor(thread, dark);
  const causedBy = resolve(links.filter(l => l.to === ev.id), eventsById, l => l.from);
  const caused = resolve(links.filter(l => l.from === ev.id), eventsById, l => l.to);
  const dateLabel = ev.endDate ? `${fmtDate(ev.date)} — ${fmtDate(ev.endDate)}` : fmtDate(ev.date);

  return (
    <div className="panel-body">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-sub)', letterSpacing: 0.5 }}>
          {dateLabel}
        </span>
        <span style={{ padding: '2px 8px', borderRadius: 20, background: col + '18', color: col,
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 0.5, border: `1.5px solid ${col}` }}>
          {thread?.en}
        </span>
      </div>

      <NCard color={col} style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: col, letterSpacing: 0.5, marginBottom: 6 }}>
          {thread?.name}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, lineHeight: 1.45, color: 'var(--text)', marginBottom: 12 }}>
          {ev.title}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.85, color: 'var(--text)' }}>{ev.body}</div>
      </NCard>

      <SourceBadge ev={ev} />

      <RelatedList title="引き金になった出来事" arrow="←" items={causedBy} threads={threads} dark={dark} onSelect={onSelect} />
      <RelatedList title="引き起こした出来事" arrow="→" items={caused} threads={threads} dark={dark} onSelect={onSelect} />
    </div>
  );
}
