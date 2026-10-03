export interface LaunchOfferConfig {
  enabled: boolean;
  discountBadge: string;
  title: string;
  subtitle: string;
  description: string;
  /**
   * Fixed ISO 8601 Expiry Timestamp for the campaign (1 week from launch)
   * Example: '2026-10-11T23:59:59+05:30'
   */
  expiresAt: string;
  ctaText: string;
}

// Calculate default 7 days from current time for launch campaign if needed,
// but fix it to an explicit ISO timestamp so all visitors see the exact same expiry.
export const LAUNCH_OFFER_CONFIG: LaunchOfferConfig = {
  enabled: true,
  discountBadge: '20% OFF',
  title: '20% OFF ON ALL COURSES',
  subtitle: 'LIMITED TIME OFFER',
  description: 'Celebrate our launch with an exclusive offer on every course.',
  // Fixed campaign expiry date (7 days from website launch)
  expiresAt: '2026-10-11T23:59:59+05:30',
  ctaText: 'Register Now',
};
