/**
 * 端到端冒烟：真 HTTP 服务 + 真 renderer + 真 muya，在 headless Chrome 里
 * 走一遍 open → 渲染 → 点保存 → 落盘，验证协议与版本守卫串起来是通的。
 *
 * 用法：node scripts/verify-renderer.mjs
 * 退出码 0 表示拿到 saved 回执且磁盘内容已更新。
 */

import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHost } from '../lib/index.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const workspace = await mkdtemp(join(tmpdir(), 'dsh-marktext-e2e-'))
const docDir = join(workspace, 'notes')
await mkdir(docDir, { recursive: true })
const docPath = join(docDir, 'smoke.md')
const original = '# Hello MarkText\n\n- alpha\n- beta\n\n```js\nconsole.log(1)\n```\n'
await writeFile(docPath, original, 'utf8')

const fsAdapter = {
  async resolve(path) {
    return { displayPath: path, targetKey: path }
  },
  async stat(target) {
    try {
      const info = await stat(target.displayPath)
      return {
        type: info.isDirectory() ? 'directory' : 'file',
        version: `${info.mtimeMs}-${info.size}`,
        size: info.size,
      }
    } catch {
      return undefined
    }
  },
  async readText(target) {
    return readFile(target.displayPath, 'utf8')
  },
  async writeText(target, text, options) {
    const before = await stat(target.displayPath)
    const current = `${before.mtimeMs}-${before.size}`
    if (options?.version !== current) {
      throw Object.assign(new Error('file changed since read'), { code: 'FS_STALE_VERSION' })
    }
    await writeFile(target.displayPath, text, 'utf8')
    const after = await stat(target.displayPath)
    return { version: `${after.mtimeMs}-${after.size}` }
  },
}

const host = createHost({ fs: fsAdapter, log: { warn: (...args) => console.warn('[host]', ...args) } })

/** 最小“客户端”替身：实现 README 里的 postMessage 协议，代替 DSH 侧栏那一层。 */
const harness = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0">
<iframe id="f" style="width:800px;height:600px;border:0"></iframe>
<pre id="result">pending</pre>
<script>
const out = []
const frame = document.getElementById('f')
const result = document.getElementById('result')
function post(type, content) {
  frame.contentWindow.postMessage({ __dshmkt: true, dir: 'down', type, content }, '*')
}
function done(value) { result.textContent = JSON.stringify(value); document.title = 'DONE' }
async function openDoc() {
  const res = await fetch('/dsh-marktext/api/open', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: ${JSON.stringify(docPath)} }),
  })
  const body = await res.json()
  if (!body.ok) return done({ step: 'open', error: body.error })
  window.__doc = { path: body.value.displayPath, version: body.value.version }
  frame.src = body.value.frameSrc
}
window.addEventListener('message', async (event) => {
  const data = event.data
  if (!data || data.__dshmkt !== true || data.dir !== 'up') return
  if (data.type === 'ready') {
    const res = await fetch('/dsh-marktext/api/open', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: window.__doc.path }),
    })
    const body = await res.json()
    post('doc', { path: body.value.displayPath, displayPath: body.value.displayPath, text: body.value.text, version: body.value.version, dark: false, locale: 'zh' })
    setTimeout(() => {
      const inner = frame.contentDocument
      const editor = inner && inner.querySelector('.mu-editor')
      const heading = inner && inner.querySelector('h1.mu-atx-heading')
      out.push({ step: 'rendered', editor: !!editor, heading: heading ? heading.textContent.trim() : '' })
      const save = inner && inner.querySelector('#save')
      if (save) save.click()
      else done({ step: 'save-button-missing', out })
    }, 1200)
    return
  }
  if (data.type === 'save') {
    const res = await fetch('/dsh-marktext/api/save', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: window.__doc.path, text: data.content.text, baseVersion: data.content.baseVersion }),
    })
    const body = await res.json()
    if (body.ok) {
      window.__doc.version = body.value.version
      post('saved', { version: body.value.version })
      out.push({ step: 'saved', version: body.value.version })
      done({ step: 'ok', out })
    } else {
      post('save-error', body.error)
    }
    return
  }
  if (data.type === 'saved') {
    out.push({ step: 'saved', version: data.content.version })
    done({ step: 'ok', out })
    return
  }
  if (data.type === 'save-error') {
    out.push({ step: 'save-error', error: data.content })
    done({ step: 'error', out })
  }
})
openDoc()
</script>`

const seen = []
const server = createServer((req, res) => {
  seen.push(`${req.method} ${req.url}`)
  if (req.url === '/') {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.end(harness)
    return
  }
  void host.handle(req, res).catch((error) => {
    if (!res.headersSent) res.statusCode = 500
    res.end(String(error?.message ?? error))
  })
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const url = `http://127.0.0.1:${port}/`

const profile = await mkdtemp(join(tmpdir(), 'dsh-marktext-chrome-'))
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${profile}`,
    '--virtual-time-budget=15000',
    '--dump-dom',
    url,
  ],
  { stdio: ['ignore', 'pipe', 'ignore'] },
)

let dom = ''
chrome.stdout.on('data', (chunk) => {
  dom += chunk
})
const code = await new Promise((resolve) => chrome.on('close', resolve))
server.close()

if (!dom.includes('id="result"')) {
  await writeFile(join(workspace, 'dump.html'), dom, 'utf8')
  console.error('dump saved to', join(workspace, 'dump.html'), 'bytes', dom.length)
}
const match = /<pre id="result">([\s\S]*?)<\/pre>/.exec(dom)
let reportText = match?.[1] ?? null
let report
try {
  report = JSON.parse(match?.[1] ?? 'null')
} catch {
  report = null
}

const disk = await readFile(docPath, 'utf8')
const ok = report?.step === 'ok' && disk === original && code === 0 && report.out.some((item) => item.step === 'rendered' && item.editor)
console.log(JSON.stringify({ chromeExit: code, reportText, report, domBytes: dom.length, seen }, null, 2))
if (!ok) {
  console.error('verify-renderer: FAILED')
  process.exit(1)
}
console.log('verify-renderer: OK — 打开、渲染、保存链路均通过')
