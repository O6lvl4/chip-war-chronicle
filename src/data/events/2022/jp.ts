import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_JP: TimelineEvent[] = [
  {
    id: 'jp-1', threadId: 'jp', date: '2022-05-11', weight: 2,
    title: '経済安全保障推進法 成立',
    body: '経済安全保障推進法(令和4年法律第43号)が参院本会議で可決・成立、5月18日公布。半導体などの特定重要物資の安定供給確保、基幹インフラの事前審査、先端技術の官民協力、特許非公開の4本柱で構成される。',
    source: '参議院 議案情報 (第208回国会)',
    sourceUrl: 'https://www.sangiin.go.jp/japanese/joho1/kousei/gian/208/meisai/m208080208037.htm',
    sourceTier: 'primary',
  },
  {
    id: 'jp-10', threadId: 'jp', date: '2022-12-02', weight: 2,
    title: '令和4年度第2次補正 成立 半導体1.3兆円',
    body: '令和4年度一般会計補正予算(第2号)が参院本会議で可決・成立。半導体関連で約1.3兆円を措置し、特定半導体基金の積み増しに加え、ポスト5G基金による次世代半導体(2nm)の研究開発支援や、経済安保推進法に基づく供給確保支援を可能にした。',
    source: '参議院 議案情報',
    sourceUrl: 'https://www.sangiin.go.jp/japanese/joho1/kousei/gian/210/meisai/m210150210001.htm',
    sourceTier: 'primary',
  },
  {
    id: 'jp-11', threadId: 'jp', date: '2022-12-20', weight: 2,
    title: '特定重要物資に半導体を指定 政令決定',
    body: '経済安全保障推進法に基づき特定重要物資を定める政令を閣議決定。半導体、蓄電池、永久磁石、重要鉱物、クラウドプログラム、工作機械・産業用ロボットなど11物資を指定し、所管大臣の安定供給確保取組方針の下で事業者の供給確保計画を認定・助成する制度が動き出した。',
    source: '内閣府 経済安全保障(重要物資の安定的な供給の確保に関する制度)',
    sourceUrl: 'https://www.cao.go.jp/keizai_anzen_hosho/suishinhou/supply_chain/supply_chain.html',
    sourceTier: 'primary',
  },
];
