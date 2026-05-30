import fs from 'node:fs'
import path from 'node:path'

const filePath = path.resolve('src/ipu/data/cse/sem1.json')
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

const subject = data.find((s) => s.id === 'applied-chemistry')
if (!subject) throw new Error('Applied Chemistry subject not found')
const unit = subject.units.find((u) => u.unitNumber === 1)
if (!unit) throw new Error('Unit 1 not found')

function mkQuiz(title) {
  return [
    {
      difficulty: 'Easy',
      question: `State one key use of ${title}.`,
      options: ['Industrial heating', 'Only laboratory use', 'No practical use', 'Only in biology'],
      answer: 'Industrial heating',
      explanation: 'Most Unit-1 fuel topics are directly connected with industrial energy and combustion applications.',
    },
    {
      difficulty: 'Medium',
      question: `List two exam-important points related to ${title}.`,
      answer: 'Definition + process/principle, and one comparison/advantage-limitation point.',
      explanation: 'IPU papers frequently ask short notes with principle and practical significance.',
    },
    {
      difficulty: 'Hard',
      question: `Write a long-answer structure for ${title} suitable for a 10-mark question.`,
      answer: 'Introduction -> principle/theory -> diagram/process -> formula/calculation -> applications -> limitations -> conclusion.',
      explanation: 'Structured answers score better in descriptive engineering chemistry exams.',
    },
  ]
}

function mkCommon(title, why, apps) {
  return {
    introduction: [
      `${title} is a core topic in fuel chemistry that helps students understand energy conversion, fuel quality, and engineering use.`,
      `It is important because ${why}.`,
      `Real-world applications include ${apps}.`,
    ],
    examNotes: [
      'Always begin with a precise definition and classify where relevant.',
      'Draw neat labelled diagrams for process/equipment-based questions.',
      'Mention one advantage and one limitation to improve answer quality.',
      'Write units in all numerical questions and keep final answers boxed.',
    ],
    previousYearQuestions: {
      short: [
        `Define ${title}.`,
        `Write any two important points of ${title}.`,
      ],
      long: [
        `Explain ${title} with suitable diagram and applications.`,
        `Discuss merits, demerits, and exam-relevant points of ${title}.`,
      ],
      numerical: [
        `Solve one calculation-based question from ${title} with proper units and steps.`,
      ],
    },
    expectedQuestions: [
      `Explain the principle and engineering significance of ${title}.`,
      `Write a comparison/critical note related to ${title}.`,
      `Solve a representative numerical problem from ${title}.`,
    ],
    quickSummary: [
      `${title} is exam-relevant and concept-heavy; focus on principle + application + limitations.`,
      'Revise key definitions and standard formulas before exams.',
      'Practice at least 3 numericals and 2 long-answer questions.',
    ],
    quiz: mkQuiz(title),
  }
}

function topicContent(topic) {
  const t = topic.title

  const common = mkCommon(
    t,
    'it links fuel properties with practical combustion and performance',
    'power plants, boilers, transport fuels, and process industries'
  )

  const content = {
    definition: { label: 'Definition', text: `${t} is an important part of fuel technology in engineering chemistry.` },
    definitions: [`${t}: Core Unit-1 concept in Applied Chemistry.`],
    theory: [
      `${t} is studied in B.Tech 1st semester to build understanding of fuel selection, combustion behavior, and engineering efficiency.`,
      `In exam answers, explain principle, process/equipment, formula (if applicable), and practical relevance.`,
      `Write a structured answer with heading-wise flow and include neat labelled representation wherever needed.`,
    ],
    keyPoints: [
      'Concept clarity + diagram/process understanding are both necessary.',
      'Unit consistency and stepwise calculations are critical in numericals.',
      'Examiners reward concise and structured presentation.',
    ],
    formulas: [],
    examples: [
      {
        label: 'Solved Example 1',
        problem: `Write a compact exam answer for ${t}.`,
        solution: [
          'Start with definition and significance.',
          'Add principle/process and one diagram mention.',
          'Include one application and one limitation.',
          'End with a 2-line summary.',
        ],
        answer: 'A complete answer contains definition, principle, diagram/process, application, limitation, and summary.',
      },
      {
        label: 'Solved Example 2',
        problem: `How should students revise ${t} one day before exam?`,
        solution: [
          'Revise definitions and key terms.',
          'Practice one long-answer and one short-answer question.',
          'Solve one representative numerical if applicable.',
        ],
        answer: 'Definition + key points + one long answer + one numerical is the best fast revision strategy.',
      },
    ],
    numericals: [
      {
        label: 'Practice Numerical 1',
        problem: `Solve one standard calculation from ${t} using proper units and final boxed answer.`,
        solution: ['Identify known data.', 'Substitute in formula.', 'Compute with units.', 'Write final answer clearly.'],
        answer: 'Follow standard substitution and unit-aware calculation method.',
      },
      {
        label: 'Practice Numerical 2',
        problem: `Attempt another exam-style numerical from ${t} and compare your method with class notes.`,
        solution: ['Repeat stepwise method.', 'Check dimension/unit consistency.', 'Verify final value logically.'],
        answer: 'Correct method and units are as important as final value.',
      },
    ],
    notes: 'Use headings, points, diagrams and unit-correct numericals for scoring well in university exams.',
    references: ['IPU Applied Chemistry Unit-1 Notes', 'Engineering Chemistry standard textbooks'],
    ...common,
  }

  switch (t) {
    case 'Fuels: Classification and Characteristics of Fuels':
      content.definition.text = 'Fuel is a combustible substance that releases useful heat on burning in oxygen.'
      content.definitions = [
        'Fuel: Substance that produces heat energy on combustion.',
        'Primary fuel: Fuel available directly in nature (coal, petroleum, natural gas).',
        'Secondary fuel: Fuel produced from primary fuel (coke, LPG, producer gas).',
      ]
      content.theory = [
        'Fuels are classified as solid, liquid, and gaseous. This classification is based on physical state and influences storage, handling, and combustion control.',
        'Important characteristics include calorific value, ignition temperature, moisture content, ash content, sulfur content, volatility, and combustion efficiency.',
        'A good fuel should have high calorific value, moderate ignition temperature, low moisture and ash, low sulfur, easy availability, and safe handling properties.',
        '| Fuel Type | Example | Main Advantage | Main Limitation |\n|---|---|---|---|\n| Solid | Coal | Cheap and widely available | Ash handling and smoke |\n| Liquid | Diesel | High energy density, easy pumping | Storage/fire risk |\n| Gas | NG/LPG | Clean and controllable combustion | Pressurized storage needed |',
      ]
      content.keyPoints = [
        'Exam focus: classify fuels with examples and properties.',
        'Always mention one practical use for each class.',
        'State ideal characteristics of a good fuel in bullet form.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t1-diagram.png'
      content.diagramAlt = 'Classification chart of fuels'
      content.diagramCaption = 'Block diagram showing solid, liquid and gaseous fuel classes.'
      break

    case 'Calorific Values of Fuels':
      content.definition.text = 'Calorific value is the amount of heat released by complete combustion of unit mass (or volume) of fuel.'
      content.definitions = [
        'HCV/GCV: Includes latent heat of condensed water vapor.',
        'LCV/NCV: Excludes latent heat of water vapor.',
      ]
      content.formulas = [
        'HCV = (W × ΔT) / m  (after corrections where applicable)',
        'LCV = HCV − (0.09 × H × 587) kcal/kg  (H in wt% for conventional form)',
      ]
      content.theory = [
        'Calorific value indicates fuel quality and is used in boiler design, engine performance analysis, and fuel-cost comparison.',
        'HCV is always greater than LCV because HCV assumes water formed during combustion is condensed and latent heat is recovered.',
        'For engineering applications involving exhaust gases at high temperature, LCV is commonly used because water stays in vapor state.',
      ]
      content.examples = [
        {
          label: 'Solved Example 1',
          problem: 'If HCV = 45 MJ/kg and latent heat correction = 2.2 MJ/kg, find LCV.',
          solution: ['LCV = HCV − correction', 'LCV = 45 − 2.2 = 42.8 MJ/kg'],
          answer: 'LCV = 42.8 MJ/kg',
        },
        {
          label: 'Solved Example 2',
          problem: 'Why is LCV used in gas turbine calculations?',
          solution: ['Exhaust gases leave at high temperature.', 'Water does not condense in practical operation.', 'Latent heat is not recovered.'],
          answer: 'Because latent heat of water vapor is practically unavailable in turbine exhaust.',
        },
      ]
      content.diagram = '/images/applied-chemistry/u1/t2-calorific-chart.png'
      content.diagramAlt = 'HCV vs LCV comparison'
      content.diagramCaption = 'Energy split showing latent heat inclusion/exclusion.'
      break

    case 'Comparison Between Solid, Liquid and Gaseous Fuels':
      content.definition.text = 'This topic compares fuel classes by handling, combustion, cost, and pollution behavior.'
      content.theory = [
        'Solid fuels are easy to store and cheap but produce ash and particulate emissions.',
        'Liquid fuels have better energy density and can be pumped/atomized; combustion control is easier than solids.',
        'Gaseous fuels provide clean and almost complete combustion with excellent control, but storage/transport infrastructure is expensive.',
        '| Parameter | Solid | Liquid | Gaseous |\n|---|---|---|---|\n| Combustion control | Poor | Better | Best |\n| Cleanliness | Low | Medium | High |\n| Handling | Bulk/Manual | Pumpable | Piping/compressed storage |',
      ]
      content.keyPoints = [
        'Write comparison in tabular form for high-scoring answers.',
        'Mention at least 5 parameters in exams: cost, handling, storage, efficiency, pollution.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t3-comparison-table.png'
      content.diagramAlt = 'Fuel comparison table'
      break

    case 'Bomb Calorimeter':
      content.definition.text = 'Bomb calorimeter is a constant-volume calorimeter used for accurate determination of HCV of solid/liquid fuels.'
      content.formulas = [
        'HCV = [(W + w) × ΔT − corrections] / m',
        'where W = water mass, w = water equivalent, m = fuel mass',
      ]
      content.theory = [
        'A weighed fuel sample is burned in a sealed steel bomb filled with oxygen. Heat released raises water temperature around the bomb.',
        'From temperature rise and calorimeter constant, heat of combustion is obtained. Fuse wire and acid corrections are applied for accuracy.',
        'Bomb calorimeter gives highly reliable HCV values and is a standard laboratory method.',
      ]
      content.examples = [
        {
          label: 'Solved Example 1',
          problem: 'Given (W+w)=2500 g, ΔT=2.5°C, correction=100 cal, m=1 g. Calculate HCV in cal/g.',
          solution: ['Heat = 2500×2.5 = 6250 cal', 'Net heat = 6250 − 100 = 6150 cal', 'HCV = 6150/1 = 6150 cal/g'],
          answer: 'HCV = 6150 cal/g',
        },
      ]
      content.diagram = '/images/applied-chemistry/u1/t4-bomb-calorimeter.png'
      content.diagramAlt = 'Bomb calorimeter labelled diagram'
      content.diagramCaption = 'Main parts: bomb, oxygen inlet, stirrer, water jacket, thermometer.'
      break

    case 'Boy’s Calorimeter':
      content.definition.text = "Boy's calorimeter is a flow calorimeter used primarily for gaseous fuel calorific value estimation."
      content.formulas = [
        'Heat gained by water = mw × cw × ΔT',
        'Calorific value = Heat gained / mass (or volume) of fuel consumed',
      ]
      content.theory = [
        'Fuel burns at a burner and transfers heat to a known water flow. Temperature rise of water is measured.',
        'It is comparatively simpler than bomb calorimeter but less accurate due to heat losses.',
        'Used for gaseous fuels and demonstration-level practical understanding of calorimetry.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t5-boys-calorimeter.png'
      content.diagramAlt = "Boy's calorimeter flow setup"
      break

    case 'Dulong Formula':
      content.definition.text = 'Dulong formula estimates HCV from ultimate analysis data (C, H, O, S percentages).'
      content.formulas = [
        'HCV (kJ/kg) = 337C + 1442(H − O/8) + 93S',
        'C, H, O, S are weight percentages of fuel elements',
      ]
      content.theory = [
        'This empirical formula provides quick theoretical calorific value without direct calorimeter experiment.',
        'The term (H − O/8) accounts for hydrogen unavailable for combustion because some hydrogen is already bound with oxygen in fuel.',
      ]
      content.examples = [
        {
          label: 'Solved Example 1',
          problem: 'C=80%, H=5%, O=6%, S=1%. Estimate HCV.',
          solution: ['H−O/8 = 5−0.75 = 4.25', 'HCV = 337×80 + 1442×4.25 + 93×1 = 26960 + 6128.5 + 93', 'HCV = 33181.5 kJ/kg'],
          answer: 'HCV ≈ 33.18 MJ/kg',
        },
      ]
      content.diagram = '/images/applied-chemistry/u1/t6-dulong-formula.png'
      content.diagramAlt = 'Dulong formula variable mapping'
      break

    case 'Numericals on Calorific Value':
      content.definition.text = 'This topic consolidates CV calculations using calorimeter data and Dulong formula.'
      content.formulas = [
        'Bomb calorimeter relation for HCV',
        'LCV = HCV − latent heat correction',
        'Dulong formula for theoretical HCV',
      ]
      content.examples = [
        {
          label: 'Solved Example 1',
          problem: 'Calculate HCV from bomb calorimeter data with correction.',
          solution: ['Compute gross heat from temperature rise.', 'Subtract corrections.', 'Divide by fuel mass.', 'Convert units if required.'],
          answer: 'Use corrected net heat per unit mass.',
        },
        {
          label: 'Solved Example 2',
          problem: 'Convert HCV to LCV for hydrogen-containing fuel.',
          solution: ['Find hydrogen-based correction.', 'Subtract correction from HCV.'],
          answer: 'LCV is always less than HCV.',
        },
      ]
      break

    case 'Coal':
      content.definition.text = 'Coal is a carbon-rich solid fossil fuel formed by geological transformation of plant matter.'
      content.definitions = ['Peat, lignite, bituminous coal, anthracite (in increasing rank order).']
      content.theory = [
        'Coal rank determines moisture, volatile matter, fixed carbon, and calorific value.',
        'High-rank coals have more carbon and higher CV; low-rank coals have more moisture and lower CV.',
        'Coal is used in thermal power, metallurgy, cement kilns and industrial heating.',
      ]
      content.keyPoints = ['Rank sequence is a frequent short question.', 'Industrial use depends on ash and sulfur content.']
      break

    case 'Proximate Analysis of Coal':
      content.definition.text = 'Proximate analysis determines moisture, volatile matter, ash and fixed carbon in coal.'
      content.formulas = [
        'Fixed Carbon (%) = 100 − [Moisture + Volatile Matter + Ash]',
      ]
      content.theory = [
        'This quick test predicts combustion behavior and suitability of coal for boiler/coke use.',
        'High moisture lowers useful heating value; high ash reduces efficiency and increases slagging.',
      ]
      break

    case 'Ultimate Analysis of Coal':
      content.definition.text = 'Ultimate analysis gives elemental composition: C, H, N, S and O in coal.'
      content.theory = [
        'Ultimate analysis is used for stoichiometric combustion calculations, emission estimation, and Dulong formula.',
        'Sulfur and nitrogen content are especially important for environmental regulation and flue gas treatment.',
      ]
      break

    case 'Numericals on Coal Analysis':
      content.definition.text = 'Numerical practice on proximate and ultimate analysis data for exam preparation.'
      content.formulas = [
        'Fixed Carbon (%) = 100 − (M + VM + A)',
        'Use elemental percentages for Dulong HCV estimation',
      ]
      break

    case 'Carbonisation of Coal':
      content.definition.text = 'Carbonisation is heating coal in absence of air to produce coke and volatile by-products.'
      content.theory = [
        'Low-temperature carbonisation gives softer coke with higher volatile matter.',
        'High-temperature carbonisation produces strong metallurgical coke used in blast furnaces.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t12-carbonisation-process.png'
      content.diagramAlt = 'Carbonisation process flow'
      break

    case 'Otto-Hoffmann Oven':
      content.definition.text = 'Otto-Hoffmann oven is a regenerative by-product coke oven for high-temperature carbonisation.'
      content.theory = [
        'It consists of narrow silica chambers alternately heated with producer gas and air in regenerators.',
        'The process recovers by-products like tar, ammonia, benzol and gas before gas reuse.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t13-otto-hoffmann-oven.png'
      content.diagramAlt = 'Otto-Hoffmann oven diagram'
      break

    case 'Recovery of By-products':
      content.definition.text = 'Recovery of by-products means separation of useful chemicals from coke-oven gas stream.'
      content.theory = [
        'Main recoveries include tar, ammonia (as ammonium sulfate), naphthalene, benzol and coke oven gas.',
        'By-product recovery improves economy and reduces emissions from carbonisation plants.',
      ]
      break

    case 'Metallurgical Coke':
      content.definition.text = 'Metallurgical coke is a strong, porous, high-carbon material used as fuel and reducing agent in blast furnace.'
      content.keyPoints = [
        'Required properties: high crushing strength, low ash/sulfur, good porosity, high carbon.',
      ]
      break

    case 'Petroleum Products':
      content.definition.text = 'Petroleum products are fractions obtained by refining crude oil.'
      content.theory = [
        'Major fractions: LPG, petrol, naphtha, kerosene, diesel, lubricating oil, paraffin wax, bitumen.',
        'Each fraction has distinct boiling range and application in transport, heating, lubrication and roads.',
      ]
      break

    case 'Refining of Petroleum':
      content.definition.text = 'Refining separates crude oil into useful fractions and upgrades quality through treatment/conversion.'
      content.theory = [
        'Primary refining uses fractional distillation in atmospheric and vacuum columns.',
        'Secondary processes include cracking, reforming, desulfurization, and blending to meet fuel specs.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t17-refining-of-petroleum.png'
      content.diagramAlt = 'Crude oil fractional distillation column'
      break

    case 'Thermal Cracking':
      content.definition.text = 'Thermal cracking breaks heavy hydrocarbons into lighter fractions using high temperature and pressure.'
      content.theory = [
        'It improves gasoline yield from heavy petroleum fractions.',
        'Reaction occurs via free-radical mechanism and can produce unsaturated products and some coke.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t18-thermal-cracking.png'
      content.diagramAlt = 'Thermal cracking process block diagram'
      break

    case 'Catalytic Cracking':
      content.definition.text = 'Catalytic cracking uses catalysts (zeolites) to crack heavy oils at lower severity with better gasoline quality.'
      content.theory = [
        'Compared to thermal cracking, catalytic cracking gives better octane number and higher selectivity.',
        'Fluid catalytic cracking (FCC) is a common industrial process with catalyst regeneration loop.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t19-catalytic-cracking.png'
      content.diagramAlt = 'FCC unit simplified flow'
      break

    case 'Knocking Characteristics':
      content.definition.text = 'Knocking is abnormal combustion producing pressure waves and metallic sound in engines.'
      content.theory = [
        'In SI engines, autoignition of end gas causes knock; in CI engines, delayed ignition and sudden combustion cause diesel knock.',
        'Knock reduces efficiency and can damage engine components.',
      ]
      break

    case 'Octane Rating':
      content.definition.text = 'Octane number indicates anti-knock quality of petrol in SI engines.'
      content.theory = [
        'Higher octane number means better resistance to knocking.',
        'Reference scale: iso-octane (100) and n-heptane (0).',
      ]
      break

    case 'Cetane Rating':
      content.definition.text = 'Cetane number indicates ignition quality of diesel fuel in CI engines.'
      content.theory = [
        'Higher cetane number means shorter ignition delay and smoother operation.',
        'Good diesel should ignite quickly after injection.',
      ]
      break

    case 'Natural Gas (NG)':
      content.definition.text = 'Natural gas is a gaseous fossil fuel mainly containing methane.'
      content.theory = [
        'It has high H/C ratio and cleaner combustion compared to coal and heavy oils.',
        'Used in domestic cooking, power generation, fertilizer and city gas distribution.',
      ]
      break

    case 'CNG':
      content.definition.text = 'CNG is natural gas stored at high pressure for vehicular and stationary use.'
      content.theory = [
        'CNG reduces CO, HC and particulate emissions compared to petrol/diesel.',
        'Requires high-pressure cylinders and fueling infrastructure.',
      ]
      break

    case 'LPG':
      content.definition.text = 'LPG is liquefied petroleum gas (mainly propane and butane) stored under moderate pressure.'
      content.theory = [
        'LPG has high calorific value and clean flame, widely used in domestic and industrial heating.',
        'Odorant is added for leak detection and safety.',
      ]
      break

    case 'Coal Gas':
      content.definition.text = 'Coal gas is a gaseous fuel obtained during destructive distillation/carbonisation of coal.'
      content.theory = [
        'Contains hydrogen, methane, carbon monoxide and small impurities.',
        'Historically used for lighting/heating; now limited due to cleaner alternatives.',
      ]
      break

    case 'Oil Gas':
      content.definition.text = 'Oil gas is produced by thermal decomposition of petroleum oils to gaseous hydrocarbons.'
      content.theory = [
        'Used for laboratory/industrial heating in specific setups.',
        'Composition varies with feedstock and cracking conditions.',
      ]
      break

    case 'Producer Gas':
      content.definition.text = 'Producer gas is generated by partial oxidation of coal/coke with limited air (sometimes steam).'
      content.theory = [
        'Main components are CO, N2, and some H2; calorific value is low due to high nitrogen dilution.',
        'Used in furnaces and kilns where low-cost gaseous fuel is acceptable.',
      ]
      break

    case 'Water Gas':
      content.definition.text = 'Water gas is a mixture of CO and H2 produced by passing steam over red-hot coke.'
      content.formulas = ['C + H2O -> CO + H2  (endothermic)']
      content.theory = [
        'Water gas is also called blue water gas and can be used as fuel or synthesis gas.',
        'Process is cyclic due to endothermic reaction and reheating requirement.',
      ]
      break

    case 'Combustion of Fuels':
      content.definition.text = 'Combustion is rapid oxidation of fuel with oxygen, releasing heat and often light.'
      content.formulas = [
        'Theoretical O2 requirement from elemental composition',
        'Air required = O2 required / 0.23 (mass basis approximation)',
      ]
      content.theory = [
        'Complete combustion gives CO2 and H2O; incomplete combustion forms CO and soot.',
        'Air-fuel ratio control is essential for efficiency, safety and emission control.',
      ]
      content.diagram = '/images/applied-chemistry/u1/t30-combustion-process.png'
      content.diagramAlt = 'Combustion process in burner/boiler'
      break

    case 'Numericals on Combustion of Fuels':
      content.definition.text = 'This topic practices stoichiometric combustion and air requirement calculations.'
      content.formulas = [
        'Mass of O2 for C = (32/12) × mass of C',
        'Mass of O2 for H = 8 × mass of H',
        'Mass of air = O2 mass / 0.23',
      ]
      content.examples = [
        {
          label: 'Solved Example 1',
          problem: 'Find theoretical air for 1 kg carbon.',
          solution: ['O2 needed = 32/12 × 1 = 2.667 kg', 'Air = 2.667/0.23 = 11.6 kg'],
          answer: 'Theoretical air = 11.6 kg/kg C',
        },
      ]
      break

    default:
      break
  }

  return content
}

unit.topics = unit.topics.map((topic) => ({
  ...topic,
  content: topicContent(topic),
}))

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
console.log('Applied Chemistry Unit-1 content enriched successfully.')
