const STORAGE_KEY = 'learn-theory-bookmarks'
const EVENT_NAME = 'bookmarks-changed'

const EMPTY_BOOKMARKS = []

let cachedRaw = null
let cachedList = EMPTY_BOOKMARKS

export function bookmarkKey(topicSlug, lessonId) {
  return `${topicSlug}/${lessonId}`
}

export function readBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? ''
    if (raw === cachedRaw) {
      return cachedList
    }
    cachedRaw = raw
    if (!raw) {
      cachedList = EMPTY_BOOKMARKS
      return cachedList
    }
    const parsed = JSON.parse(raw)
    cachedList = Array.isArray(parsed) ? parsed : EMPTY_BOOKMARKS
    return cachedList
  } catch {
    cachedRaw = ''
    cachedList = EMPTY_BOOKMARKS
    return cachedList
  }
}

function writeBookmarks(list) {
  try {
    const next = JSON.stringify(list)
    localStorage.setItem(STORAGE_KEY, next)
    cachedRaw = next
    cachedList = list
    window.dispatchEvent(new CustomEvent(EVENT_NAME))
    import('./analytics.js').then(({ syncBookmarkCount }) => {
      syncBookmarkCount(list.length)
    })
  } catch {
    /* storage full or blocked */
  }
}

export function isBookmarked(topicSlug, lessonId) {
  const key = bookmarkKey(topicSlug, lessonId)
  return readBookmarks().some(
    (b) => bookmarkKey(b.topicSlug, b.lessonId) === key,
  )
}

/**
 * @param {object} entry
 * @param {string} entry.topicSlug
 * @param {string} entry.topicTitle
 * @param {string} entry.lessonId
 * @param {string} entry.lessonTitle
 * @param {string} [entry.subtitle]
 * @returns {boolean} true if now bookmarked, false if removed
 */
export function toggleBookmark(entry) {
  const list = [...readBookmarks()]
  const key = bookmarkKey(entry.topicSlug, entry.lessonId)
  const index = list.findIndex(
    (b) => bookmarkKey(b.topicSlug, b.lessonId) === key,
  )

  if (index >= 0) {
    list.splice(index, 1)
    writeBookmarks(list)
    return false
  }

  list.unshift({
    topicSlug: entry.topicSlug,
    topicTitle: entry.topicTitle,
    lessonId: entry.lessonId,
    lessonTitle: entry.lessonTitle,
    subtitle: entry.subtitle ?? '',
    savedAt: new Date().toISOString(),
  })
  writeBookmarks(list)
  return true
}

export function removeBookmark(topicSlug, lessonId) {
  const key = bookmarkKey(topicSlug, lessonId)
  const list = readBookmarks().filter(
    (b) => bookmarkKey(b.topicSlug, b.lessonId) !== key,
  )
  writeBookmarks(list)
}

export function subscribeBookmarks(callback) {
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
