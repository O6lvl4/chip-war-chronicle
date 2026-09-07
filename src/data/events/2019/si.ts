import type { TimelineEvent } from '../../../types';

export const EVENTS_2019_SI: TimelineEvent[] = [
  {
    id: 'si-23', threadId: 'si', date: '2019-03-11', weight: 2,
    title: 'NVIDIA、Mellanoxを69億ドルで買収',
    body: 'NVIDIAが高速インターコネクト大手Mellanoxを1株125ドル、総額69億ドルで買収すると発表。データセンター向けにGPUとネットワークを統合する戦略の起点となった。',
    source: 'NVIDIA Newsroom',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion',
    sourceTier: 'primary',
  },
  {
    id: 'si-24', threadId: 'si', date: '2019-04-24', weight: 2,
    title: 'Samsung システム半導体に133兆ウォン',
    body: 'Samsung Electronicsが2030年までにシステムLSI・ファウンドリへ133兆ウォンを投資し、1万5000人を雇用する計画を発表。メモリに続き非メモリでも首位を狙う長期戦略を示した。',
    source: 'BusinessKorea',
    sourceUrl: 'https://www.businesskorea.co.kr/news/articleView.html?idxno=31225',
    sourceTier: 'secondary',
  },
  {
    id: 'si-3', threadId: 'si', date: '2019-09-06', weight: 2,
    title: 'Huawei Kirin 990 5G 発表',
    body: 'HuaweiがIFA 2019でTSMC 7nm EUV製の「Kirin 990 5G」を発表。5Gモデム統合SoCとして世界初をうたい、103億トランジスタを集積。自社設計SoCで競合に追いついた最後の世代となった。',
    source: 'Huawei Central (IFA 2019 発表報道)',
    sourceUrl: 'https://www.huaweicentral.com/huawei-officially-launches-kirin-990-a-5g-integrated-mobile-processor/',
    sourceTier: 'secondary',
  },
];
