import type { TimelineEvent } from '../../../types';

export const EVENTS_2023_JP: TimelineEvent[] = [
  {
    id: 'jp-48', threadId: 'jp', date: '2023-04-28', weight: 1,
    title: '基幹インフラ・特許非公開 基本指針 閣議決定',
    body: '経済安全保障推進法の残る2制度、基幹インフラ役務の安定的提供確保と特許出願非公開に関する基本指針を閣議決定。電気・通信・金融など14分野の事業者に重要設備導入の事前届出・審査を課す基準と、安全保障上機微な発明の出願を非公開とする保全審査の考え方を定め、法の4本柱すべての運用準備が整った。',
    source: '内閣府 経済安全保障 基本方針・基本指針',
    sourceUrl: 'https://www.cao.go.jp/keizai_anzen_hosho/suishinhou/kihonhoshin.html',
    sourceTier: 'primary',
  },
  {
    id: 'jp-49', threadId: 'jp', date: '2023-06-09', weight: 1,
    title: '統合イノベーション戦略2023 閣議決定',
    body: '「統合イノベーション戦略2023」を閣議決定。ChatGPT登場を受けて生成AIを主要テーマに据え、AI戦略会議の議論を踏まえたリスク対応と利活用促進、国内の計算資源整備、基盤モデル開発支援を打ち出した。半導体・量子・フュージョンなど重要技術の国家戦略化と経済安全保障との一体化を明記した。',
    source: '内閣府 科学技術・イノベーション推進事務局',
    sourceUrl: 'https://www8.cao.go.jp/cstp/tougosenryaku/2023.html',
    sourceTier: 'primary',
  },
  {
    id: 'jp-12', threadId: 'jp', date: '2023-11-29', weight: 2,
    title: '令和5年度補正 成立 半導体・AI約2兆円',
    body: '令和5年度一般会計補正予算(第1号)が参院本会議で可決・成立。半導体・生成AI関連で約2兆円を措置し、Rapidusの2nm開発、TSMC熊本第2工場、国産生成AI基盤モデル向け計算資源整備などに充てた。半導体支援の累計は3年間で約4兆円規模に達した。',
    source: '参議院 議案情報',
    sourceUrl: 'https://www.sangiin.go.jp/japanese/joho1/kousei/gian/212/meisai/m212150212001.htm',
    sourceTier: 'primary',
  },
];
