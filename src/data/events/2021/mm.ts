import type { TimelineEvent } from '../../../types';

export const EVENTS_2021_MM: TimelineEvent[] = [
  {
    id: 'mm-27', threadId: 'mm', date: '2021-02-15', weight: 2,
    title: '日経平均 30年半ぶり3万円台回復',
    body: '日経平均が終値3万84円となり、1990年8月以来30年6カ月ぶりに3万円台を回復した。各国の金融緩和・財政出動とワクチン接種開始への期待が背景で、上場企業の純利益は1990年比で2倍の水準に拡大していた。',
    source: '日本経済新聞',
    sourceUrl: 'https://www.nikkei.com/article/DGXZQODG158HT0V10C21A2000000/',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-4', threadId: 'mm', date: '2021-04-08', weight: 2,
    title: '自動車業界 チップ不足で減産拡大',
    body: 'GMが北米7工場、Fordがシカゴなど3工場の生産停止を発表。COVID後の需要回復にマイコン・パワー半導体の供給が追いつかず、GMは年間最大20億ドルの利益減を見込んだ。',
    source: 'CBS News / AP, 2021-04-09',
    sourceUrl: 'https://www.cbsnews.com/news/gm-and-ford-semiconductor-plant-closing-michigan-illinois-missouri-auto-industry/',
    sourceTier: 'secondary',
  },
  {
    id: 'mm-28', threadId: 'mm', date: '2021-09-23', weight: 2,
    title: '半導体不足 自動車業界に2100億ドル損失',
    body: 'AlixPartnersが半導体不足による2021年の自動車業界の売上損失を2100億ドル、生産減少を770万台と予測し、5月時点の1100億ドル・390万台から大幅に上方修正。樹脂や鋼材、労働力の不足も重なり混乱が長期化した。',
    source: 'AlixPartners プレスリリース',
    sourceUrl: 'https://www.alixpartners.com/media-center/press-releases/press-release-shortages-related-to-semiconductors-to-cost-the-auto-industry-210-billion-in-revenues-this-year-says-new-alixpartners-forecast/',
    sourceTier: 'primary',
  },
  {
    id: 'mm-5', threadId: 'mm', date: '2021-12-13', weight: 2,
    title: 'DRAM価格 下落サイクル入り',
    body: 'TrendForceが2022年第1四半期のDRAM契約価格を前四半期比8〜13%下落と予測。PC・スマートフォン需要の減速と買い手の在庫圧力で、メモリ市況は下降局面に転換した。',
    source: 'TrendForce プレスリリース',
    sourceUrl: 'https://www.trendforce.com/presscenter/news/20211213-11050.html',
    sourceTier: 'secondary',
  },
];
