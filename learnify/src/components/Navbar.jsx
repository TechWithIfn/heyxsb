import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BarChart3,
  Bookmark,
  BookOpen,
  GraduationCap,
  Info,
  RefreshCcw,
  Sparkles,
} from 'lucide-react'
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

const MORE_SECTIONS = [
  {
    title: 'Resources',
    items: [
      {
        to: '/references',
        label: 'References',
        description: 'Quick reference material',
        icon: BookOpen,
      },
      {
        to: '/quiz',
        label: 'Quiz',
        description: 'Practice and revision',
        icon: Sparkles,
      },
    ],
  },
  {
    title: 'Explore',
    items: [
      {
        to: '/analytics',
        label: 'Analytics',
        description: 'Learning trends and activity',
        icon: BarChart3,
      },
      {
        to: '/bookmarks',
        label: 'Bookmarks',
        description: 'Saved lessons and topics',
        icon: Bookmark,
      },
    ],
  },
  {
    title: 'Updates',
    items: [
      {
        to: '/changelog',
        label: "What's New",
        description: 'Latest changes and releases',
        icon: RefreshCcw,
      },
      {
        to: '/about',
        label: 'About',
        description: 'Project info and purpose',
        icon: Info,
      },
    ],
  },
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
  return `relative whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
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
        className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold transition-colors ${
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
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-labelledby="nav-more-button"
            className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95 p-2 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {MORE_SECTIONS.map((section) => (
                <div key={section.title} className="space-y-1.5">
                  <p className="px-2 pt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                    {section.title}
                  </p>
                  {section.items.map(({ to, label, description, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      role="menuitem"
                      className={({ isActive }) =>
                        `flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                          isActive
                            ? 'bg-[#04AA6D] text-white'
                            : 'text-white/85 hover:bg-white/10 hover:text-white'
                        }`
                      }
                      onClick={() => {
                        setOpen(false)
                        onNavigate?.()
                      }}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block whitespace-nowrap text-sm font-semibold">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-white/60">
                          {description}
                        </span>
                      </span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      className="no-print sticky top-0 z-30 border-b border-white/10 bg-[#1f2430]/95 shadow-[0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl dark:bg-[#111827]/95"
      initial={navbarDrop.initial}
      animate={navbarDrop.animate}
      transition={navbarDrop.transition}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center gap-4 overflow-hidden sm:gap-5 lg:gap-6 xl:gap-8">
          <Link
            to="/"
            className="flex min-w-0 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-1 py-1 text-base font-semibold text-white transition-opacity hover:opacity-90 sm:text-xl"
            onClick={() => setDrawerOpen(false)}
            aria-label="LearnTheory home"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#04AA6D] text-white shadow-lg shadow-emerald-500/20 sm:h-11 sm:w-11"
              aria-hidden="true"
            >
              <BookIcon className="h-5 w-5 sm:h-[1.15rem] sm:w-[1.15rem]" />
            </span>
            <span className="truncate font-extrabold tracking-tight text-white">
              LearnTheory
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-none items-center gap-2 overflow-hidden lg:flex xl:gap-3"
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

          <div className="hidden min-w-0 flex-[1_1_24rem] justify-center md:flex lg:max-w-[22rem] lg:px-3 xl:max-w-[26rem]">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            {/* Search button removed per user request */}

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/20 sm:flex"
              aria-label="Keyboard shortcuts (?)"
            >
              <HelpIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/20"
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:border-white/20 lg:hidden"
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
          className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-white/10 bg-[#1f2430] shadow-2xl transition-transform duration-300 ease-out sm:max-w-sm dark:bg-[#111827] ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <span className="text-base font-bold tracking-tight text-white">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/85 transition-all hover:bg-white/10 hover:text-white"
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
              {MORE_SECTIONS.flatMap((section) => section.items).map(({ to, label }) => (
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

          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false)
                setSearchOpen(true)
              }}
              className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#04AA6D] bg-[#04AA6D] px-4 text-sm font-semibold text-white transition-all hover:bg-[#059862]"
              aria-label="Open search"
            >
              <SearchNavIcon className="h-4 w-4" />
              Open search
            </button>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Quick search
            </p>
            <SearchBar />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
