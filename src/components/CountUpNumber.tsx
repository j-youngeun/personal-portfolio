import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

type CountUpNumberProps = {
  from?: number
  to: number
  duration?: number
  delay?: number
}

function CountUpNumber({ from = 0, to, duration = 2, delay = 0 }: CountUpNumberProps) {
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const hasAnimated = useRef(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          setTimeout(() => {
            count.set(to, {
              type: 'tween',
              duration,
              ease: 'easeOut',
            })
          }, delay * 1000)

          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [count, to, duration, delay])

  return <motion.span ref={elementRef}>{rounded}</motion.span>
}

export default CountUpNumber
