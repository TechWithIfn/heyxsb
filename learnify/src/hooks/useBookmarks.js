import { useSyncExternalStore } from 'react'
import { readBookmarks, subscribeBookmarks } from '../lib/bookmarks'

function getSnapshot() {
  return readBookmarks()
}

function getServerSnapshot() {
  return []
}

export function useBookmarks() {
  return useSyncExternalStore(subscribeBookmarks, getSnapshot, getServerSnapshot)
}

export function useLessonBookmarked(topicSlug, lessonId) {
  const bookmarks = useBookmarks()
  if (!topicSlug || !lessonId) return false
  const key = `${topicSlug}/${lessonId}`
  return bookmarks.some((b) => `${b.topicSlug}/${b.lessonId}` === key)
}
