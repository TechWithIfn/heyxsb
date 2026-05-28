import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useShortcuts } from '../context/ShortcutsContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { navbarDrop } from '../lib/motion'
import { useTheme } from '../context/ThemeContext'
import { SearchBar } from './SearchBar'

const MAIN_LINKS = [
  { to: '/topics', label: 'Tutorials' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/progress', label: 'Progress' },
  { to: '/bookmarks', label: 'Bookmarks' },
]

const MORE_LINKS = [
  { to: '/references', label: 'References' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/about', label: 'About' },
  { to: '/changelog', label: "What's New" },
]

function BookIcon({ className }) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function SunIcon({ className }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }) {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SearchNavIcon({ className }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function MenuIcon({ className }) {
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
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
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

function HelpIcon({ className }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  )
}

function ChevronDownIcon({ className }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

const drawerLinkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
    isActive
      ? 'bg-[#04AA6D] text-white'
      : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`

function navLinkClass({ isActive }) {
  return `relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[#04AA6D] text-white'
      : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`
}

function NavLinkWithIndicator({ to, children }) {
  return (
    <NavLink to={to} className={navLinkClass}>
      {({ isActive }) => (
        <>
          <span className="relative z-[1] inline-flex items-center gap-1.5">
            {children}
          </span>
          {isActive && (
            <motion.span
              layoutId="navIndicator"
              className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#04AA6D] dark:bg-green-500"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

function moreDropdownLinkClass({ isActive }) {
  return `block w-full px-4 py-2.5 text-left text-sm transition-colors ${
    isActive
      ? 'bg-[#04AA6D] font-medium text-white'
      : 'text-white/85 hover:bg-[#163028] hover:text-white'
  }`
}

function MoreDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          open
            ? 'bg-[#04AA6D] text-white'
            : 'text-white/85 hover:bg-white/10 hover:text-white'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        id="nav-more-button"
      >
        More
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-labelledby="nav-more-button"
          className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] overflow-hidden rounded-lg border border-[#dddddd] bg-[#1a1a2a] py-1 shadow-lg"
        >
          {MORE_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              role="menuitem"
              className={moreDropdownLinkClass}
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const location = useLocation()
  const pathParts = location.pathname.split('/')
  const isSubjectLearnPage = pathParts[1] === 'ipu' && pathParts.length >= 5

  if (isSubjectLearnPage) {
    return null
  }

  const { isDark, toggleTheme } = useTheme()
  const { setSearchOpen, setHelpOpen } = useShortcuts()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTrapRef = useFocusTrap(drawerOpen)

  useEffect(() => {
    const close = () => setDrawerOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    if (drawerOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <motion.header
      className="no-print sticky top-0 z-30 border-b border-[#444444] bg-[#282A35] shadow-sm dark:bg-[#1a1a2a]"
      initial={navbarDrop.initial}
      animate={navbarDrop.animate}
      transition={navbarDrop.transition}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-2 sm:gap-4 lg:gap-6">
          <Link
            to="/"
            className="flex min-w-0 shrink-0 items-center gap-2 text-base font-bold text-white sm:text-xl"
            onClick={() => setDrawerOpen(false)}
            aria-label="LearnTheory home"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#04AA6D] text-white sm:h-9 sm:w-9"
              aria-hidden="true"
            >
              <BookIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="truncate text-slate-900 dark:text-white">
              LearnTheory
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {MAIN_LINKS.map(({ to, label }) => (
              <NavLinkWithIndicator key={to} to={to}>
                {label}
              </NavLinkWithIndicator>
            ))}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <NavLinkWithIndicator to="/ipu">
                <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
                IPU Syllabus
              </NavLinkWithIndicator>
            </motion.div>
            <MoreDropdown />
          </nav>

          <div className="hidden min-w-0 flex-1 justify-center md:flex lg:max-w-md lg:px-4">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {/* Search button removed per user request */}

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 sm:flex"
              aria-label="Keyboard shortcuts (?)"
            >
              <HelpIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              aria-label={isDark ? 'Switch to light mode (Ctrl+D)' : 'Switch to dark mode (Ctrl+D)'}
            >
              <motion.span
                className="flex items-center justify-center"
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.span>
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 lg:hidden"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              {drawerOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 dark:bg-black/70 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={drawerOpen ? 0 : -1}
          onClick={() => setDrawerOpen(false)}
        />

        <div
          id="nav-drawer"
          ref={drawerTrapRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-[#dddddd] bg-[#282A35] shadow-2xl transition-transform duration-300 ease-out sm:max-w-sm ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          
        >
          <div className="flex h-14 items-center justify-between border-b border-[#444444] px-4">
            <span className="font-semibold text-white">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/85 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={drawerLinkClass}
                  onClick={() => setDrawerOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              {MAIN_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={drawerLinkClass}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/ipu"
                  className={drawerLinkClass}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 shrink-0" aria-hidden="true" />
                    IPU Syllabus
                  </span>
                </NavLink>
              </li>
              <li className="pt-2">
                <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  More
                </p>
              </li>
              {MORE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={drawerLinkClass}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/search"
                  className={drawerLinkClass}
                  onClick={() => setDrawerOpen(false)}
                >
                  Search
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="border-t border-[#444444] p-4">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false)
                setSearchOpen(true)
              }}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#04AA6D] bg-[#04AA6D] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#059862]"
              aria-label="Open search"
            >
              <SearchNavIcon className="h-4 w-4" />
              Open search
            </button>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">
              Quick search
            </p>
            <SearchBar />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
