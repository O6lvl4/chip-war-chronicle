// 使い方: node scripts/insert-events.mjs <lane> < entries.json
// entries.json は TimelineEvent の配列。各年ファイルの配列に追加して日付順に並べ直す。
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readEventBlocks, writeEventBlocks } from './event-files.mjs';

const lane = process.argv[2];
const entries = JSON.parse(readFileSync(0, 'utf8'));
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events');

const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
function render(e) {
  const head = `    id: '${e.id}', threadId: '${e.threadId}', date: '${e.date}',${e.endDate ? ` endDate: '${e.endDate}',` : ''} weight: ${e.weight},`;
  const lines = [head, `    title: '${esc(e.title)}',`, `    body: '${esc(e.body)}',`, `    source: '${esc(e.source)}',`];
  if (e.sourceUrl) lines.push(`    sourceUrl: '${e.sourceUrl}',`);
  if (e.sourceTier) lines.push(`    sourceTier: '${e.sourceTier}',`);
  return `  {\n${lines.join('\n')}\n  },`;
}

const dateOf = b => (b.match(/date: '([0-9-]+)'/) || [])[1] ?? '';

const byYear = new Map();
for (const e of entries) (byYear.get(e.date.slice(0, 4)) ?? byYear.set(e.date.slice(0, 4), []).get(e.date.slice(0, 4))).push(e);
for (const [year, list] of byYear) {
  const existing = readEventBlocks(root, year, lane);
  const all = [...existing, ...list.map(render)].sort((a, b) => dateOf(a).localeCompare(dateOf(b)));
  const files = writeEventBlocks(root, year, lane, all);
  console.log(`${year}/${lane}: +${list.length} → ${all.length} (${files.length} files)`);
}
