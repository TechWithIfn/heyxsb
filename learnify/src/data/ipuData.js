/**
 * @file ipuData.js — IPU syllabus content for LearnTheory (GGSIPU programmes).
 *
 * ## Data shape (TypeScript-style)
 *
 * @typedef {Object} IpuTopic
 * @property {string} id — Unique slug within subject (e.g. "mat-u1-t1")
 * @property {string} title
 * @property {string} content — Multi-paragraph markdown-friendly plain text (\\n\\n between paragraphs)
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
 */

const ipuBranches = [
  {
    "id": "cse",
    "name": "Computer Science & Engineering",
    "shortName": "CSE",
    "icon": "Cpu",
    "color": "text-blue-600",
    "description": "IPU BTech CSE — software, systems, and computing foundations across eight semesters.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BAS-101",
            "credits": 4,
            "type": "theory",
            "description": "Differential and integral calculus, differential equations, vector calculus, and Laplace transforms for IPU BTech CSE.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Differential Calculus",
                "topics": [
                  {
                    "id": "mat-u1-t1",
                    "title": "Functions, Limits, and Continuity",
                    "content": "Engineering mathematics begins with a precise language for change. A function assigns each input in its domain to exactly one output; in calculus we study how outputs vary when inputs change infinitesimally. Limits formalize approaching a value without necessarily reaching it.\n\nContinuity ensures small input changes produce small output changes. Polynomial, rational, trigonometric, exponential, and logarithmic functions appear throughout CSE—from algorithm analysis to graphics. L'Hôpital's rule resolves indeterminate forms common in asymptotic complexity.\n\nFor IPU CSE students, limits underpin Big-O reasoning, numerical stability, and optimization on loss surfaces.",
                    "keyPoints": [
                      "Limits describe approach behavior, not always value at the point",
                      "Continuity requires limit equals f(a)",
                      "Indeterminate forms use algebra or L'Hôpital",
                      "Standard limits include sin x/x → 1",
                      "One-sided limits matter for piecewise functions"
                    ],
                    "examples": [
                      {
                        "title": "sin x / x",
                        "explanation": "Ratio → 1 as x→0; used in small-angle approximations."
                      },
                      {
                        "title": "Jump discontinuity",
                        "explanation": "Left and right limits differ at a step."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Standard limit",
                        "formula": "lim(x→0) sin x / x = 1",
                        "description": "Trigonometric limit"
                      }
                    ],
                    "examQuestions": [
                      "Define limit informally and with ε-δ idea.",
                      "Evaluate lim(x→0) (1−cos x)/x².",
                      "Prove polynomials are continuous.",
                      "Find discontinuities of |x|/x.",
                      "Why does lim(ln x)/x = 0 as x→∞?"
                    ],
                    "references": [
                      {
                        "title": "Calculus: Early Transcendentals",
                        "author": "James Stewart"
                      },
                      {
                        "title": "Higher Engineering Mathematics",
                        "author": "B.S. Grewal"
                      }
                    ]
                  },
                  {
                    "id": "mat-u1-t2",
                    "title": "Derivatives and Applications",
                    "content": "The derivative f′(x) is instantaneous rate of change—geometrically tangent slope, physically velocity or throughput. Product, quotient, and chain rules differentiate composites in models.\n\nApplications: extrema, concavity, curve sketching, related rates, and Mean Value Theorem. In CS, derivatives drive gradient descent and sensitivity analysis.\n\nIPU papers often combine differentiation with optimization word problems; show complete reasoning with units.",
                    "keyPoints": [
                      "Power, product, quotient, chain rules",
                      "Critical points: f′=0 or undefined",
                      "Second derivative test for extrema",
                      "Related rates link time derivatives",
                      "MVT: instantaneous rate equals average rate somewhere"
                    ],
                    "examples": [
                      {
                        "title": "Profit max",
                        "explanation": "Solve R′(q)=C′(q)."
                      },
                      {
                        "title": "Gradient step",
                        "explanation": "w ← w − η∇L uses partial derivatives."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Chain rule",
                        "formula": "(f∘g)′(x) = f′(g(x))·g′(x)",
                        "description": "Composite functions"
                      },
                      {
                        "name": "Second derivative test",
                        "formula": "f″(c)>0 ⇒ local min",
                        "description": "Concavity test"
                      }
                    ],
                    "examQuestions": [
                      "Differentiate x²e^x.",
                      "Find critical points of x³−3x on [−2,2].",
                      "Related rates: rising balloon angle.",
                      "Apply MVT on [1,4].",
                      "Why is |x|′ undefined at 0?"
                    ],
                    "references": [
                      {
                        "title": "Thomas' Calculus",
                        "author": "George B. Thomas"
                      },
                      {
                        "title": "Engineering Mathematics",
                        "author": "Erwin Kreyszig"
                      }
                    ]
                  },
                  {
                    "id": "mat-u1-t3",
                    "title": "Higher-Order Derivatives and Taylor Approximation",
                    "content": "Higher derivatives describe curvature and acceleration. f″(x) signs reveal concavity; third derivatives appear in jerk models. Taylor polynomials approximate f near a point using derivatives at the expansion center.\n\nMaclaurin series are Taylor series at 0. Truncation error is O((x−a)^{n+1}) for degree-n polynomials—central to numerical libraries and error analysis in floating-point computation.\n\nCSE applications include local linearization of nonlinear functions and stability analysis near equilibria.",
                    "keyPoints": [
                      "f″ indicates concavity and inflection",
                      "Taylor: f(x)≈f(a)+f′(a)(x−a)+…",
                      "Maclaurin series for e^x, sin x, cos x",
                      "Remainder term bounds truncation error",
                      "Linearization: first-order Taylor"
                    ],
                    "examples": [
                      {
                        "title": "e^x linearization",
                        "explanation": "e^x ≈ 1+x near 0 for quick estimates."
                      },
                      {
                        "title": "Harmonic motion",
                        "explanation": "Position derivatives give velocity and acceleration."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Taylor (order 2)",
                        "formula": "f(x)≈f(a)+f′(a)(x−a)+½f″(a)(x−a)²",
                        "description": "Quadratic approximation"
                      }
                    ],
                    "examQuestions": [
                      "Find f″ and classify concavity for x⁴−4x².",
                      "Write Maclaurin polynomial for e^x to x³.",
                      "Estimate √1.1 using linearization.",
                      "State Taylor remainder idea.",
                      "Link series truncation to numerical error."
                    ],
                    "references": [
                      {
                        "title": "Stewart Calculus",
                        "author": "James Stewart"
                      },
                      {
                        "title": "Grewal",
                        "author": "B.S. Grewal"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Integral Calculus",
                "topics": [
                  {
                    "id": "mat-u2-t1",
                    "title": "Definite and Indefinite Integrals",
                    "content": "Integration reverses differentiation. Indefinite integrals give antiderivative families (+C). Definite integrals ∫ₐᵇ f compute signed area and accumulated quantities.\n\nFTC links derivatives and integrals. Substitution and integration by parts extend the toolkit. Improper integrals use limits when intervals or integrands are unbounded.\n\nDiscrete sums in algorithm analysis often mirror continuous integrals in average-case estimates.",
                    "keyPoints": [
                      "Antiderivatives undo derivatives (+C)",
                      "FTC evaluates definite integrals",
                      "u-substitution for composites",
                      "Integration by parts",
                      "Improper integrals via limits"
                    ],
                    "examples": [
                      {
                        "title": "Distance from velocity",
                        "explanation": "∫v(t)dt gives displacement."
                      },
                      {
                        "title": "PDF normalization",
                        "explanation": "∫f(x)dx=1 over support."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "FTC",
                        "formula": "∫ₐᵇ f(x)dx = F(b)−F(a)",
                        "description": "F′=f"
                      }
                    ],
                    "examQuestions": [
                      "∫ x e^x dx by parts.",
                      "∫₀¹ x² dx via FTC.",
                      "Convergence of ∫₁^∞ 1/x^p.",
                      "Area between y=x and y=x².",
                      "Substitution: ∫2x cos(x²)dx."
                    ],
                    "references": [
                      {
                        "title": "Calculus",
                        "author": "Michael Spivak"
                      },
                      {
                        "title": "Engineering Maths",
                        "author": "Grewal"
                      }
                    ]
                  },
                  {
                    "id": "mat-u2-t2",
                    "title": "Applications of Integration",
                    "content": "Integrals compute areas, volumes of revolution, arc length, and average value. Work W=∫F(x)dx models energy. Expectations in probability are integrals against densities.\n\nNumerical quadrature (trapezoidal, Simpson) applies when antiderivatives are hard—common in simulation. CSE labs implement these rules for benchmarking.",
                    "keyPoints": [
                      "Disk/washer volume methods",
                      "Average value on [a,b]",
                      "Arc length integral",
                      "Trapezoidal and Simpson rules",
                      "Work and probability views"
                    ],
                    "examples": [
                      {
                        "title": "Solid of revolution",
                        "explanation": "Volume = π∫f(x)² dx about x-axis."
                      },
                      {
                        "title": "Trapezoidal rule",
                        "explanation": "O(h²) error on uniform meshes."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Average value",
                        "formula": "f_avg = (1/(b−a))∫ₐᵇ f(x)dx",
                        "description": "Mean over interval"
                      }
                    ],
                    "examQuestions": [
                      "Volume rotating y=√x about x-axis.",
                      "Average of sin x on [0,π].",
                      "Compare trapezoidal vs Simpson on ∫₀¹ e^x.",
                      "Arc length of y=x² on [0,1].",
                      "Work integral example."
                    ],
                    "references": [
                      {
                        "title": "Numerical Methods",
                        "author": "Burden & Faires"
                      },
                      {
                        "title": "Stewart Calculus",
                        "author": "Stewart"
                      }
                    ]
                  },
                  {
                    "id": "mat-u2-t3",
                    "title": "Improper Integrals and Beta-Gamma Links",
                    "content": "Improper integrals extend ∫ to infinite limits or unbounded integrands via limits. Convergence tests (comparison, p-test analogs) decide finiteness.\n\nGamma function Γ(n)=∫₀^∞ x^{n−1}e^{−x}dx generalizes factorials; Beta integrals connect probability and statistics. These appear in continuous distributions (Gamma, Beta) used in ML and queuing.\n\nIPU questions may ask convergence proofs or evaluation of standard improper forms.",
                    "keyPoints": [
                      "Define improper integrals as limits",
                      "p-integral convergence on [1,∞)",
                      "Comparison test for integrals",
                      "Γ(n) for positive integers links to (n−1)!",
                      "Beta integrals in probability"
                    ],
                    "examples": [
                      {
                        "title": "∫₁^∞ 1/x²",
                        "explanation": "Convergent p-integral, p=2."
                      },
                      {
                        "title": "Exponential tail",
                        "explanation": "∫₀^∞ e^{−x}dx=1 normalizes exponential PDF."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Gamma",
                        "formula": "Γ(n)=(n−1)! for n∈ℕ",
                        "description": "Factorial extension"
                      }
                    ],
                    "examQuestions": [
                      "Does ∫₀¹ 1/√x dx converge?",
                      "Evaluate ∫₀^∞ e^{−2x}dx.",
                      "Compare ∫₁^∞ (ln x)/x dx.",
                      "State comparison test.",
                      "Relate Γ to factorial."
                    ],
                    "references": [
                      {
                        "title": "Bartle & Sherbert",
                        "author": "Introduction to Real Analysis"
                      },
                      {
                        "title": "Grewal",
                        "author": "B.S. Grewal"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Differential Equations",
                "topics": [
                  {
                    "id": "mat-u3-t1",
                    "title": "First Order Differential Equations",
                    "content": "A differential equation relates an unknown function and its derivatives. First-order equations F(x,y,y′)=0 model growth, decay, and cooling. Separable equations integrate after rearranging dy/dx=g(x)h(y).\n\nLinear first-order equations y′+P(x)y=Q(x) use integrating factors. Exact equations and Bernoulli forms extend the toolkit. Modeling RC circuits and population dynamics are standard IPU applications.",
                    "keyPoints": [
                      "Order = highest derivative present",
                      "Separable: dy/dx=f(x)g(y)",
                      "Linear: integrating factor e^{∫P}",
                      "Bernoulli substitution",
                      "Modeling with initial conditions"
                    ],
                    "examples": [
                      {
                        "title": "RC circuit",
                        "explanation": "Linear ODE for capacitor voltage."
                      },
                      {
                        "title": "Exponential growth",
                        "explanation": "dy/dt=ky ⇒ y=Ce^{kt}."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Separable",
                        "formula": "∫dy/h(y)=∫g(x)dx",
                        "description": "After separation"
                      }
                    ],
                    "examQuestions": [
                      "Solve y′=2xy with y(0)=1.",
                      "Find integrating factor for y′+y/x=1.",
                      "Solve Bernoulli y′+y=xy².",
                      "Model Newton cooling.",
                      "Verify solution by substitution."
                    ],
                    "references": [
                      {
                        "title": "Kreyszig",
                        "author": "Advanced Engineering Mathematics"
                      },
                      {
                        "title": "Grewal",
                        "author": "B.S. Grewal"
                      }
                    ]
                  },
                  {
                    "id": "mat-u3-t2",
                    "title": "Second Order Linear Equations",
                    "content": "Second-order linear ODEs ay″+by′+cy=0 with constant coefficients use characteristic equations ar²+br+c=0. Distinct real, repeated, and complex roots yield different solution bases.\n\nNonhomogeneous equations need particular solutions—undetermined coefficients or variation of parameters. Mechanical vibrations (spring-mass) and RLC circuits map directly to this theory.",
                    "keyPoints": [
                      "Characteristic equation from ar²+br+c=0",
                      "Real distinct roots: exponentials",
                      "Complex roots: sine/cosine pairs",
                      "Repeated roots need te^{rt} terms",
                      "Particular solution for forcing terms"
                    ],
                    "examples": [
                      {
                        "title": "Damped oscillator",
                        "explanation": "Roots determine under/over/critical damping."
                      },
                      {
                        "title": "Resonance",
                        "explanation": "Forcing frequency near natural frequency."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Homogeneous",
                        "formula": "ay″+by′+cy=0",
                        "description": "Constant coefficients"
                      }
                    ],
                    "examQuestions": [
                      "Solve y″−3y′+2y=0.",
                      "Solve y″+y=0 with initial data.",
                      "Particular solution for y″+y=sin x.",
                      "Classify damping types.",
                      "Physical meaning of roots."
                    ],
                    "references": [
                      {
                        "title": "Boyce & DiPrima",
                        "author": "Elementary Differential Equations"
                      },
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      }
                    ]
                  },
                  {
                    "id": "mat-u3-t3",
                    "title": "Applications and Systems of ODEs",
                    "content": "Systems x′=Ax model coupled phenomena; eigenvalues of A predict stability. Phase-plane sketches illustrate predator-prey and linear systems near equilibria.\n\nApplications include orthogonal trajectories, electric networks, and heat equation separation previews. Numerical methods (Euler, Runge-Kutta) solve when closed forms fail—used in simulation labs.",
                    "keyPoints": [
                      "Convert higher-order ODEs to systems",
                      "Eigenvalues determine stability",
                      "Phase portraits for 2×2 linear systems",
                      "Euler method as first numerical step",
                      "Modeling with coupled equations"
                    ],
                    "examples": [
                      {
                        "title": "Predator-prey",
                        "explanation": "Nonlinear coupled ODEs."
                      },
                      {
                        "title": "Euler step",
                        "explanation": "y_{n+1}=y_n+h f(x_n,y_n)."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "2×2 system",
                        "formula": "x′=Ax, solution via eigenvectors",
                        "description": "Diagonalizable A"
                      }
                    ],
                    "examQuestions": [
                      "Write spring equation as a system.",
                      "Stability from eigenvalues of [[0,1],[-k,−c]].",
                      "One Euler step for y′=y, y(0)=1, h=0.1.",
                      "Orthogonal trajectories idea.",
                      "When is numerical ODE needed?"
                    ],
                    "references": [
                      {
                        "title": "Strogatz",
                        "author": "Nonlinear Dynamics and Chaos"
                      },
                      {
                        "title": "Grewal",
                        "author": "B.S. Grewal"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 4,
                "title": "Vector Calculus",
                "topics": [
                  {
                    "id": "mat-u4-t1",
                    "title": "Vectors, Dot and Cross Product",
                    "content": "Vectors represent magnitude and direction in ℝ² and ℝ³. Dot product a·b=|a||b|cos θ measures projection and work; cross product a×b is perpendicular with magnitude |a||b|sin θ.\n\nVector identities simplify derivations in physics and graphics. Position vectors r(t) describe curves; tangent vectors r′(t) give velocity. These tools underpin 3D transforms in game engines and robotics.",
                    "keyPoints": [
                      "Component form and magnitude |v|",
                      "Dot product and orthogonality",
                      "Cross product area and torque",
                      "Scalar triple product volume",
                      "Vector functions r(t)"
                    ],
                    "examples": [
                      {
                        "title": "Work",
                        "explanation": "W=F·d for constant force."
                      },
                      {
                        "title": "Normal from cross",
                        "explanation": "Surface normals in 3D rendering."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Dot",
                        "formula": "a·b = a₁b₁+a₂b₂+a₃b₃",
                        "description": "ℝ³"
                      },
                      {
                        "name": "Cross magnitude",
                        "formula": "|a×b|=|a||b|sin θ",
                        "description": "Parallelogram area"
                      }
                    ],
                    "examQuestions": [
                      "Compute i×j and interpret.",
                      "Angle between vectors via dot.",
                      "Find area of triangle from vertices.",
                      "Prove a·(b×c) volume formula.",
                      "Tangent to r(t)=⟨t,t²,t³⟩."
                    ],
                    "references": [
                      {
                        "title": "Marsden & Tromba",
                        "author": "Vector Calculus"
                      },
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      }
                    ]
                  },
                  {
                    "id": "mat-u4-t2",
                    "title": "Gradient, Divergence, and Curl",
                    "content": "For scalar f(x,y,z), gradient ∇f points in direction of steepest increase. Divergence ∇·F measures source strength of vector field F; curl ∇×F measures rotation.\n\nIdentities connect ∇·(∇×F)=0 and ∇×(∇f)=0. Conservative fields have curl zero and path-independent line integrals. Fluid flow and electromagnetism motivate these operators; ML uses gradients for optimization.",
                    "keyPoints": [
                      "∇f for potential increase direction",
                      "∇·F: expansion/outflow",
                      "∇×F: circulation density",
                      "Conservative ⇔ curl F=0 (simply connected)",
                      "Directional derivative D_u f=u·∇f"
                    ],
                    "examples": [
                      {
                        "title": "Temperature field",
                        "explanation": "Heat flows opposite ∇T."
                      },
                      {
                        "title": "Gradient descent",
                        "explanation": "Move opposite ∇loss in ML."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Gradient",
                        "formula": "∇f = ⟨∂f/∂x, ∂f/∂y, ∂f/∂z⟩",
                        "description": "ℝ³"
                      }
                    ],
                    "examQuestions": [
                      "Find ∇ of x²+y²+z².",
                      "Compute ∇·⟨x,y,z⟩.",
                      "Compute ∇×⟨−y,x,0⟩.",
                      "Is ⟨2x,2y,0⟩ conservative?",
                      "Directional derivative of f at (1,1) along u."
                    ],
                    "references": [
                      {
                        "title": "Schey",
                        "author": "Div, Grad, Curl"
                      },
                      {
                        "title": "Marsden & Tromba",
                        "author": "Marsden"
                      }
                    ]
                  },
                  {
                    "id": "mat-u4-t3",
                    "title": "Line, Surface, and Volume Integrals",
                    "content": "Line integrals ∫_C F·dr accumulate work along curves. Green's theorem relates line integrals around closed curves to double integrals over regions in the plane.\n\nSurface integrals flux through Σ; Stokes and Divergence theorems generalize FTC to higher dimensions. These theorems appear in electromagnetism and fluid mechanics syllabi linked to engineering physics.",
                    "keyPoints": [
                      "Line integral parametrization",
                      "Green's theorem in 2D",
                      "Surface integrals of scalar and vector fields",
                      "Divergence theorem ∫∫∫ ∇·F dV = flux",
                      "Stokes connects curl and circulation"
                    ],
                    "examples": [
                      {
                        "title": "Work along path",
                        "explanation": "∫_C F·dr."
                      },
                      {
                        "title": "Flux through surface",
                        "explanation": "∬ F·n dS."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Green",
                        "formula": "∮_C (P dx+Q dy)=∬(∂Q/∂x−∂P/∂y)dA",
                        "description": "Simple closed C"
                      }
                    ],
                    "examQuestions": [
                      "Line integral of ⟨y,−x⟩ on unit circle.",
                      "Apply Green to verify area formula.",
                      "Flux of ⟨0,0,z⟩ through disk z=1.",
                      "State Divergence theorem.",
                      "When is path independent?"
                    ],
                    "references": [
                      {
                        "title": "Stewart",
                        "author": "Calculus (multivariable)"
                      },
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 5,
                "title": "Laplace Transforms",
                "topics": [
                  {
                    "id": "mat-u5-t1",
                    "title": "Definition and Basic Transforms",
                    "content": "Laplace transform ℒ{f(t)}=F(s)=∫₀^∞ e^{−st}f(t)dt converts ODEs into algebraic equations in s. Exists for piecewise continuous functions of exponential order.\n\nStandard pairs: ℒ{1}=1/s, ℒ{e^{at}}=1/(s−a), ℒ{sin at}=a/(s²+a²). Linearity and shifting theorems build a table for circuit and control problems without solving in time domain first.",
                    "keyPoints": [
                      "Definition with improper integral",
                      "Exponential order for existence",
                      "Table of standard transforms",
                      "Linearity ℒ{af+bg}",
                      "First shifting: ℒ{e^{at}f(t)}"
                    ],
                    "examples": [
                      {
                        "title": "Unit step",
                        "explanation": "Models switched inputs in circuits."
                      },
                      {
                        "title": "ODE → algebra",
                        "explanation": "Transform both sides of y″+y=0."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Exponential",
                        "formula": "ℒ{e^{at}}=1/(s−a)",
                        "description": "Re(s)>a"
                      }
                    ],
                    "examQuestions": [
                      "Find ℒ{1} and ℒ{t}.",
                      "Find ℒ{cos 2t}.",
                      "Use linearity on 3e^{−2t}−sin t.",
                      "State existence conditions.",
                      "Inverse transform of 1/(s+1)."
                    ],
                    "references": [
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      },
                      {
                        "title": "Grewal",
                        "author": "Grewal"
                      }
                    ]
                  },
                  {
                    "id": "mat-u5-t2",
                    "title": "Properties and Inverse Laplace Transform",
                    "content": "Derivatives transform to sF(s)−f(0): ℒ{f′}=sF(s)−f(0). Integration and convolution theorems support solving forced systems. Partial fractions decompose rational F(s) for inversion.\n\nSecond shifting handles delayed inputs. Convolution (f*g) corresponds to product in s-domain. These tools are standard for IPU Laplace transform numericals.",
                    "keyPoints": [
                      "Derivative theorem with ICs",
                      "Integration in s or t domain",
                      "Partial fractions for rational F(s)",
                      "Second shifting e^{−as}F(s)",
                      "Convolution theorem"
                    ],
                    "examples": [
                      {
                        "title": "RC step response",
                        "explanation": "Inverse Laplace gives voltage vs time."
                      },
                      {
                        "title": "Partial fractions",
                        "explanation": "Decompose (s+1)/((s+2)(s+3))."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Derivative",
                        "formula": "ℒ{f′(t)}=sF(s)−f(0)",
                        "description": "Initial value f(0)"
                      }
                    ],
                    "examQuestions": [
                      "Solve y′+2y=0, y(0)=1 via Laplace.",
                      "Find inverse of 1/(s(s+1)).",
                      "Apply second shifting theorem.",
                      "Solve y″+y=δ(t) sketch.",
                      "Convolution meaning."
                    ],
                    "references": [
                      {
                        "title": "Ogata",
                        "author": "Modern Control Engineering"
                      },
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      }
                    ]
                  },
                  {
                    "id": "mat-u5-t3",
                    "title": "Solving ODEs and Systems with Laplace",
                    "content": "Laplace method solves IVPs for linear ODEs with discontinuous forcing via unit step and impulse functions. Systems x′=Ax with Laplace transforms matrix algebra in s.\n\nTransfer functions H(s)=Y(s)/U(s) connect input-output in control. Poles of H(s) indicate stability—foundational for signals and systems electives. Z-transform is the discrete analog in digital signal processing.",
                    "keyPoints": [
                      "IVP: transform, solve for F(s), invert",
                      "Unit step and Dirac delta transforms",
                      "Transfer function from ODE",
                      "Poles and stability",
                      "Systems: matrix Laplace"
                    ],
                    "examples": [
                      {
                        "title": "Mass-spring",
                        "explanation": "Second-order IVP in one pass."
                      },
                      {
                        "title": "Pole location",
                        "explanation": "Re(s)<0 ⇒ decaying modes."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Transfer function",
                        "formula": "H(s)=Y(s)/U(s)",
                        "description": "Zero initial rest"
                      }
                    ],
                    "examQuestions": [
                      "Solve y″+4y=sin 2t with Laplace.",
                      "Find transfer function of y″+2y′+y=u.",
                      "Stability from pole signs.",
                      "Solve 2×2 system x′=Ax via Laplace.",
                      "Compare Laplace vs classical method."
                    ],
                    "references": [
                      {
                        "title": "Kreyszig",
                        "author": "Kreyszig"
                      },
                      {
                        "title": "Grewal",
                        "author": "Grewal"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BAS-103",
            "credits": 4,
            "type": "theory",
            "description": "Mechanics, waves, optics, and modern physics for engineers.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Applied Physics — Unit 1",
                "topics": [
                  {
                    "id": "applied-u1-t1",
                    "title": "Applied Physics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Applied Physics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Applied Physics for Unit 1.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "applied-u1-t2",
                    "title": "Applied Physics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Applied Physics — Unit 2",
                "topics": [
                  {
                    "id": "applied-u2-t1",
                    "title": "Applied Physics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Applied Physics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Applied Physics for Unit 2.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "applied-u2-t2",
                    "title": "Applied Physics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Applied Physics — Unit 3",
                "topics": [
                  {
                    "id": "applied-u3-t1",
                    "title": "Applied Physics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Applied Physics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Applied Physics for Unit 3.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "applied-u3-t2",
                    "title": "Applied Physics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "BEE-101",
            "credits": 4,
            "type": "theory",
            "description": "DC circuits, network theorems, and electrical measurements.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Basic Electrical Engineering — Unit 1",
                "topics": [
                  {
                    "id": "basic-u1-t1",
                    "title": "Basic Electrical Engineering: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Basic Electrical Engineering aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Basic Electrical Engineering for Unit 1.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "basic-u1-t2",
                    "title": "Basic Electrical Engineering: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Basic Electrical Engineering — Unit 2",
                "topics": [
                  {
                    "id": "basic-u2-t1",
                    "title": "Basic Electrical Engineering: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Basic Electrical Engineering aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Basic Electrical Engineering for Unit 2.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "basic-u2-t2",
                    "title": "Basic Electrical Engineering: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Basic Electrical Engineering — Unit 3",
                "topics": [
                  {
                    "id": "basic-u3-t1",
                    "title": "Basic Electrical Engineering: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Basic Electrical Engineering aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Basic Electrical Engineering for Unit 3.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "basic-u3-t2",
                    "title": "Basic Electrical Engineering: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "BAS-107",
            "credits": 3,
            "type": "theory",
            "description": "Orthographic projection, sections, and CAD fundamentals.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Engineering Graphics — Unit 1",
                "topics": [
                  {
                    "id": "engineering-u1-t1",
                    "title": "Engineering Graphics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Engineering Graphics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Engineering Graphics for Unit 1.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "engineering-u1-t2",
                    "title": "Engineering Graphics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Engineering Graphics — Unit 2",
                "topics": [
                  {
                    "id": "engineering-u2-t1",
                    "title": "Engineering Graphics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Engineering Graphics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Engineering Graphics for Unit 2.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "engineering-u2-t2",
                    "title": "Engineering Graphics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Engineering Graphics — Unit 3",
                "topics": [
                  {
                    "id": "engineering-u3-t1",
                    "title": "Engineering Graphics: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Engineering Graphics aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Engineering Graphics for Unit 3.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "engineering-u3-t2",
                    "title": "Engineering Graphics: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "BCS-101",
            "credits": 4,
            "type": "theory",
            "description": "Structured programming, pointers, and problem solving in C.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Programming in C — Unit 1",
                "topics": [
                  {
                    "id": "programming-u1-t1",
                    "title": "Programming in C: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Programming in C aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Programming in C for Unit 1.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "programming-u1-t2",
                    "title": "Programming in C: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Programming in C — Unit 2",
                "topics": [
                  {
                    "id": "programming-u2-t1",
                    "title": "Programming in C: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Programming in C aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Programming in C for Unit 2.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "programming-u2-t2",
                    "title": "Programming in C: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Programming in C — Unit 3",
                "topics": [
                  {
                    "id": "programming-u3-t1",
                    "title": "Programming in C: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Programming in C aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Programming in C for Unit 3.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "programming-u3-t2",
                    "title": "Programming in C: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "BHU-101",
            "credits": 2,
            "type": "theory",
            "description": "Technical communication, presentations, and professional writing.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Communication Skills — Unit 1",
                "topics": [
                  {
                    "id": "communication-u1-t1",
                    "title": "Communication Skills: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Communication Skills aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Communication Skills for Unit 1.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "communication-u1-t2",
                    "title": "Communication Skills: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Communication Skills — Unit 2",
                "topics": [
                  {
                    "id": "communication-u2-t1",
                    "title": "Communication Skills: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Communication Skills aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Communication Skills for Unit 2.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "communication-u2-t2",
                    "title": "Communication Skills: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Communication Skills — Unit 3",
                "topics": [
                  {
                    "id": "communication-u3-t1",
                    "title": "Communication Skills: Core Concepts (Part A)",
                    "content": "This unit develops foundational ideas in Communication Skills aligned with the IPU BTech CSE first-year syllabus. Students learn definitions, standard terminology, and problem-solving workflows used in end-semester examinations and GATE-style assessments.\n\nConceptual clarity is emphasized before numerical drills. Diagrams, tables, and worked examples mirror typical question patterns set by Guru Gobind Singh Indraprastha University affiliated colleges. Laboratory and tutorial hours reinforce lecture topics through guided practice.\n\nConnections to computer science—such as how physical laws inform hardware limits or how measurement discipline supports reliable benchmarking—are highlighted for CSE learners.",
                    "keyPoints": [
                      "Master standard units and notation for the unit theme",
                      "Apply definitions to numerical and conceptual questions",
                      "Interpret diagrams used in IPU question papers",
                      "Relate theory to lab/tutorial outcomes",
                      "Build revision notes mapped to unit outcomes"
                    ],
                    "examples": [
                      {
                        "title": "Worked example",
                        "explanation": "Stepwise solution showing given data, formula, and conclusion."
                      },
                      {
                        "title": "Concept map",
                        "explanation": "Links prerequisites to advanced semester topics."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define key terms in Communication Skills for Unit 3.",
                      "Solve a standard numerical from previous-year pattern.",
                      "Explain assumptions in the model used.",
                      "List common student errors and how to avoid them.",
                      "Outline a 10-minute viva answer for this topic."
                    ],
                    "references": [
                      {
                        "title": "IPU Syllabus Handbook",
                        "author": "GGSIPU"
                      },
                      {
                        "title": "Standard Textbook",
                        "author": "Faculty Board"
                      }
                    ]
                  },
                  {
                    "id": "communication-u3-t2",
                    "title": "Communication Skills: Applications (Part B)",
                    "content": "Applications extend Part A theory to engineering judgment. Students analyze cases where ideal models deviate from real systems and learn when to apply corrections or safety factors.\n\nProblem sets include multi-step questions combining two ideas from the unit—typical of IPU internal assessments. Collaborative tutorials encourage peer explanation, which strengthens communication skills alongside technical accuracy.\n\nFor CSE students, application topics note how the physical or professional skill supports later courses such as embedded systems, VLSI, or industry internships.",
                    "keyPoints": [
                      "Combine two concepts in multi-step problems",
                      "Justify approximations with engineering reasoning",
                      "Present solutions with neat units and significant figures",
                      "Use graphs or sketches where they clarify reasoning",
                      "Prepare short oral summaries for lab/viva"
                    ],
                    "examples": [
                      {
                        "title": "Case study",
                        "explanation": "Realistic scenario requiring unit formulas and interpretation."
                      },
                      {
                        "title": "Design trade-off",
                        "explanation": "Compare options using quantitative criteria."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Solve an application-level numerical problem.",
                      "Interpret a graph or circuit diagram provided.",
                      "Discuss limitations of the ideal model.",
                      "Write a brief lab report style conclusion.",
                      "Map the topic to a future semester subject."
                    ],
                    "references": [
                      {
                        "title": "Engineering Applications",
                        "author": "IPU Notes"
                      },
                      {
                        "title": "Practice Problems",
                        "author": "Dept. Compilation"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BAS-201",
            "credits": 4,
            "type": "theory",
            "description": "ODEs, PDE intro, Laplace transforms, and complex analysis. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-chemistry",
            "name": "Applied Chemistry",
            "subjectCode": "BAS-203",
            "credits": 4,
            "type": "theory",
            "description": "Atomic structure, bonding, and engineering materials chemistry. // TODO: add units",
            "units": []
          },
          {
            "id": "electronic-devices-circuits",
            "name": "Electronic Devices & Circuits",
            "subjectCode": "BEC-201",
            "credits": 4,
            "type": "theory",
            "description": "Semiconductor devices, diodes, transistors, and amplifiers. // TODO: add units",
            "units": []
          },
          {
            "id": "workshop-practice",
            "name": "Workshop Practice",
            "subjectCode": "BCS-251",
            "credits": 2,
            "type": "lab",
            "description": "Fitting, welding, carpentry, and machining practice. // TODO: add units",
            "units": []
          },
          {
            "id": "oop-cpp",
            "name": "Object Oriented Programming with C++",
            "subjectCode": "BCS-201",
            "credits": 4,
            "type": "theory",
            "description": "Classes, inheritance, polymorphism, and STL in C++. // TODO: add units",
            "units": []
          },
          {
            "id": "environmental-studies",
            "name": "Environmental Studies",
            "subjectCode": "BAS-205",
            "credits": 2,
            "type": "theory",
            "description": "Ecology, pollution control, and sustainability. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 3,
        "subjects": [
          {
            "id": "data-structures",
            "name": "Data Structures",
            "subjectCode": "BCS-301",
            "credits": 4,
            "type": "theory",
            "description": "Arrays, linked lists, stacks, queues, trees, and graphs. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-electronics",
            "name": "Digital Electronics",
            "subjectCode": "BCS-303",
            "credits": 4,
            "type": "theory",
            "description": "Boolean algebra, combinational and sequential circuits. // TODO: add units",
            "units": []
          },
          {
            "id": "oop-java",
            "name": "Object Oriented Programming with Java",
            "subjectCode": "BCS-305",
            "credits": 4,
            "type": "theory",
            "description": "Java OOP, collections, exceptions, and GUIs. // TODO: add units",
            "units": []
          },
          {
            "id": "discrete-mathematics",
            "name": "Discrete Mathematics",
            "subjectCode": "BAS-301",
            "credits": 4,
            "type": "theory",
            "description": "Logic, sets, combinatorics, graphs, and proofs. // TODO: add units",
            "units": []
          },
          {
            "id": "computer-organisation",
            "name": "Computer Organisation",
            "subjectCode": "BCS-307",
            "credits": 4,
            "type": "theory",
            "description": "CPU design, ISA, memory hierarchy, and I/O. // TODO: add units",
            "units": []
          },
          {
            "id": "data-structures-lab",
            "name": "Data Structures Lab",
            "subjectCode": "BCS-351",
            "credits": 2,
            "type": "lab",
            "description": "Implementation of core data structures in C/C++. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 4,
        "subjects": [
          {
            "id": "analysis-of-algorithms",
            "name": "Analysis of Algorithms",
            "subjectCode": "BCS-401",
            "credits": 4,
            "type": "theory",
            "description": "Complexity, divide-and-conquer, DP, and greedy methods. // TODO: add units",
            "units": []
          },
          {
            "id": "dbms",
            "name": "Database Management Systems",
            "subjectCode": "BCS-403",
            "credits": 4,
            "type": "theory",
            "description": "ER model, SQL, normalization, and transactions. // TODO: add units",
            "units": []
          },
          {
            "id": "operating-systems",
            "name": "Operating Systems",
            "subjectCode": "BCS-405",
            "credits": 4,
            "type": "theory",
            "description": "Processes, scheduling, memory, and file systems. // TODO: add units",
            "units": []
          },
          {
            "id": "computer-networks",
            "name": "Computer Networks",
            "subjectCode": "BCS-407",
            "credits": 4,
            "type": "theory",
            "description": "OSI/TCP-IP, routing, transport, and application protocols. // TODO: add units",
            "units": []
          },
          {
            "id": "software-engineering",
            "name": "Software Engineering",
            "subjectCode": "BCS-409",
            "credits": 3,
            "type": "theory",
            "description": "SDLC, requirements, design, and testing. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 5,
        "subjects": [
          {
            "id": "compiler-design",
            "name": "Compiler Design",
            "subjectCode": "BCS-501",
            "credits": 4,
            "type": "theory",
            "description": "Lexical analysis, parsing, code generation, and optimization. // TODO: add units",
            "units": []
          },
          {
            "id": "web-technologies",
            "name": "Web Technologies",
            "subjectCode": "BCS-503",
            "credits": 3,
            "type": "theory",
            "description": "HTML, CSS, JavaScript, and server-side basics. // TODO: add units",
            "units": []
          },
          {
            "id": "artificial-intelligence",
            "name": "Artificial Intelligence",
            "subjectCode": "BCS-505",
            "credits": 4,
            "type": "theory",
            "description": "Search, knowledge representation, and reasoning. // TODO: add units",
            "units": []
          },
          {
            "id": "theory-of-computation",
            "name": "Theory of Computation",
            "subjectCode": "BCS-507",
            "credits": 3,
            "type": "theory",
            "description": "Automata, formal languages, and Turing machines. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 6,
        "subjects": [
          {
            "id": "machine-learning",
            "name": "Machine Learning",
            "subjectCode": "BCS-601",
            "credits": 4,
            "type": "theory",
            "description": "Supervised and unsupervised learning fundamentals. // TODO: add units",
            "units": []
          },
          {
            "id": "cloud-computing",
            "name": "Cloud Computing",
            "subjectCode": "BCS-603",
            "credits": 3,
            "type": "theory",
            "description": "Virtualization, IaaS/PaaS/SaaS, and deployment. // TODO: add units",
            "units": []
          },
          {
            "id": "information-security",
            "name": "Information Security",
            "subjectCode": "BCS-605",
            "credits": 4,
            "type": "theory",
            "description": "Cryptography, network security, and secure systems. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 7,
        "subjects": [
          {
            "id": "major-project-1",
            "name": "Major Project I",
            "subjectCode": "BCS-701",
            "credits": 6,
            "type": "theory",
            "description": "Project proposal, design, and partial implementation. // TODO: add units",
            "units": []
          },
          {
            "id": "elective-1",
            "name": "Department Elective I",
            "subjectCode": "BCS-E71",
            "credits": 3,
            "type": "theory",
            "description": "Specialized elective (e.g. IoT, Blockchain, NLP). // TODO: add units",
            "units": []
          },
          {
            "id": "elective-2",
            "name": "Department Elective II",
            "subjectCode": "BCS-E72",
            "credits": 3,
            "type": "theory",
            "description": "Specialized elective per college offering. // TODO: add units",
            "units": []
          },
          {
            "id": "elective-3",
            "name": "Department Elective III",
            "subjectCode": "BCS-E73",
            "credits": 3,
            "type": "theory",
            "description": "Specialized elective per college offering. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 8,
        "subjects": [
          {
            "id": "major-project-2",
            "name": "Major Project II",
            "subjectCode": "BCS-801",
            "credits": 8,
            "type": "theory",
            "description": "Complete project, report, and viva. // TODO: add units",
            "units": []
          },
          {
            "id": "elective-4",
            "name": "Department Elective IV",
            "subjectCode": "BCS-E81",
            "credits": 3,
            "type": "theory",
            "description": "Advanced elective topic. // TODO: add units",
            "units": []
          },
          {
            "id": "elective-5",
            "name": "Department Elective V",
            "subjectCode": "BCS-E82",
            "credits": 3,
            "type": "theory",
            "description": "Advanced elective topic. // TODO: add units",
            "units": []
          },
          {
            "id": "elective-6",
            "name": "Department Elective VI",
            "subjectCode": "BCS-E83",
            "credits": 3,
            "type": "theory",
            "description": "Advanced elective topic. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "it",
    "name": "Information Technology",
    "shortName": "IT",
    "icon": "Monitor",
    "color": "text-cyan-600",
    "description": "IPU BTech IT — applications, networks, and enterprise information systems.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Engineering calculus and algebra. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Physics for IT infrastructure and hardware context. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EC-101",
            "credits": 4,
            "type": "theory",
            "description": "Electrical fundamentals for labs and hardware courses. // TODO: add units",
            "units": []
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "ME-103",
            "credits": 3,
            "type": "theory",
            "description": "Technical drawing and CAD basics. // TODO: add units",
            "units": []
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "BIT-101",
            "credits": 4,
            "type": "theory",
            "description": "Introductory programming and problem solving. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Professional communication. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "Advanced engineering mathematics. // TODO: add units",
            "units": []
          },
          {
            "id": "data-structures",
            "name": "Data Structures",
            "subjectCode": "BIT-201",
            "credits": 4,
            "type": "theory",
            "description": "Core data structures for application development. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-electronics",
            "name": "Digital Electronics",
            "subjectCode": "EC-201",
            "credits": 4,
            "type": "theory",
            "description": "Digital logic for systems understanding. // TODO: add units",
            "units": []
          },
          {
            "id": "oop",
            "name": "Object Oriented Programming",
            "subjectCode": "BIT-202",
            "credits": 4,
            "type": "theory",
            "description": "OOP with C++/Java. // TODO: add units",
            "units": []
          },
          {
            "id": "database-systems",
            "name": "Database Management Systems",
            "subjectCode": "BIT-203",
            "credits": 4,
            "type": "theory",
            "description": "Relational databases and SQL. // TODO: add units",
            "units": []
          },
          {
            "id": "computer-networks-intro",
            "name": "Computer Networks",
            "subjectCode": "BIT-204",
            "credits": 3,
            "type": "theory",
            "description": "Networking fundamentals. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "ai-ds",
    "name": "Artificial Intelligence & Data Science",
    "shortName": "AI&DS",
    "icon": "Brain",
    "color": "text-purple-600",
    "description": "IPU BTech AI&DS — machine learning, statistics, and intelligent systems.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Calculus and linear algebra for ML. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Physics with computing applications. // TODO: add units",
            "units": []
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "BAI-101",
            "credits": 4,
            "type": "theory",
            "description": "C programming foundation. // TODO: add units",
            "units": []
          },
          {
            "id": "python-for-ai",
            "name": "Python for AI",
            "subjectCode": "BAI-102",
            "credits": 4,
            "type": "theory",
            "description": "Python, NumPy intro, and scripting. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EC-101",
            "credits": 4,
            "type": "theory",
            "description": "Electrical engineering basics. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Technical communication. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "ODEs and transforms. // TODO: add units",
            "units": []
          },
          {
            "id": "statistics",
            "name": "Probability & Statistics",
            "subjectCode": "BAI-201",
            "credits": 4,
            "type": "theory",
            "description": "Probability, distributions, and inference. // TODO: add units",
            "units": []
          },
          {
            "id": "data-structures",
            "name": "Data Structures",
            "subjectCode": "BAI-202",
            "credits": 4,
            "type": "theory",
            "description": "Structures for data-centric algorithms. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-logic",
            "name": "Digital Logic Design",
            "subjectCode": "EC-201",
            "credits": 4,
            "type": "theory",
            "description": "Logic design for hardware interfaces. // TODO: add units",
            "units": []
          },
          {
            "id": "ml-intro",
            "name": "Introduction to Machine Learning",
            "subjectCode": "BAI-203",
            "credits": 3,
            "type": "theory",
            "description": "Supervised learning overview. // TODO: add units",
            "units": []
          },
          {
            "id": "database-systems",
            "name": "Database Systems",
            "subjectCode": "BAI-204",
            "credits": 3,
            "type": "theory",
            "description": "SQL and data warehousing basics. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "ece",
    "name": "Electronics & Communication Engineering",
    "shortName": "ECE",
    "icon": "Radio",
    "color": "text-orange-600",
    "description": "IPU BTech ECE — analog/digital electronics, signals, and communication systems.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Engineering mathematics I. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Physics for electronics. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EC-101",
            "credits": 4,
            "type": "theory",
            "description": "Circuits and measurements. // TODO: add units",
            "units": []
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "ME-103",
            "credits": 3,
            "type": "theory",
            "description": "Technical drawing. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electronics",
            "name": "Basic Electronics",
            "subjectCode": "ECE-101",
            "credits": 4,
            "type": "theory",
            "description": "Semiconductor devices and circuits. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Professional skills. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "Mathematics II. // TODO: add units",
            "units": []
          },
          {
            "id": "electronic-devices",
            "name": "Electronic Devices",
            "subjectCode": "ECE-201",
            "credits": 4,
            "type": "theory",
            "description": "Diodes, transistors, and amplifiers. // TODO: add units",
            "units": []
          },
          {
            "id": "network-analysis",
            "name": "Network Analysis & Synthesis",
            "subjectCode": "ECE-202",
            "credits": 4,
            "type": "theory",
            "description": "Two-port networks and theorems. // TODO: add units",
            "units": []
          },
          {
            "id": "signals-systems",
            "name": "Signals & Systems",
            "subjectCode": "ECE-203",
            "credits": 4,
            "type": "theory",
            "description": "CT/DT signals and LTI systems. // TODO: add units",
            "units": []
          },
          {
            "id": "electromagnetic-theory",
            "name": "Electromagnetic Theory",
            "subjectCode": "ECE-204",
            "credits": 4,
            "type": "theory",
            "description": "Maxwell equations and wave propagation. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-electronics",
            "name": "Digital Electronics",
            "subjectCode": "ECE-205",
            "credits": 4,
            "type": "theory",
            "description": "Logic families and sequential circuits. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "eee",
    "name": "Electrical & Electronics Engineering",
    "shortName": "EEE",
    "icon": "Zap",
    "color": "text-amber-600",
    "description": "IPU BTech EEE — power systems, machines, and electrical drives.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Engineering mathematics I. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Physics foundation. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EE-101",
            "credits": 4,
            "type": "theory",
            "description": "Introductory electrical engineering. // TODO: add units",
            "units": []
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "ME-103",
            "credits": 3,
            "type": "theory",
            "description": "Engineering drawing. // TODO: add units",
            "units": []
          },
          {
            "id": "electromechanical",
            "name": "Electromechanical Engineering",
            "subjectCode": "EE-102",
            "credits": 4,
            "type": "theory",
            "description": "Machines and energy conversion intro. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Communication. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "Mathematics II. // TODO: add units",
            "units": []
          },
          {
            "id": "circuit-theory",
            "name": "Circuit Theory",
            "subjectCode": "EE-201",
            "credits": 4,
            "type": "theory",
            "description": "AC/DC circuit analysis. // TODO: add units",
            "units": []
          },
          {
            "id": "electrical-machines-1",
            "name": "Electrical Machines-I",
            "subjectCode": "EE-202",
            "credits": 4,
            "type": "theory",
            "description": "Transformers and DC machines. // TODO: add units",
            "units": []
          },
          {
            "id": "electronic-devices",
            "name": "Electronic Devices",
            "subjectCode": "EE-203",
            "credits": 4,
            "type": "theory",
            "description": "Power electronics devices. // TODO: add units",
            "units": []
          },
          {
            "id": "measurements",
            "name": "Electrical & Electronic Measurements",
            "subjectCode": "EE-204",
            "credits": 3,
            "type": "theory",
            "description": "Instrumentation and error analysis. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-electronics",
            "name": "Digital Electronics",
            "subjectCode": "EC-201",
            "credits": 3,
            "type": "theory",
            "description": "Digital systems for control. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "mechanical",
    "name": "Mechanical Engineering",
    "shortName": "ME",
    "icon": "Cog",
    "color": "text-slate-600",
    "description": "IPU BTech Mechanical — thermodynamics, manufacturing, and machine design.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Engineering mathematics. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Applied physics. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EC-101",
            "credits": 4,
            "type": "theory",
            "description": "Electrical basics. // TODO: add units",
            "units": []
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "ME-103",
            "credits": 4,
            "type": "theory",
            "description": "Orthographic and isometric projection. // TODO: add units",
            "units": []
          },
          {
            "id": "workshop-practice",
            "name": "Workshop Practice",
            "subjectCode": "ME-101",
            "credits": 2,
            "type": "lab",
            "description": "Fitting, welding, and machining intro. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Communication skills. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "Mathematics II. // TODO: add units",
            "units": []
          },
          {
            "id": "strength-of-materials",
            "name": "Strength of Materials",
            "subjectCode": "ME-201",
            "credits": 4,
            "type": "theory",
            "description": "Stress, strain, and failure theories. // TODO: add units",
            "units": []
          },
          {
            "id": "thermodynamics",
            "name": "Thermodynamics",
            "subjectCode": "ME-202",
            "credits": 4,
            "type": "theory",
            "description": "Laws of thermodynamics and cycles. // TODO: add units",
            "units": []
          },
          {
            "id": "manufacturing-processes",
            "name": "Manufacturing Processes",
            "subjectCode": "ME-203",
            "credits": 4,
            "type": "theory",
            "description": "Casting, forming, and machining. // TODO: add units",
            "units": []
          },
          {
            "id": "fluid-mechanics",
            "name": "Fluid Mechanics",
            "subjectCode": "ME-204",
            "credits": 4,
            "type": "theory",
            "description": "Fluid statics and dynamics. // TODO: add units",
            "units": []
          },
          {
            "id": "material-science",
            "name": "Engineering Materials",
            "subjectCode": "ME-205",
            "credits": 3,
            "type": "theory",
            "description": "Metals, polymers, and composites. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "civil",
    "name": "Civil Engineering",
    "shortName": "CE",
    "icon": "Building2",
    "color": "text-emerald-600",
    "description": "IPU BTech Civil — structures, surveying, geotechnical, and construction.",
    "totalSemesters": 8,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BS-101",
            "credits": 4,
            "type": "theory",
            "description": "Engineering mathematics. // TODO: add units",
            "units": []
          },
          {
            "id": "applied-physics",
            "name": "Applied Physics",
            "subjectCode": "BS-102",
            "credits": 4,
            "type": "theory",
            "description": "Physics for civil applications. // TODO: add units",
            "units": []
          },
          {
            "id": "basic-electrical-engineering",
            "name": "Basic Electrical Engineering",
            "subjectCode": "EC-101",
            "credits": 4,
            "type": "theory",
            "description": "Electrical fundamentals. // TODO: add units",
            "units": []
          },
          {
            "id": "engineering-graphics",
            "name": "Engineering Graphics",
            "subjectCode": "ME-103",
            "credits": 3,
            "type": "theory",
            "description": "Civil drawing standards. // TODO: add units",
            "units": []
          },
          {
            "id": "building-materials",
            "name": "Building Materials",
            "subjectCode": "CE-101",
            "credits": 3,
            "type": "theory",
            "description": "Cement, concrete, timber, and steel. // TODO: add units",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "HS-101",
            "credits": 2,
            "type": "theory",
            "description": "Professional communication. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "mathematics-2",
            "name": "Mathematics-II",
            "subjectCode": "BS-201",
            "credits": 4,
            "type": "theory",
            "description": "Mathematics II. // TODO: add units",
            "units": []
          },
          {
            "id": "structural-analysis-1",
            "name": "Structural Analysis-I",
            "subjectCode": "CE-201",
            "credits": 4,
            "type": "theory",
            "description": "Determinate structures. // TODO: add units",
            "units": []
          },
          {
            "id": "surveying",
            "name": "Surveying",
            "subjectCode": "CE-202",
            "credits": 4,
            "type": "theory",
            "description": "Linear and angular measurements. // TODO: add units",
            "units": []
          },
          {
            "id": "fluid-mechanics",
            "name": "Fluid Mechanics",
            "subjectCode": "CE-203",
            "credits": 4,
            "type": "theory",
            "description": "Fluid flow for hydraulic engineering. // TODO: add units",
            "units": []
          },
          {
            "id": "building-construction",
            "name": "Building Construction",
            "subjectCode": "CE-204",
            "credits": 3,
            "type": "theory",
            "description": "Construction techniques and planning. // TODO: add units",
            "units": []
          },
          {
            "id": "geotechnical-intro",
            "name": "Geotechnical Engineering",
            "subjectCode": "CE-205",
            "credits": 3,
            "type": "theory",
            "description": "Soil properties and bearing capacity. // TODO: add units",
            "units": []
          }
        ]
      }
    ]
  },
  {
    "id": "mca",
    "name": "Master of Computer Applications",
    "shortName": "MCA",
    "icon": "GraduationCap",
    "color": "text-indigo-600",
    "description": "IPU MCA — postgraduate software development, systems, and applications (4 semesters).",
    "totalSemesters": 4,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematical-foundation",
            "name": "Mathematical Foundation",
            "subjectCode": "MCA-101",
            "credits": 4,
            "type": "theory",
            "description": "Discrete math and mathematical logic for CS. // TODO: add units",
            "units": []
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "MCA-102",
            "credits": 4,
            "type": "theory",
            "description": "Advanced C programming and data representation. // TODO: add units",
            "units": []
          },
          {
            "id": "computer-organization",
            "name": "Computer Organization & Architecture",
            "subjectCode": "MCA-103",
            "credits": 4,
            "type": "theory",
            "description": "Hardware-software interface. // TODO: add units",
            "units": []
          },
          {
            "id": "accounting",
            "name": "Financial Accounting & Management",
            "subjectCode": "MCA-104",
            "credits": 3,
            "type": "theory",
            "description": "Accounting for IT managers. // TODO: add units",
            "units": []
          },
          {
            "id": "communication",
            "name": "Communication Skills",
            "subjectCode": "MCA-105",
            "credits": 2,
            "type": "theory",
            "description": "Business and technical communication. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "data-structures",
            "name": "Data Structures",
            "subjectCode": "MCA-201",
            "credits": 4,
            "type": "theory",
            "description": "Advanced data structures and algorithms. // TODO: add units",
            "units": []
          },
          {
            "id": "operating-systems",
            "name": "Operating Systems",
            "subjectCode": "MCA-202",
            "credits": 4,
            "type": "theory",
            "description": "OS design and administration. // TODO: add units",
            "units": []
          },
          {
            "id": "dbms",
            "name": "Database Management Systems",
            "subjectCode": "MCA-203",
            "credits": 4,
            "type": "theory",
            "description": "Database design and SQL. // TODO: add units",
            "units": []
          },
          {
            "id": "oop",
            "name": "Object Oriented Programming with Java",
            "subjectCode": "MCA-204",
            "credits": 4,
            "type": "theory",
            "description": "Java and OOP design patterns intro. // TODO: add units",
            "units": []
          },
          {
            "id": "software-engineering",
            "name": "Software Engineering",
            "subjectCode": "MCA-205",
            "credits": 3,
            "type": "theory",
            "description": "Processes, metrics, and quality. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 3,
        "subjects": []
      },
      {
        "semNumber": 4,
        "subjects": []
      }
    ]
  },
  {
    "id": "bca",
    "name": "Bachelor of Computer Applications",
    "shortName": "BCA",
    "icon": "Laptop",
    "color": "text-teal-600",
    "description": "IPU BCA — applied computing and software development (6 semesters).",
    "totalSemesters": 6,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "mathematics-1",
            "name": "Mathematics-I",
            "subjectCode": "BCA-101",
            "credits": 4,
            "type": "theory",
            "description": "Foundation mathematics. // TODO: add units",
            "units": []
          },
          {
            "id": "computer-fundamentals",
            "name": "Computer Fundamentals",
            "subjectCode": "BCA-102",
            "credits": 4,
            "type": "theory",
            "description": "Hardware, software, and number systems. // TODO: add units",
            "units": []
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "BCA-103",
            "credits": 4,
            "type": "theory",
            "description": "C programming and logic building. // TODO: add units",
            "units": []
          },
          {
            "id": "english-communication",
            "name": "English Communication",
            "subjectCode": "BCA-104",
            "credits": 3,
            "type": "theory",
            "description": "Written and oral communication. // TODO: add units",
            "units": []
          },
          {
            "id": "office-automation",
            "name": "Office Automation Tools",
            "subjectCode": "BCA-105",
            "credits": 2,
            "type": "lab",
            "description": "MS Office and productivity tools. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "data-structures",
            "name": "Data Structures",
            "subjectCode": "BCA-201",
            "credits": 4,
            "type": "theory",
            "description": "Core structures in C/C++. // TODO: add units",
            "units": []
          },
          {
            "id": "oop",
            "name": "Object Oriented Programming",
            "subjectCode": "BCA-202",
            "credits": 4,
            "type": "theory",
            "description": "OOP concepts and C++. // TODO: add units",
            "units": []
          },
          {
            "id": "dbms",
            "name": "Database Management System",
            "subjectCode": "BCA-203",
            "credits": 4,
            "type": "theory",
            "description": "Relational model and SQL. // TODO: add units",
            "units": []
          },
          {
            "id": "digital-electronics",
            "name": "Digital Electronics",
            "subjectCode": "BCA-204",
            "credits": 3,
            "type": "theory",
            "description": "Digital logic for programmers. // TODO: add units",
            "units": []
          },
          {
            "id": "system-analysis",
            "name": "System Analysis & Design",
            "subjectCode": "BCA-205",
            "credits": 3,
            "type": "theory",
            "description": "SDLC and modeling. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 3,
        "subjects": []
      },
      {
        "semNumber": 4,
        "subjects": []
      },
      {
        "semNumber": 5,
        "subjects": []
      },
      {
        "semNumber": 6,
        "subjects": []
      }
    ]
  },
  {
    "id": "mba",
    "name": "Master of Business Administration",
    "shortName": "MBA",
    "icon": "Briefcase",
    "color": "text-rose-600",
    "description": "IPU MBA — management, finance, marketing, and operations (4 semesters).",
    "totalSemesters": 4,
    "semesters": [
      {
        "semNumber": 1,
        "subjects": [
          {
            "id": "management-principles",
            "name": "Principles of Management",
            "subjectCode": "MBA-101",
            "credits": 4,
            "type": "theory",
            "description": "Planning, organizing, leading, and controlling. // TODO: add units",
            "units": []
          },
          {
            "id": "financial-accounting",
            "name": "Financial Accounting",
            "subjectCode": "MBA-102",
            "credits": 4,
            "type": "theory",
            "description": "Financial statements and analysis. // TODO: add units",
            "units": []
          },
          {
            "id": "marketing-management",
            "name": "Marketing Management",
            "subjectCode": "MBA-103",
            "credits": 4,
            "type": "theory",
            "description": "Marketing mix and consumer behavior. // TODO: add units",
            "units": []
          },
          {
            "id": "business-economics",
            "name": "Managerial Economics",
            "subjectCode": "MBA-104",
            "credits": 4,
            "type": "theory",
            "description": "Demand, cost, and market structures. // TODO: add units",
            "units": []
          },
          {
            "id": "business-communication",
            "name": "Business Communication",
            "subjectCode": "MBA-105",
            "credits": 2,
            "type": "theory",
            "description": "Reports, presentations, and etiquette. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 2,
        "subjects": [
          {
            "id": "hr-management",
            "name": "Human Resource Management",
            "subjectCode": "MBA-201",
            "credits": 4,
            "type": "theory",
            "description": "Recruitment, training, and performance. // TODO: add units",
            "units": []
          },
          {
            "id": "operations-management",
            "name": "Operations Management",
            "subjectCode": "MBA-202",
            "credits": 4,
            "type": "theory",
            "description": "Process design and supply chain basics. // TODO: add units",
            "units": []
          },
          {
            "id": "business-research",
            "name": "Business Research Methods",
            "subjectCode": "MBA-203",
            "credits": 4,
            "type": "theory",
            "description": "Research design and statistics for managers. // TODO: add units",
            "units": []
          },
          {
            "id": "corporate-finance",
            "name": "Corporate Finance",
            "subjectCode": "MBA-204",
            "credits": 4,
            "type": "theory",
            "description": "Capital budgeting and cost of capital. // TODO: add units",
            "units": []
          },
          {
            "id": "organizational-behavior",
            "name": "Organizational Behavior",
            "subjectCode": "MBA-205",
            "credits": 3,
            "type": "theory",
            "description": "Motivation, teams, and leadership. // TODO: add units",
            "units": []
          }
        ]
      },
      {
        "semNumber": 3,
        "subjects": []
      },
      {
        "semNumber": 4,
        "subjects": []
      }
    ]
  }
]

export const getBranch = (id) => ipuBranches.find((b) => b.id === id)

export default ipuBranches
