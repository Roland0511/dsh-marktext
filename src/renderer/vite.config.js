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

export default defineConfig({
  root: here,
  plugins: [mermaidRuntimeShim()],
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
