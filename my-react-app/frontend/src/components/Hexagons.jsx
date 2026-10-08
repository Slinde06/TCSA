import './Hexagons.css'

// shell shapes (filled hexagon + outline behind it)
const SCUTE =
  'M30 8 L72 6 Q79 6 82 12 L97 45 Q99 50 96 55 L79 88 Q76 94 69 94 L27 95 Q20 95 17 89 L3 56 Q1 50 4 45 L22 12 Q25 8 30 8Z'

export function Scute({ size = 100, x = 0, y = 0, rotate = 0, color = 'var(--hex-green)', outline, style }) {
  return (
    <svg
      className="shared-hexagon"
      width={size}
      height={size}
      viewBox="-12 -12 124 124"
      style={{ left: x, top: y, transform: `rotate(${rotate}deg)`, ...style }}
      aria-hidden="true"
    >
      <path
        d={SCUTE}
        fill="none"
        stroke={outline ?? color}
        strokeOpacity="0.45"
        strokeWidth="4"
        transform="translate(12 -6) scale(1.02)"
      />
      <path d={SCUTE} fill={color} />
    </svg>
  )
}

function Hexagons({ items, color, outline, className = '' }) {
  return (
    <div className={`shared-hexagons ${className}`.trim()} aria-hidden="true">
      {items.map((item, i) => (
        <Scute key={i} color={color} outline={outline} {...item} />
      ))}
    </div>
  )
}

export default Hexagons
