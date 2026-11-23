import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { defineConfig } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))

/**
 * 渲染器构建：产物直接输出到包根 renderer/，随包提交，安装时不需要用户再构建。
 * base 用相对路径，因为页面挂在 /dsh-marktext/renderer/<token>/ 这类动态前缀下。
 */
/**
 * muya 的发布产物里带着自己的 mermaid 分块（`../mermaid.core-*.mjs`）。
 * 这些分块是给它自己的打包器准备的；被我们再打包一次会打乱模块初始化顺序
 * （`he is not a function`），图表直接渲染失败。所以把它们重定向到运行时 shim，
 * 由浏览器加载 mermaid 官方 UMD 产物（见 mermaid-runtime.js）。
 */
function mermaidRuntimeShim() {
  const shim = join(here, 'mermaid-runtime.js')
  return {
    name: 'mermaid-runtime-shim',
    enforce: 'pre',
    async load(id) {
      if (/mermaid\.core-[^/]+\.mjs$/.test(id)) return readFile(shim, 'utf8')
      return null
    },
  }
}

/**
 * muya 的图片渲染把「非 http(s) / data:」的地址硬拼成 `file://<原地址>`（它服务于
 * MarkText 桌面端，那里能读本地文件）。渲染器实际跑在 http 页面的 iframe 里，
 * `file://` 会被浏览器拒绝，于是 `![](assets/a.png)` 这类相对图片全部加载失败。
 *
 * 这里在构建时把那一处 `file://` 前缀换成运行时解析器（main.js 注入
 * `globalThis.__dshmktResolveImagePath`）：相对路径按 iframe 的 base 解析成
 * `/dsh-marktext/renderer/<token>/...`，由宿主按文档目录回源；Markdown 源文本不变，
 * 保存时写回的仍然是用户写的相对路径。见 image-path.js。
 *
 * 替换点依赖 @muyajs/core 的版本（package.json 里锁死）；找不到或找到多处就直接让
 * 构建失败，避免升级后被静默跳过、图片又悄悄坏掉。
 */
function muyaImagePathShim() {
  const NEEDLE = 'src: `file://${e}`'
  const REPLACEMENT =
    'src: globalThis.__dshmktResolveImagePath ? globalThis.__dshmktResolveImagePath(e) : `file://${e}`'
  return {
    name: 'muya-image-path-shim',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').endsWith('/@muyajs/core/lib/es/index.js')) return null
      const occurrences = code.split(NEEDLE).length - 1
      if (occurrences !== 1) {
        throw new Error(
          `dsh-marktext: @muyajs/core 的图片路径实现变了（匹配到 ${occurrences} 处 ${JSON.stringify(NEEDLE)}），` +
            '请先确认 muya 的图片渲染逻辑，再更新 vite.config.js 里的 muyaImagePathShim',
        )
      }
      return { code: code.replace(NEEDLE, REPLACEMENT), map: null }
    },
  }
}

export default defineConfig({
  root: here,
  plugins: [muyaImagePathShim(), mermaidRuntimeShim()],
  base: './',
  build: {
    outDir: resolve(here, '../../renderer'),
    emptyOutDir: true,
    target: 'chrome110',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // muya 用 `import(\`prismjs/components/prism-${lang}\`)` 按语言分包，
          // 不合并会产生数百个 4KB chunk；合并成一个按需加载的语言包。
          if (id.includes('prismjs/components')) return 'prism-langs'
          return undefined
        },
      },
    },
  },
})
