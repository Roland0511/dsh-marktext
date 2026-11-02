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

const AUTOSAVE_MS = 2500
const ENVELOPE = '__dshmkt'
const SAVE_LABEL = { zh: '保存', en: 'Save' }

const el = {
  name: document.getElementById('doc-name'),
  dot: document.getElementById('dirty-dot'),
  status: document.getElementById('status'),
  save: document.getElementById('save'),
  banner: document.getElementById('banner'),
  bannerText: document.getElementById('banner-text'),
  bannerAction: document.getElementById('banner-action'),
  editor: document.getElementById('editor'),
}

const state = {
  muya: null,
  path: '',
  displayPath: '',
  version: '',
  dirty: false,
  saving: false,
  booted: false,
  suppressChange: false,
  autosaveTimer: null,
  locale: 'zh',
  dark: false,
}

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
      if (typeof href === 'string' && /^https?:/i.test(href)) post('open-external', { href })
    },
  })
}

function createEditor(markdown) {
  state.suppressChange = true
  state.muya = new Muya(el.editor, { markdown, footnote: true, codeBlockLineNumbers: false })
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
  state.version = content.version || ''
  state.locale = content.locale === 'en' ? 'en' : 'zh'
  el.name.textContent = state.displayPath.split('/').pop() || 'Markdown'
  el.name.title = state.displayPath
  el.save.textContent = SAVE_LABEL[state.locale]
  applyTheme(content.dark)
  if (!state.booted) createEditor(content.text ?? '')
  else replaceDocument(content.text ?? '')
  markDirty(false)
  setStatus('')
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
      markDirty(false)
      setStatus('已保存', 'ok')
      break
    case 'save-error':
      state.saving = false
      if (content.code === 'FS_STALE_VERSION') {
        setStatus('保存失败', 'error')
        showBanner('文件已被其他程序修改。重新加载会丢弃当前未保存的修改。', () => post('reload', {}))
      } else {
        setStatus(content.message || '保存失败', 'error')
      }
      break
    case 'theme':
      applyTheme(content.dark)
      break
    case 'reload-doc':
      loadDocument(content)
      break
    default:
      break
  }
})

el.save.addEventListener('click', () => requestSave())

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault()
    requestSave()
  }
})

window.addEventListener('beforeunload', () => {
  clearTimeout(state.autosaveTimer)
})

registerUiPlugins()
post('ready')
