import { describe, it, expect } from 'vitest';

describe('Academic Management System — Core Rules & Logic Verification', () => {
  describe('1. Attendance Percentage Calculation Formula', () => {
    // Formula: ((Present + Late) / Eligible Scheduled Sessions) * 100
    // Excused counts as absent in percentage (in denominator, not numerator)
    // Future/canceled sessions excluded. Not marked excluded from denominator.
    const calculateAttendancePercentage = (records: {
      status: 'Present' | 'Late' | 'Absent' | 'Excused' | 'Not Marked';
      isEligibleConducted: boolean;
    }[]) => {
      let present = 0;
      let late = 0;
      let absent = 0;
      let excused = 0;

      for (const r of records) {
        if (!r.isEligibleConducted) continue; // skip future or canceled
        if (r.status === 'Present') present++;
        else if (r.status === 'Late') late++;
        else if (r.status === 'Absent') absent++;
        else if (r.status === 'Excused') excused++;
        // 'Not Marked' is pending, excluded from denominator
      }

      const eligibleScheduledSessions = present + late + absent + excused;
      if (eligibleScheduledSessions === 0) return 0;

      const percentage = ((present + late) / eligibleScheduledSessions) * 100;
      return Math.round(percentage * 10) / 10;
    };

    it('correctly calculates 100% attendance when all sessions are Present or Late', () => {
      const records = [
        { status: 'Present' as const, isEligibleConducted: true },
        { status: 'Present' as const, isEligibleConducted: true },
        { status: 'Late' as const, isEligibleConducted: true },
      ];
      expect(calculateAttendancePercentage(records)).toBe(100);
    });

    it('treats Late as present in numerator and Excused in denominator only', () => {
      const records = [
        { status: 'Present' as const, isEligibleConducted: true }, // 1
        { status: 'Late' as const, isEligibleConducted: true },    // 1
        { status: 'Absent' as const, isEligibleConducted: true },  // 0
        { status: 'Excused' as const, isEligibleConducted: true }, // 0
      ];
      // (1 + 1) / 4 = 2/4 = 50%
      expect(calculateAttendancePercentage(records)).toBe(50);
    });

    it('excludes Not Marked, future, and cancelled sessions from denominator', () => {
      const records = [
        { status: 'Present' as const, isEligibleConducted: true },
        { status: 'Absent' as const, isEligibleConducted: true },
        { status: 'Not Marked' as const, isEligibleConducted: true }, // pending: excluded
        { status: 'Present' as const, isEligibleConducted: false },   // future/cancelled: excluded
      ];
      // Present: 1, Absent: 1 => 1/2 = 50%
      expect(calculateAttendancePercentage(records)).toBe(50);
    });

    it('safely handles 0 sessions conducted without NaN or division by zero', () => {
      const records: { status: 'Present' | 'Late' | 'Absent' | 'Excused' | 'Not Marked'; isEligibleConducted: boolean }[] = [];
      expect(calculateAttendancePercentage(records)).toBe(0);
    });
  });

  describe('2. Schedule & Session Generation Rules', () => {
    const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const generateDates = (startDateStr: string, endDateStr: string, weekdays: string[], holidays: string[]) => {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      const targetDays = weekdays.map((w) => WEEKDAY_NAMES.findIndex((name) => name.toLowerCase().startsWith(w.toLowerCase().slice(0, 3))));
      const holidaySet = new Set(holidays);

      const generated: string[] = [];
      let current = new Date(startDate);

      while (current <= endDate) {
        const dayOfWeek = current.getDay();
        const dateStr = current.toISOString().split('T')[0];

        if (targetDays.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
          generated.push(dateStr);
        }
        current.setDate(current.getDate() + 1);
      }

      return generated;
    };

    it('generates sessions only on configured teaching weekdays', () => {
      // 2026-06-01 is Monday, 2026-06-07 is Sunday (7 days)
      const dates = generateDates('2026-06-01', '2026-06-07', ['Monday', 'Wednesday', 'Friday'], []);
      expect(dates).toEqual(['2026-06-01', '2026-06-03', '2026-06-05']);
      expect(dates.length).toBe(3);
    });

    it('skips designated holidays during session generation', () => {
      const holidays = ['2026-06-03']; // Wednesday is a holiday
      const dates = generateDates('2026-06-01', '2026-06-07', ['Monday', 'Wednesday', 'Friday'], holidays);
      expect(dates).toEqual(['2026-06-01', '2026-06-05']);
      expect(dates.length).toBe(2);
    });
  });

  describe('3. Dual Course Completion Policy', () => {
    interface CompletionCheckParams {
      actualAttendancePercentage: number;
      minAttendanceRequired: number;
      modules: { isRequired: boolean; status: string; assessmentPassed?: boolean }[];
    }

    const evaluateCompletion = ({ actualAttendancePercentage, minAttendanceRequired, modules }: CompletionCheckParams) => {
      const attendanceMet = actualAttendancePercentage >= minAttendanceRequired;
      const requiredModules = modules.filter((m) => m.isRequired);
      const learningMet =
        requiredModules.length > 0
          ? requiredModules.every((m) => m.status === 'Completed' && m.assessmentPassed !== false)
          : true;

      return {
        eligible: attendanceMet && learningMet,
        attendanceMet,
        learningMet,
      };
    };

    it('grants eligibility when both attendance and syllabus requirements are satisfied', () => {
      const result = evaluateCompletion({
        actualAttendancePercentage: 80,
        minAttendanceRequired: 75,
        modules: [
          { isRequired: true, status: 'Completed', assessmentPassed: true },
          { isRequired: true, status: 'Completed', assessmentPassed: true },
          { isRequired: false, status: 'In Progress', assessmentPassed: false }, // optional
        ],
      });

      expect(result.attendanceMet).toBe(true);
      expect(result.learningMet).toBe(true);
      expect(result.eligible).toBe(true);
    });

    it('denies eligibility when attendance requirement is not met', () => {
      const result = evaluateCompletion({
        actualAttendancePercentage: 72, // below 75%
        minAttendanceRequired: 75,
        modules: [
          { isRequired: true, status: 'Completed', assessmentPassed: true },
        ],
      });

      expect(result.attendanceMet).toBe(false);
      expect(result.learningMet).toBe(true);
      expect(result.eligible).toBe(false);
    });

    it('denies eligibility when a required module is incomplete or failed', () => {
      const result = evaluateCompletion({
        actualAttendancePercentage: 90,
        minAttendanceRequired: 75,
        modules: [
          { isRequired: true, status: 'Completed', assessmentPassed: true },
          { isRequired: true, status: 'Needs Revision', assessmentPassed: false },
        ],
      });

      expect(result.attendanceMet).toBe(true);
      expect(result.learningMet).toBe(false);
      expect(result.eligible).toBe(false);
    });
  });

  describe('4. Enrollment Duplicate Prevention & Fee Calculation', () => {
    it('prevents adding students who are already enrolled in the course', () => {
      const existingEnrolled = new Set(['SSCI-STD-2026-01', 'SSCI-STD-2026-02']);
      const candidates = ['SSCI-STD-2026-01', 'SSCI-STD-2026-03', 'SSCI-STD-2026-04'];

      const toEnroll: string[] = [];
      const skipped: string[] = [];

      candidates.forEach((id) => {
        if (existingEnrolled.has(id)) {
          skipped.push(id);
        } else {
          toEnroll.push(id);
        }
      });

      expect(toEnroll).toEqual(['SSCI-STD-2026-03', 'SSCI-STD-2026-04']);
      expect(skipped).toEqual(['SSCI-STD-2026-01']);
    });

    it('correctly calculates net payable fee after discount', () => {
      const baseFee = 5000;
      const discount = 1000;
      const netFee = Math.max(0, baseFee - discount);
      expect(netFee).toBe(4000);

      // Disallow negative net fee
      const excessiveDiscount = 6000;
      const boundedFee = Math.max(0, baseFee - excessiveDiscount);
      expect(boundedFee).toBe(0);
    });
  });
});
