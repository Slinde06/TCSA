import { useRef, useEffect } from 'react'
import './ShapeGrid.css'

const ShapeGrid = ({ direction = 'right', speed = 1, borderColor = '#999', squareSize = 40, shape = 'square', className = '' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const offset = { x: 0, y: 0 }
    let frame = null

    const isHex = shape === 'hexagon'
    const isTri = shape === 'triangle'
    const hexHoriz = squareSize * 1.5
    const hexVert = squareSize * Math.sqrt(3)

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      draw()
    }

    const hexPath = (cx, cy, size) => {
      ctx.moveTo(cx + size, cy)
      for (let i = 1; i < 6; i++) {
        const a = (Math.PI / 3) * i
        ctx.lineTo(cx + size * Math.cos(a), cy + size * Math.sin(a))
      }
      ctx.closePath()
    }

    const mod = (n, m) => ((n % m) + m) % m

    function draw() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.beginPath()

      if (isHex) {
        const colShift = Math.floor(offset.x / hexHoriz)
        const ox = mod(offset.x, hexHoriz)
        const oy = mod(offset.y, hexVert)
        const cols = Math.ceil(w / hexHoriz) + 3
        const rows = Math.ceil(h / hexVert) + 3
        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + ox
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + oy
            hexPath(cx, cy, squareSize)
          }
        }
      } else if (isTri) {
        const half = squareSize / 2
        const colShift = Math.floor(offset.x / half)
        const rowShift = Math.floor(offset.y / squareSize)
        const ox = mod(offset.x, half)
        const oy = mod(offset.y, squareSize)
        for (let col = -2; col < Math.ceil(w / half) + 4; col++) {
          for (let row = -2; row < Math.ceil(h / squareSize) + 4; row++) {
            const cx = col * half + ox
            const cy = row * squareSize + half + oy
            const flip = mod(col + colShift + row + rowShift, 2) !== 0
            const d = flip ? -1 : 1
            ctx.moveTo(cx, cy - (d * squareSize) / 2)
            ctx.lineTo(cx + half, cy + (d * squareSize) / 2)
            ctx.lineTo(cx - half, cy + (d * squareSize) / 2)
            ctx.closePath()
          }
        }
      } else {
        const ox = mod(offset.x, squareSize)
        const oy = mod(offset.y, squareSize)
        for (let col = -2; col < Math.ceil(w / squareSize) + 3; col++) {
          for (let row = -2; row < Math.ceil(h / squareSize) + 3; row++) {
            const x = col * squareSize + ox
            const y = row * squareSize + oy
            if (shape === 'circle') {
              ctx.moveTo(x + squareSize, y + squareSize / 2)
              ctx.arc(x + squareSize / 2, y + squareSize / 2, squareSize / 2, 0, Math.PI * 2)
            } else {
              ctx.rect(x, y, squareSize, squareSize)
            }
          }
        }
      }

      ctx.stroke()
    }

    const step = () => {
      const s = Math.max(speed, 0.1)
      const wrapX = isHex ? hexHoriz * 2 : squareSize
      const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize
      if (direction === 'right' || direction === 'diagonal') offset.x = mod(offset.x - s, wrapX)
      if (direction === 'left') offset.x = mod(offset.x + s, wrapX)
      if (direction === 'up') offset.y = mod(offset.y + s, wrapY)
      if (direction === 'down' || direction === 'diagonal') offset.y = mod(offset.y - s, wrapY)
      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(step)
    }
    const stop = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = null
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    resize()
    start()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [direction, speed, borderColor, squareSize, shape])

  return <canvas ref={canvasRef} className={`shared-hexgrid-canvas ${className}`.trim()} />
}

export default ShapeGrid
