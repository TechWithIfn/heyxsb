import { useEffect, useRef } from 'react'
import { getFocusableElements, handleFocusTrap } from '../lib/a11y'

/**
 * Trap Tab focus inside a modal/overlay and restore focus on close.
 * @param {boolean} active
 */
export function useFocusTrap(active) {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!active) return

    previousFocusRef.current = document.activeElement

    const container = containerRef.current
    const focusable = getFocusableElements(container)
    const target = focusable[0] ?? container
    target?.focus?.()

    const onKeyDown = (event) => {
      if (containerRef.current) {
        handleFocusTrap(containerRef.current, event)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      const prev = previousFocusRef.current
      if (prev instanceof HTMLElement && document.contains(prev)) {
        prev.focus()
      }
    }
  }, [active])

  return containerRef
}
