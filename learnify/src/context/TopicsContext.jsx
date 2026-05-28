import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  getTopic,
  getTopics,
  loadAllTopics,
  loadTopic,
  LIVE_TOPIC_SLUGS,
} from '../lib/topics'

const TopicsContext = createContext(null)

export function TopicsProvider({ children }) {
  const [version, setVersion] = useState(0)

  const bump = useCallback(() => {
    setVersion((v) => v + 1)
  }, [])

  const ensureTopic = useCallback(
    async (slug) => {
      if (getTopic(slug)) return getTopic(slug)
      const topic = await loadTopic(slug)
      bump()
      return topic
    },
    [bump],
  )

  const ensureAllTopics = useCallback(async () => {
    if (getTopics().length >= LIVE_TOPIC_SLUGS.length) {
      return getTopics()
    }
    const topics = await loadAllTopics()
    bump()
    return topics
  }, [bump])

  const value = useMemo(
    () => ({
      version,
      ensureTopic,
      ensureAllTopics,
    }),
    [version, ensureTopic, ensureAllTopics],
  )

  return (
    <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>
  )
}

export function useTopics() {
  const ctx = useContext(TopicsContext)
  if (!ctx) {
    throw new Error('useTopics must be used within TopicsProvider')
  }
  return ctx
}
