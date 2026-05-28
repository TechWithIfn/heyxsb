import { useEffect, useMemo, useState } from 'react'
import { useTopics } from '../context/TopicsContext'
import { buildSearchIndex } from '../lib/search'
import { getTopics, LIVE_TOPIC_SLUGS } from '../lib/topics'

export function useSearchIndex() {
  const { version, ensureAllTopics } = useTopics()
  const [loading, setLoading] = useState(
    () => getTopics().length < LIVE_TOPIC_SLUGS.length,
  )

  useEffect(() => {
    if (getTopics().length >= LIVE_TOPIC_SLUGS.length) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    ensureAllTopics().finally(() => {
      if (active) setLoading(false)
    })

    return () => {
      active = false
    }
  }, [ensureAllTopics, version])

  return useMemo(() => {
    const topics = getTopics()
    if (topics.length === 0) return { index: [], loading }
    return { index: buildSearchIndex(topics), loading }
  }, [version, loading])
}
