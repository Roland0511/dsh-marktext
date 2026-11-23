/**
 * dsh-marktext 渲染器：一个独立的同源页面，用 muya（MarkText 的编辑器内核）编辑 Markdown。
 * 它不依赖 DSH 的 React 运行时，与父页面只通过 postMessage 通信（协议见 README）。
 */

import {
  CodeBlockLanguageSelector,
  EmojiSelector,
  FootnoteTool,
  ImageEditTool,
  ImageResizeBar,
  ImageToolBar,
  InlineFormatToolbar,
  LinkTools,
  Muya,
  ParagraphFrontButton,
  ParagraphFrontMenu,
  ParagraphQuickInsertMenu,
  PreviewToolBar,
  TableColumnToolbar,
  TableDragBar,
  TableRowColumMenu,
  en,
  zh,
} from '@muyajs/core'
import '@muyajs/core/lib/core.css'
import './style.css'
import { classifyExternalChange } from './external-change.js'
import { resolveMarkdownImagePath } from './image-path.js'

const AUTOSAVE_MS = 2500
/** 外部修改轮询间隔：本地 fs.stat 很便宜，2 秒足够“几乎实时”又不打扰。 */
const WATCH_INTERVAL_MS = 2000
const API_BASE = '/dsh-marktext/api/'
const ENVELOPE = '__dshmkt'
const SAVE_LABEL = { zh: '保存', en: 'Save' }
const TOOL_LABEL = {
  zh: { quote: '引用', pdf: 'PDF', quoteTitle: '选中文字后引用到对话', pdfTitle: '导出 PDF 文件 (⌘P)' },
  en: { quote: 'Quote', pdf: 'PDF', quoteTitle: 'Quote the selection into the chat', pdfTitle: 'Export a PDF file (⌘P)' },
}
const STATUS_TEXT = {
  zh: {
    noSelection: '先选中要引用的文字',
    inserted: '已插入对话',
    copied: '已复制，⌘V 粘贴到对话',
    failed: '插入失败',
    exporting: '正在生成 PDF…',
    exported: '已保存',
    exportFailed: 'PDF 生成失败',
    autoRefreshed: '文件已更新，已自动刷新',
    reloaded: '已重新加载',
    refreshFailed: '重新加载失败',
    saveFailed: '保存失败',
    externalChanged: '文件已被其他程序修改',
    externalUnloadable: '文件已被其他程序修改。重新加载会丢弃当前未保存的修改。',
    missing: '文件已被删除或移走，等待它回来…',
  },
  en: {
    noSelection: 'Select some text first',
    inserted: 'Inserted into the chat',
    copied: 'Copied — paste with ⌘V',
    failed: 'Could not insert',
    exporting: 'Building PDF…',
    exported: 'Saved',
    exportFailed: 'PDF export failed',
    autoRefreshed: 'File changed on disk — reloaded',
    reloaded: 'Reloaded',
    refreshFailed: 'Reload failed',
    saveFailed: 'Save failed',
    externalChanged: 'File changed outside the editor',
    externalUnloadable: 'The file changed outside the editor. Reloading discards your unsaved changes.',
    missing: 'File was deleted or moved — waiting for it to come back…',
  },
}

const el = {
  name: document.getElementById('doc-name'),
  dot: document.getElementById('dirty-dot'),
  status: document.getElementById('status'),
  save: document.getElementById('save'),
  quote: document.getElementById('quote'),
  pdf: document.getElementById('pdf'),
  banner: document.getElementById('banner'),
  bannerText: document.getElementById('banner-text'),
  bannerAction: document.getElementById('banner-action'),
  editor: document.getElementById('editor'),
}

const state = {
  muya: null,
  path: '',
  displayPath: '',
  /** 会话 cwd：path 为会话内相对路径时，重新读盘/stat 要靠它再解析一次。 */
  cwd: '',
  version: '',
  dirty: false,
  saving: false,
  booted: false,
  suppressChange: false,
  autosaveTimer: null,
  locale: 'zh',
  dark: false,
  /** 最近一次非空选区。点按钮会让编辑器失焦，所以点击前要先记住。 */
  selection: '',
  /** 外部修改轮询：计时器 + 三条“正在进行”的互斥标记。 */
  watchTimer: null,
  watching: false,
  reloading: false,
  /** 已经提示过“磁盘上有新版本、但本地有未保存修改”。 */
  externalPending: false,
  /** 已经提示过“文件不见了”，等它回来再清掉横幅。 */
  missingShown: false,
}


/* ── 图片地址 ───────────────────────────────────────────────── */

/**
 * muya 会把非 http(s) 的图片地址拼成 `file://`，在 http 页面里加载不了。
 * 构建时 vite.config.js 把 muya 的那处实现换成调用这个解析器；这里按 iframe 的
 * base（`/dsh-marktext/renderer/<token>/`）还原成宿主可回源的 URL。
 */
globalThis.__dshmktResolveImagePath = (raw) => resolveMarkdownImagePath(raw, document.baseURI)


/* ── 父页面通道 ─────────────────────────────────────────────── */

function post(type, content) {
  try {
    window.parent.postMessage({ [ENVELOPE]: true, dir: 'up', type, content }, '*')
  } catch {
    /* 父页面不在时静默 */
  }
}

function setStatus(text, tone = '') {
  el.status.textContent = text
  el.status.dataset.tone = tone
}

function showBanner(text, action) {
  el.bannerText.textContent = text
  el.banner.hidden = false
  if (typeof action === 'function') {
    el.bannerAction.hidden = false
    el.bannerAction.onclick = () => {
      el.banner.hidden = true
      action()
    }
  } else {
    el.bannerAction.hidden = true
    el.bannerAction.onclick = null
  }
}

function hideBanner() {
  el.banner.hidden = true
  el.bannerAction.onclick = null
}

function markDirty(dirty) {
  if (state.dirty === dirty) return
  state.dirty = dirty
  el.dot.hidden = !dirty
  if (dirty) setStatus('未保存', 'warn')
  else setStatus('已保存', 'ok')
  post('dirty', { dirty })
}

function applyTheme(dark) {
  state.dark = Boolean(dark)
  document.documentElement.classList.toggle('dark', state.dark)
  document.documentElement.style.colorScheme = state.dark ? 'dark' : 'light'
}

/* ── 外部修改：轮询 + 自动刷新 / 冲突提示 ───────────────────── */

async function api(endpoint, payload) {
  const response = await fetch(API_BASE + endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

/** stat / open 用的目标：显示路径 + 会话 cwd（绝对路径时 cwd 不影响解析）。 */
function watchPayload() {
  return { path: state.path, ...(state.cwd ? { cwd: state.cwd } : {}) }
}

/** 弹出“磁盘上已变、但本地有未保存修改”的冲突横幅；点按钮才丢改动重载。 */
function markExternalConflict() {
  const labels = STATUS_TEXT[state.locale]
  state.externalPending = true
  setStatus(labels.externalChanged, 'warn')
  showBanner(labels.externalUnloadable, () => void reloadFromDisk())
}

/**
 * 重新从磁盘读一遍（保留 iframe / 编辑器实例，只换正文和版本）。
 * 自动刷新和冲突横幅的「重新加载」都走这里：读失败只在状态栏报错，
 * 不会像客户端层重开页签那样把当前文档换成错误页。
 * @param {{ auto?: boolean }} [options] auto=true 表示是轮询触发的
 */
async function reloadFromDisk(options = {}) {
  if (!state.path || state.reloading) return false
  const auto = options.auto === true
  const labels = STATUS_TEXT[state.locale]
  state.reloading = true
  try {
    const result = await api('open', watchPayload())
    if (!result || result.ok !== true) {
      const error = result?.error ?? {}
      setStatus(`${labels.refreshFailed}${error.code ? `: ${error.code}` : ''}`, 'error')
      return false
    }
    // 读盘期间用户可能已经开始输入：自动刷新这时必须让位，改成冲突提示。
    if (auto && state.dirty) {
      markExternalConflict()
      return false
    }
    const value = result.value
    state.externalPending = false
    state.missingShown = false
    loadDocument({
      path: value.displayPath,
      displayPath: value.displayPath,
      cwd: state.cwd,
      text: value.text,
      version: value.version,
      dark: state.dark,
      locale: state.locale,
    })
    setStatus(auto ? labels.autoRefreshed : labels.reloaded, 'ok')
    // 告诉客户端半边：页签里的版本号变了，后续保存和状态展示要跟上。
    post('reloaded', { path: value.displayPath, version: value.version })
    return true
  } catch (cause) {
    setStatus(`${labels.refreshFailed}: ${String(cause?.message ?? cause)}`, 'error')
    return false
  } finally {
    state.reloading = false
  }
}

/** 一轮外部修改检测。失败（宿主重启等）静默跳过，下一轮再试。 */
async function checkExternalChange() {
  if (!state.booted || !state.path || state.saving || state.reloading || state.watching) return
  if (typeof document.visibilityState === 'string' && document.visibilityState === 'hidden') return
  state.watching = true
  const labels = STATUS_TEXT[state.locale]
  try {
    const result = await api('stat', watchPayload())
    if (!result || result.ok !== true) return
    // 请求在飞的时候可能刚触发了保存/另一轮重载：这一轮结果已经过时，丢掉。
    if (state.saving || state.reloading) return
    const value = result.value || {}
    const action = classifyExternalChange({
      version: value.version,
      currentVersion: state.version,
      dirty: state.dirty,
      missing: value.missing === true,
    })
    if (action === 'none') {
      // 文件恢复（或用户刚保存过）时，收掉之前的“文件不见了”提示。
      if (state.missingShown) {
        state.missingShown = false
        hideBanner()
        setStatus('')
      }
      return
    }
    if (action === 'missing') {
      if (state.missingShown) return
      state.missingShown = true
      setStatus(labels.missing, 'error')
      showBanner(labels.missing)
      return
    }
    if (action === 'conflict') {
      if (!state.externalPending) markExternalConflict()
      return
    }
    await reloadFromDisk({ auto: true })
  } catch {
    /* 轮询失败静默：宿主可能正在重启，下一轮再试 */
  } finally {
    state.watching = false
  }
}

/** 开启（幂等的）外部修改轮询；页签隐藏时跳过，不空转。 */
function startWatching() {
  if (state.watchTimer) return
  state.watchTimer = setInterval(() => void checkExternalChange(), WATCH_INTERVAL_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') void checkExternalChange()
  })
}

/* ── 选区 / 引用到对话 / 导出 PDF ───────────────────────────── */

function currentSelection() {
  try {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return ''
    return String(selection.toString())
  } catch {
    return ''
  }
}

function rememberSelection() {
  const text = currentSelection()
  if (text.trim().length > 0) state.selection = text
  const enabled = text.trim().length > 0
  el.quote.disabled = !enabled
}

function quoteSelection() {
  // mousedown 已经阻止了失焦，正常情况下选区还在；拿不到就退回上次记住的。
  const text = (currentSelection() || state.selection).trim()
  const label = STATUS_TEXT[state.locale]
  if (text.length === 0) {
    setStatus(label.noSelection, 'warn')
    return
  }
  post('insert-chat', { text })
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const comma = result.indexOf(',')
      resolve(comma === -1 ? '' : result.slice(comma + 1))
    }
    reader.onerror = () => reject(reader.error || new Error('blob read failed'))
    reader.readAsDataURL(blob)
  })
}

let exporting = false

async function exportDocument() {
  if (exporting) return
  const label = STATUS_TEXT[state.locale]
  exporting = true
  el.pdf.disabled = true
  setStatus(label.exporting)
  try {
    const { exportPdf } = await import('./pdf.js')
    const base = (state.displayPath.split('/').pop() || 'document').replace(/\.[^.]+$/, '')
    const result = await exportPdf({ name: base })
    // 不能走浏览器下载：Electron 会把 blob: 当成「打开」。交给宿主写到文档旁边。
    post('save-pdf', { data: await blobToBase64(result.blob) })
  } catch (error) {
    console.error('[dsh-marktext] PDF export failed', error)
    setStatus(label.exportFailed, 'error')
  } finally {
    exporting = false
    el.pdf.disabled = false
  }
}


/* ── muya ───────────────────────────────────────────────────── */

function registerUiPlugins() {
  const safe = (plugin, options) => {
    try {
      if (options === undefined) Muya.use(plugin)
      else Muya.use(plugin, options)
    } catch {
      /* 单个 UI 插件失败不影响编辑器本身 */
    }
  }
  safe(InlineFormatToolbar)
  safe(ParagraphFrontButton)
  safe(ParagraphFrontMenu)
  safe(ParagraphQuickInsertMenu)
  safe(TableColumnToolbar)
  safe(TableDragBar)
  safe(TableRowColumMenu)
  safe(CodeBlockLanguageSelector)
  safe(EmojiSelector)
  safe(FootnoteTool)
  safe(ImageToolBar)
  safe(ImageResizeBar)
  safe(ImageEditTool)
  safe(PreviewToolBar)
  safe(LinkTools, {
    jumpClick: (info) => {
      const href = info?.href
      if (typeof href === 'string' && href.length > 0) post('open-link', { href })
    },
  })
}

function createEditor(markdown) {
  state.suppressChange = true
  state.muya = new Muya(el.editor, {
    markdown,
    footnote: true,
    codeBlockLineNumbers: false,
    mermaidTheme: state.dark ? 'dark' : 'default',
  })
  try {
    state.muya.locale(state.locale === 'en' ? en : zh)
  } catch {
    /* 语言包失败退回默认 */
  }
  state.muya.on('json-change', () => {
    if (state.suppressChange) return
    markDirty(true)
    scheduleAutosave()
  })
  state.muya.init()
  state.booted = true
  state.suppressChange = false
}

function replaceDocument(markdown) {
  if (!state.muya) return createEditor(markdown)
  state.suppressChange = true
  try {
    state.muya.setContent(markdown)
  } finally {
    state.suppressChange = false
  }
  markDirty(false)
}

function scheduleAutosave() {
  clearTimeout(state.autosaveTimer)
  state.autosaveTimer = setTimeout(() => {
    if (state.dirty && !state.saving) requestSave()
  }, AUTOSAVE_MS)
}

function requestSave() {
  if (!state.muya || state.saving) return
  let markdown
  try {
    state.muya.flush?.()
    markdown = state.muya.getMarkdown()
  } catch {
    markdown = undefined
  }
  if (typeof markdown !== 'string') return
  state.saving = true
  setStatus('保存中…')
  post('save', { text: markdown, baseVersion: state.version })
}

/* ── 文档装载 ───────────────────────────────────────────────── */

function loadDocument(content) {
  hideBanner()
  state.path = content.path || ''
  state.displayPath = content.displayPath || content.path || ''
  state.cwd = typeof content.cwd === 'string' ? content.cwd : ''
  state.version = content.version || ''
  state.locale = content.locale === 'en' ? 'en' : 'zh'
  state.externalPending = false
  state.missingShown = false
  el.name.textContent = state.displayPath.split('/').pop() || 'Markdown'
  el.name.title = state.displayPath
  el.save.textContent = SAVE_LABEL[state.locale]
  const tool = TOOL_LABEL[state.locale]
  el.quote.textContent = tool.quote
  el.quote.title = tool.quoteTitle
  el.pdf.textContent = tool.pdf
  el.pdf.title = tool.pdfTitle
  applyTheme(content.dark)
  if (!state.booted) createEditor(content.text ?? '')
  else replaceDocument(content.text ?? '')
  markDirty(false)
  setStatus('')
  startWatching()
  post('ready-ack', { path: state.path })
}

/* ── 消息入口 ───────────────────────────────────────────────── */

window.addEventListener('message', (event) => {
  const data = event.data
  if (!data || data[ENVELOPE] !== true || data.dir !== 'down') return
  const content = data.content || {}
  switch (data.type) {
    case 'doc':
      loadDocument(content)
      break
    case 'saved':
      state.version = content.version || state.version
      state.saving = false
      state.externalPending = false
      state.missingShown = false
      hideBanner()
      markDirty(false)
      setStatus('已保存', 'ok')
      break
    case 'save-error':
      state.saving = false
      if (content.code === 'FS_STALE_VERSION') {
        setStatus(STATUS_TEXT[state.locale].saveFailed, 'error')
        showBanner(STATUS_TEXT[state.locale].externalUnloadable, () => void reloadFromDisk())
      } else {
        setStatus(content.message || '保存失败', 'error')
      }
      break
    case 'theme':
      applyTheme(content.dark)
      break
    case 'pdf-saved': {
      const savedPath = String(content.path || '')
      const name = savedPath.split('/').pop() || savedPath
      setStatus(`${STATUS_TEXT[state.locale].exported} · ${name}`, 'ok')
      el.status.title = savedPath
      break
    }
    case 'pdf-error': {
      const detail = content.message || content.code || ''
      setStatus(`${STATUS_TEXT[state.locale].exportFailed}${detail ? `: ${detail}` : ''}`, 'error')
      break
    }
    case 'chat-inserted': {
      const label = STATUS_TEXT[state.locale]
      if (content.mode === 'draft') setStatus(label.inserted, 'ok')
      else if (content.mode === 'clipboard') setStatus(label.copied, 'warn')
      else setStatus(label.failed, 'error')
      break
    }
    case 'reload-doc':
      loadDocument(content)
      break
    default:
      break
  }
})

el.save.addEventListener('click', () => requestSave())

// 点按钮会抢焦点、把编辑器选区清掉，所以按下时就阻止默认行为，保住选区。
el.quote.addEventListener('mousedown', (event) => event.preventDefault())
el.quote.addEventListener('click', () => quoteSelection())
el.pdf.addEventListener('click', () => void exportDocument())

let selectionTimer = null
document.addEventListener('selectionchange', () => {
  clearTimeout(selectionTimer)
  selectionTimer = setTimeout(rememberSelection, 120)
})

// 编辑器里的链接交给宿主处理：`other.md` 应该在 DSH 里再开一个 marktext 标签页，
// 而不是让 iframe 导航到原始文件（浏览器会把 .md 当纯文本显示）。
document.addEventListener(
  'click',
  (event) => {
    const target = event.target
    // muya 把链接渲染成 <span class="mu-link" href="...">，不是 <a>，所以两种都要认。
    const anchor = target && typeof target.closest === 'function' ? target.closest('a[href], .mu-link[href]') : null
    if (!anchor) return
    const href = anchor.getAttribute('href') ?? ''
    if (href === '' || href.startsWith('#')) return
    event.preventDefault()
    event.stopPropagation()
    post('open-link', { href })
  },
  true,
)

document.addEventListener('keydown', (event) => {
  if (!(event.metaKey || event.ctrlKey)) return
  const key = event.key.toLowerCase()

  if (key === 's') {
    event.preventDefault()
    requestSave()
    return
  }

  if (key === 'p') {
    event.preventDefault()
    void exportDocument()
    return
  }

  // muya 只暴露 undo()/redo()，不自己绑快捷键；编辑器外层（MarkText 桌面端）负责这一步。
  if (!state.muya) return
  const target = event.target
  const nativeField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
  if (nativeField) return
  if (key === 'z') {
    event.preventDefault()
    if (event.shiftKey) state.muya.redo()
    else state.muya.undo()
    return
  }
  if (key === 'y') {
    event.preventDefault()
    state.muya.redo()
  }
})

window.addEventListener('beforeunload', () => {
  clearTimeout(state.autosaveTimer)
  clearInterval(state.watchTimer)
})

registerUiPlugins()

post('ready')
