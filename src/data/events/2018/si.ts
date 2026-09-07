import type { TimelineEvent } from '../../../types';

export const EVENTS_2018_SI: TimelineEvent[] = [
  {
    id: 'si-2', threadId: 'si', date: '2018-04-01', weight: 3,
    title: 'TSMC 7nm (N7) 量産開始',
    body: 'TSMCがファウンドリとして初めて7nm FinFET(N7)の量産を2018年4月に開始。Apple A12などを皮切りに2018年中に40件超のテープアウトを獲得し、5nm・3nmへの投資を加速した。',
    source: 'TSMC ブログ (Celebrating One Billion 7nm Chips)',
    sourceUrl: 'https://www.tsmc.com/english/news-events/blog-article-20200801',
    sourceTier: 'primary',
  },
  {
    id: 'si-21', threadId: 'si', date: '2018-06-21', weight: 2,
    title: 'Intel CEOクルザニッチが辞任',
    body: 'IntelのBrian Krzanich CEOが社内規範違反を理由に辞任し、CFOのRobert Swanが暫定CEOに就任。10nm量産の度重なる遅延と重なり、Intelの製造優位が揺らぐ転機となった。',
    source: 'Intel Form 8-K (SEC)',
    sourceUrl: 'https://www.sec.gov/Archives/edgar/data/50863/000119312518199045/d598882d8k.htm',
    sourceTier: 'primary',
  },
  {
    id: 'si-22', threadId: 'si', date: '2018-08-03', weight: 1,
    title: 'TSMC工場がWannaCry亜種に感染',
    body: 'TSMCの台湾各工場で新規装置のソフト導入時のミスからWannaCry亜種が拡散し、製造装置が停止。8月6日までに全面復旧したが、第3四半期売上に約3%の影響が出た。',
    source: 'TSMC プレスリリース',
    sourceUrl: 'https://pr.tsmc.com/english/news/1969',
    sourceTier: 'primary',
  },
  {
    id: 'si-1', threadId: 'si', date: '2018-10-18', weight: 2,
    title: 'Samsung 7nm EUV (7LPP) 量産開始',
    body: 'Samsung Electronicsが EUV露光を用いた7nmプロセス「7LPP」の生産開始を発表。EUVをロジック半導体の量産に初適用し、面積効率40%向上・性能20%向上を掲げて微細化競争に先鞭をつけた。',
    source: 'Samsung Newsroom',
    sourceUrl: 'https://news.samsung.com/global/samsung-electronics-starts-production-of-euv-based-7nm-lpp-process',
    sourceTier: 'primary',
  },
];
