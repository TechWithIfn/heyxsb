import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFocusTrap } from '../hooks/useFocusTrap'

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    items: [
      { keys: ['←', 'H'], description: 'Previous lesson' },
      { keys: ['→', 'L'], description: 'Next lesson' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { keys: ['Ctrl', 'K'], description: 'Open search' },
      { keys: ['Ctrl', 'D'], description: 'Toggle dark mode' },
      { keys: ['Ctrl', 'B'], description: 'Bookmark current lesson' },
      { keys: ['?'], description: 'Show this help' },
      { keys: ['Esc'], description: 'Close search or this dialog' },
    ],
  },
]

function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
      {children}
    </kbd>
  )
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function KeyboardShortcuts({ open, onClose }) {
  const panelRef = useFocusTrap(open)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-black/75"
            aria-label="Close keyboard shortcuts"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-shortcuts-title"
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-slate-200 bg-[#04AA6D] px-5 py-4 dark:border-green-900 dark:bg-green-800">
              <h2
                id="keyboard-shortcuts-title"
                className="text-lg font-bold text-white"
              >
                Keyboard shortcuts
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
                aria-label="Close keyboard shortcuts"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </header>

            <div className="max-h-[min(70vh,28rem)] overflow-y-auto px-5 py-5">
              {SHORTCUT_GROUPS.map((group) => (
                <section key={group.title} className="mb-6 last:mb-0">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#04AA6D] dark:text-green-400">
                    {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item.description}
                        className="flex flex-wrap items-center justify-between gap-3"
                      >
                        <span className="text-sm text-slate-700 dark:text-slate-200">
                          {item.description}
                        </span>
                        <span className="flex flex-wrap items-center gap-1">
                          {item.keys.map((key, i) => (
                            <span key={`${item.description}-${key}`} className="flex items-center gap-1">
                              {i > 0 && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  +
                                </span>
                              )}
                              <Kbd>{key}</Kbd>
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <footer className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
              Press <Kbd>?</Kbd> anytime to open this panel. Lesson shortcuts work
              on lesson pages only.
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
