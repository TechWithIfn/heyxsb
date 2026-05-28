import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { KeyboardShortcuts } from '../components/KeyboardShortcuts'
import { SearchOverlay } from '../components/SearchOverlay'
import { useKeyboard } from '../hooks/useKeyboard'
import { useTheme } from './ThemeContext'

const ShortcutsContext = createContext(null)

export function ShortcutsProvider({ children }) {
  const { toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const lessonHandlersRef = useRef(null)

  const registerLessonShortcuts = useCallback((handlers) => {
    lessonHandlersRef.current = handlers ?? null
    return () => {
      if (lessonHandlersRef.current === handlers) {
        lessonHandlersRef.current = null
      }
    }
  }, [])

  useKeyboard({
    searchOpen,
    helpOpen,
    setSearchOpen,
    setHelpOpen,
    toggleTheme,
    lessonHandlersRef,
  })

  const value = useMemo(
    () => ({
      searchOpen,
      setSearchOpen,
      helpOpen,
      setHelpOpen,
      registerLessonShortcuts,
    }),
    [searchOpen, helpOpen, registerLessonShortcuts],
  )

  return (
    <ShortcutsContext.Provider value={value}>
      {children}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <KeyboardShortcuts
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </ShortcutsContext.Provider>
  )
}

export function useShortcuts() {
  const ctx = useContext(ShortcutsContext)
  if (!ctx) {
    throw new Error('useShortcuts must be used within ShortcutsProvider')
  }
  return ctx
}
