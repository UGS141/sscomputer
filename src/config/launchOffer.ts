export interface LaunchOfferConfig {
  enabled: boolean;
  discountBadge: string;
  title: string;
  subtitle: string;
  description: string;
  /**
   * Fixed campaign duration: 14 days
   * Start: '2026-10-04T00:00:00+05:30'
   * Expiry: '2026-10-18T23:59:59+05:30'
   */
  startAt: string;
  expiresAt: string;
  ctaText: string;
}

export const LAUNCH_OFFER_CONFIG: LaunchOfferConfig = {
  enabled: true,
  discountBadge: '20% OFF',
  title: '20% OFF ON ALL COURSES',
  subtitle: 'LIMITED TIME OFFER',
  description: 'Celebrate our launch with an exclusive offer on every course.',
  // Fixed 14-day campaign timestamps
  startAt: '2026-10-04T00:00:00+05:30',
  expiresAt: '2026-10-18T23:59:59+05:30',
  ctaText: 'Register Now',
};
