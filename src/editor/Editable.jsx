import { useEffect, useRef } from 'react'
import { useContent, getPath } from '../content/ContentContext.jsx'

/**
 * 行内文本编辑。
 * 非编辑态就是普通文本；编辑态用 contentEditable，
 * 文本交给 DOM 管（React 只在外部值变化时同步一次），否则受控输入会把光标顶到开头。
 */
export default function Editable({
  path,
  as: Tag = 'span',
  className = '',
  placeholder = '点击编辑',
  multiline = false,
  toText = (v) => (v == null ? '' : String(v)),
  fromText = (t) => t,
  ...rest
}) {
  const { content, edit, set } = useContent()
  const value = toText(getPath(content, path))
  const ref = useRef(null)

  useEffect(() => {
    if (!edit) return
    const el = ref.current
    if (el && el.innerText !== value) el.innerText = value
  }, [value, edit])

  if (!edit) {
    return (
      <Tag className={className} {...rest}>
        {value}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      className={`${className} ed-text${multiline ? ' ed-pre' : ''}`.trim()}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onBlur={(e) => {
        const next = multiline ? e.currentTarget.innerText.replace(/\s+$/, '') : e.currentTarget.innerText.trim()
        if (next !== value) set(path, fromText(next))
      }}
      onKeyDown={(e) => {
        // 单行文本回车即提交，避免把换行塞进标题
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      {...rest}
    />
  )
}

/** 工具行：上移 / 下移 / 删除，列表项在编辑态共用 */
export function RowTools({ onUp, onDown, onRemove, extra }) {
  return (
    <span className="ed-row">
      {extra}
      <button type="button" onClick={onUp} title="上移">
        ↑
      </button>
      <button type="button" onClick={onDown} title="下移">
        ↓
      </button>
      {onRemove && (
        <button type="button" className="is-danger" onClick={onRemove} title="删除">
          ×
        </button>
      )}
    </span>
  )
}
