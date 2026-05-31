import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { IPUBreadcrumb } from '../../components/IPU/IPUBreadcrumb'
import { TopicSidebar } from '../../components/IPU/TopicSidebar'
import AppliedChemistrySidebar from '../../components/IPU/AppliedChemistrySidebar'
import { TopicContent } from '../../components/IPU/TopicContent'
import { getBranch } from '../../data/ipuData.js'
import { getEnglishName } from '../../ipu/utils/translate'
import { getAllTopicIds } from '../../lib/ipuSubjectStorage'
import { useIpuSubjectStorage } from '../../hooks/useIpuSubjectStorage'

function ProgressPill({ readCount, totalTopics }) {
  return (
    <motion.div
      layout
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-100"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <motion.span layout="position" className="whitespace-nowrap">
        {readCount} of {totalTopics} topics read
      </motion.span>
    </motion.div>
  )
}

function SubjectNotFound({ branch, semNum, subjectId }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-lg px-4 py-14 outline-none sm:px-6"
    >
      <IPUBreadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'IPU Syllabus', to: '/ipu-syllabus' },
          { label: getEnglishName(branch), to: `/ipu-syllabus/${branch.id}` },
          { label: `Semester ${semNum}`, to: `/ipu-syllabus/${branch.id}/semester/${semNum}` },
          { label: 'Subject not found' },
        ]}
      />
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-800/50">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Subject not found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          No subject matching <span className="font-mono">{subjectId}</span> exists in
          Semester {semNum} of {branch.shortName}.
        </p>
        <Link
          to={`/ipu-syllabus/${branch.id}/semester/${semNum}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to subjects
        </Link>
      </div>
    </main>
  )
}

export function SubjectPage() {
  const { branchId, semNum, subjectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef(null)
  const [activeTopic, setActiveTopic] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const branch = getBranch(branchId)
  const semNumber = Number(semNum)
  const semester = branch?.semesters.find((s) => s.semNumber === semNumber)
  const subject = semester?.subjects.find((s) => s.id === subjectId)

  const totalTopics = useMemo(
    () => (subject ? getAllTopicIds(subject).length : 0),
    [subject],
  )

  const storage = useIpuSubjectStorage(
    branchId,
    semNum,
    subjectId,
    totalTopics,
  )

  const stats = useMemo(() => {
    if (!subject) return { units: 0, topics: 0 }
    const units = subject.units.length
    const topics = subject.units.reduce((n, u) => n + u.topics.length, 0)
    return { units, topics }
  }, [subject])

  const scrollToTopic = useCallback((topicId) => {
    const el = document.getElementById(topicId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setDrawerOpen(false)
  }, [])

  useEffect(() => {
    if (!branch) {
      navigate('/ipu-syllabus', { replace: true })
      return
    }
    if (!semester) {
      navigate(`/ipu-syllabus/${branchId}`, { replace: true })
    }
  }, [branch, semester, branchId, navigate])

  useEffect(() => {
    const root = contentRef.current
    if (!root || !subject || totalTopics === 0) return

    const sections = root.querySelectorAll('[data-ipu-topic]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-ipu-topic')
          if (id) setActiveTopic(id)
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -45% 0px',
        threshold: 0.5,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [subject, totalTopics])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (!hash || !subject) return
    const t = window.setTimeout(() => scrollToTopic(hash), 450)
    return () => window.clearTimeout(t)
  }, [location.hash, subject, scrollToTopic])

  if (!branch || !semester) {
    return null
  }

  if (!subject) {
    return (
      <SubjectNotFound branch={branch} semNum={semNumber} subjectId={subjectId} />
    )
  }

  const sidebarProps = {
    subject,
    activeTopic,
    progress: storage.progress,
    readTopics: storage.readTopics,
    bookmarks: storage.bookmarks,
    onTopicSelect: scrollToTopic,
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full max-w-[100vw] overflow-x-hidden">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[360px] shrink-0 overflow-hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-gray-900 md:block">
        {subject.id === 'applied-chemistry' ? (
          <AppliedChemistrySidebar
            subject={subject}
            currentTopic={activeTopic}
            onSelect={(id) => scrollToTopic(id)}
            readCount={storage.readCount}
            totalTopics={totalTopics}
          />
        ) : (
          <TopicSidebar {...sidebarProps} />
        )}
      </aside>

      <div
        ref={contentRef}
        id="main-content"
        tabIndex={-1}
        className="min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain outline-none"
      >
        <div className="mx-auto max-w-4xl break-words px-4 py-8 sm:px-8 sm:py-10">
          <TopicContent
            branch={branch}
            semNum={semNum}
            subject={subject}
            readTopics={storage.readTopics}
            totalTopics={totalTopics}
            totalTopicCount={stats.topics}
            unitCount={stats.units}
          />
        </div>
      </div>

      {totalTopics > 0 && (
        <ProgressPill readCount={storage.readCount} totalTopics={totalTopics} />
      )}

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-700 text-white shadow-lg hover:bg-green-800 md:hidden dark:bg-green-600 dark:hover:bg-green-500"
        aria-label="Open topic menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] md:hidden"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 flex h-full w-[min(100vw,360px)] max-w-[100vw] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl md:hidden dark:border-slate-700 dark:bg-gray-900"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Topic navigation"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="min-w-0 whitespace-normal break-words font-semibold text-slate-900 dark:text-white">
                  Topics
                </span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                {subject.id === 'applied-chemistry' ? (
                  <AppliedChemistrySidebar
                    subject={subject}
                    currentTopic={activeTopic}
                    onSelect={(id) => { scrollToTopic(id); setDrawerOpen(false) }}
                    readCount={storage.readCount}
                    totalTopics={totalTopics}
                  />
                ) : (
                  <TopicSidebar {...sidebarProps} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
