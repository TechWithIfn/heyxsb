import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Calendar, Edit3, X, Search } from 'lucide-react'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import IPULearnLayout from '../layout/IPULearnLayout'
import IPUSidebar from '../layout/IPUSidebar'
import IPUTopBar from '../layout/IPUTopBar'
import TopicRenderer from '../components/TopicRenderer'
import PersonalNotes from '../components/PersonalNotes'
import IPUSearchOverlay from '../components/IPUSearchOverlay'
import { useSubjectData } from '../hooks/useSubjectData'
import { getBranchMeta, recordRecentSubjectVisit } from '../utils/navigationData'
import { getEnglishName } from '../utils/translate'
import { useTheme } from '../../context/ThemeContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { getCompletedTopicIds, getTopicProgress } from '../hooks/useIPUProgress'


function ContentComingSoon({ branchId, semNumber, subjectId }) {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        Content coming soon
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        This subject is not available yet.
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
        We could not find learning content for {branchId?.toUpperCase()} semester {semNumber} subject{' '}
        {subjectId}. Please check back later or continue browsing the syllabus.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/ipu"
          className="rounded-lg bg-[#04a04a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#048b3f]"
        >
          Browse syllabus
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Home
        </Link>
      </div>
    </main>
  )
}

function SectionModal({ open, title, description, onClose, children, className = '' }) {
  const panelRef = useFocusTrap(open)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/70 px-3 py-6 backdrop-blur-sm sm:px-6 sm:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative flex h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 ${className}`}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
                  Subject tools
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SubjectLearnPage() {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const { branchId, sem, subjectId, topicId } = useParams()
  const semNumber = useMemo(() => Number.parseInt(sem, 10), [sem])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [expectedSearch, setExpectedSearch] = useState('')
  const [previousSearch, setPreviousSearch] = useState('')
  const [notesTopicId, setNotesTopicId] = useState('')
  const [progressVersion, setProgressVersion] = useState(0)

  const {
    subject,
    loading,
    error,
    activeUnit,
    activeTopic,
    setActiveTopic,
    allTopicsFlat,
    prevTopic,
    nextTopic,
  } = useSubjectData(branchId, semNumber, subjectId, topicId)

  const branch = getBranchMeta(branchId)
  const selectedNotesTopicId = notesTopicId || activeTopic?.topicId || allTopicsFlat[0]?.topicId || ''

  const modalTopics = useMemo(
    () =>
      allTopicsFlat.map((topic) => ({
        id: topic.topicId,
        title: topic.title,
        unitTitle: topic.unitTitle,
        unitNumber: topic.unitNumber,
        expected: Array.isArray(topic.content?.examQuestions) ? topic.content.examQuestions : [],
        previous: Array.isArray(topic.content?.pyqs) ? topic.content.pyqs : [],
      })),
    [allTopicsFlat],
  )

  useEffect(() => {
    if (!activeSection) {
      return
    }

    if (activeSection === 'notes') {
      setNotesTopicId((current) => current || activeTopic?.topicId || allTopicsFlat[0]?.topicId || '')
    }
  }, [activeSection, activeTopic?.topicId, allTopicsFlat])

  const openExpectedQuestions = () => setActiveSection('expected')
  const openPreviousYearQuestions = () => setActiveSection('previous')
  const openNotes = () => setActiveSection('notes')
  const closeSection = () => setActiveSection(null)

  useEffect(() => {
    if (!activeTopic?.topicId) {
      return
    }

    const currentTopicId = String(topicId ?? '')
    if (currentTopicId === activeTopic.topicId) {
      return
    }

    navigate(`/ipu/${branchId}/${sem}/${subjectId}/${activeTopic.topicId}`, {
      replace: true,
    })
  }, [activeTopic?.topicId, branchId, navigate, sem, subjectId, topicId])

  useEffect(() => {
    if (!activeTopic?.topicId) {
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTopic?.topicId])

  useEffect(() => {
    if (!branch || !subject) {
      return
    }

    recordRecentSubjectVisit({
      branchId: branch.id,
      branchName: getEnglishName(branch),
      branchShortName: branch.shortName,
      semNumber,
      subjectId: subject.id,
      subjectName: getEnglishName(subject),
      subjectCode: subject.subjectCode ?? subject.code,
      unitId: activeUnit?.unitId,
      unitTitle: activeUnit?.title ?? activeUnit?.unitTitle,
      topicId: activeTopic?.topicId,
      topicTitle: activeTopic?.title,
    })
  }, [activeTopic?.topicId, activeTopic?.title, activeUnit?.unitId, activeUnit?.title, branch, semNumber, subject])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const refresh = () => setProgressVersion((current) => current + 1)
    window.addEventListener('learnify-ipu-progress-updated', refresh)
    return () => window.removeEventListener('learnify-ipu-progress-updated', refresh)
  }, [])

  const handleTopicSelect = (_, nextTopicId) => {
    setActiveTopic(nextTopicId)
  }

  const topicProgress = useMemo(() => {
    if (!branchId || !semNumber || !subject?.id) {
      return { done: 0, total: 0, percent: 0, unitBreakdown: [] }
    }

    return getTopicProgress(branchId, semNumber, subject.id)
  }, [branchId, semNumber, subject?.id, progressVersion])

  const completedTopicIds = useMemo(() => {
    if (!branchId || !semNumber || !subject?.id) {
      return new Set()
    }

    return getCompletedTopicIds(branchId, semNumber, subject.id)
  }, [branchId, semNumber, subject?.id, progressVersion])

  const filteredExpectedTopics = useMemo(() => {
    const needle = expectedSearch.trim().toLowerCase()
    if (!needle) {
      return modalTopics
    }

    return modalTopics.filter((topic) => {
      const questionText = topic.expected.join(' ').toLowerCase()
      return [topic.title, topic.unitTitle, questionText].some((value) => String(value).toLowerCase().includes(needle))
    })
  }, [expectedSearch, modalTopics])

  const filteredPreviousTopics = useMemo(() => {
    const needle = previousSearch.trim().toLowerCase()
    if (!needle) {
      return modalTopics
    }

    return modalTopics.filter((topic) => {
      const questionText = topic.previous.join(' ').toLowerCase()
      return [topic.title, topic.unitTitle, questionText].some((value) => String(value).toLowerCase().includes(needle))
    })
  }, [modalTopics, previousSearch])

  const expectedUnits = useMemo(() => {
    const units = new Map()
    filteredExpectedTopics.forEach((topic) => {
      const unitKey = `${topic.unitNumber}-${topic.unitTitle}`
      if (!units.has(unitKey)) {
        units.set(unitKey, {
          unitNumber: topic.unitNumber,
          unitTitle: topic.unitTitle,
          topics: [],
        })
      }
      units.get(unitKey).topics.push(topic)
    })
    return Array.from(units.values())
  }, [filteredExpectedTopics])

  const previousUnits = useMemo(() => {
    const units = new Map()
    filteredPreviousTopics.forEach((topic) => {
      const unitKey = `${topic.unitNumber}-${topic.unitTitle}`
      if (!units.has(unitKey)) {
        units.set(unitKey, {
          unitNumber: topic.unitNumber,
          unitTitle: topic.unitTitle,
          topics: [],
        })
      }
      units.get(unitKey).topics.push(topic)
    })
    return Array.from(units.values())
  }, [filteredPreviousTopics])

  const downloadMarkdown = (filename, sections) => {
    const content = sections.join('\n')
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <LoadingSkeleton variant="lesson" />
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-100">
          <h1 className="text-2xl font-bold">Unable to load content</h1>
          <p className="mt-3 text-sm leading-6">{error}</p>
        </div>
      </main>
    )
  }

  if (!subject) {
    return <ContentComingSoon branchId={branchId} semNumber={semNumber} subjectId={subjectId} />
  }

  return (
    <>
      <IPULearnLayout
        topbar={
          <IPUTopBar
            branchId={branchId}
            sem={semNumber}
            subject={subject}
            progressPercent={topicProgress.percent}
            onToggleDark={toggleTheme}
            onSearch={() => setSearchOpen(true)}
            onProgressClick={() => setActiveSection('progress')}
            onExpectedQuestions={openExpectedQuestions}
            onPreviousYearQuestions={openPreviousYearQuestions}
            onNotes={openNotes}
          />
        }
        sidebar={
          <IPUSidebar
            subject={subject}
            activeUnit={activeUnit}
            activeTopic={activeTopic?.topicId ?? null}
            onTopicSelect={handleTopicSelect}
            sidebarOpen={sidebarOpen}
            onClose={() => setSidebarOpen((value) => !value)}
            visitedTopics={completedTopicIds}
            branchId={branchId}
            semNumber={semNumber}
          />
        }
      >
        {activeTopic && activeTopic.topicId ? (
          <TopicRenderer
            topic={activeTopic}
            topicIndex={activeTopic?.topicIndex ?? 0}
            totalTopics={allTopicsFlat.length || 1}
            onPrev={() => prevTopic && setActiveTopic(prevTopic.topicId)}
            onNext={() => nextTopic && setActiveTopic(nextTopic.topicId)}
            subject={subject}
            branchId={branchId}
            semNumber={semNumber}
          />
        ) : allTopicsFlat.length === 0 ? (
          <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
            <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Content coming soon
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              No topic content available yet
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
              We are preparing unit and topic theory for this subject.
            </p>
          </main>
        ) : (
          <main className="mx-auto flex min-h-[30vh] max-w-2xl items-center justify-center px-4 py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Opening topic...</p>
          </main>
        )}
      </IPULearnLayout>
      {searchOpen && (
        <IPUSearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onOpenTopic={(path) => navigate(path)}
        />
      )}

      <SectionModal
        open={activeSection === 'progress'}
        title="Reading Progress"
        description="Auto-tracked completion as you read to the end of each topic."
        onClose={closeSection}
        className="max-w-3xl"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Completed</p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{topicProgress.done}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Total Topics</p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{topicProgress.total}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Progress</p>
            <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{topicProgress.percent}%</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {topicProgress.unitBreakdown.map((unit, index) => {
            const unitPercent = unit.total > 0 ? Math.round((unit.done / unit.total) * 100) : 0
            return (
              <div key={unit.unitId} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-white">Unit {index + 1}</p>
                  <p className="text-slate-600 dark:text-slate-300">{unit.done}/{unit.total}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${unitPercent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </SectionModal>

      <SectionModal
        open={activeSection === 'expected'}
        title="Expected Exam Questions"
        description="Important theory, frequently asked, and unit-wise questions for revision."
        onClose={closeSection}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={expectedSearch}
              onChange={(event) => setExpectedSearch(event.target.value)}
              placeholder="Search expected questions..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const lines = expectedUnits.flatMap((unit) => [
                `## ${unit.unitTitle}`,
                ...unit.topics.flatMap((topic) => [
                  `### ${topic.title}`,
                  ...(topic.expected.length ? topic.expected.map((question, index) => `${index + 1}. ${question}`) : ['No questions listed.']),
                  '',
                ]),
              ])
              downloadMarkdown(`${getEnglishName(subject)}-expected-questions.md`, lines)
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <FileText className="h-4 w-4" />
            Download
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {expectedUnits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              No expected questions found for the current filter.
            </div>
          ) : (
            expectedUnits.map((unit) => (
              <details key={`${unit.unitNumber}-${unit.unitTitle}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60" open>
                <summary className="cursor-pointer list-none text-base font-bold text-slate-900 dark:text-white">
                  Unit {unit.unitNumber} · {unit.unitTitle}
                </summary>
                <div className="mt-4 space-y-4">
                  {unit.topics.map((topic) => (
                    <section key={topic.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        {topic.title}
                      </h3>
                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {topic.expected.length > 0 ? (
                          topic.expected.map((question, index) => <li key={index}>{question}</li>)
                        ) : (
                          <li className="list-none text-slate-500 dark:text-slate-400">No questions listed.</li>
                        )}
                      </ol>
                    </section>
                  ))}
                </div>
              </details>
            ))
          )}
        </div>
      </SectionModal>

      <SectionModal
        open={activeSection === 'previous'}
        title="Previous Year Questions"
        description="Semester-wise and topic-wise previous university questions with expand/collapse support."
        onClose={closeSection}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={previousSearch}
              onChange={(event) => setPreviousSearch(event.target.value)}
              placeholder="Search previous year questions..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              const lines = previousUnits.flatMap((unit) => [
                `## ${unit.unitTitle}`,
                ...unit.topics.flatMap((topic) => [
                  `### ${topic.title}`,
                  ...(topic.previous.length ? topic.previous.map((question, index) => `${index + 1}. ${question}`) : ['No previous year questions listed.']),
                  '',
                ]),
              ])
              downloadMarkdown(`${getEnglishName(subject)}-previous-year-questions.md`, lines)
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Calendar className="h-4 w-4" />
            Download
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {previousUnits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              No previous year questions found for the current filter.
            </div>
          ) : (
            previousUnits.map((unit) => (
              <details key={`${unit.unitNumber}-${unit.unitTitle}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60" open>
                <summary className="cursor-pointer list-none text-base font-bold text-slate-900 dark:text-white">
                  Unit {unit.unitNumber} · {unit.unitTitle}
                </summary>
                <div className="mt-4 space-y-4">
                  {unit.topics.map((topic) => (
                    <section key={topic.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                        {topic.title}
                      </h3>
                      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {topic.previous.length > 0 ? (
                          topic.previous.map((question, index) => <li key={index}>{question}</li>)
                        ) : (
                          <li className="list-none text-slate-500 dark:text-slate-400">No previous year questions listed.</li>
                        )}
                      </ol>
                    </section>
                  ))}
                </div>
              </details>
            ))
          )}
        </div>
      </SectionModal>

      <SectionModal
        open={activeSection === 'notes'}
        title="My Notes"
        description="Write, edit, preview, and save topic-wise notes for the current subject."
        onClose={closeSection}
        className="max-w-4xl"
      >
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="block w-full sm:max-w-md">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Topic
            </span>
            <select
              value={selectedNotesTopicId}
              onChange={(event) => setNotesTopicId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              {modalTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  Unit {topic.unitNumber} · {topic.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => navigate(`/ipu/my-notes?branch=${encodeURIComponent(branchId)}&sem=${encodeURIComponent(semNumber)}&subjectId=${encodeURIComponent(subject.id)}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <Edit3 className="h-4 w-4" />
            Open full notes page
          </button>
        </div>

        {selectedNotesTopicId ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
            <PersonalNotes
              branchId={branchId}
              sem={semNumber}
              subjectId={subject.id}
              topicId={selectedNotesTopicId}
              topicTitle={modalTopics.find((topic) => topic.id === selectedNotesTopicId)?.title}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            Select a topic to start writing notes.
          </div>
        )}
      </SectionModal>
    </>
  )
}