import { useSyncExternalStore } from 'react'
import {
  getOverallProgressStats,
  getTopicProgress,
  isLessonComplete,
  readProgress,
  subscribeProgress,
} from '../lib/progress'

function getSnapshot() {
  return readProgress()
}

function getServerSnapshot() {
  return { completed: [], activityDates: [] }
}

export function useProgress() {
  return useSyncExternalStore(subscribeProgress, getSnapshot, getServerSnapshot)
}

export function useLessonComplete(topicSlug, lessonIdParam) {
  const progress = useProgress()
  if (!topicSlug || !lessonIdParam) return false
  const key = `${topicSlug}/${lessonIdParam}`
  return progress.completed.includes(key)
}

export function useTopicProgress(topicSlug) {
  useProgress()
  return getTopicProgress(topicSlug)
}

export function useOverallProgress() {
  useProgress()
  return getOverallProgressStats()
}
