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
  // Helper for REST requests
  request: async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      
      const token = localStorage.getItem('ssci_jwt_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      return await res.json();
    } catch (err) {
      console.warn(`API request to ${endpoint} failed, falling back to local store:`, err);
      return null;
    }
  },

  // Submit Enquiry
  submitEnquiry: async (payload: EnquiryPayload): Promise<{ success: boolean; message: string }> => {
    const data = await apiService.request('/api/leads', 'POST', { ...payload, source: 'Website' });
    if (data?.success) {
      return { success: true, message: data.message || 'Enquiry submitted successfully.' };
    }

    // Local Fallback
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
      }, 300);
    });
  },

  // Verify Certificate
  verifyCertificate: async (certNumber: string): Promise<VerificationResult> => {
    const data = await apiService.request(`/api/certificates/verify/${encodeURIComponent(certNumber)}`);
    if (data) return data;

    // Local Fallback
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
      }, 300);
    });
  },

  // Courses API
  saveCourse: async (courseData: any) => {
    return await apiService.request('/api/courses', 'POST', courseData);
  },
  deleteCourse: async (slug: string) => {
    return await apiService.request(`/api/courses/${slug}`, 'DELETE');
  },

  // Batches API
  saveBatch: async (batchData: any) => {
    return await apiService.request('/api/batches', 'POST', batchData);
  },
  deleteBatch: async (id: string) => {
    return await apiService.request(`/api/batches/${id}`, 'DELETE');
  },

  // Blog API
  saveBlogPost: async (postData: any) => {
    return await apiService.request('/api/blog', 'POST', postData);
  },
  deleteBlogPost: async (slug: string) => {
    return await apiService.request(`/api/blog/${slug}`, 'DELETE');
  },

  // Trainers API
  saveTrainer: async (trainerData: any) => {
    return await apiService.request('/api/trainers', 'POST', trainerData);
  },
  deleteTrainer: async (id: string) => {
    return await apiService.request(`/api/trainers/${id}`, 'DELETE');
  },

  // Students API
  saveStudent: async (studentData: any) => {
    return await apiService.request('/api/students', 'POST', studentData);
  },

  // Floating Skills API
  saveFloatingSkill: async (skillData: any) => {
    return await apiService.request('/api/floating-skills', 'POST', skillData);
  },
  deleteFloatingSkill: async (id: string) => {
    return await apiService.request(`/api/floating-skills/${id}`, 'DELETE');
  },

  // Settings & Hero API
  updateSettings: async (settingsData: any) => {
    return await apiService.request('/api/website/settings', 'PUT', settingsData);
  },
  updateHeroContent: async (heroData: any) => {
    return await apiService.request('/api/website/hero', 'PUT', heroData);
  },
  updateAnnouncement: async (announcementData: any) => {
    return await apiService.request('/api/announcement', 'PUT', announcementData);
  },

  // Certificates API
  issueCertificate: async (certData: any) => {
    return await apiService.request('/api/certificates', 'POST', certData);
  },
};
