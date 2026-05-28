import { getFirstLessonId, getTopic, LIVE_TOPIC_SLUGS } from './topics'

const MODEL = 'claude-sonnet-4-5-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'
const STORAGE_PREFIX = 'learnify-roadmap-v2'
const ACTIVE_ROADMAP_KEY = 'learnify-roadmap-active-v1'
export const ROADMAP_EVENT = 'learnify-roadmap-updated'
const MAX_STAGES = 5

const TOPIC_ALIASES = {
  html: ['html', 'markup', 'semantic html', 'web pages', 'frontend basics', 'web basics'],
  css: ['css', 'styling', 'design systems', 'responsive design', 'ui', 'layout'],
  javascript: ['javascript', 'js', 'dom', 'frontend logic', 'async javascript', 'frontend development'],
  react: ['react', 'spa', 'components', 'state management', 'hooks', 'single page app'],
  python: ['python', 'scripting', 'automation', 'programming fundamentals', 'backend', 'flask', 'django', 'fastapi', 'api', 'server-side'],
  sql: ['sql', 'databases', 'database', 'queries', 'analytics', 'data analytics', 'database design'],
  java: ['java', 'oop', 'object oriented programming', 'android', 'mobile development'],
  dsa: ['dsa', 'data structures', 'algorithms', 'problem solving', 'interview prep', 'coding interview'],
}

const ROADMAP_PRESETS = {
  frontend: {
    title: 'Frontend Developer Roadmap',
    careerPath: 'Frontend Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-16 weeks',
    summary:
      'Build web interfaces from the ground up, move through JavaScript and React, then finish with portfolio-ready projects and deployment habits.',
    recommendedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Accessibility', 'Git'],
    alternativePaths: ['UI Engineer', 'Web Designer', 'Full-Stack Developer'],
    projectIdeas: [
      'Personal portfolio site',
      'Responsive product landing page',
      'Task tracker with local state',
      'Mini e-commerce storefront',
    ],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn how the web is structured, styled, and made responsive.',
        goals: [
          'Understand semantic HTML and page structure',
          'Write clean CSS for layout and spacing',
          'Build mobile-first pages that look good on every screen',
        ],
        topics: [
          {
            id: 'html-foundations',
            title: 'HTML foundations',
            topicSlug: 'html',
            description: 'Learn the document model, semantic tags, forms, and page structure.',
            subtopics: ['Document structure', 'Headings and links', 'Forms and media', 'Semantic elements'],
            practiceTasks: ['Recreate a simple article page', 'Build a contact form layout'],
            project: 'A clean personal profile page',
          },
          {
            id: 'css-fundamentals',
            title: 'CSS fundamentals',
            topicSlug: 'css',
            description: 'Style layouts, spacing, color, typography, and responsive breakpoints.',
            subtopics: ['Selectors and cascade', 'Box model', 'Flexbox and Grid', 'Responsive design'],
            practiceTasks: ['Clone a card layout', 'Convert a desktop layout into mobile-first CSS'],
            project: 'A responsive landing page',
          },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Add interactivity and reusable UI behavior with JavaScript.',
        goals: [
          'Understand DOM manipulation and events',
          'Handle asynchronous work and APIs',
          'Build interactive components with state',
        ],
        topics: [
          {
            id: 'javascript-fundamentals',
            title: 'JavaScript fundamentals',
            topicSlug: 'javascript',
            description: 'Learn variables, functions, arrays, objects, and control flow.',
            subtopics: ['Variables and scope', 'Functions', 'Arrays and objects', 'Control flow'],
            practiceTasks: ['Write a calculator script', 'Build a quiz counter', 'Manipulate DOM content'],
            project: 'A dynamic to-do list',
          },
          {
            id: 'async-and-dom',
            title: 'DOM, events, and async JavaScript',
            topicSlug: 'javascript',
            description: 'Work with forms, events, fetch, and promise-based workflows.',
            subtopics: ['DOM traversal', 'Events and forms', 'Fetch API', 'Promises and async/await'],
            practiceTasks: ['Fetch and render API data', 'Add client-side validation'],
            project: 'A search-powered dashboard widget',
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Organize UI logic, scale components, and prepare production-ready frontend work.',
        goals: [
          'Build reusable component patterns',
          'Understand routing, state, and performance basics',
          'Translate designs into production UI flows',
        ],
        topics: [
          {
            id: 'react-basics',
            title: 'React basics',
            topicSlug: 'react',
            description: 'Create component-driven interfaces with props, state, and hooks.',
            subtopics: ['Components and props', 'State and effects', 'Lists and forms', 'Hooks patterns'],
            practiceTasks: ['Turn an app mockup into components', 'Build a reusable modal'],
            project: 'A notes app with filters and persistence',
          },
          {
            id: 'frontend-architecture',
            title: 'Frontend architecture',
            topicSlug: 'react',
            description: 'Structure larger applications with routing, reusable state, and clean boundaries.',
            subtopics: ['Routing and layouts', 'State organization', 'Performance basics', 'Accessibility checks'],
            practiceTasks: ['Split a feature into components', 'Audit accessibility issues'],
            project: 'A multi-page learning dashboard',
          },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Polish deployment, testing, and optimization so your portfolio is job-ready.',
        goals: [
          'Ship polished projects with strong UX',
          'Learn performance, testing, and deployment habits',
          'Prepare a portfolio that tells a clear story',
        ],
        topics: [
          {
            id: 'performance-and-testing',
            title: 'Performance and testing',
            topicSlug: 'javascript',
            description: 'Measure bundle size, loading speed, and user interaction quality.',
            subtopics: ['Lighthouse basics', 'Unit testing concepts', 'Code splitting', 'Caching and loading'],
            practiceTasks: ['Reduce a slow page render', 'Add regression checks to a component'],
            project: 'Optimize and document one of your earlier projects',
          },
        ],
      },
    ],
  },
  backend: {
    title: 'Backend Developer Roadmap',
    careerPath: 'Backend Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-16 weeks',
    summary:
      'Build server-side skills with Python, SQL, APIs, and software design habits that support real-world backend applications.',
    recommendedSkills: ['Python', 'SQL', 'APIs', 'Debugging', 'Git', 'Problem Solving'],
    alternativePaths: ['Full-Stack Developer', 'Automation Engineer', 'API Engineer'],
    projectIdeas: [
      'Task API with database storage',
      'Authentication-ready CRUD service',
      'Inventory management backend',
      'Mini dashboard API',
    ],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn the building blocks of programming and data storage.',
        goals: ['Understand Python syntax', 'Read and write structured data', 'Learn how backend apps are organized'],
        topics: [
          {
            id: 'python-fundamentals',
            title: 'Python fundamentals',
            topicSlug: 'python',
            description: 'Learn the language used for many backend tools and services.',
            subtopics: ['Variables', 'Functions', 'Loops', 'Modules'],
            practiceTasks: ['Write utility scripts', 'Solve beginner logic problems'],
            project: 'A command-line helper app',
          },
          {
            id: 'sql-fundamentals',
            title: 'SQL fundamentals',
            topicSlug: 'sql',
            description: 'Store, query, and organize application data.',
            subtopics: ['Tables', 'SELECT', 'WHERE', 'Joins'],
            practiceTasks: ['Query sample tables', 'Model a simple database'],
            project: 'A small relational database design',
          },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Add APIs, structured data flow, and reusable service logic.',
        goals: ['Understand request/response flow', 'Build REST-style thinking', 'Connect code to databases safely'],
        topics: [
          {
            id: 'api-design',
            title: 'API design and integration',
            topicSlug: 'python',
            description: 'Build the habit of designing clear service endpoints and payloads.',
            subtopics: ['Endpoints', 'Request bodies', 'Response codes', 'Validation'],
            practiceTasks: ['Draft API routes', 'Test JSON responses'],
            project: 'A notes or todo API blueprint',
          },
          {
            id: 'data-layer',
            title: 'Database layer and queries',
            topicSlug: 'sql',
            description: 'Write queries and shape data for real application use.',
            subtopics: ['Joins', 'Filtering', 'Index basics', 'Data modeling'],
            practiceTasks: ['Write reporting queries', 'Design tables for an app'],
            project: 'A database-backed CRUD workflow',
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Strengthen software design, debugging, and deployment habits.',
        goals: ['Organize larger codebases', 'Handle errors and edge cases', 'Build professional backend habits'],
        topics: [
          {
            id: 'architecture',
            title: 'Architecture and patterns',
            topicSlug: 'dsa',
            description: 'Think about reusable structures, complexity, and maintainable design.',
            subtopics: ['Separation of concerns', 'Complexity basics', 'Error handling', 'Patterns'],
            practiceTasks: ['Refactor a messy script', 'Explain a design decision'],
            project: 'A cleaner service structure',
          },
          {
            id: 'deployment-basics',
            title: 'Testing and deployment basics',
            topicSlug: 'python',
            description: 'Prepare code to be shared, tested, and maintained.',
            subtopics: ['Testing', 'Config handling', 'Logging', 'Environment setup'],
            practiceTasks: ['Add validation', 'Document setup steps'],
            project: 'A deployable backend demo',
          },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Build a job-ready capstone and sharpen interview readiness.',
        goals: ['Ship a portfolio backend project', 'Prepare interview explanations', 'Show engineering maturity'],
        topics: [
          {
            id: 'capstone-backend',
            title: 'Capstone backend project',
            topicSlug: 'python',
            description: 'Combine APIs, persistence, and product thinking into one polished project.',
            subtopics: ['Problem statement', 'System design', 'Testing', 'Documentation'],
            practiceTasks: ['Write a README', 'Create a demo script'],
            project: 'A production-style backend case study',
          },
        ],
      },
    ],
  },
  fullstack: {
    title: 'Full-Stack Developer Roadmap',
    careerPath: 'Full-Stack Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '14-18 weeks',
    summary:
      'Combine frontend and backend skills into complete apps with databases, APIs, and polished user experiences.',
    recommendedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'SQL'],
    alternativePaths: ['Frontend Developer', 'Backend Developer', 'Product Engineer'],
    projectIdeas: [
      'Full-stack task manager',
      'Student portal with login flow',
      'Content dashboard with filters',
      'Portfolio app with API integration',
    ],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 4,
        overview: 'Build web and data foundations before adding app logic.',
        goals: ['Understand the web stack', 'Build responsive pages', 'Learn data storage basics'],
        topics: [
          { id: 'html-css', title: 'HTML and CSS', topicSlug: 'html', description: 'Create semantic, responsive layouts.', subtopics: ['Structure', 'Forms', 'Layout', 'Responsive design'], practiceTasks: ['Clone a page', 'Make it mobile-friendly'], project: 'A responsive landing page' },
          { id: 'javascript-basics', title: 'JavaScript basics', topicSlug: 'javascript', description: 'Add interactivity and user-driven behavior.', subtopics: ['Variables', 'Functions', 'Events', 'DOM'], practiceTasks: ['Build a calculator', 'Make a form interactive'], project: 'An interactive UI prototype' },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Connect frontend components to data and API flows.',
        goals: ['Build component-based interfaces', 'Understand API consumption', 'Persist app data'],
        topics: [
          { id: 'react-ui', title: 'React UI development', topicSlug: 'react', description: 'Break interfaces into reusable components.', subtopics: ['Components', 'Props', 'State', 'Hooks'], practiceTasks: ['Split a mockup into components', 'Create a reusable card'], project: 'A dashboard UI' },
          { id: 'sql-storage', title: 'SQL and storage', topicSlug: 'sql', description: 'Store app data in a structured database.', subtopics: ['Tables', 'Joins', 'CRUD', 'Filtering'], practiceTasks: ['Design a schema', 'Write CRUD queries'], project: 'A database-backed feature' },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Join frontend, backend, and deployment into one product flow.',
        goals: ['Create full app flows', 'Think about maintainability', 'Prepare a portfolio-quality project'],
        topics: [
          { id: 'backend-apis', title: 'Backend APIs', topicSlug: 'python', description: 'Add server logic and data endpoints.', subtopics: ['Routes', 'Validation', 'Response shapes', 'Auth basics'], practiceTasks: ['Create REST endpoints', 'Connect UI to data'], project: 'An API-driven app' },
          { id: 'problem-solving', title: 'Problem solving and architecture', topicSlug: 'dsa', description: 'Improve structure and code quality.', subtopics: ['Patterns', 'Complexity', 'Error handling', 'Refactoring'], practiceTasks: ['Refactor a feature', 'Solve practice problems'], project: 'A refactored app module' },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Package a capstone and interview-ready story.',
        goals: ['Ship a polished capstone', 'Document your decisions', 'Practice interview explanations'],
        topics: [
          { id: 'capstone', title: 'Capstone and polish', topicSlug: 'react', description: 'Finish an app that demonstrates product thinking.', subtopics: ['Testing', 'Deployment', 'Performance', 'Docs'], practiceTasks: ['Write a case study', 'Record a demo'], project: 'A job-ready full-stack capstone' },
        ],
      },
    ],
  },
  dataScience: {
    title: 'Data Science Roadmap',
    careerPath: 'Data Scientist / Data Analyst',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '14-18 weeks',
    summary:
      'Start with Python and SQL, build data analysis habits, then progress into statistics, visualization, and portfolio projects.',
    recommendedSkills: ['Python', 'SQL', 'Statistics', 'Data Visualization', 'Problem Solving'],
    alternativePaths: ['Data Analyst', 'ML Engineer', 'Business Intelligence Analyst'],
    projectIdeas: [
      'Exploratory data analysis report',
      'Sales dashboard with charts',
      'Customer segmentation summary',
      'Mini prediction project',
    ],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 4,
        overview: 'Learn Python, notebooks, and the basics of working with data.',
        goals: [
          'Write Python programs confidently',
          'Load, inspect, and clean simple datasets',
          'Use SQL to retrieve and summarize data',
        ],
        topics: [
          {
            id: 'python-fundamentals',
            title: 'Python fundamentals',
            topicSlug: 'python',
            description: 'Build programming basics, syntax confidence, and a problem-solving habit.',
            subtopics: ['Variables and data types', 'Control flow', 'Functions', 'Collections'],
            practiceTasks: ['Write small automation scripts', 'Solve simple coding exercises'],
            project: 'A command-line tracker for daily habits',
          },
          {
            id: 'sql-basics',
            title: 'SQL basics',
            topicSlug: 'sql',
            description: 'Query tables, filter rows, group results, and learn how data is stored.',
            subtopics: ['SELECT statements', 'WHERE and ORDER BY', 'Aggregations', 'Joins'],
            practiceTasks: ['Query a sample dataset', 'Answer business questions with SQL'],
            project: 'A simple database for a shop or library',
          },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Turn raw data into insights using cleaning, analysis, and visualization.',
        goals: [
          'Use pandas-style workflows and data wrangling thinking',
          'Create charts and explain patterns clearly',
          'Build a reproducible analysis notebook',
        ],
        topics: [
          {
            id: 'data-analysis-workflow',
            title: 'Data analysis workflow',
            topicSlug: 'python',
            description: 'Structure analysis from import to insight with clean, repeatable steps.',
            subtopics: ['Data cleaning', 'Missing values', 'Summary statistics', 'Feature exploration'],
            practiceTasks: ['Clean a messy CSV', 'Create a notebook summary'],
            project: 'A data cleaning and analysis notebook',
          },
          {
            id: 'visualization',
            title: 'Visualization and reporting',
            topicSlug: 'python',
            description: 'Make charts that communicate insight and support decisions.',
            subtopics: ['Chart selection', 'Trend analysis', 'Comparisons', 'Storytelling with data'],
            practiceTasks: ['Build at least 5 chart types', 'Summarize findings in plain language'],
            project: 'A dashboard-style report',
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Deepen statistical reasoning, experiments, and model-ready preparation.',
        goals: [
          'Understand statistical thinking and validation',
          'Prepare features for prediction tasks',
          'Communicate project assumptions and tradeoffs',
        ],
        topics: [
          {
            id: 'stats-and-experiments',
            title: 'Statistics and experimentation',
            topicSlug: 'dsa',
            description: 'Use careful reasoning to compare results and make evidence-based decisions.',
            subtopics: ['Distribution basics', 'Sampling', 'Hypothesis testing', 'Experiment design'],
            practiceTasks: ['Compare two groups of data', 'Write assumptions and limitations'],
            project: 'A structured A/B test analysis report',
          },
          {
            id: 'problem-solving',
            title: 'Problem solving and data structures',
            topicSlug: 'dsa',
            description: 'Strengthen logical thinking for interview and analytics problem solving.',
            subtopics: ['Arrays and strings', 'Complexity basics', 'Search and sort thinking', 'Patterns'],
            practiceTasks: ['Solve 10 beginner algorithm problems', 'Explain your approach aloud'],
            project: 'A set of solved practice notebooks',
          },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Package your work into a strong portfolio with domain-focused projects.',
        goals: [
          'Ship an end-to-end portfolio project',
          'Document business impact and results',
          'Prepare for interviews and case studies',
        ],
        topics: [
          {
            id: 'portfolio-project',
            title: 'Portfolio project and presentation',
            topicSlug: 'python',
            description: 'Package your best project with a clean notebook, charts, and summary.',
            subtopics: ['Problem statement', 'Methodology', 'Results', 'Presentation'],
            practiceTasks: ['Write a project readme', 'Create a short slide deck'],
            project: 'A complete case study portfolio project',
          },
        ],
      },
    ],
  },
  python: {
    title: 'Python Developer Roadmap',
    careerPath: 'Python Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-16 weeks',
    summary:
      'Learn Python basics, build problem-solving strength, and move into real applications, tooling, and portfolio projects.',
    recommendedSkills: ['Python', 'DSA', 'SQL', 'Debugging', 'Project Planning'],
    alternativePaths: ['Backend Developer', 'Automation Engineer', 'Data Analyst'],
    projectIdeas: [
      'Automation scripts',
      'Calculator and CLI tools',
      'Student record manager',
      'API-driven mini app',
    ],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn Python syntax and basic programming patterns.',
        goals: ['Understand basic syntax', 'Write small scripts', 'Solve simple logic problems'],
        topics: [
          {
            id: 'python-basics',
            title: 'Python basics',
            topicSlug: 'python',
            description: 'Learn variables, conditionals, loops, and functions.',
            subtopics: ['Variables', 'Control flow', 'Functions', 'Input/output'],
            practiceTasks: ['Write a calculator', 'Build a number guessing game'],
            project: 'A basic command-line utility',
          },
          {
            id: 'problem-solving-basics',
            title: 'Problem solving basics',
            topicSlug: 'dsa',
            description: 'Practice logic, patterns, and clean thinking.',
            subtopics: ['Patterns', 'Iteration', 'Trace the code', 'Debugging'],
            practiceTasks: ['Solve 5 easy problems', 'Explain your solution steps'],
            project: 'A set of solved beginner exercises',
          },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Work with data structures, files, and databases.',
        goals: ['Use collections effectively', 'Read and write files', 'Query and store structured data'],
        topics: [
          {
            id: 'python-data-structures',
            title: 'Data structures and algorithms',
            topicSlug: 'dsa',
            description: 'Build speed and confidence with arrays, stacks, queues, and maps.',
            subtopics: ['Arrays and strings', 'Hash maps', 'Stacks and queues', 'Sorting and searching'],
            practiceTasks: ['Practice time complexity', 'Solve intermediate problem sets'],
            project: 'A problem-solving notebook',
          },
          {
            id: 'python-sql',
            title: 'Python and SQL',
            topicSlug: 'sql',
            description: 'Connect Python programs to data stored in tables.',
            subtopics: ['CRUD basics', 'Joins', 'Grouping', 'Data retrieval'],
            practiceTasks: ['Query a database', 'Export results to a report'],
            project: 'A student marks or inventory tracker',
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Build real applications and strengthen software habits.',
        goals: ['Write modular code', 'Use reusable patterns', 'Prepare portfolio projects'],
        topics: [
          {
            id: 'project-architecture',
            title: 'Project architecture and APIs',
            topicSlug: 'python',
            description: 'Organize larger codebases and interact with external services.',
            subtopics: ['Modules and packages', 'API requests', 'Error handling', 'Logging'],
            practiceTasks: ['Structure a small package', 'Consume a public API'],
            project: 'An API-powered automation app',
          },
          {
            id: 'portfolio-project',
            title: 'Portfolio project',
            topicSlug: 'python',
            description: 'Ship a complete project that demonstrates your skill range.',
            subtopics: ['Planning', 'Testing basics', 'Documentation', 'Presentation'],
            practiceTasks: ['Write a project readme', 'Record a demo walkthrough'],
            project: 'A job-ready Python app',
          },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Refine deployment, testing, and interview readiness.',
        goals: ['Polish your portfolio', 'Review edge cases', 'Prepare for interviews'],
        topics: [
          {
            id: 'testing-deployment',
            title: 'Testing and deployment',
            topicSlug: 'python',
            description: 'Check code quality and learn how to share your work.',
            subtopics: ['Testing strategy', 'Packaging', 'Deployment basics', 'Maintenance'],
            practiceTasks: ['Add tests', 'Deploy or publish a finished project'],
            project: 'A polished capstone project',
          },
        ],
      },
    ],
  },
  java: {
    title: 'Java Developer Roadmap',
    careerPath: 'Java Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-16 weeks',
    summary:
      'Learn Java fundamentals, object-oriented programming, data structures, and the practices needed to build reliable applications.',
    recommendedSkills: ['Java', 'OOP', 'DSA', 'SQL', 'Problem Solving'],
    alternativePaths: ['Android Developer', 'Backend Developer', 'Software Engineer'],
    projectIdeas: ['CLI library manager', 'Student record system', 'Object-oriented game', 'Mini backend service'],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn Java syntax and core language structure.',
        goals: ['Write basic Java programs', 'Understand classes and objects', 'Use the language confidently'],
        topics: [
          { id: 'java-basics', title: 'Java basics', topicSlug: 'java', description: 'Syntax, variables, loops, and methods.', subtopics: ['Syntax', 'Variables', 'Control flow', 'Methods'], practiceTasks: ['Print pattern programs', 'Write a calculator'], project: 'A command-line utility' },
          { id: 'oop-foundations', title: 'OOP foundations', topicSlug: 'java', description: 'Understand classes, objects, and encapsulation.', subtopics: ['Classes', 'Objects', 'Constructors', 'Encapsulation'], practiceTasks: ['Create simple classes', 'Model a real-world object'], project: 'A book or student manager' },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Expand into collections, exception handling, and clean code habits.',
        goals: ['Use collections effectively', 'Handle errors cleanly', 'Structure code in packages'],
        topics: [
          { id: 'collections', title: 'Collections and generics', topicSlug: 'dsa', description: 'Use lists, maps, sets, and common patterns.', subtopics: ['Lists', 'Maps', 'Sets', 'Generics'], practiceTasks: ['Solve collection exercises', 'Build a menu-driven app'], project: 'A data organizer app' },
          { id: 'exceptions', title: 'Exceptions and I/O', topicSlug: 'java', description: 'Learn file handling and robust error management.', subtopics: ['Exceptions', 'Files', 'Streams', 'Input handling'], practiceTasks: ['Read/write a file', 'Handle invalid input'], project: 'A file-based tracker' },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Build larger applications with solid architecture and data handling.',
        goals: ['Organize code well', 'Use SQL with Java', 'Prepare a larger project'],
        topics: [
          { id: 'java-sql', title: 'Java and SQL integration', topicSlug: 'sql', description: 'Connect Java programs to databases and data flows.', subtopics: ['JDBC basics', 'Queries', 'CRUD', 'Data modeling'], practiceTasks: ['Build database CRUD', 'Summarize query output'], project: 'A database-backed Java app' },
          { id: 'dsa-practice', title: 'Data structures and algorithms', topicSlug: 'dsa', description: 'Sharpen problem solving for interviews and engineering work.', subtopics: ['Arrays', 'Strings', 'Searching', 'Sorting'], practiceTasks: ['Solve practice sets', 'Analyze runtime'], project: 'A solved problem notebook' },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Package a polished Java capstone and prepare to present it.',
        goals: ['Ship a capstone', 'Document tradeoffs', 'Prepare interview answers'],
        topics: [
          { id: 'java-capstone', title: 'Capstone project', topicSlug: 'java', description: 'Combine Java, OOP, and data into a realistic app.', subtopics: ['Project planning', 'Testing', 'Deployment', 'Docs'], practiceTasks: ['Write a README', 'Record a demo'], project: 'A job-ready Java capstone' },
        ],
      },
    ],
  },
  android: {
    title: 'Android Developer Roadmap',
    careerPath: 'Android Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-18 weeks',
    summary:
      'Start with Java fundamentals and build toward app structure, data flow, and practical mobile project thinking.',
    recommendedSkills: ['Java', 'OOP', 'DSA', 'UI Logic', 'SQL'],
    alternativePaths: ['Java Developer', 'Mobile Engineer', 'Software Engineer'],
    projectIdeas: ['Habit tracker concept', 'Offline notes app', 'Simple catalog app', 'Portfolio mobile prototype'],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn the Java and OOP foundations behind Android development.',
        goals: ['Understand Java syntax', 'Learn object-oriented thinking', 'Build confidence with small programs'],
        topics: [
          { id: 'java-foundations', title: 'Java foundations', topicSlug: 'java', description: 'Core language syntax and flow.', subtopics: ['Variables', 'Methods', 'Control flow', 'Arrays'], practiceTasks: ['Write small programs', 'Trace code behavior'], project: 'A CLI utility' },
          { id: 'oop', title: 'Object-oriented programming', topicSlug: 'java', description: 'Model app logic using classes and objects.', subtopics: ['Classes', 'Objects', 'Inheritance', 'Polymorphism'], practiceTasks: ['Model a product or user', 'Refactor procedural code'], project: 'A model-driven console app' },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Practice app data flow, state, and reusable problem solving.',
        goals: ['Think in screens and data states', 'Organize app logic', 'Use data structures where appropriate'],
        topics: [
          { id: 'ui-logic', title: 'UI logic and state thinking', topicSlug: 'react', description: 'Understand state-driven interfaces and interactions.', subtopics: ['Events', 'State', 'Conditional rendering', 'Lists'], practiceTasks: ['Map UI states', 'Design a screen flow'], project: 'A prototype app screen flow' },
          { id: 'dsa-basics', title: 'Problem solving basics', topicSlug: 'dsa', description: 'Build algorithmic thinking for app logic and interviews.', subtopics: ['Arrays', 'Strings', 'Searching', 'Sorting'], practiceTasks: ['Solve starter problems', 'Analyze simple logic'], project: 'A practice notebook' },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 5,
        overview: 'Build toward a realistic app concept with data storage and flows.',
        goals: ['Connect screens to data', 'Handle persistence ideas', 'Plan a portfolio-ready app'],
        topics: [
          { id: 'storage', title: 'Data storage and queries', topicSlug: 'sql', description: 'Store and retrieve app data through structured queries.', subtopics: ['Schemas', 'CRUD', 'Filtering', 'Joins'], practiceTasks: ['Design tables', 'Write sample queries'], project: 'A structured data layer' },
          { id: 'architecture', title: 'App architecture', topicSlug: 'java', description: 'Organize a codebase into maintainable parts.', subtopics: ['Packages', 'Separation of concerns', 'Error handling', 'Testing basics'], practiceTasks: ['Refactor a module', 'Document app boundaries'], project: 'A maintainable app structure' },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 3,
        overview: 'Package a polished capstone concept and prepare your story.',
        goals: ['Build a capstone plan', 'Document your approach', 'Explain tradeoffs in interviews'],
        topics: [
          { id: 'capstone', title: 'Capstone project planning', topicSlug: 'java', description: 'Take an app from idea to a refined project plan.', subtopics: ['Scope', 'Data flow', 'Testing', 'Demo'], practiceTasks: ['Write a feature backlog', 'Prepare a project readme'], project: 'An Android project concept' },
        ],
      },
    ],
  },
  interviewPrep: {
    title: 'Interview Prep Roadmap',
    careerPath: 'Interview Prep',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '8-12 weeks',
    summary:
      'Focus on data structures, algorithms, core language knowledge, and practical problem solving so you can perform in technical interviews.',
    recommendedSkills: ['DSA', 'Problem Solving', 'JavaScript', 'Python', 'SQL'],
    alternativePaths: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    projectIdeas: ['Problem notebook', 'Flashcard system', 'Mock interview tracker', 'Revision planner'],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 2,
        overview: 'Learn the interview fundamentals and problem-solving language.',
        goals: ['Understand complexity basics', 'Recognize common patterns', 'Build a study habit'],
        topics: [
          { id: 'problem-patterns', title: 'Problem patterns', topicSlug: 'dsa', description: 'Recognize the main structures behind interview questions.', subtopics: ['Arrays', 'Strings', 'Maps', 'Two pointers'], practiceTasks: ['Solve 10 warmup problems', 'Explain each solution out loud'], project: 'A pattern notebook' },
          { id: 'language-review', title: 'Language review', topicSlug: 'javascript', description: 'Refresh the syntax you will use in interviews.', subtopics: ['Variables', 'Functions', 'Objects', 'Loops'], practiceTasks: ['Review syntax notes', 'Write easy exercises from memory'], project: 'A syntax quick-reference sheet' },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Strengthen solution strategy and communication.',
        goals: ['Solve mid-level problems', 'Talk through your reasoning', 'Improve speed and accuracy'],
        topics: [
          { id: 'search-sort', title: 'Searching and sorting', topicSlug: 'dsa', description: 'Master the core techniques behind many interview questions.', subtopics: ['Binary search', 'Sorting', 'Sliding window', 'Hashing'], practiceTasks: ['Solve a mixed set', 'Compare brute force vs optimized'], project: 'A solved-search notebook' },
          { id: 'sql-interview', title: 'SQL interview basics', topicSlug: 'sql', description: 'Answer data and database questions with confidence.', subtopics: ['Joins', 'Grouping', 'Filtering', 'Schema basics'], practiceTasks: ['Write query drills', 'Explain SQL answers out loud'], project: 'A SQL revision deck' },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 3,
        overview: 'Practice timed sets and systemized review.',
        goals: ['Improve consistency', 'Simulate interview pressure', 'Identify weak areas'],
        topics: [
          { id: 'timed-practice', title: 'Timed practice and review', topicSlug: 'dsa', description: 'Build speed while keeping explanations clear.', subtopics: ['Timed sets', 'Mistake tracking', 'Pattern review', 'Complexity'], practiceTasks: ['Run timed mock sessions', 'Review mistakes weekly'], project: 'A revision tracker' },
          { id: 'coding-communication', title: 'Communication and tradeoffs', topicSlug: 'javascript', description: 'Explain solutions, edge cases, and choices clearly.', subtopics: ['Clarity', 'Tradeoffs', 'Edge cases', 'Dry runs'], practiceTasks: ['Narrate solutions', 'Write answer summaries'], project: 'A mock interview script pack' },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Refine your final prep, portfolio, and confidence.',
        goals: ['Consolidate revision', 'Polish your interview story', 'Feel ready for real interviews'],
        topics: [
          { id: 'final-revision', title: 'Final revision and mock interviews', topicSlug: 'dsa', description: 'Review, rehearse, and present yourself clearly.', subtopics: ['Mock rounds', 'Behavioral prep', 'Resume story', 'Final notes'], practiceTasks: ['Do one full mock interview', 'Prepare 3 project stories'], project: 'A final interview prep kit' },
        ],
      },
    ],
  },
  general: {
    title: 'Software Developer Roadmap',
    careerPath: 'Software / Full-Stack Developer',
    difficulty: 'Beginner to Advanced',
    estimatedDuration: '12-16 weeks',
    summary:
      'Start with web fundamentals, build interactive apps, and end with a portfolio that shows practical, job-ready skills.',
    recommendedSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'DSA', 'SQL'],
    alternativePaths: ['Frontend Developer', 'Backend Developer', 'Web App Developer'],
    projectIdeas: ['Portfolio site', 'Interactive dashboard', 'Task manager', 'Study planner'],
    stages: [
      {
        id: 'beginner',
        title: 'Beginner',
        difficulty: 'Beginner',
        durationWeeks: 3,
        overview: 'Learn how web applications are structured and styled.',
        goals: ['Understand page structure', 'Build responsive layouts', 'Get comfortable with the browser'],
        topics: [
          {
            id: 'web-foundations',
            title: 'Web foundations',
            topicSlug: 'html',
            description: 'Understand semantic markup and how documents are built.',
            subtopics: ['HTML structure', 'Headings and links', 'Forms', 'Semantic layout'],
            practiceTasks: ['Build a profile page', 'Create a form layout'],
            project: 'A responsive personal landing page',
          },
          {
            id: 'styling-foundations',
            title: 'Styling foundations',
            topicSlug: 'css',
            description: 'Apply colors, spacing, responsiveness, and visual hierarchy.',
            subtopics: ['Box model', 'Flexbox', 'Grid', 'Responsive design'],
            practiceTasks: ['Clone a card layout', 'Make a page mobile-friendly'],
            project: 'A polished portfolio shell',
          },
        ],
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        difficulty: 'Intermediate',
        durationWeeks: 4,
        overview: 'Add interactivity and reusable logic.',
        goals: ['Use JavaScript confidently', 'Manage state and events', 'Build interactive interfaces'],
        topics: [
          {
            id: 'js-basics',
            title: 'JavaScript basics',
            topicSlug: 'javascript',
            description: 'Learn how to write and reason about application logic.',
            subtopics: ['Variables', 'Functions', 'Objects', 'Control flow'],
            practiceTasks: ['Build a calculator', 'Write a DOM counter'],
            project: 'A mini productivity tool',
          },
          {
            id: 'react-intro',
            title: 'React introduction',
            topicSlug: 'react',
            description: 'Break interfaces into components and manage state cleanly.',
            subtopics: ['Components', 'Props', 'State', 'Effects'],
            practiceTasks: ['Split a UI into components', 'Create a form with validation'],
            project: 'A dynamic notes app',
          },
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced',
        difficulty: 'Advanced',
        durationWeeks: 4,
        overview: 'Work with structure, databases, and application flow.',
        goals: ['Link frontend with data', 'Improve problem solving', 'Think like a builder'],
        topics: [
          {
            id: 'problem-solving',
            title: 'Problem solving',
            topicSlug: 'dsa',
            description: 'Practice common algorithm and data structure patterns.',
            subtopics: ['Arrays', 'Strings', 'Searching', 'Sorting'],
            practiceTasks: ['Solve easy and medium problems', 'Review Big-O basics'],
            project: 'A solutions notebook',
          },
          {
            id: 'sql-and-data',
            title: 'SQL and data handling',
            topicSlug: 'sql',
            description: 'Store, filter, and retrieve structured app data.',
            subtopics: ['Tables', 'Joins', 'Aggregations', 'Queries'],
            practiceTasks: ['Model a simple database', 'Query and summarize data'],
            project: 'A data-backed application flow',
          },
        ],
      },
      {
        id: 'expert',
        title: 'Expert',
        difficulty: 'Expert',
        durationWeeks: 2,
        overview: 'Package a job-ready portfolio and sharpen your presentation.',
        goals: ['Ship polished projects', 'Review tradeoffs', 'Prepare to explain your work'],
        topics: [
          {
            id: 'capstone',
            title: 'Capstone project and refinement',
            topicSlug: 'react',
            description: 'Improve performance, readability, and overall product quality.',
            subtopics: ['Testing', 'Deployment', 'Performance', 'Documentation'],
            practiceTasks: ['Refactor an app feature', 'Write a project case study'],
            project: 'A portfolio capstone',
          },
        ],
      },
    ],
  },
}

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function dispatchRoadmapChange() {
  try {
    window.dispatchEvent(new CustomEvent(ROADMAP_EVENT))
  } catch {
    /* ignore */
  }
}

export function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function hashString(value) {
  let hash = 0
  const text = String(value ?? '')
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

export function getRoadmapGoalKey(goal) {
  const normalized = slugify(goal)
  return normalized ? `${normalized}-${hashString(normalized).slice(0, 6)}` : 'roadmap'
}

function roadmapStorageKey(goalKey) {
  return `${STORAGE_PREFIX}:${goalKey}`
}

function readJson(key, fallback = null) {
  const storage = getStorage()
  if (!storage) {
    return fallback
  }

  try {
    const raw = storage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    dispatchRoadmapChange()
  } catch {
    /* storage blocked */
  }
}

function readActiveGoalKey() {
  return readJson(ACTIVE_ROADMAP_KEY, '') || ''
}

function writeActiveGoalKey(goalKey) {
  const storage = getStorage()
  if (!storage) {
    return
  }

  try {
    storage.setItem(ACTIVE_ROADMAP_KEY, goalKey)
    dispatchRoadmapChange()
  } catch {
    /* storage blocked */
  }
}

export function readRoadmapRecord(goalKey = readActiveGoalKey()) {
  if (!goalKey) {
    return null
  }

  const record = readJson(roadmapStorageKey(goalKey), null)
  if (!record || typeof record !== 'object') {
    return null
  }

  return {
    ...record,
    completedIds: Array.isArray(record.completedIds) ? record.completedIds : [],
  }
}

export function readActiveRoadmapRecord() {
  return readRoadmapRecord()
}

export function saveRoadmapRecord(record) {
  if (!record?.goalKey) {
    throw new Error('Roadmap record is missing a goal key.')
  }

  const next = {
    ...record,
    completedIds: Array.isArray(record.completedIds) ? [...new Set(record.completedIds)] : [],
    updatedAt: new Date().toISOString(),
  }

  if (!next.createdAt) {
    next.createdAt = next.updatedAt
  }

  writeJson(roadmapStorageKey(next.goalKey), next)
  writeActiveGoalKey(next.goalKey)
  return next
}

export function toggleRoadmapItemComplete(goalKey, itemId) {
  if (!goalKey || !itemId) {
    return null
  }

  const record = readRoadmapRecord(goalKey)
  if (!record) {
    return null
  }

  const completedIds = new Set(record.completedIds ?? [])
  if (completedIds.has(itemId)) {
    completedIds.delete(itemId)
  } else {
    completedIds.add(itemId)
  }

  const next = saveRoadmapRecord({
    ...record,
    completedIds: [...completedIds],
  })

  return next
}

export function clearRoadmapProgress(goalKey) {
  const record = readRoadmapRecord(goalKey)
  if (!record) {
    return null
  }

  const next = saveRoadmapRecord({
    ...record,
    completedIds: [],
  })

  return next
}

export function computeRoadmapProgress(record) {
  const stages = Array.isArray(record?.stages) ? record.stages : []
  const completedIds = new Set(record?.completedIds ?? [])
  const topicItems = stages.flatMap((stage) =>
    (stage.topics ?? []).map((topic) => ({ stageId: stage.id, topicId: topic.id })),
  )

  const completedCount = topicItems.filter(({ topicId }) => completedIds.has(topicId)).length
  const totalCount = topicItems.length
  const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return {
    completedCount,
    totalCount,
    percent,
    stageProgress: stages.map((stage) => {
      const stageItems = (stage.topics ?? []).map((topic) => topic.id)
      const stageCompleted = stageItems.filter((topicId) => completedIds.has(topicId)).length
      const stageTotal = stageItems.length
      return {
        stageId: stage.id,
        completedCount: stageCompleted,
        totalCount: stageTotal,
        percent: stageTotal ? Math.round((stageCompleted / stageTotal) * 100) : 0,
      }
    }),
  }
}

function detectIntent(goal) {
  const value = normalizeText(goal).toLowerCase()

  if (/frontend|front end|ui developer|web developer|web dev|front-end/.test(value)) {
    return 'frontend'
  }

  if (/data science|data scientist|data analyst|machine learning|ml\b/.test(value)) {
    return 'dataScience'
  }

  if (/python/.test(value)) {
    return 'python'
  }

  return 'general'
}

function createTopicItem(topic, index, stageId) {
  const topicSlug = topic.topicSlug && LIVE_TOPIC_SLUGS.includes(topic.topicSlug) ? topic.topicSlug : null
  const catalogTopic = topicSlug ? getTopic(topicSlug) : null
  const tutorialUrl = topicSlug ? `/${topicSlug}` : null
  const tutorialLessonId = topicSlug ? getFirstLessonId(topicSlug) : null
  const tutorialLessonTitle = catalogTopic?.lessons?.[0]?.title ?? ''

  return {
    id: topic.id || `${stageId}-topic-${index + 1}`,
    title: normalizeText(topic.title) || `Topic ${index + 1}`,
    topicSlug,
    tutorialUrl,
    tutorialLessonId,
    tutorialLessonTitle,
    topicTitle: catalogTopic?.title ?? (normalizeText(topic.title) || `Topic ${index + 1}`),
    description: normalizeText(topic.description),
    subtopics: Array.isArray(topic.subtopics) ? topic.subtopics.map(normalizeText).filter(Boolean) : [],
    goals: Array.isArray(topic.goals) ? topic.goals.map(normalizeText).filter(Boolean) : [],
    practiceTasks: Array.isArray(topic.practiceTasks)
      ? topic.practiceTasks.map(normalizeText).filter(Boolean)
      : [],
    projects: Array.isArray(topic.projects)
      ? topic.projects.map(normalizeText).filter(Boolean)
      : topic.project
        ? [normalizeText(topic.project)]
        : [],
    difficulty: normalizeText(topic.difficulty),
    durationWeeks: Number(topic.durationWeeks) || 1,
    tools: Array.isArray(topic.tools) ? topic.tools.map(normalizeText).filter(Boolean) : [],
  }
}

function createStage(stage, index) {
  return {
    id: stage.id || `stage-${index + 1}`,
    title: normalizeText(stage.title) || `Stage ${index + 1}`,
    difficulty: normalizeText(stage.difficulty) || 'Beginner',
    durationWeeks: Number(stage.durationWeeks) || 1,
    overview: normalizeText(stage.overview),
    goals: Array.isArray(stage.goals) ? stage.goals.map(normalizeText).filter(Boolean) : [],
    topics: (Array.isArray(stage.topics) ? stage.topics : []).map((topic, topicIndex) =>
      createTopicItem(topic, topicIndex, stage.id || `stage-${index + 1}`),
    ),
  }
}

function buildPresetRoadmap(goal, preset) {
  const stages = preset.stages.slice(0, MAX_STAGES).map(createStage)
  const roadmap = {
    goalKey: getRoadmapGoalKey(goal),
    goal: normalizeText(goal),
    intent: detectIntent(goal),
    source: 'local',
    title: preset.title,
    careerPath: preset.careerPath,
    summary: preset.summary,
    estimatedDuration: preset.estimatedDuration,
    difficulty: preset.difficulty,
    recommendedSkills: preset.recommendedSkills ?? [],
    alternativePaths: preset.alternativePaths ?? [],
    projectIdeas: preset.projectIdeas ?? [],
    stages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedIds: [],
  }

  return saveRoadmapRecord(roadmap)
}

function buildFallbackRoadmap(goal) {
  const intent = detectIntent(goal)
  const preset = ROADMAP_PRESETS[intent] ?? ROADMAP_PRESETS.general
  return buildPresetRoadmap(goal, preset)
}

function normalizeAiTopic(topic, stageId, topicIndex) {
  const topicSlug = resolveTopicSlug(topic.topicSlug ?? topic.title ?? topic.topic ?? '')
  const catalogTopic = topicSlug ? getTopic(topicSlug) : null
  const tutorialUrl = topicSlug ? `/${topicSlug}` : null
  const tutorialLessonId = topicSlug ? getFirstLessonId(topicSlug) : null

  return {
    id: topic.id ? slugify(topic.id) : `${stageId}-topic-${topicIndex + 1}`,
    title: normalizeText(topic.title ?? topic.topic ?? `Topic ${topicIndex + 1}`),
    topicSlug,
    tutorialUrl,
    tutorialLessonId,
    tutorialLessonTitle: catalogTopic?.lessons?.[0]?.title ?? '',
    topicTitle: catalogTopic?.title ?? normalizeText(topic.title ?? topic.topic ?? `Topic ${topicIndex + 1}`),
    description: normalizeText(topic.description ?? topic.overview ?? ''),
    subtopics: Array.isArray(topic.subtopics)
      ? topic.subtopics.map(normalizeText).filter(Boolean)
      : Array.isArray(topic.lessons)
        ? topic.lessons.map(normalizeText).filter(Boolean)
        : [],
    goals: Array.isArray(topic.goals) ? topic.goals.map(normalizeText).filter(Boolean) : [],
    practiceTasks: Array.isArray(topic.practiceTasks)
      ? topic.practiceTasks.map(normalizeText).filter(Boolean)
      : [],
    projects: Array.isArray(topic.projects)
      ? topic.projects.map(normalizeText).filter(Boolean)
      : topic.project
        ? [normalizeText(topic.project)]
        : [],
    difficulty: normalizeText(topic.difficulty),
    durationWeeks: Number(topic.durationWeeks) || Number(topic.duration) || 1,
    tools: Array.isArray(topic.tools) ? topic.tools.map(normalizeText).filter(Boolean) : [],
  }
}

function normalizeAiStage(stage, index) {
  const stageId = stage.id ? slugify(stage.id) : `stage-${index + 1}`
  return {
    id: stageId,
    title: normalizeText(stage.title) || `Stage ${index + 1}`,
    difficulty: normalizeText(stage.difficulty) || 'Beginner',
    durationWeeks: Number(stage.durationWeeks ?? stage.weeks) || 1,
    overview: normalizeText(stage.overview ?? stage.summary ?? ''),
    goals: Array.isArray(stage.goals) ? stage.goals.map(normalizeText).filter(Boolean) : [],
    topics: (Array.isArray(stage.topics) ? stage.topics : []).map((topic, topicIndex) =>
      normalizeAiTopic(topic, stageId, topicIndex),
    ),
  }
}

function normalizeAiRoadmap(data, goal) {
  if (!data || typeof data !== 'object') {
    throw new Error('Roadmap response was empty.')
  }

  const stages = Array.isArray(data.stages) ? data.stages : Array.isArray(data.steps) ? data.steps : []
  if (stages.length === 0) {
    throw new Error('Roadmap must include at least one stage.')
  }

  const normalizedStages = stages.slice(0, MAX_STAGES).map(normalizeAiStage)

  const record = {
    goalKey: getRoadmapGoalKey(goal),
    goal: normalizeText(goal),
    intent: detectIntent(goal),
    source: 'ai',
    title: normalizeText(data.title) || 'Learning Roadmap',
    careerPath: normalizeText(data.careerPath) || normalizeText(data.role) || 'Learning Path',
    summary: normalizeText(data.summary || data.description || ''),
    estimatedDuration: normalizeText(data.estimatedDuration || data.duration || ''),
    difficulty: normalizeText(data.difficulty || ''),
    recommendedSkills: Array.isArray(data.recommendedSkills)
      ? data.recommendedSkills.map(normalizeText).filter(Boolean)
      : [],
    alternativePaths: Array.isArray(data.alternativePaths)
      ? data.alternativePaths.map(normalizeText).filter(Boolean)
      : [],
    projectIdeas: Array.isArray(data.projectIdeas)
      ? data.projectIdeas.map(normalizeText).filter(Boolean)
      : [],
    stages: normalizedStages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedIds: [],
  }

  return saveRoadmapRecord(record)
}

function getApiKey() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY?.trim() || ''
}

function buildCatalogDescription() {
  return LIVE_TOPIC_SLUGS.map((slug) => {
    const topic = getTopic(slug)
    const title = topic?.title ?? slug
    return `${slug} (${title})`
  }).join(', ')
}

function buildRoadmapPrompt(goal) {
  const catalog = buildCatalogDescription()
  return `Goal: "${goal}"

LearnTheory topics available: ${catalog}

Create a complete beginner-to-advanced learning roadmap for the goal above.

Return ONLY valid JSON in this exact shape:
{
  "title": "...",
  "careerPath": "...",
  "summary": "...",
  "difficulty": "...",
  "estimatedDuration": "...",
  "recommendedSkills": ["..."],
  "alternativePaths": ["..."],
  "projectIdeas": ["..."],
  "stages": [
    {
      "id": "beginner",
      "title": "Beginner",
      "difficulty": "Beginner",
      "durationWeeks": 3,
      "overview": "...",
      "goals": ["..."],
      "topics": [
        {
          "id": "...",
          "title": "...",
          "topicSlug": "html",
          "description": "...",
          "subtopics": ["..."],
          "practiceTasks": ["..."],
          "projects": ["..."],
          "durationWeeks": 1,
          "tools": ["..."]
        }
      ]
    }
  ]
}

Rules:
- Include 4 or 5 stages: Beginner, Intermediate, Advanced, and optional Expert.
- Every stage must include goals, topics, practice tasks, and at least one project.
- topicSlug must be one of the available LearnTheory slugs when possible.
- Keep the roadmap practical, ordered, and realistic for a complete beginner.
- Make the recommended path job-ready with projects, tools, and clear milestones.`
}

async function generateRoadmapWithAi({ goal, apiKey }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system:
        'You generate professional learning roadmaps for LearnTheory. Output only valid JSON and no markdown fences.',
      messages: [
        {
          role: 'user',
          content: buildRoadmapPrompt(goal),
        },
      ],
    }),
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const err = await res.json()
      detail = err?.error?.message ?? detail
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${res.status})`)
  }

  const data = await res.json()
  const text = data?.content?.find((block) => block.type === 'text')?.text?.trim()
  if (!text) {
    throw new Error('Empty response from the AI API.')
  }

  const parsed = extractJsonObject(text)
  return normalizeAiRoadmap(parsed, goal)
}

function extractJsonObject(text) {
  const trimmed = String(text ?? '').trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1].trim() : trimmed
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not find JSON in the response.')
  }
  return JSON.parse(raw.slice(start, end + 1))
}

function resolveTopicSlug(label) {
  const key = slugify(label)
  if (!key) {
    return null
  }

  if (LIVE_TOPIC_SLUGS.includes(key)) {
    return key
  }

  for (const [slug, aliases] of Object.entries(TOPIC_ALIASES)) {
    if (key === slug || aliases.some((alias) => key.includes(slugify(alias)) || slugify(alias).includes(key))) {
      return slug
    }
  }

  for (const slug of LIVE_TOPIC_SLUGS) {
    const topic = getTopic(slug)
    const title = slugify(topic?.title)
    if (title && (key.includes(title) || title.includes(key))) {
      return slug
    }
  }

  return null
}

export async function createRoadmapPlan(goal) {
  const trimmedGoal = normalizeText(goal)
  if (!trimmedGoal) {
    throw new Error('Please enter a learning goal.')
  }

  const apiKey = getApiKey()
  if (!apiKey) {
    const roadmap = buildFallbackRoadmap(trimmedGoal)
    return {
      roadmap,
      source: 'local',
      notice: 'Using the built-in roadmap engine because no Anthropic API key is configured.',
    }
  }

  try {
    const roadmap = await generateRoadmapWithAi({ goal: trimmedGoal, apiKey })
    return {
      roadmap,
      source: 'ai',
      notice: '',
    }
  } catch (error) {
    const roadmap = buildFallbackRoadmap(trimmedGoal)
    return {
      roadmap,
      source: 'fallback',
      notice:
        error?.message ||
        'AI generation failed, so LearnTheory created a smart local roadmap instead.',
    }
  }
}

export function getRoadmapProgressSummary(record) {
  const progress = computeRoadmapProgress(record)
  const stages = Array.isArray(record?.stages) ? record.stages : []
  const completedIds = new Set(record?.completedIds ?? [])

  return {
    ...progress,
    stages: stages.map((stage, index) => {
      const stageProgress = progress.stageProgress[index] ?? { percent: 0, completedCount: 0, totalCount: 0 }
      return {
        ...stage,
        progress: stageProgress,
        topics: (stage.topics ?? []).map((topic) => ({
          ...topic,
          completed: completedIds.has(topic.id),
        })),
      }
    }),
  }
}
