import { useCallback, useSyncExternalStore } from 'react'
import {
  IPU_SUBJECT_STORAGE_EVENT,
  readBookmarks,
  readReadTopics,
} from '../lib/ipuSubjectStorage'
import { readSubjectProgress } from '../lib/ipuProgress'

function subscribe(callback) {
  const handler = () => callback()
  window.addEventListener(IPU_SUBJECT_STORAGE_EVENT, handler)
  return () => window.removeEventListener(IPU_SUBJECT_STORAGE_EVENT, handler)
}

export function useIpuSubjectStorage(branchId, semNum, subjectId, totalTopics) {
  const getSnapshot = useCallback(
    () => ({
      bookmarks: readBookmarks(subjectId),
      readTopics: readReadTopics(subjectId),
      progress: readSubjectProgress(branchId, semNum, subjectId),
      readCount: readReadTopics(subjectId).length,
      totalTopics,
    }),
    [branchId, semNum, subjectId, totalTopics],
  )

  const getServerSnapshot = useCallback(
    () => ({
      bookmarks: [],
      readTopics: [],
      progress: 0,
      readCount: 0,
      totalTopics,
    }),
    [totalTopics],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
