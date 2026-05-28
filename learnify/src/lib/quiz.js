const GENERIC_DISTRACTORS = [
  'browser rendering and layout',
  'database normalization and joins',
  'network routing and protocols',
  'operating system scheduling',
  'machine learning model training',
  'file system permissions',
  'cloud deployment settings',
  'UI color palette design',
  'cryptography key exchange',
  'memory management and pointers',
  'algorithmic complexity analysis',
  'software testing strategy',
]

function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ')
}

function uniqueStrings(items) {
  const seen = new Set()
  const values = []

  for (const item of items) {
    const text = normalizeText(item)
    if (!text || seen.has(text.toLowerCase())) {
      continue
    }
    seen.add(text.toLowerCase())
    values.push(text)
  }

  return values
}

function shuffleArray(items) {
  const array = [...items]
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[array[index], array[swapIndex]] = [array[swapIndex], array[index]]
  }
  return array
}

function firstSentence(text) {
  const value = normalizeText(text)
  if (!value) {
    return ''
  }

  const match = value.match(/^[^.!?]+[.!?]?/)
  return normalizeText(match?.[0] ?? value).replace(/[.!?]+$/, '')
}

function compactText(text, fallback = 'the main concept') {
  const value = normalizeText(text)
  if (!value) {
    return fallback
  }

  const shortened = value.replace(/\s+/g, ' ').replace(/\.$/, '')
  return shortened.length > 110 ? `${shortened.slice(0, 107)}...` : shortened
}

function buildOptionQuestion({ question, correctAnswer, distractors = [], explanation, metadata = {} }) {
  const cleanCorrect = normalizeText(correctAnswer)
  if (!cleanCorrect) {
    return null
  }

  const options = uniqueStrings([cleanCorrect, ...distractors, ...GENERIC_DISTRACTORS]).slice(0, 4)
  while (options.length < 4) {
    const filler = GENERIC_DISTRACTORS[options.length % GENERIC_DISTRACTORS.length]
    if (!options.some((option) => option.toLowerCase() === filler.toLowerCase())) {
      options.push(filler)
    }
  }

  const shuffled = shuffleArray(options)
  const answer = shuffled.findIndex((option) => option === cleanCorrect)

  return {
    question: normalizeText(question),
    options: shuffled,
    answer: answer >= 0 ? answer : 0,
    explanation: normalizeText(explanation),
    ...metadata,
  }
}

function dedupeQuestions(quiz) {
  const seen = new Set()
  const items = []

  for (const item of quiz) {
    const question = normalizeText(item?.question)
    if (!question) {
      continue
    }

    const key = question.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    items.push(item)
  }

  return items
}

function normalizeQuizItem(item, metadata = {}) {
  if (!item || typeof item.question !== 'string') {
    return null
  }

  if (!Array.isArray(item.options) || item.options.length !== 4) {
    return null
  }

  const answer = Number(item.answer)
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) {
    return null
  }

  return {
    question: normalizeText(item.question),
    options: item.options.map((option) => normalizeText(option)),
    answer,
    explanation: normalizeText(item.explanation),
    ...metadata,
  }
}

function buildSupplementalFocus({ title, focusText, distractors, metadata }) {
  return buildOptionQuestion({
    question: `What is the main focus of ${title}?`,
    correctAnswer: compactText(focusText, title),
    distractors,
    explanation: `This topic centers on ${compactText(focusText, title)}.`,
    metadata,
  })
}

function buildSupplementalKeyPoint({ title, keyPoint, distractors, metadata }) {
  return buildOptionQuestion({
    question: `Which idea is emphasized in ${title}?`,
    correctAnswer: compactText(keyPoint, title),
    distractors,
    explanation: `The topic highlights ${compactText(keyPoint, title)}.`,
    metadata,
  })
}

function buildSupplementalFormula({ title, formulaLabel, distractors, metadata }) {
  return buildOptionQuestion({
    question: `Which formula or statement is associated with ${title}?`,
    correctAnswer: compactText(formulaLabel, title),
    distractors,
    explanation: `The topic explicitly includes ${compactText(formulaLabel, title)}.`,
    metadata,
  })
}

function buildSupplementalExample({ title, exampleLabel, distractors, metadata }) {
  return buildOptionQuestion({
    question: `Which example best matches ${title}?`,
    correctAnswer: compactText(exampleLabel, title),
    distractors,
    explanation: `A representative example for this topic is ${compactText(exampleLabel, title)}.`,
    metadata,
  })
}

function buildSupplementalExamQuestion({ title, examPrompt, distractors, metadata }) {
  return buildOptionQuestion({
    question: `Which exam-style prompt is linked to ${title}?`,
    correctAnswer: compactText(examPrompt, title),
    distractors,
    explanation: `The subject material prepares you for ${compactText(examPrompt, title)}.`,
    metadata,
  })
}

function buildSupplementalUnitQuestion({ title, unitLabel, distractors, metadata }) {
  return buildOptionQuestion({
    question: `Which unit is ${title} part of?`,
    correctAnswer: compactText(unitLabel, title),
    distractors,
    explanation: `${title} belongs to ${compactText(unitLabel, title)}.`,
    metadata,
  })
}

function buildGenericDistractors(sourceTexts = [], extra = []) {
  return uniqueStrings([
    ...sourceTexts,
    ...extra,
    ...GENERIC_DISTRACTORS,
  ]).slice(0, 6)
}

export function prepareQuizDeck(quiz = []) {
  return shuffleArray(
    dedupeQuestions(
      quiz
        .map((item) => normalizeQuizItem(item))
        .filter(Boolean),
    ),
  )
}

export function buildLessonQuizDeck({
  lessonTitle,
  theoryText,
  keyPoints = [],
  definitionText = '',
  codeExampleLabel = '',
  quiz = [],
  subjectLabel = '',
}) {
  const title = normalizeText(lessonTitle) || 'This lesson'
  const focusText = firstSentence(theoryText) || definitionText || keyPoints[0] || title
  const distractorPool = buildGenericDistractors(keyPoints, [
    codeExampleLabel,
    subjectLabel,
    title,
  ])

  const generated = [
    buildSupplementalFocus({
      title,
      focusText,
      distractors: distractorPool,
      metadata: { subject: subjectLabel, topic: title, difficulty: 'Beginner' },
    }),
    keyPoints[0]
      ? buildSupplementalKeyPoint({
          title,
          keyPoint: keyPoints[0],
          distractors: buildGenericDistractors(keyPoints.slice(1), distractorPool),
          metadata: { subject: subjectLabel, topic: title, difficulty: 'Beginner' },
        })
      : null,
    codeExampleLabel
      ? buildSupplementalExample({
          title,
          exampleLabel: codeExampleLabel,
          distractors: distractorPool,
          metadata: { subject: subjectLabel, topic: title, difficulty: 'Intermediate' },
        })
      : null,
    definitionText
      ? buildSupplementalExamQuestion({
          title,
          examPrompt: definitionText,
          distractors: distractorPool,
          metadata: { subject: subjectLabel, topic: title, difficulty: 'Intermediate' },
        })
      : null,
    buildSupplementalUnitQuestion({
      title,
      unitLabel: subjectLabel || title,
      distractors: distractorPool,
      metadata: { subject: subjectLabel, topic: title, difficulty: 'Beginner' },
    }),
  ].filter(Boolean)

  return prepareQuizDeck([...quiz, ...generated])
}

export function buildTopicQuiz({
  subjectName,
  unitTitle,
  unitNumber,
  topicTitle,
  theoryText,
  definitionText,
  keyPoints = [],
  formulas = [],
  examples = [],
  examQuestions = [],
  pyqs = [],
  notes = [],
  peerTopicTitles = [],
  peerUnitTitles = [],
  manualQuiz = [],
  difficulty = 'Beginner',
}) {
  const title = normalizeText(topicTitle) || 'This topic'
  const focusText = firstSentence(theoryText) || definitionText || keyPoints[0] || title
  const keyPoint = keyPoints[0] || focusText
  const formulaLabel = normalizeText(formulas?.[0]?.name || formulas?.[0]?.formula || '')
  const exampleLabel = normalizeText(examples?.[0]?.title || examples?.[0]?.problem || '')
  const examPrompt = normalizeText(examQuestions?.[0]?.question || pyqs?.[0]?.question || notes?.[0] || '')
  const unitLabel = normalizeText(unitTitle) || `Unit ${unitNumber ?? 1}`
  const distractorPool = buildGenericDistractors(
    [
      ...peerTopicTitles,
      ...peerUnitTitles,
      subjectName,
      unitLabel,
      title,
    ],
    [definitionText, keyPoint, exampleLabel, formulaLabel],
  )

  const quiz = [
    buildSupplementalFocus({
      title,
      focusText,
      distractors: buildGenericDistractors(peerTopicTitles, distractorPool),
      metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty },
    }),
    buildSupplementalKeyPoint({
      title,
      keyPoint,
      distractors: buildGenericDistractors(keyPoints.slice(1), distractorPool),
      metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty },
    }),
    (formulaLabel || exampleLabel)
      ? buildSupplementalFormula({
          title,
          formulaLabel: formulaLabel || exampleLabel,
          distractors: buildGenericDistractors([
            ...peerTopicTitles,
            ...peerUnitTitles,
            keyPoint,
          ], distractorPool),
          metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty: 'Intermediate' },
        })
      : null,
    examPrompt
      ? buildSupplementalExamQuestion({
          title,
          examPrompt,
          distractors: buildGenericDistractors(peerTopicTitles, peerUnitTitles),
          metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty: 'Intermediate' },
        })
      : null,
    buildSupplementalUnitQuestion({
      title,
      unitLabel,
      distractors: buildGenericDistractors(peerUnitTitles, peerTopicTitles),
      metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty: 'Beginner' },
    }),
  ].filter(Boolean)

  if (examples?.length) {
    quiz.push(
      buildSupplementalExample({
        title,
        exampleLabel,
        distractors: buildGenericDistractors(peerTopicTitles, peerUnitTitles),
        metadata: { subject: subjectName, unit: unitLabel, topic: title, difficulty: 'Intermediate' },
      }),
    )
  }

  return prepareQuizDeck([...(Array.isArray(manualQuiz) ? manualQuiz : []), ...quiz])
}
