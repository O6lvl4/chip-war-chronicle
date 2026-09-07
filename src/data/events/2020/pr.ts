import type { TimelineEvent } from '../../../types';

export const EVENTS_2020_PR: TimelineEvent[] = [
  {
    id: 'pr-9', threadId: 'pr', date: '2020-05-15', weight: 3,
    title: '対Huawei FDPR 拡大',
    body: '米商務省BISが外国直接製品ルール(FDPR)を改正し、米国製ソフト・装置で設計・製造された海外製半導体のHuawei向け供給を規制。TSMCなど非米国ファウンドリからの調達路を断つ。',
    source: 'Covington & Burling alert',
    sourceUrl: 'https://www.cov.com/en/news-and-insights/insights/2020/05/commerce-department-amends-foreign-produced-direct-product-rule-further-restricting-transfers-to-huawei/',
    sourceTier: 'secondary',
  },
  {
    id: 'pr-27', threadId: 'pr', date: '2020-08-17', weight: 2,
    title: 'Huawei FDPR 再拡大・38社追加',
    body: 'BISがHuawei向け外国直接製品ルールを再度拡大し、Huaweiが購入者・最終需要者となる全ての外国製品に適用。21カ国の関連会社38社を追加してリスト掲載は計152社となり、汎用半導体の供給路も塞がれた。',
    source: 'Crowell International Trade Insights',
    sourceUrl: 'https://www.internationaltradeinsights.com/2020/08/u-s-adds-38-new-huawei-affiliates-to-entity-list-while-again-expanding-foreign-produced-direct-product-rule/',
    sourceTier: 'secondary',
  },
  {
    id: 'pr-28', threadId: 'pr', date: '2020-12-18', weight: 3,
    title: 'SMIC エンティティリスト追加',
    body: 'BISが中国最大手ファウンドリSMICと関連10社を含む77者をエンティティリストに追加。10nm以下の先端ノード製造に固有の品目は原則不許可とし、軍民融合との関係を理由に中国の先端ロジック内製化を直接標的とした。',
    source: 'Crowell International Trade Insights',
    sourceUrl: 'https://www.internationaltradeinsights.com/2020/12/bis-adds-over-70-new-companies-to-the-entity-list-including-smic/',
    sourceTier: 'secondary',
  },
];
