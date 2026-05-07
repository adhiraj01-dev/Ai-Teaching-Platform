import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Download, Pen, ArrowRight, Square, Circle, Type, Eraser, Minus } from 'lucide-react'
import Topbar from '../components/Topbar'

const COLORS = [
  { hex: '#6C63FF', name: 'Purple' },
  { hex: '#10d9a8', name: 'Teal' },
  { hex: '#f5a623', name: 'Amber' },
  { hex: '#ff5c7a', name: 'Red' },
  { hex: '#4da6ff', name: 'Blue' },
  { hex: '#ff7eb3', name: 'Pink' },
  { hex: '#e8eaf2', name: 'White' },
]

const TOOLS = [
  { id: 'pen',    icon: Pen,        label: 'Pen' },
  { id: 'line',   icon: Minus,      label: 'Line' },
  { id: 'arrow',  icon: ArrowRight, label: 'Arrow' },
  { id: 'rect',   icon: Square,     label: 'Rect' },
  { id: 'circle', icon: Circle,     label: 'Circle' },
  { id: 'text',   icon: Type,       label: 'Text' },
  { id: 'eraser', icon: Eraser,     label: 'Eraser' },
]

export default function WhiteboardPage() {
  const canvasRef = useRef(null)
  const [tool, setTool]     = useState('pen')
  const [color, setColor]   = useState('#6C63FF')
  const [size, setSize]     = useState(3)
  const [drawing, setDrawing] = useState(false)
  const posRef    = useRef({ x: 0, y: 0 })
  const startRef  = useRef({ x: 0, y: 0 })
  const snapshotRef = useRef(null)

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx.fillStyle = '#0d0f14'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    initCanvas()
    const onResize = () => initCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [initCanvas])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const r = canvas.getBoundingClientRect()
    const src = e.touches?.[0] || e
    return { x: src.clientX - r.left, y: src.clientY - r.top }
  }

  const onDown = (e) => {
    e.preventDefault()
    const pos = getPos(e)
    posRef.current = pos
    startRef.current = pos
    setDrawing(true)

    const ctx = canvasRef.current.getContext('2d')
    if (tool === 'text') {
      const txt = prompt('Enter text:')
      if (txt) {
        ctx.fillStyle = color
        ctx.font = `${14 + size * 3}px Sora, sans-serif`
        ctx.fillText(txt, pos.x, pos.y)
      }
      setDrawing(false)
      return
    }
    if (['rect','circle','arrow','line'].includes(tool)) {
      snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const onMove = (e) => {
    if (!drawing) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = getPos(e)
    const { x: sx, y: sy } = startRef.current

    ctx.strokeStyle = tool === 'eraser' ? '#0d0f14' : color
    ctx.lineWidth   = tool === 'eraser' ? size * 4 : size
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(posRef.current.x, posRef.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      posRef.current = { x, y }
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0)
      ctx.beginPath()

      if (tool === 'line') {
        ctx.moveTo(sx, sy); ctx.lineTo(x, y); ctx.stroke()
      } else if (tool === 'rect') {
        ctx.strokeRect(sx, sy, x - sx, y - sy)
      } else if (tool === 'circle') {
        const rx = (x - sx) / 2, ry = (y - sy) / 2
        ctx.ellipse(sx + rx, sy + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2)
        ctx.stroke()
      } else if (tool === 'arrow') {
        drawArrow(ctx, sx, sy, x, y)
      }
    }
  }

  const drawArrow = (ctx, fx, fy, tx, ty) => {
    const angle = Math.atan2(ty - fy, tx - fx)
    const len = 14
    ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(tx - len * Math.cos(angle - Math.PI / 6), ty - len * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(tx - len * Math.cos(angle + Math.PI / 6), ty - len * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  const onUp = () => { setDrawing(false); snapshotRef.current = null }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0d0f14'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const save = () => {
    const a = document.createElement('a')
    a.href = canvasRef.current.toDataURL('image/png')
    a.download = 'whiteboard.png'
    a.click()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Interactive Whiteboard" subtitle="Draw diagrams, arrows, shapes and annotate" />

      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-2 flex-wrap p-3 rounded-xl"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}
        >
          {/* Tool buttons */}
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              title={label}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all"
              style={{
                background: tool === id ? 'var(--accent)' : 'var(--bg3)',
                color: tool === id ? 'white' : 'var(--text2)',
                borderColor: tool === id ? 'var(--accent)' : 'var(--border2)',
                fontWeight: tool === id ? 500 : 400
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          {/* Color swatches */}
          {COLORS.map(({ hex, name }) => (
            <button
              key={hex}
              title={name}
              onClick={() => setColor(hex)}
              className="rounded-full transition-all duration-150 flex-shrink-0"
              style={{
                width: 22, height: 22, background: hex,
                border: color === hex ? '2px solid white' : '2px solid transparent',
                transform: color === hex ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>Size</span>
            <input
              type="range" min={1} max={20} value={size}
              onChange={e => setSize(+e.target.value)}
              style={{ width: 70 }}
            />
            <span style={{ fontSize: 11, color: 'var(--text3)', minWidth: 16 }}>{size}</span>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          <button
            onClick={clear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all"
            style={{ background: 'var(--bg3)', color: 'var(--text2)', borderColor: 'var(--border2)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          >
            <Trash2 size={13} /> Clear
          </button>

          <button
            onClick={save}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-all"
            style={{ background: 'var(--bg3)', color: 'var(--text2)', borderColor: 'var(--border2)' }}
          >
            <Download size={13} /> Save PNG
          </button>
        </motion.div>

        {/* Canvas */}
        <div className="flex-1 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', minHeight: 400 }}>
          <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%', cursor: tool === 'eraser' ? 'cell' : tool === 'text' ? 'text' : 'crosshair' }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          />
        </div>
      </div>
    </div>
  )
}
