/**
 * Centralized SEO & Conversion Analytics Event Tracker
 * Safely dispatches analytics events (course_view, enquiry_click, whatsapp_click, phone_click, etc.)
 */

export type SEOEventType =
  | 'course_view'
  | 'batch_view'
  | 'enquiry_click'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'course_enquiry'
  | 'contact_form_submit'
  | 'certificate_verification'
  | 'social_click'
  | 'blog_view';

export const trackSEOEvent = (eventName: SEOEventType, data?: Record<string, any>) => {
  try {
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data,
    };

    // 1. Safe console log in dev
    if (import.meta.env.DEV) {
      console.log(`[SEO Event]: ${eventName}`, payload);
    }

    // 2. Hook into window.dataLayer (Google Tag Manager / GA4) if available
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push(payload);
    }

    // 3. Hook into gtag if available
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, data);
    }
  } catch (err) {
    // Non-blocking error handler
    console.warn('[Analytics Error]', err);
  }
};
