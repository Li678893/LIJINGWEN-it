import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultContent, CONTENT_VERSION } from './defaults.js'
import { clearFiles } from './mediaStore.js'

// key 带版本号：改版式后旧数据自动失效，不会让页面崩掉
const STORAGE_KEY = `ljw-archive-content-v${CONTENT_VERSION}`

const ContentCtx = createContext(null)

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.version === CONTENT_VERSION ? parsed : null
  } catch {
    return null
  }
}

/** 按 'a.b.0.c' 取值，数字段当数组下标 */
export function getPath(obj, path) {
  return String(path)
    .split('.')
    .reduce((acc, k) => {
      if (acc == null) return acc
      if (Array.isArray(acc) && /^\d+$/.test(k)) return acc[Number(k)]
      return acc[k]
    }, obj)
}

function setPath(draft, path, value) {
  const keys = String(path).split('.')
  let node = draft
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    node = Array.isArray(node) ? node[Number(k)] : node[k]
    if (node == null) return false
  }
  const last = keys[keys.length - 1]
  if (Array.isArray(node)) node[Number(last)] = value
  else node[last] = value
  return true
}

const clone = (v) => JSON.parse(JSON.stringify(v))

/** 列表统一工具：增 / 删 / 改 / 上下移 */
function makeListHelpers(setContent, key, factory, after) {
  return {
    update: (index, patch) =>
      setContent((prev) => {
        const next = clone(prev)
        Object.assign(next[key][index], patch)
        after?.(next[key])
        return next
      }),
    add: () =>
      setContent((prev) => {
        const next = clone(prev)
        next[key].push(factory(next[key].length))
        after?.(next[key])
        return next
      }),
    remove: (index) =>
      setContent((prev) => {
        const next = clone(prev)
        next[key].splice(index, 1)
        after?.(next[key])
        return next
      }),
    move: (index, dir) =>
      setContent((prev) => {
        const next = clone(prev)
        const to = index + dir
        if (to < 0 || to >= next[key].length) return prev
        const [item] = next[key].splice(index, 1)
        next[key].splice(to, 0, item)
        after?.(next[key])
        return next
      }),
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => loadStored() || defaultContent())
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
    } catch (err) {
      console.warn('内容保存失败（可能超出本地存储上限）', err)
    }
  }, [content])

  const set = useCallback((path, value) => {
    setContent((prev) => {
      const next = clone(prev)
      return setPath(next, path, value) ? next : prev
    })
  }, [])

  const renumber = (list) =>
    list.forEach((item, i) => {
      item.n = String(i + 1).padStart(2, '0')
    })

  const projects = useMemo(
    () =>
      makeListHelpers(
        setContent,
        'work.projects',
        () => ({
          n: '00',
          title: 'NEW PROJECT / 新项目',
          tag: '作品类型 · 内容标签',
          meta: '30秒 · 视频标签 / 制作方式',
          video: '',
          poster: '',
          cls: 'square',
          transform: { x: 0, y: 0, scale: 1 },
        }),
        (list) => renumber(list)
      ),
    []
  )

  const renovate = (list) =>
    list.forEach((item, i) => {
      item.no = String(i + 1).padStart(2, '0')
    })

  const capabilities = useMemo(
    () =>
      makeListHelpers(
        setContent,
        'caps.items',
        () => ({ no: '00', title: 'NEW CAPABILITY', desc: '一句话说明这项能力。' }),
        renovate
      ),
    []
  )

  const stats = useMemo(
    () =>
      makeListHelpers(setContent, 'about.stats', () => ({
        value: '00',
        label: 'NEW INDEX\n说明文字',
      })),
    []
  )

  const navLinks = useMemo(
    () => makeListHelpers(setContent, 'nav.links', () => ({ label: 'NEW LINK', href: '#work' })),
    []
  )

  const reset = useCallback(async () => {
    await clearFiles()
    setContent(defaultContent())
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'archive-content.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [content])

  const importJson = useCallback((text) => {
    const parsed = JSON.parse(text)
    if (parsed?.version !== CONTENT_VERSION) {
      throw new Error(`文件格式不匹配（version 应为 ${CONTENT_VERSION}）`)
    }
    setContent(parsed)
  }, [])

  const value = useMemo(
    () => ({
      content,
      edit,
      setEdit,
      toggleEdit: () => setEdit((v) => !v),
      set,
      projects,
      capabilities,
      stats,
      navLinks,
      reset,
      exportJson,
      importJson,
    }),
    [content, edit, set, projects, capabilities, stats, navLinks, reset, exportJson, importJson]
  )

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>
}

export function useContent() {
  const ctx = useContext(ContentCtx)
  if (!ctx) throw new Error('useContent 必须在 ContentProvider 内使用')
  return ctx
}
