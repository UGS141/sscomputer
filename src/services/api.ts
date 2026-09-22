export interface EnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  courseInterested?: string;
  preferredBatch?: string;
  message?: string;
}

export interface VerificationResult {
  valid: boolean;
  certificateNumber?: string;
  studentName?: string;
  courseName?: string;
  issueDate?: string;
  completionStatus?: string;
  grade?: string;
  verificationCode?: string;
  errorMessage?: string;
}

// Sample mock certificates database
const MOCK_CERTIFICATES: Record<string, VerificationResult> = {
  'SSCI-2026-9482': {
    valid: true,
    certificateNumber: 'SSCI-2026-9482',
    studentName: 'K. Sai Teja',
    courseName: 'Python Programming',
    issueDate: 'August 28, 2026',
    completionStatus: 'Successfully Completed with Distinction',
    grade: 'Grade A+',
    verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
  },
  'SSCI-2026-1024': {
    valid: true,
    certificateNumber: 'SSCI-2026-1024',
    studentName: 'V. Ramya Sree',
    courseName: 'Tally Prime & GST Accounting',
    issueDate: 'September 10, 2026',
    completionStatus: 'Successfully Completed',
    grade: 'Grade A',
    verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
  },
  'SSCI-2026-5541': {
    valid: true,
    certificateNumber: 'SSCI-2026-5541',
    studentName: 'M. Tarun Kumar',
    courseName: 'Full Stack Web Development',
    issueDate: 'July 14, 2026',
    completionStatus: 'Successfully Completed with Distinction',
    grade: 'Grade A+',
    verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
  },
  'SSCI-2026-8812': {
    valid: true,
    certificateNumber: 'SSCI-2026-8812',
    studentName: 'P. Bhavana',
    courseName: 'MS Office & Computer Fundamentals',
    issueDate: 'September 01, 2026',
    completionStatus: 'Successfully Completed',
    grade: 'Grade A',
    verificationCode: 'VERIFIED-OFFICIAL-SSCI-2026',
  },
};

export const apiService = {
  // Mock Enquiry Submission
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Enquiry received:', payload);
        resolve({
          success: true,
          message: 'Thank you! Our admission counselor will contact you shortly.',
        });
      }, 800);
    });
  },

  // Mock Certificate Verification
  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleaned = certNumber.trim().toUpperCase();
        if (MOCK_CERTIFICATES[cleaned]) {
          resolve(MOCK_CERTIFICATES[cleaned]);
        } else if (cleaned.startsWith('SSCI-')) {
          // Dynamic fallback for demo testing
          resolve({
            valid: true,
            certificateNumber: cleaned,
            studentName: 'SSCI Certified Student',
            courseName: 'Computer & Practical Training Course',
            issueDate: 'September 2026',
            completionStatus: 'Verified & Authenticated in SSCI Student Registry',
            grade: 'Grade A',
            verificationCode: `VERIFIED-OFFICIAL-${cleaned}`,
          });
        } else {
          resolve({
            valid: false,
            errorMessage: `No record found for Certificate No: "${certNumber}". Please check the ID printed on your official SSCI certificate document or contact admissions.`,
          });
        }
      }, 700);
    });
  },
};
