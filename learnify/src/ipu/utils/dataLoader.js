import branchList from '../data/branches.json'
import cseQuizBank from '../data/cse/quizBank.json'
import { buildTopicQuiz } from '../../lib/quiz'
import { normalizeSubject } from './navigationData'

const semesterModuleLoaders = import.meta.glob('../data/**/sem*.json')
const semesterDataCache = new Map()
const branchDataCache = new Map()

function normalizeBranchId(branchId) {
  return String(branchId ?? '').trim().toLowerCase()
}

function normalizeSemNumber(semNumber) {
  const parsed = Number.parseInt(semNumber, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function getSemesterFilePath(branchId, semNumber) {
  const normalizedBranchId = normalizeBranchId(branchId)
  const normalizedSemNumber = normalizeSemNumber(semNumber)

  if (!normalizedBranchId || !normalizedSemNumber) {
    return null
  }

  return `../data/${normalizedBranchId}/sem${normalizedSemNumber}.json`
}

async function loadSemesterData(branchId, semNumber) {
  const cacheKey = `${normalizeBranchId(branchId)}:${normalizeSemNumber(semNumber)}`

  if (semesterDataCache.has(cacheKey)) {
    return semesterDataCache.get(cacheKey)
  }

  const filePath = getSemesterFilePath(branchId, semNumber)
  if (!filePath || !semesterModuleLoaders[filePath]) {
    semesterDataCache.set(cacheKey, Promise.resolve(null))
    return null
  }

  const loadingPromise = semesterModuleLoaders[filePath]()
    .then((module) => (Array.isArray(module.default) ? module.default : []))
    .then((subjects) => subjects.map((subject) => enrichSubjectQuiz(normalizeSubject(subject))))
    .catch(() => null)

  semesterDataCache.set(cacheKey, loadingPromise)
  return loadingPromise
}

function collectTopicText(topic) {
  const content = topic?.content ?? {}
  const theory = Array.isArray(content.theory) ? content.theory.join(' ') : ''
  return {
    theory,
    definitionText: content.definition?.text ?? '',
    keyPoints: Array.isArray(content.keyPoints) ? content.keyPoints : [],
    formulas: Array.isArray(content.formulas) ? content.formulas : [],
    examples: Array.isArray(content.examples) ? content.examples : [],
    examQuestions: Array.isArray(content.examQuestions) ? content.examQuestions : [],
    pyqs: Array.isArray(content.pyqs) ? content.pyqs : [],
    notes: Array.isArray(content.notes) ? content.notes : [],
  }
}

function enrichSubjectQuiz(subject) {
  const units = Array.isArray(subject?.units) ? subject.units : []
  const unitTitles = units.map((unit) => unit?.title ?? `Unit ${unit?.unitNumber ?? 1}`)

  const subjectQuizBank = Array.isArray(cseQuizBank)
    ? cseQuizBank.filter((entry) => String(entry?.subjectId ?? '').toLowerCase() === String(subject?.id ?? '').toLowerCase())
    : []

  return {
    ...subject,
    units: units.map((unit) => {
      const topics = Array.isArray(unit?.topics) ? unit.topics : []
      const peerTopicTitles = topics.map((topic) => topic?.title ?? '').filter(Boolean)

      return {
        ...unit,
        topics: topics.map((topic) => {
          const quizSource = collectTopicText(topic)
          const manualQuiz = subjectQuizBank.find(
            (entry) => String(entry?.topicId ?? '').toLowerCase() === String(topic?.id ?? '').toLowerCase(),
          )?.quiz ?? []
          const quiz = buildTopicQuiz({
            subjectName: subject?.name ?? '',
            unitTitle: unit?.title ?? `Unit ${unit?.unitNumber ?? 1}`,
            unitNumber: unit?.unitNumber ?? 1,
            topicTitle: topic?.title ?? '',
            difficulty:
              unit?.unitNumber <= 2
                ? 'Beginner'
                : unit?.unitNumber <= 4
                  ? 'Intermediate'
                  : 'Advanced',
            peerTopicTitles: peerTopicTitles.filter((title) => title !== topic?.title),
            peerUnitTitles: unitTitles.filter((title) => title !== unit?.title),
            manualQuiz,
            ...quizSource,
          })

          return {
            ...topic,
            quiz,
          }
        }),
      }
    }),
  }
}
export async function loadSubjectData(branchId, semNumber, subjectId) {
  const subjects = await loadSemesterData(branchId, semNumber)

  if (!Array.isArray(subjects)) {
    return null
  }

  const targetId = String(subjectId ?? '').trim().toLowerCase()
  if (!targetId) {
    return null
  }

  return (
    subjects.find((subject) => String(subject?.id ?? '').trim().toLowerCase() === targetId) ??
    null
  )
}

export async function loadBranchData(branchId) {
  const normalizedBranchId = normalizeBranchId(branchId)
  if (!normalizedBranchId) {
    return null
  }

  if (branchDataCache.has(normalizedBranchId)) {
    return branchDataCache.get(normalizedBranchId)
  }

  const branchInfo = branchList.find(
    (branch) => String(branch?.id ?? '').trim().toLowerCase() === normalizedBranchId,
  )

  if (!branchInfo) {
    branchDataCache.set(normalizedBranchId, Promise.resolve(null))
    return null
  }

  const semesters = await Promise.all(
    Array.from({ length: branchInfo.totalSemesters ?? 0 }, async (_, index) => {
      const semNumber = index + 1
      const subjects = await loadSemesterData(normalizedBranchId, semNumber)

      return {
        semNumber,
        subjectCount: Array.isArray(subjects) ? subjects.length : 0,
      }
    }),
  )

  const branchData = {
    ...branchInfo,
    semesters,
  }

  branchDataCache.set(normalizedBranchId, Promise.resolve(branchData))
  return branchData
}

export function getAllTopicsFlat(subject) {
  if (!subject?.units || !Array.isArray(subject.units)) {
    return []
  }

  const flatTopics = []

  subject.units.forEach((unit, unitIndex) => {
    const topics = Array.isArray(unit?.topics) ? unit.topics : []

    topics.forEach((topic) => {
      flatTopics.push({
        ...topic,
        unitId: unit?.id ?? `unit-${unitIndex + 1}`,
        unitTitle: unit?.title ?? `Unit ${unitIndex + 1}`,
        unitNumber: unit?.unitNumber ?? unitIndex + 1,
        topicId: topic?.id ?? '',
        topicTitle: topic?.title ?? '',
        topicIndex: flatTopics.length,
        unitIndex,
      })
    })
  })

  return flatTopics
}