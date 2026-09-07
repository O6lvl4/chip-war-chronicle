import type { TimelineEvent } from '../../../types';

export const EVENTS_2024_MM: TimelineEvent[] = [
  {
    id: 'mm-13', threadId: 'mm', date: '2024-02-22', weight: 3,
    title: '日経平均 34年ぶり史上最高値',
    body: '日経平均が終値3万9098円68銭となり、1989年12月29日の3万8915円を34年2カ月ぶりに更新。前日のNVIDIA好決算を受けた半導体関連株の買いと円安が押し上げた。',
    source: '日本経済新聞',
    sourceUrl: 'https://www.nikkei.com/article/DGXZQOFL220S70S4A220C2000000/',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-33', threadId: 'mm', date: '2024-03-04', weight: 2,
    title: '日経平均 史上初の4万円台',
    body: '日経平均が終値4万109円23銭となり、初めて4万円の大台に乗せた。前週の米ハイテク株高と生成AIへの期待からアドバンテストや東京エレクトロンなど半導体関連株に買いが集中する一方、プライム市場の約7割の銘柄は下落した。',
    source: '日本経済新聞',
    sourceUrl: 'https://www.nikkei.com/article/DGXZQOUB044JX0U4A300C2000000/',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-34', threadId: 'mm', date: '2024-03-19', weight: 3,
    title: '日銀 マイナス金利解除 17年ぶり利上げ',
    body: '日銀が金融政策の枠組みを変更し、マイナス金利政策とイールドカーブ・コントロールを終了。無担保コール翌日物金利を0〜0.1%程度に誘導し、2007年以来17年ぶりの利上げとなった。ETF・J-REITの新規買入れも終了した。',
    source: '日本銀行 金融政策の枠組みの見直し',
    sourceUrl: 'https://www.boj.or.jp/mopo/mpmdeci/mpr_2024/k240319a.pdf',
    sourceTier: 'primary',
  },
  {
    id: 'mm-9', threadId: 'mm', date: '2024-06-18', weight: 3,
    title: 'NVIDIA 時価総額 世界首位に',
    body: 'NVIDIAの時価総額が3.34兆ドルに達し、MicrosoftとAppleを抜いて世界首位に。AI GPU需要に牽引されたデータセンター売上の急成長が評価された。',
    source: 'Al Jazeera / Reuters, 2024-06-19',
    sourceUrl: 'https://www.aljazeera.com/economy/2024/6/19/nvidia-becomes-worlds-most-valuable-company-dethroning-microsoft',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-14', threadId: 'mm', date: '2024-07-31', endDate: '2024-08-05', weight: 3,
    title: '日銀利上げ 0.25%と8月5日暴落',
    body: '日銀が政策金利を0.25%程度へ引き上げ、国債買入れ減額も決定。急速な円高と米景気懸念が重なり、8月5日に日経平均は4451円安（−12.4%）と過去最大の下げ幅を記録した。',
    source: '日本銀行 金融市場調節方針の変更',
    sourceUrl: 'https://www.boj.or.jp/mopo/mpmdeci/mpr_2024/k240731a.pdf',
    sourceTier: 'primary',
  },
  {
    id: 'mm-36', threadId: 'mm', date: '2024-09-18', weight: 2,
    title: 'FRB 4年半ぶり利下げ 0.5%',
    body: 'FOMCがFF金利の誘導目標を4.75〜5.00%へ0.5%引き下げ、2020年3月以来の利下げに転じた。インフレ目標への進展と雇用リスクの均衡を理由とし、緩和サイクル入りが半導体・AI関連株のバリュエーションを支えた。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20240918a.htm',
    sourceTier: 'primary',
  },
];
