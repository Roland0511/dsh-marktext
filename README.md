# dsh-marktext

把 **MarkText 的编辑器内核（muya）** 装进 DeepSeek Harness 右侧栏，用来编辑工作区里的 `.md` 文件：点开就是排版好的文档（标题、表格、公式、图片、代码高亮都在），改完 `⌘S` 写回磁盘，保存带版本守卫，不会盲覆盖别人的修改。

> MarkText（<https://github.com/marktext/marktext>）是 Electron 桌面应用，本项目**没有搬运它的桌面壳**，只使用它拆出来的编辑器库 [`@muyajs/core`](https://www.npmjs.com/package/@muyajs/core)（muya，MIT）。所以这是「用 MarkText 的内核」，不是「在 DSH 里跑 MarkText」。

## 它长什么样

- 在 DSH 右侧栏的文件树里点任意 `*.md` / `*.markdown`，会打开一个 MarkText 风格的编辑标签页
- 所见即所得：markdown 标记隐藏，标题/列表/表格/引用/代码块直接按渲染结果编辑
- 公式（KaTeX）、Mermaid、Vega、PlantUML、代码高亮全部内置且离线，按需加载
- 顶栏有文件名、未保存圆点、状态和「保存」按钮；`⌘S` / `Ctrl+S` 随时保存
- 停止输入 2.5 秒后自动保存（与 MarkText 桌面端行为一致）
- 深色/浅色跟随宿主主题
- markdown 里的相对图片（`![](assets/a.png)`）按文档所在目录加载

## 安装

### 方式一：app 内插件市场

在 DSH 的插件设置里安装 `dsh-marktext`（如果市场索引里已经有这个包）。

### 方式二：桌面 app 的 profile（推荐，当前仓库即插即用）

桌面版 profile 由 app 自己管理，手动安装的步骤与 `dsh-open-in` 相同：

1. 编辑 `~/.dsh/profiles/desktop/package.json`，在 `dsh.profile.bundles` 里加 `"dsh-marktext"`，在 `dependencies` 里加：

   ```json
   "dsh-marktext": "github:Roland0511/dsh-marktext"
   ```

2. 安装依赖并重启 app：

   ```sh
   cd ~/.dsh/profiles/desktop && corepack pnpm install
   ```

### 方式三：命令行（web profile）

```sh
dsh plugin --profile web add github:Roland0511/dsh-marktext
```

> 注意：桌面 app 的 `desktop` profile 不接受 `dsh plugin --profile desktop`，请用方式二。

## 卸载

从 `~/.dsh/profiles/desktop/package.json` 的 `dsh.profile.bundles` 与 `dependencies` 里删掉 `dsh-marktext`，重新 `corepack pnpm install` 并重启。

## 架构

```
DSH Web（React）
  lib/client.js  ── 注册侧栏标签类型 `marktext`（patterns: *.md）
      │             标签体 = <iframe src="/dsh-marktext/renderer/<token>/index.html">
      │ postMessage（一条自定义信封 __dshmkt）
      ▼
renderer/（Vite 构建的独立页面，内含 muya）
      │ fetch
      ▼
lib/index.js（宿主插件）
  · /dsh-marktext/renderer/<token>/*   静态资源；miss 时回落到文档目录（相对图片）
  · /dsh-marktext/api/open|save|stat   走 ctx.fs，save 必须带 baseVersion
```

为什么用 iframe 而不是直接渲染进 React：muya 的 CSS 变量定义在 `:root`、浮层直接挂到 `document.body`，直接内联会污染宿主样式；iframe 隔离后只需要桥接「文档、主题、保存」三件事。

## 消息协议（v1）

信封：`{ __dshmkt: true, dir: 'down' | 'up', type, content }`

| 方向 | type | content |
|---|---|---|
| down | `doc` | `{ path, displayPath, text, version, dark, locale }` |
| down | `saved` | `{ version }` |
| down | `save-error` | `{ code, message }` |
| down | `theme` | `{ dark }` |
| up | `ready` | — |
| up | `dirty` | `{ dirty }` |
| up | `save` | `{ text, baseVersion }` |
| up | `reload` | — |
| up | `open-external` | `{ href }` |

## 已知限制

- **只认相对图片路径**：`![](assets/a.png)` 可以，`/绝对路径/a.png` 或 `file://` 暂不支持。
- 没有「选中片段插入对话」、没有文件树内新建/重命名、没有导出 PDF —— 这些是下一步。
- 包体积约 11 MB（其中 Prism 语言包 2.6 MB、KaTeX 字体与 Mermaid 懒加载 chunk 占大头）；首屏约 1.6 MB（gzip ≈ 470 KB）。
- 与 `dsh-markdown-typora` 功能重叠：两者都注册 `*.md`（`extension` band），同时安装时由 DSH 的注册顺序决定谁生效，建议只留一个。
- 依赖 DSH 0.2.1+ 的 `ctx.sidebarRightTabs` / `ctx.slots` / `ctx.fs` / `ctx.webServer`。

## 已验证到什么程度

| 项目 | 状态 |
|---|---|
| 宿主路由 / 版本守卫 / 路径穿越 / Origin 栅栏 | `npm test`，8 个用例 |
| 客户端注册（`sidebarRightTabs` + `slots`） | `npm test` 的 vm 用例，按 DSH 契约断言注册参数 |
| 打开 → muya 渲染 → 点保存 → 落盘 | `node scripts/verify-renderer.mjs`，headless Chrome 真跑 |
| 在 DSH 应用内的侧栏交互 | 未自动验证（需要重启 app 后才能看），装好后请先开一个 `.md` 试 |

## 开发

```sh
npm install
npm run build:renderer   # 产出 renderer/（已随仓库提交，普通安装不需要这一步）
npm test                 # 宿主路由与版本守卫的单元测试
node scripts/verify-renderer.mjs  # headless Chrome 端到端：打开 → 渲染 → 保存
```

## 许可

MIT。见 [LICENSE](LICENSE)；第三方组件与 MarkText 的署名见 [NOTICE.md](NOTICE.md)。
