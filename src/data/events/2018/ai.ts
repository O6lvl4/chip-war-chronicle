import type { TimelineEvent } from '../../../types';

export const EVENTS_2018_AI: TimelineEvent[] = [
  {
    id: 'ai-21', threadId: 'ai', date: '2018-03-27', weight: 1,
    title: 'NVIDIA DGX-2 発表 2PFLOPS',
    body: 'NVIDIAがGTCでDGX-2を発表。32GB版Tesla V100を16基、新開発のNVSwitchで結合し、1台で2ペタFLOPSを実現。GPU同士をスイッチで束ねる大規模学習サーバーの原型となった。',
    source: 'NVIDIA ニュースルーム',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-boosts-worlds-leading-deep-learning-computing-platform-bringing-10x-performance-gain-in-six-months',
    sourceTier: 'primary',
  },
  {
    id: 'ai-1', threadId: 'ai', date: '2018-09-20', weight: 1,
    title: 'NVIDIA Turing (RTX 2080) 発売',
    body: 'NVIDIAがTuringアーキテクチャのGeForce RTX 2080を発売。RT CoreとTensor Coreを搭載し、リアルタイムレイトレーシングとDLSS推論をゲーマー向けに初実用化。',
    source: 'NVIDIA ニュースルーム',
    sourceUrl: 'https://nvidianews.nvidia.com/news/10-years-in-the-making-nvidia-brings-real-time-ray-tracing-to-gamers-with-geforce-rtx',
    sourceTier: 'primary',
  },
  {
    id: 'ai-22', threadId: 'ai', date: '2018-10-11', weight: 2,
    title: 'Google BERT 論文公開',
    body: 'GoogleがBERTの論文をarXivに投稿。ラベルなしテキストで事前学習した双方向Transformerが11のNLPタスクで最高性能を更新し、事前学習+微調整の手法が標準となった。',
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/1810.04805',
    sourceTier: 'primary',
  },
];
