import type { TimelineEvent } from '../../../types';

export const EVENTS_2026_AI_PART_3: TimelineEvent[] = [
  {
    id: 'ai-188', threadId: 'ai', date: '2026-10-16', weight: 2,
    title: 'NVIDIA、Dory1.0-4Bの重み公開 推論時の反復回数を可変に',
    body: 'NVIDIAは40億パラメータのDory1.0-4BをOpenMDW 1.1で公開した。共有層の反復回数を推論時に選べ、最終反復のKVキャッシュのみを保存する設定では反復を増やしても容量を一定に保つ。文脈長は25万6000トークンで、BF16・MXFP8・NVFP4版を用意した。',
    source: 'NVIDIA Hugging Faceモデルカード',
    sourceUrl: 'https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16',
    sourceTier: 'primary',
  },
  {
    id: 'ai-187', threadId: 'ai', date: '2026-10-17', weight: 2,
    title: 'DeepSeek、V4.1-Flash-1017の重み公開 エージェント評価を改善',
    body: 'DeepSeekはV4.1-Flash-1017をMITライセンスで重み公開した。文脈長100万トークンで画像入力に対応し、同社測定のTerminal-Bench 4.0は前版の31.2から42.3へ、HLEのツールなし評価は36.8から42.6へ向上した。',
    source: 'DeepSeek Hugging Faceモデルカード',
    sourceUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017',
    sourceTier: 'primary',
  },
];
