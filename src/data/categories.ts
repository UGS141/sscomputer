export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  badgeColor: string;
  courseCount: number;
}

export const COURSE_CATEGORIES: Category[] = [
  {
    id: 'computer-essentials',
    name: 'Computer Essentials',
    slug: 'computer-essentials',
    description: 'Master essential computer fundamentals, MS Office tools, Tally Prime accounting, hardware, and digital productivity skills.',
    iconName: 'Monitor',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    courseCount: 4,
  },
  {
    id: 'programming',
    name: 'Programming',
    slug: 'programming',
    description: 'Build robust logic and coding foundations with C, C++, Java, Python, and Data Structures & Algorithms.',
    iconName: 'Code',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    courseCount: 5,
  },
  {
    id: 'web-development',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Learn modern full-stack web development with HTML, CSS, JavaScript, React, Node.js, and deployment.',
    iconName: 'Globe',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    courseCount: 4,
  },
  {
    id: 'database',
    name: 'Database',
    slug: 'database',
    description: 'Design, query, and manage relational and NoSQL database systems with SQL, MySQL, PostgreSQL, and MongoDB.',
    iconName: 'Database',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    courseCount: 4,
  },
  {
    id: 'data-ai',
    name: 'Data & AI',
    slug: 'data-ai',
    description: 'Transform raw data into business intelligence using Advanced Excel, Power BI, Python for Data Science, and Machine Learning.',
    iconName: 'BarChart3',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    courseCount: 4,
  },
  {
    id: 'creative-design',
    name: 'Creative & Design',
    slug: 'creative-design',
    description: 'Unleash your creativity with Photoshop, Canva, Graphic Design, vector arts, and professional video editing.',
    iconName: 'Palette',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    courseCount: 3,
  },
  {
    id: 'kids-technology',
    name: 'Kids Technology',
    slug: 'kids-technology',
    description: 'Engaging, fun technology modules for young learners including Scratch programming, block coding, and basic IoT.',
    iconName: 'Cpu',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    courseCount: 3,
  },
];
