/**
 * 运行时加载 MarkText 需要的 Mermaid。
 *
 * 为什么不用 Vite 打包 mermaid：muya 会用 `import('mermaid')` 懒加载它，而 mermaid 11
 * 的 ESM 分块在被再次打包后会出现模块初始化顺序错误（`he is not a function`），
 * 图表一渲染就失败。这里改成加载 mermaid 官方预构建的 UMD 产物，只做一次 <script> 注入。
 */
let loading

function loadMermaid() {
  if (typeof window !== 'undefined' && window.mermaid) return Promise.resolve(window.mermaid)
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'mermaid.min.js'
      script.async = true
      script.onload = () => (window.mermaid ? resolve(window.mermaid) : reject(new Error('mermaid did not register')))
      script.onerror = () => reject(new Error('failed to load mermaid.min.js'))
      document.head.appendChild(script)
    })
  }
  return loading
}

const mermaid = await loadMermaid()

export default mermaid
