---
name: chronicle-update
description: Chip War Chronicle のタイムラインを最新の日付まで更新する。6系列(半導体産業・政策規制・地政学・AI需要・市場マクロ・日本の法制)の空白期間を調べ、出典URL付きの出来事と因果リンクを src/data/ に追加する。毎日の定期更新にも、久しぶりの穴埋めにも使う。Use when asked to update / refresh / collect the latest data for this timeline, or 「データ更新」「最新にして」.
---

# Chip War Chronicle データ更新

6系列のタイムラインに、前回更新以降の出来事を足す。データの唯一の置き場所は `src/data/` の TypeScript で、投入は必ず `scripts/` のツール経由で行う（手でファイルを編集しない）。

## 1. 穴を測る

```bash
node scripts/data-status.mjs
```

系列ごとの **最終更新日・経過日数・次に使える id**、直近60日の出来事一覧、整合性の結果が出る。ここで出た「次のid」を採番に使い、「直近60日の出来事」で重複を防ぐ。

経過日数が大きい系列から埋める。系列ごとに経過が違うのが普通で、`pr` と `jp` は動きが少ないので遅れやすい。

## 2. 調べる

系列ごとに、その系列の**最終更新日の翌日から今日まで**を対象に WebSearch する。1系列あたり2〜4クエリ。日本語と英語の両方を試す（`jp`・`mm` の日本部分は日本語、それ以外は英語のほうが当たる）。

| 系列 | 見るもの |
|---|---|
| `si` 半導体産業 | TSMC・Samsung・SK hynix・Intel・Micron・AMD・NVIDIA・ASML の量産開始、工場投資、買収、供給契約、月次売上。TSMC の月次売上は毎月10日前後 |
| `pr` 政策・規制 | BIS の規則・エンティティリスト、232条と関税の布告、EU Chips Act、中国商務部の輸出管制、日本の産業政策文書 |
| `gp` 地政学 | 米中首脳・貿易統計（中国税関は毎月7〜8日前後）、台湾海峡、中東とエネルギー、レアアース |
| `ai` AI・需要 | モデル発表、計算契約・データセンター投資、大手の設備投資計画、四半期決算 |
| `mm` 市場・マクロ | FOMC・日銀の決定、日経平均と SOX の節目、メモリ契約価格（TrendForce）、為替 |
| `jp` 日本の法制 | 成立した法律・改正法、閣議決定・閣議了解、経済安保推進法に基づく認定、予算 |

定点で当たる一次情報源:

- https://www.bis.gov/news-updates
- https://www.federalreserve.gov/newsevents/pressreleases/ (FOMC)
- https://www.boj.or.jp/mopo/mpmdeci/state_2026/index.htm
- https://pr.tsmc.com/english/news
- https://www.meti.go.jp/press/ ・ https://www.mof.go.jp/
- https://www.whitehouse.gov/fact-sheets/
- https://www.anthropic.com/news ・ https://nvidianews.nvidia.com ・ https://ir.amd.com ・ https://www.intc.com
- https://www.trendforce.com/presscenter/news (メモリ価格・ノード別売上)

## 3. 採否と書き方

**入れる**: 日付が特定できて、出典URLがあり、半導体・AI・その周りの政治経済に効いた出来事。
**入れない**: 日付があいまいなもの、見通し・予想だけの記事、同じ話の続報（既存の出来事に含まれるもの）、未来の出来事。

未来のことは「発表された」という事実として**発表日**に置く（例: 9月24日の首脳会談が7月23日に発表 → date は `2026-07-23`、title は「習近平の9月24日訪米が決まる」）。

- `weight`: 3 = 節目（規制の発動、量産開始、首脳会談、政策金利の変更、記録更新）、2 = 注目、1 = 小。年あたり weight 3 は10件前後に収める。
- `sourceTier`: `primary` = 政府官報・省庁・中央銀行・企業のプレスリリースとIR、`secondary` = 通信社・メディア・調査会社。
- `endDate`: 数日〜数か月にわたる出来事だけ（会議・演習・期間限定の措置）。
- `body`: 事実と数字だけを100〜150字。憶測・評価・見通しを書かない。既存の出来事の書き方に合わせる。
### 系列の切り分け

**`jp` は「日本の法制」であって「日本のこと全般」ではない。** 日本の話でも、法・政令・閣議の形を取っていないものは `jp` に入れない。

| 迷う組み合わせ | 判断 | 前例 |
|---|---|---|
| 日本の法律の成立・改正・施行、政令、閣議決定、閣議了解、政府の指針・戦略文書 | `jp` | jp-1, jp-11, jp-28, jp-60 |
| 個別の企業・事業者への認定・選定・支援決定、省庁の概算要求、産業政策 | `pr` | pr-13, pr-91, pr-137, pr-141 |
| 国会で成立した予算・補正予算、閣議決定した予算政府案 | `jp`（立法・閣議の行為だから） | jp-2, jp-14 |
| 各国の選挙、政権発足、首脳会談、軍事演習、攻撃、通商合意 | `gp` | gp-11, gp-20, gp-47 |
| 行政機構の設置、規制の発動・緩和、関税、輸出管理、調達禁止、政府による企業への介入 | `pr` | pr-128, pr-132, pr-136 |
| 貿易統計のうち、輸出規制の効き目を示すもの | `gp` | gp-86 |
| 企業の製品開発・量産・工場投資・供給契約・買収 | `si` | si-9, si-83 |
| AIモデル、計算契約、データセンター投資、AIラボの資金調達 | `ai` | ai-16, ai-61, ai-116 |
| 上場、時価総額、決算、株価、株価指数、金利、為替、価格 | `mm` | mm-91〜mm-99 |
| 災害・事故による工場停止 | `si` | si-28, si-37, si-94 |

### よくある取り違え

一度やって直したものを並べる。**同じ型の出来事が2つの系列に散らないこと**が、個々の割り当ての正しさより大事。

- **どの国の法律・規制措置でも `pr`。** `jp` は日本の法制だけ、`gp` は国家間の関係だけ。EU AI法・英国のHuawei排除・オランダのNexperia介入・日本の対韓輸出管理を、それぞれ `ai` `gp` `si` `jp` に置いてしまった。全部 `pr`。
- **`jp` は「日本の法制」であって「日本のこと全般」ではない。** 省庁の概算要求や支援額の承認は法でも閣議でもないので `pr`。日本の選挙や首相就任は `gp`。
- **法の制定は `jp`、法の執行は `pr`。** これが一番間違えやすい。JASM熊本・Micron広島・タワーセミコンダクターの計画認定は、経済安保推進法や5G促進法という法律「に基づく」処分なので `jp` に見えるが、特定の一社に助成額を決めた行政処分であって法制ではない。`jp` に入るのは法律・政令・閣議決定・国会の予算議決・一般に向けた政府の指針まで。
- **企業の話でも市場の数字は `mm`。** 時価総額・決算・株価・上場は、対象が半導体企業でも `mm`。NVIDIAの時価総額だけ `ai` に置いて、TSMCの時価総額は `mm`、という状態を作らない。
- **買収は完了も断念も `si`。** 規制当局の不承認が理由でも、出来事の主語は企業なので `si`。
- **メモリ・チップの製品開発と量産は `si`。** AI向けであっても製品は `si`、需要と計算契約が `ai`。

判断に迷ったら、その系列の既存の出来事を10件ほど眺めて、並べて違和感がないかで決める。`node scripts/data-status.mjs` の直近一覧と、下のコマンドで系列全体を一覧できる。

```bash
node -e 'const fs=require("fs"),R="src/data/events";for(const y of fs.readdirSync(R).filter(d=>/^\d{4}$/.test(d)).sort()){const p=`${R}/${y}/${process.argv[1]}.ts`;if(!fs.existsSync(p))continue;for(const b of fs.readFileSync(p,"utf8").split(/\n(?=  \{)/)){const g=r=>(b.match(r)||[])[1];if(!g(/id: .([a-z-\d]+)./))continue;console.log(g(/ date: .([0-9-]+)./),g(/id: .([a-z-\d]+)./),g(/title: .(.*).,\n/));}}' pr
```

出来事を別の系列へ移すときは、id が系列名を含むので振り直しとリンクの張り替えが要る。手でやらず、`scripts/remove-events.mjs` で消して `insert-events.mjs` で入れ直し、`add-links.mjs` でリンクを張り直す。

出典URLは必ず WebFetch で開いて日付と中身を確認する。403 が返るサイト（METI・TSMC など bot を弾くもの）は `curl -sS -o /dev/null -w '%{http_code}' -L -A 'Mozilla/5.0' <url>` で存在だけ確認し、内容は検索結果で裏を取る。

## 4. 投入

系列ごとに JSON 配列を作り、`insert-events.mjs` に流す。id は手順1の「次のid」から連番（日付順ではない）。

```bash
node scripts/insert-events.mjs si < /tmp/si.json    # 年ファイルへ振り分けて日付順に並べ直す
node scripts/add-links.mjs < /tmp/links.json        # 両端の id と日付順を検証して起点の年のファイルへ
node scripts/build-events-index.mjs                 # events/index.ts と links/index.ts を再生成
```

`insert-events.mjs` は `date` の年から置き場所を決めるので、年をまたいでも1回で流せる。`add-links.mjs` は id が存在しない・時間をさかのぼる・既に同じペアがあるリンクを飛ばして最後に報告する（飛ばされたものは必ず読む）。

## 5. 因果リンクを張る

新しい出来事は既存の何かの結果か原因になっているはず。**1件あたり0〜2本**を目安に張る。

- `from` の日付は必ず `to` 以前。
- **系列をまたぐリンクを優先する**。このタイムラインの価値は絡み合いを見せることにあり、同系列内のリンクだけ増やしても意味が薄い。現状は8割が系列内で、`gp → pr → si` の上流方向は張られているが `mm` から外に出るリンクが少ない。
- `why` は「AがBを引き起こした筋道」を1文で書く。単なる時系列の並びをリンクにしない。

## 6. 検証

```bash
node scripts/data-status.mjs          # 整合性に問題があれば終了コード 1
./node_modules/.bin/tsc --noEmit      # 型チェック
pnpm quality                          # codopsy (CI が --fail-on-warning で走らせる)
```

`data-status.mjs` は重複 id・年フォルダと date の不一致・sourceUrl 欠落・未来の日付・リンクの参照切れ・逆行リンク・リンクの置き場所違いを見る。

## 7. コミット

```
データ更新: 2026-09-09時点 出来事+20、因果リンク+19

<系列ごとに1行で、何を足したか>
```
