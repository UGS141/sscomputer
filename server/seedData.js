export const SITE_CONFIG = {
  name: 'Sri Shanmukha Computer Institute',
  shortName: 'SSCI',
  tagline: 'LEARN TODAY. BUILD YOUR FUTURE TOMORROW.',
  whatsappNumber: '919848022338',
  contact: {
    phonePrimary: '+91 98480 22338',
    email: 'info@sscomputerinstitute.com',
    address: 'Opp. B.V.S. High School, Dargamitta, Nellore, Andhra Pradesh 524003',
    workingHours: 'Mon - Sat: 7:00 AM - 8:30 PM',
    mapEmbedUrl: 'https://maps.google.com/?q=Dargamitta,Nellore'
  },
  social: {
    instagram: 'https://www.instagram.com/sscomputerinstitutenlr?srtk=MWsyaHcycjJqYmt2dQ==',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com'
  }
};

export const COURSES_DATA = [
  {
    slug: 'ms-office-computer-fundamentals',
    title: 'MS Office & Computer Fundamentals',
    categoryId: 'computer-essentials',
    categoryName: 'Computer Essentials',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Build foundational computer literacy, mastering Windows OS, MS Word, MS Excel, MS PowerPoint, and office productivity tools.',
    fullDescription: 'This course is tailored for beginners, students, and job seekers wishing to gain confidence in daily computer operations.',
    targetAudience: ['Students looking to build digital literacy', 'Office job aspirants', 'Small business owners'],
    learningOutcomes: ['Navigate Windows OS', 'Draft letters in Word', 'Excel formulas & formatting', 'PowerPoint presentations'],
    skillsLearned: ['Windows 11 OS', 'MS Word', 'MS Excel', 'MS PowerPoint', 'File Management', 'Email Etiquette'],
    tools: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint'],
    certificationName: 'Certificate in Office Automation & Computer Fundamentals',
    projects: ['Resume & Cover Letter', 'Monthly Sales Sheet', 'Presentation Deck'],
    modules: [
      { title: 'Module 1: Computer Fundamentals', topics: ['Windows Navigation', 'File Management', 'Typing Skills'] },
      { title: 'Module 2: MS Word & Excel', topics: ['Document formatting', 'Excel formulas & VLOOKUP'] }
    ],
    faqs: [
      { question: 'Do I need prior computer knowledge?', answer: 'No prior experience required.' }
    ]
  },
  {
    slug: 'tally-prime-gst-accounting',
    title: 'Tally Prime & GST Accounting',
    categoryId: 'computer-essentials',
    categoryName: 'Computer Essentials',
    level: 'Beginner',
    duration: '60 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Master computerized accounting, inventory management, GST compliance, e-invoicing, and financial reporting with Tally Prime.',
    fullDescription: 'Become a job-ready accountant with our comprehensive Tally Prime training.',
    targetAudience: ['Commerce graduates', 'Accountants upgrading to Tally Prime', 'Business owners'],
    learningOutcomes: ['Manage company books', 'GST calculation & billing', 'Bank reconciliation', 'Balance sheets'],
    skillsLearned: ['Tally Prime', 'Voucher Entry', 'GST Filing', 'Bank Reconciliation', 'Inventory'],
    tools: ['Tally Prime Gold', 'GST Portal Simulator', 'MS Excel'],
    certificationName: 'Certificate in Tally Prime & GST Accounting',
    projects: ['GST Invoice Setup', 'Audit Balance Sheet'],
    modules: [
      { title: 'Module 1: Accounting Foundations', topics: ['Debits & Credits', 'Ledgers & Vouchers'] }
    ],
    faqs: [
      { question: 'Is GST practical included?', answer: 'Yes, full practical GST billing is covered.' }
    ]
  },
  {
    slug: 'python-programming',
    title: 'Python Programming',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Beginner to Advanced',
    duration: '60 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Learn Python programming from scratch to OOPs, data structures, file handling, MySQL database integration, and basic web scraping.',
    fullDescription: 'Master modern Python syntax and core logic building for software engineering and data applications.',
    targetAudience: ['CS/IT engineering students', 'Beginners aiming for coding careers', 'Data analysis aspirants'],
    learningOutcomes: ['Python control flow', 'Functions & OOPs concepts', 'Database connection', 'File handling'],
    skillsLearned: ['Python Syntax', 'OOPs', 'Data Structures', 'MySQL Integration', 'API Basics'],
    tools: ['Python 3.12', 'VS Code', 'Jupyter Notebook', 'MySQL Server'],
    certificationName: 'Certificate in Python Programming & Software Logic',
    projects: ['Student Management CLI App', 'Automation Web Scraper'],
    modules: [
      { title: 'Module 1: Python Basics', topics: ['Variables, Loops & Conditionals', 'Data Types'] }
    ],
    faqs: [
      { question: 'Is Python suitable for beginners?', answer: 'Yes, Python is the best language for beginners.' }
    ]
  },
  {
    slug: 'c-cpp-programming',
    title: 'C & C++ Programming',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Beginner',
    duration: '60 Days',
    mode: 'Practical Lab',
    isPopular: false,
    shortDescription: 'Build core computer science logic, memory management, pointers, and object-oriented programming with C and C++.',
    fullDescription: 'Master low-level programming concepts, pointers, memory allocation, and object-oriented paradigms.',
    targetAudience: ['Engineering students (B.Tech/BCA/MCA)', 'Beginners starting coding'],
    learningOutcomes: ['Logic building & algorithms', 'Pointer arithmetic', 'Memory allocation', 'C++ OOPs'],
    skillsLearned: ['C Language', 'C++', 'Pointers', 'Data Structures', 'OOPs'],
    tools: ['GCC Compiler', 'VS Code', 'Code::Blocks'],
    certificationName: 'Certificate in C & C++ Programming Foundations',
    projects: ['Library Management System in C++', 'Bank Account Simulator'],
    modules: [
      { title: 'Module 1: C Syntax & Pointers', topics: ['Control Flow', 'Pointers & Arrays'] }
    ],
    faqs: [
      { question: 'Why learn C and C++ first?', answer: 'They provide strong foundational knowledge of computer memory and logic.' }
    ]
  },
  {
    slug: 'full-stack-web-development',
    title: 'Full Stack Web Development (MERN)',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Intermediate',
    duration: '90 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Build modern responsive web applications using HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, and MongoDB.',
    fullDescription: 'Become a Full Stack Web Developer by mastering frontend UI development and backend API architectures.',
    targetAudience: ['Web developer aspirants', 'Software engineering job seekers'],
    learningOutcomes: ['Responsive HTML/CSS', 'JavaScript ES6+', 'React components & hooks', 'Node.js REST APIs'],
    skillsLearned: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
    tools: ['VS Code', 'React 19', 'Postman', 'Git', 'MongoDB Studio'],
    certificationName: 'Certificate in Full Stack Web Development',
    projects: ['E-Commerce Web Application', 'SSCI Portal Clone'],
    modules: [
      { title: 'Module 1: Web Fundamentals', topics: ['HTML5, CSS3 & Responsive Design'] }
    ],
    faqs: [
      { question: 'Do you cover both frontend and backend?', answer: 'Yes, full MERN stack development is covered.' }
    ]
  },
  {
    slug: 'advanced-excel-data-analytics',
    title: 'Advanced Excel & Data Analytics',
    categoryId: 'data-analytics',
    categoryName: 'Data & Analytics',
    level: 'Intermediate',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Master data analysis, advanced lookup formulas, Pivot Tables, Power Query, dynamic dashboards, and automated report generation.',
    fullDescription: 'Transform raw data into business intelligence using Advanced Excel capabilities.',
    targetAudience: ['Data analyst job seekers', 'Business managers', 'Finance professionals'],
    learningOutcomes: ['VLOOKUP/XLOOKUP/INDEX-MATCH', 'Pivot Tables & Slicers', 'Power Query data transformation', 'Interactive dashboards'],
    skillsLearned: ['Advanced Excel', 'Pivot Tables', 'Power Query', 'Data Visualization', 'VBA Macros'],
    tools: ['Microsoft Excel 2024', 'Power Query', 'Power BI Desktop'],
    certificationName: 'Certificate in Advanced Excel & Business Data Analytics',
    projects: ['Executive Sales Dashboard', 'Financial Reconciliation Model'],
    modules: [
      { title: 'Module 1: Advanced Formulas', topics: ['XLOOKUP, INDEX MATCH, Nested IFs'] }
    ],
    faqs: [
      { question: 'Will I learn dashboard creation?', answer: 'Yes, full interactive dashboard building is included.' }
    ]
  }
];

export const UPCOMING_BATCHES = [
  {
    id: 'BATCH-PY-2026-01',
    courseSlug: 'python-programming',
    courseName: 'Python Programming & Software Logic',
    category: 'Programming',
    level: 'Beginner to Advanced',
    duration: '60 Days',
    timing: 'Morning',
    timeRange: '8:00 AM – 10:00 AM',
    startDate: 'Next Monday',
    mode: 'Practical Lab',
    status: 'Filling Fast',
    totalSeats: 20,
    filledSeats: 14,
    trainerName: 'Senior Python Faculty'
  },
  {
    id: 'BATCH-TP-2026-02',
    courseSlug: 'tally-prime-gst-accounting',
    courseName: 'Tally Prime & GST Accounting',
    category: 'Accounting',
    level: 'Beginner',
    duration: '60 Days',
    timing: 'Evening',
    timeRange: '5:00 PM – 7:00 PM',
    startDate: 'October 5, 2026',
    mode: 'Practical Lab',
    status: 'Starting Soon',
    totalSeats: 20,
    filledSeats: 11,
    trainerName: 'GST & Tally Consultant'
  },
  {
    id: 'BATCH-WD-2026-03',
    courseSlug: 'full-stack-web-development',
    courseName: 'Full Stack Web Development (MERN)',
    category: 'Web Tech',
    level: 'Intermediate',
    duration: '90 Days',
    timing: 'Morning',
    timeRange: '10:00 AM – 12:00 PM',
    startDate: 'October 12, 2026',
    mode: 'Practical Lab',
    status: 'Few Seats Left',
    totalSeats: 15,
    filledSeats: 13,
    trainerName: 'Lead Web Engineer'
  },
  {
    id: 'BATCH-EX-2026-04',
    courseSlug: 'advanced-excel-data-analytics',
    courseName: 'Advanced Excel & Business Data Analytics',
    category: 'Data Analytics',
    level: 'Intermediate',
    duration: '45 Days',
    timing: 'Evening',
    timeRange: '6:30 PM – 8:00 PM',
    startDate: 'October 8, 2026',
    mode: 'Practical Lab',
    status: 'Starting Soon',
    totalSeats: 20,
    filledSeats: 8,
    trainerName: 'Data Analytics Lead'
  }
];

export const BLOG_POSTS = [
  {
    slug: 'top-computer-courses-in-demand-2026',
    title: 'Top High-Demand Computer Courses in 2026 for Jobs',
    excerpt: 'Discover the most valuable computer skills, programming languages, and accounting software courses that offer strong career growth in Andhra Pradesh.',
    content: ['Computer education is crucial for career growth. Learn Python, Tally Prime, Full Stack Web Development, and Advanced Excel to unlock top opportunities.'],
    date: 'Sep 24, 2026',
    author: 'SSCI Academic Editorial',
    authorRole: 'Career Guidance Team',
    readTime: '5 min read',
    category: 'Career Guidance',
    tags: ['Computer Education', 'Nellore', 'Python', 'Tally Prime', 'Jobs 2026']
  },
  {
    slug: 'tally-prime-gst-billing-practical-guide',
    title: 'Practical Guide to Tally Prime & GST Billing for Accountants',
    excerpt: 'A step-by-step primer on handling GSTR-1, GSTR-3B data entries, bank reconciliations, and automated GST invoice generation in Tally Prime.',
    content: ['Tally Prime simplifies GST compliance for modern businesses in India.'],
    date: 'Sep 20, 2026',
    author: 'GST Specialist Faculty',
    authorRole: 'Tally Certified Instructor',
    readTime: '6 min read',
    category: 'Accounting',
    tags: ['Tally Prime', 'GST Accounting', 'Voucher Entry']
  }
];

export const FACULTY_TRAINERS = [
  {
    id: 'tr-1',
    name: 'Sri Shanmukha Lead Faculty',
    role: 'Head of Computer Education & Programming',
    experience: '12+ Years Experience',
    qualification: 'M.Tech (CS) • Senior Instructor',
    bio: 'Specializing in computer fundamentals, C, C++, Python, and practical lab training.',
    skills: ['Python', 'C/C++', 'Tally Prime', 'Office Automation', 'Database Systems'],
    specialization: 'Programming Foundations & Accounting'
  }
];
