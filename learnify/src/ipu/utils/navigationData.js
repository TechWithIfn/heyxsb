import branchList from '../data/branches.json'
import { getEnglishName } from './translate'

const semesterLoaders = import.meta.glob('../data/**/sem*.json')
const semesterCache = new Map()
const branchCache = new Map()
const RECENT_ACTIVITY_KEY = 'ipu_recent_activity_v1'
export const IPU_RECENT_ACTIVITY_EVENT = 'learnify-ipu-recent-activity-updated'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeBranchId(branchId) {
  return normalizeText(branchId).toLowerCase()
}

function normalizeSemNumber(semNumber) {
  const parsed = Number.parseInt(semNumber, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function getSemesterPath(branchId, semNumber) {
  const normalizedBranchId = normalizeBranchId(branchId)
  const normalizedSemNumber = normalizeSemNumber(semNumber)

  if (!normalizedBranchId || !normalizedSemNumber) {
    return null
  }

  return `../data/${normalizedBranchId}/sem${normalizedSemNumber}.json`
}

export function getBranchMeta(branchId) {
  const normalizedBranchId = normalizeBranchId(branchId)

  if (!normalizedBranchId) {
    return null
  }

  return (
    branchList.find(
      (branch) => normalizeBranchId(branch?.id) === normalizedBranchId,
    ) ?? null
  )
}

export function getBranchProgramGroup(branch) {
  const branchId = normalizeBranchId(branch?.id)

  if (branchId === 'bca') {
    return 'bca'
  }

  if (branchId === 'mca' || branchId === 'mba') {
    return 'pg'
  }

  return 'btech'
}

export function getBranchProgramLabel(branch) {
  const group = getBranchProgramGroup(branch)

  if (group === 'pg') {
    return 'PG'
  }

  if (group === 'bca') {
    return 'BCA'
  }

  return 'B.Tech'
}

export function getBranchFilterGroup(branch) {
  return getBranchProgramGroup(branch)
}

function normalizeTopic(topic, fallbackIndex) {
  return {
    ...topic,
    id: normalizeText(topic?.id) || `topic-${fallbackIndex + 1}`,
    title: normalizeText(topic?.title) || `Topic ${fallbackIndex + 1}`,
  }
}

function normalizeUnit(unit, fallbackIndex) {
  const topics = Array.isArray(unit?.topics)
    ? unit.topics.map((topic, topicIndex) => normalizeTopic(topic, topicIndex))
    : []

  return {
    ...unit,
    id: normalizeText(unit?.id) || `unit-${fallbackIndex + 1}`,
    title: normalizeText(unit?.title) || `Unit ${fallbackIndex + 1}`,
    unitNumber: Number(unit?.unitNumber ?? fallbackIndex + 1),
    topics,
  }
}

export function normalizeSubject(subject) {
  const units = Array.isArray(subject?.units)
    ? subject.units.map((unit, unitIndex) => normalizeUnit(unit, unitIndex))
    : []

  return {
    ...subject,
    id: normalizeText(subject?.id),
    name: normalizeText(subject?.name),
    subjectCode: normalizeText(subject?.subjectCode ?? subject?.code),
    code: normalizeText(subject?.code ?? subject?.subjectCode),
    shortName: normalizeText(subject?.shortName),
    description: normalizeText(subject?.description),
    credits: Number(subject?.credits ?? 0),
    type: normalizeText(subject?.type).toLowerCase() || 'theory',
    units,
  }
}

export function countSubjectUnits(subject) {
  return Array.isArray(subject?.units) ? subject.units.length : 0
}

export function countSubjectTopics(subject) {
  if (!Array.isArray(subject?.units)) {
    return 0
  }

  return subject.units.reduce(
    (total, unit) => total + (Array.isArray(unit?.topics) ? unit.topics.length : 0),
    0,
  )
}

export function summarizeSemester(subjects) {
  return subjects.reduce(
    (summary, subject) => ({
      subjectCount: summary.subjectCount + 1,
      totalCredits: summary.totalCredits + Number(subject?.credits ?? 0),
      totalUnits: summary.totalUnits + countSubjectUnits(subject),
      totalTopics: summary.totalTopics + countSubjectTopics(subject),
    }),
    { subjectCount: 0, totalCredits: 0, totalUnits: 0, totalTopics: 0 },
  )
}

function buildSearchIndex(branch, semesters) {
  const parts = [getEnglishName(branch), branch.shortName, branch.description, branch.id]

  semesters.forEach((semester) => {
    parts.push(`semester ${semester.semNumber}`)
    semester.subjects.forEach((subject) => {
    parts.push(getEnglishName(subject), subject.subjectCode, subject.code, subject.description)
      subject.units.forEach((unit) => {
        parts.push(unit.title)
        unit.topics.forEach((topic) => {
          parts.push(topic.title)
          if (Array.isArray(topic.subtopics)) {
            parts.push(...topic.subtopics)
          }
        })
      })
    })
  })

  return parts.filter(Boolean).join(' ').toLowerCase()
}

export async function loadSemesterSubjects(branchId, semNumber) {
  const cacheKey = `${normalizeBranchId(branchId)}:${normalizeSemNumber(semNumber)}`

  if (semesterCache.has(cacheKey)) {
    return semesterCache.get(cacheKey)
  }

  const filePath = getSemesterPath(branchId, semNumber)
  if (!filePath || !semesterLoaders[filePath]) {
    semesterCache.set(cacheKey, Promise.resolve([]))
    return []
  }

  const loadingPromise = semesterLoaders[filePath]()
    .then((module) => (Array.isArray(module.default) ? module.default : []))
    .then((subjects) => subjects.map((subject) => normalizeSubject(subject)))
    .catch(() => [])

  semesterCache.set(cacheKey, loadingPromise)
  return loadingPromise
}

export async function loadBranchDetail(branchId) {
  const normalizedBranchId = normalizeBranchId(branchId)

  if (branchCache.has(normalizedBranchId)) {
    return branchCache.get(normalizedBranchId)
  }

  const branch = getBranchMeta(normalizedBranchId)
  if (!branch) {
    branchCache.set(normalizedBranchId, Promise.resolve(null))
    return null
  }

  const loadingPromise = Promise.all(
    Array.from({ length: branch.totalSemesters ?? 0 }, async (_, index) => {
      const semNumber = index + 1
      const subjects = await loadSemesterSubjects(normalizedBranchId, semNumber)
      const summary = summarizeSemester(subjects)

      return {
        semNumber,
        subjects,
        ...summary,
      }
    }),
  ).then((semesters) => {
    const overview = semesters.reduce(
      (summary, semester) => ({
        subjectCount: summary.subjectCount + semester.subjectCount,
        totalCredits: summary.totalCredits + semester.totalCredits,
        totalUnits: summary.totalUnits + semester.totalUnits,
        totalTopics: summary.totalTopics + semester.totalTopics,
      }),
      { subjectCount: 0, totalCredits: 0, totalUnits: 0, totalTopics: 0 },
    )

    return {
      ...branch,
      programGroup: getBranchFilterGroup(branch),
      programLabel: getBranchProgramLabel(branch),
      semesters,
      overview,
      searchIndex: buildSearchIndex(branch, semesters),
    }
  })

  branchCache.set(normalizedBranchId, loadingPromise)
  return loadingPromise
}

export async function loadBranchCatalog() {
  return Promise.all(branchList.map((branch) => loadBranchDetail(branch.id)))
}

export function buildFirstSubjectRoute(branch) {
  if (!branch) {
    return '/ipu'
  }

  const firstSemester = branch.semesters?.find((semester) => semester.subjects?.length > 0)
  const firstSubject = firstSemester?.subjects?.[0]

  if (!firstSemester || !firstSubject) {
    return `/ipu/${branch.id}`
  }

  return `/ipu/${branch.id}/${firstSemester.semNumber}/${firstSubject.id}`
}

function safeReadRecentActivity() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(RECENT_ACTIVITY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function safeWriteRecentActivity(items) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent(IPU_RECENT_ACTIVITY_EVENT))
  } catch {
    /* storage blocked */
  }
}

export function readRecentSubjects() {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const now = Date.now()
  return safeReadRecentActivity()
    .filter((item) => (now - (item.updatedAt || 0)) <= ONE_DAY_MS)
    .slice(0, 3)
}

export function readRecentTopicVisits() {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000
  const now = Date.now()
  return safeReadRecentActivity()
    .filter((item) => (now - (item.updatedAt || 0)) <= ONE_DAY_MS)
    .slice(0, 6)
}

export function recordRecentSubjectVisit(entry) {
  const branchId = normalizeBranchId(entry?.branchId)
  const semNumber = normalizeSemNumber(entry?.semNumber)
  const subjectId = normalizeText(entry?.subjectId)
  const topicId = normalizeText(entry?.topicId)

  if (!branchId || !semNumber || !subjectId) {
    return
  }

  const nextEntry = {
    branchId,
    semNumber,
    subjectId,
    subjectName: normalizeText(entry?.subjectName),
    subjectCode: normalizeText(entry?.subjectCode),
    branchName: normalizeText(entry?.branchName),
    branchShortName: normalizeText(entry?.branchShortName),
    unitId: normalizeText(entry?.unitId),
    unitTitle: normalizeText(entry?.unitTitle),
    topicId,
    topicTitle: normalizeText(entry?.topicTitle),
    updatedAt: Date.now(),
  }

  const current = safeReadRecentActivity().filter((item) => {
    const matchesSubject =
      normalizeBranchId(item?.branchId) === branchId &&
      normalizeSemNumber(item?.semNumber) === semNumber &&
      normalizeText(item?.subjectId) === subjectId

    if (!matchesSubject) {
      return true
    }

    if (!topicId) {
      return false
    }

    return normalizeText(item?.topicId) !== topicId
  })

  safeWriteRecentActivity([nextEntry, ...current].slice(0, 6))
}
