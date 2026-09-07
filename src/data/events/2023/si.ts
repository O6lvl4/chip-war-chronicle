import type { TimelineEvent } from '../../../types';

export const EVENTS_2023_SI: TimelineEvent[] = [
  {
    id: 'si-34', threadId: 'si', date: '2023-08-08', weight: 2,
    title: 'TSMC ドレスデンにESMC設立',
    body: 'TSMCがBosch・Infineon・NXPと独ドレスデンに合弁ESMCを設立。TSMC70%出資、総投資100億ユーロ超で月4万枚の300mm工場を建て、2027年末の生産開始を計画した。',
    source: 'TSMC Form 6-K (SEC)',
    sourceUrl: 'https://www.sec.gov/Archives/edgar/data/1046179/000162828023027976/tsm-boardx20230808x6kx2.htm',
    sourceTier: 'primary',
  },
  {
    id: 'si-35', threadId: 'si', date: '2023-08-16', weight: 1,
    title: 'Intel、Tower買収を断念',
    body: 'Intelが2022年2月に合意したイスラエルTower Semiconductorの買収(54億ドル)を、中国当局の承認が得られず相互合意で解消。違約金3億5300万ドルを支払い、IDM 2.0の外部拡張策が一つ後退した。',
    source: 'Intel IR',
    sourceUrl: 'https://www.intc.com/news-events/press-releases/detail/1642/intel-and-tower-semiconductor-mutually-agree-to-terminate-acquisition-agreement',
    sourceTier: 'primary',
  },
  {
    id: 'si-10', threadId: 'si', date: '2023-08-29', weight: 3,
    title: 'Huawei Mate 60 Pro・SMIC 7nm',
    body: 'Huaweiが発表会なしにMate 60 Proを発売。搭載するKirin 9000SはSMICのN+2(7nm相当)プロセスでDUV露光により製造されており、輸出規制下での中国の先端ロジック製造能力を示して米国に衝撃を与えた。',
    source: 'TrendForce',
    sourceUrl: 'https://www.trendforce.com/news/2023/08/30/news-huawei-mate-60s-kirin-9000s-smic-production-old-tech-or-us-restriction-break/',
    sourceTier: 'secondary',
  },
];
