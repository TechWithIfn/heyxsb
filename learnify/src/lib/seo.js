export const SITE_NAME = 'LearnTheory'

const DEFAULT_DESCRIPTION =
  'Free, open-source programming tutorials with theory, examples, and quizzes. Learn HTML, CSS, JavaScript, Python, and more.'

export function getSiteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return import.meta.env.VITE_SITE_URL?.trim() || 'https://learn-theory.github.io'
}

function truncate(text, max = 160) {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

/**
 * @param {object} params
 * @param {object} params.lesson
 * @param {string} params.topicSlug
 * @param {string} params.topicTitle
 * @param {string} params.lessonId
 */
export function buildLessonSeo({ lesson, topicSlug, topicTitle, lessonId }) {
  const pageTitle = `${lesson.title} — ${topicTitle} Tutorial`
  const fullTitle = `${pageTitle} | ${SITE_NAME}`
  const description = truncate(
    lesson.subtitle ||
      lesson.theory?.split('\n\n')[0] ||
      `Learn ${lesson.title} in our free ${topicTitle} course.`,
  )
  const canonical = `${getSiteOrigin()}/${topicSlug}/${lessonId}`
  const keywords = [
    topicTitle,
    lesson.title,
    ...(Array.isArray(lesson.tags) ? lesson.tags : []),
    'tutorial',
    'learn programming',
    SITE_NAME,
  ].join(', ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description,
    url: canonical,
    inLanguage: 'en',
    isAccessibleForFree: true,
    learningResourceType: 'Lesson',
    isPartOf: {
      '@type': 'Course',
      name: `${topicTitle} Tutorial`,
      provider: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  }

  return {
    pageTitle,
    fullTitle,
    description,
    canonical,
    keywords,
    jsonLd,
    ogType: 'article',
  }
}

export function buildDefaultSeo() {
  return {
    fullTitle: `${SITE_NAME} — Learn to Code Free`,
    description: DEFAULT_DESCRIPTION,
    canonical: getSiteOrigin(),
    keywords: 'programming, tutorials, HTML, CSS, JavaScript, Python, free courses',
    jsonLd: null,
    ogType: 'website',
  }
}
