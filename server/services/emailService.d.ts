export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  resendApiKey: string;
  teamEmail: string;
  fromEmail: string;
  frontendUrl: string;
}

export interface EmailProviderStatus {
  isConfigured: boolean;
  activeProvider: 'smtp' | 'resend' | null;
  missingVariables: string[];
  teamEmail: string;
  fromEmail: string;
}

export interface EmailSendResult {
  success: boolean;
  status: 'sent' | 'failed' | 'skipped';
  messageId?: string;
  recipient?: string;
  sentAt?: Date;
  error?: string;
  reason?: string;
  skippedReason?: string;
  attempts?: number;
  lastAttemptAt?: Date;
}

export interface LeadNotificationResults {
  teamNotification: EmailSendResult;
  leadConfirmation: EmailSendResult;
}

export function getEmailConfig(): EmailConfig;
export function getEmailProviderStatus(): EmailProviderStatus;
export function sendRawEmail(options: { to: string | string[]; subject: string; html: string; text: string }): Promise<EmailSendResult>;
export function sendEmailWithRetry(options: { to: string | string[]; subject: string; html: string; text: string; maxRetries?: number }): Promise<EmailSendResult>;
export function renderTeamNotificationContent(lead: any): { subject: string; html: string; text: string; crmLeadUrl: string };
export function renderLeadConfirmationContent(lead: any): { subject: string; html: string; text: string };
export function sendTeamLeadNotification(lead: any): Promise<EmailSendResult>;
export function sendLeadConfirmationEmail(lead: any): Promise<EmailSendResult>;
export function processLeadNotifications(lead: any): Promise<LeadNotificationResults>;
export function retryLeadNotifications(lead: any): Promise<LeadNotificationResults>;
