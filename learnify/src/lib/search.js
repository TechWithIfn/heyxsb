import { lessonId } from './topics'
import { getEnglishName } from '../ipu/utils/translate'

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
 * Build IPU subject entries to include in the search index.
 * Each subject becomes a searchable entry that navigates to `/ipu/{branchId}/{sem}/{subjectId}`.
 * @param {Array} branches - branch details from navigationData.loadBranchCatalog()
 */
export function buildIpuIndex(branches) {
  if (!Array.isArray(branches) || branches.length === 0) return []

  const items = []

  for (const branch of branches) {
    if (!branch || !Array.isArray(branch.semesters)) continue

    for (const sem of branch.semesters) {
      const semNumber = sem.semNumber
      const topicSlug = `ipu/${branch.id}/${semNumber}`
      const topicTitle = `${branch.shortName || getEnglishName(branch)} — Semester ${semNumber}`

      for (const subject of sem.subjects ?? []) {
        const fields = {
          title: getEnglishName(subject) || subject.name || '',
          subtitle: subject.subjectCode || subject.code || '',
          theory: subject.description || '',
          keyPoints: Array.isArray(subject.keyPoints) ? subject.keyPoints.join(' ') : '',
        }

        const searchTextParts = [getEnglishName(branch) || branch.name, branch.shortName, `semester ${semNumber}`, getEnglishName(subject) || subject.name, subject.subjectCode, subject.code, subject.description]

        for (const unit of subject.units ?? []) {
          searchTextParts.push(unit.title || '')
          for (const topic of unit.topics ?? []) {
            searchTextParts.push(topic.title || '')
            if (Array.isArray(topic.subtopics)) searchTextParts.push(...topic.subtopics)
          }
        }

        items.push({
          topicSlug,
          topicTitle,
          lessonId: subject.id,
          title: fields.title,
          subtitle: fields.subtitle,
          fields,
          searchText: searchTextParts.filter(Boolean).join(' ').toLowerCase(),
        })
      }
    }
  }

  return items
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
 * Search IPU subject entries scoped to a branch and semester.
 * Returns items with the same shape as searchLessons results so the UI can render them.
 */
export function searchIpuSubjects(query, searchIndex, branchId, semNumber) {
  const q = query.trim()
  if (!q || !searchIndex?.length) return []

  const queryLower = q.toLowerCase()
  const tokens = queryLower.split(/\s+/).filter(Boolean)
  const normalizedBranch = String(branchId || '').toLowerCase()

  return searchIndex
    .filter((item) => {
      if (!item.topicSlug) return false

      // topicSlug for IPU items is `ipu/{branch}/{sem}`
      const parts = item.topicSlug.split('/')
      if (parts.length < 3) return false
      const itemBranch = parts[1]
      const itemSem = parts[2]

      if (itemBranch !== normalizedBranch) return false

      if (semNumber != null) {
        if (Number(itemSem) !== Number(semNumber)) return false
      }

      // simple single-word match: include if title or subtitle includes the query
      if (item.title.toLowerCase().includes(queryLower)) return true
      if (item.subtitle && item.subtitle.toLowerCase().includes(queryLower)) return true

      // fallback to searching the combined searchText tokens
      if (tokens.length === 0) return false

      // fuzzy single-word match: allow small edit distance for short queries
      if (tokens.length === 1 && tokens[0].length > 2) {
        const token = tokens[0]
        const title = String(item.title || '').toLowerCase()
        if (title.includes(token)) return true
        // compute simple edit distance
        function editDistance(a, b) {
          const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
          for (let i = 0; i <= a.length; i++) dp[i][0] = i
          for (let j = 0; j <= b.length; j++) dp[0][j] = j
          for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
              if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1]
              else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            }
          }
          return dp[a.length][b.length]
        }

        const dist = editDistance(title, token)
        if (dist <= Math.max(1, Math.floor(token.length * 0.25))) return true
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
