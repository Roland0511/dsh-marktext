/**
 * Markdown 图片地址解析（渲染器侧）。
 *
 * muya（MarkText 的编辑器内核）在渲染 `![alt](src)` 时，会把所有「不是 http(s) /
 * data:」的地址一律改写成 `file://<原地址>` —— 那是桌面端的假设，Electron 里可以
 * 读本地文件。dsh-marktext 的渲染器实际跑在 http(s) 页面的 iframe 里，`file://`
 * 会被浏览器直接拒绝，于是相对图片（`assets/a.png`、`docs/a.png`）全部加载失败。
 *
 * 构建时（vite.config.js 的 muyaImagePathShim）把 muya 拼 `file://` 的那一处改成
 * 调用本文件导出的解析器；这里把假前缀还原成相对路径，再按 iframe 自己的 base 解析：
 *
 *   docs/a.png  →  http://127.0.0.1:<port>/dsh-marktext/renderer/<token>/docs/a.png
 *
 * 宿主的 `/renderer/<token>/` 路由找不到插件静态资源时，会回退到「文档所在目录」取
 * 文件，所以这个 URL 正好等于「相对 Markdown 文件所在目录」。Markdown 源文本本身
 * 不参与改写，保存时写回的仍是用户写的相对路径。
 *
 * 绝对路径（`/abs/a.png`、`C:\a.png`、`file:///...`）指向文档目录之外，当前不支持，
 * 原样返回交给浏览器（会加载失败并显示 muya 的占位图标），见 README 已知限制。
 */

const FILE_PREFIX = 'file://'
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i
const WINDOWS_ABSOLUTE = /^[a-z]:[\\/]/i

/**
 * 把 muya 交给 `<img>` 的图片地址解析成浏览器可加载的 URL。
 * @param {string} raw - muya 原始地址（可能带假的 file:// 前缀）
 * @param {string} base - iframe 文档的 base URI（`document.baseURI`）
 * @returns {string} 可加载的地址；绝对路径/外链原样返回
 */
export function resolveMarkdownImagePath(raw, base) {
  if (typeof raw !== 'string' || raw.length === 0) return raw

  let relative = raw
  if (raw.startsWith(FILE_PREFIX)) {
    const rest = raw.slice(FILE_PREFIX.length)
    // 真正的绝对路径：POSIX 的 file:///x、Windows 的 C:\x 或 UNC 的 \\host\share。
    if (rest.startsWith('/') || rest.startsWith('\\\\') || WINDOWS_ABSOLUTE.test(rest)) return raw
    relative = rest
  } else if (HAS_SCHEME.test(raw) || raw.startsWith('//')) {
    // 外链 / data: / 协议相对地址不归我们管。
    return raw
  }

  try {
    return new URL(relative, base).href
  } catch {
    return raw
  }
}
