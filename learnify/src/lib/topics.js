export const LIVE_TOPIC_SLUGS = [
  'html',
  'css',
  'javascript',
  'python',
  'sql',
  'java',
  'dsa',
  'react',
]

export const COMING_SOON_SLUGS = []

export const TOPIC_SLUGS = [...LIVE_TOPIC_SLUGS, ...COMING_SOON_SLUGS]

export const COMING_SOON_META = {}

/** Slugs that must not be treated as topic routes */
export const RESERVED_SLUGS = [
  'topics',
  'bookmarks',
  'references',
  'quiz',
  'about',
  'roadmap',
  'progress',
  'search',
  'changelog',
  'analytics',
  'ipu-syllabus',
  '404',
]

let topicRegistry = Object.create(null)
const inflightLoads = new Map()

export function setTopicRegistry(registry) {
  topicRegistry = registry ?? Object.create(null)
}

export function registerTopic(slug, topic) {
  topicRegistry = { ...topicRegistry, [slug]: topic }
}

export function isReservedSlug(slug) {
  return RESERVED_SLUGS.includes(slug)
}

export function isComingSoonSlug(slug) {
  return COMING_SOON_SLUGS.includes(slug)
}

export function isValidTopicSlug(slug) {
  return TOPIC_SLUGS.includes(slug)
}

export function isLiveTopicSlug(slug) {
  return LIVE_TOPIC_SLUGS.includes(slug)
}

export function getComingSoonMeta(slug) {
  return COMING_SOON_META[slug]
}

export function getTopic(slug) {
  if (!slug || isReservedSlug(slug) || isComingSoonSlug(slug)) return undefined
  return topicRegistry[slug]
}

export function getTopicSlugs() {
  return LIVE_TOPIC_SLUGS.filter((slug) => topicRegistry[slug])
}

export function getTopics() {
  return LIVE_TOPIC_SLUGS.map((slug) => topicRegistry[slug]).filter(Boolean)
}

export function isTopicLoaded(slug) {
  return Boolean(topicRegistry[slug])
}

export async function fetchTopicFromServer(slug) {
  const res = await fetch(`/content/${slug}.json`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
  })
  if (!res.ok) {
    throw new Error(`Failed to load topic "${slug}" (${res.status})`)
  }
  return res.json()
}

/** Load a single live topic JSON on demand (deduped in-flight requests). */
export async function loadTopic(slug) {
  if (isComingSoonSlug(slug)) {
    throw new Error(`Topic "${slug}" is not available yet`)
  }

  if (!isLiveTopicSlug(slug)) {
    throw new Error(`Unknown topic "${slug}"`)
  }

  const cached = getTopic(slug)
  if (cached) return cached

  if (inflightLoads.has(slug)) {
    return inflightLoads.get(slug)
  }

  const promise = fetchTopicFromServer(slug)
    .then((topic) => {
      registerTopic(slug, topic)
      inflightLoads.delete(slug)
      return topic
    })
    .catch((err) => {
      inflightLoads.delete(slug)
      throw err
    })

  inflightLoads.set(slug, promise)
  return promise
}

/** Load every live topic (e.g. search / progress). */
export async function loadAllTopics() {
  await Promise.all(LIVE_TOPIC_SLUGS.map((slug) => loadTopic(slug)))
  return getTopics()
}

export function lessonId(lesson) {
  return lesson?.id ?? lesson?.slug
}

export function getLesson(topicSlug, lessonIdParam) {
  const topic = getTopic(topicSlug)
  if (!topic) return undefined
  return topic.lessons.find((l) => lessonId(l) === lessonIdParam)
}

export function getFirstLessonId(topicSlug) {
  const topic = getTopic(topicSlug)
  const first = topic?.lessons[0]
  return first ? lessonId(first) : undefined
}

export function getLessonDescription(lesson) {
  if (!lesson) return ''
  return lesson.subtitle ?? lesson.description ?? ''
}

/** Build sidebar sections from topic JSON or a single default group */
export function getSidebarSections(topic) {
  if (!topic) return []

  if (topic.sidebarSections?.length) {
    return topic.sidebarSections.map((section) => ({
      heading: section.heading,
      lessons: section.lessonIds
        .map((id) => topic.lessons.find((l) => lessonId(l) === id))
        .filter(Boolean),
    }))
  }

  return [
    {
      heading: `${topic.title} Tutorial`,
      lessons: topic.lessons,
    },
  ]
}
