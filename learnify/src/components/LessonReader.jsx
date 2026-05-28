import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useShortcuts } from '../context/ShortcutsContext'
import { useToast } from '../context/ToastContext'
import { easeOut } from '../lib/motion'
import { toggleBookmark } from '../lib/bookmarks'
import { trackQuizResult } from '../lib/analytics'
import { setLessonComplete } from '../lib/progress'
import {
  prefersNativeShare,
  shareLessonNative,
} from '../lib/share'
import { useLessonBookmarked } from '../hooks/useBookmarks'
import { useLessonComplete } from '../hooks/useProgress'
import { lessonId as getLessonId } from '../lib/topics'
import { CodeBlock } from './CodeBlock'
import { AskAI } from './AskAI'
import { SummaryCard } from './SummaryCard'
import { ShareModal } from './ShareModal'
import { PageSeo } from './PageSeo'
import { buildLessonSeo } from '../lib/seo'

function BookmarkIcon({ className, filled }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function SparkleIcon({ className }) {
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
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  )
}

function ShareIcon({ className }) {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  )
}

function PrintIcon({ className }) {
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
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  )
}

function lessonId(lesson) {
  return lesson ? getLessonId(lesson) : null
}

function ChevronLeft({ className }) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ className }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

const sectionHeading =
  'mb-4 border-l-4 border-[#04AA6D] pl-3 text-xl font-bold text-slate-900 dark:border-green-500 dark:text-white sm:text-2xl print:border-slate-800 print:text-black'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export function LessonReader({ lesson, topic, prevLesson, nextLesson }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { registerLessonShortcuts } = useShortcuts()
  const [askAIOpen, setAskAIOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const topicSlug = topic?.slug ?? ''
  const topicTitle = topic?.title ?? 'Tutorial'
  const id = lesson ? lessonId(lesson) : ''
  const bookmarked = useLessonBookmarked(topicSlug, id)
  const complete = useLessonComplete(topicSlug, id)

  const handleBookmark = useCallback(() => {
    if (!lesson || !topicSlug || !id) return
    const added = toggleBookmark({
      topicSlug,
      topicTitle,
      lessonId: id,
      lessonTitle: lesson.title,
      subtitle: lesson.subtitle ?? '',
    })
    if (added) {
      toast('Bookmark saved', { type: 'success' })
    }
  }, [lesson, topicSlug, topicTitle, id, toast])

  const handleShare = useCallback(async () => {
    if (!lesson) return

    if (prefersNativeShare()) {
      try {
        await shareLessonNative({ lessonTitle: lesson.title })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }

    setShareOpen(true)
  }, [lesson])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  useEffect(() => {
    if (!lesson) {
      return registerLessonShortcuts(null)
    }

    const prevId = prevLesson ? lessonId(prevLesson) : null
    const nextId = nextLesson ? lessonId(nextLesson) : null

    return registerLessonShortcuts({
      hasPrev: Boolean(prevLesson),
      hasNext: Boolean(nextLesson),
      goPrev: () => {
        if (prevId) navigate(`/${topicSlug}/${prevId}`)
      },
      goNext: () => {
        if (nextId) navigate(`/${topicSlug}/${nextId}`)
      },
      toggleBookmark: handleBookmark,
    })
  }, [
    lesson,
    prevLesson,
    nextLesson,
    topicSlug,
    navigate,
    handleBookmark,
    registerLessonShortcuts,
  ])

  const handleQuizComplete = useCallback(
    ({ correct, total }) => {
      if (topicSlug && id && total) {
        trackQuizResult({
          topicSlug,
          lessonId: id,
          lessonTitle: lesson?.title,
          correct: correct ?? 0,
          total,
        })
      }
      toast('Quiz submitted', { type: 'success' })
    },
    [toast, topicSlug, id, lesson?.title],
  )

  if (!lesson) return null

  const theory = lesson.theory ?? ''

  const codeLanguage =
    lesson.codeExample?.language ?? topic?.slug ?? 'text'

  const handleCompleteToggle = (checked) => {
    if (!topicSlug || !id) return
    setLessonComplete(topicSlug, id, checked)
    if (checked) {
      toast('Lesson marked complete', { type: 'success' })
    }
  }

  const seo = buildLessonSeo({
    lesson,
    topicSlug,
    topicTitle,
    lessonId: id,
  })

  return (
    <article className="lesson-print-root w-full min-w-0 max-w-none lg:max-w-4xl">
      <PageSeo
        title={seo.fullTitle}
        description={seo.description}
        canonical={seo.canonical}
        keywords={seo.keywords}
        ogType={seo.ogType}
        jsonLd={seo.jsonLd}
      />
      <AskAI
        open={askAIOpen}
        onClose={() => setAskAIOpen(false)}
        lessonTitle={lesson.title}
        theoryText={lesson.theory ?? ''}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        lessonTitle={lesson.title}
      />

      <p className="lesson-print-only mb-2 hidden text-sm text-slate-600">
        LearnTheory — {topicTitle}
      </p>

      <nav
        className="no-print mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link
          to="/"
          className="transition-colors hover:text-[#04AA6D] dark:hover:text-green-400"
        >
          Home
        </Link>
        <span className="text-slate-500 dark:text-slate-500" aria-hidden="true">
          ›
        </span>
        {topicSlug && (
          <>
            <Link
              to={`/${topicSlug}`}
              className="transition-colors hover:text-[#04AA6D] dark:hover:text-green-400"
            >
              {topicTitle}
            </Link>
            <span
              className="text-slate-500 dark:text-slate-500"
              aria-hidden="true"
            >
              ›
            </span>
          </>
        )}
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {lesson.title}
        </span>
      </nav>

      <header className="lesson-print-header mb-8 border-b border-slate-200 pb-6 dark:border-slate-700 print:border-slate-300">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl print:text-black">
            {lesson.title}
          </h1>
          <div className="no-print flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#04AA6D] hover:text-[#04AA6D] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-green-500 dark:hover:text-green-400"
              aria-haspopup="dialog"
              aria-expanded={shareOpen}
              aria-label="Share this lesson"
            >
              <ShareIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Share This Lesson</span>
              <span className="sm:hidden">Share</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#04AA6D] hover:text-[#04AA6D] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-green-500 dark:hover:text-green-400"
              aria-label="Print lesson"
            >
              <PrintIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Print Lesson</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={() => setAskAIOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#04AA6D] bg-[#04AA6D] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#059862] hover:shadow-md active:scale-95 dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500"
              aria-haspopup="dialog"
              aria-expanded={askAIOpen}
              aria-label="Ask AI about this lesson"
            >
              <SparkleIcon className="h-4 w-4" />
              <span>Ask AI</span>
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 ${
                bookmarked
                  ? 'border-[#04AA6D] bg-[#04AA6D] text-white dark:border-green-500 dark:bg-green-600'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-[#04AA6D] hover:text-[#04AA6D] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-green-500 dark:hover:text-green-400'
              }`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
              aria-pressed={bookmarked}
            >
              <BookmarkIcon className="h-5 w-5" filled={bookmarked} />
            </button>
          </div>
        </div>
        {lesson.subtitle && (
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 sm:text-lg print:text-slate-700">
            {lesson.subtitle}
          </p>
        )}
        {lesson.tags?.length > 0 && (
          <ul className="no-print mt-4 flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <motion.div
          layout
          className={`no-print mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4.5 transition-all duration-300 ${
            complete
              ? 'border-green-200 bg-green-50/40 dark:border-green-900/40 dark:bg-green-950/20'
              : 'border-slate-200 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/20'
          }`}
          animate={
            complete
              ? {
                  boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.15)',
                }
              : { boxShadow: '0 0 0 0px rgba(16, 185, 129, 0)' }
          }
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={complete}
              onChange={(e) => handleCompleteToggle(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981] dark:border-slate-700 dark:bg-slate-800 dark:focus:ring-emerald-500 transition-colors"
            />
            <span className="text-sm font-semibold text-slate-750 dark:text-slate-200">
              Mark lesson as complete
            </span>
          </label>
          <motion.button
            type="button"
            onClick={() => handleCompleteToggle(!complete)}
            aria-label={
              complete
                ? 'Mark lesson as incomplete'
                : 'Mark lesson as complete'
            }
            whileTap={{ scale: 0.95 }}
            animate={
              complete
                ? {
                    scale: 1,
                    backgroundColor: '#10B981',
                    color: '#ffffff',
                  }
                : {
                    scale: 1,
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                  }
            }
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className={`rounded-xl border px-4 py-2 text-sm font-bold shadow-xs transition-all active:scale-[0.97] ${
              complete
                ? 'border-emerald-500 text-white dark:border-green-600 dark:bg-green-600 dark:hover:bg-green-500'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-900/60 dark:hover:bg-slate-800'
            }`}
          >
            {complete ? 'Completed ✓' : 'Mark as Done ✓'}
          </motion.button>
        </motion.div>
      </header>

      <div className="no-print">
        <SummaryCard
          lessonTitle={lesson.title}
          theoryText={lesson.theory ?? ''}
          resetKey={`${topicSlug}/${id}`}
        />
      </div>

      <div className="lesson-print-body text-base leading-relaxed text-slate-800 dark:text-slate-300 sm:text-[17px] print:text-black">
        {theory && (
          <section className="mb-8" aria-labelledby="theory-heading">
            <h2 id="theory-heading" className={sectionHeading}>
              Theory
            </h2>
            <div className="prose max-w-none dark:prose-invert prose-a:text-[#04AA6D] prose-a:underline">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    if (!inline) {
                      const lang = match ? match[1] : 'text'
                      return (
                        <CodeBlock
                          code={String(children).replace(/\n$/, '')}
                          language={lang}
                        />
                      )
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {theory}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {lesson.definition && (
          <aside
            className="my-8 rounded-r-lg border border-green-200 border-l-4 border-l-[#04AA6D] bg-green-50 px-5 py-4 shadow-sm dark:border-green-900 dark:border-l-green-500 dark:bg-green-950/50 print:border-slate-300 print:bg-slate-50 print:shadow-none"
            role="note"
          >
            <p className="text-sm font-bold uppercase tracking-wide text-[#04AA6D] print:text-slate-800">
              {lesson.definition.label ?? 'Definition'}
            </p>
            <p className="mt-2 text-slate-800 dark:text-slate-100 print:text-black">
              {lesson.definition.text}
            </p>
          </aside>
        )}

        {lesson.keyPoints?.length > 0 && (
          <section className="my-8" aria-labelledby="keypoints-heading">
            <h2 id="keypoints-heading" className={sectionHeading}>
              Key Points
            </h2>
            <ul className="list-disc space-y-2 pl-6 marker:text-[#04AA6D] print:marker:text-slate-800">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="print:text-black">
                  {point}
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.codeExample && (
          <section className="my-8" aria-labelledby="example-heading">
            <h2 id="example-heading" className={sectionHeading}>
              {lesson.codeExample.label ?? 'Example'}
            </h2>
            <CodeBlock
              code={lesson.codeExample.code}
              language={codeLanguage}
              label={lesson.codeExample.label}
            />
          </section>
        )}
      </div>

      {(prevLesson || nextLesson) && (
        <nav
          className="no-print mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:pt-8 md:flex-row md:justify-between dark:border-slate-700"
          aria-label="Lesson navigation"
        >
          {prevLesson ? (
            <Link
              to={`/${topicSlug}/${lessonId(prevLesson)}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#04AA6D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#059862] dark:bg-green-700 dark:hover:bg-green-600 md:w-auto md:justify-start"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>
                <span className="block text-xs font-normal text-white/80">
                  Previous
                </span>
                {prevLesson.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextLesson ? (
            <Link
              to={`/${topicSlug}/${lessonId(nextLesson)}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#04AA6D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#059862] dark:bg-green-700 dark:hover:bg-green-600 md:w-auto md:justify-end md:text-right"
            >
              <span>
                <span className="block text-xs font-normal text-white/80">
                  Next
                </span>
                {nextLesson.title}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </nav>
      )}

      {lesson.quiz?.length > 0 && (
        <section className="no-print mt-10 border-t border-slate-200 pt-8 dark:border-slate-700">
          <h2 className={sectionHeading}>Test Yourself</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">This lesson has a quiz. Open it on the dedicated quiz page to solve.</p>
          <div className="mt-4">
            <Link
              to={`/quiz?topic=${encodeURIComponent(topicSlug)}&lessonId=${encodeURIComponent(id)}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white"
            >
              Open Quiz
            </Link>
          </div>
        </section>
      )}

      <footer className="lesson-print-only mt-8 hidden border-t border-slate-300 pt-4 text-xs text-slate-500">
        Printed from LearnTheory — {window.location.href}
      </footer>
    </article>
  )
}
