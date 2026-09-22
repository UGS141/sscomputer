export interface Batch {
  id: string;
  courseSlug: string;
  courseName: string;
  category: string;
  level: string;
  duration: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Weekend';
  timeRange: string;
  startDate: string;
  mode: 'Classroom' | 'Practical Lab';
  totalSeats: number;
  filledSeats: number;
  status: 'Starting Soon' | 'Open' | 'Few Seats Left' | 'Filling Fast';
  trainerName: string;
}

export const UPCOMING_BATCHES: Batch[] = [
  {
    id: 'batch-msoffice-01',
    courseSlug: 'ms-office-computer-fundamentals',
    courseName: 'MS Office & Computer Fundamentals',
    category: 'Computer Essentials',
    level: 'Beginner',
    duration: '45 Days',
    timing: 'Morning',
    timeRange: '08:00 AM – 10:00 AM',
    startDate: 'October 2, 2026',
    mode: 'Practical Lab',
    totalSeats: 15,
    filledSeats: 12,
    status: 'Few Seats Left',
    trainerName: 'K. Srinivasa Rao'
  },
  {
    id: 'batch-python-01',
    courseSlug: 'python-programming',
    courseName: 'Python Programming',
    category: 'Programming',
    level: 'Beginner',
    duration: '45 Days',
    timing: 'Morning',
    timeRange: '10:00 AM – 12:00 PM',
    startDate: 'October 5, 2026',
    mode: 'Practical Lab',
    totalSeats: 16,
    filledSeats: 10,
    status: 'Starting Soon',
    trainerName: 'P. Rajesh Varma'
  },
  {
    id: 'batch-tally-01',
    courseSlug: 'tally-prime-gst-accounting',
    courseName: 'Tally Prime & GST Accounting',
    category: 'Computer Essentials',
    level: 'Beginner',
    duration: '60 Days',
    timing: 'Afternoon',
    timeRange: '02:00 PM – 04:00 PM',
    startDate: 'October 6, 2026',
    mode: 'Practical Lab',
    totalSeats: 14,
    filledSeats: 8,
    status: 'Open',
    trainerName: 'S. Lakshmi Narayana'
  },
  {
    id: 'batch-web-01',
    courseSlug: 'react-frontend-development',
    courseName: 'React Frontend Development',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '45 Days',
    timing: 'Evening',
    timeRange: '05:00 PM – 07:00 PM',
    startDate: 'October 8, 2026',
    mode: 'Practical Lab',
    totalSeats: 12,
    filledSeats: 10,
    status: 'Filling Fast',
    trainerName: 'M. Anand Kumar'
  },
  {
    id: 'batch-excel-01',
    courseSlug: 'advanced-excel-financial-modeling',
    courseName: 'Advanced Excel & Business Analytics',
    category: 'Data & AI',
    level: 'Intermediate',
    duration: '30 Days',
    timing: 'Evening',
    timeRange: '07:00 PM – 08:30 PM',
    startDate: 'October 10, 2026',
    mode: 'Practical Lab',
    totalSeats: 15,
    filledSeats: 6,
    status: 'Open',
    trainerName: 'K. Srinivasa Rao'
  },
  {
    id: 'batch-java-01',
    courseSlug: 'java-programming',
    courseName: 'Java Programming Masterclass',
    category: 'Programming',
    level: 'Intermediate',
    duration: '60 Days',
    timing: 'Weekend',
    timeRange: '09:00 AM – 01:00 PM (Sat/Sun)',
    startDate: 'October 11, 2026',
    mode: 'Practical Lab',
    totalSeats: 18,
    filledSeats: 15,
    status: 'Few Seats Left',
    trainerName: 'P. Rajesh Varma'
  },
  {
    id: 'batch-fullstack-01',
    courseSlug: 'full-stack-web-development',
    courseName: 'Full Stack Web Development',
    category: 'Web Development',
    level: 'Advanced',
    duration: '90 Days',
    timing: 'Morning',
    timeRange: '09:00 AM – 12:00 PM',
    startDate: 'October 15, 2026',
    mode: 'Practical Lab',
    totalSeats: 12,
    filledSeats: 7,
    status: 'Starting Soon',
    trainerName: 'M. Anand Kumar'
  }
];
