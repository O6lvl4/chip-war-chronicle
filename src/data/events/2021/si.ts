import type { TimelineEvent } from '../../../types';

export const EVENTS_2021_SI: TimelineEvent[] = [
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
    id: 'si-30', threadId: 'si', date: '2021-11-09', weight: 3,
    title: 'TSMC 熊本工場(JASM)設立を発表',
    body: 'TSMCとソニーセミコンダクタソリューションズが熊本に製造子会社JASMを設立すると発表。投資額約70億ドル、2024年末までの生産開始を計画し、日本の半導体政策の中核案件となった。',
    source: 'ソニーセミコンダクタソリューションズ',
    sourceUrl: 'https://www.sony-semicon.com/en/news/2021/2021110901.html',
    sourceTier: 'primary',
  },
];
