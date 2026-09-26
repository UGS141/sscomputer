import { cmsStore } from '../admin/cmsStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
  // Submit Enquiry
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, source: 'Website' }),
        });
        const data = await res.json();
        if (data.success) {
          return { success: true, message: data.message || 'Enquiry submitted successfully.' };
        }
      } catch (err) {
        console.warn('Backend API submission failed, falling back to local CRM store:', err);
      }
    }

    // Local / Offline Fallback
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

  // Verify Certificate
  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certNumber)}`);
        const data = await res.json();
        if (data) return data;
      } catch (err) {
        console.warn('Backend API certificate verification failed, falling back to local registry:', err);
      }
    }

    // Local / Offline Fallback
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
