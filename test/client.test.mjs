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

test('a selection becomes a blockquote with its source path', async () => {
  const { module } = await loadPlugin()
  const { buildQuote, appendQuote } = module.__test

  assert.equal(buildQuote('a\nb'), '> a\n> b\n\n')
  assert.equal(buildQuote('a\n\nb'), '> a\n>\n> b\n\n')
  assert.equal(buildQuote('x\r\ny'), '> x\n> y\n\n')
  assert.equal(buildQuote('x', 'docs/plan.md'), '> `docs/plan.md`\n>\n> x\n\n')
  assert.equal(buildQuote('   '), '>    \n\n')

  assert.equal(appendQuote('', '> q\n\n'), '> q\n\n')
  assert.equal(appendQuote('ask: \n', '> q\n\n'), 'ask:\n\n> q\n\n')
  assert.equal(appendQuote('ask', '> q\n\n'), 'ask\n\n> q\n\n')
})

test('a quote goes into the session draft through the conversation facade', async () => {
  const { module } = await loadPlugin()
  const { quoteIntoDraft } = module.__test

  const calls = []
  const facade = {
    state: { getSnapshot: () => ({ draft: 'existing ask\n', draftRev: 7 }) },
    setDraft: (text) => calls.push(['setDraft', text]),
    focus: () => calls.push(['focus']),
    notify: (level, text) => calls.push(['notify', level, text]),
  }
  const sessions = { binding: (id) => (id === 's1' ? { ctx: { session: 's1' } } : undefined) }
  const conversation = { input: { for: (ctx) => (calls.push(['for', ctx]) && facade) } }

  const result = quoteIntoDraft({
    conversation,
    sessions,
    sessionId: 's1',
    quote: '> `notes/a.md`\n>\n> hi\n\n',
    notice: '已引用到对话',
  })

  assert.equal(result, facade)
  assert.deepEqual(calls[0], ['for', { session: 's1' }])
  assert.deepEqual(calls[1], ['setDraft', 'existing ask\n\n> `notes/a.md`\n>\n> hi\n\n'])
  assert.deepEqual(calls[2], ['focus'])
  assert.deepEqual(calls[3], ['notify', 'info', '已引用到对话'])

  // 宿主缺服务时返回 undefined，让调用方走剪贴板兜底
  assert.equal(quoteIntoDraft({ sessions, sessionId: 's1', quote: '> x' }), undefined)
  assert.equal(quoteIntoDraft({ conversation, sessions, quote: '> x' }), undefined)
  assert.equal(quoteIntoDraft({ conversation, sessions, sessionId: 'nope', quote: '> x' }), undefined)
  assert.equal(
    quoteIntoDraft({ conversation: { input: null }, sessions, sessionId: 's1', quote: '> x' }),
    undefined,
  )
})

test('a saved file maps back to a DSH resource address', async () => {
  const { module } = await loadPlugin()
  const { toResourceAddress } = module.__test

  assert.equal(
    toResourceAddress('/ws/notes/plan.pdf', 's1', '/ws'),
    'dsh-resource://file/session/s1/notes/plan.pdf',
  )
  assert.equal(
    toResourceAddress('/ws/a b/plan-1.pdf', 's1', '/ws'),
    'dsh-resource://file/session/s1/a%20b/plan-1.pdf',
  )
  assert.equal(
    toResourceAddress('/other/plan.pdf', 's1', '/ws'),
    'dsh-resource://file/absolute/other/plan.pdf',
  )
  assert.equal(toResourceAddress('/ws/plan.pdf', undefined, undefined), 'dsh-resource://file/absolute/ws/plan.pdf')
  assert.equal(toResourceAddress('', 's1', '/ws'), undefined)

  // Windows 分隔符也认
  assert.equal(
    toResourceAddress('C:\\ws\\notes\\plan.pdf', 's1', 'C:\\ws'),
    'dsh-resource://file/session/s1/notes/plan.pdf',
  )
})
