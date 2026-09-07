import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_PR: TimelineEvent[] = [
  {
    id: 'pr-31', threadId: 'pr', date: '2022-05-11', weight: 2,
    title: '経済安全保障推進法 成立',
    body: '経済安全保障推進法(令和4年法律第43号)が参院本会議で可決・成立、5月18日公布。半導体などの特定重要物資の安定供給確保、基幹インフラの事前審査、先端技術の官民協力、特許非公開の4本柱で構成される。',
    source: 'Wikipedia 日本語版',
    sourceUrl: 'https://ja.wikipedia.org/wiki/経済安全保障推進法',
    sourceTier: 'secondary',
  },
  {
    id: 'pr-4', threadId: 'pr', date: '2022-08-09', weight: 3,
    title: 'CHIPS and Science Act 署名',
    body: 'バイデン大統領がCHIPS法に署名。半導体製造・研究への527億ドルの連邦資金(うち製造補助390億ドル)と25%の投資税額控除を創設。TSMCやIntelの米国投資が加速。',
    source: 'White House Fact Sheet',
    sourceUrl: 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/08/09/fact-sheet-chips-and-science-act-will-lower-costs-create-jobs-strengthen-supply-chains-and-counter-china/',
    sourceTier: 'primary',
  },
  {
    id: 'pr-32', threadId: 'pr', date: '2022-08-26', weight: 2,
    title: 'A100/H100 対中輸出に許可要求',
    body: '米政府がNVIDIAに対し、A100と次期H100の中国(香港含む)・ロシア向け輸出に即日ライセンスを要求。NVIDIAは8-Kで四半期約4億ドルの中国売上への影響を開示し、10月の包括規制に先立ちAIチップ規制が始まった。',
    source: 'NVIDIA Form 8-K',
    sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581022000146/nvda-20220826.htm',
    sourceTier: 'primary',
  },
  {
    id: 'pr-5', threadId: 'pr', date: '2022-10-07', weight: 3,
    title: '対中先端半導体 輸出規制 大幅強化',
    body: '米商務省BISが先端半導体・製造装置の対中輸出規制を大幅強化。A100/H100級AIチップ、16/14nm以下ロジック・18nm以下DRAM・128層以上NANDの製造装置が対象。米国人による中国先端ファブ支援も禁止。',
    source: 'BIS Press Release',
    sourceUrl: 'https://www.bis.gov/press-release/commerce-implements-new-export-controls-advanced-computing-semiconductor-manufacturing-items-peoples',
    sourceTier: 'primary',
  },
];
