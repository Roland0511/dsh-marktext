<p align="center">
  <img src="https://raw.githubusercontent.com/Roland0511/dsh-marktext/main/icon.svg" width="72" alt="dsh-marktext 图标">
</p>

<h1 align="center">dsh-marktext</h1>

<p align="center">
  <b>写 Markdown，所见即成品。</b><br/>
  把 MarkText 的编辑器内核搬进 DeepSeek Harness 右侧栏。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-marktext"><img alt="npm 版本" src="https://img.shields.io/npm/v/dsh-marktext?color=cb3837"></a>
  <a href="https://www.npmjs.com/package/dsh-marktext"><img alt="npm 下载量" src="https://img.shields.io/npm/dm/dsh-marktext?color=brightgreen"></a>
  <a href="https://github.com/Roland0511/dsh-marktext/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/Roland0511/dsh-marktext?style=social"></a>
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue"></a>
  <img alt="DSH 0.2.1+" src="https://img.shields.io/badge/DSH-0.2.1%2B-4d6bfe">
  <a href="https://github.com/Roland0511/dsh-marktext/actions/workflows/publish.yml"><img alt="publish" src="https://github.com/Roland0511/dsh-marktext/actions/workflows/publish.yml/badge.svg"></a>
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.zh.md"><b>简体中文</b></a>
</p>

![dsh-marktext —— 在 DeepSeek Harness 右侧栏里编辑 Markdown](https://raw.githubusercontent.com/Roland0511/dsh-marktext/main/docs/assets/screenshot-dsh.png)

**点开侧栏里的 `.md`，它就是排版好的成品**——标题、表格、公式、图表、图片，全都能就地编辑。改一句话、删一段，或者**选中想聊的那段，直接引用到对话里**。没有左右分屏，没有「源码 ↔ 预览」来回切。`⌘S` 保存，文件经版本校验写回磁盘，不会盖掉别人的修改。

> MarkText 是 Electron 桌面应用，本插件**没有搬运它的桌面壳**，只用它拆出来的编辑器内核（[`@muyajs/core`](https://www.npmjs.com/package/@muyajs/core) / muya，MIT），外面套一层 DSH 集成。全部本地运行。

## 为什么它手感不一样

- **✍️ 你编辑的是文档，不是源码。** Markdown 标记全程隐藏，标题、列表、表格、引用都是真实元素——想改表格就点单元格，不用去数那一排竖线。
- **💬 引用直接进对话。** 选中任意文字，点顶栏 **引用**，一段带上文件路径的 Markdown 引用块就追加进输入框草稿。不用重打一遍，也不用说「第二节第三个列表项」。
- **📄 直接导出一个 PDF 文件。** 顶栏 **PDF**（或 `⌘P`）把当前文档变成 A4 的 `.pdf`，**就放在文档旁边**，并在侧栏打开让你当场验收——不经过打印对话框，没有下载提示，也不用再点「存储为 PDF」。导出前会先按页宽重排一遍，所以字是正常大小，而不是侧栏那么窄的一条；分页找空白行切，不会把一行字劈成两半。
- **📊 公式和图表直接渲染。** KaTeX、Mermaid、Vega、PlantUML 随插件一起发，按需加载，**离线可用**，不依赖 CDN，也不用登录。
- **🖼️ 图片落在该在的位置。** `![](assets/diagram.png)` 按文档所在目录解析，在别处写的文档搬进来照样显示正常。
- **💾 保存这件事很无聊，但这正是它该有的样子。** 停手 2.5 秒自动保存，`⌘S` 立即保存；磁盘上的文件被别人改过就弹冲突，绝不静默覆盖。
- **🌗 长得就像 DSH。** 明暗跟随宿主，不会突然变成另一套皮肤。
- **⌨️ 手指不用重新学。** `⌘Z` / `⇧⌘Z` 撤销重做、`⌘S` 保存、`⌘P` 导出 PDF、`⌘F` 查找。

## 一行装好

```sh
dsh plugin --profile web add dsh-marktext
```

**用桌面 app？** 打开 **Plugins → Add plugin → Install a third-party plugin**，输入 `dsh-marktext`，点 **Enable now**，重启一次 app。（桌面 profile 由 app 自己管理，上面那行命令是给 `dsh web` 用的。）

<details>
<summary>手动安装、从 GitHub 安装、环境要求</summary>

**手动（desktop profile）** —— 编辑 `~/.dsh/profiles/desktop/package.json`：

```jsonc
{
  "dsh": { "profile": { "bundles": [..., "dsh-marktext"] } },
  "dependencies": { ..., "dsh-marktext": "^0.1.13" }
}
```

```sh
cd ~/.dsh/profiles/desktop && pnpm install
```

然后重启 app。

**从 GitHub 装：** 任何接受包名的地方都能换成 `github:Roland0511/dsh-marktext`——构建产物已入库，不需要再构建。

**环境要求：** DeepSeek Harness **0.2.1+**（需要 `ctx.sidebarRightTabs`、`ctx.slots`、`ctx.fs`、`ctx.webServer`；引用功能另外用到 `ctx.conversation`）。只有从源码构建时才需要 Node 20+。

</details>

## 你会得到什么

| | |
|---|---|
| **任何 Markdown 都能开**<br/>`*.md`、`*.markdown`、`*.mdown`、`*.mkd` 在侧栏直接以编辑页签打开。 | **真正的编辑**<br/>表格、代码块、引用、任务列表都能直接操作，不是拿文本改来改去。 |
| **引用到对话**<br/>选中 → **引用** → 带出处路径的引用块落进输入框草稿。 | **导出 PDF**<br/>`⌘P` 或顶栏按钮，真正的 A4 文件，按页宽排版，落在 `.md` 旁边并在侧栏打开。 |
| **公式与图表**<br/>KaTeX 行内/块级、Mermaid、Vega-Lite、PlantUML、Prism 高亮。 | **带版本校验的保存**<br/>乐观并发，冲突会暴露出来而不是被覆盖。 |
| **相对路径图片**<br/>按文档目录解析，走每个文档自己的令牌。 | **文件之间的链接**<br/>`[next](next.md)` 在另一个 MarkText 页签打开，而不是当纯文本。 |
| **原生快捷键**<br/>`⌘S` · `⌘Z` · `⇧⌘Z` · `⌘P`，自动保存，顶栏有未保存小圆点。 | **跟随 DSH**<br/>明暗主题、语言、宿主自己的侧栏外观。 |

## 内部长什么样

```
DSH Web (React)
  lib/client.js  ── 侧栏页签类型 `marktext`（匹配 *.md）
      │             tab body = <iframe src="/dsh-marktext/renderer/<token>/index.html">
      │ postMessage（统一信封：__dshmkt）
      ▼
renderer/（独立 Vite 构建，内含 muya + mermaid）
      │ fetch
      ▼
lib/index.js（宿主侧插件）
  · /dsh-marktext/renderer/<token>/*   静态资源；未命中回落到文档目录
  · /dsh-marktext/api/open|save|stat   经 ctx.fs；保存必须带 baseVersion
```

编辑器放在 iframe 里是刻意的：muya 把 CSS 变量声明在 `:root` 上，浮动工具栏又挂在 `document.body` 上，内联进宿主会漏样式。iframe 把这些全隔开，跨边界的只有文档、主题和保存。

<details>
<summary>消息协议（v1）与文件策略兜底</summary>

信封：`{ __dshmkt: true, dir: 'down' | 'up', type, content }`

| 方向 | type | content |
|---|---|---|
| down | `doc` | `{ path, displayPath, text, version, dark, locale }` |
| down | `saved` | `{ version }` |
| down | `save-error` | `{ code, message }` |
| down | `theme` | `{ dark }` |
| down | `chat-inserted` | `{ mode: 'draft' \| 'clipboard' \| 'none' }` |
| down | `pdf-saved` | `{ path, size }` |
| down | `pdf-error` | `{ code, message }` |
| up | `ready` | — |
| up | `dirty` | `{ dirty }` |
| up | `save` | `{ text, baseVersion }` |
| up | `reload` | — |
| up | `insert-chat` | `{ text }` |
| up | `save-pdf` | `{ data }`（base64） |
| up | `open-external` | `{ href }` |

**引用怎么进对话。** 客户端先解析页签所属的 session，向 `ctx.conversation.input.for(sessionCtx)` 要输入框门面，再用 `setDraft` 把 `buildQuote(选区, 路径)` 追加到当前草稿后面——输入框自己的撤销栈还在，一次撤销就能退回去。宿主没有 conversation 服务时（老版本 DSH，或 profile 里没装对话插件），引用改放剪贴板，并在顶栏如实提示：功能降级，但不会消失。

**保存与文件策略。** 正常路径是 `ctx.fs.writeText(target, text, { kind: 'replaceIfVersion', version })`；版本过期返回 `FS_STALE_VERSION`，界面弹冲突横幅。宿主策略拒绝写入时（`FS_SANDBOX_DENIED`，例如 `workspace-write` / `read-only`），保存兜底到 Node 的 `fs.writeFile`，**但版本守卫照旧**——写前写后各校验一次。真正的 OS 错误（`EACCES` / `EPERM`）原样抛出。

</details>

## 出问题怎么办

如果 `.md` 打开了但页签提示类似「no viewer available」，说明客户端那半边没注册上页签体。读一下注册回执：

```sh
curl -s http://127.0.0.1:<DSH端口>/dsh-marktext/api/diag | python3 -m json.tool
```

`typeRegistered`、`bodyRegistered`、`conversation`、`errors` 会指出是哪一步挂了——`"conversation": false` 意味着**引用**会退到剪贴板。

## 常见问题

**这就是 MarkText 吗？** 不是。它是 MarkText 的编辑器内核（muya）套了 DSH 集成——没有 Electron，没有桌面壳，不用再装第二个 app。

**引用会进哪个对话？** 进这个页签所属 session 的草稿，不是你现在正在看的那个——从 A 会话打开的文件，在 B 会话里点引用，引用仍然落在 A，那是文件所属的会话。

**PDF 是真文件吗？** 是——点 **PDF** 后 `notes/plan.md` 旁边会出现 `notes/plan.pdf`（重名时加 `-1`、`-2`，不会覆盖），侧栏随即打开这个 PDF。文件在页面里生成（html2canvas + jsPDF，只在你点导出时才加载），A4 版式、半英寸页边距。代价是文字被栅格化，PDF 里选不中、搜不到——这是不塞 500 kB 排版引擎的代价，换来插件运行时零依赖、全离线。

**为什么是保存而不是下载？** 编辑器跑在 Electron 的 `dsh-app://` 壳里，它会把 `blob:` 下载当成「在新标签页打开」。改由宿主 `fs` 落盘就完全绕开了这个问题，文件也直接放在文档所在目录。

**会不会把我的文件重排？** 它保存的是编辑器序列化出来的结果，标准 CommonMark/GFM。真正保护你的是版本守卫：文件在下面被改了，你得到的是冲突，不是静默重写。

**离线能用吗？** 能。所有资源、字体、图表引擎、语法高亮都随插件发布。

**会和其他 Markdown 插件打架吗？** 它和 `dsh-markdown-typora` 都在 `extension` 档抢 `*.md`，装一个就好。

**已知限制：** 绝对路径图片（`/abs/a.png`、`file://`）还解析不了；引用需要是会话内文件（绝对路径页签会退到剪贴板）；导出的 PDF 是栅格图，文字不可选不可搜。包体约 4 MB，首屏约 1.6 MB，导出 PDF 时另加载约 240 kB。

## 开发

```sh
npm install
npm run build:renderer            # 写出 renderer/（已入库；只有改 src/renderer 时才需要）
npm test                          # 宿主路由、版本守卫、目录穿越、来源围栏、客户端注册、引用格式化
node scripts/verify-renderer.mjs  # headless Chrome：打开 → 渲染 → 保存 → 落盘
node scripts/verify-pdf.mjs       # headless Chrome：渲染 → 导出 PDF → 校验字节
node scripts/screenshot.mjs       # 重新生成 docs/assets/screenshot-*.png
```

## 发布

发布走 **npm Trusted Publishing（OIDC）**——仓库里没有 token，也没有 secret。每次推 `main` 都会跑测试、校验入库的 `renderer/` 和 `src/renderer/` 是否一致，只有版本号是新的才发布，并发一个 **GitHub Release**（`v<version>`，自动生成 notes）。

```sh
npm version patch --no-git-tag-version
git commit -am "chore: release x.y.z"
git push
```

## Star 曲线

<a href="https://www.star-history.com/?type=date&repos=Roland0511%2Fdsh-marktext">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=Roland0511/dsh-marktext&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=Roland0511/dsh-marktext&type=date&legend=top-left" />
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=Roland0511/dsh-marktext&type=date&legend=top-left" />
  </picture>
</a>

## 许可证

MIT —— 见 [LICENSE](LICENSE)。第三方组件与 MarkText 署名见 [NOTICE.md](NOTICE.md)。
