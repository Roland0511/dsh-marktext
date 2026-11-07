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
    const services = { sessions: null, sidebarRight: null, conversation: null, log: console }

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


    /** 去掉查询串/锚点，返回可用于解析的相对链接。 */
    function stripHref(href) {
      const cut = href.search(/[?#]/)
      return cut === -1 ? href : href.slice(0, cut)
    }

    /** 折叠 `./`、`../`，返回不含前导斜杠的相对路径。 */
    function normalizeRelative(path) {
      const parts = []
      for (const segment of String(path).split('/')) {
        if (segment === '' || segment === '.') continue
        if (segment === '..') {
          parts.pop()
          continue
        }
        parts.push(segment)
      }
      return parts.join('/')
    }

    function encodePath(path) {
      return String(path).split('/').map((segment) => encodeURIComponent(segment)).join('/')
    }

    /**
     * 把文档里的链接解析成 DSH 资源地址，让宿主用同一个 marktext 类型再开一页。
     * 返回 undefined 表示不是本地文件链接（交给外部打开）。
     */
    function resolveResourceAddress(href, baseAddress) {
      if (typeof href !== 'string' || href.length === 0) return undefined
      if (/^(https?:|mailto:|tel:)/i.test(href)) return undefined
      const raw = stripHref(href)
      if (raw === '' || href.startsWith('#')) return undefined
      let decoded
      try {
        decoded = decodeURIComponent(raw)
      } catch {
        decoded = raw
      }
      if (decoded.startsWith('/')) {
        return 'dsh-resource://file/absolute/' + encodePath(decoded.replace(/^\/+/, ''))
      }
      const base = parseFileAddress(baseAddress)
      if (!base) return undefined
      if (base.sessionId) {
        const baseDir = base.path.includes('/') ? base.path.slice(0, base.path.lastIndexOf('/')) : ''
        const target = normalizeRelative(baseDir ? `${baseDir}/${decoded}` : decoded)
        if (target === '') return undefined
        return `dsh-resource://file/session/${encodeURIComponent(base.sessionId)}/${encodePath(target)}`
      }
      const absoluteBaseDir = base.path.includes('/') ? base.path.slice(0, base.path.lastIndexOf('/')) : '/'
      const absoluteTarget = normalizeRelative(`${absoluteBaseDir}/${decoded}`)
      if (absoluteTarget === '') return undefined
      return 'dsh-resource://file/absolute/' + encodePath(absoluteTarget)
    }

    /** 把磁盘上的绝对路径折回 DSH 资源地址，交给侧栏打开。 */
    function toResourceAddress(filePath, sessionId, cwd) {
      const abs = String(filePath ?? '').replace(/\\/g, '/')
      if (abs === '') return undefined
      if (sessionId && cwd) {
        const base = String(cwd).replace(/\\/g, '/').replace(/\/+$/, '')
        if (abs === base) return undefined
        if (abs.startsWith(base + '/')) {
          return `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${encodePath(abs.slice(base.length + 1))}`
        }
      }
      if (abs.startsWith('/')) return 'dsh-resource://file/absolute/' + encodePath(abs.slice(1))
      return undefined
    }

    function openResourceAddress(address, fallbackHref, ops) {
      const sidebar = services.sidebarRight?.()
      try {
        if (sidebar && typeof sidebar.openResource === 'function') sidebar.openResource(address)
        else if (ops && typeof ops.openResource === 'function') ops.openResource(address)
        else if (fallbackHref) window.open(fallbackHref, '_blank', 'noopener,noreferrer')
      } catch (cause) {
        services.log.warn?.(`dsh-marktext: open resource failed: ${String(cause?.message ?? cause)}`)
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

    /* ── 引用到对话 ─────────────────────────────────────────── */

    /** 把一段选区变成 Markdown 引用块，带上出处，方便 agent 自己回读文件。 */
    function buildQuote(text, displayPath) {
      const body = String(text ?? '')
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => (line.length > 0 ? `> ${line}` : '>'))
        .join('\n')
      const header = displayPath ? `> \`${displayPath}\`\n>\n` : ''
      return `${header}${body}\n\n`
    }

    /** 追加到现有草稿后面；草稿为空时直接就是引用块。 */
    function appendQuote(draft, quote) {
      const text = String(draft ?? '')
      if (text.trim().length === 0) return quote
      return `${text.replace(/\s+$/, '')}\n\n${quote}`
    }

    /** 拿不到会话输入入口时的兜底：把引用块放进剪贴板。 */
    async function copyToClipboard(text) {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(text)
          return true
        }
      } catch {
        /* 权限被拒或非安全上下文，走 execCommand */
      }
      try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.top = '-1000px'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        area.remove()
        return ok
      } catch {
        return false
      }
    }

    /**
     * 把一段引用追加到某个 session 的输入框草稿。
     * 宿主没给会话输入入口（或这个页签不是会话内文件）时返回 undefined，由调用方兜底。
     */
    function quoteIntoDraft(options) {
      const { conversation, sessions, sessionId, quote, notice } = options ?? {}
      if (!conversation || typeof conversation.input?.for !== 'function') return undefined
      if (!sessions || typeof sessions.binding !== 'function' || !sessionId) return undefined
      let binding
      try {
        binding = sessions.binding(sessionId)
      } catch {
        return undefined
      }
      if (!binding || !binding.ctx) return undefined
      try {
        const facade = conversation.input.for(binding.ctx)
        if (!facade || typeof facade.setDraft !== 'function') return undefined
        const draft = facade.state?.getSnapshot?.()?.draft ?? ''
        facade.setDraft(appendQuote(draft, quote))
        try {
          facade.focus?.()
        } catch {
          /* 焦点拿不回来不影响插入 */
        }
        if (notice) {
          try {
            facade.notify?.('info', notice)
          } catch {
            /* 通知失败不影响插入 */
          }
        }
        return facade
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
      const addressRef = React.useRef(address)
      addressRef.current = address
      const tabRef = React.useRef(tab)
      tabRef.current = tab
      /** 宿主可能在 standard props 里给 sessionId；用 ref 兜住，避免消息监听每次渲染都重挂。 */
      const sessionIdRef = React.useRef('')
      sessionIdRef.current = props.sessionId || props.session?.id || ''

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

      /**
       * 把渲染器里的选区引用回对话。
       * 首选 ctx.conversation.input.for(sessionCtx) 直接写草稿；宿主没给这个入口时退回剪贴板。
       */
      const insertIntoChat = React.useCallback(
        async (rawText) => {
          const text = String(rawText ?? '')
          if (text.trim().length === 0) return { mode: 'none' }
          const doc = docRef.current
          const quote = buildQuote(text, doc?.path || parsed?.path || '')
          const facade = quoteIntoDraft({
            conversation: services.conversation?.(),
            sessions: services.sessions?.(),
            sessionId: sessionIdRef.current || parsed?.sessionId,
            quote,
            notice: currentLocale() === 'en' ? 'Quoted into the chat' : '已引用到对话',
          })
          if (facade) return { mode: 'draft' }
          const copied = await copyToClipboard(quote)
          return { mode: copied ? 'clipboard' : 'none' }
        },
        [parsed],
      )

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
            case 'insert-chat': {
              postDown('chat-inserted', await insertIntoChat(content.text))
              break
            }
            case 'save-pdf': {
              const doc = docRef.current
              if (!doc) {
                postDown('pdf-error', { code: 'NO_DOCUMENT', message: 'document is not open' })
                break
              }
              try {
                const result = await api('pdf', {
                  path: doc.path,
                  ...(doc.cwd ? { cwd: doc.cwd } : {}),
                  data: String(content.data ?? ''),
                })
                if (result?.ok === true) {
                  // 写完顺手在侧栏打开：PDF 预览由宿主自带的 documentpreview 提供
                  const address = toResourceAddress(
                    result.value?.path,
                    sessionIdRef.current || parsed?.sessionId,
                    doc.cwd,
                  )
                  if (address) openResourceAddress(address, undefined, tabRef.current?.actions)
                  postDown('pdf-saved', result.value)
                } else {
                  postDown('pdf-error', result?.error ?? { code: 'UNKNOWN', message: 'pdf save failed' })
                }
              } catch (cause) {
                postDown('pdf-error', { code: 'NETWORK', message: String(cause?.message ?? cause) })
              }
              break
            }
            case 'open-link': {
              const href = String(content.href ?? '')
              const resource = resolveResourceAddress(href, addressRef.current)
              if (resource) {
                openResourceAddress(resource, href, tabRef.current?.actions)
                break
              }
              if (/^(https?:|mailto:)/i.test(href)) {
                try {
                  window.open(href, '_blank', 'noopener,noreferrer')
                } catch {
                  /* 弹窗被拦截 */
                }
              }
              break
            }
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
      }, [insertIntoChat, openDoc, postDown])

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
      services.sidebarRight = () => get('sidebarRight')
      services.conversation = () => get('conversation')
      services.log = ctx.logger ?? console

      const diag = {
        plugin: 'dsh-marktext',
        at: Date.now(),
        slots: Boolean(ctx.slots),
        slotsInject: Boolean(ctx.slots && typeof ctx.slots.inject === 'function'),
        slotsRegister: Boolean(ctx.slots && typeof ctx.slots.register === 'function'),
        sidebarRightTabs: Boolean(get('sidebarRightTabs')),
        conversation: Boolean(get('conversation')),
        typeRegistered: false,
        bodyRegistered: false,
        errors: [],
      }

      // 任何一步失败都只降级，不允许把宿主 web shell 带崩。
      const guard = (label, fn) => {
        try {
          return fn()
        } catch (error) {
          const message = String(error?.message ?? error)
          diag.errors.push(`${label}: ${message}`)
          services.log.warn?.(`dsh-marktext: ${label} failed: ${message}`)
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
        diag.typeRegistered = true
        diag.sidebarRightTabs = true
        services.reportDiag?.()
      })

      if (get('sidebarRightTabs')) register()
      else if (typeof ctx.inject === 'function') guard('service injection', () => ctx.inject(['sidebarRightTabs'], register))

      // keyed seat 必须通过 inject 挂到它自己的 owner 上；直接 register 不会落到 pane 里。
      guard('tab body registration', () => {
        const slots = ctx.slots
        if (!slots) {
          diag.errors.push('tab body registration: ctx.slots unavailable')
          return
        }
        const seat = { name: 'sidebar.right.pane.tab', key: TAB_ID }
        if (typeof slots.inject === 'function') {
          ctx.effect(
            () => slots.inject('sidebar.right.pane.tab', () => slots.register(seat, TabBody)),
            'dsh-marktext: tab body',
          )
        } else {
          ctx.effect(() => slots.register(seat, TabBody), 'dsh-marktext: tab body')
        }
        diag.bodyRegistered = true
      })

      // 诊断回执：应用内出问题时，宿主侧 GET /dsh-marktext/api/diag 能直接看到注册结果。
      // 晚到的注册（inject 回调）会再报一次，所以同一次启动可能留下两条记录。
      const reportDiag = () => {
        try {
          void fetch(API_BASE + 'diag', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ...diag, at: Date.now() }),
            keepalive: true,
          }).catch(() => {})
        } catch {
          /* 诊断失败不影响插件 */
        }
      }
      reportDiag()
      services.reportDiag = reportDiag
    }

    exports.__test = { parseFileAddress, resolveResourceAddress, normalizeRelative, buildQuote, appendQuote, quoteIntoDraft, toResourceAddress }
    exports.name = 'dsh-marktext'
    exports.inject = ['slots', 'sidebarRightTabs']
    exports.apply = apply
    return module.exports
  },
})
