import type { TimelineEvent } from '../../../types';

export const EVENTS_2019_AI: TimelineEvent[] = [
  {
    id: 'ai-23', threadId: 'ai', date: '2019-02-17', weight: 1,
    title: 'OpenAI GPT-2 段階公開',
    body: 'OpenAIが40GBのウェブ文章で学習したGPT-2を発表。悪用懸念を理由に完全版の公開を見送り小型版のみ公開したことが論争を呼び、言語モデルの社会的影響が広く議論された。',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2019/02/17/openai-text-generator-dangerous/',
    sourceTier: 'secondary',
  },
  {
    id: 'ai-24', threadId: 'ai', date: '2019-07-22', weight: 2,
    title: 'Microsoft OpenAIに10億ドル出資',
    body: 'MicrosoftがOpenAIに10億ドルを投資し、Azure上に大規模AIスーパーコンピュータを共同構築する独占提携を発表。OpenAIのサービスはAzureに移行し、後のGPT-3学習基盤となった。',
    source: 'Microsoft 公式',
    sourceUrl: 'https://news.microsoft.com/2019/07/22/openai-forms-exclusive-computing-partnership-with-microsoft-to-build-new-azure-ai-supercomputing-technologies/',
    sourceTier: 'primary',
  },
];
