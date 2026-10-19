// Source: Linus Liu's supplied applied-AI and research resumes.
// Phone numbers are omitted from the page; supplied PDF downloads are unchanged.
const tr = (en, zh, ja) => ({ en, zh, ja });

const mdAnderson = {
  id: 'md-anderson', period: '2026.03–2026.09',
  periodLabel: tr('Mar–Sep 2026', '2026 年 3–9 月', '2026年3月–9月'),
  title: tr('Researcher · Computational Pathology', '研究人员 · 计算病理学', '研究員 · 計算病理学'),
  organization: tr('MD Anderson Cancer Center', 'MD Anderson 癌症中心', 'MD Anderson がんセンター'),
  advisor: tr('Andrew Song', 'Andrew Song', 'Andrew Song'),
  description: tr(
    'Co-developed a whole-slide pathology pipeline and reproduced HEST gene-expression prediction benchmarks. Advisor: Andrew Song. A JEPA-style latent world model remains in development.',
    '共同开发全切片病理图像处理流程，复现 HEST 基因表达预测基准。导师：Andrew Song。基于 JEPA 的潜在世界模型仍在开发中。',
    '病理全スライド画像の処理パイプラインを共同開発し、HEST の遺伝子発現予測ベンチマークを再現しました。指導：Andrew Song。JEPA 型の潜在世界モデルは開発中です。'),
  bullets: tr([
    'Co-developed tissue segmentation, patch extraction, CONCH/Virchow2 encoding, and CLAM-compatible HDF5 feature bags for downstream modeling.',
    'Reproduced HEST gene-expression prediction benchmarks with 256-dimensional PCA and Ridge regression, matching published Pearson-correlation baselines across three cancer cohorts.',
    'Developing a JEPA-style latent world model to predict future pathology embeddings conditioned on actions and elapsed time; exploring heatmaps and nearest-slide retrieval to visualize progression.',
  ], [
    '共同开发组织分割、图像块提取、CONCH/Virchow2 编码流程，并生成兼容 CLAM 的 HDF5 特征包，用于下游建模。',
    '使用 256 维 PCA 和岭回归复现 HEST 基因表达预测基准，在三个癌症队列上达到已发表的 Pearson 相关系数基线。',
    '正在开发基于 JEPA 的潜在世界模型，以动作和经过时间为条件预测未来的病理嵌入；探索用热力图和最近邻切片检索可视化病程变化。',
  ], [
    '組織セグメンテーション、パッチ抽出、CONCH/Virchow2 による符号化、および下流モデル向けの CLAM 互換 HDF5 特徴量バッグを共同開発しました。',
    '256 次元 PCA とリッジ回帰を用いて HEST の遺伝子発現予測ベンチマークを再現し、3つのがんコホートで公表された Pearson 相関係数のベースラインと同等の結果を得ました。',
    '行動と経過時間を条件として将来の病理埋め込みを予測する JEPA 型の潜在世界モデルを開発中です。進行過程の可視化に向け、ヒートマップと最近傍スライド検索を検討しています。',
  ]),
};

const deepMind = {
  id: 'google-deepmind', period: '2026.02–2026.03',
  periodLabel: tr('Feb–Mar 2026', '2026 年 2–3 月', '2026年2月–3月'),
  title: tr('Research Extern · LLM Self-Evolving Memory', '研究见习（Research Extern）· 大语言模型自演化记忆', '研究エクスターン · 大規模言語モデルの自己進化型メモリ'),
  organization: tr('Google DeepMind', 'Google DeepMind', 'Google DeepMind'),
  location: tr('Remote', '远程', 'リモート'),
  description: tr(
    'Investigated self-evolving LLM memory through continual-learning literature and controlled experiments on retention and retrieval. Remote research externship.',
    '通过持续学习文献与受控实验，研究大语言模型自演化记忆中的信息保留与检索。远程研究见习。',
    '継続学習の文献調査と統制実験を通じて、大規模言語モデルの自己進化型メモリにおける情報保持と検索を研究しました。リモートでの研究エクスターンです。'),
  bullets: tr([
    'Developed hypotheses on self-evolving LLM memory, reviewing continual-learning research to investigate information retention and retrieval across sessions.',
    'Designed controlled experiments on memory retention and retrieval accuracy across context lengths, collaborating with research leads to refine and test hypotheses.',
  ], [
    '围绕大语言模型自演化记忆提出研究假设，回顾持续学习研究，探讨跨会话的信息保留与检索。',
    '设计受控实验，考察不同上下文长度下的记忆保留与检索准确率，并与研究负责人协作完善和检验假设。',
  ], [
    '大規模言語モデルの自己進化型メモリに関する仮説を立て、継続学習の研究を調査しながら、セッションをまたぐ情報の保持と検索を検討しました。',
    '異なるコンテキスト長における記憶保持と検索精度を調べる統制実験を設計し、研究リードと協力して仮説を改善・検証しました。',
  ]),
};

const riceResearch = {
  id: 'rice-research', period: '2025.11–2026.02',
  periodLabel: tr('Nov 2025–Feb 2026', '2025 年 11 月–2026 年 2 月', '2025年11月–2026年2月'),
  title: tr('Research Assistant · Machine Learning', '研究助理 · 机器学习', 'リサーチアシスタント · 機械学習'),
  organization: tr('Rice University', '莱斯大学', 'ライス大学'),
  advisor: tr('Prof. Momona Yamagami', 'Momona Yamagami 教授', 'Momona Yamagami 教授'),
  description: tr(
    'Built a PyTorch pipeline for gesture recognition from EMG and IMU data, with CNN–LSTM models and a template-matching baseline. Advisor: Prof. Momona Yamagami.',
    '构建基于 PyTorch 的 EMG 与 IMU 数据手势识别流程，研究 CNN–LSTM 模型与模板匹配基线。导师：Momona Yamagami 教授。',
    '筋電図（EMG）と IMU データからジェスチャーを認識する PyTorch パイプラインを構築し、CNN–LSTM モデルとテンプレートマッチングのベースラインを検討しました。指導：Momona Yamagami 教授。'),
  bullets: tr([
    'Built a PyTorch gesture-recognition pipeline for 88-channel EMG and IMU data, combining a 1D CNN with a two-layer LSTM for upper-body movement classification.',
    'Implemented a PCA/Euclidean-distance template-matching baseline; ran grid searches over kernel sizes, hidden layers, and dropout to investigate model convergence.',
  ], [
    '为 88 通道 EMG 与 IMU 数据构建 PyTorch 手势识别流程，结合一维 CNN 与两层 LSTM，对上半身动作进行分类。',
    '实现基于 PCA 与欧氏距离的模板匹配基线，并对卷积核大小、隐藏层和 dropout 进行网格搜索，研究模型收敛。',
  ], [
    '88チャネルの EMG および IMU データを扱う PyTorch ジェスチャー認識パイプラインを構築し、1次元 CNN と2層 LSTM を組み合わせて上半身の動作を分類しました。',
    'PCA とユークリッド距離を用いたテンプレートマッチングのベースラインを実装し、カーネルサイズ、隠れ層、dropout のグリッドサーチでモデルの収束を調べました。',
  ]),
};

const wishee = {
  id: 'wishee', period: '2025.12–present',
  periodLabel: tr('Dec 2025–Present', '2025 年 12 月至今', '2025年12月–現在'),
  title: tr('Intern · Voice Assistant Retrieval', '实习生 · 语音助手检索', 'インターン · 音声アシスタント検索'),
  organization: tr('WISHEE', 'WISHEE', 'WISHEE'),
  location: tr('Shenzhen / Remote', '深圳 / 远程', '深圳 / リモート'),
  description: tr(
    'Built a hybrid retrieval service for a smart-earbud voice assistant, improving retrieval recall and reducing the wait after speech.',
    '为智能耳机语音助手构建混合检索服务，提升检索召回率并缩短语音结束后的等待时间。',
    'スマートイヤホンの音声アシスタント向けにハイブリッド検索サービスを構築し、検索の再現率と発話終了後の待ち時間を改善しました。'),
  bullets: tr([
    'Built a cloud retrieval layer over 30,000 documents and 600K chunks, serving 20 queries per second at 600 ms p95 first-token latency.',
    'Cached speculative searches on partial speech transcripts, cutting post-speech wait from 680 ms to 440 ms.',
    'Combined dense vectors, BM25, metadata filters, and reciprocal rank fusion, improving recall@5 from 0.68 to 0.89 on 200 hand-labeled voice queries.',
  ], [
    '构建覆盖 30,000 份文档与 600,000 个文本块的云端检索层，支持每秒 20 次查询，首 token 延迟的 p95 为 600 毫秒。',
    '对语音转写中间结果进行推测性检索并缓存，将语音结束后的等待时间从 680 毫秒降至 440 毫秒。',
    '结合稠密向量、BM25、元数据过滤与倒数排名融合，在 200 条人工标注的语音查询上将 recall@5 从 0.68 提升至 0.89。',
  ], [
    '30,000文書・600,000チャンクを対象とするクラウド検索レイヤーを構築し、毎秒20クエリ、最初のトークンまでの p95 レイテンシ600ミリ秒を実現しました。',
    '発話途中の文字起こしに対する先行検索をキャッシュし、発話終了後の待ち時間を680ミリ秒から440ミリ秒に短縮しました。',
    '密ベクトル、BM25、メタデータフィルタ、逆順位融合を組み合わせ、人手でラベル付けした200件の音声クエリで recall@5 を0.68から0.89に改善しました。',
  ]),
};

const lenovo = {
  id: 'lenovo', period: '2025.04–2025.08',
  periodLabel: tr('Apr–Aug 2025', '2025 年 4–8 月', '2025年4月–8月'),
  title: tr('Machine Learning Intern · Sequential Decision Modeling', '机器学习实习生 · 序列决策建模', '機械学習インターン · 逐次意思決定モデリング'),
  organization: tr('Lenovo', '联想', 'Lenovo'),
  location: tr('Beijing, China', '中国北京', '中国・北京'),
  description: tr(
    'Implemented a Decision Pre-trained Transformer for multi-zone HVAC control and built reproducible Python/JAX training and offline evaluation workflows.',
    '实现用于多区域暖通空调控制的 Decision Pre-trained Transformer，并构建可复现的 Python/JAX 训练与离线评估流程。',
    '複数ゾーンの空調制御向けに Decision Pre-trained Transformer を実装し、再現可能な Python/JAX の学習・オフライン評価ワークフローを構築しました。'),
  bullets: tr([
    'Implemented a Decision Pre-trained Transformer for multi-zone HVAC control on IoT data; built reproducible Python/JAX training and offline evaluation workflows.',
    'Ran context-length and regularization ablations; used SQL filtering, metric analysis, and replay-based testing to investigate failure cases and model stability.',
  ], [
    '基于 IoT 数据，实现用于多区域暖通空调控制的 Decision Pre-trained Transformer；构建可复现的 Python/JAX 训练与离线评估流程。',
    '开展上下文长度与正则化的消融实验，通过 SQL 过滤、指标分析与回放测试，研究失败案例和模型稳定性。',
  ], [
    'IoT データを用いた複数ゾーンの空調制御向けに Decision Pre-trained Transformer を実装し、再現可能な Python/JAX の学習・オフライン評価ワークフローを構築しました。',
    'コンテキスト長と正則化のアブレーションを実施し、SQL フィルタリング、指標分析、リプレイテストを用いて失敗事例とモデルの安定性を調べました。',
  ]),
};

export const researchExperiences = [mdAnderson, deepMind, riceResearch];
export const appliedExperiences = [wishee, lenovo];

// A short paragraph and a full bullet list are available to either page layout.
for (const entry of [...researchExperiences, ...appliedExperiences]) {
  entry.summary = entry.description;
  entry.details = entry.bullets;
}

export const profile = {
  name: tr('Linus Liu', 'Linus Liu', 'Linus Liu'), initials: 'LL',
  tagline: tr('Computer Science & Applied Mathematics · Rice University', '计算机科学与应用数学 · 莱斯大学', 'コンピュータサイエンス・応用数学 · ライス大学'),
  github: 'https://github.com/user309dec',
  linkedin: 'https://www.linkedin.com/in/linus-liu-10293a324',
  email: 'yl328@rice.edu', portrait: null, resumeConfirmed: true,
  bio: tr([
    'I am an undergraduate at Rice University pursuing a B.S. in Computer Science and a B.A. in Computational and Applied Mathematics, with graduation expected in May 2028.',
    'My research interests are mixture-of-experts (MoE), AI for science, and efficient large-scale AI. My experience spans computational pathology, LLM memory, biosignal recognition, sequential decision modeling, and voice-assistant retrieval.',
  ], [
    '我是莱斯大学本科生，攻读计算机科学理学学士和计算与应用数学文学学士，预计于 2028 年 5 月毕业。',
    '我的研究兴趣包括混合专家模型（MoE）、AI for Science，以及高效大规模人工智能。我的经历涵盖计算病理学、大语言模型记忆、生物信号识别、序列决策建模与语音助手检索。',
  ], [
    'ライス大学の学部生として、コンピュータサイエンスの B.S. と計算・応用数学の B.A. を履修しています。2028年5月に卒業予定です。',
    '研究関心は混合エキスパートモデル（MoE）、AI for Science、効率的な大規模 AI です。計算病理学、大規模言語モデルのメモリ、生体信号認識、逐次意思決定モデリング、音声アシスタント検索に取り組んできました。',
  ]),
  interests: tr(
    ['Mixture-of-experts (MoE)', 'AI for science', 'Efficient large-scale AI'],
    ['混合专家模型（MoE）', 'AI for Science', '高效大规模人工智能'],
    ['混合エキスパートモデル（MoE）', 'AI for Science', '効率的な大規模 AI']),
  education: [{
    id: 'rice-education', period: 'Expected May 2028',
    periodLabel: tr('Expected May 2028', '预计 2028 年 5 月毕业', '2028年5月卒業予定'),
    title: tr('B.S. Computer Science; B.A. Computational and Applied Mathematics', '计算机科学理学学士；计算与应用数学文学学士', 'コンピュータサイエンス B.S. ／ 計算・応用数学 B.A.'),
    organization: tr('Rice University', '莱斯大学', 'ライス大学'),
    location: tr('Houston, Texas', '美国得克萨斯州休斯敦', '米国テキサス州ヒューストン'),
    description: tr(
      'Mathematics Major GPA: 4.00 / 4.00. Coursework: Machine Learning, Deep Learning, Algorithms, Honors Linear Algebra and Multivariable Calculus, and Statistics for Generative Models.',
      '数学专业 GPA：4.00 / 4.00。相关课程：机器学习、深度学习、算法、荣誉线性代数与多元微积分、生成模型统计学。',
      '数学専攻 GPA：4.00 / 4.00。主な履修科目：機械学習、深層学習、アルゴリズム、オナーズ線形代数・多変数微積分、生成モデルの統計学。'),
  }],
  experience: [...researchExperiences, ...appliedExperiences],
};

export const projects = [
  {
    id: 'computational-pathology', kind: 'research', category: 'understanding', icon: 'layers',
    period: mdAnderson.period, periodLabel: mdAnderson.periodLabel,
    organization: mdAnderson.organization, location: null,
    status: tr('JEPA model in progress', 'JEPA 模型开发中', 'JEPA モデル開発中'),
    title: tr('Computational Pathology & Latent World Models', '计算病理学与潜在世界模型', '計算病理学と潜在世界モデル'),
    description: tr(
      'Whole-slide image processing, HEST benchmark reproduction, and an in-progress JEPA-style model for future pathology embeddings at MD Anderson.',
      '在 MD Anderson 开展全切片图像处理、HEST 基准复现，并开发预测未来病理嵌入的 JEPA 式模型。',
      'MD Anderson にて全スライド画像処理と HEST ベンチマークの再現に取り組み、将来の病理埋め込みを予測する JEPA 型モデルを開発中です。'),
    tags: ['CONCH', 'Virchow2', 'HDF5', 'JEPA'], details: mdAnderson.bullets,
  },
  {
    id: 'biosignal-recognition', kind: 'research', category: 'understanding', icon: 'chart',
    period: riceResearch.period, periodLabel: riceResearch.periodLabel,
    organization: riceResearch.organization, location: null,
    title: tr('Biosignal Gesture Recognition', '生物信号手势识别', '生体信号によるジェスチャー認識'),
    description: tr(
      'A CNN–LSTM pipeline and template-matching baseline for gesture recognition from 88-channel EMG and IMU data at Rice University.',
      '在莱斯大学构建 CNN–LSTM 流程与模板匹配基线，利用 88 通道 EMG 与 IMU 数据进行手势识别。',
      'ライス大学にて、88チャネルの EMG と IMU データによるジェスチャー認識の CNN–LSTM パイプラインとテンプレートマッチングのベースラインを構築しました。'),
    tags: ['PyTorch', 'EMG', 'IMU', 'CNN', 'LSTM'], details: riceResearch.bullets,
  },
  {
    id: 'game2learn', kind: 'software', category: 'generative', icon: 'layers', period: '2025.09–present',
    organization: tr('HackRice', 'HackRice', 'HackRice'), location: null,
    periodLabel: tr('Sep 2025–Present', '2025 年 9 月至今', '2025年9月–現在'),
    url: 'https://github.com/user309dec/GameToLearn-G2L-AI-Final',
    sourceURL: 'https://github.com/user309dec/GameToLearn-G2L-AI-Final',
    title: tr('Game2Learn · HackRice', 'Game2Learn · HackRice', 'Game2Learn · HackRice'),
    role: tr('Lead Full Stack Developer', '全栈开发负责人', 'フルスタック開発リード'),
    description: tr(
      'A React/TypeScript learning application with Gemini-powered PDF/video analysis, scene-based quizzes, and an editable application preview.',
      '基于 React/TypeScript 的学习应用，结合 Gemini 驱动的 PDF/视频分析、场景式测验与可编辑的应用预览。',
      'Gemini による PDF・動画分析、シーン別クイズ、編集可能なアプリプレビューを備えた React/TypeScript の学習アプリです。'),
    tags: ['React', 'TypeScript', 'Gemini API', 'Monaco'],
    details: tr([
      'Led a five-person team building a React/TypeScript app; co-developed Gemini-powered PDF/video analysis and scene-based quizzes with answer feedback.',
      'Co-developed a two-stage Gemini API workflow from video to application specification to HTML, with a Monaco editor, sandboxed iframe preview, and localStorage save/reload.',
    ], [
      '带领五人团队开发 React/TypeScript 应用；共同开发 Gemini 驱动的 PDF/视频分析与附带答案反馈的场景式测验。',
      '共同开发两阶段 Gemini API 流程，将视频转换为应用规格，再生成 HTML；集成 Monaco 编辑器、沙箱 iframe 预览与 localStorage 保存/重新加载。',
    ], [
      '5人のチームを率いて React/TypeScript アプリを開発し、Gemini による PDF・動画分析と、回答フィードバック付きのシーン別クイズを共同開発しました。',
      '動画からアプリ仕様、さらに HTML へと変換する2段階の Gemini API ワークフローを共同開発し、Monaco エディタ、サンドボックス化した iframe プレビュー、localStorage による保存・再読み込みを組み込みました。',
    ]),
  },
  {
    id: 'rice-quant-fund', kind: 'software', category: 'reasoning', icon: 'chart', period: '2026.04–present',
    organization: tr('Rice Quant Fund', 'Rice Quant Fund', 'Rice Quant Fund'), location: null,
    periodLabel: tr('Apr 2026–Present', '2026 年 4 月至今', '2026年4月–現在'),
    status: tr('In progress', '进行中', '開発中'),
    title: tr('Rice Quant Fund · Order-Book Collector & Replay Study', 'Rice Quant Fund · 订单簿采集与回放研究', 'Rice Quant Fund · 注文板データ収集とリプレイ研究'),
    role: tr('Quant Researcher', '量化研究员', 'クオンツ研究員'),
    description: tr(
      'An in-progress C++20 market-data collector and order-book engine, with snapshot recovery and a planned differential-testing workflow.',
      '正在开发的 C++20 市场数据采集器与订单簿引擎，包含快照恢复设计和差分测试方案。',
      '開発中の C++20 市場データ収集器と注文板エンジンです。スナップショットからの復旧を設計し、差分テストの手順を策定しています。'),
    tags: ['C++20', 'Python', 'Market data', 'Differential testing'],
    details: tr([
      'Developing a C++20 market-data collector and order-book engine with fixed-point prices and quantities, receive-time sampling, and a bounded producer-consumer queue.',
      'Designed snapshot recovery and positioned drop markers; specified Python-reference differential tests and synthetic archives with injected gaps, duplicates, and clock jumps.',
    ], [
      '正在开发 C++20 市场数据采集器与订单簿引擎，采用定点价格和数量、按接收时间采样，以及有界生产者—消费者队列。',
      '已设计快照恢复与带位置信息的丢弃标记；制定以 Python 实现为参照的差分测试，以及注入缺失、重复和时钟跳变的合成数据归档方案。',
    ], [
      '固定小数点の価格・数量、受信時刻に基づくサンプリング、有界の生産者・消費者キューを備えた C++20 市場データ収集器と注文板エンジンを開発中です。',
      'スナップショットからの復旧と位置情報付き欠落マーカーを設計しました。Python 参照実装との比較による差分テスト、および欠落・重複・時刻ジャンプを注入した合成アーカイブの仕様を策定しました。',
    ]),
  },
  {
    id: 'feat', kind: 'software', category: 'reasoning', icon: 'orbit', period: '2025.08–2025.12',
    organization: tr('Rice University', '莱斯大学', 'ライス大学'), location: null,
    periodLabel: tr('Aug–Dec 2025', '2025 年 8–12 月', '2025年8月–12月'),
    title: tr('FEAT · Automated Test Generation Framework', 'FEAT · 自动测试生成框架', 'FEAT · 自動テスト生成フレームワーク'),
    role: tr('Software Engineering Project · Rice University', '软件工程项目 · 莱斯大学', 'ソフトウェア工学プロジェクト · ライス大学'),
    description: tr(
      'A Java differential-testing tool with greedy test-suite reduction formulated as a set-cover problem.',
      '基于 Java 的差分测试工具，将测试集缩减表述为集合覆盖问题，并使用贪心算法选择测试。',
      'テストスイートの縮小を集合被覆問題として定式化し、貪欲法でテストを選択する Java の差分テストツールです。'),
    tags: ['Java', 'Differential testing', 'Set cover', 'Greedy algorithms'],
    details: tr(
      ['Built a Java differential-testing tool to compare program behavior; formulated test-suite reduction as set cover and implemented greedy test selection targeting bug-detection coverage.'],
      ['构建 Java 差分测试工具以比较程序行为；将测试集缩减表述为集合覆盖问题，并实现面向缺陷检测覆盖率的贪心测试选择。'],
      ['プログラムの挙動を比較する Java の差分テストツールを構築しました。テストスイートの縮小を集合被覆問題として定式化し、バグ検出のカバレッジを目標とする貪欲なテスト選択を実装しました。']),
  },
];

export const honors = [
  { year: '2023', title: tr('S.-T. Yau High School Science Award · Third Prize', '丘成桐中学科学奖 · 三等奖', 'S.-T. Yau 高校科学賞 · 三等賞') },
  { year: '2022', title: tr('HiMCM · Meritorious Award', 'HiMCM · 优异奖（Meritorious Award）', 'HiMCM · Meritorious Award（優秀賞）') },
  { year: '2022', title: tr('Chinese Chemistry Olympiad · Provincial Third Prize', '中国化学奥林匹克竞赛 · 省级三等奖', '中国化学オリンピック · 省レベル三等賞') },
];

export const skills = [
  {
    title: tr('Programming', '编程语言', 'プログラミング'),
    items: ['Python', 'Java', 'TypeScript', 'SQL'],
    note: tr('C++20: current research project', 'C++20：当前研究项目', 'C++20：現在の研究プロジェクト'),
  },
  { title: tr('AI & Data', '人工智能与数据', 'AI・データ'), items: ['PyTorch', 'JAX', 'Gemini API', 'pandas', 'NumPy', 'scikit-learn', 'LightGBM', 'HDF5'] },
  {
    title: tr('Engineering', '工程技术', 'エンジニアリング'), items: ['React', 'Vite'],
    description: tr('API integration, caching, hybrid retrieval, differential testing, greedy algorithms', 'API 集成、缓存、混合检索、差分测试、贪心算法', 'API 統合、キャッシュ、ハイブリッド検索、差分テスト、貪欲法'),
  },
  {
    title: tr('Research Methods', '研究方法', '研究手法'), items: [],
    description: tr('Controlled experiments, ablation studies, benchmark reproduction, retrieval and latency evaluation', '受控实验、消融研究、基准复现、检索与延迟评估', '統制実験、アブレーション研究、ベンチマーク再現、検索・レイテンシ評価'),
  },
];

// No authored research notes or publication records were supplied.
export const notes = [];
