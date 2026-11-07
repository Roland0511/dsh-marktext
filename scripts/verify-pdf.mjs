/**
 * PDF 导出端到端冒烟：真 renderer + 真 muya + 真 html2canvas/jsPDF + 真宿主落盘。
 *
 * 走的是用户点按钮的那条路：点 #pdf → 渲染器生成字节 → postMessage 交给「客户端」
 * → 客户端 POST /dsh-marktext/api/pdf → 宿主写到文档旁边。最后断言磁盘上那个文件
 * 是合法 PDF（%PDF- 开头、EOF 结尾）。
 *
 * 用法：node scripts/verify-pdf.mjs
 * 环境变量 PDF_LINES=N 可以塞 N 段文本，用来验证多页分页。
 */

import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHost } from '../lib/index.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const workspace = await mkdtemp(join(tmpdir(), 'dsh-marktext-pdf-'))
const docDir = join(workspace, 'notes')
await mkdir(docDir, { recursive: true })
const docPath = join(docDir, 'smoke.md')
const original = [
  '# 导出测试',
  '',
  '一段中文正文，验证 CJK 字体会被正确栅格化进 PDF。',
  '',
  '| 项 | 值 |',
  '|---|---|',
  '| PDF | 真文件 |',
  '| 页数 | >1 |',
  '',
  '```js',
  'const a = 1',
  '```',
  '',
  '公式 $E = mc^2$ 也应该在。',
  '',
  ...Array.from({ length: Number(process.env.PDF_LINES || 0) }, (_, i) =>
    `第 ${i + 1} 段填充文本，用来把文档撑到多页，验证分页切片没有丢内容。`,
  ),
].join('\n')
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
  async writeText(target, text) {
    await writeFile(target.displayPath, text, 'utf8')
    return { version: '1' }
  },
}

const host = createHost({ fs: fsAdapter, log: { warn: () => {} } })

const harness = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0">
<iframe id="f" style="width:800px;height:900px;border:0"></iframe>
<pre id="result">pending</pre>
<script>
const frame = document.getElementById('f')
const result = document.getElementById('result')
const docPath = ${JSON.stringify(docPath)}
function post(type, content) {
  frame.contentWindow.postMessage({ __dshmkt: true, dir: 'down', type, content }, '*')
}
function done(value) { result.textContent = JSON.stringify(value); document.title = 'DONE' }

async function openDoc() {
  const res = await fetch('/dsh-marktext/api/open', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: docPath }),
  })
  const body = await res.json()
  if (!body.ok) return done({ step: 'open', error: body.error })
  window.__doc = { path: body.value.displayPath }
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
    post('doc', {
      path: body.value.displayPath, displayPath: body.value.displayPath,
      text: body.value.text, version: body.value.version, dark: false, locale: 'zh',
    })
    // 等 muya 把表格 / 代码块 / 公式渲染完，再真实地点按钮
    setTimeout(() => {
      const button = frame.contentDocument && frame.contentDocument.getElementById('pdf')
      if (!button) return done({ step: 'button-missing' })
      window.__startedAt = Date.now()
      button.click()
    }, 1800)
    return
  }

  if (data.type === 'save-pdf') {
    const payload = data.content && data.content.data ? data.content.data : ''
    const res = await fetch('/dsh-marktext/api/pdf', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: window.__doc.path, data: payload }),
    })
    const body = await res.json()
    if (!body.ok) return done({ step: 'save-error', error: body.error })
    done({ step: 'ok', saved: body.value, ms: Date.now() - window.__startedAt, payloadBytes: payload.length })
    return
  }
})
openDoc()
</script>`

const server = createServer((req, res) => {
  const pathname = new URL(req.url || '/', 'http://local').pathname
  if (pathname === '/') {
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
const url = `http://127.0.0.1:${server.address().port}/`

const profile = await mkdtemp(join(tmpdir(), 'dsh-marktext-pdf-chrome-'))
const chrome = spawn(
  CHROME,
  ['--headless=new', '--disable-gpu', '--no-sandbox', `--user-data-dir=${profile}`, '--virtual-time-budget=30000', '--dump-dom', url],
  { stdio: ['ignore', 'pipe', 'ignore'] },
)

let dom = ''
chrome.stdout.on('data', (chunk) => {
  dom += chunk
})
const code = await new Promise((resolve) => chrome.on('close', resolve))
server.close()

const match = /<pre id="result">([\s\S]*?)<\/pre>/.exec(dom)
let report = null
try {
  report = JSON.parse(match?.[1] ?? 'null')
} catch {
  report = null
}

let head = ''
let tail = ''
let size = 0
if (report?.step === 'ok' && report.saved?.path) {
  const bytes = await readFile(report.saved.path)
  size = bytes.length
  head = bytes.subarray(0, 5).toString('latin1')
  tail = bytes.subarray(Math.max(0, bytes.length - 6)).toString('latin1')
  // 留一份给人工看
  await writeFile('/tmp/dsh-marktext-smoke.pdf', bytes)
}

const ok =
  report?.step === 'ok' &&
  head === '%PDF-' &&
  tail.includes('%%EOF') &&
  size > 5000 &&
  (report.saved.path || '').endsWith('.pdf')

console.log(JSON.stringify({ chromeExit: code, report, file: { size, head, tail }, domBytes: dom.length }, null, 2))
if (!ok) {
  console.error('verify-pdf: FAILED')
  process.exit(1)
}
console.log(`verify-pdf: OK — 点按钮 → 生成 → 宿主落盘 ${report.saved.path}（${size} 字节，${report.ms}ms）`)
