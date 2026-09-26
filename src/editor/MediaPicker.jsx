import { useRef, useState } from 'react'
import { useContent } from '../content/ContentContext.jsx'
import { putFile, IDB_PREFIX } from '../content/mediaStore.js'
import { captureVideoPoster } from '../content/poster.js'

/**
 * 换掉某个位置的图片 / 视频：选本地文件 → 存 IndexedDB → 内容里写成 idb:<key>
 *
 * posterPath：上传视频时顺带抽一帧存成封面写回该路径，
 * 否则新上传的视频在卡片上会是一片空白。
 */
export default function MediaPicker({
  path,
  posterPath,
  accept = 'image/*',
  label = '更换',
  className = '',
}) {
  const { set } = useContent()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const handle = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setBusy(true)
    try {
      const key = `${Date.now()}-${file.name.replace(/[^\w.\-一-龥]/g, '_')}`
      await putFile(key, file)
      set(path, `${IDB_PREFIX}${key}`)

      if (posterPath && file.type.startsWith('video/')) {
        try {
          const blob = await captureVideoPoster(file)
          const posterKey = `${key}.poster.jpg`
          await putFile(posterKey, blob)
          set(posterPath, `${IDB_PREFIX}${posterKey}`)
        } catch (err) {
          // 抽帧失败不阻断上传，仍可手动换封面
          console.warn('自动抽取封面失败，可手动更换', err)
        }
      }
    } catch (err) {
      console.error('媒体保存失败', err)
      alert('媒体保存失败，可能是浏览器存储配额已满')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className={`ed-picker ${className}`.trim()}>
      <button
        type="button"
        className="ed-picker-btn"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? '处理中…' : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={handle} />
    </span>
  )
}
