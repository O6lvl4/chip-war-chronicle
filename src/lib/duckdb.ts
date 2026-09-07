import * as duckdb from '@duckdb/duckdb-wasm';
import mvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import ehWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import ehWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import type { Link, Thread, TimelineEvent } from '../types';

export interface QueryResult {
  columns: string[];
  rows: unknown[][];
  ms: number;
}

export interface Dataset {
  threads: Thread[];
  events: TimelineEvent[];
  links: Link[];
}

const BUNDLES: duckdb.DuckDBBundles = {
  mvp: { mainModule: mvpWasm, mainWorker: mvpWorker },
  eh: { mainModule: ehWasm, mainWorker: ehWorker },
};

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function boot(data: Dataset): Promise<duckdb.AsyncDuckDB> {
  const bundle = await duckdb.selectBundle(BUNDLES);
  const worker = new Worker(bundle.mainWorker!);
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  await loadTables(db, data);
  return db;
}

async function loadTables(db: duckdb.AsyncDuckDB, data: Dataset) {
  const tables: [string, unknown[]][] = [
    ['threads', data.threads],
    ['events', data.events],
    ['links', data.links],
  ];
  const conn = await db.connect();
  try {
    for (const [name, rows] of tables) {
      await db.registerFileText(`${name}.json`, JSON.stringify(rows));
      await conn.query(`CREATE TABLE ${name} AS SELECT * FROM read_json_auto('${name}.json')`);
    }
    await conn.query('ALTER TABLE events ALTER date TYPE DATE');
    await conn.query('ALTER TABLE events ALTER endDate TYPE DATE');
  } finally {
    await conn.close();
  }
}

/** Boots DuckDB-WASM once and loads the dataset as three tables. */
export function getDb(data: Dataset): Promise<duckdb.AsyncDuckDB> {
  dbPromise ??= boot(data);
  return dbPromise;
}

function plain(v: unknown): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === 'bigint') return Number(v);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object' && 'toArray' in (v as object)) return (v as { toArray(): unknown[] }).toArray().map(plain);
  return v;
}

export async function runQuery(db: duckdb.AsyncDuckDB, sql: string): Promise<QueryResult> {
  const t0 = performance.now();
  const conn = await db.connect();
  try {
    const table = await conn.query(sql);
    const columns = table.schema.fields.map(f => f.name);
    const rows = table.toArray().map(r => columns.map(c => plain(r[c])));
    return { columns, rows, ms: performance.now() - t0 };
  } finally {
    await conn.close();
  }
}
