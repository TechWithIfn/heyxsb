export const STORAGE_KEY = 'learnify-analytics'
export const EVENT_NAME = 'analytics-changed'

const MAX_SEARCH_ENTRIES = 100
const MAX_QUIZ_ENTRIES = 200

const EMPTY = {
  version: 1,
  lessonViews: {},
  lessonTimeSeconds: {},
  lessonTitles: {},
  dailyTimeSeconds: {},
  quizzes: [],
  searchQueries: [],
  bookmarksCount: 0,
  recentLessonViews: [],
}

const MAX_RECENT_LESSONS = 8

let cachedRaw = null
let cachedData = EMPTY

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export function lessonAnalyticsKey(topicSlug, lessonId) {
  return `${topicSlug}/${lessonId}`
}

function normalizeStored(data) {
  const lessonViews =
    data?.lessonViews && typeof data.lessonViews === 'object'
      ? { ...data.lessonViews }
      : {}
  const lessonTimeSeconds =
    data?.lessonTimeSeconds && typeof data.lessonTimeSeconds === 'object'
      ? { ...data.lessonTimeSeconds }
      : {}
  const lessonTitles =
    data?.lessonTitles && typeof data.lessonTitles === 'object'
      ? { ...data.lessonTitles }
      : {}
  const dailyTimeSeconds =
    data?.dailyTimeSeconds && typeof data.dailyTimeSeconds === 'object'
      ? { ...data.dailyTimeSeconds }
      : {}
  const quizzes = Array.isArray(data?.quizzes) ? [...data.quizzes] : []
  const searchQueries = Array.isArray(data?.searchQueries)
    ? [...data.searchQueries]
    : []
  const recentLessonViews = Array.isArray(data?.recentLessonViews)
    ? [...data.recentLessonViews]
    : []

  return {
    version: 1,
    lessonViews,
    lessonTimeSeconds,
    lessonTitles,
    dailyTimeSeconds,
    quizzes: quizzes.slice(-MAX_QUIZ_ENTRIES),
    searchQueries: searchQueries.slice(-MAX_SEARCH_ENTRIES),
    bookmarksCount:
      typeof data?.bookmarksCount === 'number' ? data.bookmarksCount : 0,
    recentLessonViews: recentLessonViews.slice(-MAX_RECENT_LESSONS),
  }
}

export function readAnalytics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? ''
    if (raw === cachedRaw) return cachedData
    cachedRaw = raw
    if (!raw) {
      cachedData = EMPTY
      return cachedData
    }
    cachedData = normalizeStored(JSON.parse(raw))
    return cachedData
  } catch {
    cachedRaw = ''
    cachedData = EMPTY
    return cachedData
  }
}

function writeAnalytics(data) {
  try {
    const next = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, next)
    cachedRaw = next
    cachedData = data
    window.dispatchEvent(new CustomEvent(EVENT_NAME))
  } catch {
    /* storage full or blocked */
  }
}

export function subscribeAnalytics(callback) {
  const handler = () => callback()
  window.addEventListener(EVENT_NAME, handler)
  return () => window.removeEventListener(EVENT_NAME, handler)
}

function mutate(fn) {
  const data = normalizeStored(readAnalytics())
  fn(data)
  writeAnalytics(data)
  return data
}

export function trackLessonView(topicSlug, lessonId, lessonTitle) {
  if (!topicSlug || !lessonId) return
  const key = lessonAnalyticsKey(topicSlug, lessonId)
  mutate((data) => {
    data.lessonViews[key] = (data.lessonViews[key] ?? 0) + 1
    if (lessonTitle) {
      data.lessonTitles[key] = lessonTitle
    }
    const title = lessonTitle ?? data.lessonTitles[key] ?? lessonId
    const existingIndex = data.recentLessonViews.findIndex((item) => item.key === key)
    const nextEntry = {
      key,
      topicSlug,
      lessonId,
      lessonTitle: title,
      views: data.lessonViews[key],
      viewedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      data.recentLessonViews.splice(existingIndex, 1)
    }

    data.recentLessonViews.unshift(nextEntry)
    if (data.recentLessonViews.length > MAX_RECENT_LESSONS) {
      data.recentLessonViews = data.recentLessonViews.slice(0, MAX_RECENT_LESSONS)
    }
  })
}

export function trackLessonTime(topicSlug, lessonId, seconds) {
  if (!topicSlug || !lessonId || seconds <= 0) return
  const key = lessonAnalyticsKey(topicSlug, lessonId)
  const day = todayString()
  const secs = Math.min(Math.floor(seconds), 86400)

  mutate((data) => {
    data.lessonTimeSeconds[key] = (data.lessonTimeSeconds[key] ?? 0) + secs
    data.dailyTimeSeconds[day] = (data.dailyTimeSeconds[day] ?? 0) + secs
  })
}

/**
 * @param {{ topicSlug: string, lessonId: string, lessonTitle?: string, correct: number, total: number }} payload
 */
export function trackQuizResult(payload) {
  const { topicSlug, lessonId, lessonTitle, correct, total } = payload
  if (!topicSlug || !lessonId || !total) return

  const percent = Math.round((correct / total) * 100)
  const key = lessonAnalyticsKey(topicSlug, lessonId)

  mutate((data) => {
    if (lessonTitle) data.lessonTitles[key] = lessonTitle
    data.quizzes.push({
      topicSlug,
      lessonId,
      lessonTitle: lessonTitle ?? data.lessonTitles[key] ?? lessonId,
      correct,
      total,
      percent,
      at: new Date().toISOString(),
    })
    if (data.quizzes.length > MAX_QUIZ_ENTRIES) {
      data.quizzes = data.quizzes.slice(-MAX_QUIZ_ENTRIES)
    }
  })
}

export function trackSearch(query, resultCount = 0) {
  const q = query?.trim()
  if (!q || q.length < 2) return

  mutate((data) => {
    data.searchQueries.push({
      query: q,
      resultCount,
      at: new Date().toISOString(),
    })
    if (data.searchQueries.length > MAX_SEARCH_ENTRIES) {
      data.searchQueries = data.searchQueries.slice(-MAX_SEARCH_ENTRIES)
    }
  })
}

export function syncBookmarkCount(count) {
  if (typeof count !== 'number' || count < 0) return
  mutate((data) => {
    data.bookmarksCount = count
  })
}

export function resetAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    cachedRaw = ''
    cachedData = EMPTY
    window.dispatchEvent(new CustomEvent(EVENT_NAME))
  } catch {
    /* ignore */
  }
}

export function exportAnalyticsJson() {
  return JSON.stringify(readAnalytics(), null, 2)
}

function parseLessonKey(key) {
  const slash = key.indexOf('/')
  if (slash < 0) return { topicSlug: key, lessonId: '' }
  return {
    topicSlug: key.slice(0, slash),
    lessonId: key.slice(slash + 1),
  }
}

function lastNDays(n) {
  const days = []
  const d = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const copy = new Date(d)
    copy.setDate(copy.getDate() - i)
    days.push(copy.toISOString().slice(0, 10))
  }
  return days
}

function formatDayLabel(isoDate) {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem ? `${h}h ${rem}m` : `${h}h`
}

export function computeAnalyticsStats(data = readAnalytics()) {
  const views = Object.entries(data.lessonViews)
  const totalViews = views.reduce((n, [, c]) => n + c, 0)
  const totalTimeSeconds = Object.values(data.lessonTimeSeconds).reduce(
    (n, s) => n + s,
    0,
  )

  const mostVisited = views
    .map(([key, count]) => {
      const { topicSlug, lessonId } = parseLessonKey(key)
      return {
        key,
        topicSlug,
        lessonId,
        title: data.lessonTitles[key] ?? lessonId,
        views: count,
        timeSeconds: data.lessonTimeSeconds[key] ?? 0,
      }
    })
    .sort((a, b) => b.views - a.views || b.timeSeconds - a.timeSeconds)
    .slice(0, 10)

  const weekDays = lastNDays(7)
  const weeklyTime = weekDays.map((day) => ({
    label: formatDayLabel(day),
    day,
    value: Math.round((data.dailyTimeSeconds[day] ?? 0) / 60),
    valueSeconds: data.dailyTimeSeconds[day] ?? 0,
  }))
  const weekTotalSeconds = weekDays.reduce(
    (n, day) => n + (data.dailyTimeSeconds[day] ?? 0),
    0,
  )

  const quizLine = [...data.quizzes]
    .sort((a, b) => new Date(a.at) - new Date(b.at))
    .slice(-20)
    .map((q, i) => ({
      label: `#${i + 1}`,
      value: q.percent,
      at: q.at,
      lessonTitle: q.lessonTitle,
      correct: q.correct,
      total: q.total,
    }))

  const quizCount = data.quizzes.length
  const avgQuizPercent = quizCount
    ? Math.round(
        data.quizzes.reduce((n, q) => n + q.percent, 0) / quizCount,
      )
    : 0
  const quizCompletionRate = quizCount
    ? Math.round(
        (data.quizzes.filter((q) => q.percent >= 50).length / quizCount) * 100,
      )
    : 0

  const recentSearches = [...data.searchQueries].reverse().slice(0, 8)
  const recentLessons = [...(data.recentLessonViews ?? [])].slice(0, MAX_RECENT_LESSONS)

  return {
    totalViews,
    totalTimeSeconds,
    totalTimeFormatted: formatDuration(totalTimeSeconds),
    weekTotalSeconds,
    weekTotalFormatted: formatDuration(weekTotalSeconds),
    mostVisited,
    weeklyTime,
    quizLine,
    quizCount,
    avgQuizPercent,
    quizCompletionRate,
    searchCount: data.searchQueries.length,
    bookmarksCount: data.bookmarksCount,
    recentSearches,
    recentLessons,
    hasData:
      totalViews > 0 ||
      totalTimeSeconds > 0 ||
      quizCount > 0 ||
      data.searchQueries.length > 0 ||
      data.bookmarksCount > 0 ||
      recentLessons.length > 0,
  }
}
