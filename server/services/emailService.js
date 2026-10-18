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

    // Resend HTTP API alternative
    resendApiKey: process.env.RESEND_API_KEY?.trim() || '',

    // Configurable Recipient & Sender
    teamEmail:
      process.env.CONSULTANCY_TEAM_EMAIL?.trim() ||
      process.env.ADMIN_EMAIL?.trim() ||
      'sscomputerinstitutenlr@gmail.com, ugssolutions1@gmail.com',
    fromEmail:
      process.env.EMAIL_FROM?.trim() ||
      '"Sri Shanmukha Computer Institute" <admissions@sscomputerinstitute.com>',

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
  const hasSmtp = Boolean(config.smtpHost && config.smtpUser && config.smtpPass);
  const hasResend = Boolean(config.resendApiKey);

  const missingVariables = [];

  if (!hasSmtp && !hasResend) {
    if (config.smtpHost || config.smtpUser || config.smtpPass) {
      if (!config.smtpHost) missingVariables.push('SMTP_HOST');
      if (!config.smtpUser) missingVariables.push('SMTP_USER');
      if (!config.smtpPass) missingVariables.push('SMTP_PASS');
    } else {
      missingVariables.push('SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS');
      missingVariables.push('OR: RESEND_API_KEY');
    }
    if (!process.env.CONSULTANCY_TEAM_EMAIL) {
      missingVariables.push('CONSULTANCY_TEAM_EMAIL (optional, defaults to admissions@sscomputerinstitute.com)');
    }
  }

  return {
    isConfigured: hasSmtp || hasResend,
    activeProvider: hasResend ? 'resend' : hasSmtp ? 'smtp' : null,
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
    // Reasonable timeouts to prevent hanging backend requests
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  return cachedTransporter;
};

export const normalizeRecipients = (to) => {
  if (Array.isArray(to)) return to.map((s) => String(s).trim()).filter(Boolean);
  if (typeof to === 'string') return to.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

/**
 * Send an email directly via the configured provider (SMTP or Resend API)
 */
export const sendRawEmail = async ({ to, subject, html, text }) => {
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

  if (!status.isConfigured) {
    const errorMsg =
      'Email credentials are not configured in environment variables. ' +
      `Required: SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) or RESEND_API_KEY. ` +
      `Delivery skipped.`;
    console.warn(`[EmailService] ${errorMsg}`);
    return {
      success: false,
      status: 'skipped',
      error: errorMsg,
      recipient: recipientStr,
    };
  }

  // 1. Resend API Dispatch
  if (status.activeProvider === 'resend') {
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

    const data = await response.json();
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

  // 2. SMTP Dispatch (nodemailer)
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
export const sendEmailWithRetry = async ({ to, subject, html, text, maxRetries = 2 }) => {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const result = await sendRawEmail({ to, subject, html, text });
      // If skipped due to missing config, do not retry
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

      // If more retries left, wait with exponential backoff
      if (attempt <= maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  return {
    success: false,
    status: 'failed',
    error: lastError?.message || 'Unknown email delivery failure',
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

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fbfb; padding: 16px 24px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eef2f1;">
        Sri Shanmukha Computer Institute (SSCI) &bull; Automated CRM Notification System
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
  const subject = `Enquiry Received - Sri Shanmukha Computer Institute`;

  const text = `
Dear ${lead.name},

Thank you for contacting Sri Shanmukha Computer Institute (SSCI). We have received your enquiry for ${lead.courseInterested || 'our professional computer courses'}.

Our academic counselor will get in touch with you shortly at ${lead.phone} to discuss curriculum details, batch timings, and answers to any questions you may have.

INSTITUTE CONTACT INFORMATION:
- Phone: +91 94948 24343 / +91 94411 25424
- WhatsApp: +91 94948 24343
- Email: admissions@sscomputerinstitute.com
- Address: Upstairs Sri Chaitanya Techno School, Ramamurthy Nagar, Main Road, Nellore, AP - 524001
- Website: https://sscomputerinstitute.com

Warm regards,
Admissions Team
Sri Shanmukha Computer Institute (SSCI)
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank you for your enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7faf9; margin: 0; padding: 20px; color: #123B3A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.05); border: 1px solid #e2ece9;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #123B3A 0%, #087F78 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Sri Shanmukha Computer Institute</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #F5B72C; font-weight: 600;">ISO 9001:2015 Certified Educational Institution</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 28px 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #123B3A; margin-top: 0;">Dear ${lead.name},</h2>
        
        <p style="font-size: 14px; line-height: 1.6; color: #4B6B69;">
          Thank you for reaching out to us! We have successfully received your enquiry regarding 
          <strong style="color: #087F78;">${lead.courseInterested || 'our training programs'}</strong>.
        </p>

        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 600;">
            ✓ What's next?
          </p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #15803d; line-height: 1.5;">
            Our academic counselling team will contact you shortly at <strong>${lead.phone}</strong> to share syllabus details, upcoming batch timings, and assist you with course registration.
          </p>
        </div>

        <p style="font-size: 13px; line-height: 1.6; color: #4B6B69;">
          If you have immediate questions, feel free to contact us or visit our institute campus in Nellore.
        </p>

        <!-- Contact Cards -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 1px solid #eef2f1; padding-top: 20px; font-size: 12px; color: #4B6B69;">
          <tr>
            <td style="padding-bottom: 8px;">
              <strong>Call / WhatsApp:</strong> <a href="tel:+919494824343" style="color: #087F78; text-decoration: none; font-weight: 700;">+91 94948 24343</a> / <a href="tel:+919441125424" style="color: #087F78; text-decoration: none; font-weight: 700;">+91 94411 25424</a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong>Email:</strong> <a href="mailto:admissions@sscomputerinstitute.com" style="color: #087F78; text-decoration: none;">admissions@sscomputerinstitute.com</a>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom: 8px;">
              <strong>Campus Address:</strong> Upstairs Sri Chaitanya Techno School, Ramamurthy Nagar, Main Road, Nellore, AP - 524001
            </td>
          </tr>
          <tr>
            <td>
              <strong>Website:</strong> <a href="https://sscomputerinstitute.com" style="color: #087F78; text-decoration: none;">sscomputerinstitute.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fbfb; padding: 16px 24px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eef2f1;">
        Sri Shanmukha Computer Institute &bull; Empowering Careers Since 2008
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
