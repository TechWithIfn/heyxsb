import { writeSubjectProgress } from './ipuProgress.js'

export const IPU_SUBJECT_STORAGE_EVENT = 'ipu-subject-storage-changed'

function emitChange() {
  window.dispatchEvent(new CustomEvent(IPU_SUBJECT_STORAGE_EVENT))
}

export function bookmarksKey(subjectId) {
  return `ipu_bookmarks_${subjectId}`
}

export function readTopicsKey(subjectId) {
  return `ipu_read_topics_${subjectId}`
}

export function readBookmarks(subjectId) {
  try {
    const raw = localStorage.getItem(bookmarksKey(subjectId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function isBookmarked(subjectId, topicId) {
  return readBookmarks(subjectId).includes(topicId)
}

export function toggleBookmark(subjectId, topicId) {
  const list = readBookmarks(subjectId)
  const next = list.includes(topicId)
    ? list.filter((id) => id !== topicId)
    : [...list, topicId]
  try {
    localStorage.setItem(bookmarksKey(subjectId), JSON.stringify(next))
    emitChange()
  } catch {
    /* ignore */
  }
  return next
}

export function readReadTopics(subjectId) {
  try {
    const raw = localStorage.getItem(readTopicsKey(subjectId))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function isTopicRead(subjectId, topicId) {
  return readReadTopics(subjectId).includes(topicId)
}

export function getAllTopicIds(subject) {
  if (!subject?.units) return []
  return subject.units.flatMap((u) => u.topics.map((t) => t.id))
}

export function computeProgressPercent(readIds, totalTopics) {
  if (!totalTopics) return 0
  return Math.min(100, Math.round((readIds.length / totalTopics) * 100))
}

export function markTopicRead(
  branchId,
  semNum,
  subjectId,
  topicId,
  totalTopics,
) {
  const list = readReadTopics(subjectId)
  const next = list.includes(topicId) ? list : [...list, topicId]
  try {
    localStorage.setItem(readTopicsKey(subjectId), JSON.stringify(next))
    const percent = computeProgressPercent(next, totalTopics)
    writeSubjectProgress(branchId, semNum, subjectId, percent)
    emitChange()
  } catch {
    /* ignore */
  }
  return next
}

export function countReadTopics(subjectId, totalTopics) {
  return readReadTopics(subjectId).length
}

export function getAllBookmarkedTopics() {
  const entries = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith('ipu_bookmarks_')) continue

      const subjectId = key.slice('ipu_bookmarks_'.length)
      let topicIds = []
      try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
        topicIds = Array.isArray(parsed)
          ? parsed.filter((id) => typeof id === 'string')
          : []
      } catch {
        topicIds = []
      }

      if (topicIds.length === 0) continue
      entries.push({ subjectId, topicIds })
    }
  } catch {
    return []
  }

  return entries
}
