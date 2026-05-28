const STORAGE_KEY = 'learnify-ipu-bookmarks'
const BOOKMARK_EVENT = 'learnify-ipu-bookmarks-updated'

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readBookmarks() {
  const storage = getStorage()
  if (!storage) {
    return []
  }

  try {
    const raw = storage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function writeBookmarks(items) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event(BOOKMARK_EVENT))
  } catch {
    /* storage blocked */
  }
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function toBookmarkKey({ branchId, sem, subjectId, topicId }) {
  return [branchId, sem, subjectId, topicId].map((value) => normalizeText(value).toLowerCase()).join('|')
}

export function saveBookmark(data) {
  const next = {
    branchId: normalizeText(data?.branchId).toLowerCase(),
    sem: Number.parseInt(data?.sem, 10),
    subjectId: normalizeText(data?.subjectId),
    subjectName: normalizeText(data?.subjectName),
    unitId: normalizeText(data?.unitId),
    unitTitle: normalizeText(data?.unitTitle),
    topicId: normalizeText(data?.topicId),
    topicTitle: normalizeText(data?.topicTitle),
    savedAt: new Date().toISOString(),
  }

  const current = readBookmarks().filter((item) => toBookmarkKey(item) !== toBookmarkKey(next))
  writeBookmarks([next, ...current])
}

export function removeBookmark(branchId, sem, subjectId, topicId) {
  const target = toBookmarkKey({ branchId, sem, subjectId, topicId })
  const next = readBookmarks().filter((item) => toBookmarkKey(item) !== target)
  writeBookmarks(next)
}

export function isBookmarked(branchId, sem, subjectId, topicId) {
  const target = toBookmarkKey({ branchId, sem, subjectId, topicId })
  return readBookmarks().some((item) => toBookmarkKey(item) === target)
}

export function getAllBookmarks() {
  return readBookmarks().sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
}

export function clearAll() {
  writeBookmarks([])
}
