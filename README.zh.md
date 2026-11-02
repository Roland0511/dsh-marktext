# dsh-marktext

[English](README.md) | [简体中文](README.zh.md)

[![npm](https://img.shields.io/npm/v/dsh-marktext.svg)](https://www.npmjs.com/package/dsh-marktext)
[![publish](https://github.com/Roland0511/dsh-marktext/actions/workflows/publish.yml/badge.svg)](https://github.com/Roland0511/dsh-marktext/actions/workflows/publish.yml)

![dsh-marktext —— 在 DeepSeek Harness 右侧栏里编辑 Markdown](https://raw.githubusercontent.com/Roland0511/dsh-marktext/main/docs/assets/screenshot-dsh.png)

<details>
<summary>只截编辑器（明 / 暗）</summary>

![编辑器（明色）](https://raw.githubusercontent.com/Roland0511/dsh-marktext/main/docs/assets/screenshot-light.png)

![编辑器（暗色）](https://raw.githubusercontent.com/Roland0511/dsh-marktext/main/docs/assets/screenshot-dark.png)

</details>

**把 MarkText 的编辑器内核装进 DeepSeek Harness 右侧栏。** 点开 `.md` 就是排版好的文档——标题、表格、公式、图表、图片——改完直接写回磁盘，保存带版本守卫，不会盲覆盖别人的修改。

> MarkText 是 Electron 桌面应用，本项目**没有搬运它的桌面壳**，只使用它拆出来的编辑器库 [`@muyajs/core`](https://www.npmjs.com/package/@muyajs/core)（muya，MIT），外加一层 DSH 集成。所以这是「用 MarkText 的内核」，不是「在 DSH 里跑 MarkText」。

## 它能做什么

- 在侧栏文件树里点任意 `*.md` / `*.markdown` / `*.mdown` / `*.mkd`，打开一个 MarkText 风格的编辑标签页
- 真正的所见即所得：markdown 标记隐藏，标题/列表/表格/引用/代码块都是真实 DOM
- 公式（KaTeX）、Mermaid、Vega、PlantUML、Prism 代码高亮全部内置且离线，按需加载
- 顶栏有文件名、未保存圆点、状态和「保存」按钮；`⌘S` / `Ctrl+S` 随时保存
- 停止输入 2.5 秒后自动保存
- 深色/浅色跟随宿主主题
- markdown 里的相对图片（`![](assets/a.png)`）按文档所在目录加载

## 安装

### 方式一：DSH 应用内（推荐）

侧栏 **Plugins** → **Add plugin** → **Install a third-party plugin**，输入：

```
dsh-marktext
```

点 **Enable now**，重启一次 app，然后打开任意 `.md`。

### 方式二：命令行（web profile）

```sh
dsh plugin --profile web add dsh-marktext
```

### 方式三：手动改 profile（桌面 app，兜底）

桌面 app 的 `desktop` profile 由 app 自己管理，`dsh plugin --profile desktop` 会被拒绝。手动改 `~/.dsh/profiles/desktop/package.json`：

```jsonc
{
  "dsh": { "profile": { "bundles": [..., "dsh-marktext"] } },
  "dependencies": { ..., "dsh-marktext": "^0.1.1" }
}
```

```sh
cd ~/.dsh/profiles/desktop && pnpm install
```

然后重启 app。

### 从 GitHub 安装（替代 npm）

任何接受包名的地方都能换成 `github:Roland0511/dsh-marktext`（构建产物 `renderer/` 已入库，安装时不需要再构建）。

## 环境要求

- DeepSeek Harness **0.2.1+**，需要 `ctx.sidebarRightTabs`、`ctx.slots`、`ctx.fs`、`ctx.webServer`
- 只有从源码构建时才需要 Node **20+**

## 架构

```
DSH Web（React）
  lib/client.js  ── 注册侧栏标签类型 `marktext`（patterns: *.md）
      │            标签体 = <iframe src="/dsh-marktext/renderer/<token>/index.html">
      │ postMessage（统一信封 __dshmkt）
      ▼
renderer/（独立 Vite 构建，内含 muya）
      │ fetch
      ▼
lib/index.js（宿主插件）
  · /dsh-marktext/renderer/<token>/*   静态资源；miss 时回落到文档目录（相对图片）
  · /dsh-marktext/api/open|save|stat   走 ctx.fs；save 必须带 baseVersion
```

为什么用 iframe 而不是直接渲染进 React：muya 的 CSS 变量定义在 `:root`、浮层直接挂到 `document.body`，内联会把样式泄漏到宿主。iframe 把这些一次性隔离，只桥接「文档、主题、保存」三件事。

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

## 保存与文件策略

- 正常路径：`ctx.fs.writeText(target, text, { kind: 'replaceIfVersion', version })`。版本不符返回 `FS_STALE_VERSION`，界面弹冲突横幅，绝不覆盖。
- 如果宿主文件策略拒绝写入（`FS_SANDBOX_DENIED`，例如 `workspace-write` / `read-only`），保存会回退到 Node 原生 `fs.writeFile`——**版本守卫不放松**：写前先用 `ctx.fs.stat` 比对版本，写后再取新版本。
- 回退只作用于「保存」这一个动作，插件不因此获得其它写能力；真正的 OS 权限错误（`EACCES` / `EPERM`）原样报错。
- 回退成功时 `/save` 的返回值带 `nativeFallback: true`。

## 排查

如果 `.md` 打开了但标签页提示类似「没有可用的查看方式」，说明客户端没注册上标签体。客户端会把注册结果上报给宿主，直接看：

```sh
curl -s http://127.0.0.1:<DSH端口>/dsh-marktext/api/diag | python3 -m json.tool
```

`typeRegistered`、`bodyRegistered` 和 `errors` 会指出是哪一步失败。

## 已知限制

- **只认相对图片路径** —— `/absolute/a.png` 和 `file://` 暂不支持。
- 没有「选中片段插入对话」，没有文件树操作，没有导出 PDF —— 这些是下一步。
- 包体积：tarball 约 4 MB（解压约 9.4 MB，745 个文件）；首屏约 1.6 MB（gzip ≈ 470 KB），Mermaid / Vega / Prism 的 chunk 按需加载。
- 与 `dsh-markdown-typora` 功能重叠：两者都在 `extension` band 注册 `*.md`，只会有一个生效，建议只装一个。
- 基于 npm 上的 muya `0.2.0`；仓库 HEAD 的 API 更新（locale 导出不同），升级需要做一次兼容。

## 开发

```sh
npm install
npm run build:renderer            # 产出 renderer/（已入库；只有改 src/renderer 时才需要）
npm test                          # 宿主路由、版本守卫、路径穿越、Origin 栅栏、客户端注册
node scripts/verify-renderer.mjs  # headless Chrome：打开 → 渲染 → 保存 → 落盘
```

## 发布

使用 **npm Trusted Publishing（OIDC）**，仓库里不存任何 token 或 secret。每次推送到 `main`，workflow 会跑测试、校验 `renderer/` 与源码一致，只有 `package.json` 的版本是新的才发布，并自动附带 provenance；同时会在 GitHub 上打 tag 并创建 **Release**（`v<版本号>`，自动生成 release notes）。

```sh
npm version patch --no-git-tag-version
git commit -am "chore: release x.y.z"
git push
```

## Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=Roland0511/dsh-marktext&type=Date)](https://star-history.com/#Roland0511/dsh-marktext&Date)

## 许可

MIT —— 见 [LICENSE](LICENSE)。第三方组件与 MarkText 署名：[NOTICE.md](NOTICE.md)。
