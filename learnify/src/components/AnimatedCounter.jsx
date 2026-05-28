import { useEffect, useMemo, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function AnimatedCounter({
  value = 0,
  duration = 700,
  decimals = 0,
  className = '',
  prefix = '',
  suffix = '',
}) {
  const target = Number.isFinite(Number(value)) ? Number(value) : 0
  const [current, setCurrent] = useState(target)
  const currentRef = useRef(target)

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    })
  }, [decimals])

  useEffect(() => {
    if (prefersReducedMotion() || duration <= 0) {
      setCurrent(target)
      currentRef.current = target
      return
    }

    let frame = 0
    let startTime = 0
    const startValue = currentRef.current
    const delta = target - startValue

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = startValue + delta * eased
      currentRef.current = nextValue
      setCurrent(nextValue)

      if (progress < 1) {
        frame = window.requestAnimationFrame(step)
      } else {
        currentRef.current = target
        setCurrent(target)
      }
    }

    frame = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frame)
  }, [target, duration])

  return (
    <span className={className}>
      {prefix}
      {formatter.format(current)}
      {suffix}
    </span>
  )
}
