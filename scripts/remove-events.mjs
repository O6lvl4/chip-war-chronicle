// 使い方: node scripts/remove-events.mjs id [id...]  該当する出来事ブロックと、それを参照するリンクを削除する。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const data = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const ids = [...new Set(process.argv.slice(2))];
for (const year of readdirSync(join(data, 'events')).filter(d => /^\d{4}$/.test(d))) {
  for (const f of readdirSync(join(data, 'events', year)).filter(f => f.endsWith('.ts'))) {
    const p = join(data, 'events', year, f);
    const src = readFileSync(p, 'utf8');
    let out = src;
    for (const id of ids) out = out.replace(new RegExp(`  \\{\\n    id: '${id}',[\\s\\S]*?\\n  \\},\\n`), '');
    if (out !== src) { writeFileSync(p, out); console.log(`${p}: removed`); }
  }
}
for (const f of readdirSync(join(data, 'links')).filter(f => /^\d{4}\.ts$/.test(f))) {
  const p = join(data, 'links', f);
  const src = readFileSync(p, 'utf8');
  const out = src.split('\n').filter(line => !ids.some(id => line.includes(`'${id}'`))).join('\n');
  if (out !== src) { writeFileSync(p, out); console.log(`${p}: links removed`); }
}
