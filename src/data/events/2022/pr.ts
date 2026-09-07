import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_PR: TimelineEvent[] = [
  {
    id: 'pr-61', threadId: 'pr', date: '2022-02-08', weight: 2,
    title: '欧州委 European Chips Act を提案',
    body: '欧州委員会が半導体不足への対応と技術主権の強化を掲げ「欧州半導体法(European Chips Act)」の法案パッケージを提案。官民で430億ユーロ超を動員し、2030年に世界シェア20%を目指す目標を掲げた。法は2023年9月21日に発効した。',
    source: 'European Commission',
    sourceUrl: 'https://ec.europa.eu/commission/presscorner/detail/en/ip_22_729',
    sourceTier: 'primary',
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
