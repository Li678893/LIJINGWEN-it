import { useEffect, useRef } from 'react'
import { useContent } from '../content/ContentContext.jsx'

export default function EditorBar() {
  const { edit, toggleEdit, exportJson, importJson, reset } = useContent()
  const fileRef = useRef(null)

  // E 键开关编辑态（正在输入文字时不抢键）
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'e' && e.key !== 'E') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = document.activeElement
      if (el?.isContentEditable || el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA') return
      toggleEdit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleEdit])

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      importJson(await file.text())
    } catch (err) {
      alert(`导入失败：${err.message}`)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('恢复默认会清空你在页面上做的所有修改，确定吗？')) return
    await reset()
  }

  return (
    <>
      <div className="ed-bar">
        <button
          type="button"
          className={`ed-bar-main${edit ? ' is-on' : ''}`}
          onClick={toggleEdit}
        >
          <span className="ed-bar-dot" />
          {edit ? '完成编辑' : '编辑网页'}
        </button>

        {edit && (
          <div className="ed-bar-tools">
            <button type="button" onClick={exportJson}>
              导出内容
            </button>
            <button type="button" onClick={() => fileRef.current?.click()}>
              导入内容
            </button>
            <button type="button" className="is-danger" onClick={handleReset}>
              恢复默认
            </button>
          </div>
        )}
      </div>

      {edit && (
        <div className="ed-hint">
          点文字直接改，失焦即保存 · 点「换图 / 换视频」换素材 · 按 <kbd>E</kbd> 退出
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleImport}
      />
    </>
  )
}
