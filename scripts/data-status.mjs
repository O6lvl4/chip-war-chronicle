// 使い方: node scripts/data-status.mjs [--json]
// 系列ごとの最終更新日・次に使える id・直近の出来事と、データの整合性を出す。
// 整合性に問題があれば終了コード 1。
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const data = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const LANES = ['si', 'pr', 'gp', 'ai', 'mm', 'jp'];
const today = new Date().toISOString().slice(0, 10);

const events = [];
const years = readdirSync(join(data, 'events')).filter(d => /^\d{4}$/.test(d)).sort();
for (const year of years) {
  for (const lane of LANES) {
    let src;
    try {
      src = readFileSync(join(data, 'events', year, `${lane}.ts`), 'utf8');
    } catch {
      continue;
    }
    for (const block of src.split(/\n(?=  \{\n)/).slice(1)) {
      const get = re => (block.match(re) ?? [])[1];
      const id = get(/id: '([^']+)'/);
      if (!id) continue;
      events.push({
        id,
        lane,
        year,
        date: get(/ date: '([^']+)'/),
        title: get(/title: '(.*)',\n/),
        weight: Number(get(/weight: (\d)/)),
        url: get(/sourceUrl: '([^']+)'/),
      });
    }
  }
}

const links = [];
for (const f of readdirSync(join(data, 'links')).filter(f => /^\d{4}\.ts$/.test(f))) {
  const src = readFileSync(join(data, 'links', f), 'utf8');
  for (const m of src.matchAll(/from: '([^']+)', to: '([^']+)'/g)) links.push({ file: f, from: m[1], to: m[2] });
}

const byId = new Map(events.map(e => [e.id, e]));
const days = d => Math.round((Date.parse(today) - Date.parse(d)) / 86400000);
const pad = (x, n) => String(x).padStart(n);

console.log(`今日: ${today}   出来事 ${events.length} 件 / 因果リンク ${links.length} 本\n`);
console.log('系列  件数  最終更新     経過  次のid    直近の出来事');
for (const lane of LANES) {
  const mine = events.filter(e => e.lane === lane);
  const last = mine.reduce((a, b) => (a && a.date > b.date ? a : b), null);
  const next = `${lane}-${Math.max(...mine.map(e => Number(e.id.split('-')[1]))) + 1}`;
  console.log(
    `${lane}  ${pad(mine.length, 5)}  ${last.date}  ${pad(`${days(last.date)}日`, 5)}  ${pad(next, 7)}   ${last.title}`,
  );
}

const recent = events.filter(e => days(e.date) <= 60).sort((a, b) => a.date.localeCompare(b.date));
console.log(`\n直近60日の出来事 (${recent.length} 件) — 重複を入れないよう確認する`);
for (const e of recent) console.log(`  ${e.date} [${e.lane}] ${e.id} ${e.title}`);

const problems = [];
const seen = new Set();
for (const e of events) {
  if (seen.has(e.id)) problems.push(`重複 id: ${e.id}`);
  seen.add(e.id);
  if (!e.date?.startsWith(e.year)) problems.push(`年フォルダと date が不一致: ${e.id} (${e.year}/ に ${e.date})`);
  if (!e.url) problems.push(`sourceUrl なし: ${e.id}`);
  if (e.date > today) problems.push(`未来の日付: ${e.id} (${e.date})`);
  if (![1, 2, 3].includes(e.weight)) problems.push(`weight が不正: ${e.id}`);
}
for (const l of links) {
  const from = byId.get(l.from);
  const to = byId.get(l.to);
  if (!from || !to) problems.push(`リンクの参照先がない: ${l.from} → ${l.to} (${l.file})`);
  else if (from.date > to.date) problems.push(`リンクが時間をさかのぼる: ${l.from}(${from.date}) → ${l.to}(${to.date})`);
  else if (!l.file.startsWith(from.date.slice(0, 4))) problems.push(`リンクの置き場所が起点の年と違う: ${l.from} → ${l.to} (${l.file})`);
}

if (problems.length) {
  console.log(`\n整合性: ${problems.length} 件の問題`);
  for (const p of problems) console.log(`  ${p}`);
  process.exit(1);
}
console.log('\n整合性: 問題なし');
