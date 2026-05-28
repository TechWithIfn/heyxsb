import { useEffect, useState } from 'react'
import { useTopics } from '../context/TopicsContext'
import {
  getTopic,
  isComingSoonSlug,
  isValidTopicSlug,
} from '../lib/topics'

export function useTopic(slug) {
  const { version, ensureTopic } = useTopics()
  const comingSoon = Boolean(slug && isComingSoonSlug(slug))
  const [loading, setLoading] = useState(
    () =>
      Boolean(slug && isValidTopicSlug(slug) && !comingSoon && !getTopic(slug)),
  )
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug || !isValidTopicSlug(slug) || comingSoon) {
      setLoading(false)
      setError(null)
      return
    }

    if (getTopic(slug)) {
      setLoading(false)
      setError(null)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    ensureTopic(slug)
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Failed to load topic',
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug, version, ensureTopic, comingSoon])

  return {
    topic: getTopic(slug),
    loading,
    error,
    comingSoon,
  }
}
