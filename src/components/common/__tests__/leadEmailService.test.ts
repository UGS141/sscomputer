import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getEmailConfig,
  getEmailProviderStatus,
  renderTeamNotificationContent,
  renderLeadConfirmationContent,
  sendLeadConfirmationEmail,
  sendEmailWithRetry,
  processLeadNotifications,
  retryLeadNotifications,
} from '../../../../server/services/emailService.js';

describe('Transactional Email Service for Leads', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Clear out credentials for unconfigured baseline tests
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockLead = {
    id: 'LEAD-1050',
    name: 'Rajesh Sharma',
    phone: '9876543210',
    email: 'rajesh.sharma@example.com',
    courseInterested: 'Full Stack Web Development',
    preferredBatch: 'Morning 9 AM - 11 AM',
    source: 'Course Page',
    message: 'Interested in Python and React full stack curriculum with placement support.',
    createdAt: '2026-10-18T10:30:00.000Z',
    notes: [
      { id: 'n1', text: 'Internal counselor remark: high intent', author: 'Admin', timestamp: '2026-10-18T11:00:00Z' }
    ],
  };

  describe('Provider Configuration & Diagnostics', () => {
    it('detects unconfigured status and explains required environment variables without crashing', () => {
      const status = getEmailProviderStatus();
      expect(status.isConfigured).toBe(false);
      expect(status.activeProvider).toBeNull();
      expect(status.missingVariables.length).toBeGreaterThan(0);
      expect(status.missingVariables.some((v: string) => v.includes('SMTP') || v.includes('RESEND'))).toBe(true);
    });

    it('detects SMTP provider when SMTP credentials are provided', () => {
      process.env.SMTP_HOST = 'smtp.sendgrid.net';
      process.env.SMTP_USER = 'apikey';
      process.env.SMTP_PASS = 'SG.secret_key';
      process.env.CONSULTANCY_TEAM_EMAIL = 'counselors@sscomputerinstitute.com';

      const status = getEmailProviderStatus();
      expect(status.isConfigured).toBe(true);
      expect(status.activeProvider).toBe('smtp');
      expect(status.teamEmail).toBe('counselors@sscomputerinstitute.com');
    });

    it('detects Resend provider when RESEND_API_KEY is provided', () => {
      process.env.RESEND_API_KEY = 're_test_key_123';
      process.env.CONSULTANCY_TEAM_EMAIL = 'admissions@sscomputerinstitute.com';

      const status = getEmailProviderStatus();
      expect(status.isConfigured).toBe(true);
      expect(status.activeProvider).toBe('resend');
    });
  });

  describe('Internal Team Notification Template', () => {
    it('includes all necessary lead details and a direct CRM link', () => {
      process.env.FRONTEND_URL = 'https://sscomputerinstitute.com';
      const { subject, html, text, crmLeadUrl } = renderTeamNotificationContent(mockLead);

      expect(subject).toContain('LEAD-1050');
      expect(subject).toContain('Rajesh Sharma');
      expect(subject).toContain('Full Stack Web Development');

      // Check plain text
      expect(text).toContain('LEAD-1050');
      expect(text).toContain('Rajesh Sharma');
      expect(text).toContain('9876543210');
      expect(text).toContain('rajesh.sharma@example.com');
      expect(text).toContain('Full Stack Web Development');
      expect(text).toContain('Morning 9 AM - 11 AM');
      expect(text).toContain('Course Page');
      expect(text).toContain('Interested in Python and React');
      expect(text).toContain('https://sscomputerinstitute.com/admin/enquiries?id=LEAD-1050');

      // Check HTML content
      expect(html).toContain('Rajesh Sharma');
      expect(html).toContain('9876543210');
      expect(html).toContain('Full Stack Web Development');
      expect(html).toContain(crmLeadUrl);
      expect(html).toContain('Open Lead in Admin CRM');
    });
  });

  describe('Lead Confirmation Template (Safe & Professional)', () => {
    it('is brief, confirms enquiry details, and strictly avoids internal notes or CRM links', () => {
      const { subject, html, text } = renderLeadConfirmationContent(mockLead);

      expect(subject).toContain('Enquiry Received - Sri Shanmukha Computer Institute');
      expect(text).toContain('Dear Rajesh Sharma');
      expect(text).toContain('Full Stack Web Development');
      expect(text).toContain('9876543210');

      // Crucial Security Checks: Must NOT leak internal notes or admin CRM links
      expect(text).not.toContain('Internal counselor remark');
      expect(text).not.toContain('admin/enquiries');
      expect(text).not.toContain('admin/leads');
      expect(html).not.toContain('Internal counselor remark');
      expect(html).not.toContain('/admin/');
    });
  });

  describe('Unconfigured Environment Behavior', () => {
    it('safely skips delivery and returns clear status without throwing unhandled errors', async () => {
      const results = await processLeadNotifications(mockLead);

      expect(results.teamNotification.status).toBe('skipped');
      expect(results.teamNotification.success).toBe(false);
      expect(results.teamNotification.error).toContain('Email credentials are not configured');

      expect(results.leadConfirmation.status).toBe('skipped');
      expect(results.leadConfirmation.success).toBe(false);
    });

    it('skips lead confirmation if candidate did not provide an email address', async () => {
      const leadWithoutEmail = { ...mockLead, email: '' };
      const confirmationResult = await sendLeadConfirmationEmail(leadWithoutEmail);

      expect(confirmationResult.status).toBe('skipped');
      expect(confirmationResult.reason).toContain('No lead email address provided');
      expect(confirmationResult.attempts).toBe(0);
    });
  });

  describe('Safe Retry Logic & Idempotency', () => {
    it('skips already-sent emails during retry to prevent duplicates', async () => {
      const leadWithSentTeamNotification = {
        ...mockLead,
        emailDelivery: {
          teamNotification: {
            status: 'sent',
            recipient: 'admissions@sscomputerinstitute.com',
            sentAt: new Date(),
            messageId: 'msg-team-123',
          },
          leadConfirmation: {
            status: 'failed',
            recipient: 'rajesh.sharma@example.com',
            error: 'Connection timeout',
            attempts: 3,
          },
        },
      };

      const retryResults = await retryLeadNotifications(leadWithSentTeamNotification);

      // Team notification was already sent -> skipped to prevent duplicate send!
      expect(retryResults.teamNotification.status).toBe('sent');
      expect(retryResults.teamNotification.skippedReason).toContain('Already successfully sent');

      // Lead confirmation was failed -> was re-attempted
      expect(retryResults.leadConfirmation.status).toBe('skipped'); // skipped in unconfigured test env
    });
  });
});
