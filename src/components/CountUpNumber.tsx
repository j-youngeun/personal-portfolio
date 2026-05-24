import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

/** shadcn progress-text style ease-out */
const PROGRESS_TEXT_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]

type CountUpNumberProps = {
  to: number
  start: boolean
  duration?: number
  delay?: number
}

function CountUpNumber({ to, start, duration = 1.85, delay = 0 }: CountUpNumberProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let resetFrame: number | undefined

    if (!start) {
      resetFrame = window.requestAnimationFrame(() => {
        setDisplay(0)
      })

      return () => {
        if (resetFrame) window.cancelAnimationFrame(resetFrame)
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resetFrame = window.requestAnimationFrame(() => {
        setDisplay(to)
      })

      return () => {
        if (resetFrame) window.cancelAnimationFrame(resetFrame)
      }
    }

    let active = true
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let controls: { stop: () => void } | undefined

    const run = () => {
      controls = animate(0, to, {
        duration,
        ease: PROGRESS_TEXT_EASE,
        onUpdate: (latest) => {
          if (active) {
            setDisplay(Math.round(latest))
          }
        },
      })
    }

    if (delay > 0) {
      timeoutId = window.setTimeout(run, delay * 1000)
    } else {
      run()
    }

    return () => {
      active = false
      if (timeoutId) window.clearTimeout(timeoutId)
      controls?.stop()
    }
  }, [start, to, duration, delay])

  return <span className="count-up-number">{display}</span>
}

export default CountUpNumber
