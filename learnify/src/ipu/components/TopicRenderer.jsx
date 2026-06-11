import { useEffect, useMemo, useRef, useState } from 'react'
import { Bookmark } from 'lucide-react'
import TheoryBlock from './blocks/TheoryBlock'
import FormulaBlock from './blocks/FormulaBlock'
import ExampleBlock from './blocks/ExampleBlock'
import { isDone, markDone } from '../hooks/useIPUProgress'
import { getEnglishName } from '../utils/translate'
import { isBookmarked, removeBookmark, saveBookmark } from '../hooks/useIPUBookmarks'

function getTopicUnitId(topic, fallback = 'unit-1') {
  return String(topic?.unitId ?? topic?.unitNumber ?? fallback)
}

function asArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const sectionCardClass = 'my-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70'
const insetCardClass = 'rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60'

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
  const intro = asArray(content.introduction)
  const definitions = asArray(content.definitions)
  const keyPoints = asArray(content.keyPoints?.length ? content.keyPoints : content.importantPoints)
  const examNotes = asArray(content.examNotes)
  const expectedQuestions = asArray(content.expectedQuestions)
  const quickSummary = asArray(content.quickSummary)
  const previousShort = asArray(content.previousYearQuestions?.short)
  const previousLong = asArray(content.previousYearQuestions?.long)
  const previousNumerical = asArray(content.previousYearQuestions?.numerical)
  const quizItems = asArray(content.quiz)
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
        subjectName: getEnglishName(subject),
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
    <article ref={articleRef} className="mx-auto w-full max-w-[900px] px-4 py-6 md:px-6 md:py-8" style={{ boxSizing: 'border-box' }}>
      <header className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/75 sm:p-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <span>{subject?.name ? getEnglishName(subject) : 'IPU'}</span>
          <span aria-hidden="true">›</span>
          <span>{`UNIT ${unitId}`}</span>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">Topic</span>
        </nav>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-4">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/35 dark:text-emerald-300">
              {subject?.name ? `${getEnglishName(subject)} · ` : ''}{`UNIT ${unitId}`}
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {topic.title || 'Untitled topic'}
            </h1>
            {topic.description || content.summary ? (
              <p className="max-w-3xl text-[17px] leading-[1.85] text-slate-600 dark:text-slate-300 sm:text-[18px]">
                {topic.description || content.summary}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${bookmarked ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300' : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
            aria-pressed={bookmarked}
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mt-6 space-y-6 text-[18px] leading-[1.8]">
        {intro.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Introduction</h2>
            <div className="space-y-3">
              {intro.map((line, index) => (
                <p key={index} className="text-[17px] leading-[1.85] text-slate-700 dark:text-slate-300">{line}</p>
              ))}
            </div>
          </section>
        )}

        {content.diagram && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Diagram</h2>
            <figure className={insetCardClass}>
              <img src={content.diagram} alt={content.diagramAlt || `${topic.title} diagram`} className="mx-auto max-h-[420px] w-auto" />
              {content.diagramCaption && (
                <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-400">{content.diagramCaption}</figcaption>
              )}
            </figure>
          </section>
        )}

        {content.definition && (
          <div className="my-8 rounded-3xl border border-sky-200 bg-sky-50/80 p-6 text-[#282A35] shadow-sm dark:border-sky-900/40 dark:bg-sky-950/20 dark:text-[#E0E0E0]">
            <h2 className="mt-0 mb-2 text-2xl font-bold">{content.definition.label || 'Definition'}</h2>
            <div className="text-[17px] leading-[1.85]">{content.definition.text}</div>
          </div>
        )}

        {definitions.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Important Definitions</h2>
            <ul className="list-disc space-y-2 pl-6">
              {definitions.map((item, index) => (
                <li key={index} className="text-[17px] leading-[1.85] text-slate-700 dark:text-slate-300">{item}</li>
              ))}
            </ul>
          </section>
        )}

        <TheoryBlock theory={content.theory} />

        {keyPoints.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Key Points</h2>
            <ul className="list-none space-y-2 pl-0">
              {keyPoints.map((kp, index) => (
                <li key={index} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/70">
                  <span className="mt-0.5 font-bold text-[#04AA6D]">✓</span>
                  <span className="text-[17px] leading-[1.85] text-[#282A35] dark:text-[#E0E0E0]">{kp}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <FormulaBlock formulas={content.formulas} />

        <div className="my-8">
          <ExampleBlock examples={content.examples} />
        </div>

        {content.numericals && content.numericals.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Practice Numericals</h2>
            <ExampleBlock examples={content.numericals} />
          </section>
        )}

        {examNotes.length > 0 && (
          <section className="my-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-[#282A35] shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-[#E0E0E0]">
            <h2 className="mt-0 mb-2 text-2xl font-bold">Key Exam Notes</h2>
            <ul className="list-disc space-y-2 pl-6">
              {examNotes.map((note, index) => (
                <li key={index} className="text-[17px] leading-[1.85]">{note}</li>
              ))}
            </ul>
          </section>
        )}

        {(previousShort.length > 0 || previousLong.length > 0 || previousNumerical.length > 0) && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Previous Year Style Questions</h2>
            {previousShort.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Short Answer</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {previousShort.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
            {previousLong.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Long Answer</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {previousLong.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
            {previousNumerical.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Numerical</h3>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {previousNumerical.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}

        {expectedQuestions.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Expected Exam Questions</h2>
            <ul className="list-disc space-y-2 pl-6">
              {expectedQuestions.map((q, i) => (
                <li key={i} className="text-[17px] leading-[1.85]">{q}</li>
              ))}
            </ul>
          </section>
        )}

        {quickSummary.length > 0 && (
          <section className="my-8 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-900/20">
            <h2 className="mb-3 text-2xl font-bold text-[#282A35] dark:text-white">Quick Revision Summary</h2>
            <ul className="list-disc space-y-2 pl-6">
              {quickSummary.map((item, i) => (
                <li key={i} className="text-[17px] leading-[1.85] text-slate-700 dark:text-slate-300">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {quizItems.length > 0 && (
          <section className={sectionCardClass}>
            <h2 className="mb-4 text-2xl font-bold text-[#282A35] dark:text-white">Topic Quiz Support</h2>
            <div className="space-y-4">
              {quizItems.map((q, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{q.difficulty || 'Medium'}</p>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">Q{i + 1}. {q.question}</p>
                  {q.options?.length > 0 && (
                    <ul className="mt-2 list-disc pl-6 text-slate-700 dark:text-slate-300">
                      {q.options.map((op, idx) => <li key={idx}>{op}</li>)}
                    </ul>
                  )}
                  {q.answer && <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400"><strong>Answer:</strong> {q.answer}</p>}
                  {q.explanation && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{q.explanation}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {content.notes && (
          <div className="my-8 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-[#282A35] shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-[#E0E0E0]">
            <h2 className="mt-0 mb-2 text-2xl font-bold">Note</h2>
            <div className="text-[17px] leading-[1.85]">{content.notes}</div>
          </div>
        )}

        {content.references && content.references.length > 0 && (
          <div className={sectionCardClass}>
            <h2 className="text-2xl font-bold text-[#282A35] dark:text-white">References</h2>
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
