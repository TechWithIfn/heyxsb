import { getTopic, lessonId, LIVE_TOPIC_SLUGS } from './topics'

export const STORAGE_KEY = 'learnify-progress'
const EVENT_NAME = 'progress-changed'

const EMPTY = { completed: [], activityDates: [] }

let cachedRaw = null
let cachedData = EMPTY

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export function progressKey(topicSlug, lessonIdParam) {
  return `${topicSlug}/${lessonIdParam}`
}

function normalizeStored(data) {
  const completed = Array.isArray(data?.completed)
    ? [...new Set(data.completed.filter((k) => typeof k === 'string'))]
    : []
  const activityDates = Array.isArray(data?.activityDates)
    ? [...new Set(data.activityDates.filter((d) => typeof d === 'string'))]
    : []
  return { completed, activityDates }
}

export function readProgress() {
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

function writeProgress(data) {
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

function recordActivityDate(dates) {
  const today = todayString()
  if (dates.includes(today)) return dates
  return [...dates, today]
}

export function isLessonComplete(topicSlug, lessonIdParam) {
  if (!topicSlug || !lessonIdParam) return false
  const key = progressKey(topicSlug, lessonIdParam)
  return readProgress().completed.includes(key)
}

/**
 * @returns {boolean} true if now complete, false if unmarked
 */
export function toggleLessonComplete(topicSlug, lessonIdParam) {
  const key = progressKey(topicSlug, lessonIdParam)
  const data = readProgress()
  const completed = [...data.completed]
  const index = completed.indexOf(key)
  let activityDates = data.activityDates

  if (index >= 0) {
    completed.splice(index, 1)
  } else {
    completed.push(key)
    activityDates = recordActivityDate(activityDates)
  }

  writeProgress({ completed, activityDates })
  return index < 0
}

export function setLessonComplete(topicSlug, lessonIdParam, done) {
  const key = progressKey(topicSlug, lessonIdParam)
  const data = readProgress()
  const has = data.completed.includes(key)

  if (done && !has) {
    writeProgress({
      completed: [...data.completed, key],
      activityDates: recordActivityDate(data.activityDates),
    })
    return true
  }

  if (!done && has) {
    writeProgress({
      completed: data.completed.filter((k) => k !== key),
      activityDates: data.activityDates,
    })
    return false
  }

  return has
}

export function getTopicProgress(topicSlug) {
  const topic = getTopic(topicSlug)
  const total = topic?.lessons?.length ?? 0
  if (!total) return { done: 0, total: 0, percent: 0 }

  const completedSet = new Set(readProgress().completed)
  let done = 0
  for (const lesson of topic.lessons) {
    const id = lessonId(lesson)
    if (completedSet.has(progressKey(topicSlug, id))) done += 1
  }

  const percent = total ? Math.round((done / total) * 100) : 0
  return { done, total, percent }
}

export function calculateStreak(activityDates) {
  if (!activityDates?.length) return 0

  const set = new Set(activityDates)
  const cursor = new Date()
  const today = todayString()

  if (!set.has(today)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  for (let i = 0; i < 366; i++) {
    const key = cursor.toISOString().slice(0, 10)
    if (!set.has(key)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getOverallProgressStats() {
  const slugs = LIVE_TOPIC_SLUGS
  const completedSet = new Set(readProgress().completed)
  let totalLessons = 0
  let totalDone = 0

  const byTopic = slugs.map((slug) => {
    const topic = getTopic(slug)
    const total = topic?.lessons?.length ?? 0
    let done = 0
    for (const lesson of topic?.lessons ?? []) {
      const id = lessonId(lesson)
      if (completedSet.has(progressKey(slug, id))) done += 1
    }
    totalLessons += total
    totalDone += done
    const percent = total ? Math.round((done / total) * 100) : 0
    return {
      slug,
      title: topic?.title ?? slug,
      done,
      total,
      percent,
    }
  })

  const { activityDates } = readProgress()
  const streakDays = calculateStreak(activityDates)
  const overallPercent = totalLessons
    ? Math.round((totalDone / totalLessons) * 100)
    : 0

  return {
    totalDone,
    totalLessons,
    overallPercent,
    streakDays,
    byTopic,
    activityDates: [...activityDates].sort().reverse(),
  }
}

export function subscribeProgress(callback) {
  const onChange = () => {
    cachedRaw = null
    callback()
  }
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY || e.key === null) onChange()
  }
  window.addEventListener(EVENT_NAME, onChange)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(EVENT_NAME, onChange)
    window.removeEventListener('storage', onStorage)
  }
}
