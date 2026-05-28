const STORAGE_KEY = 'learnify-ipu-progress-v2'
const PROGRESS_EVENT = 'learnify-ipu-progress-updated'

const subjectSnapshotCache = new Map()
const semesterSnapshotCache = new Map()

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeKeyPart(value) {
  return normalizeText(value).toLowerCase()
}

function buildTopicKey(branchId, sem, subjectId, unitId, topicId) {
  return [branchId, sem, subjectId, unitId, topicId].map(normalizeKeyPart).join('|')
}

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readProgressStore() {
  const storage = getStorage()
  if (!storage) {
    return {}
  }

  try {
    const raw = storage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeProgressStore(store) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event(PROGRESS_EVENT))
  } catch {
    /* storage blocked */
  }
}

function countTopicsInUnit(unit) {
  return Array.isArray(unit?.topics) ? unit.topics.length : 0
}

function countDoneInUnit(store, branchId, sem, subjectId, unitId) {
  const prefix = [branchId, sem, subjectId, unitId].map(normalizeKeyPart).join('|')

  return Object.entries(store).reduce((count, [key, entry]) => {
    if (!entry?.done) {
      return count
    }

    return key.startsWith(prefix) ? count + 1 : count
  }, 0)
}

function getEntry(branchId, sem, subjectId, unitId, topicId) {
  const store = readProgressStore()
  return store[buildTopicKey(branchId, sem, subjectId, unitId, topicId)] ?? null
}

function toLocalDay(dateLike) {
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toDayString(date) {
  return date.toISOString().slice(0, 10)
}

function getSubjectSnapshot(branchId, sem, subjectId) {
  return subjectSnapshotCache.get(
    [branchId, sem, subjectId].map(normalizeKeyPart).join('|'),
  ) ?? null
}

function getSemesterSnapshot(branchId, sem) {
  return semesterSnapshotCache.get([branchId, sem].map(normalizeKeyPart).join('|')) ?? null
}

function buildSubjectSnapshot(branchId, sem, subjectId, subject, branchMeta) {
  const units = Array.isArray(subject?.units) ? subject.units : []
  const normalizedUnits = units.map((unit, unitIndex) => {
    const topics = Array.isArray(unit?.topics) ? unit.topics : []

    return {
      unitId: normalizeText(unit?.id) || `unit-${unitIndex + 1}`,
      unitNumber: Number(unit?.unitNumber ?? unitIndex + 1),
      unitTitle: normalizeText(unit?.title) || `Unit ${unitIndex + 1}`,
      total: topics.length,
      topics: topics.map((topic, topicIndex) => ({
        topicId: normalizeText(topic?.id) || `topic-${topicIndex + 1}`,
        topicTitle: normalizeText(topic?.title) || `Topic ${topicIndex + 1}`,
      })),
    }
  })

  return {
    branchId: normalizeKeyPart(branchId),
    sem: Number.parseInt(sem, 10),
    subjectId: normalizeKeyPart(subjectId),
    subjectName: normalizeText(subject?.name),
    subjectCode: normalizeText(subject?.subjectCode ?? subject?.code),
    branchName: normalizeText(branchMeta?.name),
    branchShortName: normalizeText(branchMeta?.shortName),
    units: normalizedUnits,
    totalTopics: normalizedUnits.reduce((count, unit) => count + unit.total, 0),
  }
}

export function registerSubjectSnapshot(branchId, sem, subjectId, subject, branchMeta) {
  const snapshot = buildSubjectSnapshot(branchId, sem, subjectId, subject, branchMeta)
  subjectSnapshotCache.set([branchId, sem, subjectId].map(normalizeKeyPart).join('|'), snapshot)
  return snapshot
}

export function registerSemesterSnapshot(branchId, sem, subjects = [], branchMeta) {
  const subjectSnapshots = subjects.map((subject) =>
    registerSubjectSnapshot(branchId, sem, subject.id, subject, branchMeta),
  )

  const snapshot = {
    branchId: normalizeKeyPart(branchId),
    sem: Number.parseInt(sem, 10),
    subjectCount: subjectSnapshots.length,
    totalTopics: subjectSnapshots.reduce((count, subject) => count + subject.totalTopics, 0),
    subjects: subjectSnapshots.map((subject) => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      totalTopics: subject.totalTopics,
      units: subject.units,
    })),
  }

  semesterSnapshotCache.set([branchId, sem].map(normalizeKeyPart).join('|'), snapshot)
  return snapshot
}

export function clearIPUProgressMetadata() {
  subjectSnapshotCache.clear()
  semesterSnapshotCache.clear()
}

export function markDone(branchId, sem, subjectId, unitId, topicId, timeSpent = 0) {
  const store = readProgressStore()
  const key = buildTopicKey(branchId, sem, subjectId, unitId, topicId)
  const previous = store[key]
  const subjectSnapshot = getSubjectSnapshot(branchId, sem, subjectId)
  const unitSnapshot = subjectSnapshot?.units.find((unit) => unit.unitId === normalizeKeyPart(unitId))
  const topicSnapshot = unitSnapshot?.topics.find((topic) => topic.topicId === normalizeKeyPart(topicId))

  store[key] = {
    done: true,
    doneAt: new Date().toISOString(),
    timeSpent: Number(timeSpent) || previous?.timeSpent || 0,
    branchId: normalizeKeyPart(branchId),
    sem: Number.parseInt(sem, 10),
    subjectId: normalizeKeyPart(subjectId),
    unitId: normalizeKeyPart(unitId),
    topicId: normalizeKeyPart(topicId),
    branchName: subjectSnapshot?.branchName ?? '',
    branchShortName: subjectSnapshot?.branchShortName ?? '',
    subjectName: subjectSnapshot?.subjectName ?? '',
    subjectCode: subjectSnapshot?.subjectCode ?? '',
    unitTitle: unitSnapshot?.unitTitle ?? '',
    topicTitle: topicSnapshot?.topicTitle ?? '',
  }

  writeProgressStore(store)
}

export function markUndone(branchId, sem, subjectId, unitId, topicId) {
  const store = readProgressStore()
  const key = buildTopicKey(branchId, sem, subjectId, unitId, topicId)

  if (store[key]) {
    delete store[key]
    writeProgressStore(store)
  }
}

export function isDone(branchId, sem, subjectId, unitId, topicId) {
  return Boolean(getEntry(branchId, sem, subjectId, unitId, topicId)?.done)
}

export function getTopicProgress(branchId, sem, subjectId) {
  const snapshot = getSubjectSnapshot(branchId, sem, subjectId)

  if (!snapshot) {
    return { done: 0, total: 0, percent: 0, unitBreakdown: [] }
  }

  const store = readProgressStore()
  const done = snapshot.units.reduce((count, unit) => {
    return count + countDoneInUnit(store, branchId, sem, subjectId, unit.unitId)
  }, 0)

  return {
    done,
    total: snapshot.totalTopics,
    percent: snapshot.totalTopics === 0 ? 0 : Math.round((done / snapshot.totalTopics) * 100),
    unitBreakdown: snapshot.units.map((unit) => ({
      unitId: unit.unitId,
      done: countDoneInUnit(store, branchId, sem, subjectId, unit.unitId),
      total: unit.total,
    })),
  }
}

export function getCompletedTopicIds(branchId, sem, subjectId) {
  const snapshot = getSubjectSnapshot(branchId, sem, subjectId)

  if (!snapshot) {
    return new Set()
  }

  const store = readProgressStore()
  const completed = new Set()

  snapshot.units.forEach((unit) => {
    unit.topics.forEach((topic) => {
      const key = buildTopicKey(branchId, sem, subjectId, unit.unitId, topic.topicId)
      if (store[key]?.done) {
        completed.add(topic.topicId)
      }
    })
  })

  return completed
}

export function getSemProgress(branchId, sem, totalSubjects = 0) {
  const snapshot = getSemesterSnapshot(branchId, sem)

  if (!snapshot) {
    return totalSubjects > 0 ? 0 : 0
  }

  const store = readProgressStore()
  const done = snapshot.subjects.reduce((count, subject) => {
    const subjectDone = subject.units.reduce(
      (unitCount, unit) => unitCount + countDoneInUnit(store, branchId, sem, subject.subjectId, unit.unitId),
      0,
    )
    return count + subjectDone
  }, 0)

  return snapshot.totalTopics === 0 ? 0 : Math.round((done / snapshot.totalTopics) * 100)
}

export function getBranchProgress(branchId, totalTopics = 0) {
  if (totalTopics <= 0) {
    return 0
  }

  const prefix = normalizeKeyPart(branchId)
  const store = readProgressStore()
  const done = Object.entries(store).reduce((count, [key, entry]) => {
    if (!entry?.done) {
      return count
    }

    return key.startsWith(`${prefix}|`) ? count + 1 : count
  }, 0)

  return Math.round((done / totalTopics) * 100)
}

export function getStreak() {
  const store = readProgressStore()
  const dates = Object.values(store)
    .filter((entry) => entry?.done && entry.doneAt)
    .map((entry) => toLocalDay(entry.doneAt))
    .filter(Boolean)
    .map(toDayString)

  if (dates.length === 0) {
    return { current: 0, longest: 0, lastStudied: null }
  }

  const uniqueDays = Array.from(new Set(dates)).sort()
  const lastStudied = uniqueDays[uniqueDays.length - 1]

  let longest = 1
  let currentRun = 1

  for (let i = 1; i < uniqueDays.length; i += 1) {
    const previous = new Date(`${uniqueDays[i - 1]}T00:00:00`)
    const current = new Date(`${uniqueDays[i]}T00:00:00`)
    const diffDays = Math.round((current - previous) / 86400000)

    if (diffDays === 1) {
      currentRun += 1
      longest = Math.max(longest, currentRun)
    } else {
      currentRun = 1
    }
  }

  let current = 1
  let cursor = new Date(`${lastStudied}T00:00:00`)

  while (true) {
    const previous = new Date(cursor)
    previous.setDate(previous.getDate() - 1)
    const previousDay = toDayString(previous)

    if (!uniqueDays.includes(previousDay)) {
      break
    }

    current += 1
    cursor = previous
  }

  return { current, longest, lastStudied }
}

export function getTodayCount() {
  const store = readProgressStore()
  const today = toDayString(new Date())

  return Object.values(store).filter((entry) => {
    if (!entry?.done || !entry.doneAt) {
      return false
    }

    return toDayString(new Date(entry.doneAt)) === today
  }).length
}

export function getWeeklyData() {
  const store = readProgressStore()
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    const dayKey = toDayString(date)
    const count = Object.values(store).filter((entry) => {
      if (!entry?.done || !entry.doneAt) {
        return false
      }

      return toDayString(new Date(entry.doneAt)) === dayKey
    }).length

    return {
      day: labels[date.getDay()],
      date: dayKey,
      count,
    }
  })
}

export function getRecentActivity() {
  const store = readProgressStore()

  return Object.entries(store)
    .filter(([, entry]) => entry?.done && entry.doneAt)
    .sort((a, b) => new Date(b[1].doneAt) - new Date(a[1].doneAt))
    .slice(0, 10)
    .map(([key, entry]) => ({
      key,
      ...entry,
    }))
}

export function getAllTimeTotal() {
  const store = readProgressStore()
  return Object.values(store).filter((entry) => entry?.done).length
}

