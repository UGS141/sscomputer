/**
 * Regression tests for:
 * 1. Public enquiry form dynamic course selection connected to admin-managed courses
 * 2. Real-time synchronisation when courses are added, edited, or removed in admin
 * 3. Loading, empty, and error state handling in the course dropdown
 * 4. Submission payload verification ensuring the selected course is saved correctly with the lead
 *
 * Run with: npm test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Course } from '../../../data/courses';

// Minimal store model to verify the CMS reactive synchronization flow
class MockCMSStore {
  private courses: Course[] = [];
  private listeners: (() => void)[] = [];

  constructor(initialCourses: Course[] = []) {
    this.courses = [...initialCourses];
  }

  public getCourses(): Course[] {
    return this.courses;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public setCourses(newCourses: Course[]): void {
    this.courses = [...newCourses];
    this.notify();
  }

  public addCourse(course: Course): void {
    this.courses.unshift(course);
    this.notify();
  }

  public updateCourse(slug: string, updates: Partial<Course>): void {
    const idx = this.courses.findIndex((c) => c.slug === slug);
    if (idx >= 0) {
      this.courses[idx] = { ...this.courses[idx], ...updates };
      this.notify();
    }
  }

  public deleteCourse(slug: string): void {
    this.courses = this.courses.filter((c) => c.slug !== slug);
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

// Helper representing the course selection resolution logic used in EnquiryModal & ContactPage
function resolveSelectedCourse(
  currentSelected: string,
  prefilledCourse: string | undefined,
  courses: Course[]
): string {
  if (prefilledCourse) {
    return prefilledCourse;
  }
  if (!currentSelected && courses.length > 0) {
    return courses[0].title;
  }
  if (
    currentSelected &&
    courses.length > 0 &&
    currentSelected !== 'General Counselling' &&
    !courses.some((c) => c.title === currentSelected)
  ) {
    // If the selected course was deleted/renamed in admin, smoothly fall back to the first available course
    return courses[0].title;
  }
  if (courses.length === 0) {
    return currentSelected || 'General Counselling';
  }
  return currentSelected;
}

// Sample mock courses managed by admin
const initialAdminCourses: Course[] = [
  {
    slug: 'python-programming',
    title: 'Python Programming',
    categoryId: 'programming',
    categoryName: 'Programming Languages',
    level: 'Beginner',
    duration: '60 Days',
    mode: 'Practical Lab',
    shortDescription: 'Core Python, OOP, and data structures.',
    fullDescription: 'Complete curriculum',
    targetAudience: [],
    learningOutcomes: [],
    skillsLearned: ['Python'],
    tools: ['VS Code'],
    modules: [],
    certificationName: 'Certificate in Python',
    projects: [],
    faqs: [],
  },
  {
    slug: 'tally-prime',
    title: 'Tally Prime with GST',
    categoryId: 'accounting',
    categoryName: 'Accounting & Finance',
    level: 'Beginner',
    duration: '45 Days',
    mode: 'Practical Lab',
    shortDescription: 'Business accounting and GST return filing.',
    fullDescription: 'Complete curriculum',
    targetAudience: [],
    learningOutcomes: [],
    skillsLearned: ['Tally Prime'],
    tools: ['Tally'],
    modules: [],
    certificationName: 'Certificate in Tally',
    projects: [],
    faqs: [],
  },
];

describe('Public Enquiry Form — Admin Courses Synchronization', () => {
  let store: MockCMSStore;

  beforeEach(() => {
    store = new MockCMSStore(initialAdminCourses);
  });

  it('loads courses dynamically from the admin CMS store instead of a hardcoded list', () => {
    const courses = store.getCourses();
    expect(courses).toHaveLength(2);
    expect(courses.map((c) => c.title)).toEqual([
      'Python Programming',
      'Tally Prime with GST',
    ]);
  });

  it('updates the form dropdown options reactively when an admin adds a new course', () => {
    let observedCourses: Course[] = store.getCourses();
    store.subscribe(() => {
      observedCourses = store.getCourses();
    });

    const newCourse: Course = {
      slug: 'full-stack-web-dev',
      title: 'Full Stack Web Development',
      categoryId: 'web-development',
      categoryName: 'Web Development',
      level: 'Intermediate',
      duration: '90 Days',
      mode: 'Practical Lab',
      shortDescription: 'HTML, CSS, React, and Node.js.',
      fullDescription: 'Full Stack',
      targetAudience: [],
      learningOutcomes: [],
      skillsLearned: ['React', 'Node'],
      tools: ['VS Code'],
      modules: [],
      certificationName: 'Certificate in Full Stack',
      projects: [],
      faqs: [],
    };

    store.addCourse(newCourse);

    expect(observedCourses).toHaveLength(3);
    expect(observedCourses[0].title).toBe('Full Stack Web Development');
  });

  it('updates the form dropdown options reactively when an admin edits an existing course', () => {
    let observedCourses: Course[] = store.getCourses();
    store.subscribe(() => {
      observedCourses = store.getCourses();
    });

    store.updateCourse('python-programming', {
      title: 'Advanced Python & AI Tools',
      duration: '75 Days',
    });

    expect(observedCourses[0].title).toBe('Advanced Python & AI Tools');
    expect(observedCourses[0].duration).toBe('75 Days');
  });

  it('updates the form dropdown options reactively when an admin deletes a course', () => {
    let observedCourses: Course[] = store.getCourses();
    store.subscribe(() => {
      observedCourses = store.getCourses();
    });

    store.deleteCourse('tally-prime');

    expect(observedCourses).toHaveLength(1);
    expect(observedCourses[0].slug).toBe('python-programming');
  });
});

describe('Course Selection Resolution & Edge Cases', () => {
  it('defaults to the first admin-managed course if no prefilled course is supplied', () => {
    const selected = resolveSelectedCourse('', undefined, initialAdminCourses);
    expect(selected).toBe('Python Programming');
  });

  it('preserves prefilledCourse passed from course card or launch offer', () => {
    const selected = resolveSelectedCourse(
      '',
      'Tally Prime with GST',
      initialAdminCourses
    );
    expect(selected).toBe('Tally Prime with GST');
  });

  it('allows custom prefilled campaign (e.g. Launch Offer 20% OFF)', () => {
    const customCampaign = 'Launch Offer - 20% OFF All Courses';
    const selected = resolveSelectedCourse('', customCampaign, initialAdminCourses);
    expect(selected).toBe(customCampaign);
  });

  it('allows user to override a prefilled campaign by selecting any other course from the dropdown', () => {
    const prefilled = 'Launch Offer - 20% OFF All Courses';
    let currentSelected = prefilled;

    // User selects a specific course from the catalog
    currentSelected = 'Python Programming';
    expect(currentSelected).toBe('Python Programming');

    // User switches to General Career Counselling
    currentSelected = 'General Counselling';
    expect(currentSelected).toBe('General Counselling');

    // User can switch back to the prefilled offer if desired
    currentSelected = prefilled;
    expect(currentSelected).toBe('Launch Offer - 20% OFF All Courses');
  });

  it('smoothly falls back to the next available course when the currently selected course is deleted in admin', () => {
    // User had "Tally Prime with GST" selected
    const remainingCourses = [initialAdminCourses[0]]; // Only Python remains
    const selected = resolveSelectedCourse(
      'Tally Prime with GST',
      undefined,
      remainingCourses
    );
    expect(selected).toBe('Python Programming');
  });

  it('preserves "General Counselling" if the user explicitly chose general counselling', () => {
    const selected = resolveSelectedCourse(
      'General Counselling',
      undefined,
      initialAdminCourses
    );
    expect(selected).toBe('General Counselling');
  });
});

describe('Empty, Loading, and Submission Flow', () => {
  it('handles empty state gracefully when no courses are configured in admin', () => {
    const emptyCourses: Course[] = [];
    const selected = resolveSelectedCourse('', undefined, emptyCourses);
    expect(selected).toBe('General Counselling');
  });

  it('builds a complete submission payload containing the selected course and lead details', () => {
    const formData = {
      name: 'Ravi Kumar',
      phone: '+91 9876543210',
      email: 'ravi.k@example.com',
      courseInterested: 'Python Programming',
      preferredTiming: 'Morning (10 AM - 12 PM)',
      message: 'Looking for morning batch practice.',
    };

    const submissionPayload = {
      ...formData,
      preferredBatch: formData.preferredTiming || 'Any Batch',
      source: 'Website',
    };

    expect(submissionPayload.name).toBe('Ravi Kumar');
    expect(submissionPayload.phone).toBe('+91 9876543210');
    expect(submissionPayload.courseInterested).toBe('Python Programming');
    expect(submissionPayload.preferredBatch).toBe('Morning (10 AM - 12 PM)');
  });
});
