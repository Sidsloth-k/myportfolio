import { Skill, SkillCategory } from '../hooks/useSkillsList';
import { UiProject } from './projects';

// BSD Character Dialogue Messages for Database Connection Issues
export const BSD_DATABASE_ERROR_MESSAGES = {
  dazai: [
    "Ah, the database has gone into hiding... much like myself during difficult times.",
    "Even my ability 'No Longer Human' cannot nullify this connection error. How poetic.",
    "The Port Mafia's servers are more reliable than this connection. Perhaps we need a different approach.",
    "Like Dostoyevsky's characters, this database seems to be contemplating its own existence.",
    "Double suicide... wait, wrong context. How about we double-check the connection instead?",
    "The beauty of fallback data is in its simplicity... much like clean code.",
    "Even I need backup plans when my schemes fail. This is just another case to solve."
  ],
  kunikida: [
    "This database connection failure violates the ideal! We must follow proper protocol.",
    "According to my schedule, database connections should be reliable. This is unacceptable!",
    "The ideal database would never fail. We must implement proper error handling immediately.",
    "This connection issue goes against all principles of proper system architecture.",
    "I demand that we establish a proper fallback system according to the ideal standards!"
  ],
  ranpo: [
    "Elementary, my dear! The database is clearly playing hide and seek with us.",
    "My Ultra Deduction ability reveals that the server is simply taking a coffee break.",
    "The case of the missing database connection is quite intriguing... but not unsolvable.",
    "Even without the database, I can deduce that Sidney's skills are impressive.",
    "This is just another mystery to solve! Let me examine the fallback evidence."
  ],
  chuuya: [
    "Damn it! The database connection is weaker than my gravity manipulation!",
    "This server failure is more annoying than Dazai's constant suicide attempts.",
    "Even my 'Upon the Tainted Sorrow' ability can't fix this connection issue.",
    "The Port Mafia's systems are more reliable than this! What a disgrace!",
    "I'll crush this connection error with my gravity powers... if only it were that simple."
  ],
  atsushi: [
    "Oh no! The database is gone... just like when I lose control of my ability.",
    "Don't worry, we can still show Sidney's amazing work with the fallback data!",
    "Even without the database, Sidney's skills shine through like my tiger form.",
    "This connection issue reminds me of my orphanage days... but we'll get through it!",
    "The fallback data is like a safety net - it catches us when we fall."
  ],
  yosano: [
    "The database needs healing... but my 'Thou Shalt Not Die' ability only works on humans.",
    "This connection failure is like a wound that needs immediate attention.",
    "Even I can't heal server connections, but the fallback data will keep us alive.",
    "The database is in critical condition, but Sidney's work speaks for itself.",
    "Like treating a patient without their medical records, we'll work with what we have."
  ]
};

// Fallback Skills Data
export const FALLBACK_SKILLS: Skill[] = [
  {
    id: 1,
    name: "React",
    category: "frontend",
    category_name: "Frontend Development",
    category_color: "#61DAFB",
    category_description: "Building interactive user interfaces",
    proficiency_level: 90,
    years_experience: "4+ years",
    description: "Master of React ecosystem with expertise in hooks, context, and modern patterns",
    overview: "Experienced React developer specializing in component architecture, state management, and performance optimization. Proficient in React Router, Context API, and modern React patterns.",
    technologies: ["React", "TypeScript", "Next.js", "React Router", "Context API", "Hooks"],
    key_achievements: [
      "Built scalable component libraries",
      "Implemented complex state management solutions",
      "Optimized React applications for performance",
      "Mentored junior developers in React best practices"
    ],
    color: "#61DAFB",
    icon_key: "react",
    display_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    project_count: 8,
    projects: [
      {
        id: 1,
        title: "BSD Portfolio",
        description: "Interactive portfolio with character-based UI",
        cover_image_url: "/images/portfolio-preview.jpg",
        contribution: "Full-stack development and design",
        complexity: "High"
      }
    ]
  },
  {
    id: 2,
    name: "TypeScript",
    category: "programming",
    category_name: "Programming Languages",
    category_color: "#3178C6",
    category_description: "Type-safe JavaScript development",
    proficiency_level: 85,
    years_experience: "3+ years",
    description: "TypeScript expert with strong understanding of type systems and advanced patterns",
    overview: "Proficient in TypeScript development with expertise in type definitions, generics, and advanced TypeScript features. Experienced in building type-safe applications.",
    technologies: ["TypeScript", "JavaScript", "ES6+", "Type Definitions", "Generics"],
    key_achievements: [
      "Migrated large JavaScript codebases to TypeScript",
      "Created comprehensive type definitions",
      "Implemented advanced TypeScript patterns",
      "Improved code quality and maintainability"
    ],
    color: "#3178C6",
    icon_key: "typescript",
    display_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    project_count: 12,
    projects: []
  },
  {
    id: 3,
    name: "Node.js",
    category: "backend",
    category_name: "Backend Development",
    category_color: "#339933",
    category_description: "Server-side JavaScript development",
    proficiency_level: 80,
    years_experience: "3+ years",
    description: "Node.js developer with expertise in Express, API design, and database integration",
    overview: "Experienced in building scalable Node.js applications with Express.js, API development, database integration, and server-side optimization.",
    technologies: ["Node.js", "Express.js", "REST APIs", "MongoDB", "PostgreSQL", "Redis"],
    key_achievements: [
      "Built high-performance REST APIs",
      "Implemented caching strategies",
      "Designed scalable server architectures",
      "Integrated multiple database systems"
    ],
    color: "#339933",
    icon_key: "server",
    display_order: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    project_count: 6,
    projects: []
  },
  {
    id: 4,
    name: "Tailwind CSS",
    category: "styling",
    category_name: "Styling & Design",
    category_color: "#06B6D4",
    category_description: "Utility-first CSS framework",
    proficiency_level: 95,
    years_experience: "2+ years",
    description: "Tailwind CSS expert with deep understanding of utility classes and responsive design",
    overview: "Master of Tailwind CSS with expertise in responsive design, custom configurations, and component styling. Experienced in creating beautiful, maintainable interfaces.",
    technologies: ["Tailwind CSS", "CSS3", "Responsive Design", "Custom Components"],
    key_achievements: [
      "Created custom Tailwind configurations",
      "Built responsive design systems",
      "Optimized CSS performance",
      "Mentored team in Tailwind best practices"
    ],
    color: "#06B6D4",
    icon_key: "palette",
    display_order: 4,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    project_count: 15,
    projects: []
  },
  {
    id: 5,
    name: "PostgreSQL",
    category: "database",
    category_name: "Database Management",
    category_color: "#336791",
    category_description: "Advanced relational database management",
    proficiency_level: 75,
    years_experience: "2+ years",
    description: "PostgreSQL expert with experience in complex queries, optimization, and database design",
    overview: "Proficient in PostgreSQL with expertise in database design, query optimization, indexing strategies, and advanced SQL features.",
    technologies: ["PostgreSQL", "SQL", "Database Design", "Query Optimization", "Indexing"],
    key_achievements: [
      "Designed complex database schemas",
      "Optimized slow queries",
      "Implemented database security measures",
      "Migrated legacy databases"
    ],
    color: "#336791",
    icon_key: "database",
    display_order: 5,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    project_count: 4,
    projects: []
  }
];

// Fallback Skill Categories
export const FALLBACK_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 1,
    name: "Frontend Development",
    description: "Building interactive user interfaces and client-side applications",
    color: "#61DAFB",
    icon: "monitor",
    display_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    skills: FALLBACK_SKILLS.filter(skill => skill.category === "frontend"),
    skill_count: 1
  },
  {
    id: 2,
    name: "Programming Languages",
    description: "Core programming languages and type systems",
    color: "#3178C6",
    icon: "code",
    display_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    skills: FALLBACK_SKILLS.filter(skill => skill.category === "programming"),
    skill_count: 1
  },
  {
    id: 3,
    name: "Backend Development",
    description: "Server-side development and API creation",
    color: "#339933",
    icon: "server",
    display_order: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    skills: FALLBACK_SKILLS.filter(skill => skill.category === "backend"),
    skill_count: 1
  },
  {
    id: 4,
    name: "Styling & Design",
    description: "CSS frameworks and design systems",
    color: "#06B6D4",
    icon: "palette",
    display_order: 4,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    skills: FALLBACK_SKILLS.filter(skill => skill.category === "styling"),
    skill_count: 1
  },
  {
    id: 5,
    name: "Database Management",
    description: "Database design and management systems",
    color: "#336791",
    icon: "database",
    display_order: 5,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    skills: FALLBACK_SKILLS.filter(skill => skill.category === "database"),
    skill_count: 1
  }
];

// Fallback Projects Data
export const FALLBACK_PROJECTS: UiProject[] = [
  {
    id: 1,
    title: "BSD Detective Agency Portfolio",
    description: "An interactive portfolio website inspired by Bungou Stray Dogs, featuring character-based UI and detective-themed design elements.",
    type: "Web Development",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "Web Development",
    image: "/images/portfolio-preview.jpg",
    github: "https://github.com/sidney/bsd-portfolio",
    live: "https://sidney.dev",
    highlight: "Interactive portfolio with BSD character themes",
    stats: {
      "Complexity": "High",
      "Status": "Completed",
      "Technologies": "4"
    },
    subtitle: "Interactive portfolio with BSD character themes",
    long_description: "A comprehensive portfolio website featuring BSD character dialogues, smooth animations, and responsive design. Built with modern React patterns and TypeScript for type safety.",
    timeline: "3 months",
    team: "Solo Project",
    role: "Full-stack Developer",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    images: [],
    features: [],
    roadmap: [],
    testimonials: [],
    metrics: []
  },
  {
    id: 2,
    title: "Digital Detective Case Manager",
    description: "A comprehensive case management system for digital investigations, featuring advanced search capabilities and evidence tracking.",
    type: "Full Stack",
    technologies: ["Node.js", "PostgreSQL", "React", "Express.js"],
    category: "Full Stack",
    image: "/images/case-manager-preview.jpg",
    github: "https://github.com/sidney/case-manager",
    live: "https://case-manager.sidney.dev",
    highlight: "Case management system for digital investigations",
    stats: {
      "Complexity": "High",
      "Status": "In Progress",
      "Technologies": "4"
    },
    subtitle: "Case management system for digital investigations",
    long_description: "A comprehensive case management system featuring advanced search capabilities, evidence tracking, and real-time collaboration tools for digital investigations.",
    timeline: "6 months",
    team: "Solo Project",
    role: "Backend Developer",
    skills: ["Node.js", "PostgreSQL", "React"],
    images: [],
    features: [],
    roadmap: [],
    testimonials: [],
    metrics: []
  },
  {
    id: 3,
    title: "Mystery Solver API",
    description: "A RESTful API for solving complex digital mysteries, featuring advanced algorithms and pattern recognition capabilities.",
    type: "Backend",
    technologies: ["Node.js", "Express.js", "MongoDB", "Redis"],
    category: "Backend",
    image: "/images/api-preview.jpg",
    github: "https://github.com/sidney/mystery-api",
    live: "https://api.sidney.dev",
    highlight: "RESTful API for digital mystery solving",
    stats: {
      "Complexity": "Medium",
      "Status": "Completed",
      "Technologies": "4"
    },
    subtitle: "RESTful API for digital mystery solving",
    long_description: "A high-performance RESTful API featuring advanced algorithms, pattern recognition capabilities, and comprehensive error handling for digital mystery solving applications.",
    timeline: "2 months",
    team: "Solo Project",
    role: "API Developer",
    skills: ["Node.js", "Express.js", "MongoDB"],
    images: [],
    features: [],
    roadmap: [],
    testimonials: [],
    metrics: []
  }
];

// Fallback Project Categories
export const FALLBACK_PROJECT_CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    label: "Web Apps",
    count: 1
  },
  {
    id: "full-stack",
    name: "Full Stack",
    label: "Full Stack",
    count: 1
  },
  {
    id: "backend",
    name: "Backend",
    label: "APIs & Services",
    count: 1
  },
  {
    id: "frontend",
    name: "Frontend",
    label: "UI/UX",
    count: 0
  }
];

// Utility function to get random BSD character message
export function getRandomBSDMessage(character: keyof typeof BSD_DATABASE_ERROR_MESSAGES = 'dazai'): string {
  const messages = BSD_DATABASE_ERROR_MESSAGES[character];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Utility function to get random BSD character
export function getRandomBSDCharacter(): keyof typeof BSD_DATABASE_ERROR_MESSAGES {
  const characters = Object.keys(BSD_DATABASE_ERROR_MESSAGES) as Array<keyof typeof BSD_DATABASE_ERROR_MESSAGES>;
  return characters[Math.floor(Math.random() * characters.length)];
}
