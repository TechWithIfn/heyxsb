/** Auto-synced ipuData.js — units copied from src/ipu/data/cse/sem1.json */

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
            "units": []
          },
          {
            "id": "programming-in-c",
            "name": "Programming in C",
            "subjectCode": "BCS-101",
            "credits": 4,
            "type": "theory",
            "description": "Structured programming, pointers, and problem solving in C.",
            "units": []
          },
          {
            "id": "communication-skills",
            "name": "Communication Skills",
            "subjectCode": "BHU-101",
            "credits": 2,
            "type": "theory",
            "description": "Technical communication, presentations, and professional writing.",
            "units": []
          },
          {
            "id": "applied-chemistry",
            "name": "Applied Chemistry",
            "subjectCode": "BSC-102",
            "credits": 3,
            "type": "theory",
            "description": "Basic chemistry concepts relevant to engineering applications.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Fuels and Combustion",
                "topics": [
                  {
                    "id": "applied-chemistry-u1-t1",
                    "title": "Fuels: Classification and Characteristics of Fuels",
                    "content": "Fuels are classified as solid, liquid, and gaseous. This classification is based on physical state and influences storage, handling, and combustion control.\n\nImportant characteristics include calorific value, ignition temperature, moisture content, ash content, sulfur content, volatility, and combustion efficiency.\n\nA good fuel should have high calorific value, moderate ignition temperature, low moisture and ash, low sulfur, easy availability, and safe handling properties.\n\n| Fuel Type | Example | Main Advantage | Main Limitation |\n|---|---|---|---|\n| Solid | Coal | Cheap and widely available | Ash handling and smoke |\n| Liquid | Diesel | High energy density, easy pumping | Storage/fire risk |\n| Gas | NG/LPG | Clean and controllable combustion | Pressurized storage needed |"
                  },
                  {
                    "id": "applied-chemistry-u1-t2",
                    "title": "Calorific Values of Fuels",
                    "content": "Calorific value indicates fuel quality and is used in boiler design, engine performance analysis, and fuel-cost comparison.\n\nHCV is always greater than LCV because HCV assumes water formed during combustion is condensed and latent heat is recovered.\n\nFor engineering applications involving exhaust gases at high temperature, LCV is commonly used because water stays in vapor state."
                  },
                  {
                    "id": "applied-chemistry-u1-t3",
                    "title": "Comparison Between Solid, Liquid and Gaseous Fuels",
                    "content": "Solid fuels are easy to store and cheap but produce ash and particulate emissions.\n\nLiquid fuels have better energy density and can be pumped/atomized; combustion control is easier than solids.\n\nGaseous fuels provide clean and almost complete combustion with excellent control, but storage/transport infrastructure is expensive.\n\n| Parameter | Solid | Liquid | Gaseous |\n|---|---|---|---|\n| Combustion control | Poor | Better | Best |\n| Cleanliness | Low | Medium | High |\n| Handling | Bulk/Manual | Pumpable | Piping/compressed storage |"
                  },
                  {
                    "id": "applied-chemistry-u1-t4",
                    "title": "Bomb Calorimeter",
                    "content": "A weighed fuel sample is burned in a sealed steel bomb filled with oxygen. Heat released raises water temperature around the bomb.\n\nFrom temperature rise and calorimeter constant, heat of combustion is obtained. Fuse wire and acid corrections are applied for accuracy.\n\nBomb calorimeter gives highly reliable HCV values and is a standard laboratory method."
                  },
                  {
                    "id": "applied-chemistry-u1-t5",
                    "title": "Boy’s Calorimeter",
                    "content": "Fuel burns at a burner and transfers heat to a known water flow. Temperature rise of water is measured.\n\nIt is comparatively simpler than bomb calorimeter but less accurate due to heat losses.\n\nUsed for gaseous fuels and demonstration-level practical understanding of calorimetry."
                  },
                  {
                    "id": "applied-chemistry-u1-t6",
                    "title": "Dulong Formula",
                    "content": "This empirical formula provides quick theoretical calorific value without direct calorimeter experiment.\n\nThe term (H − O/8) accounts for hydrogen unavailable for combustion because some hydrogen is already bound with oxygen in fuel."
                  },
                  {
                    "id": "applied-chemistry-u1-t7",
                    "title": "Numericals on Calorific Value",
                    "content": "Numericals on Calorific Value is studied in B.Tech 1st semester to build understanding of fuel selection, combustion behavior, and engineering efficiency.\n\nIn exam answers, explain principle, process/equipment, formula (if applicable), and practical relevance.\n\nWrite a structured answer with heading-wise flow and include neat labelled representation wherever needed."
                  },
                  {
                    "id": "applied-chemistry-u1-t8",
                    "title": "Coal",
                    "content": "Coal rank determines moisture, volatile matter, fixed carbon, and calorific value.\n\nHigh-rank coals have more carbon and higher CV; low-rank coals have more moisture and lower CV.\n\nCoal is used in thermal power, metallurgy, cement kilns and industrial heating."
                  },
                  {
                    "id": "applied-chemistry-u1-t9",
                    "title": "Proximate Analysis of Coal",
                    "content": "This quick test predicts combustion behavior and suitability of coal for boiler/coke use.\n\nHigh moisture lowers useful heating value; high ash reduces efficiency and increases slagging."
                  },
                  {
                    "id": "applied-chemistry-u1-t10",
                    "title": "Ultimate Analysis of Coal",
                    "content": "Ultimate analysis is used for stoichiometric combustion calculations, emission estimation, and Dulong formula.\n\nSulfur and nitrogen content are especially important for environmental regulation and flue gas treatment."
                  },
                  {
                    "id": "applied-chemistry-u1-t11",
                    "title": "Numericals on Coal Analysis",
                    "content": "Numericals on Coal Analysis is studied in B.Tech 1st semester to build understanding of fuel selection, combustion behavior, and engineering efficiency.\n\nIn exam answers, explain principle, process/equipment, formula (if applicable), and practical relevance.\n\nWrite a structured answer with heading-wise flow and include neat labelled representation wherever needed."
                  },
                  {
                    "id": "applied-chemistry-u1-t12",
                    "title": "Carbonisation of Coal",
                    "content": "Low-temperature carbonisation gives softer coke with higher volatile matter.\n\nHigh-temperature carbonisation produces strong metallurgical coke used in blast furnaces."
                  },
                  {
                    "id": "applied-chemistry-u1-t13",
                    "title": "Otto-Hoffmann Oven",
                    "content": "It consists of narrow silica chambers alternately heated with producer gas and air in regenerators.\n\nThe process recovers by-products like tar, ammonia, benzol and gas before gas reuse."
                  },
                  {
                    "id": "applied-chemistry-u1-t14",
                    "title": "Recovery of By-products",
                    "content": "Main recoveries include tar, ammonia (as ammonium sulfate), naphthalene, benzol and coke oven gas.\n\nBy-product recovery improves economy and reduces emissions from carbonisation plants."
                  },
                  {
                    "id": "applied-chemistry-u1-t15",
                    "title": "Metallurgical Coke",
                    "content": "Metallurgical Coke is studied in B.Tech 1st semester to build understanding of fuel selection, combustion behavior, and engineering efficiency.\n\nIn exam answers, explain principle, process/equipment, formula (if applicable), and practical relevance.\n\nWrite a structured answer with heading-wise flow and include neat labelled representation wherever needed."
                  },
                  {
                    "id": "applied-chemistry-u1-t16",
                    "title": "Petroleum Products",
                    "content": "Major fractions: LPG, petrol, naphtha, kerosene, diesel, lubricating oil, paraffin wax, bitumen.\n\nEach fraction has distinct boiling range and application in transport, heating, lubrication and roads."
                  },
                  {
                    "id": "applied-chemistry-u1-t17",
                    "title": "Refining of Petroleum",
                    "content": "Primary refining uses fractional distillation in atmospheric and vacuum columns.\n\nSecondary processes include cracking, reforming, desulfurization, and blending to meet fuel specs."
                  },
                  {
                    "id": "applied-chemistry-u1-t18",
                    "title": "Thermal Cracking",
                    "content": "It improves gasoline yield from heavy petroleum fractions.\n\nReaction occurs via free-radical mechanism and can produce unsaturated products and some coke."
                  },
                  {
                    "id": "applied-chemistry-u1-t19",
                    "title": "Catalytic Cracking",
                    "content": "Compared to thermal cracking, catalytic cracking gives better octane number and higher selectivity.\n\nFluid catalytic cracking (FCC) is a common industrial process with catalyst regeneration loop."
                  },
                  {
                    "id": "applied-chemistry-u1-t20",
                    "title": "Knocking Characteristics",
                    "content": "In SI engines, autoignition of end gas causes knock; in CI engines, delayed ignition and sudden combustion cause diesel knock.\n\nKnock reduces efficiency and can damage engine components."
                  },
                  {
                    "id": "applied-chemistry-u1-t21",
                    "title": "Octane Rating",
                    "content": "Higher octane number means better resistance to knocking.\n\nReference scale: iso-octane (100) and n-heptane (0)."
                  },
                  {
                    "id": "applied-chemistry-u1-t22",
                    "title": "Cetane Rating",
                    "content": "Higher cetane number means shorter ignition delay and smoother operation.\n\nGood diesel should ignite quickly after injection."
                  },
                  {
                    "id": "applied-chemistry-u1-t23",
                    "title": "Natural Gas (NG)",
                    "content": "It has high H/C ratio and cleaner combustion compared to coal and heavy oils.\n\nUsed in domestic cooking, power generation, fertilizer and city gas distribution."
                  },
                  {
                    "id": "applied-chemistry-u1-t24",
                    "title": "CNG",
                    "content": "CNG reduces CO, HC and particulate emissions compared to petrol/diesel.\n\nRequires high-pressure cylinders and fueling infrastructure."
                  },
                  {
                    "id": "applied-chemistry-u1-t25",
                    "title": "LPG",
                    "content": "LPG has high calorific value and clean flame, widely used in domestic and industrial heating.\n\nOdorant is added for leak detection and safety."
                  },
                  {
                    "id": "applied-chemistry-u1-t26",
                    "title": "Coal Gas",
                    "content": "Contains hydrogen, methane, carbon monoxide and small impurities.\n\nHistorically used for lighting/heating; now limited due to cleaner alternatives."
                  },
                  {
                    "id": "applied-chemistry-u1-t27",
                    "title": "Oil Gas",
                    "content": "Used for laboratory/industrial heating in specific setups.\n\nComposition varies with feedstock and cracking conditions."
                  },
                  {
                    "id": "applied-chemistry-u1-t28",
                    "title": "Producer Gas",
                    "content": "Main components are CO, N2, and some H2; calorific value is low due to high nitrogen dilution.\n\nUsed in furnaces and kilns where low-cost gaseous fuel is acceptable."
                  },
                  {
                    "id": "applied-chemistry-u1-t29",
                    "title": "Water Gas",
                    "content": "Water gas is also called blue water gas and can be used as fuel or synthesis gas.\n\nProcess is cyclic due to endothermic reaction and reheating requirement."
                  },
                  {
                    "id": "applied-chemistry-u1-t30",
                    "title": "Combustion of Fuels",
                    "content": "Complete combustion gives CO2 and H2O; incomplete combustion forms CO and soot.\n\nAir-fuel ratio control is essential for efficiency, safety and emission control."
                  },
                  {
                    "id": "applied-chemistry-u1-t31",
                    "title": "Numericals on Combustion of Fuels",
                    "content": "Numericals on Combustion of Fuels is studied in B.Tech 1st semester to build understanding of fuel selection, combustion behavior, and engineering efficiency.\n\nIn exam answers, explain principle, process/equipment, formula (if applicable), and practical relevance.\n\nWrite a structured answer with heading-wise flow and include neat labelled representation wherever needed."
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Thermodynamics and Chemical Kinetics",
                "topics": [
                  {
                    "id": "applied-chemistry-u2-t1",
                    "title": "Phase rule: Terms used in Gibb’s Phase rule, phase diagram",
                    "content": "Gibbs' Phase Rule provides the relationship between the number of degrees of freedom (F), number of components (C) and the number of phases (P) present in a system at equilibrium. The general form is F = C - P + 2 for systems where pressure and temperature may vary; for condensed systems (fixed pressure) the formula is often written as F = C - P + 1.\n\nKey terms: component (independent chemical species required to define the system), phase (physically distinct and mechanically separable part of the system), degree of freedom (number of independent intensive variables like T, P, composition that can be changed without changing the number of phases).\n\nPhase diagrams graphically represent regions of stability for different phases as functions of variables such as temperature, pressure or composition. Lines represent equilibria between two phases and points where three phases coexist are called triple points."
                  },
                  {
                    "id": "applied-chemistry-u2-t2",
                    "title": "One-Component systems: Water and Sulphur",
                    "content": "One-component phase behaviour shows how a pure substance occupies different phases depending on temperature and pressure. Water and sulphur are typical examples used in engineering chemistry.\n\nWater: discuss solid–liquid–vapour equilibria, triple point (0.01°C, 0.00611 atm), and critical point (374°C, 22.06 MPa). Note anomalous density behaviour of water near 4°C which affects the slope of the melting curve.\n\nSulphur: describe allotropy (S8 rings, polymeric chains on heating), melting and sublimation behaviour, and the relevance of allotropes to physical properties and processing."
                  },
                  {
                    "id": "applied-chemistry-u2-t3",
                    "title": "Two-component systems: Lead-Silver and Zinc-Magnesium",
                    "content": "Binary (two-component) phase diagrams show how composition and temperature determine phase stability. Important features include liquidus, solidus, solvus lines, eutectic and peritectic points, and regions of solid solution or two-phase mixtures.\n\nLead–Silver (Pb–Ag): illustrate limited solid solubility at room temperature and a simple eutectic behaviour that influences solder and casting microstructures.\n\nZinc–Magnesium (Zn–Mg): discuss phase separation, intermetallic formation and how small additions of Mg influence the melting and mechanical behaviour of Zn alloys."
                  },
                  {
                    "id": "applied-chemistry-u2-t4",
                    "title": "Polymers: Classification, functionality and their types",
                    "content": "Polymers are large molecules made up of repeating monomer units. Classify by source (natural vs synthetic), polymerisation mechanism (addition vs condensation), and structure (linear, branched, cross-linked).\n\nFunctionality refers to the number of reactive sites on a monomer; it controls network formation (e.g., difunctional monomers give linear chains; tri- or higher-functional monomers lead to branching and cross-linking).\n\nIntroduce thermoplastics (reversible chain entanglement) vs thermosets (irreversible cross-linked networks)."
                  },
                  {
                    "id": "applied-chemistry-u2-t5",
                    "title": "Plastics: Synthesis (reactions) and properties of Polyethylene (LDPE, HDPE, LLDPE, UHMWPE)",
                    "content": "Polyethylene (PE) is an addition polymer formed by polymerisation of ethene. Different polymerisation methods yield LDPE, HDPE, LLDPE and UHMWPE with distinct branching and molecular weight characteristics affecting density, crystallinity and mechanical properties.\n\nLDPE: produced via high-pressure free-radical polymerisation — highly branched, lower density, good flexibility.\n\nHDPE: produced using coordination catalysts (Ziegler–Natta or metallocene) — linear chains, high crystallinity and tensile strength.\n\nLLDPE: copolymerisation with alpha-olefins to introduce short-chain branching — combines toughness and processability.\n\nUHMWPE: extremely high molecular weight giving exceptional wear and impact resistance used in bearings and medical implants."
                  },
                  {
                    "id": "applied-chemistry-u2-t6",
                    "title": "Vinyl Plastics (Condensation polymers) - Nylons, Phenol-formaldehyde resins (Bakelite) and Glyptal",
                    "content": "Vinyl plastics often refers broadly to polymers derived from vinyl monomers or to condensation-type resins used in engineering applications. Discuss nylons (polyamides) formed by condensation between diamines and diacids, phenol–formaldehyde resins (Bakelite) as early thermosetting plastics, and glyptal-type alkyd/resin systems used in coatings.\n\nHighlight condensation polymer characteristics: step-growth mechanism, release of small molecules (water), and tendency to form cross-linked thermosets depending on monomer functionality."
                  },
                  {
                    "id": "applied-chemistry-u2-t7",
                    "title": "Speciality Polymers: Engineering thermoplastics, Conducting polymers, Electroluminescent polymers, liquid crystalline polymers and biodegradable polymers",
                    "content": "Survey of speciality polymers emphasising function and application. Engineering thermoplastics (e.g., polycarbonate, PEEK) provide high temperature and mechanical performance; conducting polymers (polyaniline, PEDOT) introduce electrical conductivity for sensors and devices; electroluminescent polymers are used in display technologies; liquid crystalline polymers exhibit anisotropic mechanical behaviour; biodegradable polymers (PLA, PHA) break down under biological/composting conditions.\n\nDiscuss selection criteria for applications: thermal stability, conductivity, mechanical anisotropy, environmental degradation."
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Solutions, Acids-Bases and Electrochemistry",
                "topics": [
                  {
                    "id": "applied-chemistry-u3-t1",
                    "title": "Solutions and Colligative Properties",
                    "subtopics": [
                      "Concentration units",
                      "Boiling point elevation",
                      "Freezing point depression"
                    ],
                    "content": "Properties of solutions and their relevance to engineering formulations."
                  },
                  {
                    "id": "applied-chemistry-u3-t2",
                    "title": "Acids, Bases and pH",
                    "subtopics": [
                      "pH scale",
                      "Buffer solutions",
                      "Titration concepts"
                    ],
                    "content": "Acid-base concepts and pH control in industrial and laboratory settings."
                  },
                  {
                    "id": "applied-chemistry-u3-t4",
                    "title": "Water: Introduction and Water Quality Standards",
                    "content": "Introduction to water as an engineering material: occurrence, sources (surface and groundwater), and significance for industry and public health.\n\nWater quality standards: WHO/ISI/IS/ local regulatory parameters and permissible limits for drinking and industrial use.\n\nPhysical, chemical and biological characteristics of water: colour, taste, turbidity, temperature, pH, conductivity, dissolved solids, hardness, dissolved oxygen, BOD, COD, microbial indicators."
                  },
                  {
                    "id": "applied-chemistry-u3-t5",
                    "title": "Hardness of Water: Types, Disadvantages and EDTA Determination",
                    "content": "Definition of hardness and differentiation between temporary (carbonate) and permanent (non-carbonate) hardness.\n\nDisadvantages of hardness in domestic and industrial contexts: scale formation, reduced soap efficiency, increased energy consumption, boiler problems.\n\nDetermination of hardness using complexometric titration with EDTA: principle, masking/unmasking (e.g., Mg with NaOH), indicators (Eriochrome Black T), procedure and calculations."
                  },
                  {
                    "id": "applied-chemistry-u3-t6",
                    "title": "Alkalinity of Water and Its Determination",
                    "content": "Definition of alkalinity (capacity to neutralize acid) and types: carbonate, bicarbonate and hydroxide alkalinity.\n\nTitrimetric determination using strong acid (HCl) with indicators or potentiometric end-point; calculation of alkalinity as mg/L CaCO3."
                  },
                  {
                    "id": "applied-chemistry-u3-t7",
                    "title": "Boiler Problems from Hard Water and Their Prevention",
                    "content": "Major boiler problems: scale and sludge formation due to precipitation of hardness salts; boiler corrosion (general and oxygen pitting); caustic embrittlement (due to concentrated NaOH in crevices); priming and foaming (carry-over of water with steam).\n\nPrevention strategies: softening feed water, deaeration, chemical treatment (phosphate, carbonate conditioning), blowdown control, maintaining alkalinity and silica control."
                  },
                  {
                    "id": "applied-chemistry-u3-t8",
                    "title": "Boiler Water Treatment — Internal (In-situ) Methods",
                    "content": "Internal treatment methods treat water inside the boiler to control scale and corrosion without external softening. Methods include carbonate conditioning (phosphate treatment), colloidal conditioning (polyelectrolytes), and Calgon (sodium hexametaphosphate)/organic sequestrants to keep hardness in suspension or complexed.\n\nOperational notes: correct dosing, sludge removal (blowdown), and monitoring of phosphate-to-alkalinity ratio."
                  },
                  {
                    "id": "applied-chemistry-u3-t9",
                    "title": "External Treatment: Lime–Soda Process (with Numericals)",
                    "content": "Principle of lime–soda ash softening: removal of temporary and permanent hardness by precipitation of Ca(OH)2 and Na2CO3 reactions with Ca2+/Mg2+.\n\nProcess steps: preparation of reagents, rapid mixing, flocculation, sedimentation and filtration. Control parameters: reagent dose calculation, sludge handling."
                  },
                  {
                    "id": "applied-chemistry-u3-t10",
                    "title": "External Treatment: Zeolite (Ion-Exchange) Process (with Numericals)",
                    "content": "Zeolite softening uses sodium zeolites to exchange Na+ for Ca2+/Mg2+ in water. Regeneration with NaCl restores sodium form. Describe column operation, breakthrough curves and regeneration cycles.\n\nDiscuss ion-exchange capacity, exhaustion, and regeneration chemistry."
                  },
                  {
                    "id": "applied-chemistry-u3-t11",
                    "title": "External Treatment: Ion-Exchange Resins and Deionisation",
                    "content": "Ion-exchange resins (cation and anion) are used for demineralisation/deionisation of water. Explain strong acid/strong base resins, mixed-bed deionisers and regeneration chemistry. Discuss application for high-purity water (boiler feed, electronics)."
                  },
                  {
                    "id": "applied-chemistry-u3-t12",
                    "title": "Municipal Water Supply: Treatment and Disinfection (Break-point Chlorination)",
                    "content": "Steps in municipal water treatment: screening, sedimentation, coagulation/flocculation, filtration (rapid sand), and disinfection.\n\nDisinfection by chlorination: chemistry of free chlorine species, combined chlorine (chloramines), and break-point chlorination principle—dose required to oxidise ammonia and achieve residual free chlorine."
                  },
                  {
                    "id": "applied-chemistry-u3-t13",
                    "title": "Desalination and Advanced Water Treatment: RO, Electrodialysis, Defluoridation",
                    "content": "Desalination overview: thermal vs membrane processes. Reverse osmosis (RO) principle—osmotic pressure, cross-flow membranes, salt rejection and recovery considerations.\n\nElectrodialysis: ion migration through selective membranes under applied electric field for brackish water desalination.\n\nDefluoridation methods: adsorption (activated alumina), Nalgonda process, bone char, and modern membrane/ion-exchange approaches. Discuss applicability and regeneration/disposal issues."
                  }
                ]
              },
              {
                "unitNumber": 4,
                "title": "Materials Chemistry and Water Technology",
                "topics": [
                  {
                    "id": "applied-chemistry-u4-t1",
                    "title": "Corrosion and Its Control",
                    "content": "Introduction to corrosion phenomena and general strategies for control in engineering systems."
                  },
                  {
                    "id": "applied-chemistry-u4-t2",
                    "title": "Dry and Wet Corrosion Mechanisms",
                    "content": "Mechanisms distinguishing dry (high-temperature) and wet (electrochemical) corrosion with examples."
                  },
                  {
                    "id": "applied-chemistry-u4-t3",
                    "title": "Pilling–Bedworth Ratio",
                    "content": "Definition and significance of the Pilling–Bedworth ratio for protective oxide scale formation."
                  },
                  {
                    "id": "applied-chemistry-u4-t4",
                    "title": "Galvanic Corrosion",
                    "content": "Principles of galvanic coupling, galvanic series, and measures to prevent galvanic corrosion."
                  },
                  {
                    "id": "applied-chemistry-u4-t5",
                    "title": "Soil Corrosion",
                    "content": "Corrosion of buried structures: soil resistivity, moisture, oxygen, and mitigation techniques."
                  },
                  {
                    "id": "applied-chemistry-u4-t6",
                    "title": "Pitting Corrosion",
                    "content": "Localized breakdown of passive films leading to pitting; causes, detection, and prevention."
                  },
                  {
                    "id": "applied-chemistry-u4-t7",
                    "title": "Differential Aeration Corrosion",
                    "content": "How oxygen concentration cells produce localized corrosion and typical engineering examples."
                  },
                  {
                    "id": "applied-chemistry-u4-t8",
                    "title": "Stress Corrosion",
                    "content": "Stress corrosion cracking (SCC): combined effects of tensile stress and corrosive environments."
                  },
                  {
                    "id": "applied-chemistry-u4-t9",
                    "title": "Rusting of Iron",
                    "content": "Electrochemical mechanism of rusting and factors that accelerate iron oxidation."
                  },
                  {
                    "id": "applied-chemistry-u4-t10",
                    "title": "Passivity",
                    "content": "Concept of passivation, protective oxide films and how passivity differs from active corrosion."
                  },
                  {
                    "id": "applied-chemistry-u4-t11",
                    "title": "Factors Affecting Corrosion",
                    "content": "Overview of environmental, material, and design factors that influence corrosion rates."
                  },
                  {
                    "id": "applied-chemistry-u4-t12",
                    "title": "Corrosion Protection Methods",
                    "content": "General approaches: coatings, inhibitors, cathodic/anodic protection and design-based prevention."
                  },
                  {
                    "id": "applied-chemistry-u4-t13",
                    "title": "Galvanization",
                    "content": "Hot-dip galvanizing process, protective mechanism of zinc coatings and typical applications."
                  },
                  {
                    "id": "applied-chemistry-u4-t14",
                    "title": "Tinning",
                    "content": "Tinning processes for corrosion resistance and solderability of metal surfaces."
                  },
                  {
                    "id": "applied-chemistry-u4-t15",
                    "title": "Cathodic Protection",
                    "content": "Principles of cathodic protection and impressed current systems for pipelines and tanks."
                  },
                  {
                    "id": "applied-chemistry-u4-t16",
                    "title": "Sacrificial Anodic Protection",
                    "content": "Sacrificial anode systems (zinc/ magnesium) and application guidelines."
                  },
                  {
                    "id": "applied-chemistry-u4-t17",
                    "title": "Electroplating",
                    "content": "Electroplating fundamentals: electrolyte, anode/cathode, deposition mechanisms and common industries."
                  },
                  {
                    "id": "applied-chemistry-u4-t18",
                    "title": "Material Selection and Design for Corrosion Prevention",
                    "content": "How materials selection and engineering design minimize corrosion risk in systems and structures."
                  },
                  {
                    "id": "applied-chemistry-u4-t19",
                    "title": "Green Technology and Green Chemistry",
                    "content": "Introduction to sustainable chemical practices and technologies that reduce environmental impact."
                  },
                  {
                    "id": "applied-chemistry-u4-t20",
                    "title": "Twelve Principles of Green Chemistry",
                    "content": "Overview of the 12 principles and how they guide safer, more efficient chemical processes."
                  },
                  {
                    "id": "applied-chemistry-u4-t21",
                    "title": "Zero Waste Technology",
                    "content": "Concepts and industrial strategies aimed at eliminating waste and promoting circular economy."
                  },
                  {
                    "id": "applied-chemistry-u4-t22",
                    "title": "Atom Economy",
                    "content": "Atom economy metric and its importance in assessing efficiency of synthetic routes."
                  },
                  {
                    "id": "applied-chemistry-u4-t23",
                    "title": "Alternative Feedstocks",
                    "content": "Using renewable or less hazardous feedstocks in chemical manufacturing."
                  },
                  {
                    "id": "applied-chemistry-u4-t24",
                    "title": "Innocuous Reagents",
                    "content": "Replacing hazardous reagents with safer alternatives in synthesis and processing."
                  },
                  {
                    "id": "applied-chemistry-u4-t25",
                    "title": "Alternative Solvents",
                    "content": "Green solvent selection and solvent-free methodologies to reduce environmental impact."
                  },
                  {
                    "id": "applied-chemistry-u4-t26",
                    "title": "Alternative Reaction Methodologies",
                    "content": "Techniques such as biocatalysis, flow chemistry and microwave-assisted synthesis for greener processes."
                  },
                  {
                    "id": "applied-chemistry-u4-t27",
                    "title": "Energy Consumption Minimization",
                    "content": "Strategies to reduce energy use in chemical manufacturing including process intensification."
                  },
                  {
                    "id": "applied-chemistry-u4-t28",
                    "title": "Nanochemistry",
                    "content": "Introduction to chemistry at the nanoscale and unique phenomena compared to bulk materials."
                  },
                  {
                    "id": "applied-chemistry-u4-t29",
                    "title": "Nanomaterials and Their Properties",
                    "content": "Overview of common nanomaterials, size-dependent properties and surface effects."
                  },
                  {
                    "id": "applied-chemistry-u4-t30",
                    "title": "Synthesis of Nanomaterials",
                    "content": "Top-down and bottom-up synthesis methods: sol–gel, chemical vapor deposition, hydrothermal and green routes."
                  },
                  {
                    "id": "applied-chemistry-u4-t31",
                    "title": "Surface Characterization Techniques",
                    "content": "Common surface and morphological characterization methods for materials science."
                  },
                  {
                    "id": "applied-chemistry-u4-t32",
                    "title": "BET Analysis",
                    "content": "Brunauer–Emmett–Teller surface area analysis: principle, adsorption isotherms and interpretation."
                  },
                  {
                    "id": "applied-chemistry-u4-t33",
                    "title": "TEM Analysis",
                    "content": "Transmission electron microscopy basics: imaging, diffraction and resolution for nanoscale materials."
                  },
                  {
                    "id": "applied-chemistry-u4-t34",
                    "title": "Applications of Nanomaterials",
                    "content": "Key applications in catalysis, sensors, energy storage, medicine and environmental remediation."
                  }
                ]
              }
            ]
          },
          {
            "id": "environmental-science",
            "name": "Environmental Science",
            "subjectCode": "BSC-101",
            "credits": 2,
            "type": "theory",
            "description": "Fundamentals of environment, ecology, pollution, and conservation.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Foundations of Environmental Science",
                "topics": [
                  {
                    "id": "env-u1-t1",
                    "title": "Introduction to Environmental Studies",
                    "content": "Overview of environmental studies, definitions and historical perspective."
                  },
                  {
                    "id": "env-u1-t2",
                    "title": "Multidisciplinary Nature of Environmental Studies",
                    "content": "How environmental studies integrates biology, chemistry, geology, economics and social sciences."
                  },
                  {
                    "id": "env-u1-t3",
                    "title": "Components, Scope and Importance of Environmental Studies",
                    "content": "Components (air, water, soil, biota), scope and why the subject matters for society and engineering."
                  },
                  {
                    "id": "env-u1-t4",
                    "title": "Need for Public Awareness",
                    "content": "Role of public awareness and education in environmental protection and sustainable development."
                  },
                  {
                    "id": "env-u1-t5",
                    "title": "Natural Resources",
                    "content": "Classification of natural resources (renewable/non-renewable) and sustainable use principles."
                  },
                  {
                    "id": "env-u1-t6",
                    "title": "Ecosystems",
                    "content": "Definition and basic concepts of ecosystems and ecological interactions."
                  },
                  {
                    "id": "env-u1-t7",
                    "title": "Structure and Function of Ecosystems",
                    "content": "Trophic levels, food chains/webs, energy flow and ecosystem productivity."
                  },
                  {
                    "id": "env-u1-t8",
                    "title": "Types of Ecosystems",
                    "content": "Terrestrial and aquatic ecosystem types and characteristic features."
                  },
                  {
                    "id": "env-u1-t9",
                    "title": "Functional Components of Ecosystems",
                    "content": "Biotic and abiotic components, producers, consumers, decomposers and nutrient cycling."
                  },
                  {
                    "id": "env-u1-t10",
                    "title": "Major Ecosystems",
                    "content": "Overview of forests, grasslands, deserts, wetlands, marine and freshwater ecosystems."
                  },
                  {
                    "id": "env-u1-t11",
                    "title": "Biogeochemical Cycles",
                    "content": "Carbon, nitrogen, phosphorus and water cycles—processes and human impacts."
                  },
                  {
                    "id": "env-u1-t12",
                    "title": "Biodiversity",
                    "content": "Introduction to biodiversity, levels of biodiversity and its significance."
                  },
                  {
                    "id": "env-u1-t13",
                    "title": "Introduction to Biodiversity",
                    "content": "Defining biodiversity, species richness, genetic and ecosystem diversity."
                  },
                  {
                    "id": "env-u1-t14",
                    "title": "Biogeographical Classification",
                    "content": "Major biogeographic realms and factors influencing species distribution."
                  },
                  {
                    "id": "env-u1-t15",
                    "title": "India as a Mega Diversity Nation",
                    "content": "Reasons why India is biodiversity-rich and examples of diverse habitats."
                  },
                  {
                    "id": "env-u1-t16",
                    "title": "Endangered Species of India",
                    "content": "Examples and causes of endangered species in India; role of legislation and protected areas."
                  },
                  {
                    "id": "env-u1-t17",
                    "title": "Endemic Species of India",
                    "content": "Species restricted to India and importance of endemism for conservation."
                  },
                  {
                    "id": "env-u1-t18",
                    "title": "Threats to Biodiversity",
                    "content": "Habitat loss, pollution, invasive species, overexploitation and climate change impacts."
                  },
                  {
                    "id": "env-u1-t19",
                    "title": "Biodiversity Conservation",
                    "content": "In-situ and ex-situ conservation strategies and community-based approaches."
                  },
                  {
                    "id": "env-u1-t20",
                    "title": "Bioprospecting",
                    "content": "Exploration of biodiversity for commercially valuable genetic and biochemical resources."
                  },
                  {
                    "id": "env-u1-t21",
                    "title": "Biopiracy",
                    "content": "Issues where traditional knowledge and genetic resources are used without fair compensation; ethical and legal considerations."
                  }
                ]
              },
              {
                "unitNumber": 2,
                "title": "Environmental Pollution and Management",
                "topics": [
                  {
                    "id": "env-u2-t1",
                    "title": "Air Pollution: Source, Types, Effects on Biosphere and Meteorology, Air Quality, Control",
                    "content": "Sources of air pollution, classification of pollutants, meteorological factors affecting dispersion, air quality metrics and common control technologies."
                  },
                  {
                    "id": "env-u2-t2",
                    "title": "Water Pollution: Types and Sources",
                    "content": "Point and non-point sources of water pollution, types of pollutants and their environmental effects."
                  },
                  {
                    "id": "env-u2-t3",
                    "title": "Soil Pollution: Types and Control",
                    "content": "Causes of soil contamination, classification of pollutants, remediation and control measures."
                  },
                  {
                    "id": "env-u2-t4",
                    "title": "Noise Pollution: Effects and Control",
                    "content": "Sources of noise, health and ecological effects, measurement and abatement strategies."
                  },
                  {
                    "id": "env-u2-t5",
                    "title": "Thermal Pollution",
                    "content": "Causes of thermal pollution (power plants, industry), effects on aquatic life and mitigation approaches."
                  },
                  {
                    "id": "env-u2-t6",
                    "title": "Radiation Pollution",
                    "content": "Types of radiation pollution, sources, biological effects and safety standards."
                  },
                  {
                    "id": "env-u2-t7",
                    "title": "Solid Waste Management",
                    "content": "Collection, segregation, treatment and disposal methods including recycling and sanitary landfills."
                  },
                  {
                    "id": "env-u2-t8",
                    "title": "Pollution Prevention",
                    "content": "Source reduction, cleaner production, process modification and regulatory instruments for pollution prevention."
                  },
                  {
                    "id": "env-u2-t9",
                    "title": "Disaster Management",
                    "content": "Phases of disaster management, preparedness, response and recovery with environmental considerations."
                  }
                ]
              },
              {
                "unitNumber": 3,
                "title": "Social Issues and Environment",
                "topics": [
                  {
                    "id": "env-u3-t1",
                    "title": "Concept of Sustainable Development",
                    "content": "Concept and principles of sustainable development."
                  },
                  {
                    "id": "env-u3-t2",
                    "title": "Urban problems related to Energy",
                    "content": "Energy demand, urban energy challenges, and efficiency measures."
                  },
                  {
                    "id": "env-u3-t3",
                    "title": "Water Conservation",
                    "content": "Methods and importance of conserving water resources; rainwater harvesting and efficient use."
                  },
                  {
                    "id": "env-u3-t4",
                    "title": "Wasteland Reclamation",
                    "content": "Principles and techniques for reclamation of degraded and wasteland areas."
                  },
                  {
                    "id": "env-u3-t5",
                    "title": "Resettlement and Rehabilitation",
                    "content": "Social and environmental aspects of resettlement and rehabilitation policies."
                  },
                  {
                    "id": "env-u3-t6",
                    "title": "Climate Change",
                    "content": "Causes, impacts, mitigation and adaptation strategies for climate change."
                  },
                  {
                    "id": "env-u3-t7",
                    "title": "Nuclear Accidents",
                    "content": "Major nuclear accidents, environmental impacts and safety/response measures."
                  },
                  {
                    "id": "env-u3-t8",
                    "title": "Consumerism and Waste Products",
                    "content": "Effects of consumerism on waste generation and circular economy approaches."
                  },
                  {
                    "id": "env-u3-t9",
                    "title": "Laws related to Environment",
                    "content": "Overview of key environmental laws, regulatory frameworks and enforcement."
                  },
                  {
                    "id": "env-u3-t10",
                    "title": "Forest and Wildlife",
                    "content": "Conservation of forests and wildlife; protected areas and community roles."
                  },
                  {
                    "id": "env-u3-t11",
                    "title": "Environmental Impact Assessment",
                    "content": "Purpose, process and significance of Environmental Impact Assessment (EIA) in project planning."
                  }
                ]
              },
              {
                "unitNumber": 4,
                "title": "Human Dimensions of Environment",
                "topics": [
                  {
                    "id": "env-u4-t1",
                    "title": "Human Population and Environment",
                    "content": "Interactions between human populations and the environment; carrying capacity and resource pressures."
                  },
                  {
                    "id": "env-u4-t2",
                    "title": "Population Growth",
                    "content": "Trends, causes and consequences of population growth; demographic transition and population policies."
                  },
                  {
                    "id": "env-u4-t3",
                    "title": "Human Rights",
                    "content": "Linkages between human rights and environmental protection, access to resources and environmental justice."
                  },
                  {
                    "id": "env-u4-t4",
                    "title": "Family Welfare Programmes",
                    "content": "Overview of family welfare initiatives, reproductive health services and their role in sustainable development."
                  },
                  {
                    "id": "env-u4-t5",
                    "title": "Environment and Human Health",
                    "content": "How environmental factors affect human health; common environmental diseases and prevention strategies."
                  },
                  {
                    "id": "env-u4-t6",
                    "title": "HIV/AIDS",
                    "content": "Basic facts about HIV/AIDS, transmission, prevention and the social-environmental implications."
                  },
                  {
                    "id": "env-u4-t7",
                    "title": "Women Welfare",
                    "content": "Programs and policies for women's welfare and empowerment; gender perspectives in environmental planning."
                  },
                  {
                    "id": "env-u4-t8",
                    "title": "Child Welfare",
                    "content": "Child health, nutrition and welfare programs; environmental determinants of child well-being."
                  },
                  {
                    "id": "env-u4-t9",
                    "title": "Role of Information Technology (IT)",
                    "content": "Use of IT in environmental management, monitoring, awareness, and decision support systems."
                  }
                ]
              }
            ]
          },
          {
            "id": "applied-mathematics-1",
            "name": "Applied Mathematics I",
            "subjectCode": "BAS-101",
            "credits": 4,
            "type": "theory",
            "description": "Calculus and linear algebra foundations for engineering.",
            "units": []
          },
          {
            "id": "human-values-professional-ethics",
            "name": "Human Values and Professional Ethics",
            "subjectCode": "HUM-101",
            "credits": 2,
            "type": "theory",
            "description": "Ethical practice, professional responsibility and human values.",
            "units": []
          },
          {
            "id": "engineering-mechanics",
            "name": "Engineering Mechanics",
            "subjectCode": "BAS-102",
            "credits": 3,
            "type": "theory",
            "description": "Statics and dynamics fundamentals for engineering structures.",
            "units": []
          },
          {
            "id": "workshop-practice",
            "name": "Workshop Practice",
            "subjectCode": "WSP-101",
            "credits": 1,
            "type": "practical",
            "description": "Hands-on workshop skills including basic fitting and carpentry.",
            "units": []
          },
          {
            "id": "manufacturing-processes",
            "name": "Manufacturing Processes",
            "subjectCode": "ME-101",
            "credits": 3,
            "type": "theory",
            "description": "Overview of common manufacturing techniques and processes.",
            "units": []
          },
          {
            "id": "indian-constitution",
            "name": "Indian Constitution",
            "subjectCode": "HUM-103",
            "credits": 1,
            "type": "theory",
            "description": "Basics of the Indian Constitution and civic responsibilities.",
            "units": []
          },
          {
            "id": "electrical-science",
            "name": "Electrical Science",
            "subjectCode": "EE-101",
            "credits": 3,
            "type": "theory",
            "description": "Fundamentals of circuits, signals and electrical measurements.",
            "units": []
          },
          {
            "id": "applied-physics-1",
            "name": "Applied Physics I",
            "subjectCode": "BSC-103",
            "credits": 3,
            "type": "theory",
            "description": "Physics topics relevant to engineering like waves and optics.",
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
            "description": "Fuels, combustion, coal, petroleum, and gaseous fuel systems for engineering applications.",
            "units": [
              {
                "unitNumber": 1,
                "title": "Fuels and Combustion",
                "topics": [
                  {
                    "id": "applied-chemistry-u1-t1",
                    "title": "Fuels: Classification and Characteristics of Fuels",
                    "content": "Fuels: Classification and Characteristics of Fuels is part of the fuels and combustion syllabus for Applied Chemistry. The topic should be studied with a focus on definition, engineering significance, and at least one practical use.\n\nA compact exam answer should include what the topic means, why it matters, and the standard key points that distinguish it from related fuel topics.",
                    "keyPoints": [
                      "Know the basic definition and use.",
                      "Link the idea to fuel engineering.",
                      "Remember at least one practical example.",
                      "Write short, direct exam answers."
                    ],
                    "examples": [
                      {
                        "title": "Standard example",
                        "explanation": "Relate the topic to a real fuel or refinery application."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define the topic.",
                      "State its importance.",
                      "Write two key points from the syllabus."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t2",
                    "title": "Calorific Value of Fuels",
                    "content": "Calorific Value of Fuels explains the heat liberated when a fuel burns completely. The section distinguishes gross calorific value from net calorific value and shows why latent heat losses reduce the usable heat output.\n\nThis topic is important for comparing fuels in boilers, furnaces, and engines because the same mass of fuel can deliver very different amounts of heat depending on composition and moisture content.",
                    "keyPoints": [
                      "Know the meaning of GCV and NCV.",
                      "Calorific value is usually written in kJ/kg or MJ/kg.",
                      "Moisture and hydrogen content affect the usable heat.",
                      "Fuel selection often starts with calorific value."
                    ],
                    "examples": [
                      {
                        "title": "Fuel comparison",
                        "explanation": "A higher calorific value means more heat for the same fuel mass."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "NCV relation",
                        "formula": "NCV = GCV - latent heat of water formed",
                        "description": "NCV excludes the heat lost with steam in flue gases."
                      }
                    ],
                    "examQuestions": [
                      "Define calorific value and differentiate GCV and NCV.",
                      "Why is NCV lower than GCV?",
                      "State the units used for calorific value."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t3",
                    "title": "Comparison of Solid, Liquid and Gaseous Fuels",
                    "content": "Comparison of Solid, Liquid and Gaseous Fuels is part of the fuels and combustion syllabus for Applied Chemistry. The topic should be studied with a focus on definition, engineering significance, and at least one practical use.\n\nA compact exam answer should include what the topic means, why it matters, and the standard key points that distinguish it from related fuel topics.",
                    "keyPoints": [
                      "Know the basic definition and use.",
                      "Link the idea to fuel engineering.",
                      "Remember at least one practical example.",
                      "Write short, direct exam answers."
                    ],
                    "examples": [
                      {
                        "title": "Standard example",
                        "explanation": "Relate the topic to a real fuel or refinery application."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define the topic.",
                      "State its importance.",
                      "Write two key points from the syllabus."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t4",
                    "title": "Determination of Calorific Value using Bomb Calorimeter",
                    "content": "Determination of Calorific Value using Bomb Calorimeter describes the experimental method used to measure heat of combustion. The bomb calorimeter gives accurate results for solid and liquid fuels, while Boy's calorimeter is commonly used for gaseous fuels.\n\nIn exam answers, students should mention the principle, apparatus, correction terms, and the type of fuel for which the method is best suited.",
                    "keyPoints": [
                      "Bomb calorimeter is a constant-volume method.",
                      "Boy's calorimeter is used mainly for gases.",
                      "Temperature rise is the main observed quantity.",
                      "Corrections are applied for wire and side reactions."
                    ],
                    "examples": [
                      {
                        "title": "Practical setup",
                        "explanation": "A measured temperature rise is converted into calorific value."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Heat calculation",
                        "formula": "Heat released = water equivalent x temperature rise - corrections",
                        "description": "Use the calorimeter constant or water equivalent."
                      }
                    ],
                    "examQuestions": [
                      "Explain the working principle of the calorimeter.",
                      "Why is oxygen used in the bomb?",
                      "Compare bomb and Boy's calorimeters."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t5",
                    "title": "Determination of Calorific Value using Boy's Calorimeter",
                    "content": "Determination of Calorific Value using Boy's Calorimeter describes the experimental method used to measure heat of combustion. The bomb calorimeter gives accurate results for solid and liquid fuels, while Boy's calorimeter is commonly used for gaseous fuels.\n\nIn exam answers, students should mention the principle, apparatus, correction terms, and the type of fuel for which the method is best suited.",
                    "keyPoints": [
                      "Bomb calorimeter is a constant-volume method.",
                      "Boy's calorimeter is used mainly for gases.",
                      "Temperature rise is the main observed quantity.",
                      "Corrections are applied for wire and side reactions."
                    ],
                    "examples": [
                      {
                        "title": "Practical setup",
                        "explanation": "A measured temperature rise is converted into calorific value."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Heat calculation",
                        "formula": "Heat released = water equivalent x temperature rise - corrections",
                        "description": "Use the calorimeter constant or water equivalent."
                      }
                    ],
                    "examQuestions": [
                      "Explain the working principle of the calorimeter.",
                      "Why is oxygen used in the bomb?",
                      "Compare bomb and Boy's calorimeters."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t6",
                    "title": "Dulong Formula for Calorific Value",
                    "content": "Dulong Formula for Calorific Value presents a theoretical estimate of calorific value based on ultimate analysis. Dulong's formula is a fast way to approximate the heat of combustion when laboratory calorimetry is not available.\n\nThe formula is widely used in fuel engineering because it connects fuel composition directly with expected heating performance.",
                    "keyPoints": [
                      "Use percentage composition of C, H, O, and S.",
                      "Oxygen reduces the useful hydrogen term.",
                      "It is an approximate but practical formula.",
                      "Common in short numerical questions."
                    ],
                    "examples": [
                      {
                        "title": "Engineering estimate",
                        "explanation": "Quick theoretical value from ultimate analysis."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Dulong formula",
                        "formula": "HCV = 337C + 1442(H - O/8) + 93S",
                        "description": "C, H, O, and S are mass percentages."
                      }
                    ],
                    "examQuestions": [
                      "Write Dulong's formula.",
                      "Why does oxygen lower the hydrogen contribution?",
                      "Give one advantage of the formula."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t7",
                    "title": "Numerical Problems on Calorific Value",
                    "content": "Numerical Problems on Calorific Value focuses on the calculation steps required in fuel and combustion problems. The main task is to choose the correct formula, keep units consistent, and present the final answer clearly.\n\nFor exam practice, students should solve numerical problems involving calorific value, coal analysis, and combustion air requirement because these are standard university-style questions.",
                    "keyPoints": [
                      "Write the known data before solving.",
                      "Check unit conversions carefully.",
                      "Use formula and substitution in a clean sequence.",
                      "Report the answer with the correct unit."
                    ],
                    "examples": [
                      {
                        "title": "Worked calculation",
                        "explanation": "A standard numerical should show formula, substitution, and result."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Basic relation",
                        "formula": "Heat released = mass of fuel x calorific value",
                        "description": "Used when calorific value is already given."
                      }
                    ],
                    "examQuestions": [
                      "Solve a standard numerical from this topic.",
                      "Show the formula before substitution.",
                      "Explain how the final unit is obtained."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t8",
                    "title": "Solid Fuels - Coal",
                    "content": "Solid Fuels - Coal explains coal as the major solid fossil fuel used in power and metallurgy. Coal quality depends on carbon content, volatile matter, ash, moisture, and sulphur, so the topic is closely linked with fuel ranking and industrial selection.\n\nGood exam answers should compare coal ranks and relate coal properties to practical applications like steam raising, coke production, and furnace operation.",
                    "keyPoints": [
                      "Coal is a fossil solid fuel.",
                      "Higher rank coal has higher carbon content.",
                      "Low ash and low sulphur are desirable.",
                      "Coal is important for metallurgy and power generation."
                    ],
                    "examples": [
                      {
                        "title": "Fuel rank",
                        "explanation": "Anthracite is the highest-rank coal commonly discussed in exams."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define coal and classify its ranks.",
                      "Why is anthracite considered superior?",
                      "State two uses of coal."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t9",
                    "title": "Proximate Analysis of Coal",
                    "content": "Proximate Analysis of Coal covers the standard laboratory methods used to assess coal quality. Proximate analysis reports moisture, volatile matter, ash, and fixed carbon, while ultimate analysis reports the elemental composition needed for combustion calculations.\n\nThese analyses help engineers judge ignition behavior, smoke formation, pollution potential, and suitability for boilers or coke ovens.",
                    "keyPoints": [
                      "Proximate analysis gives fuel fractions.",
                      "Ultimate analysis gives elemental percentages.",
                      "Fixed carbon is usually found by difference in proximate analysis.",
                      "Sulphur is important for corrosion and pollution concerns."
                    ],
                    "examples": [
                      {
                        "title": "Coal test result",
                        "explanation": "Analysis data is used to grade the coal for real applications."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Differentiate proximate and ultimate analysis.",
                      "How is fixed carbon found?",
                      "Why is sulphur content important?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t10",
                    "title": "Ultimate Analysis of Coal",
                    "content": "Ultimate Analysis of Coal covers the standard laboratory methods used to assess coal quality. Proximate analysis reports moisture, volatile matter, ash, and fixed carbon, while ultimate analysis reports the elemental composition needed for combustion calculations.\n\nThese analyses help engineers judge ignition behavior, smoke formation, pollution potential, and suitability for boilers or coke ovens.",
                    "keyPoints": [
                      "Proximate analysis gives fuel fractions.",
                      "Ultimate analysis gives elemental percentages.",
                      "Fixed carbon is usually found by difference in proximate analysis.",
                      "Sulphur is important for corrosion and pollution concerns."
                    ],
                    "examples": [
                      {
                        "title": "Coal test result",
                        "explanation": "Analysis data is used to grade the coal for real applications."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Differentiate proximate and ultimate analysis.",
                      "How is fixed carbon found?",
                      "Why is sulphur content important?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t11",
                    "title": "Numerical Problems on Coal Analysis",
                    "content": "Numerical Problems on Coal Analysis focuses on the calculation steps required in fuel and combustion problems. The main task is to choose the correct formula, keep units consistent, and present the final answer clearly.\n\nFor exam practice, students should solve numerical problems involving calorific value, coal analysis, and combustion air requirement because these are standard university-style questions.",
                    "keyPoints": [
                      "Write the known data before solving.",
                      "Check unit conversions carefully.",
                      "Use formula and substitution in a clean sequence.",
                      "Report the answer with the correct unit."
                    ],
                    "examples": [
                      {
                        "title": "Worked calculation",
                        "explanation": "A standard numerical should show formula, substitution, and result."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Basic relation",
                        "formula": "Heat released = mass of fuel x calorific value",
                        "description": "Used when calorific value is already given."
                      }
                    ],
                    "examQuestions": [
                      "Solve a standard numerical from this topic.",
                      "Show the formula before substitution.",
                      "Explain how the final unit is obtained."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t12",
                    "title": "Carbonisation of Coal",
                    "content": "Carbonisation of Coal explains the industrial conversion of coal into stronger fuel or useful by-products. Carbonisation removes volatile matter, coke ovens recover valuable chemicals, and by-product recovery improves both economics and environmental performance.\n\nThese topics are often asked together because they describe a complete coke-making and coal-utilization sequence.",
                    "keyPoints": [
                      "The process is done in the absence of air.",
                      "Useful by-products are recovered from gases and tar.",
                      "Coke is the main solid residue.",
                      "High-temperature treatment generally gives stronger coke."
                    ],
                    "examples": [
                      {
                        "title": "Coke-making route",
                        "explanation": "Coal is heated without air to produce coke and by-products."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Explain carbonisation of coal.",
                      "What is the Otto-Hoffmann coke oven?",
                      "Name the coal by-products recovered."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t13",
                    "title": "Otto-Hoffmann Coke Oven",
                    "content": "Otto-Hoffmann Coke Oven explains the industrial conversion of coal into stronger fuel or useful by-products. Carbonisation removes volatile matter, coke ovens recover valuable chemicals, and by-product recovery improves both economics and environmental performance.\n\nThese topics are often asked together because they describe a complete coke-making and coal-utilization sequence.",
                    "keyPoints": [
                      "The process is done in the absence of air.",
                      "Useful by-products are recovered from gases and tar.",
                      "Coke is the main solid residue.",
                      "High-temperature treatment generally gives stronger coke."
                    ],
                    "examples": [
                      {
                        "title": "Coke-making route",
                        "explanation": "Coal is heated without air to produce coke and by-products."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Explain carbonisation of coal.",
                      "What is the Otto-Hoffmann coke oven?",
                      "Name the coal by-products recovered."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t14",
                    "title": "Recovery of Coal By-products",
                    "content": "Recovery of Coal By-products explains the industrial conversion of coal into stronger fuel or useful by-products. Carbonisation removes volatile matter, coke ovens recover valuable chemicals, and by-product recovery improves both economics and environmental performance.\n\nThese topics are often asked together because they describe a complete coke-making and coal-utilization sequence.",
                    "keyPoints": [
                      "The process is done in the absence of air.",
                      "Useful by-products are recovered from gases and tar.",
                      "Coke is the main solid residue.",
                      "High-temperature treatment generally gives stronger coke."
                    ],
                    "examples": [
                      {
                        "title": "Coke-making route",
                        "explanation": "Coal is heated without air to produce coke and by-products."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Explain carbonisation of coal.",
                      "What is the Otto-Hoffmann coke oven?",
                      "Name the coal by-products recovered."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t15",
                    "title": "Metallurgical Coke",
                    "content": "Metallurgical Coke explains coal as the major solid fossil fuel used in power and metallurgy. Coal quality depends on carbon content, volatile matter, ash, moisture, and sulphur, so the topic is closely linked with fuel ranking and industrial selection.\n\nGood exam answers should compare coal ranks and relate coal properties to practical applications like steam raising, coke production, and furnace operation.",
                    "keyPoints": [
                      "Coal is a fossil solid fuel.",
                      "Higher rank coal has higher carbon content.",
                      "Low ash and low sulphur are desirable.",
                      "Coal is important for metallurgy and power generation."
                    ],
                    "examples": [
                      {
                        "title": "Fuel rank",
                        "explanation": "Anthracite is the highest-rank coal commonly discussed in exams."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Define coal and classify its ranks.",
                      "Why is anthracite considered superior?",
                      "State two uses of coal."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t16",
                    "title": "Liquid Fuels - Petroleum and Petroleum Products",
                    "content": "Liquid Fuels - Petroleum and Petroleum Products deals with crude oil as a liquid fuel source and the refinery operations used to convert it into useful products. Fractional distillation, refining, and cracking all aim to maximize the yield of transport fuels and heating oils.\n\nStudents should remember that liquid fuel quality is influenced by volatility, knock resistance, sulphur content, and product distribution from the refinery.",
                    "keyPoints": [
                      "Petroleum is a mixture of hydrocarbons.",
                      "Refining separates and upgrades crude oil.",
                      "Cracking converts heavier fractions to lighter ones.",
                      "Fuel quality is related to volatility and knock resistance."
                    ],
                    "examples": [
                      {
                        "title": "Refinery processing",
                        "explanation": "Crude oil is turned into fuels, lubricants, and other fractions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "What is petroleum refining?",
                      "Differentiate thermal and catalytic cracking.",
                      "Why is cracking used in refineries?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t17",
                    "title": "Refining of Petroleum",
                    "content": "Refining of Petroleum deals with crude oil as a liquid fuel source and the refinery operations used to convert it into useful products. Fractional distillation, refining, and cracking all aim to maximize the yield of transport fuels and heating oils.\n\nStudents should remember that liquid fuel quality is influenced by volatility, knock resistance, sulphur content, and product distribution from the refinery.",
                    "keyPoints": [
                      "Petroleum is a mixture of hydrocarbons.",
                      "Refining separates and upgrades crude oil.",
                      "Cracking converts heavier fractions to lighter ones.",
                      "Fuel quality is related to volatility and knock resistance."
                    ],
                    "examples": [
                      {
                        "title": "Refinery processing",
                        "explanation": "Crude oil is turned into fuels, lubricants, and other fractions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "What is petroleum refining?",
                      "Differentiate thermal and catalytic cracking.",
                      "Why is cracking used in refineries?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t18",
                    "title": "Thermal Cracking",
                    "content": "Thermal Cracking deals with crude oil as a liquid fuel source and the refinery operations used to convert it into useful products. Fractional distillation, refining, and cracking all aim to maximize the yield of transport fuels and heating oils.\n\nStudents should remember that liquid fuel quality is influenced by volatility, knock resistance, sulphur content, and product distribution from the refinery.",
                    "keyPoints": [
                      "Petroleum is a mixture of hydrocarbons.",
                      "Refining separates and upgrades crude oil.",
                      "Cracking converts heavier fractions to lighter ones.",
                      "Fuel quality is related to volatility and knock resistance."
                    ],
                    "examples": [
                      {
                        "title": "Refinery processing",
                        "explanation": "Crude oil is turned into fuels, lubricants, and other fractions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "What is petroleum refining?",
                      "Differentiate thermal and catalytic cracking.",
                      "Why is cracking used in refineries?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t19",
                    "title": "Catalytic Cracking",
                    "content": "Catalytic Cracking deals with crude oil as a liquid fuel source and the refinery operations used to convert it into useful products. Fractional distillation, refining, and cracking all aim to maximize the yield of transport fuels and heating oils.\n\nStudents should remember that liquid fuel quality is influenced by volatility, knock resistance, sulphur content, and product distribution from the refinery.",
                    "keyPoints": [
                      "Petroleum is a mixture of hydrocarbons.",
                      "Refining separates and upgrades crude oil.",
                      "Cracking converts heavier fractions to lighter ones.",
                      "Fuel quality is related to volatility and knock resistance."
                    ],
                    "examples": [
                      {
                        "title": "Refinery processing",
                        "explanation": "Crude oil is turned into fuels, lubricants, and other fractions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "What is petroleum refining?",
                      "Differentiate thermal and catalytic cracking.",
                      "Why is cracking used in refineries?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t20",
                    "title": "Knocking Characteristics of Fuels",
                    "content": "Knocking Characteristics of Fuels explains how fuel quality is judged in internal combustion engines. Octane number is used for petrol fuels and cetane number is used for diesel fuels. Both ratings are connected with the way a fuel ignites and burns inside the engine.\n\nEngineers use these numbers to reduce knock, improve efficiency, and choose the correct fuel for the engine type.",
                    "keyPoints": [
                      "Octane number is for spark-ignition engines.",
                      "Cetane number is for compression-ignition engines.",
                      "Higher octane resists knock better.",
                      "Higher cetane means easier ignition in diesel engines."
                    ],
                    "examples": [
                      {
                        "title": "Engine rating",
                        "explanation": "Fuel ratings tell how the fuel behaves under engine conditions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Differentiate octane and cetane numbers.",
                      "Why is knock resistance important?",
                      "How do fuel ratings affect engine performance?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t21",
                    "title": "Octane Number and Rating",
                    "content": "Octane Number and Rating explains how fuel quality is judged in internal combustion engines. Octane number is used for petrol fuels and cetane number is used for diesel fuels. Both ratings are connected with the way a fuel ignites and burns inside the engine.\n\nEngineers use these numbers to reduce knock, improve efficiency, and choose the correct fuel for the engine type.",
                    "keyPoints": [
                      "Octane number is for spark-ignition engines.",
                      "Cetane number is for compression-ignition engines.",
                      "Higher octane resists knock better.",
                      "Higher cetane means easier ignition in diesel engines."
                    ],
                    "examples": [
                      {
                        "title": "Engine rating",
                        "explanation": "Fuel ratings tell how the fuel behaves under engine conditions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Differentiate octane and cetane numbers.",
                      "Why is knock resistance important?",
                      "How do fuel ratings affect engine performance?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t22",
                    "title": "Cetane Number and Rating",
                    "content": "Cetane Number and Rating explains how fuel quality is judged in internal combustion engines. Octane number is used for petrol fuels and cetane number is used for diesel fuels. Both ratings are connected with the way a fuel ignites and burns inside the engine.\n\nEngineers use these numbers to reduce knock, improve efficiency, and choose the correct fuel for the engine type.",
                    "keyPoints": [
                      "Octane number is for spark-ignition engines.",
                      "Cetane number is for compression-ignition engines.",
                      "Higher octane resists knock better.",
                      "Higher cetane means easier ignition in diesel engines."
                    ],
                    "examples": [
                      {
                        "title": "Engine rating",
                        "explanation": "Fuel ratings tell how the fuel behaves under engine conditions."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Differentiate octane and cetane numbers.",
                      "Why is knock resistance important?",
                      "How do fuel ratings affect engine performance?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t23",
                    "title": "Gaseous Fuels - Natural Gas (NG)",
                    "content": "Gaseous Fuels - Natural Gas (NG) describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t24",
                    "title": "Compressed Natural Gas (CNG)",
                    "content": "Compressed Natural Gas (CNG) describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t25",
                    "title": "Liquefied Petroleum Gas (LPG)",
                    "content": "Liquefied Petroleum Gas (LPG) describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t26",
                    "title": "Coal Gas",
                    "content": "Coal Gas describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t27",
                    "title": "Oil Gas",
                    "content": "Oil Gas describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t28",
                    "title": "Producer Gas",
                    "content": "Producer Gas describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t29",
                    "title": "Water Gas",
                    "content": "Water Gas describes a gaseous fuel used for heating, power generation, or transport. The fuels in this group vary in composition, calorific value, and method of preparation, but they are all studied because gases usually burn more cleanly than solid fuels.\n\nFor exam preparation, students should know the components, preparation, uses, and relative advantages of each gaseous fuel.",
                    "keyPoints": [
                      "Gaseous fuels mix easily with air.",
                      "Many gaseous fuels are by-products of coal or petroleum processing.",
                      "They generally burn cleanly with less ash.",
                      "Composition determines heating value and uses."
                    ],
                    "examples": [
                      {
                        "title": "Clean combustion",
                        "explanation": "Gaseous fuels often give better control and lower residue."
                      }
                    ],
                    "formulas": [],
                    "examQuestions": [
                      "Describe the fuel, its composition, and its uses.",
                      "Why are gaseous fuels convenient?",
                      "State one advantage of this gaseous fuel."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t30",
                    "title": "Combustion of Fuels",
                    "content": "Combustion of Fuels deals with the chemical and thermal basis of burning fuel in air. Students must understand complete and incomplete combustion, air-fuel ratio, excess air, and the heat released during oxidation.\n\nThis section brings together the earlier fuel topics and prepares the student for combustion numericals and design-based exam questions.",
                    "keyPoints": [
                      "Complete combustion gives maximum heat.",
                      "Insufficient air leads to CO and soot.",
                      "Theoretical air is calculated from stoichiometry.",
                      "Combustion efficiency depends on mixing and burner design."
                    ],
                    "examples": [
                      {
                        "title": "Heat release",
                        "explanation": "The fuel-air reaction converts chemical energy into useful heat."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Basic relation",
                        "formula": "Fuel + O2 -> CO2 + H2O + heat",
                        "description": "Ideal complete combustion equation."
                      }
                    ],
                    "examQuestions": [
                      "Define combustion and distinguish complete from incomplete combustion.",
                      "What is excess air?",
                      "Why is combustion efficiency important?"
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  },
                  {
                    "id": "applied-chemistry-u1-t31",
                    "title": "Numerical Problems on Combustion of Fuels",
                    "content": "Numerical Problems on Combustion of Fuels focuses on the calculation steps required in fuel and combustion problems. The main task is to choose the correct formula, keep units consistent, and present the final answer clearly.\n\nFor exam practice, students should solve numerical problems involving calorific value, coal analysis, and combustion air requirement because these are standard university-style questions.",
                    "keyPoints": [
                      "Write the known data before solving.",
                      "Check unit conversions carefully.",
                      "Use formula and substitution in a clean sequence.",
                      "Report the answer with the correct unit."
                    ],
                    "examples": [
                      {
                        "title": "Worked calculation",
                        "explanation": "A standard numerical should show formula, substitution, and result."
                      }
                    ],
                    "formulas": [
                      {
                        "name": "Basic relation",
                        "formula": "Heat released = mass of fuel x calorific value",
                        "description": "Used when calorific value is already given."
                      }
                    ],
                    "examQuestions": [
                      "Solve a standard numerical from this topic.",
                      "Show the formula before substitution.",
                      "Explain how the final unit is obtained."
                    ],
                    "references": [
                      {
                        "title": "Applied Chemistry Textbook",
                        "author": "IPU Faculty Notes"
                      },
                      {
                        "title": "Engineering Chemistry Reference",
                        "author": "Standard Text"
                      }
                    ]
                  }
                ]
              }
            ]
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
            "units": [
              {
                "unitNumber": 1,
                "title": "Environmental Studies — Unit 1",
                "topics": [
                  {
                    "id": "env-u1-t1",
                    "title": "Introduction to Environmental Studies",
                    "content": "Overview of environmental studies and its relevance to society and engineering."
                  },
                  {
                    "id": "env-u1-t2",
                    "title": "Multidisciplinary Nature of Environmental Studies",
                    "content": "How environmental studies integrates biology, chemistry, geology, social sciences and policy."
                  },
                  {
                    "id": "env-u1-t3",
                    "title": "Components, Scope and Importance of Environmental Studies",
                    "content": "Components (air, water, land, biota), scope of study and importance for sustainable development."
                  },
                  {
                    "id": "env-u1-t4",
                    "title": "Need for Public Awareness",
                    "content": "Role of public awareness, education, and community participation in environmental protection."
                  },
                  {
                    "id": "env-u1-t5",
                    "title": "Natural Resources",
                    "content": "Types of natural resources: renewable and non-renewable; sustainable use and management."
                  },
                  {
                    "id": "env-u1-t6",
                    "title": "Ecosystems",
                    "content": "Definition of ecosystem and interactions between organisms and their environment."
                  },
                  {
                    "id": "env-u1-t7",
                    "title": "Structure and Function of Ecosystems",
                    "content": "Trophic levels, food chains/webs, energy flow and ecological pyramids."
                  },
                  {
                    "id": "env-u1-t8",
                    "title": "Types of Ecosystems",
                    "content": "Terrestrial, aquatic, marine, freshwater, forest, grassland and desert ecosystems overview."
                  },
                  {
                    "id": "env-u1-t9",
                    "title": "Functional Components of Ecosystems",
                    "content": "Producers, consumers, decomposers and abiotic components; nutrient cycles and productivity."
                  },
                  {
                    "id": "env-u1-t10",
                    "title": "Major Ecosystems",
                    "content": "Key global ecosystems and their ecological significance (forests, wetlands, coral reefs etc.)."
                  },
                  {
                    "id": "env-u1-t11",
                    "title": "Biogeochemical Cycles",
                    "content": "Carbon, nitrogen, phosphorus, sulfur and water cycles and their environmental importance."
                  },
                  {
                    "id": "env-u1-t12",
                    "title": "Biodiversity",
                    "content": "Meaning of biodiversity and levels: genetic, species and ecosystem diversity."
                  },
                  {
                    "id": "env-u1-t13",
                    "title": "Introduction to Biodiversity",
                    "content": "Concepts of biodiversity importance for ecosystem services and human well-being."
                  },
                  {
                    "id": "env-u1-t14",
                    "title": "Biogeographical Classification",
                    "content": "Major biogeographic zones and patterns of species distribution."
                  },
                  {
                    "id": "env-u1-t15",
                    "title": "India as a Mega Diversity Nation",
                    "content": "Factors contributing to India's megadiversity and representative hotspots."
                  },
                  {
                    "id": "env-u1-t16",
                    "title": "Endangered Species of India",
                    "content": "Examples of endangered species, causes of decline and protection status (IUCN, Indian lists)."
                  },
                  {
                    "id": "env-u1-t17",
                    "title": "Endemic Species of India",
                    "content": "Definition of endemism and notable endemic taxa in India and their conservation value."
                  },
                  {
                    "id": "env-u1-t18",
                    "title": "Threats to Biodiversity",
                    "content": "Habitat loss, fragmentation, pollution, invasive species, overexploitation and climate change impacts."
                  },
                  {
                    "id": "env-u1-t19",
                    "title": "Biodiversity Conservation",
                    "content": "In-situ and ex-situ conservation measures, protected areas, biosphere reserves and community conservation."
                  },
                  {
                    "id": "env-u1-t20",
                    "title": "Bioprospecting",
                    "content": "Sustainable search for useful biological resources and ethical considerations in benefit-sharing."
                  },
                  {
                    "id": "env-u1-t21",
                    "title": "Biopiracy",
                    "content": "Unauthorized commercial exploitation of biological resources and traditional knowledge; legal and policy responses."
                  }
                ]
              }
            ]
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
