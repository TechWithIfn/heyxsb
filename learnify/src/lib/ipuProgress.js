export function semProgressKey(branchId, semNumber) {
  return `ipu_sem_progress_${branchId}_${semNumber}`
}

export function readSemProgress(branchId, semNumber) {
  try {
    const raw = localStorage.getItem(semProgressKey(branchId, semNumber))
    const value = parseInt(raw ?? '0', 10)
    if (Number.isNaN(value)) return 0
    return Math.min(100, Math.max(0, value))
  } catch {
    return 0
  }
}

export function writeSemProgress(branchId, semNumber, percent) {
  try {
    const value = Math.min(100, Math.max(0, Math.round(percent)))
    localStorage.setItem(semProgressKey(branchId, semNumber), String(value))
  } catch {
    /* storage blocked */
  }
}

export function subjectProgressKey(branchId, semNum, subjectId) {
  return `ipu_subject_progress_${branchId}_${semNum}_${subjectId}`
}

export function readSubjectProgress(branchId, semNum, subjectId) {
  try {
    const raw = localStorage.getItem(subjectProgressKey(branchId, semNum, subjectId))
    const value = parseInt(raw ?? '0', 10)
    if (Number.isNaN(value)) return 0
    return Math.min(100, Math.max(0, value))
  } catch {
    return 0
  }
}

export function writeSubjectProgress(branchId, semNum, subjectId, percent) {
  try {
    const value = Math.min(100, Math.max(0, Math.round(percent)))
    localStorage.setItem(
      subjectProgressKey(branchId, semNum, subjectId),
      String(value),
    )
  } catch {
    /* storage blocked */
  }
}
