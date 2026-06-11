import { useMemo } from 'react'
import { useLessonAnalytics } from '../hooks/useLessonAnalytics'
import { useParams, Navigate } from 'react-router-dom'
import { LessonTransition } from '../components/LessonTransition'
import { Sidebar } from '../components/Sidebar'
import { LessonReader } from '../components/LessonReader'
import { AIQuizGenerator } from '../components/AIQuizGenerator'
import { useTopic } from '../hooks/useTopic'
import {
  getLesson,
  getSidebarSections,
  isReservedSlug,
  isValidTopicSlug,
  lessonId,
} from '../lib/topics'

export function LessonPage() {
  const { topic: topicSlug, lessonId: lessonIdParam } = useParams()
  const { topic } = useTopic(topicSlug)

  const lessonData = useMemo(() => {
    if (!topic || !topicSlug || !lessonIdParam) {
      return null
    }

    const lesson = getLesson(topicSlug, lessonIdParam)
    if (!lesson) return null

    const lessonIndex = topic.lessons.findIndex(
      (l) => lessonId(l) === lessonIdParam,
    )

    return {
      lesson,
      topicMeta: { slug: topic.slug, title: topic.title },
      prevLesson: topic.lessons[lessonIndex - 1],
      nextLesson: topic.lessons[lessonIndex + 1],
      sections: getSidebarSections(topic),
    }
  }, [topic, topicSlug, lessonIdParam])

  useLessonAnalytics(
    lessonData ? topicSlug : undefined,
    lessonData ? lessonIdParam : undefined,
    lessonData?.lesson?.title,
  )

  if (isReservedSlug(topicSlug) || !isValidTopicSlug(topicSlug)) {
    return <Navigate to="/404" replace />
  }

  if (!lessonData) {
    return <Navigate to="/404" replace />
  }

  const { lesson, topicMeta, prevLesson, nextLesson, sections } = lessonData

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg-min-h lg:grid-cols-[320px_minmax(0,900px)] lg:gap-6 lg:px-8 lg:py-6 xl:grid-cols-[320px_minmax(0,900px)_300px]">
      <Sidebar
        topicSlug={topicSlug}
        currentLessonId={lessonIdParam}
        sections={sections}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 px-0 py-0 outline-none"
      >
        <LessonTransition>
          <LessonReader
            lesson={lesson}
            topic={topicMeta}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
          />
          <div className="no-print">
            <AIQuizGenerator
              lessonTitle={lesson.title}
              theoryText={lesson.theory ?? ''}
              quiz={lesson.quiz ?? []}
              resetKey={`${topicSlug}/${lessonIdParam}`}
              topicSlug={topicSlug}
              lessonId={lessonIdParam}
            />
          </div>
        </LessonTransition>
      </main>

      <aside className="no-print hidden xl:block xl:self-start xl:sticky xl-sticky-top xl-sticky-h xl:overflow-y-auto xl:pr-1 scrollbar-hidden">
        <div className="space-y-4">
          <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/75">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Reading tools
            </p>
            <h2 className="mt-2 text-lg font-black text-slate-900 dark:text-white">
              Keep momentum
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Follow the sidebar, jump to revision tools, and return to the topic overview without losing context.
            </p>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Quick links
            </p>
            <div className="mt-4 space-y-3">
              <a
                href={`/${topicSlug}`}
                className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200 dark:hover:text-emerald-300"
              >
                Topic overview
              </a>
              <a
                href="/progress"
                className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200 dark:hover:text-emerald-300"
              >
                Learning progress
              </a>
              <a
                href="/bookmarks"
                className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200 dark:hover:text-emerald-300"
              >
                Saved lessons
              </a>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
