import type { TimelineEvent } from '../../../types';

export const EVENTS_2019_MM: TimelineEvent[] = [
  {
    id: 'mm-23', threadId: 'mm', date: '2019-03-05', weight: 2,
    title: 'DRAM契約価格 2011年以来の急落',
    body: 'TrendForceによると2019年第1四半期のDRAM契約価格は四半期で約30%下落し、2011年以来最大の下げ幅となった。サプライヤー在庫は約6週間分に膨らみ、IntelのCPU不足でPC向け需要も伸びず、値下げが需要を喚起しない状況が続いた。',
    source: 'TrendForce プレスリリース',
    sourceUrl: 'https://www.trendforce.com/presscenter/news/20190305-10109.html',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-24', threadId: 'mm', date: '2019-07-31', weight: 2,
    title: 'FRB 10年ぶり利下げ',
    body: 'FOMCがFF金利の誘導目標を2.00〜2.25%へ0.25%引き下げ、2008年以来約10年ぶりの利下げに踏み切った。世界経済の減速と貿易摩擦、抑制されたインフレを理由に挙げ、半導体を含むテック株の追い風となった。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20190731a.htm',
    sourceTier: 'primary',
  },
];
