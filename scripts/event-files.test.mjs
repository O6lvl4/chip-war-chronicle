import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { LANES, MAX_LINES, eventFiles, eventName, readEventBlocks, writeEventBlocks } from './event-files.mjs';

const scripts = dirname(fileURLToPath(import.meta.url));
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'chronicle-events-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}
const entry = (n, lane = 'ai') => ({
  id: `${lane}-${n}`, threadId: lane, date: '2026-01-01', weight: 1,
  title: `Event ${n}`, body: "Quoted 'text' and \\ paths", source: 'Fixture',
  sourceUrl: 'https://example.com', sourceTier: 'primary',
});
const block = n => `  {\n    id: 'ai-${n}', threadId: 'ai', date: '2026-01-01', weight: 1,\n    title: 'Event ${n}',\n    body: 'Text',\n    source: 'Fixture',\n    sourceUrl: 'https://example.com',\n    sourceTier: 'primary',\n  },`;
const contents = (root, files) => files.map(file => readFileSync(join(root, '2026', file), 'utf8'));

test('small arrays keep their public filename and round-trip byte for byte', t => {
  const root = fixture(t);
  const blocks = [block(1), block(2)];
  assert.deepEqual(writeEventBlocks(root, '2026', 'ai', blocks), ['ai.ts']);
  assert.deepEqual(readEventBlocks(root, '2026', 'ai'), blocks);
  const before = contents(root, ['ai.ts']);
  writeEventBlocks(root, '2026', 'ai', readEventBlocks(root, '2026', 'ai'));
  assert.deepEqual(contents(root, ['ai.ts']), before);
});

test('a growing array splits before it crosses the unchanged 300-line limit', t => {
  const root = fixture(t);
  const blocks = Array.from({ length: 37 }, (_, i) => block(i + 1));
  assert.deepEqual(writeEventBlocks(root, '2026', 'ai', blocks.slice(0, 36)), ['ai.ts']);
  const files = writeEventBlocks(root, '2026', 'ai', blocks);
  assert.deepEqual(files, ['ai.ts', 'ai-part-2.ts']);
  assert.ok(contents(root, files).every(s => s.split('\n').length <= MAX_LINES));
  assert.deepEqual(readEventBlocks(root, '2026', 'ai'), blocks);
  assert.equal(eventName('2026', 'ai-part-2.ts'), 'EVENTS_2026_AI_PART_2');
});

test('part numbers sort numerically and stale parts are removed on rebalance', t => {
  const root = fixture(t);
  const blocks = Array.from({ length: 400 }, (_, i) => block(i + 1));
  const files = writeEventBlocks(root, '2026', 'ai', blocks);
  assert.equal(files.length, 12);
  assert.deepEqual(eventFiles(root, '2026', 'ai'), files);
  assert.deepEqual(readEventBlocks(root, '2026', 'ai'), blocks);
  writeEventBlocks(root, '2026', 'ai', blocks.slice(0, 2));
  assert.deepEqual(eventFiles(root, '2026', 'ai'), ['ai.ts']);
});

test('an oversized single event fails before changing existing data', t => {
  const root = fixture(t);
  writeEventBlocks(root, '2026', 'ai', [block(1)]);
  const before = contents(root, ['ai.ts']);
  assert.throws(() => writeEventBlocks(root, '2026', 'ai', [block(2), '\n'.repeat(300)]), /One event/);
  assert.deepEqual(contents(root, ['ai.ts']), before);
});

test('invalid arrays and unknown lanes fail instead of silently losing data', t => {
  const root = fixture(t);
  mkdirSync(join(root, '2026'));
  writeFileSync(join(root, '2026', 'ai.ts'), 'not an event array');
  assert.throws(() => readEventBlocks(root, '2026', 'ai'), /Invalid event array/);
  assert.throws(() => eventFiles(root, '2026', 'other'), /Unknown lane/);
  assert.throws(() => eventFiles(root, '../x', 'ai'), /Invalid year/);
});

test('insertion, index, status, links and removal include every part', t => {
  const repo = fixture(t);
  cpSync(scripts, join(repo, 'scripts'), { recursive: true });
  const root = join(repo, 'src', 'data', 'events');
  mkdirSync(join(repo, 'src', 'data', 'links'), { recursive: true });
  const run = (script, args = [], input) => execFileSync(process.execPath,
    [join(repo, 'scripts', script), ...args], { encoding: 'utf8', input });
  for (const lane of LANES) run('insert-events.mjs', [lane], JSON.stringify([entry(1, lane)]));
  const additions = Array.from({ length: 39 }, (_, i) => entry(i + 2));
  run('insert-events.mjs', ['ai'], JSON.stringify(additions));
  assert.equal(readEventBlocks(root, '2026', 'ai').length, 40);
  assert.ok(readEventBlocks(root, '2026', 'ai').every(b => b.includes("Quoted \\'text\\' and \\\\ paths")));
  run('build-events-index.mjs');
  assert.match(readFileSync(join(root, 'index.ts'), 'utf8'), /\.\.\.EVENTS_2026_AI_PART_2,/);
  assert.match(run('data-status.mjs'), /出来事 45 件/);
  run('add-links.mjs', [], JSON.stringify([{ from: 'ai-39', to: 'ai-40', why: 'Fixture' }]));
  assert.match(run('data-status.mjs'), /因果リンク 1 本/);
  run('remove-events.mjs', ['ai-39']);
  assert.match(run('data-status.mjs'), /出来事 44 件 \/ 因果リンク 0 本/);
  run('insert-events.mjs', ['ai'], JSON.stringify([{ ...entry(41), date: '2025-12-31' }]));
  assert.deepEqual(eventFiles(root, '2025', 'ai'), ['ai.ts']);
  run('insert-events.mjs', ['ai'], JSON.stringify([entry(40)]));
  const duplicate = spawnSync(process.execPath, [join(repo, 'scripts', 'data-status.mjs')], { encoding: 'utf8' });
  assert.equal(duplicate.status, 1);
  assert.match(duplicate.stdout, /重複 id: ai-40/);
});

test('migration preserves an oversized existing array and is idempotent', t => {
  const repo = fixture(t);
  cpSync(scripts, join(repo, 'scripts'), { recursive: true });
  const root = join(repo, 'src', 'data', 'events');
  mkdirSync(join(root, '2026'), { recursive: true });
  const blocks = Array.from({ length: 40 }, (_, i) => block(i + 1));
  writeFileSync(join(root, '2026', 'ai.ts'), `import type { TimelineEvent } from '../../../types';\n\nexport const EVENTS_2026_AI: TimelineEvent[] = [\n${blocks.join('\n')}\n];\n`);
  const split = () => execFileSync(process.execPath, [join(repo, 'scripts', 'split-events.mjs')], { encoding: 'utf8' });
  assert.match(split(), /40 events/);
  assert.deepEqual(readEventBlocks(root, '2026', 'ai'), blocks);
  const files = eventFiles(root, '2026', 'ai');
  const before = contents(root, files);
  assert.equal(split(), '');
  assert.deepEqual(contents(root, files), before);
});
