/**
 * dsh-marktext — 客户端半边（浏览器）。
 *
 * 这一层只做三件事：
 *   1. 向侧栏注册一个 Markdown 标签类型（`*.md` 命中即用本编辑器打开）；
 *   2. 标签体里放一个 iframe，指向宿主发出的渲染器地址；
 *   3. 在 iframe 与宿主之间转发 open / save —— iframe 不认识 DSH，DSH 也不需要认识 muya。
 *
 * 模块按 DSH 的经典脚本契约装载（window.__ModuleLoader__.load + CJS 工厂），
 * 所以这里不能写 ESM import；React 来自宿主模块表。
 */

window.__ModuleLoader__.load({
  id: 'dsh-marktext',
  factory: (require) => {
    const module = { exports: {} }
    const exports = module.exports

    let React = null
    try {
      React = require('react')
    } catch {
      React = null
    }

    const TAB_ID = 'dsh-marktext/editor'
    const TAB_KIND = 'marktext'
    const FILE_ADDRESS_PREFIX = 'dsh-resource://file/'
    const API_BASE = '/dsh-marktext/api/'
    const ENVELOPE = '__dshmkt'

    /** apply 时写入；服务晚到也没关系，每次打开现取。 */
    const services = { sessions: null, log: console }

    const styles = {
      host: { position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: 0 },
      frame: { flex: '1 1 auto', width: '100%', height: '100%', border: '0', display: 'block', background: 'transparent' },
      note: { padding: '12px 14px', fontSize: 12, lineHeight: 1.6, opacity: 0.75 },
      error: { padding: '12px 14px', fontSize: 12, lineHeight: 1.6, color: 'var(--dsw-alias-label-error, #c0392b)' },
    }

    /* ── 地址与路径 ──────────────────────────────────────────── */

    /** `dsh-resource://file/session/<sid>/<rel>` → { sessionId, path } */
    function parseFileAddress(address) {
      try {
        if (typeof address !== 'string' || !address.startsWith(FILE_ADDRESS_PREFIX)) return undefined
        const end = address.search(/[?#]/)
        const body = address.slice(FILE_ADDRESS_PREFIX.length, end === -1 ? undefined : end)
        const segments = body.split('/')
        const scope = segments.shift()
        if (scope === 'session') {
          const sessionId = segments.shift()
          if (!sessionId || segments.length === 0) return undefined
          return { sessionId: decodeURIComponent(sessionId), path: segments.map(decodeURIComponent).join('/') }
        }
        if (scope === 'absolute') {
          const parts = segments.map(decodeURIComponent)
          if (parts.length === 0 || parts[0] === '') return undefined
          return { path: '/' + parts.join('/') }
        }
        return undefined
      } catch {
        return undefined
      }
    }

    function basenameOf(path) {
      const text = String(path ?? '').replace(/\\/g, '/')
      const index = text.lastIndexOf('/')
      return index === -1 ? text : text.slice(index + 1)
    }

    function currentCwd(sessionId) {
      try {
        const sessions = services.sessions && services.sessions()
        const byId = sessions?.list?.getSnapshot?.().byId
        return byId && sessionId ? byId[sessionId]?.cwd : undefined
      } catch {
        return undefined
      }
    }

    function isDarkTheme() {
      try {
        return document.body.hasAttribute('data-ds-dark-theme')
      } catch {
        return false
      }
    }

    function currentLocale() {
      try {
        const lang = document.documentElement.lang || navigator.language || 'zh'
        return /^zh/i.test(lang) ? 'zh' : 'en'
      } catch {
        return 'zh'
      }
    }

    async function api(endpoint, payload) {
      const response = await fetch(API_BASE + endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload ?? {}),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return response.json()
    }

    /* ── 标签体 ─────────────────────────────────────────────── */

    function TabBody(props) {
      if (!React) return null
      if (typeof props.useTabInfo !== 'function') {
        return React.createElement('div', { style: styles.note }, 'dsh-marktext: useTabInfo unavailable')
      }
      return React.createElement(TabBodyInner, props)
    }

    function TabBodyInner(props) {
      const h = React.createElement
      const info = props.useTabInfo() || {}
      const tab = info.tab || {}
      const address = tab.contentId || tab.address || ''
      const parsed = React.useMemo(() => parseFileAddress(address), [address])

      const frameRef = React.useRef(null)
      /** { path, cwd, version, payload, frameSrc } */
      const docRef = React.useRef(null)
      const [phase, setPhase] = React.useState('pending')
      const [errorText, setErrorText] = React.useState('')
      const [frameSrc, setFrameSrc] = React.useState('')

      const postDown = React.useCallback((type, content) => {
        const frame = frameRef.current
        if (!frame || !frame.contentWindow) return false
        try {
          frame.contentWindow.postMessage({ [ENVELOPE]: true, dir: 'down', type, content: content ?? {} }, '*')
          return true
        } catch {
          return false
        }
      }, [])

      const payloadOf = (value) => ({
        path: value.displayPath,
        displayPath: value.displayPath,
        text: value.text,
        version: value.version,
        dark: isDarkTheme(),
        locale: currentLocale(),
      })

      /** 读取文档。reload=false 时只建 iframe（正文等渲染器 ready 后再投递）。 */
      const openDoc = React.useCallback(
        async (reload) => {
          if (!parsed) {
            setPhase('error')
            setErrorText(`无法解析资源地址：${address || '(空)'}`)
            return
          }
          const cwd = parsed.sessionId ? currentCwd(parsed.sessionId) : undefined
          try {
            const result = await api('open', { path: parsed.path, ...(cwd ? { cwd } : {}) })
            if (!result || result.ok !== true) {
              const err = result?.error ?? {}
              setPhase('error')
              setErrorText(`打开失败：${err.code || 'UNKNOWN'} ${err.message || ''}`.trim())
              return
            }
            const value = result.value
            docRef.current = {
              path: value.displayPath,
              cwd,
              version: value.version,
              payload: payloadOf(value),
              frameSrc: value.frameSrc,
            }
            if (reload) {
              postDown('doc', docRef.current.payload)
              setPhase('ready')
            } else {
              setFrameSrc(value.frameSrc)
              setPhase('loading')
            }
          } catch (cause) {
            setPhase('error')
            setErrorText(`打开失败：${String(cause?.message ?? cause)}`)
          }
        },
        [address, parsed, postDown],
      )

      // 地址变化：整体重开
      React.useEffect(() => {
        docRef.current = null
        setFrameSrc('')
        setPhase('pending')
        setErrorText('')
        void openDoc(false)
      }, [address]) // eslint-disable-line react-hooks/exhaustive-deps

      // 上行消息：ready / save / reload / open-external
      React.useEffect(() => {
        const onMessage = async (event) => {
          const data = event.data
          if (!data || data[ENVELOPE] !== true || data.dir !== 'up') return
          const frame = frameRef.current
          if (frame && frame.contentWindow && event.source !== frame.contentWindow) return
          const content = data.content || {}
          switch (data.type) {
            case 'ready': {
              const doc = docRef.current
              if (!doc) break
              postDown('doc', doc.payload)
              setPhase('ready')
              break
            }
            case 'save': {
              const doc = docRef.current
              if (!doc) break
              try {
                const result = await api('save', {
                  path: doc.path,
                  ...(doc.cwd ? { cwd: doc.cwd } : {}),
                  text: String(content.text ?? ''),
                  baseVersion: String(content.baseVersion ?? doc.version ?? ''),
                })
                if (result?.ok === true) {
                  docRef.current = { ...doc, version: result.value.version }
                  postDown('saved', { version: result.value.version })
                } else {
                  postDown('save-error', result?.error ?? { code: 'UNKNOWN', message: 'save failed' })
                }
              } catch (cause) {
                postDown('save-error', { code: 'NETWORK', message: String(cause?.message ?? cause) })
              }
              break
            }
            case 'reload':
              void openDoc(true)
              break
            case 'open-external': {
              const href = String(content.href ?? '')
              if (/^https?:/i.test(href)) {
                try {
                  window.open(href, '_blank', 'noopener,noreferrer')
                } catch {
                  /* 弹窗被拦截 */
                }
              }
              break
            }
            default:
              break
          }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
      }, [openDoc, postDown])

      // 宿主主题切换时同步给渲染器
      React.useEffect(() => {
        let observer
        try {
          observer = new MutationObserver(() => postDown('theme', { dark: isDarkTheme() }))
          observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme', 'class'] })
        } catch {
          observer = undefined
        }
        return () => observer?.disconnect()
      }, [postDown])

      if (phase === 'error') {
        return h('div', { style: styles.host }, h('div', { style: styles.error }, errorText))
      }

      return h(
        'div',
        { style: styles.host },
        frameSrc
          ? h('iframe', {
              ref: frameRef,
              src: frameSrc,
              title: basenameOf(parsed?.path) || 'MarkText',
              sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads',
              allow: 'clipboard-read; clipboard-write',
              style: styles.frame,
            })
          : h('div', { style: styles.note }, '正在打开…'),
      )
    }

    /* ── 注册 ───────────────────────────────────────────────── */

    function buildTabDefinition() {
      return {
        id: TAB_ID,
        kind: TAB_KIND,
        patterns: ['*.md', '*.markdown', '*.mdown', '*.mkd'],
        priority: 'extension',
        canOpen: (address) => typeof address === 'string' && address.startsWith(FILE_ADDRESS_PREFIX),
        title: (address) => {
          const parsed = parseFileAddress(address)
          return basenameOf(parsed?.path) || 'Markdown'
        },
        keepMounted: true,
      }
    }

    function apply(ctx) {
      const get = (name) => {
        try {
          return typeof ctx.get === 'function' ? ctx.get(name) : ctx[name]
        } catch {
          return undefined
        }
      }
      services.sessions = () => get('sessions')
      services.log = ctx.logger ?? console

      // 任何一步失败都只降级，不允许把宿主 web shell 带崩。
      const guard = (label, fn) => {
        try {
          return fn()
        } catch (error) {
          services.log.warn?.(`dsh-marktext: ${label} failed: ${String(error?.message ?? error)}`)
          return undefined
        }
      }

      const register = () => guard('tab type registration', () => {
        const tabs = get('sidebarRightTabs')
        if (!tabs || typeof tabs.register !== 'function') {
          services.log.warn?.('dsh-marktext: sidebarRightTabs 不可用，未注册标签类型')
          return
        }
        ctx.effect(() => tabs.register(buildTabDefinition()), 'dsh-marktext: tab type')
      })

      if (get('sidebarRightTabs')) register()
      else if (typeof ctx.inject === 'function') guard('service injection', () => ctx.inject(['sidebarRightTabs'], register))

      guard('tab body registration', () => {
        ctx.effect(
          () => ctx.slots.register({ name: 'sidebar.right.pane.tab', key: TAB_ID }, TabBody),
          'dsh-marktext: tab body',
        )
      })
    }

    exports.inject = ['slots']
    exports.apply = apply
    return module.exports
  },
})
