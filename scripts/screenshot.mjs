/**
 * 生成 README 用的产品截图：真宿主 + 真 renderer + 真 muya，headless Chrome 出图。
 *
 * 通过 CDP 控制 Chrome（真实时间等待，不用 --virtual-time-budget），
 * 这样 Mermaid / KaTeX 这类异步渲染能正常完成。
 *
 * 用法：node scripts/screenshot.mjs
 * 产物：docs/assets/screenshot-light.png、docs/assets/screenshot-dark.png
 */

import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { copyFile, mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHost } from '../lib/index.js'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const ASSETS = join(ROOT, 'docs', 'assets')
const WIDTH = 1240
const HEIGHT = 980
const SETTLE_MS = 6000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const workspace = await mkdtemp(join(tmpdir(), 'dsh-marktext-shot-'))
const docDir = join(workspace, 'notes')
await mkdir(docDir, { recursive: true })
const docPath = join(docDir, 'marktext-demo.md')
await copyFile(join(ROOT, 'docs', 'demo.md'), docPath)
const demoText = await readFile(docPath, 'utf8')

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
  async writeText() {
    throw new Error('not needed for screenshots')
  },
}

const host = createHost({ fs: fsAdapter, log: { warn: () => {} } })

/** 展示舞台：渐变背景 + 圆角卡片 + 阴影，里面是真正的 renderer iframe。 */
function stage(dark, text) {
  const bg = dark
    ? 'radial-gradient(1200px 620px at 18% -12%, #1e2c3d 0%, #0d1117 55%, #080b10 100%)'
    : 'radial-gradient(1200px 620px at 18% -12%, #e6eefa 0%, #f6f8fb 55%, #edf1f7 100%)'
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>dsh-marktext screenshot</title>
<style>
  html, body { height: 100%; margin: 0; }
  body {
    display: grid; place-items: center;
    background: ${bg};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .card {
    width: 1060px; height: 820px; overflow: hidden;
    border-radius: 14px;
    background: ${dark ? '#1b1c21' : '#fff'};
    border: 1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'};
    box-shadow: 0 32px 72px rgb(15 23 42 / ${dark ? '0.66' : '0.22'}),
                0 6px 18px rgb(15 23 42 / ${dark ? '0.5' : '0.10'});
  }
  iframe { width: 100%; height: 100%; border: 0; display: block; }
</style></head>
<body>
  <div class="card"><iframe id="frame"></iframe></div>
  <script>
    const dark = ${dark}
    const text = ${JSON.stringify(text)}
    const frame = document.getElementById('frame')
    const post = (type, content) => frame.contentWindow.postMessage({ __dshmkt: true, dir: 'down', type, content }, '*')
    async function open() {
      const res = await fetch('/dsh-marktext/api/open', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: ${JSON.stringify(docPath)} }),
      })
      const body = await res.json()
      if (!body.ok) { document.body.dataset.error = JSON.stringify(body.error); return }
      window.__doc = { path: body.value.displayPath, version: body.value.version }
      frame.src = body.value.frameSrc
    }
    window.addEventListener('message', (event) => {
      const data = event.data
      if (!data || data.__dshmkt !== true || data.dir !== 'up' || data.type !== 'ready') return
      post('doc', {
        path: window.__doc.path,
        displayPath: window.__doc.path,
        text,
        version: window.__doc.version,
        dark,
        locale: 'zh',
      })
    })
    open()
  </script>
</body></html>`
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1')
  if (url.pathname === '/' || url.pathname === '/dark') {
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.end(stage(url.pathname === '/dark', demoText))
    return
  }
  try {
    await host.handle(req, res)
  } catch (error) {
    if (!res.headersSent) res.statusCode = 500
    res.end(String(error?.message ?? error))
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
await mkdir(ASSETS, { recursive: true })

/** 极简 CDP 客户端：Node 自带 fetch + WebSocket，不需要额外依赖。 */
async function withChrome(fn) {
  const profile = await mkdtemp(join(tmpdir(), 'dsh-marktext-chrome-'))
  const debuggingPort = 9400 + Math.floor(Math.random() * 400)
  const child = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${debuggingPort}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  )
  try {
    let targets
    for (let i = 0; i < 60; i += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/list`)
        targets = await response.json()
        if (targets.some((target) => target.type === 'page')) break
      } catch {
        /* not up yet */
      }
      await sleep(250)
    }
    const page = targets?.find((target) => target.type === 'page')
    if (!page) throw new Error('chrome page target not found')

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

    await send('Page.enable')
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 2,
      mobile: false,
    })
    await fn({ send, socket })
    socket.close()
  } finally {
    child.kill()
  }
}

async function shoot(theme) {
  const out = join(ASSETS, `screenshot-${theme}.png`)
  await withChrome(async ({ send }) => {
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/${theme === 'dark' ? 'dark' : ''}` })
    await sleep(SETTLE_MS)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    const data = shot?.result?.data
    if (!data) throw new Error(`screenshot failed for ${theme}`)
    await writeFile(out, Buffer.from(data, 'base64'))
  })
  const info = await stat(out)
  console.log(`${theme}: ${info.size} bytes -> ${out}`)
}

await shoot('light')
await shoot('dark')
server.close()
