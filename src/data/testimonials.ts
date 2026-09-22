export interface Testimonial {
  id: string;
  name: string;
  course: string;
  role: string;
  quote: string;
  rating: number;
  avatarText: string;
  batchYear: string;
}

export const STUDENT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'K. Sai Teja',
    course: 'Python Programming',
    role: 'B.Tech Student',
    quote: 'SSCI helped me understand programming from the basics. The practical sessions made learning much easier, and the faculty explained logic with step-by-step examples.',
    rating: 5,
    avatarText: 'ST',
    batchYear: '2026 Batch'
  },
  {
    id: 'test-2',
    name: 'V. Ramya Sree',
    course: 'Tally Prime & GST Accounting',
    role: 'Accounts Assistant',
    quote: 'The Tally Prime training at SSCI gave me exact knowledge of GST invoicing, ledger creation, and bank reconciliation. I gained confidence for my accounting interview!',
    rating: 5,
    avatarText: 'RS',
    batchYear: '2026 Batch'
  },
  {
    id: 'test-3',
    name: 'M. Tarun Kumar',
    course: 'Full Stack Web Development',
    role: 'Junior Web Developer',
    quote: 'Learning React and Node.js with lab guidance made a huge difference. Building real projects helped me assemble a great portfolio.',
    rating: 5,
    avatarText: 'TK',
    batchYear: '2025 Batch'
  },
  {
    id: 'test-4',
    name: 'P. Bhavana',
    course: 'MS Office & Computer Fundamentals',
    role: 'College Student',
    quote: 'I started with zero computer knowledge. The trainers at SSCI were very patient, explaining Word formatting, Excel formulas, and PowerPoint slides with individual lab time.',
    rating: 5,
    avatarText: 'PB',
    batchYear: '2026 Batch'
  },
  {
    id: 'test-5',
    name: 'D. Naga Raju',
    course: 'Data Analytics & Power BI',
    role: 'MIS Executive',
    quote: 'The Power BI and Advanced Excel course upgraded my career. Creating interactive dashboards with DAX measures was taught in a very practical manner.',
    rating: 5,
    avatarText: 'NR',
    batchYear: '2026 Batch'
  },
  {
    id: 'test-6',
    name: 'G. Harish',
    course: 'Java Programming Masterclass',
    role: 'MCA Graduate',
    quote: 'Great learning environment! The Java OOP concepts, JDBC database integration, and collection frameworks were explained thoroughly with hands-on coding practice.',
    rating: 5,
    avatarText: 'GH',
    batchYear: '2025 Batch'
  }
];
