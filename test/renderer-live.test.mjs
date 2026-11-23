import assert from 'node:assert/strict'
import test from 'node:test'

import { classifyExternalChange } from '../src/renderer/external-change.js'
import { resolveMarkdownImagePath } from '../src/renderer/image-path.js'

const BASE = 'http://127.0.0.1:65524/dsh-marktext/renderer/abcdef1234567890/index.html'
const TOKEN_PREFIX = 'http://127.0.0.1:65524/dsh-marktext/renderer/abcdef1234567890/'

test('relative image paths resolve against the tokenised renderer base', () => {
  assert.equal(resolveMarkdownImagePath('assets/a.png', BASE), `${TOKEN_PREFIX}assets/a.png`)
  assert.equal(resolveMarkdownImagePath('docs/demo.png', BASE), `${TOKEN_PREFIX}docs/demo.png`)
  assert.equal(resolveMarkdownImagePath('./assets/a.png', BASE), `${TOKEN_PREFIX}assets/a.png`)
  assert.equal(resolveMarkdownImagePath('assets/a b.png', BASE), `${TOKEN_PREFIX}assets/a%20b.png`)
  assert.equal(resolveMarkdownImagePath('assets/a.png?raw=1', BASE), `${TOKEN_PREFIX}assets/a.png?raw=1`)
})

test('the fake file:// prefix muya adds is stripped, real file URLs are not', () => {
  // muya 对非 http 图片会拼 file://，这里必须还原成相对路径
  assert.equal(resolveMarkdownImagePath('file://assets/a.png', BASE), `${TOKEN_PREFIX}assets/a.png`)
  assert.equal(resolveMarkdownImagePath('file://docs/demo.png', BASE), `${TOKEN_PREFIX}docs/demo.png`)
  // 真正的绝对路径（文档目录之外）保持原样：当前不支持，见 README 已知限制
  assert.equal(resolveMarkdownImagePath('file:///Users/me/a.png', BASE), 'file:///Users/me/a.png')
  assert.equal(resolveMarkdownImagePath('file://C:\\pics\\a.png', BASE), 'file://C:\\pics\\a.png')
})

test('external URLs and data URIs are left alone', () => {
  assert.equal(resolveMarkdownImagePath('https://example.com/a.png', BASE), 'https://example.com/a.png')
  assert.equal(resolveMarkdownImagePath('http://example.com/a.png', BASE), 'http://example.com/a.png')
  assert.equal(resolveMarkdownImagePath('data:image/png;base64,AAAA', BASE), 'data:image/png;base64,AAAA')
  assert.equal(resolveMarkdownImagePath('//cdn.example.com/a.png', BASE), '//cdn.example.com/a.png')
  assert.equal(resolveMarkdownImagePath('', BASE), '')
  assert.equal(resolveMarkdownImagePath(undefined, BASE), undefined)
})

test('external change classification drives auto-reload vs conflict banner', () => {
  // 版本没变 / 宿主没给版本：什么都不用做
  assert.equal(classifyExternalChange({ version: 'v1', currentVersion: 'v1', dirty: false }), 'none')
  assert.equal(classifyExternalChange({ version: '', currentVersion: 'v1', dirty: true }), 'none')
  assert.equal(classifyExternalChange({ currentVersion: 'v1', dirty: false }), 'none')
  assert.equal(classifyExternalChange(), 'none')

  // 文件不见了：提示，但下次轮询还会继续
  assert.equal(classifyExternalChange({ missing: true, version: 'v1', currentVersion: 'v1' }), 'missing')
  assert.equal(classifyExternalChange({ missing: true, dirty: true }), 'missing')

  // 版本变了：没有未保存修改就自动刷新，有就弹冲突横幅
  assert.equal(classifyExternalChange({ version: 'v2', currentVersion: 'v1', dirty: false }), 'reload')
  assert.equal(classifyExternalChange({ version: 'v2', currentVersion: 'v1', dirty: true }), 'conflict')
})
