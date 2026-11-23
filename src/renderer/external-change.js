/**
 * 「磁盘上的文档被别的程序改了」判定（渲染器侧）。
 *
 * 渲染器每隔一段时间用 `/dsh-marktext/api/stat` 取一次文件版本，这里只做纯判断，
 * 方便在 Node 里单测，不碰 DOM：
 *
 *   none      版本没变（或宿主没给出版本），什么都不用做
 *   missing   文件不见了：提示，等它回来（轮询会继续）
 *   reload    变了且本地没有未保存修改：自动重新加载
 *   conflict  变了但用户有未保存修改：不能自动覆盖，弹冲突横幅让用户决定
 *
 * @param {{ version?: string, currentVersion?: string, dirty?: boolean, missing?: boolean }} input
 * @returns {'none' | 'missing' | 'reload' | 'conflict'}
 */
export function classifyExternalChange(input) {
  const { version, currentVersion, dirty } = input ?? {}
  if (input?.missing === true) return 'missing'
  if (typeof version !== 'string' || version.length === 0) return 'none'
  if (version === currentVersion) return 'none'
  return dirty === true ? 'conflict' : 'reload'
}
