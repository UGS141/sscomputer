/**
 * Centralized Master SEO & Entity Configuration for Sri Shanmukha Computer Institute (SSCI)
 * Ensures 100% NAP (Name, Address, Phone) consistency and GEO/AEO optimization across the site.
 */

export const SEO_CONFIG = {
  // 1. EXACT BUSINESS NAP INFORMATION
  businessName: 'Sri Shanmukha Computer Institute',
  shortName: 'SSCI',
  tagline: 'LEARN • PRACTICE • GROW',
  primaryPositioning: 'Practical computer education, programming, software skills and career-focused technology training.',
  
  domain: 'https://sscomputer.in', // Default canonical base URL
  
  address: {
    street: 'Dhanalakshmipuram, Opposite More Super Market',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    postalCode: '524002',
    country: 'India',
    countryCode: 'IN',
    fullAddress: 'Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India',
    landmark: 'Opposite More Super Market',
  },

  contact: {
    phone: '+91 7675927519',
    phoneFormatted: '+917675927519',
    whatsapp: '+91 7675927519',
    whatsappFormatted: '917675927519',
    email: 'sscomputerinstitutenlr@gmail.com',
  },

  social: {
    instagram: 'https://instagram.com/ssci_official',
    facebook: 'https://facebook.com/ssci.official',
    youtube: 'https://youtube.com/ssci_edu',
    linkedin: 'https://linkedin.com/company/ssci-institute',
  },

  defaultOgImage: '/ssci-logo.png',

  // 2. PRIMARY KEYWORD CLUSTERS (SEO / LOCAL SEO / GEO / AEO)
  keywordClusters: {
    primaryLocal: [
      'computer courses in Nellore',
      'computer training institute in Nellore',
      'computer institute in Nellore',
      'computer classes in Nellore',
      'computer education in Nellore',
      'computer training in Nellore',
      'IT training institute in Nellore',
      'IT courses in Nellore',
      'software training institute in Nellore',
      'computer coaching in Nellore',
      'computer education institute in Nellore',
      'computer learning centre in Nellore',
      'computer classes near me',
      'computer institute near me',
      'computer training near me',
      'computer courses near me',
    ],
    programming: [
      'programming courses in Nellore',
      'programming classes in Nellore',
      'coding classes in Nellore',
      'coding courses in Nellore',
      'programming training institute in Nellore',
      'coding institute in Nellore',
      'software development courses in Nellore',
      'C programming course in Nellore',
      'C++ course in Nellore',
      'Java course in Nellore',
      'Python course in Nellore',
      'Java programming classes in Nellore',
      'Python programming classes in Nellore',
      'C programming classes in Nellore',
      'C++ programming classes in Nellore',
      'data structures course in Nellore',
      'DSA classes in Nellore',
      'coding interview preparation in Nellore',
    ],
    webDevelopment: [
      'web development course in Nellore',
      'web development classes in Nellore',
      'web designing course in Nellore',
      'web design classes in Nellore',
      'frontend development course in Nellore',
      'backend development course in Nellore',
      'full stack development course in Nellore',
      'full stack developer course in Nellore',
      'full stack web development in Nellore',
      'HTML course in Nellore',
      'CSS course in Nellore',
      'JavaScript course in Nellore',
      'React course in Nellore',
      'Node.js course in Nellore',
      'MongoDB course in Nellore',
      'SQL course in Nellore',
    ],
    msOffice: [
      'MS Office course in Nellore',
      'MS Office training in Nellore',
      'Microsoft Office classes in Nellore',
      'computer basics course in Nellore',
      'basic computer course in Nellore',
      'computer fundamentals course in Nellore',
      'MS Word training in Nellore',
      'MS Excel training in Nellore',
      'MS PowerPoint training in Nellore',
      'Advanced Excel course in Nellore',
      'Excel classes in Nellore',
      'Excel training institute in Nellore',
    ],
    tally: [
      'Tally course in Nellore',
      'Tally Prime course in Nellore',
      'Tally training in Nellore',
      'Tally classes in Nellore',
      'Tally Prime training institute in Nellore',
      'accounting software course in Nellore',
      'Tally GST course in Nellore',
      'Tally ERP training in Nellore',
    ],
    dataAnalytics: [
      'data analytics course in Nellore',
      'data analytics classes in Nellore',
      'data analyst course in Nellore',
      'data analysis training in Nellore',
      'Power BI course in Nellore',
      'Power BI training in Nellore',
      'Excel data analytics course in Nellore',
      'SQL data analytics course in Nellore',
      'Python data analytics course in Nellore',
    ],
    career: [
      'career-oriented computer courses in Nellore',
      'job-oriented computer courses in Nellore',
      'skill development courses in Nellore',
      'professional computer courses in Nellore',
      'career-focused IT courses in Nellore',
      'practical computer training in Nellore',
      'hands-on computer training in Nellore',
      'computer courses for students in Nellore',
      'programming courses for beginners in Nellore',
      'computer courses for beginners in Nellore',
    ],
  },

  // 3. GEO / AEO ANSWER DIRECTORY (Factual Q&A Context for Search Engine & AI Models)
  geoAnswers: [
    {
      question: 'What is Sri Shanmukha Computer Institute (SSCI)?',
      answer: 'Sri Shanmukha Computer Institute (SSCI) is a leading computer education and IT skills training institute located in Dhanalakshmipuram, Nellore, Andhra Pradesh. SSCI provides practical classroom and computer lab training in programming languages, web development, office automation, computerized accounting, and data analytics.',
    },
    {
      question: 'Where is Sri Shanmukha Computer Institute located in Nellore?',
      answer: 'Sri Shanmukha Computer Institute is located at Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India. Contact: +91 7675927519.',
    },
    {
      question: 'What computer and programming courses does SSCI Nellore offer?',
      answer: 'SSCI offers structured practical courses including Python Programming, C & C++, Java, Tally Prime & GST Accounting, MS Office & Computer Fundamentals, Full Stack Web Development, React, JavaScript, Advanced Excel, Power BI & Data Analytics, SQL Databases, Graphic Design, and Hardware Troubleshooting.',
    },
    {
      question: 'Does SSCI provide hands-on practical lab training?',
      answer: 'Yes, every course at Sri Shanmukha Computer Institute includes 50% classroom concept lectures and 50% hands-on practical lab exercises on individual workstations.',
    },
    {
      question: 'How can students contact or enquire for batches at SSCI Nellore?',
      answer: 'Students can enquire by visiting the campus opposite More Super Market in Dhanalakshmipuram, Nellore, calling or WhatsApping +91 7675927519, or submitting an online enquiry on the official website.',
    },
  ],
};
