import { useMediaSrc } from '../content/useMediaSrc.js'

/** 统一渲染图片 / 视频：src 可能是静态路径，也可能是上传后存的 idb: 键 */
export default function SmartMedia({
  src,
  poster,
  kind = 'image',
  className,
  style,
  alt = '',
  preload = 'metadata',
  ...rest
}) {
  const url = useMediaSrc(src)
  const posterUrl = useMediaSrc(poster)

  if (!url) return <span className={`${className || ''} ed-empty`.trim()} style={style} />

  if (kind === 'video') {
    return (
      <video
        className={className}
        style={style}
        src={url}
        poster={posterUrl || undefined}
        muted
        loop
        playsInline
        preload={preload}
        {...rest}
      />
    )
  }

  return <img className={className} style={style} src={url} alt={alt} {...rest} />
}
