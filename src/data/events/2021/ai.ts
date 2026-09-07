import type { TimelineEvent } from '../../../types';

export const EVENTS_2021_AI: TimelineEvent[] = [
  {
    id: 'ai-27', threadId: 'ai', date: '2021-06-29', weight: 1,
    title: 'GitHub Copilot 技術プレビュー',
    body: 'GitHubとOpenAIがOpenAI Codexを基盤とするAIペアプログラマー「Copilot」の技術プレビューを開始。コード補完という具体的な業務用途で大規模言語モデルが商用化に向かった。',
    source: 'GitHub Blog',
    sourceUrl: 'https://github.blog/2021-06-29-introducing-github-copilot-ai-pair-programmer/',
    sourceTier: 'primary',
  },
  {
    id: 'ai-28', threadId: 'ai', date: '2021-12-02', weight: 2,
    title: 'Google Cloud TPU v4 Pod 公開',
    body: 'GoogleがTPU v4チップ4096基で1.1エクサFLOPS超のCloud TPU v4 Podを公開し、MLPerf v1.1で4800億パラメータモデルの学習結果を提出。自社設計アクセラレータでGPU依存を減らす路線を示した。',
    source: 'Google Cloud Blog',
    sourceUrl: 'https://cloud.google.com/blog/topics/tpus/google-showcases-cloud-tpu-v4-pods-for-large-model-training',
    sourceTier: 'primary',
  },
];
