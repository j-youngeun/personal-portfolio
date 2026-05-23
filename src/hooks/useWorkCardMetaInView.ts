import { useEffect, useState, type RefObject } from 'react'

const STICKY_TOP = 72

function isMetaVisibleEnough(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const visibleTop = Math.max(rect.top, STICKY_TOP)
  const visibleBottom = Math.min(rect.bottom, viewportHeight)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  const metaVisibleRatio = visibleHeight / Math.max(rect.height, 1)
  const viewportFill = visibleHeight / Math.max(viewportHeight - STICKY_TOP, 1)

  return metaVisibleRatio >= 0.4 && viewportFill >= 0.3 && visibleHeight > 8
}

function isMetaOpaqueEnough(element: HTMLElement) {
  const opacity = Number.parseFloat(window.getComputedStyle(element).opacity)
  return opacity >= 0.55
}

export function useWorkCardMetaInView(metaRef: RefObject<HTMLElement | null>) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const element = metaRef.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsReady(true)
      return
    }

    let triggered = false

    const trigger = () => {
      if (triggered) return
      triggered = true
      setIsReady(true)
    }

    const check = () => {
      if (triggered) return
      if (isMetaVisibleEnough(element) && isMetaOpaqueEnough(element)) {
        trigger()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        check()
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
        rootMargin: `-${STICKY_TOP}px 0px -12% 0px`,
      },
    )

    observer.observe(element)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    check()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [metaRef])

  return isReady
}
