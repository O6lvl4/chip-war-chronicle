// 年 × 系列のデータを、codopsy の既定上限 (300行) に収まるファイルへ分割する。
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const LANES = ['si', 'pr', 'gp', 'ai', 'mm', 'jp'];
export const MAX_LINES = 300;
const lineCount = source => source.split('\n').length;

export function eventFiles(root, year, lane) {
  if (!/^\d{4}$/.test(year)) throw new Error(`Invalid year: ${year}`);
  if (!LANES.includes(lane)) throw new Error(`Unknown lane: ${lane}`);
  const dir = join(root, year);
  if (!existsSync(dir)) return [];
  const pattern = new RegExp(`^${lane}(?:-part-(\\d+))?\\.ts$`);
  return readdirSync(dir).filter(f => pattern.test(f)).sort((a, b) =>
    Number(a.match(pattern)[1] ?? 1) - Number(b.match(pattern)[1] ?? 1));
}

export const eventName = (year, file) => `EVENTS_${year}_${file.slice(0, -3).replaceAll('-', '_').toUpperCase()}`;

/** Preserve each existing object literal, including its escaped text, verbatim. */
export function readEventBlocks(root, year, lane) {
  return eventFiles(root, year, lane).flatMap(file => {
    const source = readFileSync(join(root, year, file), 'utf8');
    const open = source.indexOf('[\n');
    const close = source.lastIndexOf('\n];');
    if (open < 0 || close < open) throw new Error(`Invalid event array: ${year}/${file}`);
    return source.slice(open + 2, close).split(/\n(?=  \{\n)/).filter(b => b.trim());
  });
}

const renderFile = (year, file, blocks) => `import type { TimelineEvent } from '../../../types';\n\nexport const ${eventName(year, file)}: TimelineEvent[] = [\n${blocks.join('\n')}\n];\n`;
const partFile = (lane, index) => index === 0 ? `${lane}.ts` : `${lane}-part-${index + 1}.ts`;

export function writeEventBlocks(root, year, lane, blocks) {
  const oldFiles = eventFiles(root, year, lane);
  const parts = [[]];
  for (const block of blocks) {
    let part = parts.at(-1);
    const file = partFile(lane, parts.length - 1);
    if (lineCount(renderFile(year, file, [...part, block])) > MAX_LINES) {
      if (lineCount(renderFile(year, file, [block])) > MAX_LINES) throw new Error('One event exceeds the file line limit');
      parts.push(part = []);
    }
    part.push(block);
  }
  const dir = join(root, year);
  mkdirSync(dir, { recursive: true });
  const files = parts.map((part, index) => {
    const file = partFile(lane, index);
    writeFileSync(join(dir, file), renderFile(year, file, part));
    return file;
  });
  for (const file of oldFiles) if (!files.includes(file)) unlinkSync(join(dir, file));
  return files;
}
