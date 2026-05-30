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

const appliedChemistryRefs = [
  ref('Applied Chemistry Textbook', 'IPU Faculty Notes'),
  ref('Engineering Chemistry Reference', 'Standard Text'),
]

function chemTopic(
  id,
  title,
  content,
  keyPoints,
  examples = [],
  formulas = [],
  examQuestions = [],
) {
  return topic(id, title, content, keyPoints, examples, formulas, examQuestions, appliedChemistryRefs)
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

const appliedChemistryTopicSpecs = [
  ['applied-chemistry-u1-t1', 'Fuels: Classification and Characteristics of Fuels', 'overview'],
  ['applied-chemistry-u1-t2', 'Calorific Value of Fuels', 'calorific'],
  ['applied-chemistry-u1-t3', 'Comparison of Solid, Liquid and Gaseous Fuels', 'comparison'],
  ['applied-chemistry-u1-t4', 'Determination of Calorific Value using Bomb Calorimeter', 'calorimeter'],
  ['applied-chemistry-u1-t5', "Determination of Calorific Value using Boy's Calorimeter", 'calorimeter'],
  ['applied-chemistry-u1-t6', 'Dulong Formula for Calorific Value', 'formula'],
  ['applied-chemistry-u1-t7', 'Numerical Problems on Calorific Value', 'numerical'],
  ['applied-chemistry-u1-t8', 'Solid Fuels - Coal', 'coal'],
  ['applied-chemistry-u1-t9', 'Proximate Analysis of Coal', 'analysis'],
  ['applied-chemistry-u1-t10', 'Ultimate Analysis of Coal', 'analysis'],
  ['applied-chemistry-u1-t11', 'Numerical Problems on Coal Analysis', 'numerical'],
  ['applied-chemistry-u1-t12', 'Carbonisation of Coal', 'process'],
  ['applied-chemistry-u1-t13', 'Otto-Hoffmann Coke Oven', 'process'],
  ['applied-chemistry-u1-t14', 'Recovery of Coal By-products', 'process'],
  ['applied-chemistry-u1-t15', 'Metallurgical Coke', 'coal'],
  ['applied-chemistry-u1-t16', 'Liquid Fuels - Petroleum and Petroleum Products', 'petroleum'],
  ['applied-chemistry-u1-t17', 'Refining of Petroleum', 'petroleum'],
  ['applied-chemistry-u1-t18', 'Thermal Cracking', 'petroleum'],
  ['applied-chemistry-u1-t19', 'Catalytic Cracking', 'petroleum'],
  ['applied-chemistry-u1-t20', 'Knocking Characteristics of Fuels', 'rating'],
  ['applied-chemistry-u1-t21', 'Octane Number and Rating', 'rating'],
  ['applied-chemistry-u1-t22', 'Cetane Number and Rating', 'rating'],
  ['applied-chemistry-u1-t23', 'Gaseous Fuels - Natural Gas (NG)', 'gas'],
  ['applied-chemistry-u1-t24', 'Compressed Natural Gas (CNG)', 'gas'],
  ['applied-chemistry-u1-t25', 'Liquefied Petroleum Gas (LPG)', 'gas'],
  ['applied-chemistry-u1-t26', 'Coal Gas', 'gas'],
  ['applied-chemistry-u1-t27', 'Oil Gas', 'gas'],
  ['applied-chemistry-u1-t28', 'Producer Gas', 'gas'],
  ['applied-chemistry-u1-t29', 'Water Gas', 'gas'],
  ['applied-chemistry-u1-t30', 'Combustion of Fuels', 'combustion'],
  ['applied-chemistry-u1-t31', 'Numerical Problems on Combustion of Fuels', 'numerical'],
]

function buildAppliedChemistryTopic([id, title, kind]) {
  if (kind === 'calorific') {
    return chemTopic(
      id,
      title,
      `${title} explains the heat liberated when a fuel burns completely. The section distinguishes gross calorific value from net calorific value and shows why latent heat losses reduce the usable heat output.\n\nThis topic is important for comparing fuels in boilers, furnaces, and engines because the same mass of fuel can deliver very different amounts of heat depending on composition and moisture content.`,
      ['Know the meaning of GCV and NCV.', 'Calorific value is usually written in kJ/kg or MJ/kg.', 'Moisture and hydrogen content affect the usable heat.', 'Fuel selection often starts with calorific value.'],
      [{ title: 'Fuel comparison', explanation: 'A higher calorific value means more heat for the same fuel mass.' }],
      [{ name: 'NCV relation', formula: 'NCV = GCV - latent heat of water formed', description: 'NCV excludes the heat lost with steam in flue gases.' }],
      ['Define calorific value and differentiate GCV and NCV.', 'Why is NCV lower than GCV?', 'State the units used for calorific value.'],
    )
  }

  if (kind === 'calorimeter') {
    return chemTopic(
      id,
      title,
      `${title} describes the experimental method used to measure heat of combustion. The bomb calorimeter gives accurate results for solid and liquid fuels, while Boy's calorimeter is commonly used for gaseous fuels.\n\nIn exam answers, students should mention the principle, apparatus, correction terms, and the type of fuel for which the method is best suited.`,
      ['Bomb calorimeter is a constant-volume method.', "Boy's calorimeter is used mainly for gases.", 'Temperature rise is the main observed quantity.', 'Corrections are applied for wire and side reactions.'],
      [{ title: 'Practical setup', explanation: 'A measured temperature rise is converted into calorific value.' }],
      [{ name: 'Heat calculation', formula: 'Heat released = water equivalent x temperature rise - corrections', description: 'Use the calorimeter constant or water equivalent.' }],
      ['Explain the working principle of the calorimeter.', 'Why is oxygen used in the bomb?', "Compare bomb and Boy's calorimeters."],
    )
  }

  if (kind === 'formula') {
    return chemTopic(
      id,
      title,
      `${title} presents a theoretical estimate of calorific value based on ultimate analysis. Dulong's formula is a fast way to approximate the heat of combustion when laboratory calorimetry is not available.\n\nThe formula is widely used in fuel engineering because it connects fuel composition directly with expected heating performance.`,
      ['Use percentage composition of C, H, O, and S.', 'Oxygen reduces the useful hydrogen term.', 'It is an approximate but practical formula.', 'Common in short numerical questions.'],
      [{ title: 'Engineering estimate', explanation: 'Quick theoretical value from ultimate analysis.' }],
      [{ name: 'Dulong formula', formula: 'HCV = 337C + 1442(H - O/8) + 93S', description: 'C, H, O, and S are mass percentages.' }],
      ["Write Dulong's formula.", 'Why does oxygen lower the hydrogen contribution?', 'Give one advantage of the formula.'],
    )
  }

  if (kind === 'numerical') {
    return chemTopic(
      id,
      title,
      `${title} focuses on the calculation steps required in fuel and combustion problems. The main task is to choose the correct formula, keep units consistent, and present the final answer clearly.\n\nFor exam practice, students should solve numerical problems involving calorific value, coal analysis, and combustion air requirement because these are standard university-style questions.`,
      ['Write the known data before solving.', 'Check unit conversions carefully.', 'Use formula and substitution in a clean sequence.', 'Report the answer with the correct unit.'],
      [{ title: 'Worked calculation', explanation: 'A standard numerical should show formula, substitution, and result.' }],
      [{ name: 'Basic relation', formula: 'Heat released = mass of fuel x calorific value', description: 'Used when calorific value is already given.' }],
      ['Solve a standard numerical from this topic.', 'Show the formula before substitution.', 'Explain how the final unit is obtained.'],
    )
  }

  if (kind === 'coal') {
    return chemTopic(
      id,
      title,
      `${title} explains coal as the major solid fossil fuel used in power and metallurgy. Coal quality depends on carbon content, volatile matter, ash, moisture, and sulphur, so the topic is closely linked with fuel ranking and industrial selection.\n\nGood exam answers should compare coal ranks and relate coal properties to practical applications like steam raising, coke production, and furnace operation.`,
      ['Coal is a fossil solid fuel.', 'Higher rank coal has higher carbon content.', 'Low ash and low sulphur are desirable.', 'Coal is important for metallurgy and power generation.'],
      [{ title: 'Fuel rank', explanation: 'Anthracite is the highest-rank coal commonly discussed in exams.' }],
      [],
      ['Define coal and classify its ranks.', 'Why is anthracite considered superior?', 'State two uses of coal.'],
    )
  }

  if (kind === 'analysis') {
    return chemTopic(
      id,
      title,
      `${title} covers the standard laboratory methods used to assess coal quality. Proximate analysis reports moisture, volatile matter, ash, and fixed carbon, while ultimate analysis reports the elemental composition needed for combustion calculations.\n\nThese analyses help engineers judge ignition behavior, smoke formation, pollution potential, and suitability for boilers or coke ovens.`,
      ['Proximate analysis gives fuel fractions.', 'Ultimate analysis gives elemental percentages.', 'Fixed carbon is usually found by difference in proximate analysis.', 'Sulphur is important for corrosion and pollution concerns.'],
      [{ title: 'Coal test result', explanation: 'Analysis data is used to grade the coal for real applications.' }],
      [],
      ['Differentiate proximate and ultimate analysis.', 'How is fixed carbon found?', 'Why is sulphur content important?'],
    )
  }

  if (kind === 'process') {
    return chemTopic(
      id,
      title,
      `${title} explains the industrial conversion of coal into stronger fuel or useful by-products. Carbonisation removes volatile matter, coke ovens recover valuable chemicals, and by-product recovery improves both economics and environmental performance.\n\nThese topics are often asked together because they describe a complete coke-making and coal-utilization sequence.`,
      ['The process is done in the absence of air.', 'Useful by-products are recovered from gases and tar.', 'Coke is the main solid residue.', 'High-temperature treatment generally gives stronger coke.'],
      [{ title: 'Coke-making route', explanation: 'Coal is heated without air to produce coke and by-products.' }],
      [],
      ['Explain carbonisation of coal.', 'What is the Otto-Hoffmann coke oven?', 'Name the coal by-products recovered.'],
    )
  }

  if (kind === 'petroleum') {
    return chemTopic(
      id,
      title,
      `${title} deals with crude oil as a liquid fuel source and the refinery operations used to convert it into useful products. Fractional distillation, refining, and cracking all aim to maximize the yield of transport fuels and heating oils.\n\nStudents should remember that liquid fuel quality is influenced by volatility, knock resistance, sulphur content, and product distribution from the refinery.`,
      ['Petroleum is a mixture of hydrocarbons.', 'Refining separates and upgrades crude oil.', 'Cracking converts heavier fractions to lighter ones.', 'Fuel quality is related to volatility and knock resistance.'],
      [{ title: 'Refinery processing', explanation: 'Crude oil is turned into fuels, lubricants, and other fractions.' }],
      [],
      ['What is petroleum refining?', 'Differentiate thermal and catalytic cracking.', 'Why is cracking used in refineries?'],
    )
  }

  if (kind === 'rating') {
    return chemTopic(
      id,
      title,
      `${title} explains how fuel quality is judged in internal combustion engines. Octane number is used for petrol fuels and cetane number is used for diesel fuels. Both ratings are connected with the way a fuel ignites and burns inside the engine.\n\nEngineers use these numbers to reduce knock, improve efficiency, and choose the correct fuel for the engine type.`,
      ['Octane number is for spark-ignition engines.', 'Cetane number is for compression-ignition engines.', 'Higher octane resists knock better.', 'Higher cetane means easier ignition in diesel engines.'],
      [{ title: 'Engine rating', explanation: 'Fuel ratings tell how the fuel behaves under engine conditions.' }],
      [],
      ['Differentiate octane and cetane numbers.', 'Why is knock resistance important?', 'How do fuel ratings affect engine performance?'],
    )
  }

  if (kind === 'gas') {
    return chemTopic(
      id,
      title,
      `${title} describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.`,
      ['Gaseous fuels mix easily with air.', 'Many gaseous fuels are by-products of coal or petroleum processing.', 'They generally burn cleanly with less ash.', 'Composition determines heating value and uses.'],
      [{ title: 'Clean combustion', explanation: 'Gaseous fuels often give better control and lower residue.' }],
      [],
      ['Describe the fuel, its composition, and its uses.', 'Why are gaseous fuels convenient?', 'State one advantage of this gaseous fuel.'],
    )
  }

  if (kind === 'combustion') {
    return chemTopic(
      id,
      title,
      `${title} deals with the chemical and thermal basis of burning fuel in air. Students must understand complete and incomplete combustion, air-fuel ratio, excess air, and the heat released during oxidation.\n\nThis section brings together the earlier fuel topics and prepares the student for combustion numericals and design-based exam questions.`,
      ['Complete combustion gives maximum heat.', 'Insufficient air leads to CO and soot.', 'Theoretical air is calculated from stoichiometry.', 'Combustion efficiency depends on mixing and burner design.'],
      [{ title: 'Heat release', explanation: 'The fuel-air reaction converts chemical energy into useful heat.' }],
      [{ name: 'Basic relation', formula: 'Fuel + O2 -> CO2 + H2O + heat', description: 'Ideal complete combustion equation.' }],
      ['Define combustion and distinguish complete from incomplete combustion.', 'What is excess air?', 'Why is combustion efficiency important?'],
    )
  }

  return chemTopic(
    id,
    title,
    `${title} is part of the fuels and combustion syllabus for Applied Chemistry. The topic should be studied with a focus on definition, engineering significance, and at least one practical use.\n\nA compact exam answer should include what the topic means, why it matters, and the standard key points that distinguish it from related fuel topics.`,
    ['Know the basic definition and use.', 'Link the idea to fuel engineering.', 'Remember at least one practical example.', 'Write short, direct exam answers.'],
    [{ title: 'Standard example', explanation: 'Relate the topic to a real fuel or refinery application.' }],
    [],
    ['Define the topic.', 'State its importance.', 'Write two key points from the syllabus.'],
  )
}

const appliedChemistryUnit1 = unit(1, 'Fuels and Combustion', appliedChemistryTopicSpecs.map(buildAppliedChemistryTopic))

const appliedChemistrySubject = subject(
  'applied-chemistry',
  'Applied Chemistry',
  'BAS-203',
  4,
  'theory',
  'Fuels, combustion, coal, petroleum, and gaseous fuel systems for engineering applications.',
  [appliedChemistryUnit1],
)

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
  const semester2 = emptySem(2, cseSem2Subjects)
  semester2.subjects = semester2.subjects.map((entry) =>
    entry.id === 'applied-chemistry' ? appliedChemistrySubject : entry,
  )
  semesters.push(semester2)
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
