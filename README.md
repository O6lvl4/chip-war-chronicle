# Chip War Chronicle — 半導体と世界情勢

半導体産業・政策・地政学・AI需要・市場・日本の法制の6系列を共通の時間軸に並べ、系列をまたぐ因果リンクと「断面」ビューで絡み合いを読むインタラクティブ・タイムライン。2018年から2026年までの出来事を、一次情報に近い出典URL付きで収録しています。

**公開ページ:** https://o6lvl4.github.io/chip-war-chronicle/

## できること

| 機能 | 説明 |
|---|---|
| スイムレーン | 5系列を縦に並べ、横軸はひとつの時間。系列はヘッダーのチップで個別にオン・オフ |
| セマンティックズーム | ホイールで拡大縮小。目盛が 年 → 四半期 → 月 → 週 に切り替わり、重なった出来事はピルに集約 |
| 因果リンク | 出来事をクリックすると、引き金になった出来事と引き起こした出来事だけが強調される |
| 断面 | 「断面」モードでカーソル位置の1日を固定すると、その時点で各系列が最後に起こした出来事と経過時間が並ぶ |
| 出典 | 各出来事に出典ラベル・一次/報道の区分・検証済みURLを付与。詳細パネルから元資料へ飛べる |
| SQL (DuckDB-WASM) | 「SQL」ボタンでブラウザ内の DuckDB に対して SQL を実行。`threads` / `events` / `links` の3テーブルにプリセットクエリ付き。`id` 列を含む結果行はクリックでその出来事へ |
| キーボード | `←` `→` で前後の出来事、`+` `-` でズーム、`0` で全期間、`Esc` で閉じる |
| スマホ | 1本指で移動、2本指でピンチ拡大縮小、タップで詳細(下からのシート)。狭い画面ではレーン名を縦書きにして描画域を確保 |

## データ

`src/data/` 配下の TypeScript がデータの唯一の置き場所です。出来事は `events/<年>/<系列>.ts` に年 × 系列で分けて置き、`events/index.ts` は `node scripts/build-events-index.mjs` で再生成します。アプリ起動時に同じ配列を JSON として DuckDB-WASM に登録するので、SQL 側と描画側がずれることはありません。

```ts
// src/data/events/2024/si.ts
{
  id: 'si-11', threadId: 'si', date: '2024-02-24', weight: 2,
  title: 'TSMC熊本 JASM第1工場 開所式',
  body: '…',
  source: 'TSMC プレスリリース',
  sourceUrl: 'https://pr.tsmc.com/...',
  sourceTier: 'primary',
}
```

- `weight` は 3 = 節目、2 = 注目、1 = 小。マーカーの大きさに反映されます。
- `endDate` を持つ出来事は期間として横長のバーで描かれます。
- `sourceTier` は `primary`(政府官報、企業のプレスリリース・IR、公式声明)か `secondary`(通信社・主要メディア)。
- 因果リンクは `src/data/links/<起点の年>.ts` に `{ from, to, why }` で記述します。

出典URLはすべて取得して内容と日付を確認したものですが、リンク切れや事実の誤りに気づいたら Issue か PR をください。

## 開発

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # 型チェック + Vite ビルド (dist/)
pnpm quality      # codopsy による品質チェック
```

GitHub Pages へのデプロイは `.github/workflows/pages.yml` が `main` への push で行います。ビルド前に [codopsy](https://github.com/O6lvl4/codopsy) を `--fail-on-warning` で走らせ、品質ランク A を割ると失敗します。CI では codopsy を main の固定リビジョンからソースビルドしています(リリース v2.2.0 には TypeScript の型 import を未使用扱いする誤検出があり、修正が未リリースのため)。次のリリースが出たらバイナリ取得に戻せます。

## 技術

- React 19 + TypeScript + Vite 8
- SVG 描画(ライブラリなし)。レイアウトは `src/lib/layout.ts` に純関数として分離
- [DuckDB-WASM](https://github.com/duckdb/duckdb-wasm) 1.32 をバンドル同梱(CDN 依存なし)

## 設計の参照元

- Brehmer et al., *Timelines Revisited* (IEEE TVCG 2017) — 表現 × スケール × レイアウトの設計空間
- Plaisant & Shneiderman, *LifeLines* (1996) — スイムレーン型タイムライン
- ChronoZoom — セマンティックズーム
- Aeon Timeline — 系列と関係を持つ専用ツール
