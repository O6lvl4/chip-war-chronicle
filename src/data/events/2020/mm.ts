import type { TimelineEvent } from '../../../types';

export const EVENTS_2020_MM: TimelineEvent[] = [
  {
    id: 'mm-25', threadId: 'mm', date: '2020-03-15', weight: 3,
    title: 'FRB 緊急利下げでゼロ金利・QE再開',
    body: 'FRBが日曜日に緊急会合を開き、FF金利の誘導目標を0〜0.25%へ1%引き下げ、国債5000億ドル・MBS2000億ドル以上の買入れを決定。パンデミックによる金融市場の混乱に対応し、その後の株価回復と半導体需要急拡大の土台となった。',
    source: 'FRB 声明',
    sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm',
    sourceTier: 'primary',
  },
  {
    id: 'mm-2', threadId: 'mm', date: '2020-03-16', weight: 3,
    title: 'COVID-19 株式市場暴落',
    body: 'パンデミック宣言から5日後、NYダウが1日で2997ドル（12.9%）安と1987年以来の下落率を記録。一方で在宅需要が半導体需要を押し上げ、後の供給不足の遠因となった。',
    source: 'PBS NewsHour / AP, 2020-03-16',
    sourceUrl: 'https://www.pbs.org/newshour/economy/dow-dives-2997-points-on-fears-pandemic-will-cause-recession',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-26', threadId: 'mm', date: '2020-08-19', weight: 1,
    title: 'NVIDIA データセンター売上がゲーム超え',
    body: 'NVIDIAの2021年度第2四半期決算は売上高38.7億ドルと過去最高。Mellanox買収とクラウドのAI需要でデータセンター売上（17.5億ドル、前年比167%増）が初めてゲーム売上（16.5億ドル）を上回り、収益構造の転換が鮮明になった。',
    source: 'NVIDIA ニュースリリース',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2021',
    sourceTier: 'primary',
  },
  {
    id: 'mm-3', threadId: 'mm', date: '2020-09-13', endDate: '2022-02-07', weight: 2,
    title: 'NVIDIA Arm買収 合意〜断念',
    body: 'NVIDIAがSoftBankからArmを400億ドルで買収すると発表。しかし米英EUの規制当局の承認が得られず、2022年2月7日に両社が契約解消を発表。Armは2023年のIPOへ向かう。',
    source: 'NVIDIA ニュースリリース',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-and-softbank-group-announce-termination-of-nvidias-acquisition-of-arm-limited',
    sourceTier: 'primary',
  },
];
