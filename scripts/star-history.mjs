/**
 * 生成 docs/assets/star-history.svg：用 GitHub API 拉真实 stargazers，画成累积曲线。
 *
 * 为什么不用 star-history.com 的远程图：它会缓存、会限流，新仓库经常渲染成 0–1 的降级图。
 * 这里用仓库自己的 token 取数据，产物随仓库一起提交，图就是准的。
 *
 * 用法：GITHUB_TOKEN=... node scripts/star-history.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'docs', 'assets', 'star-history.svg')
const REPO = process.env.STAR_REPO ?? 'Roland0511/dsh-marktext'
const TOKEN = process.env.GITHUB_TOKEN ?? ''

const headers = {
  accept: 'application/vnd.github.star+json',
  'user-agent': 'dsh-marktext-star-history',
  ...(TOKEN ? { authorization: `Bearer ${TOKEN}` } : {}),
}

async function fetchStars() {
  const days = new Map()
  for (let page = 1; page <= 100; page += 1) {
    const response = await fetch(`https://api.github.com/repos/${REPO}/stargazers?per_page=100&page=${page}`, { headers })
    if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`)
    const batch = await response.json()
    for (const item of batch) {
      const day = String(item.starred_at).slice(0, 10)
      days.set(day, (days.get(day) ?? 0) + 1)
    }
    if (batch.length < 100) break
  }
  return days
}

function escapeXml(value) {
  return String(value).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c])
}

function buildSeries(days) {
  const sorted = [...days.entries()].sort(([a], [b]) => a.localeCompare(b))
  const first = sorted.length ? sorted[0][0] : new Date().toISOString().slice(0, 10)
  const last = sorted.length ? sorted[sorted.length - 1][0] : first
  const start = new Date(`${first}T00:00:00Z`)
  const end = new Date(`${last}T00:00:00Z`)
  const series = []
  let total = 0
  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10)
    total += days.get(key) ?? 0
    series.push({ date: new Date(cursor), total })
  }
  return series
}

function render(series, total) {
  const W = 800
  const H = 320
  const pad = { top: 56, right: 32, bottom: 44, left: 56 }
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const maxY = Math.max(4, Math.ceil((total * 1.2) / 4) * 4)
  const x = (i) => pad.left + (series.length <= 1 ? innerW : (i / (series.length - 1)) * innerW)
  const y = (v) => pad.top + innerH - (v / maxY) * innerH

  const points = series.map((point, i) => `${x(i).toFixed(1)},${y(point.total).toFixed(1)}`).join(' ')
  const area = `${pad.left},${pad.top + innerH} ${points} ${pad.left + innerW},${pad.top + innerH}`
  const label = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxY * ratio))
  const xTicks = series.length > 1 ? [0, Math.floor((series.length - 1) / 2), series.length - 1] : [0]

  const yGrid = yTicks
    .map(
      (value) => `<g>
    <line x1="${pad.left}" y1="${y(value)}" x2="${pad.left + innerW}" y2="${y(value)}" stroke="#e8ecf2" stroke-width="1"/>
    <text x="${pad.left - 12}" y="${y(value) + 4}" text-anchor="end" font-size="12" fill="#8a93a3">${value}</text>
  </g>`,
    )
    .join('\n  ')

  const xLabels = xTicks
    .map(
      (index) =>
        `<text x="${x(index).toFixed(1)}" y="${pad.top + innerH + 26}" text-anchor="${index === 0 ? 'start' : index === series.length - 1 ? 'end' : 'middle'}" font-size="12" fill="#8a93a3">${label(series[index].date)}</text>`,
    )
    .join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Star history for ${escapeXml(REPO)}">
  <defs>
    <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f2a33c" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#f2a33c" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="#ffffff"/>
  <text x="${pad.left}" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="600" fill="#1f2630">Star history</text>
  <text x="${W - pad.right}" y="32" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" fill="#8a93a3">${escapeXml(REPO)}</text>
  ${yGrid}
  <polygon points="${area}" fill="url(#fill)"/>
  <polyline points="${points}" fill="none" stroke="#e8873a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${x(series.length - 1).toFixed(1)}" cy="${y(total).toFixed(1)}" r="4" fill="#e8873a"/>
  <text x="${(x(series.length - 1) - 8).toFixed(1)}" y="${(y(total) - 12).toFixed(1)}" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#1f2630">${total}</text>
  ${xLabels}
  <text x="${pad.left + innerW / 2}" y="${H - 8}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="#9aa3b2">source: GitHub stargazers</text>
</svg>
`
}

const days = await fetchStars()
const total = [...days.values()].reduce((a, b) => a + b, 0)
const series = buildSeries(days)
await mkdir(dirname(OUT), { recursive: true })
await writeFile(OUT, render(series, total), 'utf8')
console.log(`star-history: ${total} stars over ${series.length} day(s) -> ${OUT}`)
