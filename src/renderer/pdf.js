/**
 * 把编辑器里的文档导出成真正的 PDF 文件（不是打印对话框）。
 *
 * 思路：编辑区在侧栏里只有几百像素宽，直接截图会得到一条窄纸带，字会大得离谱。
 * 所以先在一个离屏 iframe 里按 A4 的宽度（96dpi ≈ 794px）重建一份同样的 DOM，
 * 复用页面已加载的样式表，等字体和图片就绪后整体栅格化，再按 A4 排版切片写进 PDF。
 *
 * 两个重依赖（html2canvas-pro / jsPDF）都是动态 import 的：不点「PDF」就不会加载，
 * 首屏体积不受影响。
 */

const A4_WIDTH_PT = 595.28
const A4_HEIGHT_PT = 841.89
const MARGIN_PT = 36
const STAGE_WIDTH_PX = 794 // A4 宽 210mm @96dpi
const RASTER_SCALE = 2 // 渲染倍率，约为 300dpi 的输出

const STAGE_CSS = `
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff !important;
    color: #111111;
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    width: ${STAGE_WIDTH_PX}px;
  }
  #editor, .mu-editor {
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    flex: none !important;
  }
  .mu-container {
    max-width: none !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .mu-editor * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* 离屏舞台里 muya 的表格边框依赖主题变量，兜底成明确颜色 */
  .mu-editor table {
    border-collapse: collapse !important;
    width: 100% !important;
  }
  .mu-editor table th,
  .mu-editor table td {
    border: 1px solid #d6d9e0 !important;
    padding: 6px 10px !important;
    text-align: left;
  }
  .mu-editor table th {
    background: #f6f7f9 !important;
    font-weight: 600;
  }
`

/** 在文档外建一个不可见的 A4 宽度舞台，把内容克隆进去。 */
function createStage(html) {
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.style.cssText = [
    'position: fixed',
    'left: -20000px',
    'top: 0',
    `width: ${STAGE_WIDTH_PX}px`,
    'height: 1200px',
    'border: 0',
    'opacity: 0',
    'pointer-events: none',
  ].join(';')
  document.body.appendChild(frame)

  const doc = frame.contentDocument
  doc.open()
  doc.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
  doc.close()

  // 复用页面已经加载好的样式表（字体、KaTeX、muya、我们的 style.css 都在里面）
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    if (!link.href) continue
    const clone = doc.createElement('link')
    clone.rel = 'stylesheet'
    clone.href = link.href
    doc.head.appendChild(clone)
  }
  for (const style of document.querySelectorAll('style')) {
    doc.head.appendChild(doc.importNode(style, true))
  }

  // 覆盖样式必须最后进，才能压过 style.css 里的 body 布局
  const override = doc.createElement('style')
  override.textContent = STAGE_CSS
  doc.head.appendChild(override)

  doc.body.innerHTML = html
  return { frame, doc }
}

async function waitForAssets(doc) {
  try {
    await doc.fonts?.ready
  } catch {
    /* 字体失败就按回退字体排版 */
  }
  const images = Array.from(doc.images || [])
  await Promise.all(
    images.map((image) =>
      typeof image.decode === 'function'
        ? image.decode().catch(() => {})
        : new Promise((resolve) => {
            if (image.complete) resolve()
            else {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
            }
          }),
    ),
  )
}

/**
 * 从 limit 往上找一条整行空白的分页线，避免把一行字或一张图劈成两半。
 * 透明像素按背景处理（html2canvas 有时候不给空白区域上色）。
 */
function findCutY(canvas, limit, search = 220) {
  const from = Math.max(0, Math.floor(limit - search))
  const height = Math.floor(limit) - from
  if (height <= 0) return limit
  let data
  try {
    data = canvas.getContext('2d').getImageData(0, from, canvas.width, height).data
  } catch {
    return limit
  }
  for (let row = height - 1; row >= 0; row -= 1) {
    let blank = true
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (row * canvas.width + x) * 4
      if (data[index + 3] === 0) continue
      if (data[index] < 250 || data[index + 1] < 250 || data[index + 2] < 250) {
        blank = false
        break
      }
    }
    if (blank) return from + row
  }
  return limit
}

/**
 * 切一页出来并编码。纯文字的页面 PNG 无损且体积和 JPEG 相当、字更干净；
 * 带照片的页面 JPEG 小得多。所以两种都编一遍，选小的那个。
 */
function slicePage(source, offsetY, height, scratch) {
  scratch.width = source.width
  scratch.height = height
  const context = scratch.getContext('2d')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, scratch.width, scratch.height)
  context.drawImage(source, 0, offsetY, source.width, height, 0, 0, source.width, height)

  const png = scratch.toDataURL('image/png')
  const jpeg = scratch.toDataURL('image/jpeg', 0.92)
  // 只有 JPEG 明显更小（多半是页面里有照片）才让位，否则保留无损的 PNG
  return jpeg.length < png.length * 0.8 ? { format: 'JPEG', data: jpeg } : { format: 'PNG', data: png }
}

/**
 * 生成 PDF。
 * @param {{ element?: HTMLElement, name?: string }} options
 * @returns {Promise<{ blob: Blob, pages: number, filename: string }>}
 */
export async function exportPdf(options = {}) {
  const source = options.element || document.getElementById('editor')
  if (!source) throw new Error('no document element to export')
  const filename = `${options.name || 'document'}.pdf`

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')])

  const { frame, doc } = createStage(source.outerHTML)
  try {
    await waitForAssets(doc)

    // 用克隆内容自己的高度，而不是 body.scrollHeight —— 后者会被 iframe 的视口高度撑大，
    // 结果就是末尾多出一页几乎空白的纸。
    const root = doc.body.firstElementChild || doc.body
    const stageHeight = Math.max(1, Math.ceil(root.getBoundingClientRect().height) + 8)
    frame.style.height = `${stageHeight}px`

    const canvas = await html2canvas(doc.body, {
      backgroundColor: '#ffffff',
      scale: RASTER_SCALE,
      useCORS: true,
      logging: false,
      windowWidth: STAGE_WIDTH_PX,
      windowHeight: stageHeight,
      width: STAGE_WIDTH_PX,
      height: stageHeight,
    })

    const contentWidth = A4_WIDTH_PT - MARGIN_PT * 2
    const contentHeight = A4_HEIGHT_PT - MARGIN_PT * 2
    const scale = contentWidth / canvas.width
    const sliceHeight = Math.max(1, Math.floor(contentHeight / scale))

    const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
    const scratch = document.createElement('canvas')
    let pages = 0
    let offset = 0
    while (offset < canvas.height) {
      const remaining = canvas.height - offset
      const wanted = Math.min(sliceHeight, remaining)
      // 不是最后一页时，把切口上移到最近的块边界，别把一行字劈成两半
      let height = wanted
      if (wanted < remaining) {
        const cut = findCutY(canvas, offset + wanted) - offset
        if (cut > sliceHeight * 0.6) height = cut
      }
      if (pages > 0 && height < 12) break

      const image = slicePage(canvas, offset, height, scratch)
      const drawHeight = height * scale
      if (pages > 0) pdf.addPage('a4', 'portrait')
      pdf.addImage(image.data, image.format, MARGIN_PT, MARGIN_PT, contentWidth, drawHeight, undefined, 'FAST')
      pages += 1
      offset += height
    }

    return { blob: pdf.output('blob'), pages, filename, metrics: { canvasWidth: canvas.width, canvasHeight: canvas.height, sliceHeight } }
  } finally {
    frame.remove()
  }
}
