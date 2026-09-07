import type { TimelineEvent } from '../../../types';

export const EVENTS_2022_AI: TimelineEvent[] = [
  {
    id: 'ai-3', threadId: 'ai', date: '2022-03-22', weight: 3,
    title: 'NVIDIA H100 (Hopper) 発表',
    body: 'NVIDIAがH100 GPUを発表。TSMC 4Nプロセスで800億トランジスタ、Transformer Engineを搭載し、前世代A100比で大規模モデルの学習を最大9倍高速化。AIインフラの新標準となる。',
    source: 'NVIDIA ニュースルーム',
    sourceUrl: 'https://nvidianews.nvidia.com/news/nvidia-announces-hopper-architecture-the-next-generation-of-accelerated-computing',
    sourceTier: 'primary',
  },
  {
    id: 'ai-29', threadId: 'ai', date: '2022-04-05', weight: 2,
    title: 'Google PaLM 5400億パラメータ',
    body: 'Googleが5400億パラメータの言語モデルPaLMの論文を公開。TPU v4を6144基使って学習し、少数例学習で多くのベンチマークを更新。学習規模の拡大競争がさらに加速した。',
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2204.02311',
    sourceTier: 'primary',
  },
  {
    id: 'ai-30', threadId: 'ai', date: '2022-08-22', weight: 2,
    title: 'Stable Diffusion 一般公開',
    body: 'Stability AIが画像生成モデルStable Diffusionの重みを商用利用可能なライセンスで公開。VRAM 6.9GBの民生GPUで動作し、生成AIの利用が個人と開発者に一気に広がった。',
    source: 'Stability AI',
    sourceUrl: 'https://stability.ai/news-updates/stable-diffusion-public-release',
    sourceTier: 'primary',
  },
  {
    id: 'ai-4', threadId: 'ai', date: '2022-11-30', weight: 3,
    title: 'ChatGPT 公開',
    body: 'OpenAIがChatGPTを研究プレビューとして一般公開。わずか5日で100万ユーザーを突破し、AIへの大衆的関心が爆発。H100 GPUへの需要が予想外の急拡大を見せ始める。',
    source: 'HISTORY.com',
    sourceUrl: 'https://www.history.com/this-day-in-history/november-30/chatgpt-released-openai',
    sourceTier: 'secondary',
  },
];
