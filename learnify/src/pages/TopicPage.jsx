import { Link, useParams } from 'react-router-dom'
import { useLessonComplete, useTopicProgress } from '../hooks/useProgress'
import { useTopic } from '../hooks/useTopic'
import {
  getFirstLessonId,
  getLessonDescription,
  lessonId,
} from '../lib/topics'

function LessonCompleteBadge({ topicSlug, lessonIdParam }) {
  const complete = useLessonComplete(topicSlug, lessonIdParam)
  if (!complete) return null
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-[#04AA6D] dark:bg-green-900/60 dark:text-green-400"
      aria-label="Completed"
      title="Completed"
    >
      ✓
    </span>
  )
}

function LessonCard({ topicSlug, lesson, index }) {
  const id = lessonId(lesson)
  const description = getLessonDescription(lesson)

  return (
    <Link
      to={`/${topicSlug}/${id}`}
      className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300 hover:border-emerald-500/30 hover:shadow-premium-hover dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-premium dark:hover:shadow-dark-premium-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Lesson {index + 1}
        </span>
        <LessonCompleteBadge topicSlug={topicSlug} lessonIdParam={id} />
      </div>
      <h3 className="mt-2 text-lg font-bold text-slate-800 group-hover:text-[#04AA6D] dark:text-white dark:group-hover:text-emerald-400 transition-colors">
        {lesson.title}
      </h3>
      {description && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
      <span className="mt-4 text-sm font-bold text-[#04AA6D] dark:text-emerald-400">
        Read lesson →
      </span>
    </Link>
  )
}

export function TopicPage() {
  const { topic: topicSlug } = useParams()
  const { topic } = useTopic(topicSlug)
  const { done, total, percent } = useTopicProgress(topicSlug)

  if (!topic) {
    return null
  }

  const firstLessonId = getFirstLessonId(topicSlug)

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-7xl px-4 py-8 outline-none sm:py-12"
    >
      <nav
        className="mb-6 text-sm text-slate-500 dark:text-slate-400"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:text-[#04AA6D]">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link to="/topics" className="hover:text-[#04AA6D]">
          Topics
        </Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {topic.title}
        </span>
      </nav>

      <header className="mb-10 border-b border-slate-200 pb-8 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {topic.title} Tutorial
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {topic.description}
        </p>

        {total > 0 && (
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
              <span>
                {done} / {total} lessons done
              </span>
              <span className="text-[#04AA6D] dark:text-green-400">{percent}%</span>
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[#04AA6D] transition-all duration-500 dark:bg-green-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        {firstLessonId && (
          <Link
            to={`/${topicSlug}/${firstLessonId}`}
            className="mt-6 inline-flex rounded bg-[#04AA6D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#059862]"
          >
            Start first lesson →
          </Link>
        )}
      </header>

      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Lessons ({topic.lessons.length})
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {topic.lessons.map((lesson, index) => (
          <LessonCard
            key={lessonId(lesson)}
            topicSlug={topicSlug}
            lesson={lesson}
            index={index}
          />
        ))}
      </div>
    </main>
  )
}
