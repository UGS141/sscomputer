export interface LearningPathStep {
  stepNumber: number;
  title: string;
  courseSlug: string;
  description: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  badge: 'BEGINNER' | 'PROFESSIONAL' | 'FULL STACK' | 'DATA & AI' | 'CREATIVE';
  tagline: string;
  description: string;
  targetAudience: string;
  totalDuration: string;
  level: string;
  skillsGained: string[];
  includedCourses: string[];
  steps: LearningPathStep[];
  colorGradient: string;
  badgeStyle: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'digital-foundation',
    title: 'Digital Foundation Path',
    badge: 'BEGINNER',
    tagline: 'Build Your Digital Foundation',
    description: 'Designed for absolute beginners to gain complete confidence operating computers, managing files, drafting office documentation, spreadsheets, and navigating the internet safely.',
    targetAudience: 'School students, job seekers, non-tech background professionals, and office administrators.',
    totalDuration: '2 to 3 Months',
    level: 'Beginner',
    skillsGained: ['Computer Operating Systems', 'MS Word Formatting', 'MS Excel Formulas', 'PowerPoint Deck Design', 'Email & Web Navigation'],
    includedCourses: ['MS Office & Computer Fundamentals', 'Computer Hardware & Troubleshooting'],
    colorGradient: 'from-teal-500 to-emerald-600',
    badgeStyle: 'bg-teal-100 text-teal-800 border-teal-300',
    steps: [
      { stepNumber: 1, title: 'Computer Hardware & Windows 11', courseSlug: 'ms-office-computer-fundamentals', description: 'Master PC operation, OS navigation, file management, typing, and keyboard shortcuts.' },
      { stepNumber: 2, title: 'Document & Report Creation', courseSlug: 'ms-office-computer-fundamentals', description: 'Learn professional document drafting, tables, formatting, and mail merge in MS Word.' },
      { stepNumber: 3, title: 'Data Analysis & Spreadsheets', courseSlug: 'ms-office-computer-fundamentals', description: 'Build spreadsheets with calculations, VLOOKUP formulas, and chart presentations in Excel.' },
      { stepNumber: 4, title: 'Digital Workplace & Security', courseSlug: 'ms-office-computer-fundamentals', description: 'Learn email writing standards, cloud drive sharing, and safe internet browsing rules.' }
    ]
  },
  {
    slug: 'programming-mastery',
    title: 'Software Programming Path',
    badge: 'PROFESSIONAL',
    tagline: 'Build Strong Technical Skills',
    description: 'Master core computer logic, problem-solving algorithms, pointers, memory management, and Object-Oriented design in C, C++, Java, and Python.',
    targetAudience: 'Engineering undergraduates, BCA/MCA students, and IT career aspirants.',
    totalDuration: '3 to 5 Months',
    level: 'Beginner to Intermediate',
    skillsGained: ['Algorithmic Thinking', 'Memory Management', 'Object-Oriented Programming (OOP)', 'Data Structures Basics', 'Multi-language Syntax'],
    includedCourses: ['C Programming Fundamentals', 'C++ & Object-Oriented Programming', 'Python Programming', 'Java Programming Masterclass'],
    colorGradient: 'from-emerald-600 to-teal-700',
    badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    steps: [
      { stepNumber: 1, title: 'Logic Building with C Language', courseSlug: 'c-programming', description: 'Understand logic flow, loops, functions, memory pointers, and structures in C.' },
      { stepNumber: 2, title: 'Object-Oriented Programming in C++', courseSlug: 'c-plus-plus-programming', description: 'Master classes, encapsulation, inheritance, polymorphism, and C++ STL.' },
      { stepNumber: 3, title: 'Versatile Scripting with Python', courseSlug: 'python-programming', description: 'Write clean Python code for automation, file handling, and modular applications.' },
      { stepNumber: 4, title: 'Enterprise Development with Java', courseSlug: 'java-programming', description: 'Build Java desktop & console apps connected to relational MySQL databases.' }
    ]
  },
  {
    slug: 'web-developer-career',
    title: 'Full Stack Web Developer Path',
    badge: 'FULL STACK',
    tagline: 'Become a Web Developer',
    description: 'A complete step-by-step path taking you from HTML layout design to React frontend SPAs, Express Node.js APIs, database modeling, and live cloud deployment.',
    targetAudience: 'Computer science students, aspiring web engineers, and career switchers.',
    totalDuration: '4 to 6 Months',
    level: 'Beginner to Advanced',
    skillsGained: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'Node.js & Express', 'MongoDB & SQL', 'Git & Cloud Deployment'],
    includedCourses: ['HTML5 & CSS3 Fundamentals', 'JavaScript Modern ES6+', 'React Frontend Development', 'Full Stack Web Development'],
    colorGradient: 'from-orange-500 to-amber-600',
    badgeStyle: 'bg-orange-100 text-orange-800 border-orange-300',
    steps: [
      { stepNumber: 1, title: 'Responsive Layouts (HTML/CSS)', courseSlug: 'html-css-fundamentals', description: 'Craft mobile-friendly web pages with semantic HTML5, Flexbox, and CSS Grid.' },
      { stepNumber: 2, title: 'Dynamic Web Scripts (JavaScript)', courseSlug: 'javascript-programming', description: 'Bring pages to life with DOM manipulation, ES6+ features, events, and Fetch API.' },
      { stepNumber: 3, title: 'Frontend Component Architecture (React)', courseSlug: 'react-frontend-development', description: 'Build modern Single Page Applications using React components, hooks, and router.' },
      { stepNumber: 4, title: 'Backend APIs & Database Integration', courseSlug: 'full-stack-web-development', description: 'Create REST APIs in Node.js/Express, connect MongoDB, implement JWT auth, and host live.' }
    ]
  },
  {
    slug: 'data-analytics-path',
    title: 'Data & Analytics Pathway',
    badge: 'DATA & AI',
    tagline: 'Turn Data Into Insights',
    description: 'Transform raw corporate data into actionable business insights using Advanced Excel, SQL database queries, Python analytics, and Power BI dashboards.',
    targetAudience: 'MIS executives, finance professionals, business analysts, and data science enthusiasts.',
    totalDuration: '3 to 4 Months',
    level: 'Intermediate',
    skillsGained: ['Advanced Excel Analytics', 'Power Query Transformation', 'SQL Database Querying', 'DAX Measures & Power BI', 'Data Storytelling'],
    includedCourses: ['Advanced Excel & Business Analytics', 'SQL & Relational Databases', 'Data Analytics with Power BI & SQL'],
    colorGradient: 'from-amber-500 to-teal-600',
    badgeStyle: 'bg-amber-100 text-amber-800 border-amber-300',
    steps: [
      { stepNumber: 1, title: 'Spreadsheet Mastery & Power Query', courseSlug: 'advanced-excel-financial-modeling', description: 'Master XLOOKUP, Pivot Tables, dynamic formulas, and clean raw data in Excel.' },
      { stepNumber: 2, title: 'Relational Database Querying (SQL)', courseSlug: 'sql-relational-databases', description: 'Extract, aggregate, and join complex corporate datasets with SQL queries.' },
      { stepNumber: 3, title: 'Interactive Dashboard Building (Power BI)', courseSlug: 'data-analytics-power-bi', description: 'Design executive KPI dashboards with DAX measures, star schemas, and visual charts.' }
    ]
  },
  {
    slug: 'creative-design-path',
    title: 'Creative Visual Design Path',
    badge: 'CREATIVE',
    tagline: 'Design. Create. Communicate.',
    description: 'Learn visual visual communication principles, Photoshop photo manipulation, Canva graphics design, vector branding, and promotional social media media artwork.',
    targetAudience: 'Creative aspirants, digital marketers, freelancers, and visual storytellers.',
    totalDuration: '2 to 3 Months',
    level: 'Beginner',
    skillsGained: ['Adobe Photoshop', 'Canva Graphics', 'Typography Rules', 'Color Harmony', 'Brand Kit Creation', 'Social Media Layouts'],
    includedCourses: ['Graphic Design & Photoshop Masterclass'],
    colorGradient: 'from-pink-500 to-rose-600',
    badgeStyle: 'bg-pink-100 text-pink-800 border-pink-300',
    steps: [
      { stepNumber: 1, title: 'Visual Composition & Color Theory', courseSlug: 'graphic-design-photoshop-canva', description: 'Understand graphic design principles, font combinations, and color palette creation.' },
      { stepNumber: 2, title: 'Photoshop Image Editing & Masking', courseSlug: 'graphic-design-photoshop-canva', description: 'Master layers, pen tool selections, photo retouching, and background cutouts.' },
      { stepNumber: 3, title: 'Branding & Social Media Artworks', courseSlug: 'graphic-design-photoshop-canva', description: 'Design social media posters, ad banners, business cards, and marketing collateral.' }
    ]
  }
];

export const getLearningPathBySlug = (slug: string): LearningPath | undefined => {
  return LEARNING_PATHS.find((p) => p.slug === slug);
};
