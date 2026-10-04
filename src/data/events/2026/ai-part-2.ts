import type { TimelineEvent } from '../../../types';

export const EVENTS_2026_AI_PART_2: TimelineEvent[] = [
  {
    id: 'ai-148', threadId: 'ai', date: '2026-09-10', weight: 3,
    title: 'DeepSeek V4.1-Flash 公開 旗艦を小型版が上回る',
    body: '総5520億のマルチモーダルMoEをMITで公開。新しいCausal Encoder-Decoder構成で入力時80億・出力時160億だけを活性化し、100万トークンのコンテキストと画像理解を持つ。価格は100万トークンあたり入力0.15ドル・出力0.60ドル。旗艦のV4-Proを性能・コスト・速度で上回るとし、9月14日からv4-proの呼び出しもこちらへ振り替える。',
    source: 'DeepSeek (Hugging Face)',
    sourceUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash',
    sourceTier: 'primary',
  },
  {
    id: 'ai-149', threadId: 'ai', date: '2026-09-10', weight: 3,
    title: 'Oracle クラウドインフラ売上121%増 850MWを稼働',
    body: '2027会計年度第1四半期のクラウドインフラ売上が前年同期比121%増の74億ドル。全社売上は約30%増の193.5億ドル。850MWの新規データセンター容量を稼働させ、受注残は6640億ドルに膨らんだ。AIインフラの稼働率は97.9%で、遊休設備がほぼない状態を示した。',
    source: 'SiliconANGLE',
    sourceUrl: 'https://siliconangle.com/2026/09/10/oracles-stock-moves-higher-on-surging-cloud-infrastructure-revenue-growth/',
    sourceTier: 'secondary',
  },
  {
    id: 'ai-154', threadId: 'ai', date: '2026-09-12', weight: 2,
    title: 'Altman OpenAIの2026年上場を否定 安全性を理由に',
    body: 'AltmanがFortuneのインタビューで、安全性をめぐる状況から「今は上場に不適切な時期」と述べ、2026年中の株式公開はないと明言した。安全性とアライメントに求められる水準に応えることを優先するとし、上場は社会がこの技術をどう受け止めているかを見て判断するとした。想定される評価額は1兆ドル。Anthropic研究者の辞任やAmodeiの開発ペース抑制論が背景にある。',
    source: 'Fortune',
    sourceUrl: 'https://fortune.com/2026/09/12/sam-altman-openai-ipo-delay-ill-advised-moment-safety-concerns/',
    sourceTier: 'secondary',
  },
  {
    id: 'ai-155', threadId: 'ai', date: '2026-09-14', weight: 1,
    title: 'ソフトバンクG OpenAI投資へ118.7億ドル融資 400億ドルつなぎ融資は完済へ',
    body: 'ソフトバンクグループがOpenAI投資の資金として約20行から2年物118.7億ドルの融資を確保し、当初目標の100億ドルを上回った。年初の400億ドルのつなぎ融資は残高259億ドルを9月15日に完済し、OpenAI株を担保とする100億ドルのマージンローンと最大200億ドルのドル建て社債で借り換える。10月までにOpenAIへ約650億ドルを投じる計画で、年初来の調達は約370億ドル。',
    source: 'The Japan Times (Bloomberg)',
    sourceUrl: 'https://www.japantimes.co.jp/business/2026/09/14/companies/softbank-loan-openai/',
    sourceTier: 'secondary',
  },
];
