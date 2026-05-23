import {
  motion,
  useAnimationControls,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

type HangingCardProps = {
  ropeWidth?: number
  ropeColor?: string
  ropeLength?: number
  bouncy?: number
  cardRadius?: number
  frontImage?: string
  fitMode?: 'cover' | 'contain'
  imageScale?: number
  desktopBreakpoint?: number
  desktopScale?: number
  tabletScale?: number
  mobileScale?: number
  style?: CSSProperties
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function HangingCard({
  ropeWidth = 4,
  ropeColor = 'rgba(255, 255, 255, 0.28)',
  ropeLength = 110,
  bouncy = 55,
  cardRadius = 22,
  frontImage = '',
  fitMode = 'cover',
  imageScale = 1,
  desktopBreakpoint = 1440,
  desktopScale = 1,
  tabletScale = 0.82,
  mobileScale = 0.65,
  style,
}: HangingCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const controls = useAnimationControls()
  const cardRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const pointerOffsetRef = useRef({ x: 0, y: 0 })

  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [viewport, setViewport] = useState({ width: 1440, height: 900 })
  const [naturalSize, setNaturalSize] = useState({ width: 300, height: 430 })
  const [isDragging, setIsDragging] = useState(false)

  useMotionValueEvent(x, 'change', setDx)
  useMotionValueEvent(y, 'change', setDy)

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth || 1440,
        height: window.innerHeight || 900,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(() => {
    if (!frontImage) {
      return
    }

    const image = new Image()
    image.onload = () => {
      setNaturalSize({
        width: image.naturalWidth || 300,
        height: image.naturalHeight || 430,
      })
    }
    image.src = frontImage
  }, [frontImage])

  const responsiveScale = useMemo(() => {
    if (viewport.width <= 767) {
      return clamp(mobileScale, 0, 1)
    }

    if (viewport.width <= 1199) {
      return clamp(tabletScale, 0, 1)
    }

    if (viewport.width <= Math.max(1201, desktopBreakpoint)) {
      return clamp(desktopScale, 0, 1)
    }

    return 1
  }, [desktopBreakpoint, desktopScale, mobileScale, tabletScale, viewport.width])

  const effectiveRopeLength = Number(ropeLength) || 90
  const finalScale = clamp(imageScale, 0.1, 3) * responsiveScale
  const cardWidth = naturalSize.width * finalScale
  const cardHeight = naturalSize.height * finalScale
  const frameWidth = cardWidth
  const frameHeight = effectiveRopeLength + cardHeight

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) {
      return
    }

    draggingRef.current = true
    setIsDragging(true)
    controls.stop()

    const rect = cardRef.current.getBoundingClientRect()
    pointerOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !cardRef.current) {
      return
    }

    const parentRect = cardRef.current.parentElement?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    }

    x.set(event.clientX - parentRect.left - pointerOffsetRef.current.x)
    y.set(event.clientY - parentRect.top - pointerOffsetRef.current.y - effectiveRopeLength)
  }

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)

    const bounce = clamp(bouncy, 0, 100)

    controls.start({
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 180 + bounce * 4,
        damping: Math.max(10, 32 - bounce * 0.18),
        mass: 0.9 + (100 - bounce) * 0.002,
      },
    })
  }

  const autoSwing = useMemo(() => {
    const safeRange = Math.max(viewport.width * 0.28, 1)
    return clamp(dx / safeRange, -1, 1) * 12
  }, [dx, viewport.width])

  const ropeOverflowX = viewport.width + ropeWidth * 10
  const ropeOverflowY = viewport.height + ropeWidth * 10
  const x0 = frameWidth / 2
  const y0 = 0
  const x1 = x0 + dx
  const y1 = effectiveRopeLength + dy
  const distance = Math.hypot(x1 - x0, y1 - y0)
  const sag = Math.min(260, distance * 0.35 + effectiveRopeLength * 0.25)
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2 + sag
  const path = `M ${x0 + ropeOverflowX} ${y0 + ropeOverflowY} Q ${
    cx + ropeOverflowX
  } ${cy + ropeOverflowY} ${x1 + ropeOverflowX} ${y1 + ropeOverflowY}`

  return (
    <div
      className="hanging-card"
      style={{
        width: frameWidth,
        height: frameHeight,
        ...style,
      }}
    >
      <svg
        className="hanging-card__rope"
        width={frameWidth + ropeOverflowX * 2}
        height={frameHeight + ropeOverflowY * 2}
        viewBox={`0 0 ${frameWidth + ropeOverflowX * 2} ${frameHeight + ropeOverflowY * 2}`}
        style={{
          left: -ropeOverflowX,
          top: -ropeOverflowY,
        }}
      >
        <path
          d={path}
          fill="none"
          stroke={ropeColor}
          strokeLinecap="round"
          strokeWidth={ropeWidth}
        />
      </svg>

      <motion.div
        ref={cardRef}
        animate={controls}
        className="hanging-card__body"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        style={{
          x,
          y,
          rotate: autoSwing,
          top: effectiveRopeLength,
          width: cardWidth,
          height: cardHeight,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div
          className="hanging-card__frame"
          style={{
            borderRadius: cardRadius,
          }}
        >
          {frontImage ? (
            <img
              alt=""
              draggable={false}
              src={frontImage}
              style={{
                objectFit: fitMode,
              }}
            />
          ) : (
            <div className="hanging-card__placeholder">
              <span>Hanging Card</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HangingCard
