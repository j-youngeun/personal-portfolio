import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

function canUseCustomCursor() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function CustomCursor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, {
    stiffness: 620,
    damping: 42,
    mass: 0.18,
  })
  const smoothY = useSpring(mouseY, {
    stiffness: 620,
    damping: 42,
    mass: 0.18,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')

    const syncCursorMode = () => {
      setIsEnabled(canUseCustomCursor())
    }

    syncCursorMode()
    mediaQuery.addEventListener('change', syncCursorMode)

    return () => {
      mediaQuery.removeEventListener('change', syncCursorMode)
    }
  }, [])

  useEffect(() => {
    if (!isEnabled) {
      document.body.classList.remove('custom-cursor-active')
      return
    }

    const moveCursor = (event: PointerEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setHasMoved(true)
    }

    const hideCursor = () => {
      setHasMoved(false)
    }

    document.body.classList.add('custom-cursor-active')
    window.addEventListener('pointermove', moveCursor)
    window.addEventListener('pointerleave', hideCursor)
    window.addEventListener('blur', hideCursor)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('pointermove', moveCursor)
      window.removeEventListener('pointerleave', hideCursor)
      window.removeEventListener('blur', hideCursor)
    }
  }, [isEnabled, mouseX, mouseY])

  if (!isEnabled) {
    return null
  }

  return (
    <div
      className="custom-cursor"
      aria-hidden="true"
      data-visible={hasMoved}
    >
      <motion.div className="custom-cursor__vertical" style={{ x: smoothX }} />
      <motion.div className="custom-cursor__horizontal" style={{ y: smoothY }} />
      <motion.div className="custom-cursor__dot-wrap" style={{ x: smoothX, y: smoothY }}>
        <span className="custom-cursor__dot" />
      </motion.div>
    </div>
  )
}

export default CustomCursor
