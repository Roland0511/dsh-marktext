import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))

/**
 * 渲染器构建：产物直接输出到包根 renderer/，随包提交，安装时不需要用户再构建。
 * base 用相对路径，因为页面挂在 /dsh-marktext/renderer/<token>/ 这类动态前缀下。
 */
export default defineConfig({
  root: here,
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
