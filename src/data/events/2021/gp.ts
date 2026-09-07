import type { TimelineEvent } from '../../../types';

export const EVENTS_2021_GP: TimelineEvent[] = [
  {
    id: 'gp-28', threadId: 'gp', date: '2021-03-18', weight: 1,
    title: '米中 アンカレッジ会談で応酬',
    body: 'バイデン政権下で初の米中高官対面会談がアラスカ州アンカレッジで開かれ、ブリンケン国務長官と楊潔篪政治局員が冒頭から新疆・香港・台湾などを巡り公然と非難を応酬。米中関係の厳しさが改めて示された。',
    source: 'PBS NewsHour (AP配信)',
    sourceUrl: 'https://www.pbs.org/newshour/politics/u-s-china-spar-in-first-face-to-face-meeting-under-biden',
    sourceTier: 'secondary',
  },
  {
    id: 'gp-29', threadId: 'gp', date: '2021-04-16', weight: 2,
    title: '日米首脳声明 台湾海峡に言及',
    body: '菅首相とバイデン大統領の共同声明が「台湾海峡の平和と安定の重要性」を明記。日米首脳文書としては1969年以来の台湾言及で、半導体などの機微なサプライチェーンでの協力も約束した。',
    source: 'ホワイトハウス 日米共同首脳声明',
    sourceUrl: 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2021/04/16/u-s-japan-joint-leaders-statement-u-s-japan-global-partnership-for-a-new-era/',
    sourceTier: 'primary',
  },
  {
    id: 'gp-8', threadId: 'gp', date: '2021-09-15', weight: 1,
    title: 'AUKUS 安保枠組み 創設',
    body: '米英豪が新たな安全保障パートナーシップ「AUKUS」を創設。豪州への原子力潜水艦技術移転に加え、AI・量子・サイバーなど先端技術協力を含み、インド太平洋の安保秩序に影響。',
    source: 'ホワイトハウス 共同首脳声明',
    sourceUrl: 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2021/09/15/joint-leaders-statement-on-aukus/',
    sourceTier: 'primary',
  },
];
