import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShortcuts } from '../context/ShortcutsContext'
import { useToast } from '../context/ToastContext'
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

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
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

const actionButtonBase =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04AA6D] focus-visible:ring-offset-2 active:translate-y-px dark:focus-visible:ring-offset-slate-950 sm:w-auto'

const actionButtonNeutral =
  'border-slate-200 bg-white text-slate-700 hover:border-[#04AA6D] hover:text-[#04AA6D] hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-green-500 dark:hover:text-green-400'

const actionButtonPrimary =
  'border-[#04AA6D] bg-[#04AA6D] text-white hover:bg-[#059862] hover:shadow-md dark:border-green-500 dark:bg-green-600 dark:hover:bg-green-500'

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

  const handleCompleteToggle = useCallback(
    (checked) => {
      if (!topicSlug || !id) return
      setLessonComplete(topicSlug, id, checked)
      toast(checked ? 'Lesson marked complete' : 'Lesson marked incomplete', {
        type: 'success',
      })
    },
    [topicSlug, id, toast],
  )

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

  const actionButtons = [
    {
      key: 'share',
      onClick: handleShare,
      label: 'Share',
      longLabel: 'Share lesson',
      icon: <ShareIcon className="h-4 w-4" />,
      variant: 'neutral',
      props: {
        ariaExpanded: shareOpen,
        ariaHaspopup: 'dialog',
      },
    },
    {
      key: 'print',
      onClick: handlePrint,
      label: 'Print',
      longLabel: 'Print lesson',
      icon: <PrintIcon className="h-4 w-4" />,
      variant: 'neutral',
      props: {},
    },
    {
      key: 'ask-ai',
      onClick: () => setAskAIOpen(true),
      label: 'Ask AI',
      longLabel: 'Ask AI about this lesson',
      icon: <SparkleIcon className="h-4 w-4" />,
      variant: 'primary',
      props: {
        ariaExpanded: askAIOpen,
        ariaHaspopup: 'dialog',
      },
    },
    {
      key: 'bookmark',
      onClick: handleBookmark,
      label: bookmarked ? 'Saved' : 'Bookmark',
      longLabel: bookmarked ? 'Remove bookmark' : 'Bookmark this lesson',
      icon: <BookmarkIcon className="h-4 w-4" filled={bookmarked} />,
      variant: bookmarked ? 'primary' : 'neutral',
      props: {
        ariaPressed: bookmarked,
      },
    },
  ]

  const seo = buildLessonSeo({
    lesson,
    topicSlug,
    topicTitle,
    lessonId: id,
  })

  return (
    <article className="lesson-print-root mx-auto w-full min-w-0 max-w-[950px] px-4 md:px-8">
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

      <header className="lesson-print-header mb-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 print:border-slate-300 print:bg-white print:shadow-none">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="min-w-0 space-y-4">
            <nav
              className="no-print flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-400"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="transition-colors hover:text-[#04AA6D] dark:hover:text-green-400"
              >
                Home
              </Link>
              <span
                className="text-slate-500 dark:text-slate-500"
                aria-hidden="true"
              >
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

            <div className="space-y-3">
                  <h1 className="min-w-0 text-[48px] font-bold tracking-tight text-slate-900 dark:text-white">
                    {lesson.title}
                  </h1>
                  {lesson.subtitle && (
                    <p className="max-w-3xl text-[18px] leading-[1.8] text-slate-600 dark:text-slate-400">
                      {lesson.subtitle}
                    </p>
                  )}
              {lesson.tags?.length > 0 && (
                <ul className="no-print flex flex-wrap gap-2">
                  {lesson.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="no-print grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-start xl:justify-end">
            {actionButtons.map((button) => {
              const variantClass =
                button.variant === 'primary'
                  ? actionButtonPrimary
                  : actionButtonNeutral

              return (
                <button
                  key={button.key}
                  type="button"
                  onClick={button.onClick}
                  className={`${actionButtonBase} ${variantClass}`}
                  aria-label={button.longLabel}
                  {...(button.props.ariaExpanded !== undefined
                    ? { 'aria-expanded': button.props.ariaExpanded }
                    : {})}
                  {...(button.props.ariaHaspopup
                    ? { 'aria-haspopup': button.props.ariaHaspopup }
                    : {})}
                  {...(button.props.ariaPressed !== undefined
                    ? { 'aria-pressed': button.props.ariaPressed }
                    : {})}
                >
                  {button.icon}
                  <span>{button.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Removed large dashboard-style completion panel for a cleaner reading experience. */}
      </header>

      {/* Summary card removed to keep lesson view focused and uncluttered */}

      <div className="lesson-print-body text-[18px] leading-[1.8] text-slate-800 dark:text-slate-300 print:text-black">
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
        <nav className="no-print mt-10 border-t border-slate-200 pt-6 dark:border-slate-700 text-center" aria-label="Lesson navigation">
          <div className="mx-auto flex items-center justify-between max-w-md">
            {prevLesson ? (
              <Link to={`/${topicSlug}/${lessonId(prevLesson)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#04AA6D]">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Link>
            ) : <div />}

            <div className="text-sm text-slate-500">{/* Topic counter not available in this context */}</div>

            {nextLesson ? (
              <Link to={`/${topicSlug}/${lessonId(nextLesson)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#04AA6D]">
                Next <ChevronRight className="h-4 w-4" />
              </Link>
            ) : <div />}
          </div>
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
