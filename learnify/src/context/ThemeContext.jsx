import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

const STORAGE_KEY = 'learn-theory-theme'

const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* private browsing or blocked storage */
  }
  return 'light'
}

/** Apply .dark on <html> — Tailwind darkMode: 'class' reads this ancestor */
function applyThemeToDocument(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)

  useLayoutEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    applyThemeToDocument(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore write errors */
    }
  }, [theme])

  const setTheme = (next) => {
    setThemeState(next === 'dark' ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
