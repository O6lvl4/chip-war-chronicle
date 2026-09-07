import type { TimelineEvent } from '../../types';
import { fmtDate } from '../../lib/time';

interface Props {
  ev: TimelineEvent;
  why: string;
  color: string;
  onSelect: (id: string) => void;
}

/** A linked (cause or effect) event, shown as a clickable card with the reason. */
export default function LinkedCard({ ev, why, color, onSelect }: Props) {
  return (
    <button type="button" className="linked-card" onClick={() => onSelect(ev.id)}
      style={{ '--card-color': color } as React.CSSProperties}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.4 }}>
        {ev.title}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color, marginBottom: 5 }}>
        {fmtDate(ev.date)}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-sub)', lineHeight: 1.65 }}>{why}</div>
    </button>
  );
}
