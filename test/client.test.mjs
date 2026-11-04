import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

/** 在 vm 里跑一遍经典脚本契约，抓出 sidebarRightTabs / slots 的注册参数。 */
async function loadPlugin() {
  let entry
  const window = {
    __ModuleLoader__: {
      load(candidate) {
        entry = candidate
      },
    },
    addEventListener() {},
    removeEventListener() {},
  }
  const React = {
    createElement: () => null,
    useRef: () => ({ current: null }),
    useState: (initial) => [initial, () => {}],
    useEffect() {},
    useMemo: (factory) => factory(),
    useCallback: (fn) => fn,
  }
  const context = {
    window,
    document: { documentElement: { lang: 'zh-CN' }, body: { hasAttribute: () => false } },
    navigator: { language: 'zh-CN' },
    console,
    fetch: async () => ({ ok: false }),
    setTimeout,
    clearTimeout,
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
  }
  vm.createContext(context)
  vm.runInContext(source, context)
  assert.ok(entry, 'client module must register through window.__ModuleLoader__')
  const module = entry.factory((name) => (name === 'react' ? React : undefined))
  return { entry, module }
}

test('client registers the marktext tab type and its body seat', async () => {
  const { entry, module } = await loadPlugin()
  assert.equal(entry.id, 'dsh-marktext')

  const tabTypes = []
  const slotSeats = []
  const disposers = []
  const ctx = {
    get(name) {
      if (name === 'sidebarRightTabs') return { register: (definition) => (tabTypes.push(definition), () => {}) }
      if (name === 'sessions') return undefined
      return undefined
    },
    slots: {
      register(options, component) {
        slotSeats.push({ options, component })
        return () => {}
      },
    },
    effect(fn) {
      disposers.push(fn())
    },
    logger: { warn() {} },
  }

  module.apply(ctx)

  assert.equal(tabTypes.length, 1)
  const definition = tabTypes[0]
  assert.equal(definition.id, 'dsh-marktext/editor')
  assert.equal(definition.kind, 'marktext')
  assert.equal(definition.priority, 'extension')
  assert.equal(Array.from(definition.patterns).join(','), '*.md,*.markdown,*.mdown,*.mkd')
  assert.equal(definition.keepMounted, true)
  assert.equal(definition.title('dsh-resource://file/session/s1/notes/readme.md'), 'readme.md')
  assert.equal(definition.canOpen('dsh-resource://file/session/s1/a.md'), true)
  assert.equal(definition.canOpen('dsh-resource://file/absolute/a.md'), true)
  assert.equal(definition.canOpen('https://example.com/a.md'), false)
  assert.equal(definition.title('not-a-resource'), 'Markdown')

  assert.equal(slotSeats.length, 1)
  assert.equal(slotSeats[0].options.name, 'sidebar.right.pane.tab')
  assert.equal(slotSeats[0].options.key, 'dsh-marktext/editor')
  assert.equal(typeof slotSeats[0].component, 'function')
})

test('in-document links resolve to DSH resource addresses', async () => {
  const { module } = await loadPlugin()
  const { resolveResourceAddress } = module.__test
  const base = 'dsh-resource://file/session/s1/docs/guide.md'

  assert.equal(resolveResourceAddress('other.md', base), 'dsh-resource://file/session/s1/docs/other.md')
  assert.equal(resolveResourceAddress('./other.md?x=1#top', base), 'dsh-resource://file/session/s1/docs/other.md')
  assert.equal(resolveResourceAddress('../notes/b.md', base), 'dsh-resource://file/session/s1/notes/b.md')
  assert.equal(resolveResourceAddress('a%20b.md', base), 'dsh-resource://file/session/s1/docs/a%20b.md')
  assert.equal(resolveResourceAddress('/Users/me/doc.md', base), 'dsh-resource://file/absolute/Users/me/doc.md')
  assert.equal(
    resolveResourceAddress('pic.png', 'dsh-resource://file/absolute/Users/me/dir/a.md'),
    'dsh-resource://file/absolute/Users/me/dir/pic.png',
  )

  assert.equal(resolveResourceAddress('https://example.com/a.md', base), undefined)
  assert.equal(resolveResourceAddress('mailto:a@b.c', base), undefined)
  assert.equal(resolveResourceAddress('#section', base), undefined)
  assert.equal(resolveResourceAddress('', base), undefined)
})
