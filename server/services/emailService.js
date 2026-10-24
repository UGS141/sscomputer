import nodemailer from 'nodemailer';

/**
 * SRI SHANMUKHA COMPUTER INSTITUTE (SSCI)
 * Server-side Transactional Email Service
 * 
 * Features:
 * - Credentials loaded exclusively from backend environment variables (never exposed to client).
 * - Multi-provider support: standard SMTP (SendGrid, Mailgun, AWS SES, Brevo, Gmail SMTP) or Resend API.
 * - Configurable recipients: CONSULTANCY_TEAM_EMAIL (or ADMIN_EMAIL) and lead's email.
 * - Does not throw unhandled exceptions: returns structured delivery status.
 * - Transient failure retry with exponential backoff.
 * - Idempotent re-try mechanism that skips already-sent emails to avoid duplicate messages.
 * - Explains missing environment variables without inventing credentials.
 */

/**
 * Retrieve email configuration from environment variables
 */
export const getEmailConfig = () => {
  return {
    // SMTP Credentials
    smtpHost: process.env.SMTP_HOST?.trim() || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpSecure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    smtpUser: process.env.SMTP_USER?.trim() || '',
    smtpPass: process.env.SMTP_PASS?.trim() || '',

    // HTTP-based Providers (Port 443 HTTPS - Never blocked by Render or cloud firewalls)
    resendApiKey: process.env.RESEND_API_KEY?.trim() || '',
    gmailWebhookUrl: process.env.GMAIL_WEBHOOK_URL?.trim() || process.env.EMAIL_WEBHOOK_URL?.trim() || '',

    // Configurable Recipient & Sender
    teamEmail:
      process.env.CONSULTANCY_TEAM_EMAIL?.trim() ||
      process.env.ADMIN_EMAIL?.trim() ||
      'sscomputerinstitutenlr@gmail.com, ugssolutions1@gmail.com',
    fromEmail:
      process.env.EMAIL_FROM?.trim() ||
      '"Sri Shanmukha Computer Institute" <ugssolutions1@gmail.com>',

    // Admin CRM URL base
    frontendUrl: (
      process.env.FRONTEND_URL ||
      process.env.PUBLIC_URL ||
      'https://sscomputerinstitute.com'
    ).replace(/\/$/, ''),
  };
};

/**
 * Check provider status and detect missing environment variables
 */
export const getEmailProviderStatus = () => {
  const config = getEmailConfig();
  const hasWebhook = Boolean(config.gmailWebhookUrl);
  const hasResend = Boolean(config.resendApiKey);
  const hasSmtp = Boolean(config.smtpHost && config.smtpUser && config.smtpPass);

  const missingVariables = [];

  if (!hasSmtp && !hasResend && !hasWebhook) {
    if (config.smtpHost || config.smtpUser || config.smtpPass) {
      if (!config.smtpHost) missingVariables.push('SMTP_HOST');
      if (!config.smtpUser) missingVariables.push('SMTP_USER');
      if (!config.smtpPass) missingVariables.push('SMTP_PASS');
    } else {
      missingVariables.push('SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS');
      missingVariables.push('OR: RESEND_API_KEY');
      missingVariables.push('OR: GMAIL_WEBHOOK_URL');
    }
    if (!process.env.CONSULTANCY_TEAM_EMAIL) {
      missingVariables.push('CONSULTANCY_TEAM_EMAIL (optional, defaults to admissions@sscomputerinstitute.com)');
    }
  }

  // Provider priority:
  // 1. Webhook (Port 443 HTTPS - works on Render Free Tier without domain restrictions)
  // 2. SMTP (Standard socket - works locally or on cloud servers with open SMTP ports)
  // 3. Resend API (Port 443 HTTPS)
  let activeProvider = null;
  if (hasWebhook) {
    activeProvider = 'webhook';
  } else if (hasSmtp) {
    activeProvider = 'smtp';
  } else if (hasResend) {
    activeProvider = 'resend';
  }

  return {
    isConfigured: hasWebhook || hasSmtp || hasResend,
    activeProvider,
    missingVariables,
    teamEmail: config.teamEmail,
    fromEmail: config.fromEmail,
  };
};

/**
 * Cache nodemailer transporter instance when using SMTP
 */
let cachedTransporter = null;

const getTransporter = (config) => {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    // Fast timeouts to avoid blocking server when cloud firewalls block SMTP ports
    connectionTimeout: 4000,
    greetingTimeout: 4000,
    socketTimeout: 5000,
  });

  return cachedTransporter;
};

export const normalizeRecipients = (to) => {
  if (Array.isArray(to)) return to.map((s) => String(s).trim()).filter(Boolean);
  if (typeof to === 'string') return to.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

/**
 * Send an email directly via the configured provider (SMTP, Webhook, or Resend API)
 */
export const sendRawEmail = async ({ to, subject, html, text, forceProvider = null }) => {
  const config = getEmailConfig();
  const status = getEmailProviderStatus();
  const recipients = normalizeRecipients(to);
  const recipientStr = recipients.join(', ');

  if (recipients.length === 0) {
    return {
      success: false,
      status: 'skipped',
      error: 'No valid recipient email address specified.',
      recipient: '',
    };
  }

  if (!status.isConfigured && !forceProvider) {
    const errorMsg =
      'Email credentials are not configured in environment variables. ' +
      `Required: SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS), GMAIL_WEBHOOK_URL, or RESEND_API_KEY. ` +
      `Delivery skipped.`;
    console.warn(`[EmailService] ${errorMsg}`);
    return {
      success: false,
      status: 'skipped',
      error: errorMsg,
      recipient: recipientStr,
    };
  }

  const provider = forceProvider || status.activeProvider;

  // 1. Google Apps Script / Gmail Webhook HTTP API (Port 443 HTTPS - Works on Render Free Tier!)
  if (provider === 'webhook' && config.gmailWebhookUrl) {
    const response = await fetch(config.gmailWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        to: recipientStr,
        subject,
        html,
        text,
      }),
      redirect: 'follow',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      throw new Error(data?.error || `Webhook HTTP ${response.status}`);
    }

    return {
      success: true,
      status: 'sent',
      messageId: data.messageId || `webhook-${Date.now()}`,
      recipient: recipientStr,
      sentAt: new Date(),
    };
  }

  // 2. Resend API Dispatch (Port 443 HTTPS)
  if (provider === 'resend' && config.resendApiKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: recipients,
        subject,
        html,
        text,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || `Resend API returned HTTP ${response.status}`);
    }

    return {
      success: true,
      status: 'sent',
      messageId: data.id || `resend-${Date.now()}`,
      recipient: recipientStr,
      sentAt: new Date(),
    };
  }

  // 3. SMTP Dispatch (nodemailer)
  const transporter = getTransporter(config);
  const info = await transporter.sendMail({
    from: config.fromEmail,
    to: recipientStr,
    subject,
    html,
    text,
  });

  return {
    success: true,
    status: 'sent',
    messageId: info.messageId || `smtp-${Date.now()}`,
    recipient: recipientStr,
    sentAt: new Date(),
  };
};

/**
 * Execute email dispatch with transient failure retry (exponential backoff)
 */
export const sendEmailWithRetry = async ({ to, subject, html, text, maxRetries = 1 }) => {
  let attempt = 0;
  let lastError = null;
  const config = getEmailConfig();

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const result = await sendRawEmail({ to, subject, html, text });
      if (result.status === 'skipped') {
        return {
          ...result,
          attempts: attempt,
          lastAttemptAt: new Date(),
        };
      }
      return {
        ...result,
        attempts: attempt,
        lastAttemptAt: new Date(),
      };
    } catch (err) {
      lastError = err;
      console.error(
        `[EmailService] Attempt ${attempt}/${maxRetries + 1} failed for ${Array.isArray(to) ? to.join(', ') : to}:`,
        err.message
      );

      // Detect connection timeouts (common on cloud hosts like Render free tier that block outbound SMTP ports)
      const isTimeout =
        err.message?.includes('timeout') ||
        err.message?.includes('ETIMEDOUT') ||
        err.code === 'ETIMEDOUT';

      if (isTimeout) {
        // If Resend API is available, attempt HTTP fallback over Port 443
        if (config.resendApiKey) {
          try {
            console.warn('[EmailService] SMTP timed out. Attempting Resend API fallback over Port 443 HTTPS...');
            const fallbackResult = await sendRawEmail({ to, subject, html, text, forceProvider: 'resend' });
            return {
              ...fallbackResult,
              attempts: attempt,
              lastAttemptAt: new Date(),
            };
          } catch (resendErr) {
            console.error('[EmailService] Resend fallback error:', resendErr.message);
          }
        }
        // Port is blocked by firewall; don't retry repeatedly
        break;
      }

      // If more retries left, wait with backoff
      if (attempt <= maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 2000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  let userFriendlyError = lastError?.message || 'Unknown email delivery failure';
  if (lastError?.message?.includes('timeout') || lastError?.code === 'ETIMEDOUT') {
    userFriendlyError = 'Connection timeout: Cloud host (Render Free Tier) blocks outbound SMTP ports (465/587). Please use GMAIL_WEBHOOK_URL (Port 443) or verify domain in Resend.';
  }

  return {
    success: false,
    status: 'failed',
    error: userFriendlyError,
    recipient: Array.isArray(to) ? to.join(', ') : to,
    attempts: attempt,
    lastAttemptAt: new Date(),
  };
};

/**
 * Render HTML & plain text for internal consultancy team notification
 */
export const renderTeamNotificationContent = (lead) => {
  const config = getEmailConfig();
  const crmLeadUrl = `${config.frontendUrl}/admin/enquiries?id=${encodeURIComponent(lead.id)}`;

  const subject = `🔔 New Lead Enquiry: ${lead.name} - ${lead.courseInterested || 'General Enquiry'} [${lead.id}]`;

  const text = `
SRI SHANMUKHA COMPUTER INSTITUTE - NEW LEAD NOTIFICATION
=========================================================

A new student enquiry has been submitted on the SSCI website.

LEAD DETAILS:
- Lead ID: ${lead.id}
- Candidate Name: ${lead.name}
- Phone Number: ${lead.phone}
- Email: ${lead.email || 'Not provided'}
- Course Interested: ${lead.courseInterested || 'General Enquiry'}
- Preferred Batch: ${lead.preferredBatch || 'Any Batch'}
- Lead Source: ${lead.source || 'Website'}
- Date & Time: ${new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

STUDENT MESSAGE / QUERY:
"${lead.message || 'No additional message provided'}"

VIEW IN ADMIN CRM:
${crmLeadUrl}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #123B3A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2ece9;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #123B3A 0%, #087F78 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <span style="background-color: rgba(245, 183, 44, 0.2); border: 1px solid rgba(245, 183, 44, 0.4); color: #F5B72C; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">Admissions Alert</span>
        <h1 style="margin: 12px 0 4px 0; font-size: 22px; font-weight: 800;">New Student Enquiry Received</h1>
        <p style="margin: 0; font-size: 13px; color: #b2dfdb;">Sri Shanmukha Computer Institute (SSCI CRM)</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 24px;">
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; font-weight: 700; color: #065f46;">Lead ID: ${lead.id} &bull; Status: New</p>
        </div>

        <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td width="35%" style="font-weight: 700; color: #4B6B69;">Candidate Name:</td>
            <td style="font-weight: 700; color: #123B3A;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="font-weight: 700; color: #4B6B69;">Phone Number:</td>
            <td><a href="tel:${lead.phone}" style="color: #087F78; text-decoration: none; font-weight: 700;">${lead.phone}</a> (<a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="color: #12A77A; text-decoration: none; font-weight: 600;">WhatsApp</a>)</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="font-weight: 700; color: #4B6B69;">Email Address:</td>
            <td>${lead.email ? `<a href="mailto:${lead.email}" style="color: #087F78; text-decoration: none;">${lead.email}</a>` : '<span style="color: #999;">Not provided</span>'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="font-weight: 700; color: #4B6B69;">Course Interested:</td>
            <td style="font-weight: 700; color: #087F78;">${lead.courseInterested || 'General Enquiry'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="font-weight: 700; color: #4B6B69;">Preferred Batch:</td>
            <td>${lead.preferredBatch || 'Any Batch'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="font-weight: 700; color: #4B6B69;">Lead Source:</td>
            <td><span style="background-color: #e0f2f1; color: #00796b; font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600;">${lead.source || 'Website'}</span></td>
          </tr>
          <tr>
            <td style="font-weight: 700; color: #4B6B69;">Submission Date:</td>
            <td style="color: #666;">${new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
          </tr>
        </table>

        ${
          lead.message
            ? `
        <div style="margin-top: 20px; padding: 14px; background-color: #fafafa; border-radius: 8px; border: 1px solid #eeeeee;">
          <strong style="font-size: 12px; color: #4B6B69; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Candidate's Query / Message:</strong>
          <p style="margin: 0; font-size: 13px; font-style: italic; color: #333333; line-height: 1.5;">"${lead.message}"</p>
        </div>
        `
            : ''
        }

        <!-- Direct CRM Action Button -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="${crmLeadUrl}" style="display: inline-block; background: linear-gradient(135deg, #123B3A 0%, #087F78 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 10px rgba(8, 127, 120, 0.25);">
            Open Lead in Admin CRM &rarr;
          </a>
          <p style="margin-top: 8px; font-size: 11px; color: #888;">Direct link: ${crmLeadUrl}</p>
        </div>
      </td>
    </tr>

    <!-- Footer & Developer Branding -->
    <tr>
      <td style="background-color: #0c2726; padding: 22px 24px; text-align: center; border-top: 2px solid #087F78;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #b2dfdb; font-weight: 600;">
          Sri Shanmukha Computer Institute (SSCI) &bull; Automated CRM Notification System
        </p>
        <p style="margin: 0 0 12px 0; font-size: 11px; color: #80cbc4;">
          Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India &bull; +91 7675927519
        </p>
        <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; margin-top: 12px;">
          <a href="https://www.ugsitsolutions.com/" target="_blank" style="text-decoration: none; display: inline-block;">
            <img src="${config.frontendUrl}/ugs-logo.png" alt="UGS IT Solutions Logo" style="height: 28px; width: auto; max-width: 140px; display: inline-block; vertical-align: middle;" />
          </a>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #cbd5e1;">
            Developed by <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #2DD4BF; text-decoration: none; font-weight: 700;">UGS IT Solutions</a> &amp; Maintained by <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #2DD4BF; text-decoration: none; font-weight: 700;">UGS IT Solutions</a>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px;">
            <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #F5B72C; text-decoration: none; font-weight: 600;">https://www.ugsitsolutions.com/</a>
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text, crmLeadUrl };
};

/**
 * Render HTML & plain text for candidate confirmation email
 * CRITICAL: Brief, friendly, professional. Strictly NO sensitive internal notes, no CRM links.
 */
export const renderLeadConfirmationContent = (lead) => {
  const config = getEmailConfig();
  const subject = `🎉 Congratulations! Enquiry Received - Sri Shanmukha Computer Institute`;

  const text = `
Dear ${lead.name},

Congratulations on taking the first step towards building a successful career in technology!

We have successfully received your enquiry for ${lead.courseInterested || 'our professional computer courses'} at Sri Shanmukha Computer Institute (SSCI).

Our academic counselor will get in touch with you shortly at ${lead.phone} to discuss curriculum details, batch timings, certification pathways, and answer any questions you may have.

=========================================================
CONTACT SSCI:
- Campus Address: Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India
- Phone / WhatsApp: +91 7675927519
- Email: sscomputerinstitutenlr@gmail.com
- Working Hours: Monday – Saturday: 8:00 AM – 8:00 PM | Sunday: 9:00 AM – 1:00 PM
- Website: https://sscomputerinstitute.com

Warm regards,
Admissions Team
Sri Shanmukha Computer Institute (SSCI)

=========================================================
Developed by UGS IT Solutions & Maintained by UGS IT Solutions
Website: https://www.ugsitsolutions.com/
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Congratulations! Enquiry Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf9; margin: 0; padding: 20px; color: #123B3A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); border: 1px solid #e2ece9;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #123B3A 0%, #087F78 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <span style="background-color: rgba(245, 183, 44, 0.25); border: 1px solid rgba(245, 183, 44, 0.5); color: #F5B72C; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 14px; border-radius: 20px; text-transform: uppercase;">Admissions Confirmation</span>
        <h1 style="margin: 14px 0 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Congratulations, ${lead.name}! 🎉</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #b2dfdb; font-weight: 600;">Sri Shanmukha Computer Institute &bull; Nellore</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 28px 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #123B3A; margin-top: 0;">Dear ${lead.name},</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #4B6B69;">
          <strong>Congratulations on taking the first step towards upgrading your technical skills and empowering your career!</strong>
          We are pleased to confirm that your enquiry for <strong style="color: #087F78;">${lead.courseInterested || 'our professional training programs'}</strong> has been registered.
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 700;">
            ✓ Your Course Enquiry is Registered
          </p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #15803d; line-height: 1.5;">
            Our academic counselling team will contact you shortly at <strong>${lead.phone}</strong> to guide you through course curriculum details, upcoming batch timings, fees, and enrollment assistance.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #4B6B69;">
          If you have immediate questions, feel free to contact us or visit our institute campus in Nellore.
        </p>

        <!-- Contact SSCI Card (Exact Verified Details) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; font-size: 13px; color: #123B3A; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr>
            <td colspan="2" style="background-color: #e6f4f2; padding: 10px 16px; font-size: 13px; font-weight: 800; color: #087F78; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #d0ebe7;">
              Contact SSCI
            </td>
          </tr>
          <tr>
            <td width="32%" style="padding: 12px 16px 6px 16px; font-weight: 700; color: #4B6B69; vertical-align: top;">Campus Address:</td>
            <td style="padding: 12px 16px 6px 0; color: #123B3A; line-height: 1.4;">
              Dhanalakshmipuram, Opposite More Super Market, Nellore, Andhra Pradesh – 524002, India
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 16px; font-weight: 700; color: #4B6B69;">Call / WhatsApp:</td>
            <td style="padding: 6px 16px 6px 0;">
              <a href="tel:+917675927519" style="color: #087F78; text-decoration: none; font-weight: 700;">+91 7675927519</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 16px; font-weight: 700; color: #4B6B69;">Email Address:</td>
            <td style="padding: 6px 16px 6px 0;">
              <a href="mailto:sscomputerinstitutenlr@gmail.com" style="color: #087F78; text-decoration: none; font-weight: 600;">sscomputerinstitutenlr@gmail.com</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 16px; font-weight: 700; color: #4B6B69;">Working Hours:</td>
            <td style="padding: 6px 16px 6px 0; color: #123B3A;">
              Monday – Saturday: 8:00 AM – 8:00 PM | Sunday: 9:00 AM – 1:00 PM
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 16px 12px 16px; font-weight: 700; color: #4B6B69;">Official Website:</td>
            <td style="padding: 6px 16px 12px 0;">
              <a href="https://sscomputerinstitute.com" style="color: #087F78; text-decoration: none; font-weight: 700;">sscomputerinstitute.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer & UGS IT Solutions Branding -->
    <tr>
      <td style="background-color: #0c2726; padding: 22px 24px; text-align: center; border-top: 2px solid #087F78;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #b2dfdb; font-weight: 600;">
          Sri Shanmukha Computer Institute &bull; Empowering Careers Since 2008
        </p>
        <div style="border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; margin-top: 12px;">
          <a href="https://www.ugsitsolutions.com/" target="_blank" style="text-decoration: none; display: inline-block;">
            <img src="${config.frontendUrl}/ugs-logo.png" alt="UGS IT Solutions Logo" style="height: 30px; width: auto; max-width: 140px; display: inline-block; vertical-align: middle;" />
          </a>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #cbd5e1;">
            Developed by <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #2DD4BF; text-decoration: none; font-weight: 700;">UGS IT Solutions</a> &amp; Maintained by <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #2DD4BF; text-decoration: none; font-weight: 700;">UGS IT Solutions</a>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 11px;">
            <a href="https://www.ugsitsolutions.com/" target="_blank" style="color: #F5B72C; text-decoration: none; font-weight: 600;">https://www.ugsitsolutions.com/</a>
          </p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, html, text };
};

/**
 * Dispatch internal team notification
 */
export const sendTeamLeadNotification = async (lead) => {
  const config = getEmailConfig();
  const { subject, html, text } = renderTeamNotificationContent(lead);

  return await sendEmailWithRetry({
    to: config.teamEmail,
    subject,
    html,
    text,
  });
};

/**
 * Dispatch lead confirmation email (only if lead provided an email address)
 */
export const sendLeadConfirmationEmail = async (lead) => {
  if (!lead.email || typeof lead.email !== 'string' || !lead.email.includes('@')) {
    return {
      success: true,
      status: 'skipped',
      reason: 'No lead email address provided',
      recipient: lead.email || '',
      attempts: 0,
      lastAttemptAt: new Date(),
    };
  }

  const { subject, html, text } = renderLeadConfirmationContent(lead);

  return await sendEmailWithRetry({
    to: lead.email.trim(),
    subject,
    html,
    text,
  });
};

/**
 * Master workflow: Send both team notification and lead confirmation after lead is saved
 * Never throws — returns detailed delivery records for both messages.
 */
export const processLeadNotifications = async (lead) => {
  const teamResult = await sendTeamLeadNotification(lead);
  const leadResult = await sendLeadConfirmationEmail(lead);

  return {
    teamNotification: teamResult,
    leadConfirmation: leadResult,
  };
};

/**
 * Safe retry for existing lead without duplicate messages or duplicate leads
 */
export const retryLeadNotifications = async (lead) => {
  const currentTeamStatus = lead.emailDelivery?.teamNotification?.status;
  const currentLeadStatus = lead.emailDelivery?.leadConfirmation?.status;

  let teamResult = null;
  let leadResult = null;

  // 1. Only retry team notification if not already sent
  if (currentTeamStatus === 'sent') {
    teamResult = {
      ...lead.emailDelivery.teamNotification,
      status: 'sent',
      skippedReason: 'Already successfully sent previously',
    };
  } else {
    teamResult = await sendTeamLeadNotification(lead);
  }

  // 2. Only retry lead confirmation if not already sent
  if (currentLeadStatus === 'sent') {
    leadResult = {
      ...lead.emailDelivery.leadConfirmation,
      status: 'sent',
      skippedReason: 'Already successfully sent previously',
    };
  } else {
    leadResult = await sendLeadConfirmationEmail(lead);
  }

  return {
    teamNotification: teamResult,
    leadConfirmation: leadResult,
  };
};
