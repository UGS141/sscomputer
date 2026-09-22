export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Admissions' | 'Lab & Practice' | 'Certificates' | 'Batches';
}

export const GLOBAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What makes Sri Shanmukha Computer Institute (SSCI) different from other coaching institutes?',
    answer: 'At SSCI, we focus on 100% practical, hands-on computer learning. Every student gets dedicated PC time during every session, structured curriculum modules, experienced faculty guidance, real project building, and recognized course completion certificates.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'Do I need a personal laptop or computer at home to join courses?',
    answer: 'No personal laptop is required! SSCI provides fully equipped computer labs with high-speed internet, updated software, and individual desktop workstations for all students during practice hours.',
    category: 'Lab & Practice'
  },
  {
    id: 'faq-3',
    question: 'What batch timings are available?',
    answer: 'We offer flexible batch schedules across Morning (8:00 AM – 12:00 PM), Afternoon (2:00 PM – 4:00 PM), Evening (5:00 PM – 8:00 PM), and dedicated Weekend batches for working professionals.',
    category: 'Batches'
  },
  {
    id: 'faq-4',
    question: 'Are SSCI certificates verifiable online?',
    answer: 'Yes! Every student who successfully completes a course receives a unique Certificate Number. Certificates can be instantly verified by employers or institutions on our website under the /verify-certificate section.',
    category: 'Certificates'
  },
  {
    id: 'faq-5',
    question: 'How do I enroll in a course or reserve a seat in an upcoming batch?',
    answer: 'You can click on the "Enquire Now" button anywhere on the website, fill out the quick contact form, or send us a message directly via WhatsApp. Our admission desk will guide you with fee details and seat reservation.',
    category: 'Admissions'
  },
  {
    id: 'faq-6',
    question: 'What if I miss a practical class due to an emergency?',
    answer: 'We provide backup practice slots in our computer lab and revision assistance with your batch trainer so you never fall behind in your learning.',
    category: 'Lab & Practice'
  }
];
