import type { TimelineEvent } from '../../../types';

export const EVENTS_2021_SI: TimelineEvent[] = [
  {
    id: 'si-71', threadId: 'si', date: '2021-01-26', weight: 1,
    title: 'Micron 1α DRAMを業界初出荷',
    body: 'Micronが1α(1アルファ)ノードのDRAMの出荷開始を発表。前世代1zより集積度を40%高めモバイル向けで消費電力15%減。広島工場が量産拠点となり、日本がMicronの先端DRAM製造の中核であることを示した。',
    source: 'Micron IR',
    sourceUrl: 'https://investors.micron.com/news-releases/news-release-details/micron-delivers-industrys-first-1a-dram-technology',
    sourceTier: 'primary',
  },
  {
    id: 'si-28', threadId: 'si', date: '2021-03-19', weight: 2,
    title: 'ルネサス那珂工場で火災',
    body: 'ルネサスの那珂工場N3棟(300mmライン)でめっき装置から出火し生産が停止。車載マイコンの主力拠点であったため、世界的な自動車向けチップ不足を一段と深刻化させた。',
    source: 'ルネサス エレクトロニクス',
    sourceUrl: 'https://www.renesas.com/en/about/press-room/notice-regarding-semiconductor-manufacturing-factory-naka-factory-fire',
    sourceTier: 'primary',
  },
  {
    id: 'si-29', threadId: 'si', date: '2021-03-23', weight: 3,
    title: 'Intel IDM 2.0戦略を発表',
    body: '新CEOのPat GelsingerがIDM 2.0を発表。アリゾナに2工場を200億ドルで新設し、Intel Foundry Servicesを立ち上げて外部顧客向けファウンドリ事業に参入する方針を示した。',
    source: 'Intel IR',
    sourceUrl: 'https://www.intc.com/news-events/press-releases/detail/1451/intel-ceo-pat-gelsinger-announces-idm-2-0-strategy',
    sourceTier: 'primary',
  },
  {
    id: 'si-89', threadId: 'si', date: '2021-08-19', weight: 2,
    title: 'Tesla AI Day で学習チップ Dojo D1 を発表',
    body: 'Teslaが自社設計の学習チップD1を公開。7nmで645mm²、500億トランジスタ、BF16で362TFLOPS。25個で1タイル、120タイルのExaPodで1.1エクサFLOPSとした。FSDチップに続く2つ目の自社シリコンで、マスク氏は「来年には稼働する」と述べた。',
    source: 'CNBC',
    sourceUrl: 'https://www.cnbc.com/2021/08/19/tesla-unveils-dojo-d1-chip-at-ai-day.html',
    sourceTier: 'secondary',
  },
  {
    id: 'si-30', threadId: 'si', date: '2021-11-09', weight: 3,
    title: 'TSMC 熊本工場(JASM)設立を発表',
    body: 'TSMCとソニーセミコンダクタソリューションズが熊本に製造子会社JASMを設立すると発表。投資額約70億ドル、2024年末までの生産開始を計画し、日本の半導体政策の中核案件となった。',
    source: 'ソニーセミコンダクタソリューションズ',
    sourceUrl: 'https://www.sony-semicon.com/en/news/2021/2021110901.html',
    sourceTier: 'primary',
  },
  {
    id: 'si-49', threadId: 'si', date: '2021-11-24', weight: 2,
    title: 'Samsung テキサス州テイラーに新工場',
    body: 'Samsung電子がテキサス州テイラーに170億ドルを投じて先端ロジック半導体の新工場を建設すると発表。同社の米国投資として過去最大で、2022年前半に着工し2024年後半の稼働を目指すとした。後にTesla向けAI6チップの生産拠点となる。',
    source: 'Samsung Newsroom',
    sourceUrl: 'https://news.samsung.com/global/samsung-electronics-announces-new-advanced-semiconductor-fab-site-in-taylor-texas',
    sourceTier: 'primary',
  },
];
