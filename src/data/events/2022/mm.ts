import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_MM: TimelineEvent[] = [
  {
    id: 'mm-11', threadId: 'mm', date: '2022-03-16', weight: 3,
    title: 'FRB 利上げ開始 0.25%引き上げ',
    body: 'FOMCがFF金利の誘導目標を0.25〜0.50%に引き上げ、2018年以来の利上げサイクルを開始。急速な金融引き締めは高PERの半導体・テック株のバリュエーション圧縮を招いた。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20220316a.htm',
    sourceTier: 'primary',
  },
  {
    id: 'mm-29', threadId: 'mm', date: '2022-06-15', weight: 2,
    title: 'FRB 0.75%利上げ 28年ぶり大幅',
    body: 'FOMCがFF金利の誘導目標を1.50〜1.75%へ0.75%引き上げ、1994年以来の大幅利上げを決定。インフレ抑制へ追加利上げを示唆し、保有証券の縮小も継続。金利上昇でメモリ・GPU需要の減速と半導体株の下落が続いた。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20220615a.htm',
    sourceTier: 'primary',
  },
  {
    id: 'mm-12', threadId: 'mm', date: '2022-09-29', weight: 2,
    title: 'Micron 設備投資を約50%削減',
    body: 'Micronが2022年度決算で、需給悪化への対応として2023年度の製造装置投資を前年比約50%削減すると表明。メモリ各社の減産・投資抑制が本格化し、下降サイクルの底入れを模索し始めた。',
    source: 'Micron 8-K (SEC)',
    sourceUrl: 'https://www.sec.gov/Archives/edgar/data/723125/000072312522000044/a2022q4ex991-pressrelease.htm',
    sourceTier: 'primary',
  },
  {
    id: 'mm-6', threadId: 'mm', date: '2022-10-14', weight: 2,
    title: 'NVIDIA 株価 2022年安値',
    body: 'NVIDIA株が2022年の最安値（分割調整後11.20ドル）を付け、年初来約51%安、2021年11月高値からは約66%安に。ゲーミングGPU需要の失速と対中輸出規制が重なった。この後AI需要で急回復。',
    source: 'StatMuse (NASDAQ 株価データ)',
    sourceUrl: 'https://www.statmuse.com/money/ask/nvidia-stock-price-lowest-in-2022',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-30', threadId: 'mm', date: '2022-12-20', weight: 2,
    title: '日銀 YCC修正 長期金利上限0.5%へ',
    body: '日銀が10年物国債利回りの変動幅を±0.25%程度から±0.5%程度へ拡大（全員一致）。市場機能の改善が目的とされたが、事実上の利上げと受け止められ円が急伸、日本株は下落した。大規模緩和修正の第一歩となった。',
    source: '日本銀行 当面の金融政策運営について',
    sourceUrl: 'https://www.boj.or.jp/en/mopo/mpmdeci/state_2022/k221220a.htm',
    sourceTier: 'primary',
  },
];
