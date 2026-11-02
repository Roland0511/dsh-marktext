/**
 * dsh-marktext — 宿主半边。
 *
 * 职责只有三件：
 *   1. 把 renderer/（muya 构建产物）当静态资源发出去；
 *   2. 用 ctx.fs 提供 open / save / stat —— 全部走版本守卫，绝不盲写；
 *   3. 给每份文档发一个路径 token，让 markdown 里的相对图片按原目录加载。
 *
 * 架构说明见 README.md。渲染器是独立的同源页面（iframe），不依赖 DSH 的 React 环境；
 * 客户端半边只负责“开哪个文件、把内容递给渲染器、把保存请求转给宿主”。
 */

import { createReadStream } from 'node:fs'
import { stat as fsStat } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-marktext'

/** webServer 挂路由；fs 负责带版本守卫的读写。缺任一服务时插件保持静默不激活。 */
export const inject = ['webServer', 'fs']

const ROUTE_PREFIX = '/dsh-marktext'
const STATIC_PREFIX = `${ROUTE_PREFIX}/renderer/`
const API_PREFIX = `${ROUTE_PREFIX}/api/`

/** 单次 open/save 的正文上限：含内联图的 Markdown 十几 MB 很常见。 */
const MAX_BODY_BYTES = 32 * 1024 * 1024
/** 单张本地图片/附件的响应上限。 */
const MAX_ASSET_BYTES = 64 * 1024 * 1024
/** 同时保留的文档目录 token 数；超出后按最旧淘汰。 */
const MAX_TOKENS = 64

/** 允许访问路由的 Origin：本机 loopback 渲染端与 Electron 外壳。 */
const ALLOWED_ORIGIN =
  /^(http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?|dsh-app:\/\/app|dsh:\/\/app)$/

const HERE = dirname(fileURLToPath(import.meta.url))
export const PLUGIN_ROOT = normalize(join(HERE, '..'))

export const MIME_BY_EXT = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
}

function mimeOf(filePath) {
  return MIME_BY_EXT[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
}

function sendJson(res, status, value) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(value))
}

function sendText(res, status, text) {
  res.statusCode = status
  res.setHeader('content-type', 'text/plain; charset=utf-8')
  res.end(text)
}

function fail(res, code, message) {
  sendJson(res, 200, { ok: false, error: { code, message } })
}

/** 逐段解码并拒绝 `..`，避免以 URL 编码绕过的目录穿越。 */
export function safeRelativePath(rawPath) {
  let decoded
  try {
    decoded = decodeURIComponent(rawPath)
  } catch {
    return undefined
  }
  const segments = decoded.split('/').filter((segment) => segment.length > 0)
  if (segments.some((segment) => segment === '..' || segment === '.')) return undefined
  return segments.join('/')
}

async function isRegularFile(filePath) {
  try {
    const info = await fsStat(filePath)
    return info.isFile()
  } catch {
    return false
  }
}

function streamFile(res, filePath, size) {
  res.statusCode = 200
  res.setHeader('content-type', mimeOf(filePath))
  if (typeof size === 'number') res.setHeader('content-length', String(size))
  res.setHeader('cache-control', 'no-store')
  const stream = createReadStream(filePath)
  stream.on('error', () => {
    if (!res.headersSent) sendText(res, 404, 'not found')
    else res.end()
  })
  stream.pipe(res)
}

async function readBody(req, limit) {
  const chunks = []
  let total = 0
  for await (const chunk of req) {
    total += chunk.length
    if (total > limit) {
      const error = new Error('request body too large')
      error.code = 'BODY_TOO_LARGE'
      throw error
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * 把 ctx 依赖收成一个可独立测试的对象，同时给 webServer 一个 handler。
 * @param {{ fs: object, log?: object, rootDir?: string }} options
 */
export function createHost(options = {}) {
  const fs = options.fs
  if (!fs || typeof fs.resolve !== 'function' || typeof fs.writeText !== 'function') {
    throw new Error('dsh-marktext: a filesystem service (ctx.fs) is required')
  }
  const log = options.log ?? console
  const pluginRoot = normalize(options.rootDir ?? PLUGIN_ROOT)
  const staticRoot = normalize(join(pluginRoot, 'renderer'))

  /** token → 文档所在目录；同时用于图片回源与 iframe 路径。 */
  const tokens = new Map()

  function mintToken(displayPath) {
    const token = randomUUID().replace(/-/g, '').slice(0, 16)
    tokens.set(token, { dir: normalize(dirname(displayPath)), at: Date.now() })
    while (tokens.size > MAX_TOKENS) tokens.delete(tokens.keys().next().value)
    return token
  }

  function fence(req) {
    const origin = req.headers?.origin
    if (typeof origin === 'string' && origin.length > 0 && !ALLOWED_ORIGIN.test(origin)) return false
    return true
  }

  /**
   * `/renderer/<token>/<rel>`：先当插件静态资源找，找不到再按该 token 的文档目录找。
   * 这样 `![](assets/a.png)` 这类相对图片不用改 markdown 就能加载。
   */
  async function serveAsset(req, res, rest) {
    const slash = rest.indexOf('/')
    const first = slash === -1 ? rest : rest.slice(0, slash)
    const entry = tokens.get(first)
    const relativeRaw = entry ? (slash === -1 ? '' : rest.slice(slash + 1)) : rest
    const relative = safeRelativePath(relativeRaw === '' ? 'index.html' : relativeRaw)
    if (relative === undefined || relative === '') return sendText(res, 400, 'bad path')

    const pluginFile = normalize(join(staticRoot, relative))
    if (pluginFile.startsWith(staticRoot + sep) && (await isRegularFile(pluginFile))) {
      return streamFile(res, pluginFile)
    }
    if (entry) {
      const docFile = normalize(join(entry.dir, relative))
      if (docFile.startsWith(entry.dir + sep) && (await isRegularFile(docFile))) {
        const info = await fsStat(docFile)
        if (info.size > MAX_ASSET_BYTES) return sendText(res, 413, 'file too large')
        return streamFile(res, docFile, info.size)
      }
    }
    return sendText(res, 404, 'not found')
  }

  async function resolveTarget(payload) {
    const path = typeof payload?.path === 'string' ? payload.path : ''
    if (!path) return { error: { code: 'BAD_REQUEST', message: 'path is required' } }
    const cwd = typeof payload?.cwd === 'string' && payload.cwd.length > 0 ? payload.cwd : undefined
    try {
      return { target: await fs.resolve(path, cwd ? { cwd } : undefined) }
    } catch (error) {
      return { error: { code: error?.code ?? 'FS_RESOLVE_FAILED', message: String(error?.message ?? error) } }
    }
  }

  async function apiOpen(payload) {
    const { target, error } = await resolveTarget(payload)
    if (error) return { ok: false, error }
    let info
    try {
      info = await fs.stat(target)
    } catch (cause) {
      return { ok: false, error: { code: cause?.code ?? 'FS_STAT_FAILED', message: String(cause?.message ?? cause) } }
    }
    if (!info) return { ok: false, error: { code: 'FS_NOT_FOUND', message: `not found: ${target.displayPath}` } }
    if (info.type !== 'file') {
      return { ok: false, error: { code: 'FS_NOT_REGULAR_FILE', message: `not a regular file: ${target.displayPath}` } }
    }
    let text
    try {
      text = await fs.readText(target)
    } catch (cause) {
      return { ok: false, error: { code: cause?.code ?? 'FS_READ_FAILED', message: String(cause?.message ?? cause) } }
    }
    const token = mintToken(target.displayPath)
    return {
      ok: true,
      value: {
        text,
        version: String(info.version ?? ''),
        displayPath: target.displayPath,
        size: info.size,
        frameSrc: `${STATIC_PREFIX}${token}/index.html`,
      },
    }
  }

  async function apiSave(payload) {
    const { target, error } = await resolveTarget(payload)
    if (error) return { ok: false, error }
    const text = typeof payload?.text === 'string' ? payload.text : null
    const baseVersion = typeof payload?.baseVersion === 'string' ? payload.baseVersion : ''
    if (text === null) return { ok: false, error: { code: 'BAD_REQUEST', message: 'text is required' } }
    if (!baseVersion) {
      return {
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'baseVersion is required — refusing to overwrite without a version guard' },
      }
    }
    try {
      const result = await fs.writeText(target, text, { kind: 'replaceIfVersion', version: baseVersion })
      return {
        ok: true,
        value: {
          version: String(result?.version ?? ''),
          displayPath: target.displayPath,
          size: Buffer.byteLength(text, 'utf8'),
        },
      }
    } catch (cause) {
      const code = cause?.code ?? 'FS_WRITE_FAILED'
      if (code !== 'FS_STALE_VERSION') {
        log.warn?.(`dsh-marktext: save failed (${code}): ${String(cause?.message ?? cause)}`)
      }
      return { ok: false, error: { code, message: String(cause?.message ?? cause) } }
    }
  }

  async function apiStat(payload) {
    const { target, error } = await resolveTarget(payload)
    if (error) return { ok: false, error }
    const info = await fs.stat(target)
    if (!info) return { ok: true, value: { missing: true } }
    return {
      ok: true,
      value: {
        missing: false,
        version: String(info.version ?? ''),
        size: info.size,
        type: info.type,
        displayPath: target.displayPath,
      },
    }
  }

  async function handleApi(req, res, endpoint) {
    let payload
    try {
      const raw = await readBody(req, MAX_BODY_BYTES)
      payload = raw.length > 0 ? JSON.parse(raw) : {}
    } catch (cause) {
      if (cause?.code === 'BODY_TOO_LARGE') return fail(res, 'BODY_TOO_LARGE', 'request body too large')
      return fail(res, 'BAD_JSON', 'request body must be JSON')
    }
    try {
      if (endpoint === 'open') return sendJson(res, 200, await apiOpen(payload))
      if (endpoint === 'save') return sendJson(res, 200, await apiSave(payload))
      if (endpoint === 'stat') return sendJson(res, 200, await apiStat(payload))
      return fail(res, 'NOT_FOUND', `unknown endpoint: ${endpoint}`)
    } catch (cause) {
      log.warn?.(`dsh-marktext: ${endpoint} failed: ${String(cause?.message ?? cause)}`)
      return fail(res, cause?.code ?? 'INTERNAL', String(cause?.message ?? cause))
    }
  }

  async function handle(req, res) {
    if (!fence(req)) return sendText(res, 403, 'forbidden')
    let url
    try {
      url = new URL(req.url ?? '/', `http://${req.headers?.host ?? '127.0.0.1'}`)
    } catch {
      return sendText(res, 400, 'bad request')
    }
    const pathname = url.pathname
    const isRead = req.method === 'GET' || req.method === 'HEAD'

    if (isRead && (pathname === STATIC_PREFIX || pathname === `${ROUTE_PREFIX}/renderer`)) {
      return serveAsset(req, res, 'index.html')
    }
    if (isRead && pathname.startsWith(STATIC_PREFIX)) {
      return serveAsset(req, res, pathname.slice(STATIC_PREFIX.length))
    }
    if (req.method === 'POST' && pathname.startsWith(API_PREFIX)) {
      return handleApi(req, res, pathname.slice(API_PREFIX.length))
    }
    return sendText(res, 404, 'not found')
  }

  return { handle, close: () => tokens.clear(), _internals: { tokens } }
}

/** @param ctx - Host Cordis context carrying webServer + fs. */
export function apply(ctx) {
  const log = ctx.logger ?? console
  ctx.effect(() => {
    const host = createHost({ fs: ctx.fs, log, rootDir: PLUGIN_ROOT })
    const dispose = ctx.webServer.register({ kind: 'prefix', path: ROUTE_PREFIX, handler: host.handle })
    log.info?.('dsh-marktext: routes mounted on %s', ROUTE_PREFIX)
    return () => {
      host.close()
      try {
        dispose?.()
      } catch {
        /* 已释放 */
      }
    }
  }, 'dsh-marktext: routes')
}
