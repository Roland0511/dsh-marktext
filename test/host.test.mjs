import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { Readable, Writable } from 'node:stream'
import { once } from 'node:events'

import { apply, createHost, safeRelativePath } from '../lib/index.js'

function fakeFs(initial) {
  const files = new Map(Object.entries(initial))
  let clock = 1000
  return {
    files,
    async resolve(path, options) {
      if (typeof path !== 'string' || path.length === 0) throw Object.assign(new Error('bad path'), { code: 'FS_BAD_PATH' })
      return { displayPath: path, targetKey: path, cwd: options?.cwd }
    },
    async stat(target) {
      const key = target?.displayPath ?? target
      if (!files.has(key)) return undefined
      return { type: 'file', version: String(clock), size: Buffer.byteLength(files.get(key)) }
    },
    async readText(target) {
      return files.get(target?.displayPath ?? target)
    },
    async writeText(target, text, options) {
      if (options?.kind !== 'replaceIfVersion') throw new Error('expected replaceIfVersion')
      const current = String(clock)
      if (options.version !== current) {
        throw Object.assign(new Error('file changed since read'), { code: 'FS_STALE_VERSION' })
      }
      clock += 1
      files.set(target?.displayPath ?? target, text)
      return { version: String(clock) }
    },
  }
}

function makeReq(url, method = 'GET', body, headers = {}) {
  const payload = body === undefined ? [] : [Buffer.from(JSON.stringify(body))]
  const req = Readable.from(payload)
  req.url = url
  req.method = method
  req.headers = { host: '127.0.0.1:1234', ...headers }
  return req
}

function makeRes() {
  const chunks = []
  const res = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk))
      callback()
    },
  })
  res.statusCode = 200
  res.headers = {}
  res.headersSent = false
  res.setHeader = (name, value) => {
    res.headers[name.toLowerCase()] = value
  }
  Object.defineProperty(res, 'body', {
    get: () => Buffer.concat(chunks).toString('utf8'),
  })
  return res
}

async function call(host, url, method = 'GET', body, headers) {
  const res = makeRes()
  await host.handle(makeReq(url, method, body, headers), res)
  if (!res.writableFinished) await once(res, 'finish')
  return res
}

async function withRoot(t, fn) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-marktext-'))
  await mkdir(join(root, 'renderer', 'assets'), { recursive: true })
  await writeFile(join(root, 'renderer', 'index.html'), '<!doctype html><title>t</title>')
  await writeFile(join(root, 'renderer', 'assets', 'app.js'), 'console.log(1)')
  t.after(() => rm(root, { recursive: true, force: true }))
  await fn(root)
}

test('safeRelativePath rejects traversal', () => {
  assert.equal(safeRelativePath('docs/a.md'), 'docs/a.md')
  assert.equal(safeRelativePath('..%2Fsecret'), undefined)
  assert.equal(safeRelativePath('a/../../b'), undefined)
  assert.equal(safeRelativePath(''), '')
})

test('open returns text, version and a tokenised frame source', async (t) => {
  await withRoot(t, async (root) => {
    const fs = fakeFs({ '/ws/readme.md': '# hi' })
    const host = createHost({ fs, rootDir: root, log: { warn() {} } })
    const res = await call(host, '/dsh-marktext/api/open', 'POST', { path: '/ws/readme.md' })
    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.equal(body.ok, true)
    assert.equal(body.value.text, '# hi')
    assert.equal(body.value.version, '1000')
    assert.match(body.value.frameSrc, /^\/dsh-marktext\/renderer\/[a-f0-9]+\/index\.html$/)
  })
})

test('save refuses a stale version and accepts the current one', async (t) => {
  await withRoot(t, async (root) => {
    const fs = fakeFs({ '/ws/readme.md': '# hi' })
    const host = createHost({ fs, rootDir: root, log: { warn() {} } })

    const stale = await call(host, '/dsh-marktext/api/save', 'POST', {
      path: '/ws/readme.md',
      text: '# hi2',
      baseVersion: '999',
    })
    assert.equal(JSON.parse(stale.body).error.code, 'FS_STALE_VERSION')
    assert.equal(fs.files.get('/ws/readme.md'), '# hi')

    const fresh = await call(host, '/dsh-marktext/api/save', 'POST', {
      path: '/ws/readme.md',
      text: '# hi2',
      baseVersion: '1000',
    })
    const body = JSON.parse(fresh.body)
    assert.equal(body.ok, true)
    assert.equal(body.value.version, '1001')
    assert.equal(fs.files.get('/ws/readme.md'), '# hi2')
  })
})

test('save without baseVersion is rejected', async (t) => {
  await withRoot(t, async (root) => {
    const fs = fakeFs({ '/ws/readme.md': '# hi' })
    const host = createHost({ fs, rootDir: root, log: { warn() {} } })
    const res = await call(host, '/dsh-marktext/api/save', 'POST', { path: '/ws/readme.md', text: '# x' })
    assert.equal(JSON.parse(res.body).error.code, 'BAD_REQUEST')
  })
})

test('serves renderer assets and falls back to the document directory for images', async (t) => {
  await withRoot(t, async (root) => {
    const docDir = join(root, 'docs')
    await mkdir(docDir, { recursive: true })
    const docPath = join(docDir, 'a.md')
    await writeFile(docPath, '# a')
    await writeFile(join(docDir, 'pic.png'), 'PNGDATA')

    const fs = fakeFs({ [docPath]: '# a' })
    const host = createHost({ fs, rootDir: root, log: { warn() {} } })
    const opened = await call(host, '/dsh-marktext/api/open', 'POST', { path: docPath })
    const frameSrc = JSON.parse(opened.body).value.frameSrc
    const token = frameSrc.split('/')[3]

    const index = await call(host, `/dsh-marktext/renderer/${token}/index.html`)
    assert.equal(index.statusCode, 200)
    assert.equal(index.headers['content-type'], 'text/html; charset=utf-8')
    assert.match(index.body, /<title>t<\/title>/)

    const asset = await call(host, `/dsh-marktext/renderer/${token}/assets/app.js`)
    assert.equal(asset.body, 'console.log(1)')

    const res = makeRes()
    await host.handle(makeReq(`/dsh-marktext/renderer/${token}/pic.png`), res)
    await new Promise((resolve) => setTimeout(resolve, 60))
    assert.equal(res.statusCode, 200)
    assert.equal(res.headers['content-type'], 'image/png')
    assert.equal(res.body, 'PNGDATA')
  })
})

test('path traversal and foreign origins are refused', async (t) => {
  await withRoot(t, async (root) => {
    const fs = fakeFs({ '/ws/readme.md': '# hi' })
    const host = createHost({ fs, rootDir: root, log: { warn() {} } })

    const traversal = await call(host, '/dsh-marktext/renderer/..%2F..%2Fetc%2Fpasswd')
    assert.equal(traversal.statusCode, 400)

    const foreign = await call(host, '/dsh-marktext/api/open', 'POST', { path: '/ws/readme.md' }, {
      origin: 'https://evil.example.com',
    })
    assert.equal(foreign.statusCode, 403)

    const loopback = await call(host, '/dsh-marktext/api/open', 'POST', { path: '/ws/readme.md' }, {
      origin: 'http://127.0.0.1:1234',
    })
    assert.equal(JSON.parse(loopback.body).ok, true)
  })
})

test('apply mounts a prefix route and cleans up on dispose', async () => {
  const routes = []
  const cleanups = []
  const ctx = {
    fs: fakeFs({ '/ws/a.md': '# a' }),
    logger: { info() {}, warn() {} },
    webServer: {
      register(route) {
        routes.push(route)
        return () => {
          ctx.disposedRoute = true
        }
      },
    },
    effect(fn) {
      cleanups.push(fn())
    },
  }

  apply(ctx)

  assert.equal(routes.length, 1)
  assert.equal(routes[0].kind, 'prefix')
  assert.equal(routes[0].path, '/dsh-marktext')
  assert.equal(typeof routes[0].handler, 'function')

  for (const cleanup of cleanups) cleanup?.()
  assert.equal(ctx.disposedRoute, true)
})

test('falls back to native fs when the file policy denies the write', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-marktext-native-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const file = join(dir, 'a.md')
  await writeFile(file, '# one\n')

  const fs = {
    async resolve(path) {
      return { displayPath: path, targetKey: path }
    },
    async stat(target) {
      const info = await stat(target.displayPath)
      return { type: 'file', version: `${info.mtimeMs}-${info.size}`, size: info.size }
    },
    async readText(target) {
      return readFile(target.displayPath, 'utf8')
    },
    async writeText() {
      throw Object.assign(new Error('cannot write: file access denied under workspace-write mode'), {
        code: 'FS_SANDBOX_DENIED',
      })
    },
  }

  const host = createHost({ fs, rootDir: dir, log: { warn() {} } })
  const opened = JSON.parse((await call(host, '/dsh-marktext/api/open', 'POST', { path: file })).body)
  assert.equal(opened.ok, true)

  const saved = JSON.parse(
    (await call(host, '/dsh-marktext/api/save', 'POST', {
      path: file,
      text: '# two two\n',
      baseVersion: opened.value.version,
    })).body,
  )
  assert.equal(saved.ok, true)
  assert.equal(saved.value.nativeFallback, true)
  assert.equal(await readFile(file, 'utf8'), '# two two\n')

  // 回退路径同样保留版本守卫：旧版本再来一次必须被拒。
  const stale = JSON.parse(
    (await call(host, '/dsh-marktext/api/save', 'POST', {
      path: file,
      text: '# three\n',
      baseVersion: opened.value.version,
    })).body,
  )
  assert.equal(stale.ok, false)
  assert.equal(stale.error.code, 'FS_STALE_VERSION')
  assert.equal(await readFile(file, 'utf8'), '# two two\n')
})

test('client diagnostics are accepted and readable', async (t) => {
  await withRoot(t, async (root) => {
    const host = createHost({ fs: fakeFs({}), rootDir: root, log: { warn() {} } })
    const posted = await call(host, '/dsh-marktext/api/diag', 'POST', {
      plugin: 'dsh-marktext',
      bodyRegistered: false,
      errors: ['tab body registration: ctx.slots unavailable'],
    })
    assert.equal(JSON.parse(posted.body).ok, true)

    const read = JSON.parse((await call(host, '/dsh-marktext/api/diag')).body)
    assert.equal(read.ok, true)
    assert.equal(read.value[0].bodyRegistered, false)
    assert.equal(read.value[0].errors.length, 1)
  })
})
