import type { TimelineEvent } from '../../../types';

export const EVENTS_2018_PR: TimelineEvent[] = [
  {
    id: 'pr-23', threadId: 'pr', date: '2018-04-16', weight: 2,
    title: 'ZTE 輸出禁止命令 発動',
    body: '米商務省BISが、2017年の和解合意に反して虚偽報告をしたとしてZTEへの米国製品・技術の輸出を禁じる拒否命令を発動。米国製半導体に依存するZTEは操業停止に追い込まれ、7月に罰金と経営刷新を条件に解除された。',
    source: 'Foley Hoag alert',
    sourceUrl: 'https://foleyhoag.com/news-and-insights/publications/alerts-and-updates/2018/april/bureau-of-industry-and-security-imposes-denial-of-export-privileges-against-zte/',
    sourceTier: 'secondary',
  },
  {
    id: 'pr-1', threadId: 'pr', date: '2018-08-13', weight: 2,
    title: 'FIRRMA / ECRA 署名',
    body: 'トランプ大統領が2019年度国防権限法(Public Law 115-232)に署名。外国投資リスク審査近代化法(FIRRMA)と輸出管理改革法(ECRA)を含み、対中投資・輸出管理の法的根拠が整備される。',
    source: 'Public Law 115-232 (govinfo)',
    sourceUrl: 'https://www.govinfo.gov/app/details/PLAW-115publ232',
    sourceTier: 'primary',
  },
  {
    id: 'pr-24', threadId: 'pr', date: '2018-10-30', weight: 2,
    title: '福建晋華 エンティティリスト追加',
    body: '米商務省が中国DRAM新興企業の福建晋華集成電路(JHICC)をエンティティリストに追加、10月30日発効。米国製装置の供給が止まり、Micronの営業秘密をめぐる係争中だった同社のDRAM量産計画は事実上頓挫した。',
    source: 'Baker McKenzie Global Import Blog',
    sourceUrl: 'https://globalimportblog.bakermckenzie.com/2018/11/02/us-bis-adds-fujian-jinhua-integrated-circuit-company-to-entity-list/',
    sourceTier: 'secondary',
  },
];
