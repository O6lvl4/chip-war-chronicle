import type { Link } from '../../types';

/** 起点(from)が2019年の因果リンク。from が先、to が後。 */
export const LINKS_2019: Link[] = [
  { from: 'gp-23', to: 'gp-24', why: '関税激化の後、双方が休戦を模索して第1段階合意に至った。' },
  { from: 'pr-2', to: 'pr-9', why: 'エンティティリスト後もTSMC製造が続いた抜け穴をFDPR拡大で塞いだ' },
  { from: 'pr-2', to: 'si-10', why: '在庫積み増しと国産化で4年後にMate 60で反撃した' },
  { from: 'ai-24', to: 'ai-2', why: 'Microsoftの10億ドル出資で構築したAzureスーパーコンピュータがGPT-3の学習基盤となった。' },
  { from: 'si-3', to: 'si-4', why: '自社設計SoCの唯一の製造元を失った' },
];
