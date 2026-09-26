import { useEffect } from 'react'

export default function CursorRipples() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(pointer: coarse)')
    if (reduce.matches || touch.matches) return undefined

    let last = 0
    const onMove = (event) => {
      const now = performance.now()
      if (now - last < 62) return
      last = now

      const ripple = document.createElement('i')
      ripple.className = 'cursor-ripple'
      ripple.style.left = `${event.clientX}px`
      ripple.style.top = `${event.clientY}px`
      document.body.appendChild(ripple)
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
