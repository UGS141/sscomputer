export interface Trainer {
  id: string;
  name: string;
  designation: string;
  specialization: string[];
  experience: string;
  bio: string;
  avatarText: string;
  gradient: string;
}

export const FACULTY_TRAINERS: Trainer[] = [
  {
    id: 'tr-1',
    name: 'P. Rajesh Varma',
    designation: 'Lead Programming Trainer',
    specialization: ['C / C++', 'Java', 'Python', 'Data Structures & Algorithms'],
    experience: '8+ Years Exp',
    bio: 'Passionate computer science educator specializing in software algorithms, Object-Oriented design, and building core logic for college undergraduates.',
    avatarText: 'RV',
    gradient: 'from-teal-600 to-emerald-600'
  },
  {
    id: 'tr-2',
    name: 'M. Anand Kumar',
    designation: 'Web Development Trainer',
    specialization: ['React.js', 'JavaScript ES6+', 'Node.js', 'HTML5 / CSS3 / Tailwind'],
    experience: '6+ Years Exp',
    bio: 'Experienced full stack developer dedicated to mentoring students in modern frontend UI engineering, responsive design, and RESTful API backend design.',
    avatarText: 'AK',
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    id: 'tr-3',
    name: 'K. Srinivasa Rao',
    designation: 'Data Analytics & Office Applications Trainer',
    specialization: ['Advanced Excel', 'Power BI', 'MS Office Automation', 'Power Query'],
    experience: '10+ Years Exp',
    bio: 'Corporate computer skills mentor with expertise in data visualization, executive reporting, financial spreadsheet modeling, and office automation.',
    avatarText: 'SR',
    gradient: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'tr-4',
    name: 'S. Lakshmi Narayana',
    designation: 'Accounting & Tally Prime Specialist',
    specialization: ['Tally Prime Gold', 'GST Compliance', 'e-Invoicing', 'Financial Accounting'],
    experience: '9+ Years Exp',
    bio: 'Senior accounting professional training students in practical bookkeeping, GST filing rules, payroll entry, and business voucher management.',
    avatarText: 'LN',
    gradient: 'from-indigo-600 to-teal-600'
  }
];
