import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Check, Share2 } from 'lucide-react'
import TheoryBlock from './blocks/TheoryBlock'
import FormulaBlock from './blocks/FormulaBlock'
import ExampleBlock from './blocks/ExampleBlock'
import { ProgressRing } from './ProgressRing'
import { getTopicProgress, isDone, markDone, markUndone } from '../hooks/useIPUProgress'
import { isBookmarked, removeBookmark, saveBookmark } from '../hooks/useIPUBookmarks'

function getTopicUnitId(topic, fallback = 'unit-1') {
  return String(topic?.unitId ?? topic?.unitNumber ?? fallback)
}

export default function TopicRenderer({
  topic = {},
  topicIndex = 0,
  totalTopics = 1,
  onPrev,
  onNext,
  subject,
  branchId,
  semNumber,
}) {
  const [version, setVersion] = useState(0)
  const [notesOpen, setNotesOpen] = useState(true)

  useEffect(() => {
    const refresh = () => setVersion((current) => current + 1)
    window.addEventListener('learnify-ipu-progress-updated', refresh)
    window.addEventListener('learnify-ipu-bookmarks-updated', refresh)
    return () => {
      window.removeEventListener('learnify-ipu-progress-updated', refresh)
      window.removeEventListener('learnify-ipu-bookmarks-updated', refresh)
    }
  }, [])

  const content = topic.content || {}
  const unitId = getTopicUnitId(topic)
  const topicId = String(topic?.id ?? '')
  const progress = useMemo(() => {
    if (!branchId || !semNumber || !subject?.id) {
      return { done: 0, total: 0, percent: 0, unitBreakdown: [] }
    }

    return getTopicProgress(branchId, semNumber, subject.id)
  }, [branchId, semNumber, subject?.id, version])

  const done = Boolean(branchId && semNumber && subject?.id && unitId && topicId && isDone(branchId, semNumber, subject.id, unitId, topicId))
  const bookmarked = Boolean(branchId && semNumber && subject?.id && topicId && isBookmarked(branchId, semNumber, subject.id, topicId))

  const handleToggleDone = () => {
    if (!branchId || !semNumber || !subject?.id || !topicId) {
      return
    }

    if (done) {
      markUndone(branchId, semNumber, subject.id, unitId, topicId)
    } else {
      markDone(branchId, semNumber, subject.id, unitId, topicId)
    }

    setVersion((current) => current + 1)
  }

  const handleToggleBookmark = () => {
    if (!branchId || !semNumber || !subject?.id || !topicId) {
      return
    }

    if (bookmarked) {
      removeBookmark(branchId, semNumber, subject.id, topicId)
    } else {
      saveBookmark({
        branchId,
        sem: semNumber,
        subjectId: subject.id,
        subjectName: subject.name,
        unitId,
        unitTitle: topic.unitTitle,
        topicId,
        topicTitle: topic.title,
      })
    }

    setVersion((current) => current + 1)
  }

  const handleShare = async () => {
    const text = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: topic.title, url: text })
      } else {
        await navigator.clipboard.writeText(text)
      }
    } catch (error) {
      console.warn('Unable to share topic link', error)
    }
  }

  const PrevNextButtons = () => (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
      <button
        type="button"
        onClick={onPrev}
        disabled={!onPrev}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        <span aria-hidden="true">←</span>
        Previous
      </button>

      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Topic {topicIndex + 1} of {totalTopics}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!onNext}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
      >
        Next
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {subject?.name ? <span>{subject.name}</span> : null}
              {unitId ? <span>Unit {unitId}</span> : null}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {topic.title || 'Untitled topic'}
            </h1>
            {topic.description || content.summary ? (
              <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                {topic.description || content.summary}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleToggleDone}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${done ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Check className="h-4 w-4" />
              {done ? 'Mark undone' : 'Mark done'}
            </button>
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${bookmarked ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
            >
              <Bookmark className="h-4 w-4" />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#03995f]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <ProgressRing percent={progress.percent} label="Progress" />

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Done</div>
              <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{progress.done}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Total</div>
              <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{progress.total}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Status</div>
              <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{done ? 'Completed' : 'In progress'}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {content.definition && (
          <div className="my-8 rounded border-l-4 border-[#2196F3] bg-[#E7F3FE] p-6 text-[#282A35] dark:bg-[#1e3a5f]/40 dark:text-[#E0E0E0]">
            <h2 className="mt-0 mb-2 text-xl font-semibold">{content.definition.label || 'Definition'}</h2>
            <div className="text-base">{content.definition.text}</div>
          </div>
        )}

        <TheoryBlock theory={content.theory} />

        {content.keyPoints && content.keyPoints.length > 0 && (
          <section className="my-8">
            <h2 className="mb-4 text-2xl font-semibold text-[#282A35] dark:text-white">Key Points</h2>
            <ul className="list-none space-y-2 pl-0">
              {content.keyPoints.map((kp, index) => (
                <li key={index} className="flex items-start gap-3 rounded bg-[#f1f1f1] p-3 dark:bg-[#2e2e3e]">
                  <span className="mt-0.5 font-bold text-[#04AA6D]">✓</span>
                  <span className="text-base text-[#282A35] dark:text-[#E0E0E0]">{kp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FormulaBlock formulas={content.formulas} />

        <div className="my-8">
          <ExampleBlock examples={content.examples} />
        </div>

        {content.notes && (
          <div className="my-8 rounded border-l-4 border-[#FFC107] bg-[#FFF4A3] p-6 text-[#282A35] dark:bg-[#4a3f12]/40 dark:text-[#E0E0E0]">
            <h2 className="mt-0 mb-2 text-xl font-semibold">Note</h2>
            <div className="text-base">{content.notes}</div>
          </div>
        )}

        {Array.isArray(topic.quiz) && topic.quiz.length > 0 && (
          <section className="my-10">
            <h2 className="mb-4 text-2xl font-semibold text-[#282A35] dark:text-white">
              Topic Quiz
            </h2>
            <div className="mt-2">
              <Link
                to={`/quiz?ipu=1&branch=${encodeURIComponent(branchId)}&sem=${encodeURIComponent(semNumber)}&subjectId=${encodeURIComponent(subject?.id)}&topicId=${encodeURIComponent(topicId)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#04AA6D] px-4 py-2 text-sm font-semibold text-white"
              >
                Open Topic Quiz
              </Link>
            </div>
          </section>
        )}

        {content.references && content.references.length > 0 && (
          <div className="my-8">
            <h2 className="text-2xl font-semibold text-[#282A35] dark:text-white">References</h2>
            <ul className="mt-4 list-disc ml-5">
              {content.references.map((reference, index) => (
                <li key={index} className="mb-1">
                  {reference}
                </li>
              ))}
            </ul>
          </div>
        )}

        <PrevNextButtons />
      </div>
    </article>
  )
}
