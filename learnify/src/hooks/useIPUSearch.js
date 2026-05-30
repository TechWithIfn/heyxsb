import { useEffect, useMemo, useRef, useState } from 'react'
import ipuBranches from '../data/ipuData.js'
import { getEnglishName } from '../ipu/utils/translate'

const EMPTY = { branches: [], subjects: [], topics: [] }

function matches(query, text) {
  if (!text || typeof text !== 'string') return false
  return text.toLowerCase().includes(query)
}

function buildSearchIndex(query) {
  const q = query.trim().toLowerCase()
  if (!q) return EMPTY

  const branches = []
  const subjects = []
  const topics = []

  for (const branch of ipuBranches) {
    const branchMatch =
      matches(q, getEnglishName(branch)) ||
      matches(q, branch.shortName) ||
      matches(q, branch.id)

    if (branchMatch) {
      branches.push({
        type: 'branch',
        branchId: branch.id,
        semNum: null,
        subjectId: null,
        topicId: null,
        name: getEnglishName(branch),
        shortName: branch.shortName,
        icon: branch.icon,
        breadcrumb: 'IPU Syllabus',
        path: `/ipu-syllabus/${branch.id}`,
      })
    }

    for (const sem of branch.semesters) {
      for (const subject of sem.subjects) {
        const subjectMatch =
          matches(q, getEnglishName(subject)) ||
          matches(q, subject.subjectCode) ||
          matches(q, subject.description)

        if (subjectMatch) {
          subjects.push({
            type: 'subject',
            branchId: branch.id,
            semNum: sem.semNumber,
            subjectId: subject.id,
            topicId: null,
            name: getEnglishName(subject),
            shortName: branch.shortName,
            icon: branch.icon,
            breadcrumb: `${branch.shortName} · Semester ${sem.semNumber}`,
            path: `/ipu-syllabus/${branch.id}/semester/${sem.semNumber}/subject/${subject.id}`,
            subjectCode: subject.subjectCode,
          })
        }

        for (const unit of subject.units) {
          for (const topic of unit.topics) {
                if (
              matches(q, topic.title) ||
              matches(q, topic.content?.slice(0, 200))
            ) {
              topics.push({
                type: 'topic',
                branchId: branch.id,
                semNum: sem.semNumber,
                subjectId: subject.id,
                topicId: topic.id,
                name: topic.title,
                shortName: branch.shortName,
                icon: branch.icon,
                breadcrumb: `${branch.shortName} · Sem ${sem.semNumber} · ${getEnglishName(subject)}`,
                path: `/ipu-syllabus/${branch.id}/semester/${sem.semNumber}/subject/${subject.id}#${topic.id}`,
                subjectCode: subject.subjectCode,
              })
            }
          }
        }
      }
    }
  }

  return { branches, subjects, topics }
}

export default function useIPUSearch(query) {
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [query])

  return useMemo(() => buildSearchIndex(debouncedQuery), [debouncedQuery])
}
