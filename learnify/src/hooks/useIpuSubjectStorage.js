import { useCallback, useMemo, useSyncExternalStore } from 'react'
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
  const snapshot = useMemo(() => {
    const readTopics = readReadTopics(subjectId)
    return {
      bookmarks: readBookmarks(subjectId),
      readTopics,
      progress: readSubjectProgress(branchId, semNum, subjectId),
      readCount: readTopics.length,
      totalTopics,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, semNum, subjectId, totalTopics])

  const serverSnapshot = useMemo(() => ({
    bookmarks: [],
    readTopics: [],
    progress: 0,
    readCount: 0,
    totalTopics,
  }), [totalTopics])

  const getSnapshot = useCallback(() => snapshot, [snapshot])
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
