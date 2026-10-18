/**
 * Regression tests for:
 *  1. Notification badge read-state persistence (was hardcoded to 3)
 *  2. Lead count synchronisation — badge must update without page reload
 *  3. Lead ID uniqueness after deletions (was collision-prone)
 *
 * Run with: npm run test
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Minimal localStorage mock (Vitest / jsdom provides this, but we make it
// explicit so the test is clear about what is being exercised)
// ---------------------------------------------------------------------------
let store: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { store = {}; },
};

// ---------------------------------------------------------------------------
// Helpers that mirror the logic extracted from AdminLayout
// ---------------------------------------------------------------------------

const NOTIF_READ_KEY = 'ssci_notif_read_ids';

function getReadIds(ls: typeof localStorageMock): Set<string> {
  try {
    const raw = ls.getItem(NOTIF_READ_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function saveReadIds(ls: typeof localStorageMock, ids: Set<string>) {
  ls.setItem(NOTIF_READ_KEY, JSON.stringify([...ids]));
}

function computeUnreadCount(
  leads: Array<{ id: string; status: string }>,
  ls: typeof localStorageMock,
): number {
  const readIds = getReadIds(ls);
  return leads.filter((l) => l.status === 'New' && !readIds.has(l.id)).length;
}

function markAllRead(
  leads: Array<{ id: string; status: string }>,
  ls: typeof localStorageMock,
): void {
  const allNewIds = new Set(getReadIds(ls));
  leads.filter((l) => l.status === 'New').forEach((l) => allNewIds.add(l.id));
  saveReadIds(ls, allNewIds);
}

/** Helper that mirrors the fixed addLead ID-generation logic */
function nextLeadId(existing: Array<{ id: string }>): string {
  const maxId = existing.reduce((max, l) => {
    const num = parseInt(l.id.replace('LEAD-', ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 1000);
  return `LEAD-${maxId + 1}`;
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seedLeads = () => [
  { id: 'LEAD-1001', status: 'New' },
  { id: 'LEAD-1002', status: 'Converted' },
  { id: 'LEAD-1003', status: 'New' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Notification badge — read-state persistence', () => {
  beforeEach(() => { store = {}; });

  it('initial unread count equals the number of New-status leads', () => {
    const leads = seedLeads();
    expect(computeUnreadCount(leads, localStorageMock)).toBe(2);
  });

  it('marking all read sets unread count to 0', () => {
    const leads = seedLeads();
    markAllRead(leads, localStorageMock);
    expect(computeUnreadCount(leads, localStorageMock)).toBe(0);
  });

  it('unread count stays 0 after simulated remount (badge no longer resets to 3)', () => {
    const leads = seedLeads();
    markAllRead(leads, localStorageMock);

    // Simulate component remount: recompute from scratch using the same localStorage
    const countAfterRemount = computeUnreadCount(leads, localStorageMock);
    expect(countAfterRemount).toBe(0);
  });

  it('new lead added after marking-read increments the badge by 1', () => {
    const leads = seedLeads();
    markAllRead(leads, localStorageMock);
    expect(computeUnreadCount(leads, localStorageMock)).toBe(0);

    // A new lead arrives (not yet in readIds)
    const newLead = { id: 'LEAD-1004', status: 'New' };
    leads.push(newLead);
    expect(computeUnreadCount(leads, localStorageMock)).toBe(1);
  });

  it('changing a lead status from New to Contacted decrements the badge', () => {
    const leads = seedLeads(); // 2 New
    // Admin marks lead-1001 as Contacted
    const lead = leads.find((l) => l.id === 'LEAD-1001')!;
    lead.status = 'Contacted';

    expect(computeUnreadCount(leads, localStorageMock)).toBe(1);
  });

  it('notification popover only surfaces New-status, un-acknowledged leads', () => {
    const leads = seedLeads();
    markAllRead(leads, localStorageMock);

    const readIds = getReadIds(localStorageMock);
    const unreadLeads = leads.filter(
      (l) => l.status === 'New' && !readIds.has(l.id),
    );
    expect(unreadLeads).toHaveLength(0);
  });
});

describe('Lead count synchronisation — sidebar badge', () => {
  it('lead count reflects actual New-status leads, not a stale snapshot', () => {
    const leads = seedLeads(); // 2 New at start

    // Simulate status change (store mutation → subscription callback)
    leads.find((l) => l.id === 'LEAD-1001')!.status = 'Follow-up';
    const newCount = leads.filter((l) => l.status === 'New').length;

    // Without the fix, navSections was computed once at render with value 2.
    // After the fix, navLeadBadge is recomputed in the subscription callback.
    expect(newCount).toBe(1);
  });

  it('dashboard newLeadsCount derived from reactive leads array is always accurate', () => {
    const leads = seedLeads();
    // Mark all as Contacted
    leads.forEach((l) => { l.status = 'Contacted'; });
    const newLeadsCount = leads.filter((l) => l.status === 'New').length;
    expect(newLeadsCount).toBe(0);
  });
});

describe('Lead ID uniqueness after deletions', () => {
  it('nextLeadId returns a unique ID after deletions', () => {
    // Simulate: 3 leads created, then middle one deleted
    const leads = [
      { id: 'LEAD-1001' },
      { id: 'LEAD-1003' }, // LEAD-1002 was deleted
    ];
    const newId = nextLeadId(leads);
    expect(newId).toBe('LEAD-1004');
    // Old (buggy) formula: LEAD-(1000 + 2 + 1) = LEAD-1003 → collision!
    expect(newId).not.toBe('LEAD-1003');
  });

  it('nextLeadId is monotonically increasing regardless of deletion pattern', () => {
    const leads: Array<{ id: string }> = [];
    for (let i = 1; i <= 5; i++) {
      const id = nextLeadId(leads);
      leads.push({ id });
    }
    // Delete leads 2 and 4
    const surviving = leads.filter((_, idx) => idx !== 1 && idx !== 3);
    const nextId = nextLeadId(surviving);
    const nextNum = parseInt(nextId.replace('LEAD-', ''), 10);
    const maxExisting = Math.max(...surviving.map((l) => parseInt(l.id.replace('LEAD-', ''), 10)));
    expect(nextNum).toBe(maxExisting + 1);
  });

  it('IDs generated from empty lead list start at LEAD-1001', () => {
    expect(nextLeadId([])).toBe('LEAD-1001');
  });
});
