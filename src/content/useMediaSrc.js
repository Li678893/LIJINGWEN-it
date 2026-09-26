import { useEffect, useState } from 'react'
import { getFile, IDB_PREFIX } from './mediaStore.js'

// 缓存 objectURL，否则每次重渲染都新建一个会泄漏
const urlCache = new Map()

export function resolveStaticSrc(src) {
  if (!src || src.startsWith(IDB_PREFIX) || !src.startsWith('/')) return src || ''
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '/')}${src.slice(1)}`
}

/** 把 `idb:<key>` 解析成可访问的 objectURL；普通静态路径原样返回 */
export function useMediaSrc(src) {
  const [url, setUrl] = useState(() =>
    src && src.startsWith(IDB_PREFIX) ? urlCache.get(src) || '' : resolveStaticSrc(src)
  )

  useEffect(() => {
    if (!src) {
      setUrl('')
      return
    }
    if (!src.startsWith(IDB_PREFIX)) {
      setUrl(resolveStaticSrc(src))
      return
    }
    const cached = urlCache.get(src)
    if (cached) {
      setUrl(cached)
      return
    }
    let alive = true
    getFile(src.slice(IDB_PREFIX.length)).then((file) => {
      if (!alive || !file) return
      const u = URL.createObjectURL(file)
      urlCache.set(src, u)
      setUrl(u)
    })
    return () => {
      alive = false
    }
  }, [src])

  return url
}
