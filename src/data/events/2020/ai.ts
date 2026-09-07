import type { TimelineEvent } from '../../../types';

export const EVENTS_2020_AI: TimelineEvent[] = [
  {
    id: 'ai-25', threadId: 'ai', date: '2020-05-14', weight: 3,
    title: 'NVIDIA A100 (Ampere) 発表',
    body: 'NVIDIAがGTCでA100 GPUを発表。7nmプロセス、540億トランジスタで前世代比最大20倍のAI性能を主張し、即日出荷開始。生成AI黎明期の学習インフラの主力となった。',
    source: 'NVIDIA ニュースルーム',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidias-new-ampere-data-center-gpu-in-full-production',
    sourceTier: 'primary',
  },
  {
    id: 'ai-2', threadId: 'ai', date: '2020-05-28', weight: 2,
    title: 'OpenAI GPT-3 発表',
    body: 'OpenAIが1750億パラメータのGPT-3論文「Language Models are Few-Shot Learners」を公開。自然言語処理の能力が飛躍的に向上し、大規模言語モデルへの産業界の関心を急速に高めた。',
    source: 'arXiv (OpenAI)',
    sourceUrl: 'https://arxiv.org/abs/2005.14165',
    sourceTier: 'primary',
  },
  {
    id: 'ai-26', threadId: 'ai', date: '2020-11-30', weight: 2,
    title: 'AlphaFold 2 CASP14で構造予測を制す',
    body: 'DeepMindのAlphaFold 2がCASP14でGDT中央値92.4を記録し、50年来の課題だったタンパク質構造予測を実験精度に近づけた。深層学習の科学応用を象徴する成果となった。',
    source: 'Google DeepMind',
    sourceUrl: 'https://deepmind.google/discover/blog/alphafold-a-solution-to-a-50-year-old-grand-challenge-in-biology/',
    sourceTier: 'primary',
  },
];
