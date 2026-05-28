import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllTopicsFlat, loadSubjectData } from '../utils/dataLoader'
import { getBranchMeta } from '../utils/navigationData'
import { registerSubjectSnapshot } from './useIPUProgress'

function makeStorageKey(branchId, semNumber, subjectId) {
  return `ipu-last-${String(branchId ?? '').toLowerCase()}-${semNumber}-${subjectId}`
}

function makeVisitedKey(branchId, semNumber, subjectId) {
  return `ipu-visited-${String(branchId ?? '').toLowerCase()}-${semNumber}-${subjectId}`
}

function safeReadLocalStorage(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeWriteLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage failures in private browsing / disabled storage environments.
  }
}

function safeReadTopicSet(key) {
  const rawValue = safeReadLocalStorage(key)
  if (!rawValue) {
    return new Set()
  }

  try {
    const parsed = JSON.parse(rawValue)
    return new Set(Array.isArray(parsed) ? parsed.filter(Boolean) : [])
  } catch {
    return new Set()
  }
}

function safeWriteTopicSet(key, topicSet) {
  safeWriteLocalStorage(key, JSON.stringify(Array.from(topicSet)))
}

function resolveTopicById(flatTopics, topicId) {
  const targetTopicId = String(topicId ?? '').trim()
  if (!targetTopicId) {
    return null
  }

  return flatTopics.find((topic) => String(topic?.topicId ?? '') === targetTopicId) ?? null
}

export function useSubjectData(branchId, semNumber, subjectId, initialTopicId) {
  const storageKey = useMemo(
    () => makeStorageKey(branchId, semNumber, subjectId),
    [branchId, semNumber, subjectId],
  )
  const visitedKey = useMemo(
    () => makeVisitedKey(branchId, semNumber, subjectId),
    [branchId, semNumber, subjectId],
  )

  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeUnit, setActiveUnit] = useState(null)
  const [activeTopic, setActiveTopicState] = useState(null)
  const [visitedTopics, setVisitedTopics] = useState(() => safeReadTopicSet(visitedKey))

  const allTopicsFlat = useMemo(() => getAllTopicsFlat(subject), [subject])

  useEffect(() => {
    setVisitedTopics(safeReadTopicSet(visitedKey))
  }, [visitedKey])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setSubject(null)
      setActiveUnit(null)
      setActiveTopicState(null)

      try {
        const loadedSubject = await loadSubjectData(branchId, semNumber, subjectId)

        if (cancelled) {
          return
        }

        registerSubjectSnapshot(branchId, semNumber, subjectId, loadedSubject, getBranchMeta(branchId))
        setSubject(loadedSubject)
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load subject content.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [branchId, semNumber, subjectId])

  useEffect(() => {
    if (!subject || allTopicsFlat.length === 0) {
      return
    }

    const initialTopic = resolveTopicById(allTopicsFlat, initialTopicId)
    const restoredTopicId = safeReadLocalStorage(storageKey)
    const restoredTopic = resolveTopicById(allTopicsFlat, restoredTopicId)
    const nextTopic = initialTopic ?? restoredTopic ?? null

    if (!nextTopic) {
      return
    }

    setActiveUnit(nextTopic.unitNumber ?? nextTopic.unitIndex + 1)
    setActiveTopicState(nextTopic)
    setVisitedTopics((current) => {
      const nextVisited = new Set(current)
      nextVisited.add(nextTopic.topicId)
      safeWriteTopicSet(visitedKey, nextVisited)
      safeWriteLocalStorage(storageKey, nextTopic.topicId)
      return nextVisited
    })
  }, [allTopicsFlat, initialTopicId, storageKey, subject, visitedKey])

  const setActiveTopic = useCallback(
    (topicId) => {
      const nextTopic = resolveTopicById(allTopicsFlat, topicId)
      if (!nextTopic) {
        return null
      }

      setActiveUnit(nextTopic.unitNumber ?? nextTopic.unitIndex + 1)
      setActiveTopicState(nextTopic)
      setVisitedTopics((current) => {
        const nextVisited = new Set(current)
        nextVisited.add(nextTopic.topicId)
        safeWriteTopicSet(visitedKey, nextVisited)
        return nextVisited
      })
      safeWriteLocalStorage(storageKey, nextTopic.topicId)
      return nextTopic
    },
    [allTopicsFlat, storageKey, visitedKey],
  )

  const currentTopicIndex = activeTopic?.topicIndex ?? -1
  const prevTopic = currentTopicIndex > 0 ? allTopicsFlat[currentTopicIndex - 1] ?? null : null
  const nextTopic =
    currentTopicIndex >= 0 && currentTopicIndex < allTopicsFlat.length - 1
      ? allTopicsFlat[currentTopicIndex + 1] ?? null
      : null

  return {
    subject,
    loading,
    error,
    activeUnit,
    activeTopic,
    setActiveTopic,
    allTopicsFlat,
    prevTopic,
    nextTopic,
    visitedTopics,
  }
}