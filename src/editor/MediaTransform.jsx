import React from 'react'
import { getPath, useContent } from '../content/ContentContext.jsx'

const fallback = { x: 0, y: 0, scale: 1 }

export default function MediaTransform({ path, children }) {
  const { content, edit, set } = useContent()
  const value = { ...fallback, ...(getPath(content, path) || {}) }
  const update = (key, next) => set(`${path}.${key}`, Number(next))
  const child = React.Children.only(children)
  const style = {
    ...(child.props.style || {}),
    transform: `translate(${value.x}px, ${value.y}px) scale(${value.scale})`,
    transformOrigin: 'center center',
    transition: edit ? 'none' : 'transform 520ms cubic-bezier(.22,1,.36,1)',
  }

  return (
    <div className="media-transform">
      <div className="media-transform__content">
        {React.cloneElement(child, { style })}
      </div>
      {edit && (
        <div className="media-transform__controls" onClick={(e) => e.stopPropagation()}>
          <label>位置 X <input type="range" min="-120" max="120" value={value.x} onChange={(e) => update('x', e.target.value)} /></label>
          <label>位置 Y <input type="range" min="-120" max="120" value={value.y} onChange={(e) => update('y', e.target.value)} /></label>
          <label>大小 <input type="range" min="0.7" max="1.5" step="0.01" value={value.scale} onChange={(e) => update('scale', e.target.value)} /></label>
          <button type="button" onClick={() => set(path, fallback)}>复位</button>
        </div>
      )}
    </div>
  )
}
