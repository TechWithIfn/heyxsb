import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLessonComplete } from '../hooks/useProgress'
import { sidebarItem } from '../lib/motion'
import { lessonId as getLessonId } from '../lib/topics'

function PageIcon({ className }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
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

function lessonLinkClass(isActive) {
  return `group flex items-center gap-2 border-l-4 px-3 py-2.5 text-sm transition-all duration-200 ${
    isActive
      ? 'border-[#04AA6D] bg-[#04AA6D] font-semibold text-white shadow-sm dark:border-green-500 dark:bg-green-600'
      : 'border-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100'
  }`
}

function CompleteCheck({ topicSlug, lessonIdParam, isActive }) {
  const complete = useLessonComplete(topicSlug, lessonIdParam)
  if (!complete) return null
  return (
    <span
      className={`ml-auto shrink-0 text-sm font-bold ${
        isActive ? 'text-white' : 'text-[#04AA6D] dark:text-green-400'
      }`}
      aria-label="Completed"
      title="Completed"
    >
      ✓
    </span>
  )
}

function normalizeSections({ lessons, sections, heading }) {
  if (sections?.length) return sections
  if (lessons?.length) {
    return [{ heading: heading ?? 'Tutorial', lessons }]
  }
  return []
}

function SidebarInner({
  topicSlug,
  currentLessonId,
  lessons,
  sections,
  heading = 'Tutorial',
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileDrawerRef = useFocusTrap(mobileOpen)
  const groups = normalizeSections({ lessons, sections, heading })

  useEffect(() => {
    setMobileOpen(false)
  }, [currentLessonId])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  if (!topicSlug || groups.length === 0) return null

  let lessonIndex = 0

  const sidebarNav = (
    <motion.nav key={topicSlug} aria-label="Lesson navigation" className="py-2">
      {groups.map((section, sectionIndex) => (
        <div key={section.heading ?? sectionIndex} className="mb-4">
          <h2 className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {section.heading}
          </h2>
          <ul className="mt-1 space-y-0.5">
            {section.lessons.map((lesson) => {
              const id = getLessonId(lesson)
              const isActive = id === currentLessonId
              const index = lessonIndex++
              return (
                <motion.li
                  key={id}
                  custom={index}
                  variants={sidebarItem}
                  initial="hidden"
                  animate="show"
                >
                  <NavLink
                    to={`/${topicSlug}/${id}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={({ isActive: navActive }) =>
                      lessonLinkClass(navActive || isActive)
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <PageIcon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="min-w-0 flex-1 leading-snug">{lesson.title}</span>
                    <CompleteCheck
                      topicSlug={topicSlug}
                      lessonIdParam={id}
                      isActive={isActive}
                    />
                  </NavLink>
                </motion.li>
              )
            })}
          </ul>
        </div>
      ))}
    </motion.nav>
  )

  return (
    <>
      {/* Mobile / tablet: Menu opens lesson sidebar drawer */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#04AA6D] bg-[#04AA6D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#059862] hover:shadow active:scale-95 lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls="lesson-sidebar"
      >
        <MenuIcon className="h-5 w-5" />
        Menu
      </button>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 dark:bg-black/60"
          aria-label="Close lesson menu"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          id="lesson-sidebar"
          ref={mobileDrawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Lesson contents"
          className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col border-r border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 sm:max-w-[17rem] ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Lessons</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2">{sidebarNav}</div>
        </aside>
      </div>

      {/* Desktop: always-visible sidebar */}
      <aside className="hidden w-full shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50/30 lg:block lg:max-h-[calc(100vh-3.5rem)] lg:w-64 dark:border-slate-800/80 dark:bg-slate-950/20 px-2">
        {sidebarNav}
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarInner)

