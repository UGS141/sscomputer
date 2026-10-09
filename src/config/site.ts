export const SITE_CONFIG = {
  name: 'Sri Shanmukha Computer Institute',
  shortName: 'SSCI',
  tagline: 'LEARN • PRACTICE • GROW',
  primaryPositioning: 'Build practical computer skills, programming knowledge, and career-ready digital capabilities with structured classroom training.',
  logo: '/ssci-logo.png',
  
  // Official WhatsApp & Contact Details
  whatsappNumber: '917675927519',
  whatsappDefaultMessage: 'Hello Sri Shanmukha Computer Institute, I would like to know more about your courses and upcoming batches.',
  
  contact: {
    phonePrimary: '+91 7675927519',
    phoneSecondary: '+91 7675927519',
    email: 'sscomputerinstitutenlr@gmail.com',
    supportEmail: 'sscomputerinstitutenlr@gmail.com',
    address: 'Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India',
    city: 'Nellore',
    workingHours: 'Monday – Saturday: 8:00 AM – 8:00 PM | Sunday: 9:00 AM – 1:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.801538392182!2d79.9822!3d14.4426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDI2JzMzLjQiTiA3OcKwNTgnNTUuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
  },
  
  social: {
    instagram: 'https://www.instagram.com/sscomputerinstitutenlr?srtk=MWsyaHcycjJqYmt2dQ==',
    facebook: 'https://facebook.com/ssci.official',
    youtube: 'https://youtube.com/ssci_edu',
    linkedin: 'https://linkedin.com/company/ssci-institute',
  },

  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Learning Paths', path: '/learning-paths' },
    { label: 'Batches', path: '/batches' },
    { label: 'Projects', path: '/projects' },
    { label: 'Trainers', path: '/trainers' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ],
};

export const generateWhatsAppUrl = (customMessage?: string) => {
  const message = encodeURIComponent(customMessage || SITE_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;
};
