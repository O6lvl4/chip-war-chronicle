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
    id: 'jp-44', threadId: 'jp', date: '2022-06-17', weight: 2,
    title: 'JASM熊本計画 認定 最大4760億円助成',
    body: '経産省が改正5G促進法に基づき、TSMC子会社JASM(ソニー・デンソー出資)の特定半導体生産施設整備等計画を第1号として認定。熊本県菊陽町で12〜28nmロジック半導体を月5.5万枚生産する計画に対し、特定半導体基金から最大4760億円を助成する。国の半導体補助が初めて具体化した案件。',
    source: '経済産業省 認定特定半導体生産施設整備等計画',
    sourceUrl: 'https://www.meti.go.jp/policy/mono_info_service/joho/laws/semiconductor/semiconductor_plan.html',
    sourceTier: 'primary',
  },
  {
    id: 'jp-45', threadId: 'jp', date: '2022-09-30', weight: 2,
    title: '経済安保推進法 基本方針 閣議決定',
    body: '経済安全保障推進法に基づく全体の「基本方針」と、特定重要物資の安定供給確保および特定重要技術の研究開発に関する2つの基本指針を閣議決定。物資指定の要件(国民の生存・国民生活への不可欠性、外部依存、供給途絶の蓋然性)を定め、半導体などの政令指定と経済安保重要技術育成プログラムの運用が動き出した。',
    source: '内閣府 経済安全保障 基本方針・基本指針',
    sourceUrl: 'https://www.cao.go.jp/keizai_anzen_hosho/suishinhou/kihonhoshin.html',
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
    id: 'jp-46', threadId: 'jp', date: '2022-12-16', weight: 2,
    title: '国家安全保障戦略 閣議決定 防衛三文書',
    body: '国家安全保障戦略・国家防衛戦略・防衛力整備計画のいわゆる安保三文書を閣議決定。2027年度に防衛関係費をGDP比2%に引き上げる方針を示し、経済安全保障を安保戦略の柱に位置づけて、サプライチェーン強靱化、技術流出防止、能動的サイバー防御の導入検討を明記した。半導体を含む重要技術の保護育成が国家戦略に格上げされた。',
    source: '内閣官房 国家安全保障戦略について',
    sourceUrl: 'https://www.cas.go.jp/jp/siryou/221216anzenhoshou.html',
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
