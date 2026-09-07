import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_GP: TimelineEvent[] = [
  {
    id: 'gp-3', threadId: 'gp', date: '2022-02-24', weight: 3,
    title: 'ロシア ウクライナ侵攻開始',
    body: 'ロシアがウクライナへの全面侵攻を開始。国連安保理緊急会合の最中にプーチン大統領が「特別軍事作戦」を宣言した。世界のネオンガス供給の大半を担うウクライナ産出が滞り、半導体製造ガスの供給リスクが急浮上。',
    source: 'UN News',
    sourceUrl: 'https://news.un.org/en/story/2022/02/1112592',
    sourceTier: 'primary',
  },
  {
    id: 'gp-30', threadId: 'gp', date: '2022-05-23', weight: 2,
    title: 'バイデン「台湾を軍事的に防衛」発言',
    body: '東京での日米首脳共同記者会見でバイデン大統領が、中国が台湾に侵攻した場合に軍事的に関与するかと問われ「イエス、それが我々の約束だ」と答弁。ホワイトハウスは政策変更ではないと釈明した。',
    source: 'PBS NewsHour (AP配信)',
    sourceUrl: 'https://www.pbs.org/newshour/politics/watch-biden-says-u-s-would-intervene-with-military-to-defend-taiwan',
    sourceTier: 'secondary',
  },
  {
    id: 'gp-4', threadId: 'gp', date: '2022-08-02', weight: 3,
    title: 'ペロシ米下院議長 台湾訪問',
    body: 'ナンシー・ペロシ下院議長が台湾を訪問し、CHIPS法を通じた経済協力と台湾防衛への議会の関与を表明。中国は即座に台湾周辺で大規模軍事演習を予告し、台湾有事リスクへの注目が再び高まる。',
    source: 'ペロシ議長事務所 声明',
    sourceUrl: 'https://pelosi.house.gov/news/press-releases/pelosi-statement-on-congressional-delegation-visit-to-taiwan',
    sourceTier: 'primary',
  },
  {
    id: 'gp-5', threadId: 'gp', date: '2022-08-04', endDate: '2022-08-07', weight: 2,
    title: '中国 台湾周辺 大規模軍事演習',
    body: '中国人民解放軍が台湾を取り囲む6海域で弾道ミサイル発射を含む実弾演習を実施。ミサイルの一部は日本のEEZ内に初めて落下し、台湾海峡の地政学的リスクを世界に再認識させた。',
    source: 'Al Jazeera',
    sourceUrl: 'https://www.aljazeera.com/amp/news/2022/8/4/china-to-start-major-military-drills-around-taiwan',
    sourceTier: 'secondary',
  },
  {
    id: 'gp-31', threadId: 'gp', date: '2022-11-14', weight: 2,
    title: 'バイデン・習 バリ島で初の対面会談',
    body: 'G20バリ・サミットに合わせバイデン大統領と習近平国家主席が就任後初めて対面で会談。台湾の現状変更に反対する米国の立場を伝えつつ、競争を衝突に至らせないための対話継続とブリンケン国務長官の訪中で一致した。',
    source: 'ホワイトハウス 会談要旨',
    sourceUrl: 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/11/14/readout-of-president-joe-bidens-meeting-with-president-xi-jinping-of-the-peoples-republic-of-china/',
    sourceTier: 'primary',
  },
];
