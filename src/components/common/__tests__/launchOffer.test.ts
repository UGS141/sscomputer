import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LAUNCH_OFFER_CONFIG } from '../../../config/launchOffer';

describe('Launch Offer Configuration & Countdown Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has a valid expiresAt timestamp configured for December 2026', () => {
    expect(LAUNCH_OFFER_CONFIG.enabled).toBe(true);
    expect(LAUNCH_OFFER_CONFIG.expiresAt).toBe('2026-12-05T23:59:59+05:30');
    
    const expiryDate = new Date(LAUNCH_OFFER_CONFIG.expiresAt);
    expect(expiryDate.getTime()).not.toBeNaN();
    expect(expiryDate.getFullYear()).toBe(2026);
    expect(expiryDate.getMonth()).toBe(11); // December (0-indexed)
    expect(expiryDate.getDate()).toBe(5);
  });

  it('calculates 48 days remaining when viewed on October 18, 2026 evening', () => {
    // Oct 18, 2026 20:07:06+05:30 (time user requested the 48-day timer)
    const simulatedNow = new Date('2026-10-18T20:07:06+05:30').getTime();
    vi.setSystemTime(simulatedNow);

    const targetTime = new Date(LAUNCH_OFFER_CONFIG.expiresAt).getTime();
    const difference = targetTime - simulatedNow;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    expect(days).toBe(48);
    expect(hours).toBe(3);
  });

  it('correctly indicates campaign active status prior to expiry', () => {
    vi.setSystemTime(new Date('2026-10-18T20:07:06+05:30'));
    const isCampaignActive = new Date().getTime() < new Date(LAUNCH_OFFER_CONFIG.expiresAt).getTime();
    expect(isCampaignActive).toBe(true);
  });

  it('correctly indicates campaign expired status after expiry date', () => {
    vi.setSystemTime(new Date('2026-12-06T00:00:00+05:30'));
    const isCampaignActive = new Date().getTime() < new Date(LAUNCH_OFFER_CONFIG.expiresAt).getTime();
    expect(isCampaignActive).toBe(false);
  });
});
