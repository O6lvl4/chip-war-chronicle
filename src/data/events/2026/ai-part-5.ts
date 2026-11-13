import type { TimelineEvent } from '../../../types';

export const EVENTS_2026_AI_PART_5: TimelineEvent[] = [
  {
    id: 'ai-260', threadId: 'ai', date: '2026-11-12', weight: 2,
    title: 'Google、Gemini 4 Hydrogenを提供開始 100万トークンの文脈に対応',
    body: 'GoogleはGemini 4 Hydrogenを発表し、API、AI Studio、Geminiアプリ、検索などで展開を開始した。100万トークンの文脈全体で入力100万トークン1.50ドル、出力7.50ドル。思考設定はlow・medium・high・xhighの4段階を用意する。',
    source: 'Google 公式ブログ',
    sourceUrl: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/',
    sourceTier: 'primary',
  },
  {
    id: 'ai-261', threadId: 'ai', date: '2026-11-12', weight: 2,
    title: 'Thinking Machines、Inkling 2 Smallの重み公開 Apache 2.0を採用',
    body: 'Thinking MachinesはInkling 2 Smallの重みを公開した。総5940億・稼働170億パラメータの画像・テキスト入力モデルで、Apache 2.0を採用。NVFP4版の推論には合計500GB以上のGPUメモリを要し、公式カードはB300を2基またはH200を4基の構成を例示する。',
    source: 'Thinking Machines Hugging Faceモデルカード・コミット履歴',
    sourceUrl: 'https://huggingface.co/thinkingmachines/Inkling-2-Small',
    sourceTier: 'primary',
  },
  {
    id: 'ai-262', threadId: 'ai', date: '2026-11-12', weight: 1,
    title: 'IntelとRadixArk、SGLangをIntel向けに最適化する協力を発表',
    body: 'IntelとRadixArkがオープンソースAI推論基盤SGLangの最適化で協力を発表。IntelのCPU・GPU・アクセラレーター向けに対応し、AMXなどのハードウェア機能を活用する。改善は独立した実装ではなく、共通フレームワークへの貢献として進める。',
    source: 'Intel プレスリリース',
    sourceUrl: 'https://www.intc.com/news-events/press-releases/detail/1787/intel-radixark-collaborate-to-advance-open-ai-inference-on',
    sourceTier: 'primary',
  },
];
