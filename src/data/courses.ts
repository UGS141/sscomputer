export interface CourseModule {
  title: string;
  topics: string[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface Course {
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  mode: 'Classroom' | 'Practical Lab' | 'Hybrid';
  shortDescription: string;
  fullDescription: string;
  targetAudience: string[];
  learningOutcomes: string[];
  skillsLearned: string[];
  tools: string[];
  modules: CourseModule[];
  certificationName: string;
  projects: string[];
  faqs: CourseFAQ[];
  isPopular?: boolean;
}

export const COURSES_DATA: Course[] = [
  // 1. COMPUTER ESSENTIALS
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
    fullDescription: 'This course is tailored for beginners, students, and job seekers wishing to gain confidence in daily computer operations. You will gain hands-on practice in typing, operating system navigation, professional document formatting in Word, data management in Excel, slide creation in PowerPoint, and safe web browsing.',
    targetAudience: [
      'Students looking to build digital literacy from scratch',
      'Office job aspirants wanting core software proficiency',
      'Small business owners and administrative personnel',
      'Anyone preparing for competitive exam computer tests'
    ],
    learningOutcomes: [
      'Navigate Windows OS confidently and manage file structures',
      'Draft professional letters, reports, and resumes in MS Word',
      'Create formatted spreadsheets with formulas and functions in MS Excel',
      'Design engaging presentations in MS PowerPoint',
      'Utilize cloud storage, email etiquette, and safe internet browsing'
    ],
    skillsLearned: ['Windows 11 OS', 'MS Word', 'MS Excel', 'MS PowerPoint', 'File Management', 'Internet Security', 'Email Communications'],
    tools: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Google Docs', 'Chrome'],
    certificationName: 'Certificate in Office Automation & Computer Fundamentals',
    projects: ['Professional Resume & Cover Letter', 'Monthly Sales & Salary Sheet in Excel', 'Corporate Presentation Deck'],
    modules: [
      { title: 'Module 1: Computer Fundamentals & Windows 11', topics: ['Hardware vs Software overview', 'Windows Navigation & Settings', 'File Management & Shortcuts', 'Typing Skills'] },
      { title: 'Module 2: Microsoft Word Essentials', topics: ['Document formatting & styles', 'Tables, header/footer, page layout', 'Mail Merge & printing setup', 'Templates & cover letters'] },
      { title: 'Module 3: Microsoft Excel Foundations', topics: ['Worksheet setup & cell formatting', 'Essential math formulas (SUM, AVERAGE, COUNT)', 'VLOOKUP, HLOOKUP & IF statements', 'Charts, graphs & print areas'] },
      { title: 'Module 4: Microsoft PowerPoint', topics: ['Slide layout & design themes', 'Adding shapes, smart art & images', 'Transitions, animations & slide master', 'Presenting slide shows'] },
      { title: 'Module 5: Digital Workplace & Internet', topics: ['Email writing etiquette', 'Google Workspace tools', 'Cloud storage & file sharing', 'Online cyber security basics'] }
    ],
    faqs: [
      { question: 'Do I need prior computer knowledge to enroll?', answer: 'No! This course starts from absolute zero and builds up step-by-step with practical lab guidance.' },
      { question: 'Will I get daily hands-on practice on a PC?', answer: 'Yes, every session includes 50% concept explanation and 50% individual computer practice in our lab.' }
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
    fullDescription: 'Become a job-ready accountant with our comprehensive Tally Prime training. Learn voucher entries, GST billing, bank reconciliation, inventory management, TDS, payroll processing, and generating balance sheets according to real Indian business accounting standards.',
    targetAudience: [
      'Commerce graduates (B.Com/M.Com) seeking practical accounting skills',
      'Accountants looking to upgrade to Tally Prime from Tally ERP 9',
      'Business owners managing in-house billing and GST filing',
      'Finance aspirants aiming for accounts executive roles'
    ],
    learningOutcomes: [
      'Create and manage company books, ledger accounts, and voucher types',
      'Handle GST calculation, CGST/SGST/IGST entries, and GSTR-1/3B filing data',
      'Perform bank reconciliation statements (BRS) automatically',
      'Manage inventory stock items, batches, and reorder levels',
      'Generate Profit & Loss statements, Balance Sheets, and audit reports'
    ],
    skillsLearned: ['Tally Prime', 'Voucher Entry', 'GST Filing', 'Bank Reconciliation', 'Inventory Management', 'Payroll & TDS'],
    tools: ['Tally Prime Gold', 'GST Portal Simulator', 'MS Excel'],
    certificationName: 'Certificate in Tally Prime & GST Accounting',
    projects: ['Full Accounting Bookkeeping for a Trading Business', 'GST Returns Reconciliation & Report Generation', 'Company Payroll Setup'],
    modules: [
      { title: 'Module 1: Basic Accounting Principles & Tally Interface', topics: ['Rules of Debit & Credit', 'Golden rules of accounting', 'Company creation & configuration', 'Chart of accounts & Ledgers'] },
      { title: 'Module 2: Voucher Transactions & Inventory', topics: ['Payment, Receipt, Contra, Journal vouchers', 'Purchase & Sales invoice generation', 'Stock items, groups & units of measure', 'Godown & Batch management'] },
      { title: 'Module 3: Goods & Services Tax (GST) in Tally', topics: ['GST concepts & tax slabs', 'CGST, SGST & IGST configuration', 'GST invoice creation with HSN codes', 'E-Way bill & E-Invoicing features'] },
      { title: 'Module 4: Advanced Accounting & Payroll', topics: ['Bank Reconciliation Statement (BRS)', 'TDS computation & voucher entry', 'Payroll & Payhead configuration', 'Interest calculations & budget management'] },
      { title: 'Module 5: Financial Statements & Finalization', topics: ['Trial Balance review', 'Profit & Loss Account setup', 'Balance Sheet analysis', 'Data backup & security management'] }
    ],
    faqs: [
      { question: 'Is GST billing covered in detail?', answer: 'Yes! We cover HSN codes, GST invoicing, input tax credit (ITC) reconciliation, and GSTR report exports.' }
    ]
  },
  {
    slug: 'computer-hardware-troubleshooting',
    title: 'Computer Hardware & Troubleshooting',
    categoryId: 'computer-essentials',
    categoryName: 'Computer Essentials',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    shortDescription: 'Learn computer assembly, motherboard components, OS installation, networking basics, and hardware fault diagnostic skills.',
    fullDescription: 'Gain practical hardware technician skills. Learn how to assemble desktop PCs, troubleshoot boot failures, replace RAM/SSD, configure BIOS/UEFI, install Windows/Linux operating systems, setup Wi-Fi routers, and perform preventive maintenance.',
    targetAudience: ['IT support aspirants', 'Lab technicians', 'Hardware enthusiasts', 'Students seeking technical repair skills'],
    learningOutcomes: ['Identify and test PC internal components', 'Assemble desktop computers safely', 'Diagnose hardware & software boot errors', 'Install operating systems & hardware drivers'],
    skillsLearned: ['PC Assembly', 'BIOS/UEFI Configuration', 'OS Installation', 'Driver Setup', 'Router Configuration', 'Hardware Diagnostics'],
    tools: ['Hardware Toolkit', 'Multimeter', 'Bios Flasher', 'Rufus Bootable Drives'],
    certificationName: 'Certificate in PC Hardware & Networking Maintenance',
    projects: ['Complete PC Build & Benchmarking', 'Multi-OS Dual Booting System Setup', 'Home Network Router Setup'],
    modules: [
      { title: 'Module 1: Computer Hardware Fundamentals', topics: ['Motherboards, CPU sockets & Chipsets', 'RAM types, Storage (HDD/SSD/NVMe)', 'Power Supply Units (SMPS) & GPU', 'Peripherals & connectors'] },
      { title: 'Module 2: Assembly & Maintenance', topics: ['Cabinet cabling & thermal paste application', 'Step-by-step PC assembly', 'BIOS/UEFI settings setup', 'System diagnostics & POST codes'] },
      { title: 'Module 3: OS & Software Installation', topics: ['Windows 11 & Linux ISO creation', 'Partitioning schemes (GPT/MBR)', 'Driver installation & updates', 'Antivirus & system recovery tools'] },
      { title: 'Module 4: Networking & Router Setup', topics: ['LAN cabling (Cat6 RJ45 crimping)', 'IP addresses & Subnetting', 'Wi-Fi router configuration', 'Network troubleshooting commands'] }
    ],
    faqs: [
      { question: 'Do students dismantle and reassemble real PCs?', answer: 'Yes! Our hardware lab has dedicated testing rigs where students perform assembly hands-on.' }
    ]
  },

  // 2. PROGRAMMING
  {
    slug: 'c-programming',
    title: 'C Programming Fundamentals',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Build strong algorithmic thinking and core programming principles using the C language — the foundation of software engineering.',
    fullDescription: 'C is the mother of modern programming languages. This course teaches computer logic, variables, control flow, loops, functions, arrays, pointers, structures, and file handling. Ideal for engineering students, computer science undergraduates, and beginners.',
    targetAudience: ['B.Tech / BCA / BSc Computer Science students', 'School and college beginners', 'Anyone building logic for competitive coding'],
    learningOutcomes: ['Understand variable storage and memory layouts', 'Write modular code using functions and header files', 'Master pointers and dynamic memory management', 'Perform file I/O operations'],
    skillsLearned: ['C Language Syntax', 'Pointers & Memory', 'Control Structures', 'Functions & Recursion', 'File Handling', 'Algorithmic Logic'],
    tools: ['GCC Compiler', 'Dev C++', 'VS Code', 'Code::Blocks'],
    certificationName: 'Certificate in C Programming Language',
    projects: ['Student Grade Management Console App', 'Bank Account System in C', 'Text-based Quiz Game'],
    modules: [
      { title: 'Module 1: Logic & Basic Syntax', topics: ['Algorithm & Flowchart basics', 'Variables, Data types & Operators', 'Input/Output handling (scanf/printf)', 'Compilation process'] },
      { title: 'Module 2: Decision & Loop Control', topics: ['if-else statements & Switch Case', 'for, while, and do-while loops', 'Nested loops & break/continue', 'Logic building exercises'] },
      { title: 'Module 3: Functions & Arrays', topics: ['Function declaration & call by value/reference', 'Recursion & call stack', '1D and 2D Arrays', 'String handling functions'] },
      { title: 'Module 4: Pointers & Structures', topics: ['Pointer arithmetic & memory addresses', 'Pointers with arrays and functions', 'Structures & Unions', 'Dynamic Memory Allocation (malloc, calloc)'] },
      { title: 'Module 5: File Operations', topics: ['Reading and writing text files', 'Binary file operations', 'Command line arguments', 'Error handling in C'] }
    ],
    faqs: [
      { question: 'Is C programming necessary before learning C++ or Java?', answer: 'Learning C first builds an exceptional understanding of how computers execute code and manage memory.' }
    ]
  },
  {
    slug: 'c-plus-plus-programming',
    title: 'C++ & Object-Oriented Programming',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    shortDescription: 'Master Object-Oriented Programming (OOP) concepts, classes, inheritance, polymorphism, templates, and the C++ Standard Template Library (STL).',
    fullDescription: 'C++ combines hardware-level memory management with powerful OOP abstractions. Learn classes, constructors, encapsulation, inheritance, polymorphism, operator overloading, and the Standard Template Library (vector, map, set) essential for software developer interviews.',
    targetAudience: ['Engineering undergraduates', 'Competitive coders', 'Game development & system programming aspirants'],
    learningOutcomes: ['Design robust object-oriented software architectures', 'Utilize C++ STL containers for fast data manipulation', 'Handle exceptions and template programming', 'Write performant code'],
    skillsLearned: ['OOP Concepts', 'Classes & Objects', 'Inheritance & Polymorphism', 'C++ STL', 'Exception Handling', 'Templates'],
    tools: ['GCC / G++', 'VS Code', 'CLion'],
    certificationName: 'Certificate in C++ & Object-Oriented Programming',
    projects: ['Library Management System', 'Casino Number Guessing Game', 'Inventory Tracker with File Storage'],
    modules: [
      { title: 'Module 1: From C to C++', topics: ['C++ Basics & IOStreams', 'References vs Pointers', 'Function Overloading & Default Arguments', 'Inline functions'] },
      { title: 'Module 2: Object-Oriented Programming Basics', topics: ['Classes and Objects', 'Constructors & Destructors', 'Encapsulation & Access Specifiers', 'Static members & Friend functions'] },
      { title: 'Module 3: Advanced OOP Principles', topics: ['Inheritance (Single, Multiple, Multilevel)', 'Polymorphism & Virtual Functions', 'Abstract Classes & Interfaces', 'Operator Overloading'] },
      { title: 'Module 4: Standard Template Library (STL)', topics: ['Vectors, Lists, Deque', 'Maps, Sets & Pair containers', 'Iterators & Algorithms (sort, search)', 'Templates & Exception handling'] }
    ],
    faqs: [
      { question: 'Will STL be covered in detail?', answer: 'Yes, we spend dedicated lab sessions on STL vectors, maps, algorithms, and performance optimization.' }
    ]
  },
  {
    slug: 'java-programming',
    title: 'Java Programming Masterclass',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Intermediate',
    duration: '60 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Learn Core Java, Object-Oriented Design, Multithreading, Exception Handling, Collections Framework, and JDBC database access.',
    fullDescription: 'Java powers millions of enterprise backend systems and Android apps. Master JDK setup, JVM internals, OOP pillars, Exception handling, Collections framework, Lambdas, Streams, Multithreading, and connecting Java applications to MySQL using JDBC.',
    targetAudience: ['BCA/MCA/B.Tech students', 'Job seekers aiming for Enterprise Software roles', 'App developer candidates'],
    learningOutcomes: ['Build enterprise-ready Java applications', 'Manage database connectivity with JDBC', 'Work with Java Collections Framework', 'Write concurrent multithreaded code'],
    skillsLearned: ['Core Java', 'JVM Architecture', 'Java Collections', 'JDBC Database API', 'Multithreading', 'Lambda & Streams'],
    tools: ['JDK 21', 'Eclipse IDE / IntelliJ IDEA', 'MySQL Workbench'],
    certificationName: 'Certificate in Core Java Development',
    projects: ['ATM Simulator with MySQL Database', 'Online Quiz Engine', 'Employee Management Console App'],
    modules: [
      { title: 'Module 1: Java Foundations & JVM', topics: ['JDK vs JRE vs JVM', 'Java Syntax, Data Types & Branching', 'Arrays & Strings in Java', 'Garbage collection basics'] },
      { title: 'Module 2: OOP & Package Design', topics: ['Class design & Inheritance', 'Abstract classes & Interfaces', 'Packages & Access Modifiers', 'Polymorphism & Overriding'] },
      { title: 'Module 3: Collections & Generics', topics: ['List, Set, Map interfaces', 'ArrayList, LinkedList, HashMap', 'Generics & Iterators', 'Sorting with Comparable & Comparator'] },
      { title: 'Module 4: Exceptions, Threads & Files', topics: ['Try-catch-finally block', 'Custom Exceptions', 'Multithreading & Synchronization', 'Java I/O Streams'] },
      { title: 'Module 5: JDBC Database Integration', topics: ['Connecting Java to MySQL', 'PreparedStatement & Statement', 'CRUD operations with database', 'Building a complete mini-project'] }
    ],
    faqs: [
      { question: 'Does this course cover JDBC database connections?', answer: 'Yes! You will connect your Java app to a real MySQL database and perform live CRUD operations.' }
    ]
  },
  {
    slug: 'python-programming',
    title: 'Python Programming',
    categoryId: 'programming',
    categoryName: 'Programming',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Build strong programming fundamentals and learn Python through practical exercises, automation scripts, and projects.',
    fullDescription: 'Python is the world\'s most popular language for beginners, web developers, data analysts, and AI enthusiasts. Learn clean Pythonic syntax, data structures, OOP, module imports, web scraping, and file automation with hands-on computer lab sessions.',
    targetAudience: ['Beginners with no prior coding experience', 'Data & AI aspirants', 'Automation & web development learners'],
    learningOutcomes: ['Write clean, efficient Python scripts', 'Manipulate lists, dictionaries, tuples, and sets', 'Automate daily file and web tasks', 'Understand OOP in Python'],
    skillsLearned: ['Python 3 Syntax', 'Data Structures', 'OOP in Python', 'File Automation', 'Modules & Packages', 'Exception Handling'],
    tools: ['Python 3.12', 'VS Code', 'Jupyter Notebook', 'PyCharm'],
    certificationName: 'Certificate in Python Programming',
    projects: ['Automatic File Organizer Script', 'Weather Report API Fetcher', 'Interactive Student Records App'],
    modules: [
      { title: 'Module 1: Programming Fundamentals & Python Basics', topics: ['Installing Python & IDE setup', 'Variables, Data Types & Dynamic Typing', 'User Input & Math operations', 'Formated string output'] },
      { title: 'Module 2: Conditions & Loops', topics: ['if, elif, else logic', 'while & for loops', 'range() and enumerate()', 'Break, continue & pass statements'] },
      { title: 'Module 3: Python Data Structures', topics: ['Lists & List Comprehensions', 'Tuples & Sets', 'Dictionaries & nested Data', 'String slicing & methods'] },
      { title: 'Module 4: Functions & Modules', topics: ['Defining functions & parameters', '*args and **kwargs', 'Lambda functions & Built-ins', 'Creating & Importing Modules'] },
      { title: 'Module 5: OOP & File Handling', topics: ['Classes, __init__, and self', 'Inheritance & Magic methods', 'Reading/Writing TXT, CSV, JSON files', 'Try-Except error handling'] }
    ],
    faqs: [
      { question: 'Is Python suitable for a beginner?', answer: 'Absolutely! Python features simple syntax that reads like English, making it perfect for your first programming language.' }
    ]
  },

  // 3. WEB DEVELOPMENT
  {
    slug: 'html-css-fundamentals',
    title: 'HTML5 & CSS3 Web Fundamentals',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Beginner',
    duration: '30 Days',
    mode: 'Practical Lab',
    shortDescription: 'Build modern, responsive, visually stunning website layouts using semantic HTML5, CSS Flexbox, Grid, and mobile-first design principles.',
    fullDescription: 'Start your web journey by crafting real web pages. Master semantic elements, CSS styling, responsive media queries, Flexbox layouts, CSS Grid systems, hover effects, CSS animations, and publishing websites live on GitHub Pages.',
    targetAudience: ['Web design beginners', 'UI aspirants', 'BCA/B.Tech students', 'Digital marketing professionals'],
    learningOutcomes: ['Create semantic, accessible web pages', 'Build responsive layouts for mobile and desktop', 'Master Flexbox and CSS Grid', 'Publish websites live online'],
    skillsLearned: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Web Forms', 'CSS Animations'],
    tools: ['VS Code', 'Chrome Developer Tools', 'GitHub Pages', 'Figma Viewer'],
    certificationName: 'Certificate in Responsive Web Design',
    projects: ['Personal Portfolio Website', 'Restaurant Landing Page', 'Product Pricing Table Layout'],
    modules: [
      { title: 'Module 1: Semantic HTML5 Structure', topics: ['HTML Document Skeleton & Tags', 'Headings, Paragraphs, Links, Images', 'Tables & HTML5 Web Forms', 'Semantic tags (header, nav, section, footer)'] },
      { title: 'Module 2: CSS3 Styling & Colors', topics: ['Selectors, Specificity & Box Model', 'Colors, Gradients & Typography', 'Backgrounds, Borders & Shadows', 'Transitions & Hover Effects'] },
      { title: 'Module 3: Responsive Layouts with Flexbox & Grid', topics: ['Flexbox container & item properties', 'CSS Grid template areas', 'Media queries for mobile-first design', 'Building responsive navbars'] },
      { title: 'Module 4: Web Deployment', topics: ['Git basics & GitHub repository', 'Deploying to GitHub Pages & Vercel', 'Cross-browser testing', 'Web accessibility basics'] }
    ],
    faqs: [
      { question: 'Will my projects be mobile responsive?', answer: 'Yes! Mobile-first responsive layout design is taught as a core rule in every module.' }
    ]
  },
  {
    slug: 'javascript-programming',
    title: 'JavaScript Modern ES6+',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Intermediate',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Master the programming language of the web — JavaScript DOM manipulation, ES6+ syntax, Async/Await, APIs, and event handling.',
    fullDescription: 'JavaScript brings web pages to life. Master variables, functions, arrow syntax, array methods (map, filter, reduce), DOM manipulation, Event listeners, Fetch API, Promises, Async/Await, and JSON data processing.',
    targetAudience: ['HTML/CSS developers expanding into programming', 'Frontend developer candidates', 'Full-stack aspirants'],
    learningOutcomes: ['Manipulate web pages dynamically using the DOM', 'Fetch data from REST APIs asynchronously', 'Write modern ES6+ JavaScript code', 'Build interactive web applications'],
    skillsLearned: ['DOM Manipulation', 'ES6+ Syntax', 'Async JavaScript', 'Fetch API', 'Event Handling', 'Local Storage'],
    tools: ['VS Code', 'Chrome DevTools Console', 'Postman'],
    certificationName: 'Certificate in JavaScript Web Development',
    projects: ['Interactive Weather App using REST API', 'Task Manager / Todo App with LocalStorage', 'Interactive Quiz Application'],
    modules: [
      { title: 'Module 1: JavaScript Foundations', topics: ['Variables (let/const), Data types', 'Operators, Conditionals & Loops', 'Functions & Arrow Functions', 'Scope & Hoisting'] },
      { title: 'Module 2: DOM Manipulation & Events', topics: ['Selecting DOM elements', 'Changing text, attributes & styles', 'Event Listeners (click, submit, keydown)', 'Form validation with JS'] },
      { title: 'Module 3: Advanced ES6+ Features', topics: ['Destructuring & Spread/Rest operators', 'Array methods (map, filter, reduce, find)', 'Template Literals & Modules', 'Classes & LocalStorage'] },
      { title: 'Module 4: Asynchronous JavaScript & APIs', topics: ['Callback functions & Event Loop', 'Promises & Promise chaining', 'Async / Await syntax', 'Fetching data from Public APIs'] }
    ],
    faqs: [
      { question: 'Is JavaScript required before learning React?', answer: 'Yes, having a strong command of JS objects, arrays, and promises makes learning React smooth and fast.' }
    ]
  },
  {
    slug: 'react-frontend-development',
    title: 'React Frontend Development',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Intermediate',
    duration: '45 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Build modern, component-driven single-page applications (SPAs) with React, Hooks, Router, State Management, and Tailwind CSS.',
    fullDescription: 'React is the world\'s leading UI framework. Learn JSX, functional components, props, state management with useState and useEffect hooks, React Router for navigation, form handling, API integration, and styling with Tailwind CSS.',
    targetAudience: ['Frontend developers upgrading skills', 'Web designers moving to SPA development', 'Computer science students'],
    learningOutcomes: ['Build reactive Single Page Applications (SPAs)', 'Manage application state efficiently', 'Implement client-side routing with React Router', 'Connect React UI to backend REST APIs'],
    skillsLearned: ['React 19', 'JSX Syntax', 'React Hooks', 'React Router', 'Tailwind CSS', 'State Management', 'Vite Build Tool'],
    tools: ['React', 'Vite', 'VS Code', 'Tailwind CSS', 'NPM'],
    certificationName: 'Certificate in React Frontend Development',
    projects: ['E-Commerce Shopping Cart App', 'Movie Search Engine with OMDb API', 'SaaS Dashboard UI'],
    modules: [
      { title: 'Module 1: React Fundamentals & JSX', topics: ['Vite project setup', 'JSX Syntax & Component Architecture', 'Props & Composition', 'Rendering lists & conditional UI'] },
      { title: 'Module 2: React Hooks & State', topics: ['useState for interactive UI', 'useEffect for side-effects & API calls', 'Custom Hooks creation', 'Handling forms & controlled inputs'] },
      { title: 'Module 3: Navigation & Styling', topics: ['React Router v7 setup & dynamic routes', 'Tailwind CSS integration', 'Framer Motion animations basics', 'Responsive layouts'] },
      { title: 'Module 4: State Management & Deployment', topics: ['Context API for global state', 'API Data Fetching patterns', 'Production build & Vercel deployment'] }
    ],
    faqs: [
      { question: 'Will we use modern functional components and hooks?', answer: 'Yes! 100% of our React curriculum uses modern functional components, standard hooks, and Vite.' }
    ]
  },
  {
    slug: 'full-stack-web-development',
    title: 'Full Stack Web Development',
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Advanced',
    duration: '90 Days',
    mode: 'Hybrid',
    isPopular: true,
    shortDescription: 'Become a complete web developer mastering React frontend, Node.js & Express backend, MongoDB/SQL database, and cloud deployment.',
    fullDescription: 'A comprehensive boot-camp style course designed to make you a production-ready Full Stack Web Developer. Learn frontend UI creation, RESTful API design in Node.js, Express server setup, database modeling in MongoDB & SQL, authentication (JWT), and cloud hosting.',
    targetAudience: ['Aspiring software engineers', 'Final year students preparing for campus placements', 'Career switchers wanting high-growth tech roles'],
    learningOutcomes: ['Design full stack architecture from database to UI', 'Build secure RESTful APIs with Node & Express', 'Implement user authentication with JWT', 'Deploy apps live on cloud platforms'],
    skillsLearned: ['Frontend (React)', 'Backend (Node.js/Express)', 'Database (MongoDB/MySQL)', 'REST APIs', 'JWT Auth', 'Git & CI/CD'],
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Postman', 'Git', 'Vercel / Render'],
    certificationName: 'Certificate in Full Stack Web Development',
    projects: ['Full Stack E-Commerce Platform', 'Student Course Portal', 'Real-time Chat & Note App'],
    modules: [
      { title: 'Module 1: Frontend Mastery (HTML, CSS, React)', topics: ['Responsive web UI', 'React component architecture', 'State management & routing', 'Tailwind styling'] },
      { title: 'Module 2: Node.js & Express Backend', topics: ['Node.js runtime & event loop', 'Express server setup & routing', 'Middleware functions', 'RESTful API architecture'] },
      { title: 'Module 3: Database & Authentication', topics: ['MongoDB & Mongoose ORM', 'SQL Relational queries', 'User registration & Password hashing (Bcrypt)', 'JWT token authentication'] },
      { title: 'Module 4: Full Stack Integration & Deployment', topics: ['Connecting React to Express API', 'File upload with Cloudinary', 'Environment variables & security', 'Deploying on Vercel & Render'] }
    ],
    faqs: [
      { question: 'Will I receive placement guidance upon completion?', answer: 'Yes! Full Stack students receive resume reviews, mock interviews, and portfolio review sessions.' }
    ]
  },

  // 4. DATABASE
  {
    slug: 'sql-relational-databases',
    title: 'SQL & Relational Databases',
    categoryId: 'database',
    categoryName: 'Database',
    level: 'Beginner',
    duration: '30 Days',
    mode: 'Practical Lab',
    shortDescription: 'Learn SQL querying, database design, normalization, JOINS, subqueries, indexing, and data manipulation skills.',
    fullDescription: 'Data powers modern applications. Learn ANSI SQL from scratch, including database creation, DDL/DML statements, complex JOINs, group functions, nested subqueries, views, indexes, and database normalization (1NF, 2NF, 3NF).',
    targetAudience: ['Data analyst aspirants', 'Software developers', 'BCA/MCA students', 'Business intelligence learners'],
    learningOutcomes: ['Write complex SQL queries with confidence', 'Design relational tables with primary/foreign keys', 'Combine datasets using INNER, LEFT, RIGHT JOINs', 'Optimize queries using indexes'],
    skillsLearned: ['SQL Queries', 'Relational Database Design', 'Table JOINs', 'Subqueries & Aggregations', 'Normalization', 'Data Manipulation'],
    tools: ['MySQL Workbench', 'DB Fiddle', 'PostgreSQL Admin'],
    certificationName: 'Certificate in Database Querying & SQL',
    projects: ['Retail Store Database Design', 'Sales Reporting Query Suite', 'Student Examination Database'],
    modules: [
      { title: 'Module 1: Introduction to SQL & DDL', topics: ['Database concepts & RDBMS', 'CREATE, ALTER, DROP statements', 'Data Types & Constraints (PRIMARY KEY, FOREIGN KEY)', 'Inserting data'] },
      { title: 'Module 2: Data Querying & Filtering', topics: ['SELECT, WHERE, LIKE, IN, BETWEEN', 'ORDER BY & LIMIT', 'Aggregate Functions (SUM, AVG, COUNT, MIN, MAX)', 'GROUP BY & HAVING clauses'] },
      { title: 'Module 3: Multi-Table JOINS & Subqueries', topics: ['INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN', 'Self JOIN & Cross JOIN', 'Subqueries in WHERE and FROM clauses', 'Correlated subqueries'] },
      { title: 'Module 4: Database Views, Indexes & Transactions', topics: ['Creating & updating Views', 'Indexes for query performance', 'ACID properties & Transactions (COMMIT/ROLLBACK)'] }
    ],
    faqs: [
      { question: 'Is SQL useful for non-programmers?', answer: 'Yes! SQL is extensively used by data analysts, business intelligence experts, and product managers.' }
    ]
  },

  // 5. DATA & AI
  {
    slug: 'advanced-excel-financial-modeling',
    title: 'Advanced Excel & Business Analytics',
    categoryId: 'data-ai',
    categoryName: 'Data & AI',
    level: 'Intermediate',
    duration: '30 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Master Advanced Excel formulas, Pivot Tables, XLOOKUP, Dashboards, Power Query, and automated business reporting.',
    fullDescription: 'Excel remains the world\'s most essential data tool. Master advanced lookup functions (XLOOKUP, INDEX-MATCH), dynamic arrays, Pivot Tables, slicers, data validation, conditional formatting, Power Query data cleaning, and executive dashboard design.',
    targetAudience: ['Finance & Accounting executives', 'Business Analysts', 'MIS Coordinators', 'Office Administrators'],
    learningOutcomes: ['Clean and transform dirty data using Power Query', 'Build interactive executive KPI dashboards', 'Master XLOOKUP, INDEX-MATCH, and nested IF formulas', 'Automate recurring monthly reports'],
    skillsLearned: ['Advanced Formulas', 'XLOOKUP / INDEX-MATCH', 'Pivot Tables & Slicers', 'Power Query', 'Interactive Dashboards', 'Data Validation'],
    tools: ['Microsoft Excel 365'],
    certificationName: 'Certificate in Advanced Excel & Business Analytics',
    projects: ['Interactive Corporate Sales KPI Dashboard', 'Automated Inventory & Stock Tracker', 'Financial Forecasting Sheet'],
    modules: [
      { title: 'Module 1: Advanced Excel Formulas', topics: ['XLOOKUP, VLOOKUP, HLOOKUP, INDEX-MATCH', 'SUMIFS, COUNTIFS, AVERAGEIFS', 'Text functions (CONCAT, TEXTJOIN, MID, SEARCH)', 'Date & Time logic'] },
      { title: 'Module 2: Pivot Tables & Data Analysis', topics: ['Creating Pivot Tables & Pivot Charts', 'Calculated Fields & Items', 'Slicers & Timelines for interactive filtering', 'Conditional Formatting tricks'] },
      { title: 'Module 3: Power Query & Data Cleaning', topics: ['Importing data from CSV/Web/Excel', 'Unpivoting & cleaning messy rows', 'Merging & Appending queries', 'Data transformation workflows'] },
      { title: 'Module 4: Executive Dashboard Design', topics: ['Form Controls & Dynamic Charts', 'KPI Card creation', 'Protecting worksheets & sharing reports', 'Final Capstone Project'] }
    ],
    faqs: [
      { question: 'Does this cover Power Query?', answer: 'Yes! Power Query is fully integrated into the module for automated data cleaning and transformations.' }
    ]
  },
  {
    slug: 'data-analytics-power-bi',
    title: 'Data Analytics with Power BI & SQL',
    categoryId: 'data-ai',
    categoryName: 'Data & AI',
    level: 'Intermediate',
    duration: '60 Days',
    mode: 'Practical Lab',
    isPopular: true,
    shortDescription: 'Transform raw data into business intelligence dashboards using Power BI Desktop, DAX formulas, SQL queries, and data visualization.',
    fullDescription: 'Become a certified Data Analyst. Learn to connect diverse data sources in Power BI, transform data with Power Query, write DAX (Data Analysis Expressions) formulas, build interactive charts & maps, and publish reports for business decision-making.',
    targetAudience: ['Data Analyst job seekers', 'MIS Executives', 'Business Analysts', 'Graduates aiming for tech roles'],
    learningOutcomes: ['Create interactive Power BI dashboards from scratch', 'Write DAX formulas for measure and calculated columns', 'Connect Power BI directly to SQL databases', 'Communicate data insights visually'],
    skillsLearned: ['Power BI Desktop', 'DAX Language', 'Data Modeling', 'SQL Integration', 'Data Visualization', 'Storytelling with Data'],
    tools: ['Power BI Desktop', 'SQL Server / MySQL', 'MS Excel'],
    certificationName: 'Certificate in Data Analytics & Power BI',
    projects: ['HR Analytics Dashboard', 'Retail Sales & Profitability Report', 'Healthcare Performance Tracking System'],
    modules: [
      { title: 'Module 1: Data Analytics & SQL Prerequisites', topics: ['Data Analytics lifecycle', 'SQL Querying for analysts', 'Data extraction & filtering', 'Data types & schema models'] },
      { title: 'Module 2: Power BI Foundations & Power Query', topics: ['Connecting to Excel, SQL & Web', 'Transforming data in Power Query Editor', 'Star schema data modeling', 'Managing relationships'] },
      { title: 'Module 3: DAX Formulas (Data Analysis Expressions)', topics: ['Calculated Columns vs Measures', 'CALCULATE, ALL, FILTER functions', 'Time Intelligence DAX (YTD, QTD, SamePeriodLastYear)', 'DAX variables'] },
      { title: 'Module 4: Visualizations & Dashboard Publishing', topics: ['Bar, Line, Donut & Waterfall charts', 'Card visuals & Custom visuals', 'Bookmarks, Drill-through & Tooltips', 'Publishing to Power BI Service'] }
    ],
    faqs: [
      { question: 'Will I build real portfolio dashboards?', answer: 'Yes! You will construct 3 complete industry-standard dashboards to showcase on your resume.' }
    ]
  },

  // 6. CREATIVE & DESIGN
  {
    slug: 'graphic-design-photoshop-canva',
    title: 'Graphic Design & Photoshop Masterclass',
    categoryId: 'creative-design',
    categoryName: 'Creative & Design',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    shortDescription: 'Learn Adobe Photoshop visual editing, design theory, social media creatives, banner graphics, poster design, and branding.',
    fullDescription: 'Unlock your creative potential. Learn design fundamentals (color theory, typography, alignment), Adobe Photoshop tools, photo retouching, background removal, layer masks, vector artwork in Canva, poster design, and branding collateral creation.',
    targetAudience: ['Aspiring graphic designers', 'Social media managers', 'Freelancers & content creators', 'Students interested in visual arts'],
    learningOutcomes: ['Design stunning social media banners & posters', 'Perform professional photo retouching and color correction', 'Master layers, masks, and selection tools in Photoshop', 'Build visual brand identities'],
    skillsLearned: ['Adobe Photoshop', 'Canva Pro', 'Typography', 'Color Theory', 'Photo Retouching', 'Social Media Graphics'],
    tools: ['Adobe Photoshop 2024', 'Canva', 'Unsplash / Freepik'],
    certificationName: 'Certificate in Graphic Design & Digital Art',
    projects: ['Brand Identity Package (Logo, Card, Poster)', 'Product Social Media Ad Campaign', 'Magazine Cover Layout'],
    modules: [
      { title: 'Module 1: Design Fundamentals & Typography', topics: ['Principles of visual design', 'Color theory & palette selection', 'Typography & font pairing', 'Layout grid & hierarchy'] },
      { title: 'Module 2: Adobe Photoshop Core Tools', topics: ['Interface setup & workspace', 'Selection tools (Pen tool, Lasso, Quick select)', 'Layers, Layer masks & Clipping masks', 'Blending modes'] },
      { title: 'Module 3: Photo Editing & Color Grading', topics: ['Background removal & cutout techniques', 'Color correction & adjustment layers', 'Skin retouching & healing brush', 'Filter gallery effects'] },
      { title: 'Module 4: Social Media & Print Graphics', topics: ['Designing Instagram posts & banners', 'Business card & flyer design', 'Exporting for Web vs CMYK Print', 'Canva speed workflows'] }
    ],
    faqs: [
      { question: 'Do I need artistic drawing skills to join?', answer: 'No drawing skills required! You will learn digital tool operation, visual balance, and design layout rules.' }
    ]
  },

  // 7. KIDS TECHNOLOGY
  {
    slug: 'scratch-programming-kids',
    title: 'Scratch Coding & Animation for Kids',
    categoryId: 'kids-technology',
    categoryName: 'Kids Technology',
    level: 'Beginner',
    duration: '30 Days',
    mode: 'Practical Lab',
    shortDescription: 'Fun, interactive block coding course for school students to build logic, interactive stories, animations, and 2D games.',
    fullDescription: 'Designed specifically for school students (Ages 8-14). Kids learn computational logic by dragging and snapping visual code blocks in MIT Scratch to create animated stories, musical projects, and interactive video games.',
    targetAudience: ['School students (Ages 8 to 14)', 'Kids curious about gaming and computers', 'Young learners building logic'],
    learningOutcomes: ['Understand computer sequencing, loops, and conditions', 'Design interactive 2D games', 'Develop problem-solving confidence', 'Create animated digital stories'],
    skillsLearned: ['Block Coding', 'Computational Logic', 'Game Design Basics', 'Animation Principles', 'Problem Solving'],
    tools: ['MIT Scratch 3.0', 'Scratch Online Studio'],
    certificationName: 'Certificate in Young Coder - Scratch Programming',
    projects: ['Interactive Maze Runner Game', 'Animated Storybook with Sound Effects', 'Catching the Falling Apples Game'],
    modules: [
      { title: 'Module 1: Welcome to Scratch World', topics: ['Scratch interface, Sprites & Backdrops', 'Motion & Sound blocks', 'Animating your first sprite', 'Creating speech bubbles'] },
      { title: 'Module 2: Control Logic & Events', topics: ['Event triggers (Key presses & clicks)', 'Loops (Forever & Repeat)', 'If-Then decisions', 'Collision detection'] },
      { title: 'Module 3: Building Interactive Games', topics: ['Variables for score & lives', 'Creating enemies & obstacles', 'Adding sound effects & victory screens', 'Game polish & testing'] }
    ],
    faqs: [
      { question: 'Is Scratch easy for an 8-year-old?', answer: 'Yes! Scratch uses colorful visual blocks with zero complex typing, making it intuitive and fun.' }
    ]
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return COURSES_DATA.find((c) => c.slug === slug);
};

export const getCoursesByCategory = (categoryId: string): Course[] => {
  if (categoryId === 'all') return COURSES_DATA;
  return COURSES_DATA.filter((c) => c.categoryId === categoryId);
};
