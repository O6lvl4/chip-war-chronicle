export interface Preset {
  name: string;
  sql: string;
}

/** Ready-made queries against the three tables: threads, events, links. */
export const PRESETS: Preset[] = [
  {
    name: '系列ごとの件数',
    sql: `SELECT t.name AS 系列, count(*) AS 件数,
       sum(CASE WHEN e.sourceTier = 'primary' THEN 1 ELSE 0 END) AS 一次情報
FROM events e JOIN threads t ON t.id = e.threadId
GROUP BY t.name ORDER BY 件数 DESC`,
  },
  {
    name: '年ごとの密度',
    sql: `SELECT year(date) AS 年, count(*) AS 件数,
       string_agg(DISTINCT threadId, ', ' ORDER BY threadId) AS 系列
FROM events GROUP BY 1 ORDER BY 1`,
  },
  {
    name: '因果の起点ランキング',
    sql: `SELECT e.id, e.date, e.title,
       count(l.to) AS 引き起こした数
FROM events e JOIN links l ON l."from" = e.id
GROUP BY e.id, e.date, e.title ORDER BY 引き起こした数 DESC, e.date LIMIT 10`,
  },
  {
    name: '系列をまたぐリンク',
    sql: `SELECT a.date AS 起点日, a.title AS 起点, b.title AS 結果, l.why
FROM links l
JOIN events a ON a.id = l."from"
JOIN events b ON b.id = l.to
WHERE a.threadId <> b.threadId
ORDER BY a.date`,
  },
  {
    name: '断面 (2025-04-15 時点)',
    sql: `SELECT t.name AS 系列, e.id, e.date, e.title,
       datediff('day', e.date, DATE '2025-04-15') AS 経過日数
FROM events e JOIN threads t ON t.id = e.threadId
WHERE e.date <= DATE '2025-04-15'
QUALIFY row_number() OVER (PARTITION BY t.id ORDER BY e.date DESC) = 1
ORDER BY e.date DESC`,
  },
  {
    name: '節目の出来事 (weight = 3)',
    sql: `SELECT e.id, e.date, t.name AS 系列, e.title, e.source
FROM events e JOIN threads t ON t.id = e.threadId
WHERE e.weight = 3 ORDER BY e.date`,
  },
  {
    name: '出典ドメイン',
    sql: `SELECT regexp_extract(sourceUrl, '^https?://([^/]+)', 1) AS ドメイン,
       count(*) AS 件数, min(sourceTier) AS tier
FROM events WHERE sourceUrl IS NOT NULL
GROUP BY 1 ORDER BY 件数 DESC`,
  },
];
