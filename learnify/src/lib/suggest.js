const POPULAR_TOPICS = [
  { slug: 'html', title: 'HTML' },
  { slug: 'css', title: 'CSS' },
  { slug: 'javascript', title: 'JavaScript' },
  { slug: 'python', title: 'Python' },
  { slug: 'sql', title: 'SQL' },
  { slug: 'react', title: 'React' },
]

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }
  return dp[m][n]
}

export function suggestTopics(input) {
  const q = (input ?? '').toLowerCase().trim()
  if (!q) return POPULAR_TOPICS.slice(0, 4)

  const scored = POPULAR_TOPICS.map((topic) => {
    const slug = topic.slug
    const title = topic.title.toLowerCase()
    let score = levenshtein(q, slug)
    if (slug.includes(q) || q.includes(slug)) score -= 3
    if (title.includes(q)) score -= 2
    return { topic, score }
  })
    .sort((a, b) => a.score - b.score)
    .filter((x) => x.score <= 4)
    .slice(0, 4)
    .map((x) => x.topic)

  return scored.length ? scored : POPULAR_TOPICS.slice(0, 4)
}

export function extractSlugFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  return parts[0] ?? ''
}
