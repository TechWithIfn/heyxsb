import { lessonId } from './topics'

const EXCERPT_RADIUS = 70

function collectFields(lesson) {
  return {
    title: lesson.title ?? '',
    subtitle: lesson.subtitle ?? '',
    theory: lesson.theory ?? '',
    keyPoints: Array.isArray(lesson.keyPoints)
      ? lesson.keyPoints.join(' ')
      : '',
  }
}

function fieldMatches(text, queryLower) {
  return text && text.toLowerCase().includes(queryLower)
}

/**
 * @param {string} text
 * @param {string} query
 * @returns {{ text: string, highlight: boolean }[]}
 */
export function highlightExcerpt(text, query) {
  const q = query.trim()
  if (!text) return [{ text: '', highlight: false }]
  if (!q) {
    const short = text.length > 160 ? `${text.slice(0, 160)}…` : text
    return [{ text: short, highlight: false }]
  }

  const lower = text.toLowerCase()
  const ql = q.toLowerCase()
  const idx = lower.indexOf(ql)

  if (idx === -1) {
    const short = text.length > 160 ? `${text.slice(0, 160)}…` : text
    return [{ text: short, highlight: false }]
  }

  const start = Math.max(0, idx - EXCERPT_RADIUS)
  const end = Math.min(text.length, idx + q.length + EXCERPT_RADIUS)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  const slice = text.slice(start, end)
  const full = prefix + slice + suffix
  const matchStart = prefix.length + (idx - start)
  const matchEnd = matchStart + q.length

  const parts = []
  if (matchStart > 0) {
    parts.push({ text: full.slice(0, matchStart), highlight: false })
  }
  parts.push({ text: full.slice(matchStart, matchEnd), highlight: true })
  if (matchEnd < full.length) {
    parts.push({ text: full.slice(matchEnd), highlight: false })
  }
  return parts
}

function pickMatch(fields, queryLower, query) {
  const order = ['title', 'subtitle', 'theory', 'keyPoints']
  for (const key of order) {
    if (fieldMatches(fields[key], queryLower)) {
      return {
        matchedField: key,
        excerptParts: highlightExcerpt(fields[key], query),
      }
    }
  }
  return {
    matchedField: 'title',
    excerptParts: highlightExcerpt(fields.title, query),
  }
}

/** Build a search index from topic data loaded from the server */
export function buildSearchIndex(topics) {
  return topics.flatMap((topic) =>
    topic.lessons.map((lesson) => {
      const fields = collectFields(lesson)
      return {
        topicSlug: topic.slug,
        topicTitle: topic.title,
        lessonId: lessonId(lesson),
        title: fields.title,
        subtitle: fields.subtitle,
        fields,
        searchText: Object.values(fields).join(' ').toLowerCase(),
      }
    }),
  )
}

/**
 * @param {string} query
 * @returns {Array<{
 *   topicSlug: string,
 *   topicTitle: string,
 *   lessonId: string,
 *   title: string,
 *   subtitle: string,
 *   matchedField: string,
 *   excerptParts: { text: string, highlight: boolean }[],
 * }>}
 */
export function searchLessons(query, searchIndex) {
  const q = query.trim()
  if (!q || !searchIndex?.length) return []

  const queryLower = q.toLowerCase()
  const tokens = queryLower.split(/\s+/).filter(Boolean)

  return searchIndex
    .filter((item) => {
      if (item.searchText.includes(queryLower)) return true
      if (
        item.title.toLowerCase().includes(queryLower) ||
        item.subtitle.toLowerCase().includes(queryLower)
      ) {
        return true
      }
      return tokens.every((token) => item.searchText.includes(token))
    })
    .map((item) => {
      const { matchedField, excerptParts } = pickMatch(
        item.fields,
        queryLower,
        q,
      )
      return {
        topicSlug: item.topicSlug,
        topicTitle: item.topicTitle,
        lessonId: item.lessonId,
        title: item.title,
        subtitle: item.subtitle,
        matchedField,
        excerptParts,
      }
    })
}

/**
 * @param {ReturnType<searchLessons>} results
 */
export function groupResultsByTopic(results) {
  const groups = new Map()

  for (const item of results) {
    if (!groups.has(item.topicSlug)) {
      groups.set(item.topicSlug, {
        topicSlug: item.topicSlug,
        topicTitle: item.topicTitle,
        lessons: [],
      })
    }
    groups.get(item.topicSlug).lessons.push(item)
  }

  return Array.from(groups.values())
}

export const SEARCH_TOPIC_ORDER = [
  'html',
  'css',
  'javascript',
  'python',
  'sql',
  'java',
  'dsa',
  'react',
]

export function sortGroupedResults(groups) {
  return [...groups].sort((a, b) => {
    const ai = SEARCH_TOPIC_ORDER.indexOf(a.topicSlug)
    const bi = SEARCH_TOPIC_ORDER.indexOf(b.topicSlug)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })
}
