import { useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark } from 'lucide-react'
import TheoryBlock from './blocks/TheoryBlock'
import FormulaBlock from './blocks/FormulaBlock'
import ExampleBlock from './blocks/ExampleBlock'
import { isDone, markDone } from '../hooks/useIPUProgress'
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
  const articleRef = useRef(null)
  const autoDoneRef = useRef(false)

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
  const done = Boolean(branchId && semNumber && subject?.id && unitId && topicId && isDone(branchId, semNumber, subject.id, unitId, topicId))
  const bookmarked = Boolean(branchId && semNumber && subject?.id && topicId && isBookmarked(branchId, semNumber, subject.id, topicId))

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

  useEffect(() => {
    autoDoneRef.current = false
  }, [topicId])

  useEffect(() => {
    if (!branchId || !semNumber || !subject?.id || !topicId || done) {
      return
    }

    const markTopicIfRead = () => {
      if (autoDoneRef.current) {
        return
      }

      const article = articleRef.current
      if (!article) {
        return
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const scrollBottom = window.scrollY + viewportHeight
      const articleTop = window.scrollY + article.getBoundingClientRect().top
      const readThreshold = articleTop + article.offsetHeight - 140

      if (scrollBottom >= readThreshold) {
        autoDoneRef.current = true
        markDone(branchId, semNumber, subject.id, unitId, topicId)
      }
    }

    const onScroll = () => {
      markTopicIfRead()
    }

    markTopicIfRead()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [branchId, done, semNumber, subject?.id, topicId, unitId])

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
    <article ref={articleRef} className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-0">
      <header className="mb-6 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {subject?.name ? `${subject.name} · ` : ''}Unit {unitId}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {topic.title || 'Untitled topic'}
            </h1>
            {topic.description || content.summary ? (
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {topic.description || content.summary}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${bookmarked ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
            aria-pressed={bookmarked}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="space-y-8">
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
