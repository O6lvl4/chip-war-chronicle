import type { TimelineEvent } from '../../../types';

export const EVENTS_2023_MM: TimelineEvent[] = [
  {
    id: 'mm-7', threadId: 'mm', date: '2023-01-09', weight: 2,
    title: 'DRAM価格 下落幅縮小 底値圏へ',
    body: 'TrendForceが2023年第1四半期のDRAM価格下落率を13〜18%と予測し、下落ペースの鈍化を指摘。Micronなど各社の減産が価格下支えに働き、市況は底値圏に近づいた。',
    source: 'TrendForce プレスリリース',
    sourceUrl: 'https://www.trendforce.com/presscenter/news/20230109-11533.html',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-31', threadId: 'mm', date: '2023-04-27', weight: 2,
    title: 'Samsung 営業利益96%減 メモリ減産',
    body: 'Samsung電子の2023年第1四半期決算は売上高63.75兆ウォン（前四半期比10%減）、営業利益0.64兆ウォンと約14年ぶりの低水準。メモリ需要の低迷と顧客の在庫調整が響き、同社は同月にメモリ生産を「意味のある水準」まで減らす方針を示していた。',
    source: 'Samsung ニュースルーム',
    sourceUrl: 'https://news.samsungsemiconductor.com/global/samsung-electronics-announces-first-quarter-2023-results/',
    sourceTier: 'primary',
  },
  {
    id: 'mm-32', threadId: 'mm', date: '2023-07-26', weight: 2,
    title: 'FRB 利上げ最終 5.25〜5.50%',
    body: 'FOMCがFF金利の誘導目標を5.25〜5.50%へ0.25%引き上げ、2001年以来の高水準に。これが2022年3月から続いた利上げサイクル最後の引き上げとなり、その後は据え置きを経て2024年9月の利下げへ転じた。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20230726a.htm',
    sourceTier: 'primary',
  },
  {
    id: 'mm-8', threadId: 'mm', date: '2023-09-14', weight: 2,
    title: 'Arm Holdings NASDAQ上場',
    body: 'SoftBank傘下のArm HoldingsがNASDAQに上場。公開価格51ドルに対し初日終値は63.59ドルと約25%高で、2023年最大のIPOとなった。AI半導体設計の要としての地位を再評価された。',
    source: 'Arm ニュースリリース',
    sourceUrl: 'https://newsroom.arm.com/news/arm-announces-pricing-of-initial-public-offering',
    sourceTier: 'primary',
  },
];
