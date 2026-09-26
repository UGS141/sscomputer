import { cmsStore } from '../admin/cmsStore';

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

export const apiService = {
  // Submit Enquiry (Persists directly to CMS CRM Store)
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        cmsStore.addLead({
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          courseInterested: payload.courseInterested,
          preferredBatch: payload.preferredBatch,
          message: payload.message,
          source: 'Website',
        });
        resolve({
          success: true,
          message: 'Thank you! Our admission counselor at Sri Shanmukha Computer Institute will contact you shortly.',
        });
      }, 500);
    });
  },

  // Verify Certificate (Checks live CMS Certificates Registry)
  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = cmsStore.verifyCertificate(certNumber);
        if (result) {
          resolve(result);
        } else {
          resolve({
            valid: false,
            errorMessage: `No record found for Certificate No: "${certNumber}". Please check the ID printed on your official SSCI certificate or contact administration.`,
          });
        }
      }, 500);
    });
  },
};
