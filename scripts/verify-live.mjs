/**
 * 实时行为端到端冒烟：相对图片 + 外部修改自动刷新 + 有未保存修改时的冲突横幅。
 *
 * 走的是真实链路：真宿主 HTTP 路由 + 真 renderer + 真 muya，在 headless Chrome
 * 里用 CDP 操作页面（真实时间等待，不用虚拟时间），同时从 Node 侧直接改磁盘上的
 * Markdown，模拟“别的程序改了文件”。
 *
 * 用法：node scripts/verify-live.mjs
 * 退出码 0 表示三项断言全部通过：
 *   1. `![](assets/pixel.png)` 真的加载成功（mu-image-success，naturalWidth > 0）；
 *   2. 文档没有未保存修改时，磁盘一变，编辑器自动刷新到新内容；
 *   3. 有未保存修改时不会被静默覆盖，只弹冲突横幅；点横幅的“重新加载”才刷新。
 */

import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHost } from '../lib/index.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const workspace = await mkdtemp(join(tmpdir(), 'dsh-marktext-live-'))
const docDir = join(workspace, 'notes')
await mkdir(join(docDir, 'assets'), { recursive: true })
const docPath = join(docDir, 'live.md')
await writeFile(join(docDir, 'assets', 'pixel.png'), PNG_1x1)

const V1 = '# 实时刷新\n\n![pixel](assets/pixel.png)\n\n第一版正文。\n'
const V2 = '# 实时刷新\n\n![pixel](assets/pixel.png)\n\n第二版：外部写入 V2。\n'
const V3 = '# 实时刷新\n\n![pixel](assets/pixel.png)\n\n第三版：外部写入 V3。\n'
await writeFile(docPath, V1, 'utf8')

const fsAdapter = {
  async resolve(path) {
    return { displayPath: path, targetKey: path }
  },
  async stat(target) {
    try {
      const info = await stat(target.displayPath)
      return { type: info.isDirectory() ? 'directory' : 'file', version: `${info.mtimeMs}-${info.size}`, size: info.size }
    } catch {
      return undefined
    }
  },
  async readText(target) {
    return readFile(target.displayPath, 'utf8')
  },
  async writeText(target, text) {
    await writeFile(target.displayPath, text, 'utf8')
    const info = await stat(target.displayPath)
    return { version: `${info.mtimeMs}-${info.size}` }
  },
}

const host = createHost({ fs: fsAdapter, log: { warn: (...args) => console.warn('[host]', ...args) } })

/** 最小“客户端”替身：实现 README 里的 postMessage 协议，代替 DSH 侧栏那一层。 */
const harness = `<!doctype html>
<meta charset="utf-8">
<body style="margin:0">
<iframe id="f" style="width:900px;height:800px;border:0"></iframe>
<script>
const frame = document.getElementById('f')
const docPath = ${JSON.stringify(docPath)}
function post(type, content) {
  frame.contentWindow.postMessage({ __dshmkt: true, dir: 'down', type, content }, '*')
}
window.__client = { version: '' }
async function openDoc() {
  const res = await fetch('/dsh-marktext/api/open', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: docPath }),
  })
  const body = await res.json()
  window.__client.version = body.value.version
  window.__doc = body.value
  frame.src = body.value.frameSrc
}
window.addEventListener('message', async (event) => {
  const data = event.data
  if (!data || data.__dshmkt !== true || data.dir !== 'up') return
  if (data.type === 'ready') {
    const res = await fetch('/dsh-marktext/api/open', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: window.__doc.displayPath }),
    })
    const body = await res.json()
    window.__client.version = body.value.version
    post('doc', {
      path: body.value.displayPath, displayPath: body.value.displayPath, cwd: '',
      text: body.value.text, version: body.value.version, dark: false, locale: 'zh',
    })
  }
  if (data.type === 'reloaded') {
    // 客户端镜像的版本号必须跟上，否则接下来的保存会用旧版本
    window.__client.version = data.content.version
    window.__client.reloaded = (window.__client.reloaded || 0) + 1
  }
})
openDoc()
</script>`

const server = createServer((req, res) => {
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

/** 极简 CDP 客户端：只用到导航、求值、插字，Node 自带 fetch + WebSocket 就够。 */
async function withChrome(fn) {
  const profile = await mkdtemp(join(tmpdir(), 'dsh-marktext-chrome-'))
  const debuggingPort = 9700 + Math.floor(Math.random() * 300)
  const child = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--window-size=1100,900',
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${debuggingPort}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  try {
    let targets
    for (let i = 0; i < 80; i += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/list`)
        targets = await response.json()
        if (targets.some((target) => target.type === 'page')) break
      } catch {
        /* chrome 还没起来 */
      }
      await sleep(250)
    }
    const page = targets?.find((target) => target.type === 'page')
    assert.ok(page, 'chrome page target not found')

    const socket = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true })
      socket.addEventListener('error', reject, { once: true })
    })
    let counter = 0
    const pending = new Map()
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      const resolver = pending.get(message.id)
      if (resolver) {
        pending.delete(message.id)
        resolver(message)
      }
    })
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const id = (counter += 1)
        pending.set(id, resolve)
        socket.send(JSON.stringify({ id, method, params }))
      })
    /** 在页面里求值；返回 byValue 的结果。 */
    const evaluate = async (expression) => {
      const reply = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
        userGesture: true,
      })
      if (reply?.result?.exceptionDetails) {
        throw new Error(reply.result.exceptionDetails.text || 'evaluate failed')
      }
      return reply?.result?.result?.value
    }
    await send('Page.enable')
    await send('Runtime.enable')
    await fn({ send, evaluate, debugPort: debuggingPort })
    socket.close()
  } finally {
    child.kill()
  }
}

/** iframe 内容 DOM 的只读快照。 */
const SNAPSHOT = `(() => {
  const doc = document.getElementById('f').contentDocument
  if (!doc) return { ready: false }
  const imgs = Array.from(doc.querySelectorAll('img')).map((img) => ({
    src: img.getAttribute('src'),
    complete: img.complete,
    width: img.naturalWidth,
  }))
  return {
    ready: true,
    imgs,
    imageFailures: doc.querySelectorAll('.mu-image-fail').length,
    imageSuccesses: doc.querySelectorAll('.mu-image-success').length,
    text: doc.querySelector('.mu-editor') ? doc.querySelector('.mu-editor').textContent : '',
    status: doc.getElementById('status') ? doc.getElementById('status').textContent : '',
    bannerHidden: doc.getElementById('banner') ? doc.getElementById('banner').hidden : true,
    bannerText: doc.getElementById('banner-text') ? doc.getElementById('banner-text').textContent : '',
    dirty: doc.getElementById('dirty-dot') ? !doc.getElementById('dirty-dot').hidden : false,
    clientVersion: window.__client && window.__client.version,
    clientReloaded: window.__client && window.__client.reloaded,
  }
})()`

/** 轮询 DOM 直到 predicate 成立或超时，返回最后一次快照。 */
async function waitFor(evaluate, predicate, timeoutMs, label) {
  const deadline = Date.now() + timeoutMs
  let snapshot = null
  while (Date.now() < deadline) {
    snapshot = await evaluate(SNAPSHOT)
    if (snapshot && predicate(snapshot)) return snapshot
    await sleep(150)
  }
  throw new Error(`timeout waiting for ${label}: ${JSON.stringify(snapshot)}`)
}

const checks = []
function check(name, fn) {
  return Promise.resolve(fn()).then(
    (detail) => checks.push({ name, ok: true, detail }),
    (error) => {
      checks.push({ name, ok: false, error: String(error?.message ?? error) })
    },
  )
}

try {
  await withChrome(async ({ send, evaluate }) => {
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/` })
    await waitFor(evaluate, (snap) => snap.ready && snap.imageSuccesses > 0, 15000, 'editor + image')

    await check('相对图片通过文档目录回源加载', async () => {
      const snap = await evaluate(SNAPSHOT)
      const img = snap.imgs[0]
      assert.ok(img, 'image element exists')
      assert.match(img.src, /\/dsh-marktext\/renderer\/[a-f0-9]+\/assets\/pixel\.png$/)
      assert.equal(img.complete, true)
      assert.ok(img.width > 0, `naturalWidth should be > 0, got ${img.width}`)
      assert.equal(snap.imageFailures, 0)
      return { src: img.src, naturalWidth: img.width }
    })

    await check('外部修改且无未保存改动时自动刷新', async () => {
      await writeFile(docPath, V2, 'utf8')
      const snap = await waitFor(evaluate, (s) => !s.dirty && s.text.includes('V2'), 8000, 'auto refresh to V2')
      assert.equal(snap.bannerHidden, true)
      assert.match(snap.status, /自动刷新/)
      return { status: snap.status, clientVersion: snap.clientVersion }
    })

    await check('有未保存修改时只提示冲突、不丢改动', async () => {
      // 在正文末尾真实输入一段文字：走 contenteditable 的 insertText 路径，
      // muya 的输入事件会把它变成“有未保存修改”。
      await evaluate(`(() => {
        const doc = document.getElementById('f').contentDocument
        const target = doc.querySelector('.mu-paragraph .mu-content')
        target.focus()
        const range = doc.createRange()
        range.selectNodeContents(target)
        range.collapse(false)
        const selection = doc.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        doc.execCommand('insertText', false, '本地未保存修改。')
        return true
      })()`)
      const dirty = await waitFor(evaluate, (s) => s.dirty === true, 4000, 'dirty state')
      assert.ok(dirty.text.includes('本地未保存修改'), `typed text should be in editor: ${dirty.text}`)

      await writeFile(docPath, V3, 'utf8')
      const snap = await waitFor(evaluate, (s) => s.bannerHidden === false, 8000, 'conflict banner')
      assert.ok(snap.text.includes('本地未保存修改'), 'local edit must survive external change')
      assert.ok(!snap.text.includes('V3'), 'external content must not clobber local edits')
      assert.match(snap.bannerText, /已被其他程序修改/)
      return { bannerText: snap.bannerText, status: snap.status }
    })

    await check('点冲突横幅的“重新加载”才刷新到磁盘内容', async () => {
      await evaluate(`document.getElementById('f').contentDocument.getElementById('banner-action').click()`)
      const snap = await waitFor(
        evaluate,
        (s) => s.bannerHidden === true && s.text.includes('V3') && !s.dirty,
        8000,
        'reload after conflict',
      )
      assert.match(snap.status, /重新加载/)
      assert.ok(Number(snap.clientReloaded) >= 1, 'client mirror version must be updated')
      return { status: snap.status, clientReloaded: snap.clientReloaded }
    })

    await check('保存写回的仍是原始相对图片路径（token 路由不进 Markdown）', async () => {
      await evaluate(`document.getElementById('f').contentDocument.getElementById('save').click()`)
      await sleep(1500)
      const onDisk = await readFile(docPath, 'utf8')
      assert.ok(!onDisk.includes('/dsh-marktext/renderer/'), 'token route leaked into saved markdown')
      assert.ok(onDisk.includes('![pixel](assets/pixel.png)'), `relative image path lost: ${onDisk}`)
      assert.ok(onDisk.includes('V3'), `external content lost on save: ${onDisk}`)
      return { bytes: onDisk.length, saved: onDisk.slice(0, 120) }
    })
  })
} finally {
  server.close()
}

const failed = checks.filter((entry) => !entry.ok)
console.log(JSON.stringify({ checks }, null, 2))
if (failed.length > 0) {
  console.error(`verify-live: FAILED — ${failed.map((entry) => entry.name).join('; ')}`)
  process.exit(1)
}
console.log('verify-live: OK — 图片回源、外部修改自动刷新、冲突保护均通过')
