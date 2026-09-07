// 使い方: node scripts/add-links.mjs < links.json  ([{from,to,why}] の配列)
// 両端の id が存在し from の日付が to 以前のものだけを、from の年のリンクファイルに追加する(既存ペアは飛ばす)。
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const data = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const dates = new Map();
for (const year of readdirSync(join(data, 'events')).filter(d => /^\d{4}$/.test(d))) {
  for (const f of readdirSync(join(data, 'events', year)).filter(f => f.endsWith('.ts'))) {
    const src = readFileSync(join(data, 'events', year, f), 'utf8');
    for (const m of src.matchAll(/id: '([a-z]+-\d+)', threadId: '[a-z]+', date: '([0-9-]+)'/g)) dates.set(m[1], m[2]);
  }
}
const existing = new Set();
for (const f of readdirSync(join(data, 'links')).filter(f => /^\d{4}\.ts$/.test(f))) {
  for (const m of readFileSync(join(data, 'links', f), 'utf8').matchAll(/from: '([^']+)', to: '([^']+)'/g)) existing.add(`${m[1]}>${m[2]}`);
}
const wanted = JSON.parse(readFileSync(0, 'utf8'));
const byYear = new Map();
const skipped = [];
for (const l of wanted) {
  const a = dates.get(l.from);
  const b = dates.get(l.to);
  const key = `${l.from}>${l.to}`;
  if (!a || !b) { skipped.push(`${key}: unknown id`); continue; }
  if (a > b) { skipped.push(`${key}: ${a} > ${b}`); continue; }
  if (existing.has(key)) { skipped.push(`${key}: exists`); continue; }
  existing.add(key);
  (byYear.get(a.slice(0, 4)) ?? byYear.set(a.slice(0, 4), []).get(a.slice(0, 4))).push(l);
}
const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
for (const [year, list] of byYear) {
  const file = join(data, 'links', `${year}.ts`);
  const lines = list.map(l => `  { from: '${l.from}', to: '${l.to}', why: '${esc(l.why)}' },`);
  if (existsSync(file)) {
    const src = readFileSync(file, 'utf8');
    writeFileSync(file, src.replace(/\n\];\s*$/, `\n${lines.join('\n')}\n];\n`));
  } else {
    writeFileSync(file, `import type { Link } from '../../types';\n\n/** 起点(from)が${year}年の因果リンク。from が先、to が後。 */\nexport const LINKS_${year}: Link[] = [\n${lines.join('\n')}\n];\n`);
  }
  console.log(`${year}: +${list.length}`);
}
if (skipped.length) console.log('skipped:\n  ' + skipped.join('\n  '));
