import type { TimelineEvent } from '../../../types';

export const EVENTS_2020_GP: TimelineEvent[] = [
  {
    id: 'gp-25', threadId: 'gp', date: '2020-01-11', weight: 2,
    title: '台湾総統選 蔡英文が再選',
    body: '台湾総統選挙で民進党の蔡英文総統が817万票(得票率57.13%)の過去最多得票で再選。国民党の韓国瑜候補に265万票差をつけ、香港情勢を背景に対中距離を保つ路線が支持された。',
    source: '台湾外交部 (駐サウジアラビア代表処)',
    sourceUrl: 'https://www.taiwanembassy.org/sa_en/post/1935.html',
    sourceTier: 'primary',
  },
  {
    id: 'gp-9', threadId: 'gp', date: '2020-01-15', weight: 2,
    title: '米中「第1段階」貿易合意に署名',
    body: '米中両政府がワシントンで経済貿易協定(第1段階合意)に署名。中国の米国製品購入拡大と知財・技術移転に関する構造改革を約束し、2018年来の関税応酬はいったん休戦に入った。',
    source: 'USTR プレスリリース',
    sourceUrl: 'https://ustr.gov/about-us/policy-offices/press-office/press-releases/2020/january/economic-and-trade-agreement-between-government-united-states-and-government-peoples-republic-china',
    sourceTier: 'primary',
  },
  {
    id: 'gp-10', threadId: 'gp', date: '2020-03-11', weight: 3,
    title: 'WHO COVID-19をパンデミックと宣言',
    body: 'WHOのテドロス事務局長がCOVID-19を「パンデミック」と特徴付けると表明。各国のロックダウンで自動車向け半導体需要が急減した後、巣ごもり需要で反転し、世界的な半導体不足の引き金となった。',
    source: 'WHO 欧州地域事務局',
    sourceUrl: 'https://www.who.int/europe/emergencies/situations/covid-19',
    sourceTier: 'primary',
  },
  {
    id: 'gp-26', threadId: 'gp', date: '2020-06-30', weight: 2,
    title: '香港国家安全維持法 施行',
    body: '中国の全人代常務委員会が香港国家安全維持法を可決し、習近平国家主席が署名して即日施行。国家分裂・政権転覆・テロ・外国勢力との結託を処罰対象とし、米国は香港への特別待遇の解消手続きを開始した。',
    source: 'PBS NewsHour (AP配信)',
    sourceUrl: 'https://www.pbs.org/newshour/world/china-approves-contentious-hong-kong-national-security-law',
    sourceTier: 'secondary',
  },
  {
    id: 'gp-27', threadId: 'gp', date: '2020-07-14', weight: 2,
    title: '英国 5G網からHuawei排除を決定',
    body: '英政府が2021年以降のHuawei製5G機器の新規購入を禁止し、2027年末までに既設機器を全面撤去すると発表。米国の半導体制裁でHuaweiの供給網の安全性を保証できなくなったことを理由に挙げた。',
    source: '英国政府 (GOV.UK)',
    sourceUrl: 'https://www.gov.uk/government/news/huawei-to-be-removed-from-uk-5g-networks-by-2027',
    sourceTier: 'primary',
  },
];
