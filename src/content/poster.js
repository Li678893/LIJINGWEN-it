/**
 * 上传视频时在浏览器里抽一帧当封面。
 * 卡片只渲染封面的话，没有这一步新上传的视频会是一片空白。
 * 抽帧失败不阻断上传，降级为「用户可手动换封面」。
 */
export async function captureVideoPoster(file, { at = 1.0, quality = 0.82, maxSide = 1080 } = {}) {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = url

  try {
    await new Promise((resolve, reject) => {
      video.addEventListener('loadeddata', resolve, { once: true })
      video.addEventListener('error', () => reject(new Error('无法解码视频')), { once: true })
      setTimeout(() => reject(new Error('读取视频超时')), 30000)
    })

    const duration = Number.isFinite(video.duration) ? video.duration : at
    video.currentTime = Math.min(at, Math.max(0.3, duration * 0.15))
    await new Promise((resolve) => {
      video.addEventListener('seeked', resolve, { once: true })
      setTimeout(resolve, 10000)
    })

    const scale = Math.min(1, maxSide / Math.max(video.videoWidth, video.videoHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
