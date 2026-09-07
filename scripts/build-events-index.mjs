// src/data/events/<year>/<lane>.ts を走査して src/data/events/index.ts を再生成する。
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events');
const LANES = ['si', 'pr', 'gp', 'ai', 'mm'];
const imports = [];
const spread = [];
for (const year of readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()) {
  const files = new Set(readdirSync(join(root, year)));
  for (const lane of LANES) {
    if (!files.has(`${lane}.ts`)) continue;
    const name = `EVENTS_${year}_${lane.toUpperCase()}`;
    imports.push(`import { ${name} } from './${year}/${lane}';`);
    spread.push(`  ...${name},`);
  }
}
writeFileSync(join(root, 'index.ts'), `// 生成ファイル: scripts/build-events-index.mjs で再生成する。年 × 系列ごとに1ファイル。
import type { TimelineEvent } from '../../types';
${imports.join('\n')}

export const EVENTS: TimelineEvent[] = [
${spread.join('\n')}
];
`);
console.log(`index.ts: ${imports.length} files`);
