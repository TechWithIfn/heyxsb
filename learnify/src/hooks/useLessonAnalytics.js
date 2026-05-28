import { useEffect } from 'react'
import { trackLessonTime, trackLessonView } from '../lib/analytics'

/**
 * Tracks lesson page views and time spent while the tab is visible.
 */
export function useLessonAnalytics(topicSlug, lessonId, lessonTitle) {
  useEffect(() => {
    if (!topicSlug || !lessonId) return

    trackLessonView(topicSlug, lessonId, lessonTitle)

    let activeStart = Date.now()
    let pendingSeconds = 0

    const flush = (seconds) => {
      if (seconds > 0) trackLessonTime(topicSlug, lessonId, seconds)
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (activeStart) {
          pendingSeconds += Math.floor((Date.now() - activeStart) / 1000)
          activeStart = null
        }
      } else {
        activeStart = Date.now()
      }
    }

    const tick = window.setInterval(() => {
      if (document.hidden || !activeStart) return
      const elapsed = Math.floor((Date.now() - activeStart) / 1000)
      if (elapsed >= 30) {
        flush(elapsed)
        activeStart = Date.now()
      }
    }, 30000)

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(tick)
      document.removeEventListener('visibilitychange', onVisibility)
      if (!document.hidden && activeStart) {
        pendingSeconds += Math.floor((Date.now() - activeStart) / 1000)
      }
      flush(pendingSeconds)
    }
  }, [topicSlug, lessonId, lessonTitle])
}
