import type { TimelineEvent } from '../../types';

interface Props {
  ev: TimelineEvent;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Source line: label, tier chip and an outbound link when a verified URL exists. */
export default function SourceBadge({ ev }: Props) {
  const tierLabel = ev.sourceTier === 'primary' ? '一次情報' : '報道';
  return (
    <div className="source-badge">
      <span className="source-tier" data-tier={ev.sourceTier ?? 'secondary'}>{tierLabel}</span>
      <span className="source-label">{ev.source}</span>
      {ev.sourceUrl && (
        <a href={ev.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
          {hostOf(ev.sourceUrl)} ↗
        </a>
      )}
    </div>
  );
}
