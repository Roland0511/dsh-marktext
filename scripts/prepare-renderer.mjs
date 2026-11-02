/** 构建前把 mermaid 的预构建产物放进 renderer 的 public 目录（不入库，构建时现拷）。 */
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'node_modules', 'mermaid', 'dist', 'mermaid.min.js')
const to = join(root, 'src', 'renderer', 'public', 'mermaid.min.js')
await mkdir(dirname(to), { recursive: true })
await copyFile(from, to)
console.log('renderer: copied mermaid.min.js')
