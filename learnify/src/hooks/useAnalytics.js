import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import { readBookmarks } from '../lib/bookmarks'
import {
  computeAnalyticsStats,
  exportAnalyticsJson,
  readAnalytics,
  resetAnalytics,
  subscribeAnalytics,
  syncBookmarkCount,
} from '../lib/analytics'

function getSnapshot() {
  return readAnalytics()
}

function getServerSnapshot() {
  return {
    version: 1,
    lessonViews: {},
    lessonTimeSeconds: {},
    lessonTitles: {},
    dailyTimeSeconds: {},
    quizzes: [],
    searchQueries: [],
    bookmarksCount: 0,
  }
}

export function useAnalytics() {
  const data = useSyncExternalStore(
    subscribeAnalytics,
    getSnapshot,
    getServerSnapshot,
  )

  const stats = useMemo(() => computeAnalyticsStats(data), [data])

  useEffect(() => {
    syncBookmarkCount(readBookmarks().length)
  }, [])

  const exportJson = useCallback(() => exportAnalyticsJson(), [])

  const resetStats = useCallback(() => {
    resetAnalytics()
  }, [])

  return {
    data,
    stats,
    exportJson,
    resetStats,
  }
}

export { useLessonAnalytics } from './useLessonAnalytics'
