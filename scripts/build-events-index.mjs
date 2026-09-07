// src/data/events/<year>/<lane>.ts と src/data/links/<year>.ts を走査して各 index.ts を再生成する。
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const data = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const LANES = ['si', 'pr', 'gp', 'ai', 'mm', 'jp'];
const HEADER = '// 生成ファイル: scripts/build-events-index.mjs で再生成する。';

const evRoot = join(data, 'events');
const evImports = [];
const evSpread = [];
for (const year of readdirSync(evRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()) {
  const files = new Set(readdirSync(join(evRoot, year)));
  for (const lane of LANES) {
    if (!files.has(`${lane}.ts`)) continue;
    const name = `EVENTS_${year}_${lane.toUpperCase()}`;
    evImports.push(`import { ${name} } from './${year}/${lane}';`);
    evSpread.push(`  ...${name},`);
  }
}
writeFileSync(join(evRoot, 'index.ts'), `${HEADER} 年 × 系列ごとに1ファイル。
import type { TimelineEvent } from '../../types';
${evImports.join('\n')}

export const EVENTS: TimelineEvent[] = [
${evSpread.join('\n')}
];
`);

const lkRoot = join(data, 'links');
const years = readdirSync(lkRoot).filter(f => /^\d{4}\.ts$/.test(f)).map(f => f.slice(0, 4)).sort();
writeFileSync(join(lkRoot, 'index.ts'), `${HEADER} 起点の年ごとに1ファイル。
import type { Link } from '../../types';
${years.map(y => `import { LINKS_${y} } from './${y}';`).join('\n')}

export const LINKS: Link[] = [
${years.map(y => `  ...LINKS_${y},`).join('\n')}
];
`);
console.log(`events index: ${evImports.length} files, links index: ${years.length} files`);
