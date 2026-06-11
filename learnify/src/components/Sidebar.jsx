import { memo, useEffect, useMemo, useState } from 'react'
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

function SearchIcon({ className }) {
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

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase()
}

function SidebarInner({
  topicSlug,
  currentLessonId,
  lessons,
  sections,
  heading = 'Tutorial',
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState({})
  const mobileDrawerRef = useFocusTrap(mobileOpen)
  const groups = normalizeSections({ lessons, sections, heading })
  const filteredGroups = useMemo(() => {
    const search = normalizeText(query)
    if (!search) return groups

    return groups
      .map((section) => {
        const matchesHeading = normalizeText(section.heading).includes(search)
        const lessonsInSection = section.lessons.filter((lesson) =>
          normalizeText(lesson.title).includes(search),
        )

        if (!matchesHeading && lessonsInSection.length === 0) {
          return null
        }

        return {
          ...section,
          lessons: matchesHeading ? section.lessons : lessonsInSection,
        }
      })
      .filter(Boolean)
  }, [groups, query])

  useEffect(() => {
    setMobileOpen(false)
  }, [currentLessonId])

  useEffect(() => {
    setCollapsedSections({})
  }, [topicSlug])

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

  const toggleSection = (sectionHeading) => {
    setCollapsedSections((current) => ({
      ...current,
      [sectionHeading]: !current[sectionHeading],
    }))
  }

  const sidebarContent = (
    <>
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/95 px-3 pb-3 pt-2 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#04AA6D] dark:text-green-400">
              Course map
            </p>
            <h2 className="mt-1 text-base font-black text-slate-900 dark:text-white">
              Lessons
            </h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {filteredGroups.reduce((count, section) => count + section.lessons.length, 0)}
          </span>
        </div>

        <label className="mt-3 block">
          <span className="sr-only">Search topics</span>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm transition focus:border-[#04AA6D] focus:outline-none focus:ring-4 focus:ring-[#04AA6D]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </label>
      </div>

      <div className="space-y-4 px-2 py-3">
        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
            No lessons match “{query}”.
          </div>
        ) : (
          filteredGroups.map((section, sectionIndex) => {
            const key = section.heading ?? `section-${sectionIndex}`
            const isCollapsed = Boolean(collapsedSections[key])

            return (
              <section key={key} className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left"
                  aria-expanded={!isCollapsed}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {section.heading ?? heading}
                  </span>
                  <ChevronDownIcon
                    className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>

                {!isCollapsed && (
                  <ul className="space-y-1 px-2 pb-2">
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
                            <span className="min-w-0 flex-1 break-words whitespace-normal leading-snug">
                              {lesson.title}
                            </span>
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
                )}
              </section>
            )
          })
        )}
      </div>
    </>
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
          className={`absolute left-0 top-0 flex h-full w-full max-w-xs flex-col border-r border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 sm:max-w-[20rem] ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Lessons</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{sidebarContent}</div>
        </aside>
      </div>

      {/* Desktop: always-visible sidebar (sticky, independent scroll) */}
      <aside className="hidden w-[320px] min-w-[320px] max-w-[320px] shrink-0 border-r border-slate-100 bg-slate-50/30 px-2 dark:border-slate-800/80 dark:bg-slate-950/20 lg:block lg:sticky lg-sticky-top lg-sticky-h lg:overflow-y-auto lg:overscroll-contain">
        {sidebarContent}
      </aside>
    </>
  )
}

export const Sidebar = memo(SidebarInner)

