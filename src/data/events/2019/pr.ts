import type { TimelineEvent } from '../../../types';

export const EVENTS_2019_PR: TimelineEvent[] = [
  {
    id: 'pr-25', threadId: 'pr', date: '2019-05-15', weight: 1,
    title: '大統領令13873 ICT供給網の国家非常事態',
    body: 'トランプ大統領が大統領令13873に署名し、外国敵対勢力が関与する情報通信技術・サービスの取引を商務長官が禁止できる国家非常事態を宣言。翌日のHuaweiエンティティリスト追加と対をなす措置となった。',
    source: 'Federal Register (govinfo)',
    sourceUrl: 'https://www.govinfo.gov/content/pkg/FR-2019-05-17/html/2019-10538.htm',
    sourceTier: 'primary',
  },
  {
    id: 'pr-2', threadId: 'pr', date: '2019-05-16', weight: 3,
    title: 'Huawei エンティティリスト追加',
    body: '米商務省がHuaweiと26カ国の関連会社68社をエンティティリストに追加(5月16日発効、官報掲載は21日)。米国技術・部品の輸出に個別ライセンスが必要となり、グローバルサプライチェーンを直撃。',
    source: 'Davis Polk client update',
    sourceUrl: 'https://www.davispolk.com/insights/client-update/u-s-government-takes-aim-china-entity-list-additions-and-new-executive-order',
    sourceTier: 'secondary',
  },
  {
    id: 'pr-26', threadId: 'pr', date: '2019-06-24', weight: 1,
    title: '曙光・海光など5社 リスト追加',
    body: 'BISがスーパーコンピュータ関連の中曙光(Sugon)、海光(Higon)、成都海光2社、無錫江南計算技術研究所の5者をエンティティリストに追加。AMDのx86ライセンス合弁先を含み、HPC分野への規制が本格化した。',
    source: 'Federal Register (govinfo)',
    sourceUrl: 'https://www.govinfo.gov/content/pkg/FR-2019-06-24/html/2019-13245.htm',
    sourceTier: 'primary',
  },
];
