import type { TimelineEvent } from '../../../types';

export const EVENTS_2019_MM: TimelineEvent[] = [
  {
    id: 'mm-68', threadId: 'mm', date: '2019-01-02', weight: 2,
    title: 'Apple 売上見通しを下方修正',
    body: 'AppleのクックCEOが投資家宛書簡で2019年度第1四半期の売上見通しを約840億ドルに引き下げ(従来890〜930億ドル)。中国経済の減速と米中貿易摩擦でiPhone需要が落ち込んだと説明。翌日の株価は約10%安となり、半導体サプライヤー株も連れ安した。',
    source: 'Apple Newsroom',
    sourceUrl: 'https://www.apple.com/newsroom/2019/01/letter-from-tim-cook-to-apple-investors/',
    sourceTier: 'primary',
  },
  {
    id: 'mm-69', threadId: 'mm', date: '2019-02-04', weight: 2,
    title: '2018年半導体市場 4688億ドルで最高',
    body: 'SIA(米半導体工業会)は2018年の世界半導体売上高が前年比13.7%増の4688億ドルと過去最高になったと発表。メモリが牽引し初めて4000億ドルを超えた。ただし年末にかけ月次売上は減速し、2019年の下降サイクル入りを示唆していた。',
    source: 'SIA プレスリリース',
    sourceUrl: 'https://www.semiconductors.org/global-semiconductor-sales-increase-13-7-percent-to-468-8-billion-in-2018/',
    sourceTier: 'primary',
  },
  {
    id: 'mm-23', threadId: 'mm', date: '2019-03-05', weight: 2,
    title: 'DRAM契約価格 2011年以来の急落',
    body: 'TrendForceによると2019年第1四半期のDRAM契約価格は四半期で約30%下落し、2011年以来最大の下げ幅となった。サプライヤー在庫は約6週間分に膨らみ、IntelのCPU不足でPC向け需要も伸びず、値下げが需要を喚起しない状況が続いた。',
    source: 'TrendForce プレスリリース',
    sourceUrl: 'https://www.trendforce.com/presscenter/news/20190305-10109.html',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-70', threadId: 'mm', date: '2019-04-30', weight: 2,
    title: 'Samsung 営業利益60%減 メモリ急落',
    body: 'Samsung電子の2019年第1四半期は売上高52.4兆ウォン、営業利益6.2兆ウォンと前年同期(15.6兆ウォン)から60%減。半導体部門の営業利益は4.12兆ウォンに落ち込み、DRAM・NAND価格の急落と顧客の在庫調整が直撃。メモリ・スーパーサイクルの終焉を決定づけた。',
    source: 'Samsung Newsroom',
    sourceUrl: 'https://news.samsung.com/global/samsung-electronics-announces-first-quarter-2019-results',
    sourceTier: 'primary',
  },
  {
    id: 'mm-71', threadId: 'mm', date: '2019-06-25', weight: 2,
    title: 'Micron 売上39%減 設備投資削減へ',
    body: 'Micronの2019年度第3四半期売上高は47.9億ドルと前年同期比38.6%減。メモリ価格下落を受け、メロートラCEOは2020年度の設備投資削減と生産調整で需給改善を図ると表明。Huawei向け出荷を一部再開したとも説明し、翌日の株価は約13%高となった。',
    source: 'Micron プレスリリース (GlobeNewswire)',
    sourceUrl: 'https://www.globenewswire.com/news-release/2019/06/25/1874146/0/en/Micron-Technology-Inc-Reports-Results-for-the-Third-Quarter-of-Fiscal-2019.html',
    sourceTier: 'primary',
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
