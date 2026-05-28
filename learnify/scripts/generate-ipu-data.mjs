import { writeFileSync } from 'node:fs'
import { createCseMath1Subject } from './ipu-cse-math1.mjs'

function topic(
  id,
  title,
  content,
  keyPoints,
  examples = [],
  formulas = [],
  examQuestions,
  references,
) {
  return {
    id,
    title,
    content,
    keyPoints,
    examples,
    formulas,
    examQuestions,
    references,
  }
}

function unit(unitNumber, title, topics) {
  return { unitNumber, title, topics }
}

function subject(id, name, subjectCode, credits, type, description, units) {
  return { id, name, subjectCode, credits, type, description, units }
}

function sem(semNumber, subjects) {
  return { semNumber, subjects }
}

function emptySem(semNumber, subjectTuples) {
  return sem(
    semNumber,
    subjectTuples.map((t) => {
      const s = subject(...t, [])
      s.description = `${s.description} // TODO: add units`
      return s
    }),
  )
}

function ref(title, author) {
  return { title, author }
}

const cseSem1Math = createCseMath1Subject(topic, unit, subject, ref)

const subjectsStub = [
  ['applied-physics', 'Applied Physics', 'BAS-103', 4, 'theory', 'Mechanics, waves, optics, and modern physics for engineers.'],
  ['basic-electrical-engineering', 'Basic Electrical Engineering', 'BEE-101', 4, 'theory', 'DC circuits, network theorems, and electrical measurements.'],
  ['engineering-graphics', 'Engineering Graphics', 'BAS-107', 3, 'theory', 'Orthographic projection, sections, and CAD fundamentals.'],
  ['programming-in-c', 'Programming in C', 'BCS-101', 4, 'theory', 'Structured programming, pointers, and problem solving in C.'],
  ['communication-skills', 'Communication Skills', 'BHU-101', 2, 'theory', 'Technical communication, presentations, and professional writing.'],
]

function genericUnits(prefix, theme) {
  return [1, 2, 3].map((u) =>
    unit(u, `${theme} — Unit ${u}`, [
      topic(
        `${prefix}-u${u}-t1`,
        `${theme}: Core Concepts (Part A)`,
        `This unit develops foundational ideas in ${theme} aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.`,
        [
          'Master standard units and notation for the unit theme',
          'Apply definitions to numerical and conceptual questions',
          'Interpret diagrams used in IPU question papers',
          'Relate theory to lab/tutorial outcomes',
          'Build revision notes mapped to unit outcomes',
        ],
        [
          { title: 'Worked example', explanation: 'Stepwise solution showing given data, formula, and conclusion.' },
          { title: 'Concept map', explanation: 'Links prerequisites to advanced semester topics.' },
        ],
        [],
        [
          `Define key terms in ${theme} for Unit ${u}.`,
          'Solve a standard numerical from previous-year pattern.',
          'Explain assumptions in the model used.',
          'List common student errors and how to avoid them.',
          'Outline a 10-minute viva answer for this topic.',
        ],
        [ref('IPU Syllabus Handbook', 'GGSIPU'), ref('Standard Textbook', 'Faculty Board')],
      ),
      topic(
        `${prefix}-u${u}-t2`,
        `${theme}: Applications (Part B)`,
        `Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.`,
        [
          'Combine two concepts in multi-step problems',
          'Justify approximations with engineering reasoning',
          'Present solutions with neat units and significant figures',
          'Use graphs or sketches where they clarify reasoning',
          'Prepare short oral summaries for lab/viva',
        ],
        [
          { title: 'Case study', explanation: 'Realistic scenario requiring unit formulas and interpretation.' },
          { title: 'Design trade-off', explanation: 'Compare options using quantitative criteria.' },
        ],
        [],
        [
          'Solve an application-level numerical problem.',
          'Interpret a graph or circuit diagram provided.',
          'Discuss limitations of the ideal model.',
          'Write a brief lab report style conclusion.',
          'Map the topic to a future semester subject.',
        ],
        [ref('Engineering Applications', 'IPU Notes'), ref('Practice Problems', 'Dept. Compilation')],
      ),
    ]),
  )
}

const cseSem1Others = subjectsStub.map(([id, name, code, credits, type, desc]) =>
  subject(id, name, code, credits, type, desc, genericUnits(id.split('-')[0], name)),
)

const cseSem1 = [
  cseSem1Math,
  ...cseSem1Others,
]

const cseSem2Subjects = [
  ['mathematics-2', 'Mathematics-II', 'BAS-201', 4, 'theory', 'ODEs, PDE intro, Laplace transforms, and complex analysis.'],
  ['applied-chemistry', 'Applied Chemistry', 'BAS-203', 4, 'theory', 'Atomic structure, bonding, and engineering materials chemistry.'],
  ['electronic-devices-circuits', 'Electronic Devices & Circuits', 'BEC-201', 4, 'theory', 'Semiconductor devices, diodes, transistors, and amplifiers.'],
  ['workshop-practice', 'Workshop Practice', 'BCS-251', 2, 'lab', 'Fitting, welding, carpentry, and machining practice.'],
  ['oop-cpp', 'Object Oriented Programming with C++', 'BCS-201', 4, 'theory', 'Classes, inheritance, polymorphism, and STL in C++.'],
  ['environmental-studies', 'Environmental Studies', 'BAS-205', 2, 'theory', 'Ecology, pollution control, and sustainability.'],
]

const cseUpperSemSubjects = {
  3: [
    ['data-structures', 'Data Structures', 'BCS-301', 4, 'theory', 'Arrays, linked lists, stacks, queues, trees, and graphs.'],
    ['digital-electronics', 'Digital Electronics', 'BCS-303', 4, 'theory', 'Boolean algebra, combinational and sequential circuits.'],
    ['oop-java', 'Object Oriented Programming with Java', 'BCS-305', 4, 'theory', 'Java OOP, collections, exceptions, and GUIs.'],
    ['discrete-mathematics', 'Discrete Mathematics', 'BAS-301', 4, 'theory', 'Logic, sets, combinatorics, graphs, and proofs.'],
    ['computer-organisation', 'Computer Organisation', 'BCS-307', 4, 'theory', 'CPU design, ISA, memory hierarchy, and I/O.'],
    ['data-structures-lab', 'Data Structures Lab', 'BCS-351', 2, 'lab', 'Implementation of core data structures in C/C++.'],
  ],
  4: [
    ['analysis-of-algorithms', 'Analysis of Algorithms', 'BCS-401', 4, 'theory', 'Complexity, divide-and-conquer, DP, and greedy methods.'],
    ['dbms', 'Database Management Systems', 'BCS-403', 4, 'theory', 'ER model, SQL, normalization, and transactions.'],
    ['operating-systems', 'Operating Systems', 'BCS-405', 4, 'theory', 'Processes, scheduling, memory, and file systems.'],
    ['computer-networks', 'Computer Networks', 'BCS-407', 4, 'theory', 'OSI/TCP-IP, routing, transport, and application protocols.'],
    ['software-engineering', 'Software Engineering', 'BCS-409', 3, 'theory', 'SDLC, requirements, design, and testing.'],
  ],
  5: [
    ['compiler-design', 'Compiler Design', 'BCS-501', 4, 'theory', 'Lexical analysis, parsing, code generation, and optimization.'],
    ['web-technologies', 'Web Technologies', 'BCS-503', 3, 'theory', 'HTML, CSS, JavaScript, and server-side basics.'],
    ['artificial-intelligence', 'Artificial Intelligence', 'BCS-505', 4, 'theory', 'Search, knowledge representation, and reasoning.'],
    ['theory-of-computation', 'Theory of Computation', 'BCS-507', 3, 'theory', 'Automata, formal languages, and Turing machines.'],
  ],
  6: [
    ['machine-learning', 'Machine Learning', 'BCS-601', 4, 'theory', 'Supervised and unsupervised learning fundamentals.'],
    ['cloud-computing', 'Cloud Computing', 'BCS-603', 3, 'theory', 'Virtualization, IaaS/PaaS/SaaS, and deployment.'],
    ['information-security', 'Information Security', 'BCS-605', 4, 'theory', 'Cryptography, network security, and secure systems.'],
  ],
  7: [
    ['major-project-1', 'Major Project I', 'BCS-701', 6, 'theory', 'Project proposal, design, and partial implementation.'],
    ['elective-1', 'Department Elective I', 'BCS-E71', 3, 'theory', 'Specialized elective (e.g. IoT, Blockchain, NLP).'],
    ['elective-2', 'Department Elective II', 'BCS-E72', 3, 'theory', 'Specialized elective per college offering.'],
    ['elective-3', 'Department Elective III', 'BCS-E73', 3, 'theory', 'Specialized elective per college offering.'],
  ],
  8: [
    ['major-project-2', 'Major Project II', 'BCS-801', 8, 'theory', 'Complete project, report, and viva.'],
    ['elective-4', 'Department Elective IV', 'BCS-E81', 3, 'theory', 'Advanced elective topic.'],
    ['elective-5', 'Department Elective V', 'BCS-E82', 3, 'theory', 'Advanced elective topic.'],
    ['elective-6', 'Department Elective VI', 'BCS-E83', 3, 'theory', 'Advanced elective topic.'],
  ],
}

function buildCseSemesters() {
  const semesters = [sem(1, cseSem1)]
  semesters.push(emptySem(2, cseSem2Subjects))
  for (let n = 3; n <= 8; n++) {
    const list = cseUpperSemSubjects[n] || []
    semesters.push(emptySem(n, list))
  }
  return semesters
}

function branch(id, name, shortName, icon, color, description, totalSemesters, semesters) {
  return { id, name, shortName, icon, color, description, totalSemesters, semesters }
}

function twoSemSubjects(sem1List, sem2List) {
  return [emptySem(1, sem1List), emptySem(2, sem2List)]
}

const ipuBranches = [
  branch(
    'cse',
    'Computer Science & Engineering',
    'CSE',
    'Cpu',
    'text-blue-600',
    'IPU BTech CSE — software, systems, and computing foundations across eight semesters.',
    8,
    buildCseSemesters(),
  ),
  branch(
    'it',
    'Information Technology',
    'IT',
    'Monitor',
    'text-cyan-600',
    'IPU BTech IT — applications, networks, and enterprise information systems.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Engineering calculus and algebra.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Physics for IT infrastructure and hardware context.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EC-101', 4, 'theory', 'Electrical fundamentals for labs and hardware courses.'],
        ['engineering-graphics', 'Engineering Graphics', 'ME-103', 3, 'theory', 'Technical drawing and CAD basics.'],
        ['programming-in-c', 'Programming in C', 'BIT-101', 4, 'theory', 'Introductory programming and problem solving.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Professional communication.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'Advanced engineering mathematics.'],
        ['data-structures', 'Data Structures', 'BIT-201', 4, 'theory', 'Core data structures for application development.'],
        ['digital-electronics', 'Digital Electronics', 'EC-201', 4, 'theory', 'Digital logic for systems understanding.'],
        ['oop', 'Object Oriented Programming', 'BIT-202', 4, 'theory', 'OOP with C++/Java.'],
        ['database-systems', 'Database Management Systems', 'BIT-203', 4, 'theory', 'Relational databases and SQL.'],
        ['computer-networks-intro', 'Computer Networks', 'BIT-204', 3, 'theory', 'Networking fundamentals.'],
      ],
    ),
  ),
  branch(
    'ai-ds',
    'Artificial Intelligence & Data Science',
    'AI&DS',
    'Brain',
    'text-purple-600',
    'IPU BTech AI&DS — machine learning, statistics, and intelligent systems.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Calculus and linear algebra for ML.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Physics with computing applications.'],
        ['programming-in-c', 'Programming in C', 'BAI-101', 4, 'theory', 'C programming foundation.'],
        ['python-for-ai', 'Python for AI', 'BAI-102', 4, 'theory', 'Python, NumPy intro, and scripting.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EC-101', 4, 'theory', 'Electrical engineering basics.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Technical communication.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'ODEs and transforms.'],
        ['statistics', 'Probability & Statistics', 'BAI-201', 4, 'theory', 'Probability, distributions, and inference.'],
        ['data-structures', 'Data Structures', 'BAI-202', 4, 'theory', 'Structures for data-centric algorithms.'],
        ['digital-logic', 'Digital Logic Design', 'EC-201', 4, 'theory', 'Logic design for hardware interfaces.'],
        ['ml-intro', 'Introduction to Machine Learning', 'BAI-203', 3, 'theory', 'Supervised learning overview.'],
        ['database-systems', 'Database Systems', 'BAI-204', 3, 'theory', 'SQL and data warehousing basics.'],
      ],
    ),
  ),
  branch(
    'ece',
    'Electronics & Communication Engineering',
    'ECE',
    'Radio',
    'text-orange-600',
    'IPU BTech ECE — analog/digital electronics, signals, and communication systems.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Engineering mathematics I.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Physics for electronics.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EC-101', 4, 'theory', 'Circuits and measurements.'],
        ['engineering-graphics', 'Engineering Graphics', 'ME-103', 3, 'theory', 'Technical drawing.'],
        ['basic-electronics', 'Basic Electronics', 'ECE-101', 4, 'theory', 'Semiconductor devices and circuits.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Professional skills.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'Mathematics II.'],
        ['electronic-devices', 'Electronic Devices', 'ECE-201', 4, 'theory', 'Diodes, transistors, and amplifiers.'],
        ['network-analysis', 'Network Analysis & Synthesis', 'ECE-202', 4, 'theory', 'Two-port networks and theorems.'],
        ['signals-systems', 'Signals & Systems', 'ECE-203', 4, 'theory', 'CT/DT signals and LTI systems.'],
        ['electromagnetic-theory', 'Electromagnetic Theory', 'ECE-204', 4, 'theory', 'Maxwell equations and wave propagation.'],
        ['digital-electronics', 'Digital Electronics', 'ECE-205', 4, 'theory', 'Logic families and sequential circuits.'],
      ],
    ),
  ),
  branch(
    'eee',
    'Electrical & Electronics Engineering',
    'EEE',
    'Zap',
    'text-amber-600',
    'IPU BTech EEE — power systems, machines, and electrical drives.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Engineering mathematics I.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Physics foundation.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EE-101', 4, 'theory', 'Introductory electrical engineering.'],
        ['engineering-graphics', 'Engineering Graphics', 'ME-103', 3, 'theory', 'Engineering drawing.'],
        ['electromechanical', 'Electromechanical Engineering', 'EE-102', 4, 'theory', 'Machines and energy conversion intro.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Communication.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'Mathematics II.'],
        ['circuit-theory', 'Circuit Theory', 'EE-201', 4, 'theory', 'AC/DC circuit analysis.'],
        ['electrical-machines-1', 'Electrical Machines-I', 'EE-202', 4, 'theory', 'Transformers and DC machines.'],
        ['electronic-devices', 'Electronic Devices', 'EE-203', 4, 'theory', 'Power electronics devices.'],
        ['measurements', 'Electrical & Electronic Measurements', 'EE-204', 3, 'theory', 'Instrumentation and error analysis.'],
        ['digital-electronics', 'Digital Electronics', 'EC-201', 3, 'theory', 'Digital systems for control.'],
      ],
    ),
  ),
  branch(
    'mechanical',
    'Mechanical Engineering',
    'ME',
    'Cog',
    'text-slate-600',
    'IPU BTech Mechanical — thermodynamics, manufacturing, and machine design.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Engineering mathematics.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Applied physics.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EC-101', 4, 'theory', 'Electrical basics.'],
        ['engineering-graphics', 'Engineering Graphics', 'ME-103', 4, 'theory', 'Orthographic and isometric projection.'],
        ['workshop-practice', 'Workshop Practice', 'ME-101', 2, 'lab', 'Fitting, welding, and machining intro.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Communication skills.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'Mathematics II.'],
        ['strength-of-materials', 'Strength of Materials', 'ME-201', 4, 'theory', 'Stress, strain, and failure theories.'],
        ['thermodynamics', 'Thermodynamics', 'ME-202', 4, 'theory', 'Laws of thermodynamics and cycles.'],
        ['manufacturing-processes', 'Manufacturing Processes', 'ME-203', 4, 'theory', 'Casting, forming, and machining.'],
        ['fluid-mechanics', 'Fluid Mechanics', 'ME-204', 4, 'theory', 'Fluid statics and dynamics.'],
        ['material-science', 'Engineering Materials', 'ME-205', 3, 'theory', 'Metals, polymers, and composites.'],
      ],
    ),
  ),
  branch(
    'civil',
    'Civil Engineering',
    'CE',
    'Building2',
    'text-emerald-600',
    'IPU BTech Civil — structures, surveying, geotechnical, and construction.',
    8,
    twoSemSubjects(
      [
        ['mathematics-1', 'Mathematics-I', 'BS-101', 4, 'theory', 'Engineering mathematics.'],
        ['applied-physics', 'Applied Physics', 'BS-102', 4, 'theory', 'Physics for civil applications.'],
        ['basic-electrical-engineering', 'Basic Electrical Engineering', 'EC-101', 4, 'theory', 'Electrical fundamentals.'],
        ['engineering-graphics', 'Engineering Graphics', 'ME-103', 3, 'theory', 'Civil drawing standards.'],
        ['building-materials', 'Building Materials', 'CE-101', 3, 'theory', 'Cement, concrete, timber, and steel.'],
        ['communication-skills', 'Communication Skills', 'HS-101', 2, 'theory', 'Professional communication.'],
      ],
      [
        ['mathematics-2', 'Mathematics-II', 'BS-201', 4, 'theory', 'Mathematics II.'],
        ['structural-analysis-1', 'Structural Analysis-I', 'CE-201', 4, 'theory', 'Determinate structures.'],
        ['surveying', 'Surveying', 'CE-202', 4, 'theory', 'Linear and angular measurements.'],
        ['fluid-mechanics', 'Fluid Mechanics', 'CE-203', 4, 'theory', 'Fluid flow for hydraulic engineering.'],
        ['building-construction', 'Building Construction', 'CE-204', 3, 'theory', 'Construction techniques and planning.'],
        ['geotechnical-intro', 'Geotechnical Engineering', 'CE-205', 3, 'theory', 'Soil properties and bearing capacity.'],
      ],
    ),
  ),
  branch(
    'mca',
    'Master of Computer Applications',
    'MCA',
    'GraduationCap',
    'text-indigo-600',
    'IPU MCA — postgraduate software development, systems, and applications (4 semesters).',
    4,
    [
      emptySem(1, [
        ['mathematical-foundation', 'Mathematical Foundation', 'MCA-101', 4, 'theory', 'Discrete math and mathematical logic for CS.'],
        ['programming-in-c', 'Programming in C', 'MCA-102', 4, 'theory', 'Advanced C programming and data representation.'],
        ['computer-organization', 'Computer Organization & Architecture', 'MCA-103', 4, 'theory', 'Hardware-software interface.'],
        ['accounting', 'Financial Accounting & Management', 'MCA-104', 3, 'theory', 'Accounting for IT managers.'],
        ['communication', 'Communication Skills', 'MCA-105', 2, 'theory', 'Business and technical communication.'],
      ]),
      emptySem(2, [
        ['data-structures', 'Data Structures', 'MCA-201', 4, 'theory', 'Advanced data structures and algorithms.'],
        ['operating-systems', 'Operating Systems', 'MCA-202', 4, 'theory', 'OS design and administration.'],
        ['dbms', 'Database Management Systems', 'MCA-203', 4, 'theory', 'Database design and SQL.'],
        ['oop', 'Object Oriented Programming with Java', 'MCA-204', 4, 'theory', 'Java and OOP design patterns intro.'],
        ['software-engineering', 'Software Engineering', 'MCA-205', 3, 'theory', 'Processes, metrics, and quality.'],
      ]),
      sem(3, []),
      sem(4, []),
    ],
  ),
  branch(
    'bca',
    'Bachelor of Computer Applications',
    'BCA',
    'Laptop',
    'text-teal-600',
    'IPU BCA — applied computing and software development (6 semesters).',
    6,
    [
      emptySem(1, [
        ['mathematics-1', 'Mathematics-I', 'BCA-101', 4, 'theory', 'Foundation mathematics.'],
        ['computer-fundamentals', 'Computer Fundamentals', 'BCA-102', 4, 'theory', 'Hardware, software, and number systems.'],
        ['programming-in-c', 'Programming in C', 'BCA-103', 4, 'theory', 'C programming and logic building.'],
        ['english-communication', 'English Communication', 'BCA-104', 3, 'theory', 'Written and oral communication.'],
        ['office-automation', 'Office Automation Tools', 'BCA-105', 2, 'lab', 'MS Office and productivity tools.'],
      ]),
      emptySem(2, [
        ['data-structures', 'Data Structures', 'BCA-201', 4, 'theory', 'Core structures in C/C++.'],
        ['oop', 'Object Oriented Programming', 'BCA-202', 4, 'theory', 'OOP concepts and C++.'],
        ['dbms', 'Database Management System', 'BCA-203', 4, 'theory', 'Relational model and SQL.'],
        ['digital-electronics', 'Digital Electronics', 'BCA-204', 3, 'theory', 'Digital logic for programmers.'],
        ['system-analysis', 'System Analysis & Design', 'BCA-205', 3, 'theory', 'SDLC and modeling.'],
      ]),
      sem(3, []),
      sem(4, []),
      sem(5, []),
      sem(6, []),
    ],
  ),
  branch(
    'mba',
    'Master of Business Administration',
    'MBA',
    'Briefcase',
    'text-rose-600',
    'IPU MBA — management, finance, marketing, and operations (4 semesters).',
    4,
    [
      emptySem(1, [
        ['management-principles', 'Principles of Management', 'MBA-101', 4, 'theory', 'Planning, organizing, leading, and controlling.'],
        ['financial-accounting', 'Financial Accounting', 'MBA-102', 4, 'theory', 'Financial statements and analysis.'],
        ['marketing-management', 'Marketing Management', 'MBA-103', 4, 'theory', 'Marketing mix and consumer behavior.'],
        ['business-economics', 'Managerial Economics', 'MBA-104', 4, 'theory', 'Demand, cost, and market structures.'],
        ['business-communication', 'Business Communication', 'MBA-105', 2, 'theory', 'Reports, presentations, and etiquette.'],
      ]),
      emptySem(2, [
        ['hr-management', 'Human Resource Management', 'MBA-201', 4, 'theory', 'Recruitment, training, and performance.'],
        ['operations-management', 'Operations Management', 'MBA-202', 4, 'theory', 'Process design and supply chain basics.'],
        ['business-research', 'Business Research Methods', 'MBA-203', 4, 'theory', 'Research design and statistics for managers.'],
        ['corporate-finance', 'Corporate Finance', 'MBA-204', 4, 'theory', 'Capital budgeting and cost of capital.'],
        ['organizational-behavior', 'Organizational Behavior', 'MBA-205', 3, 'theory', 'Motivation, teams, and leadership.'],
      ]),
      sem(3, []),
      sem(4, []),
    ],
  ),
]

const IPU_DATA_README = `/**
 * @file ipuData.js — IPU syllabus content for LearnTheory (GGSIPU programmes).
 *
 * ## Data shape (TypeScript-style)
 *
 * @typedef {Object} IpuTopic
 * @property {string} id — Unique slug within subject (e.g. "mat-u1-t1")
 * @property {string} title
 * @property {string} content — Multi-paragraph markdown-friendly plain text (\\\\n\\\\n between paragraphs)
 * @property {string[]} keyPoints
 * @property {{ title: string, explanation: string }[]} examples
 * @property {{ name: string, formula: string, description?: string }[]} formulas
 * @property {string[]} examQuestions
 * @property {{ title: string, author: string }[]} [references]
 *
 * @typedef {Object} IpuUnit
 * @property {number} unitNumber — 1-based
 * @property {string} title
 * @property {IpuTopic[]} topics
 *
 * @typedef {Object} IpuSubject
 * @property {string} id — URL slug (e.g. "mathematics-1")
 * @property {string} name
 * @property {string} subjectCode — Official code (e.g. "BAS-101")
 * @property {number} credits
 * @property {"theory"|"lab"} type
 * @property {string} description
 * @property {IpuUnit[]} units — Empty [] shows "Content coming soon" in the app
 *
 * @typedef {Object} IpuSemester
 * @property {number} semNumber
 * @property {IpuSubject[]} subjects
 *
 * @typedef {Object} IpuBranch
 * @property {string} id — URL slug (e.g. "cse")
 * @property {string} name
 * @property {string} shortName
 * @property {string} icon — lucide-react export name (see below)
 * @property {string} color — Tailwind text class (e.g. "text-blue-600")
 * @property {string} description
 * @property {number} totalSemesters
 * @property {IpuSemester[]} semesters
 *
 * ## Add a new branch
 * 1. Add a branch() entry to scripts/generate-ipu-data.mjs (or edit this file directly).
 * 2. Set id, name, shortName, icon (lucide name), color, totalSemesters.
 * 3. Build semesters with sem(n, subjects[]) or emptySem(n, subjectTuples).
 * 4. Run: node scripts/generate-ipu-data.mjs
 * 5. Map the icon string in page ICON_MAP objects (BranchesPage, SemestersPage, etc.).
 *
 * ## Add subjects to an existing semester
 * 1. Locate the branch in generate-ipu-data.mjs.
 * 2. Append a tuple to emptySem or sem subjects:
 *    [id, name, subjectCode, credits, type, description]
 * 3. For full lesson content, pass a units array to subject() with unit() and topic() helpers.
 * 4. Regenerate with node scripts/generate-ipu-data.mjs
 *
 * ## localStorage keys (app-wide)
 * - ipu_sem_progress_{branchId}_{semNumber} — 0–100 semester rollup
 * - ipu_subject_progress_{branchId}_{semNum}_{subjectId} — 0–100 per subject
 * - ipu_read_topics_{subjectId} — string[] of topic ids marked read
 * - ipu_bookmarks_{subjectId} — string[] of bookmarked topic ids
 *
 * ## lucide-react icon names
 * Use PascalCase names matching lucide exports: Cpu, Monitor, Brain, Radio, Zap, Cog,
 * Building2, GraduationCap, Laptop, Briefcase, BookOpen, etc.
 * Browse: https://lucide.dev/icons — the string in data must match the React import name.
 *
 * CSE branch has full Sem 1–8 subject names; Mathematics-I includes complete units.
 * Other subjects may have units: [] until content is added (descriptions may note TODO).
 */`

const file = `${IPU_DATA_README}

const ipuBranches = ${JSON.stringify(ipuBranches, null, 2)}

export const getBranch = (id) => ipuBranches.find((b) => b.id === id)

export default ipuBranches
`

writeFileSync('src/data/ipuData.js', file)
console.log('Wrote src/data/ipuData.js', ipuBranches.length, 'branches')
