import { useEffect } from 'react'
import { isEditableTarget, isShortcutHelpKey } from '../lib/a11y'

/**
 * Global keyboard shortcuts for LearnTheory.
 *
 * @param {object} options
 * @param {boolean} options.searchOpen
 * @param {boolean} options.helpOpen
 * @param {(open: boolean) => void} options.setSearchOpen
 * @param {(open: boolean) => void} options.setHelpOpen
 * @param {() => void} options.toggleTheme
 * @param {import('react').MutableRefObject<{
 *   goPrev?: () => void,
 *   goNext?: () => void,
 *   toggleBookmark?: () => void,
 *   hasPrev?: boolean,
 *   hasNext?: boolean,
 * } | null>} options.lessonHandlersRef
 */
export function useKeyboard({
  searchOpen,
  helpOpen,
  setSearchOpen,
  setHelpOpen,
  toggleTheme,
  lessonHandlersRef,
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      const mod = event.ctrlKey || event.metaKey
      const typing = isEditableTarget(event.target)

      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setHelpOpen(false)
        setSearchOpen(true)
        return
      }

      if (mod && event.key.toLowerCase() === 'd') {
        event.preventDefault()
        toggleTheme()
        return
      }

      if (mod && event.key.toLowerCase() === 'b') {
        const handlers = lessonHandlersRef.current
        if (handlers?.toggleBookmark) {
          event.preventDefault()
          handlers.toggleBookmark()
        }
        return
      }

      if (isShortcutHelpKey(event) && !typing) {
        event.preventDefault()
        setSearchOpen(false)
        setHelpOpen(true)
        return
      }

      if (event.key === 'Escape') {
        if (helpOpen) {
          event.preventDefault()
          setHelpOpen(false)
          return
        }
        if (searchOpen) {
          event.preventDefault()
          setSearchOpen(false)
        }
        return
      }

      if (typing || helpOpen || searchOpen) return

      const handlers = lessonHandlersRef.current
      if (!handlers) return

      const key = event.key

      if (key === 'ArrowLeft' || key === 'h' || key === 'H') {
        if (handlers.hasPrev && handlers.goPrev) {
          event.preventDefault()
          handlers.goPrev()
        }
        return
      }

      if (key === 'ArrowRight' || key === 'l' || key === 'L') {
        if (handlers.hasNext && handlers.goNext) {
          event.preventDefault()
          handlers.goNext()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [
    searchOpen,
    helpOpen,
    setSearchOpen,
    setHelpOpen,
    toggleTheme,
    lessonHandlersRef,
  ])
}
