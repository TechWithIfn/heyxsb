import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle, ChevronDown, Star } from 'lucide-react'
import { IPUBreadcrumb } from './IPUBreadcrumb'
import {
  isBookmarked,
  markTopicRead,
  toggleBookmark,
} from '../../lib/ipuSubjectStorage'
import { easeOut } from '../../lib/motion'
import { getEnglishName } from '../../ipu/utils/translate'

function ExamAccordion({ questions }) {
  const [open, setOpen] = useState(false)

  if (!questions?.length) return null

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span>Exam & Interview Questions ({questions.length})</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="overflow-hidden"
          >
            <ol className="list-decimal space-y-2 px-5 py-4 pl-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TopicSection({
  topic,
  unitNumber,
  subjectId,
  branchId,
  semNum,
  totalTopics,
  readTopics,
}) {
  const bookmarked = isBookmarked(subjectId, topic.id)
  const read = readTopics.includes(topic.id)

  const handleBookmark = () => {
    toggleBookmark(subjectId, topic.id)
  }

  const handleMarkRead = () => {
    if (!read) {
      markTopicRead(branchId, semNum, subjectId, topic.id, totalTopics)
    }
  }

  const paragraphs = topic.content
    ? topic.content.split('\n\n').filter(Boolean)
    : []

  return (
    <section
      id={topic.id}
      data-ipu-topic={topic.id}
      className="scroll-mt-24 break-words border-b border-slate-200 py-10 last:border-b-0 dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          {topic.title}
        </h3>
        <motion.button
          type="button"
          onClick={handleBookmark}
          whileTap={{ scale: 1.4 }}
          className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800"
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          aria-pressed={bookmarked}
        >
          <Star
            className={`h-5 w-5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`}
            aria-hidden="true"
          />
        </motion.button>
      </div>

      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300"
        >
          {para}
        </p>
      ))}

      {topic.keyPoints?.length > 0 && (
        <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sky-800 dark:text-sky-300">
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Key points
          </h4>
          <ul className="mt-3 space-y-2">
            {topic.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-400"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {topic.examples?.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Examples
          </h4>
          {topic.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 border-l-4 border-l-green-600 bg-white p-4 dark:border-slate-600 dark:border-l-green-500 dark:bg-slate-800/80"
            >
              <p className="font-bold text-slate-900 dark:text-white">{ex.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {ex.explanation}
              </p>
            </div>
          ))}
        </div>
      )}

      {topic.formulas?.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
            Formulas
          </h4>
          {topic.formulas.map((f, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-sm text-slate-100 dark:border-slate-600"
            >
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-green-400">
                {f.name}
              </p>
              <p className="mt-2 text-base text-white">{f.formula}</p>
              {f.description && (
                <p className="mt-2 font-sans text-xs text-slate-400">{f.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <ExamAccordion questions={topic.examQuestions} />

      <button
        type="button"
        onClick={handleMarkRead}
        disabled={read}
        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
          read
            ? 'cursor-default border border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
            : 'bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500'
        }`}
      >
        {read ? (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            Marked as read
          </>
        ) : (
          'Mark as read'
        )}
      </button>
    </section>
  )
}

export function TopicContent({
  branch,
  semNum,
  subject,
  readTopics,
  totalTopics,
  totalTopicCount,
  unitCount,
}) {
  const hasUnits =
    subject.units?.length > 0 &&
    subject.units.some((u) => u.topics?.length > 0)

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden">
      <IPUBreadcrumb
        items={[
          { label: 'Home', to: '/' },
          { label: 'IPU Syllabus', to: '/ipu-syllabus' },
          { label: getEnglishName(branch), to: `/ipu-syllabus/${branch.id}` },
          {
            label: `Semester ${semNum}`,
            to: `/ipu-syllabus/${branch.id}/semester/${semNum}`,
          },
          { label: getEnglishName(subject) },
        ]}
      />

      <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {subject.subjectCode}
          </span>
          <span className="rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-950/50 dark:text-green-400">
            {subject.credits} credits
          </span>
          <span
            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase ${
              subject.type === 'lab'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
            }`}
          >
            {subject.type}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {getEnglishName(subject)}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {subject.description}
        </p>
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          {unitCount} unit{unitCount === 1 ? '' : 's'} · {totalTopicCount} topic
          {totalTopicCount === 1 ? '' : 's'}
        </p>
      </header>

      {!hasUnits ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Content coming soon
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Unit-wise notes for {getEnglishName(subject)} are being prepared. Check back
            later or browse another subject.
          </p>
        </div>
      ) : (
        subject.units.map((unit) => (
          <div key={unit.unitNumber} className="mb-4">
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Unit {unit.unitNumber}: {unit.title}
            </h2>
            {unit.topics.map((topic) => (
              <TopicSection
                key={topic.id}
                topic={topic}
                unitNumber={unit.unitNumber}
                subjectId={subject.id}
                branchId={branch.id}
                semNum={semNum}
                totalTopics={totalTopics}
                readTopics={readTopics}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )
}
