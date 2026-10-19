# Linus Liu · Personal website

日语、中文和英语个人网站

## 开发与构建

需要 Node.js 22+（此环境使用 24）。不需要 npm 依赖安装、API 密钥或数据库。

```sh
cd /workspace/working-website
npm run dev       # 开发服务器，默认 0.0.0.0:3000
npm test          # HTTP、语言路由和构建验证
npm run build     # 生成可直接部署的 dist/
npm run preview   # 构建预览，默认端口 4173
```

`HOST`、`PORT` 可覆盖默认监听地址和端口。编辑内容后刷新即可查看；发布前重新构建。构建将直接从内容数据预渲染三种语言的完整 HTML，修改的输出仅在忽略的 `dist/` 内。

此环境预装 Python Playwright 与系统 Chromium，运行中的站点可以用下列命令验证：

```sh
python3 scripts/browser-smoke.py
```

`PORTFOLIO_BASE_URL` 选择要检查的本地服务器，`PORTFOLIO_ARTIFACT_DIR` 选择截图输出目录。在限制本地 socket 的工具沙箱中，服务器和浏览器检查需要在允许本地监听的执行上下文运行。

## 页面与内容

- `/`：English，使用原站的 compact 15px 标度。
- `/zh/`：中文；`/ja/`：日本語。保留原站各自的桌面和手机字号规则。
- 旧的 `?lang=en`、`?lang=zh`、`?lang=ja` 链接仍可使用。
- 背景、软件项目、应用 AI、研究、所获荣誉、联系方式采用原站的竖排锚点导航和条目／列表结构。
- 两份原始简历通过背景栏末尾的 PDF 链接提供；它们保留上传文件的全部原始内容。

`src/profile.js` 保存所有三语履历和项目内容；`src/translations.js` 保存界面文案；`src/render.js` 是浏览器和静态构建共享的渲染模板。`index.html`、`zh/index.html`、`ja/index.html` 提供无需 JavaScript 的初始内容；启用 JavaScript 时，开发页面从最新的数据渲染。正式构建会重新生成全部静态 HTML，所以禁用 JavaScript 也能阅读最新构建的内容。

已根据简历核实姓名 **Linus Liu**、Rice University 双学位及预计毕业时间、数学专业 GPA、五段工作／研究经历、三项软件项目、三项荣誉和联系方式。Google DeepMind 职位保留 **Research Extern**，未改成实习生；JEPA 世界模型和 Rice Quant Fund 工作保留进行中状态。未添加论文、中文法定姓名、语言熟练程度或未经简历支持的经历。上一版从历史讨论生成的主题和研究笔记已移除。

## 与参考网站的对照

已实际读取英文、中文、日文原站页面和 `style.css?v=21`，并用真实浏览器记录桌面／手机截图及计算样式。使用原站的 CSS 规则，包括 680px **内容宽度**、content-box 盒模型、背景色 #fafafa、Inter 字体、120×150px 桌面照片框、80×100px 手机照片框、标题层级、空白、细线和 600px 响应式断点。没有保留上一版的侧栏、绿色卡片、深色主题、项目筛选和弹窗。

个人资料替换后，段落长度及栏目内容自然不同；栏目“Applied AI”和“Selected Honors”对应 Linus 的实际工作与荣誉，未搬用原作者的金融经历和写作。未复制原站的 Google Analytics 或原作者照片。

**照片：** 两份简历中没有可用本人照片。照片框目前显示 `LL` 姓名缩写，占据原站相同位置和尺寸。将本人照片放入 `public/` 并设置 `profile.portrait`（例如 `public/portrait.jpg`）即可替换。当前占位图不是本人照片。

Inter 字体来自 npm `@fontsource/inter` **5.3.0**，下载后与注册表提供的 SHA-512 完整性信息核对，随站点自托管，保留 `public/fonts/LICENSE`。因此网页运行无需 Google Fonts 或任何外部脚本。

## GitHub Pages 部署

仓库：`https://github.com/user309dec/working-website`。

`.github/workflows/deploy-pages.yml` 会在每次推送到 `main` 后，使用 Node.js 24 执行现有测试、构建三种语言的静态 HTML，再将 **dist/ 内容** 上传并部署到 GitHub Pages。不需要额外令牌或 npm 依赖；部署使用 GitHub Actions 内置身份。

仓库 Pages 的发布来源需要设为 **GitHub Actions**，位置为仓库的 **Settings → Pages → Build and deployment → Source**。配置好后，后续推送会自动发布；也可以在 **Actions → Deploy GitHub Pages → Run workflow** 手动触发。工作流可查看测试、构建与部署的具体状态。

GitHub Pages 默认目标地址：

- English：`https://user309dec.github.io/working-website/`
- 中文：`https://user309dec.github.io/working-website/zh/`
- 日本語：`https://user309dec.github.io/working-website/ja/`

这些地址在 Pages 启用且部署成功后才会可用。已在 `/working-website/` 项目子路径下验证语言导航、静态资源、字体、PDF 和无 JavaScript 页面。无需修改资源路径或设置自定义域名。
