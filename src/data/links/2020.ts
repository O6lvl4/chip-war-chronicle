import type { Link } from '../../types';

/** 起点(from)が2020年の因果リンク。from が先、to が後。 */
export const LINKS_2020: Link[] = [
  { from: 'gp-10', to: 'mm-2', why: 'パンデミック宣言を織り込み株式市場が暴落した' },
  { from: 'gp-10', to: 'mm-4', why: '発注取消と在宅需要の急伸が重なり車載チップ不足を招いた' },
  { from: 'gp-10', to: 'mm-25', why: 'パンデミック宣言後の金融市場の混乱に対し、FRBが日曜日の緊急会合でゼロ金利とQE再開を決めた。' },
  { from: 'mm-25', to: 'mm-2', why: '緊急利下げは市場の恐怖を抑えられず、翌営業日にNYダウは1987年以来の下落率を記録した。' },
  { from: 'mm-25', to: 'mm-27', why: 'ゼロ金利と大規模資産買入れによる流動性が世界的な株高を生み、日経平均の3万円回復につながった。' },
  { from: 'ai-25', to: 'ai-3', why: 'A100の後継としてH100が投入され、Transformer Engineで大規模言語モデル学習に最適化された。' },
  { from: 'pr-9', to: 'si-4', why: 'FDPR拡大の猶予期限が切れ、TSMCがHuawei向け出荷を停止した' },
  { from: 'pr-9', to: 'si-25', why: '対Huawei FDPR拡大と同日にTSMCがアリゾナ工場を発表し、米政府の供給網回帰要請に応じた。' },
  { from: 'si-25', to: 'si-6', why: '2020年に発表したアリゾナ工場が2022年の装置搬入式で具体化し、投資額も400億ドルへ拡大した。' },
  { from: 'pr-9', to: 'pr-27', why: '5月のFDPR改正でも迂回余地が残ったため、8月にHuaweiが関与する全外国製品へ適用範囲を再拡大した。' },
  { from: 'pr-9', to: 'gp-27', why: '英国はFDPR拡大でHuaweiの半導体調達が不確実になったことを排除の理由に挙げた。' },
  { from: 'ai-2', to: 'ai-4', why: 'スケール則の製品化がChatGPTだった' },
  { from: 'ai-2', to: 'ai-27', why: 'GPT-3から派生したCodexがGitHub Copilotの基盤となり、LLMの業務用途が具体化した。' },
  { from: 'gp-26', to: 'gp-28', why: '香港国安法は米側がアンカレッジ会談で公然と批判した主要論点だった。' },
  { from: 'pr-27', to: 'si-4', why: '8月のFDPR再拡大により、TSMCは猶予期限の9月14日以降Huawei向け出荷を停止した。' },
  { from: 'mm-3', to: 'mm-8', why: 'NVIDIAによる買収断念を経てArmは単独上場を選んだ' },
  { from: 'pr-28', to: 'pr-5', why: 'SMIC個社への10nm以下規制が、2022年10月の中国全体を対象とする製造装置規制へ発展した。' },
  { from: 'pr-28', to: 'pr-69', why: 'SMIC等の中国製半導体を連邦調達から排除する調達規則へ' },
];
