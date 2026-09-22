export interface StudentProject {
  id: string;
  title: string;
  category: string;
  skillsUsed: string[];
  shortDescription: string;
  features: string[];
  courseOrigin: string;
  badgeColor: string;
}

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'proj-1',
    title: 'Student Management System',
    category: 'Programming & Database',
    skillsUsed: ['Java', 'MySQL', 'JDBC', 'OOP'],
    shortDescription: 'A database-driven application to store student records, calculate marks, issue course enrolment receipts, and manage lab attendance.',
    features: ['CRUD operations on MySQL DB', 'Fee billing receipt generator', 'Grade calculation engine', 'Search by roll number'],
    courseOrigin: 'Java Programming Masterclass',
    badgeColor: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'proj-2',
    title: 'Modern E-Commerce Website',
    category: 'Web Development',
    skillsUsed: ['React', 'Tailwind CSS', 'JavaScript ES6', 'Vite'],
    shortDescription: 'Responsive single page shopping portal featuring product search, category filtering, cart management, checkout forms, and order summary.',
    features: ['Dynamic cart drawer', 'Price filter & search bar', 'Responsive mobile layout', 'Localstorage state saving'],
    courseOrigin: 'React Frontend Development',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'proj-3',
    title: 'Retail Billing & Inventory App',
    category: 'Computer Essentials',
    skillsUsed: ['Tally Prime', 'GST Accounting', 'MS Excel'],
    shortDescription: 'Complete bookkeeping, stock item management, GST tax invoice printing, and daily cash flow statements for a retail trading store.',
    features: ['GST HSN tax calculation', 'Stock reorder alert sheet', 'Monthly P&L summary', 'Print-ready GST invoice'],
    courseOrigin: 'Tally Prime & GST Accounting',
    badgeColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'proj-4',
    title: 'Executive Sales Analytics Dashboard',
    category: 'Data & AI',
    skillsUsed: ['Power BI', 'DAX', 'Power Query', 'SQL'],
    shortDescription: 'An interactive executive reporting dashboard delivering sales insights, region-wise profit tracking, and product performance KPIs.',
    features: ['Interactive slicers & timelines', 'DAX YTD growth measures', 'Geographic sales heat map', 'Drill-through category details'],
    courseOrigin: 'Data Analytics with Power BI & SQL',
    badgeColor: 'bg-indigo-100 text-indigo-800'
  },
  {
    id: 'proj-5',
    title: 'Developer Personal Portfolio',
    category: 'Web Development',
    skillsUsed: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages'],
    shortDescription: 'Clean, modern portfolio layout displaying project showcases, technical skills, contact form, and smooth scroll animations.',
    features: ['Semantic HTML5 structure', 'Flexbox & CSS Grid design', 'Mobile menu toggle', 'Live GitHub Pages deployment'],
    courseOrigin: 'HTML5 & CSS3 Fundamentals',
    badgeColor: 'bg-pink-100 text-pink-800'
  },
  {
    id: 'proj-6',
    title: 'Library Book Circulation System',
    category: 'Programming',
    skillsUsed: ['C++', 'OOP', 'File Handling', 'STL'],
    shortDescription: 'Console application managing library catalog, book issuing, fine calculation, borrower history, and data persistence via file handling.',
    features: ['Binary file data storage', 'Book issue/return transaction logic', 'Overdue fine calculation', 'Search by ISBN or Title'],
    courseOrigin: 'C++ & Object-Oriented Programming',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
];
