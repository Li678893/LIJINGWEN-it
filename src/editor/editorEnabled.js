/**
 * 编辑入口的开关。
 * 本地开发（npm run dev）→ 一直显示，方便随时改。
 * 线上部署 → 始终隐藏，访客看不到「编辑网页」；编辑器只在本地开发环境使用。
 */
export function editorEnabled() {
  return Boolean(import.meta.env?.DEV)
}
