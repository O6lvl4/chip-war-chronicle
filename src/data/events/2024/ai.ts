import type { TimelineEvent } from '../../../types';

export const EVENTS_2024_AI: TimelineEvent[] = [
  {
    id: 'ai-35', threadId: 'ai', date: '2024-03-04', weight: 2,
    title: 'Anthropic Claude 3 発表',
    body: 'AnthropicがClaude 3ファミリー(Haiku/Sonnet/Opus)を発表。OpusはMMLUやGPQAなど主要評価で競合を上回ると主張し、200Kトークンの文脈と画像入力に対応。最先端モデルの競争が多社化した。',
    source: 'Anthropic 公式',
    sourceUrl: 'https://www.anthropic.com/news/claude-3-family',
    sourceTier: 'primary',
  },
  {
    id: 'ai-36', threadId: 'ai', date: '2024-08-01', weight: 2,
    title: 'EU AI法 発効',
    body: 'EUのAI法が8月1日に発効。リスク別に義務を課し、汎用AIモデルへの規定は12か月後に適用開始。AI提供者に透明性やデータ品質の要件を課す世界初の包括規制となった。',
    source: '欧州委員会',
    sourceUrl: 'https://commission.europa.eu/news/ai-act-enters-force-2024-08-01_en',
    sourceTier: 'primary',
  },
  {
    id: 'ai-37', threadId: 'ai', date: '2024-09-12', weight: 2,
    title: 'OpenAI o1 推論モデル公開',
    body: 'OpenAIが回答前に思考の連鎖で推論するo1-previewとo1-miniを公開。数学五輪予選で83%を記録した一方、API価格はGPT-4oの6倍。推論時計算の増大が新たなチップ需要を生んだ。',
    source: 'TechCrunch',
    sourceUrl: 'https://techcrunch.com/2024/09/12/openai-unveils-a-model-that-can-fact-check-itself/',
    sourceTier: 'secondary',
  },
  {
    id: 'ai-38', threadId: 'ai', date: '2024-09-20', weight: 2,
    title: 'Microsoft スリーマイル島原発と20年契約',
    body: 'Constellationがスリーマイル島1号機を再稼働しMicrosoftと20年の電力購入契約を結ぶと発表。約835MWをデータセンター向けに供給予定で、AI需要が電力制約に直面していることを示した。',
    source: 'Constellation Energy',
    sourceUrl: 'https://www.constellationenergy.com/news/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html',
    sourceTier: 'primary',
  },
  {
    id: 'ai-39', threadId: 'ai', date: '2024-12-27', weight: 2,
    title: 'DeepSeek-V3 技術報告書',
    body: '中国DeepSeekが総パラメータ6710億のMoEモデルV3の技術報告書を公開。輸出規制対応版のH800でGPU時間278.8万時間という低コストで学習し、最先端モデルに匹敵する性能を示した。',
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2412.19437',
    sourceTier: 'primary',
  },
];
