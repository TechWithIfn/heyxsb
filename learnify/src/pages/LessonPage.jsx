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
    <div className="mx-auto flex w-full max-w-7xl flex-col lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:flex-row lg:overflow-hidden">
      <div className="no-print w-full shrink-0 px-4 pt-3 sm:px-6 lg:w-64 lg:max-w-[16rem] lg:px-0 lg:pt-6 lg:min-h-0">
        <Sidebar
          topicSlug={topicSlug}
          currentLessonId={lessonIdParam}
          sections={sections}
        />
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="w-full min-w-0 flex-1 px-4 py-4 outline-none sm:px-6 sm:py-6 lg:px-8 lg:py-8 lg:min-h-0 lg:h-full lg:overflow-y-auto scrollbar-hidden"
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
    </div>
  )
}
