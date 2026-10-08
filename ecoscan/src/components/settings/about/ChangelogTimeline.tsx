import { CHANGELOG, type ChangelogEntry } from '@/data/changelog';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const TAG_LABELS: Record<ChangelogEntry['tag'], string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
};

interface ChangelogEntryItemProps {
  entry: ChangelogEntry;
}

function ChangelogEntryItem({ entry }: ChangelogEntryItemProps) {
  return (
    <article className="border-l-2 border-line pl-6 pb-8 last:pb-0 relative" style={{ borderLeftColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5 bg-brand" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border" style={{ ...getTagStyle(entry.tag) }}>
              {TAG_LABELS[entry.tag]}
            </span>
            <span className="font-mono text-sm text-fg-dim">v{entry.version}</span>
            <time className="text-fg-dim text-sm" dateTime={entry.date}>{entry.date}</time>
          </div>
          <h3 className="font-medium text-fg mb-2">{entry.title}</h3>
          <ul className="space-y-1.5 text-fg-muted text-sm pl-4 list-disc">
            {entry.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function getTagStyle(tag: ChangelogEntry['tag']): React.CSSProperties {
  const base: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 500, padding: '0.25rem 0.75rem', borderRadius: '9999px', borderWidth: '1px' };
  switch (tag) {
    case 'new':
      return { ...base, backgroundColor: 'rgba(32, 200, 120, 0.2)', color: '#20c878', borderColor: 'rgba(32, 200, 120, 0.3)' };
    case 'improved':
      return { ...base, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' };
    case 'fixed':
      return { ...base, backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.3)' };
  }
}

export function ChangelogTimeline() {
  const [expanded, setExpanded] = useState(false);
  const visibleEntries = expanded ? CHANGELOG : CHANGELOG.slice(0, 3);
  const hasMore = CHANGELOG.length > 3;

  return (
    <section aria-labelledby="changelog-title" className="space-y-6">
      <div className="text-center">
        <h2 id="changelog-title" className="font-display text-2xl font-normal text-fg">What's New</h2>
        <p className="mt-2 text-fg-muted max-w-2xl mx-auto">Recent updates and improvements to EcoScan.</p>
      </div>
      <div className="space-y-0" role="list" aria-label="Changelog">
        {visibleEntries.map((entry) => (
          <ChangelogEntryItem key={entry.version} entry={entry} />
        ))}
      </div>
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-secondary btn-sm flex items-center gap-2 mx-auto"
            aria-expanded={expanded}
            aria-controls="changelog-list"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
                Show older ({CHANGELOG.length - 3} more)
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}