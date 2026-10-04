// 使い方: node scripts/split-events.mjs — 既存のイベントを変更せず、300行を超えるファイルだけ分割する。
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANES, MAX_LINES, eventFiles, readEventBlocks, writeEventBlocks } from './event-files.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events');
for (const year of readdirSync(root).filter(d => /^\d{4}$/.test(d)).sort()) {
  for (const lane of LANES) {
    const oversized = eventFiles(root, year, lane).some(file =>
      readFileSync(join(root, year, file), 'utf8').split('\n').length > MAX_LINES);
    if (!oversized) continue;
    const blocks = readEventBlocks(root, year, lane);
    const files = writeEventBlocks(root, year, lane, blocks);
    console.log(`${year}/${lane}: ${blocks.length} events → ${files.join(', ')}`);
  }
}
