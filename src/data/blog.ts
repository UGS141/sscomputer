export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-learning-c-programming-first-builds-strong-coders',
    title: 'Why Learning C Programming First Builds Stronger Coders',
    category: 'Programming',
    excerpt: 'Discover why starting your software journey with C language instills deep understanding of memory management, pointers, and computer architecture.',
    content: [
      'In today\'s landscape of high-level languages like Python and JavaScript, many beginners wonder if learning C is still relevant in 2026. The answer is an overwhelming yes.',
      'C forces coders to understand how data is actually stored in memory addresses. Concepts like pointers, stack vs heap allocation, dynamic memory management (malloc/free), and array boundaries are transparent in C.',
      'When you understand how pointers work in C, learning higher-level Object-Oriented languages like Java, C++, or Python becomes significantly easier because you understand the underlying mechanics.',
      'At Sri Shanmukha Computer Institute (SSCI), our C programming module focuses heavily on building algorithmic logic, flowcharting, and writing structured code from scratch.'
    ],
    readTime: '4 min read',
    date: 'September 15, 2026',
    author: 'P. Rajesh Varma',
    authorRole: 'Lead Programming Trainer',
    tags: ['C Language', 'Programming Foundations', 'Computer Logic', 'Coding Tips']
  },
  {
    slug: 'essential-excel-formulas-every-office-professional-must-know',
    title: 'Essential Excel Formulas Every Office Professional Must Know',
    category: 'MS Office',
    excerpt: 'Supercharge your daily office productivity with XLOOKUP, Pivot Tables, SUMIFS, and dynamic array formulas.',
    content: [
      'Microsoft Excel remains the backbone of administrative, financial, and analytical operations across global industries.',
      '1. XLOOKUP: Replacing legacy VLOOKUP, XLOOKUP allows you to search in any direction, return exact matches by default, and handle missing values gracefully.',
      '2. SUMIFS & COUNTIFS: Perform conditional additions and counts across large datasets using multiple criteria effortlessly.',
      '3. Pivot Tables: Summarize thousands of sales records into clean monthly category breakdowns in under 30 seconds.',
      'Enrolling in SSCI\'s Advanced Excel & Office Automation course gives you hands-on computer lab practice on these essential workplace tools.'
    ],
    readTime: '5 min read',
    date: 'September 18, 2026',
    author: 'K. Srinivasa Rao',
    authorRole: 'Data & Office Skills Trainer',
    tags: ['MS Excel', 'Office Productivity', 'XLOOKUP', 'Data Analytics']
  },
  {
    slug: 'roadmap-to-become-a-full-stack-web-developer-in-2026',
    title: 'Complete Roadmap to Become a Full Stack Web Developer',
    category: 'Web Development',
    excerpt: 'Step-by-step guidance on mastering HTML5, CSS, JavaScript ES6+, React, Node.js, Express, databases, and deployment.',
    content: [
      'Becoming a full-stack web developer requires a structured path so you do not get overwhelmed by the endless ecosystem of frameworks.',
      'Phase 1: Master the Core Web Foundation — HTML5 for layout semantics, CSS3 Flexbox & Grid for responsiveness, and vanilla JavaScript for interactivity.',
      'Phase 2: Master Modern Component Architecture — Learn React.js, props, state management hooks (useState, useEffect), and client-side routing.',
      'Phase 3: Build Robust RESTful APIs — Use Node.js and Express to build backend servers, handle JSON endpoints, and implement user authentication.',
      'Phase 4: Database & Cloud Hosting — Connect MongoDB or SQL databases, manage data models, and deploy apps live on Vercel or Render.'
    ],
    readTime: '6 min read',
    date: 'September 20, 2026',
    author: 'M. Anand Kumar',
    authorRole: 'Web Development Trainer',
    tags: ['Web Development', 'React', 'Full Stack', 'Career Guide']
  },
  {
    slug: 'how-tally-prime-simplifies-gst-accounting-for-small-businesses',
    title: 'How Tally Prime Simplifies GST Accounting for Businesses',
    category: 'Computer Basics',
    excerpt: 'Learn how Tally Prime automates tax calculation, invoice printing, HSN tagging, and error-free GSTR report filing.',
    content: [
      'Managing business finances manually in spreadsheets often leads to tax mismatch errors and compliance penalties.',
      'Tally Prime provides an intuitive accounting environment where every voucher entry automatically updates stock ledgers, GST calculations, and financial balance sheets simultaneously.',
      'Key advantages include instant e-way bill generation, GSTR-1 and GSTR-3B report exports, multi-godown stock management, and automated bank reconciliation statements.',
      'SSCI\'s Tally Prime course equips commerce students and business owners with direct practical experience using real corporate sample entries.'
    ],
    readTime: '4 min read',
    date: 'September 22, 2026',
    author: 'S. Lakshmi Narayana',
    authorRole: 'Tally & Accounts Specialist',
    tags: ['Tally Prime', 'GST Accounting', 'Bookkeeping', 'Finance']
  }
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return BLOG_POSTS.find((p) => p.slug === slug);
};
