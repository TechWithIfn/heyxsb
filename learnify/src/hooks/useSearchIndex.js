import { useEffect, useMemo, useState } from 'react'
import { useTopics } from '../context/TopicsContext'
import { buildSearchIndex, buildIpuIndex } from '../lib/search'
import { getTopics, LIVE_TOPIC_SLUGS } from '../lib/topics'
import { loadBranchCatalog } from '../ipu/utils/navigationData'

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

  const [branches, setBranches] = useState(null)

  useEffect(() => {
    let active = true
    loadBranchCatalog().then((data) => {
      if (!active) return
      setBranches(Array.isArray(data) ? data : [])
    })
    return () => {
      active = false
    }
  }, [])

  return useMemo(() => {
    const topics = getTopics()
    if (topics.length === 0) return { index: [], loading }

    const topicIndex = buildSearchIndex(topics)
    const ipuIndex = buildIpuIndex(branches || [])

    return { index: [...topicIndex, ...ipuIndex], loading }
  }, [version, loading, branches])
}
