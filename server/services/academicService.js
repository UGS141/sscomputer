import { Course } from '../models/Course.js';
import { Student } from '../models/Student.js';
import { Enrollment } from '../models/Enrollment.js';
import { Session } from '../models/Session.js';
import { Attendance } from '../models/Attendance.js';
import { ModuleProgress } from '../models/ModuleProgress.js';

/**
 * ACADEMIC SAAS ENGINE:
 * Session Generation, Attendance Evaluation, Syllabus Tracking, and Course Completion Policy
 */

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Normalizes day string or number to 0-6 (0 = Sunday, 1 = Monday, etc.)
 */
const normalizeDay = (day) => {
  if (typeof day === 'number') return day % 7;
  if (!day || typeof day !== 'string') return -1;
  const lower = day.trim().toLowerCase();
  return WEEKDAY_NAMES.findIndex((name) => name.toLowerCase().startsWith(lower.slice(0, 3)));
};

/**
 * Formats Date object to YYYY-MM-DD
 */
export const formatDateStr = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 1. Generate Scheduled Sessions based on Course Timetable Configuration
 * Idempotent: Preserves completed and historical sessions; updates future sessions.
 */
export const generateCourseSessions = async (course) => {
  if (!course || !course.slug) throw new Error('Valid course is required for session generation');

  const schedule = course.schedule || {};
  const startDateStr = schedule.startDate;
  const endDateStr = schedule.endDate;

  if (!startDateStr || !endDateStr) {
    return { success: false, message: 'Course schedule must have both startDate and endDate configured.', sessions: [] };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
    throw new Error('Invalid schedule date range. startDate must be earlier than or equal to endDate.');
  }

  const rawWeekdays = schedule.weekdays && schedule.weekdays.length > 0 ? schedule.weekdays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const targetDays = rawWeekdays.map(normalizeDay).filter((d) => d >= 0);

  if (targetDays.length === 0) {
    throw new Error('Course schedule must configure at least one valid weekday.');
  }

  const holidays = new Set((schedule.holidays || []).map((h) => formatDateStr(h)));
  const startTime = schedule.dailyStartTime || '10:00';
  const endTime = schedule.dailyEndTime || '12:00';

  // Fetch existing sessions for this course
  const existingSessions = await Session.find({ courseSlug: course.slug });
  const existingByDate = new Map();
  existingSessions.forEach((s) => existingByDate.set(s.date, s));

  const todayStr = formatDateStr(new Date());
  let current = new Date(startDate);
  let sessionNumber = 1;
  const sessionsToSave = [];
  let preservedCount = 0;
  let newCreatedCount = 0;

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dateStr = formatDateStr(current);

    if (targetDays.includes(dayOfWeek) && !holidays.has(dateStr)) {
      const existing = existingByDate.get(dateStr);

      if (existing) {
        // If session was completed or already had attendance marked, PRESERVE IT (do not rewrite historical sessions)
        if (existing.status === 'Completed' || existing.attendanceFinalized || dateStr < todayStr) {
          preservedCount++;
          sessionNumber++;
          current.setDate(current.getDate() + 1);
          continue;
        }

        // Update future scheduled session if time changed
        existing.startTime = startTime;
        existing.endTime = endTime;
        existing.courseTitle = course.title;
        existing.sessionNumber = sessionNumber;
        await existing.save();
        preservedCount++;
      } else {
        // Create new session
        const sessionId = `SES-${course.slug.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}-${String(sessionNumber).padStart(2, '0')}`;
        sessionsToSave.push({
          id: sessionId,
          courseSlug: course.slug,
          courseTitle: course.title,
          sessionNumber,
          title: `Class ${sessionNumber} - ${course.title}`,
          date: dateStr,
          startTime,
          endTime,
          status: 'Scheduled',
          isHoliday: false,
          attendanceFinalized: false,
        });
        newCreatedCount++;
      }
      sessionNumber++;
    }

    current.setDate(current.getDate() + 1);
  }

  if (sessionsToSave.length > 0) {
    await Session.insertMany(sessionsToSave);
  }

  const allSessions = await Session.find({ courseSlug: course.slug }).sort({ date: 1, startTime: 1 });

  return {
    success: true,
    message: `Generated ${newCreatedCount} new sessions. Preserved ${preservedCount} existing sessions. Total: ${allSessions.length}.`,
    totalSessions: allSessions.length,
    newCreatedCount,
    preservedCount,
    sessions: allSessions,
  };
};

/**
 * 1B. Generate Scheduled Sessions for a Specific Batch Timetable
 */
export const generateBatchSessions = async (batch, course) => {
  if (!batch || !batch.id) throw new Error('Valid batch is required for session generation');

  const startDateStr = batch.startDate;
  const endDateStr = batch.endDate || course?.schedule?.endDate;

  if (!startDateStr || !endDateStr) {
    return { success: false, message: 'Batch must have both startDate and endDate configured.', sessions: [] };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
    throw new Error('Invalid batch date range. startDate must be earlier than or equal to endDate.');
  }

  const rawWeekdays = batch.weekdays && batch.weekdays.length > 0
    ? batch.weekdays
    : (course?.schedule?.weekdays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const targetDays = rawWeekdays.map(normalizeDay).filter((d) => d >= 0);

  if (targetDays.length === 0) {
    throw new Error('Batch schedule must configure at least one valid weekday.');
  }

  const holidays = new Set([
    ...(batch.holidays || []),
    ...(course?.schedule?.holidays || []),
  ].map((h) => formatDateStr(h)));

  const startTime = batch.startTime || course?.schedule?.dailyStartTime || '10:00';
  const endTime = batch.endTime || course?.schedule?.dailyEndTime || '12:00';

  // Fetch existing sessions for this batch
  const existingSessions = await Session.find({ batchId: batch.id });
  const existingByDate = new Map();
  existingSessions.forEach((s) => existingByDate.set(s.date, s));

  const todayStr = formatDateStr(new Date());
  let current = new Date(startDate);
  let sessionNumber = 1;
  const sessionsToSave = [];
  let preservedCount = 0;
  let newCreatedCount = 0;

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dateStr = formatDateStr(current);

    if (targetDays.includes(dayOfWeek) && !holidays.has(dateStr)) {
      const existing = existingByDate.get(dateStr);

      if (existing) {
        if (existing.status === 'Completed' || existing.attendanceFinalized || dateStr < todayStr) {
          preservedCount++;
          sessionNumber++;
          current.setDate(current.getDate() + 1);
          continue;
        }

        existing.startTime = startTime;
        existing.endTime = endTime;
        existing.courseTitle = course?.title || batch.courseName;
        existing.batchName = batch.name || batch.id;
        sessionsToSave.push(existing);
      } else {
        const newSession = new Session({
          id: `SES-${batch.id}-${sessionNumber}-${Date.now().toString().slice(-4)}`,
          courseSlug: batch.courseSlug,
          courseTitle: course?.title || batch.courseName,
          batchId: batch.id,
          batchName: batch.name || batch.id,
          sessionNumber,
          title: `Session ${sessionNumber}: Class Lecture & Lab`,
          date: dateStr,
          startTime,
          endTime,
          status: 'Scheduled',
          isHoliday: false,
        });
        sessionsToSave.push(newSession);
        newCreatedCount++;
      }
      sessionNumber++;
    }
    current.setDate(current.getDate() + 1);
  }

  for (const s of sessionsToSave) {
    await s.save();
  }

  const allSessions = await Session.find({ batchId: batch.id }).sort({ date: 1, startTime: 1 });
  return {
    success: true,
    message: `Generated ${newCreatedCount} new sessions, preserved ${preservedCount} existing sessions. Total sessions: ${allSessions.length}.`,
    sessions: allSessions,
    newCreatedCount,
    preservedCount,
    totalSessions: allSessions.length,
  };
};

/**
 * 2. Calculate Enrollment Attendance according to Exact Section 7 Rules:
 * Formula: ((Present + Late) / Eligible Scheduled Sessions) * 100
 * - Present = attended
 * - Late = attended
 * - Absent = absent
 * - Excused = absent for percentage calculation (separately displayed)
 * - Not Marked = pending, excluded from finalized attendance calculations until resolved.
 * - Excludes canceled sessions, future sessions, and sessions prior to student admission/enrollment.
 */
export const calculateEnrollmentAttendance = async (enrollmentId, courseSlug, studentAdmissionDate) => {
  const enrollment = await Enrollment.findOne({ id: enrollmentId });
  if (!enrollment) throw new Error(`Enrollment "${enrollmentId}" not found`);

  const effectiveCourseSlug = courseSlug || enrollment.courseSlug;
  const todayStr = formatDateStr(new Date());

  // Determine enrollment cutoff date: exclude sessions held before student enrolled
  const enrollmentStartDate = studentAdmissionDate
    ? formatDateStr(studentAdmissionDate)
    : enrollment.enrollmentDate
    ? formatDateStr(enrollment.enrollmentDate)
    : '1970-01-01';

  // 1. Fetch eligible sessions (belonging to batch if set, or course, not cancelled, past or today, on/after student enrollment)
  const sessionFilter = {
    status: { $ne: 'Cancelled' },
    date: { $lte: todayStr, $gte: enrollmentStartDate },
  };
  if (enrollment.batchId) {
    sessionFilter.batchId = enrollment.batchId;
  } else {
    sessionFilter.courseSlug = effectiveCourseSlug;
  }

  const eligibleSessions = await Session.find(sessionFilter).sort({ date: 1 });

  const eligibleSessionIds = new Set(eligibleSessions.map((s) => s.id));

  // 2. Fetch all attendance records for this student enrollment
  const attendanceRecords = await Attendance.find({
    enrollmentId: enrollment.id,
    sessionId: { $in: Array.from(eligibleSessionIds) },
  });

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let excusedCount = 0;
  let notMarkedCount = 0;

  // Track sessions with attendance
  const markedSessionIds = new Set();

  attendanceRecords.forEach((record) => {
    markedSessionIds.add(record.sessionId);
    switch (record.status) {
      case 'Present':
        presentCount++;
        break;
      case 'Late':
        lateCount++;
        break;
      case 'Absent':
        absentCount++;
        break;
      case 'Excused':
        excusedCount++;
        break;
      case 'Not Marked':
      default:
        notMarkedCount++;
        break;
    }
  });

  // Eligible past sessions without an explicit record are also counted as 'Not Marked' (pending)
  const unmarkedSessionsCount = eligibleSessions.length - markedSessionIds.size;
  notMarkedCount += Math.max(0, unmarkedSessionsCount);

  // Exact Formula:
  // Attended = Present + Late
  // Evaluated = Present + Late + Absent + Excused
  // Not Marked is excluded from finalized attendance calculation until resolved.
  const attendedSessions = presentCount + lateCount;
  const evaluatedSessions = presentCount + lateCount + absentCount + excusedCount;

  let attendancePercentage = 100;
  if (evaluatedSessions > 0) {
    attendancePercentage = Math.round((attendedSessions / evaluatedSessions) * 100);
  } else if (eligibleSessions.length === 0) {
    attendancePercentage = 100; // No eligible classes held yet
  }

  // Persist updated attendance percentage on enrollment
  enrollment.attendancePercentage = attendancePercentage;
  await enrollment.save();

  return {
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    courseSlug: effectiveCourseSlug,
    attendancePercentage,
    attendedSessions,
    presentCount,
    lateCount,
    absentCount,
    excusedCount,
    notMarkedCount,
    evaluatedSessions,
    eligibleSessionsCount: eligibleSessions.length,
  };
};

/**
 * 3. Calculate Learning Progress based on Syllabus Module Completion
 * Tracks modules configured on course and individual assessment scores per enrollment.
 */
export const calculateEnrollmentProgress = async (enrollmentId, courseSlug) => {
  const enrollment = await Enrollment.findOne({ id: enrollmentId });
  if (!enrollment) throw new Error(`Enrollment "${enrollmentId}" not found`);

  const effectiveCourseSlug = courseSlug || enrollment.courseSlug;
  const course = await Course.findOne({ slug: effectiveCourseSlug });

  if (!course || !course.modules || course.modules.length === 0) {
    enrollment.learningProgressPercentage = 100;
    await enrollment.save();
    return {
      learningProgressPercentage: 100,
      totalModules: 0,
      requiredModules: 0,
      completedRequiredModules: 0,
    };
  }

  // Course modules definition
  const courseModules = course.modules;
  const totalModules = courseModules.length;
  const requiredModulesCount = courseModules.filter((m) => m.isRequired !== false).length;

  // Student's module progress records
  const progressRecords = await ModuleProgress.find({ enrollmentId: enrollment.id });
  const progressByModule = new Map();
  progressRecords.forEach((p) => progressByModule.set(p.moduleIndex, p));

  let completedRequiredModules = 0;
  let totalCompletedModules = 0;

  courseModules.forEach((mod, idx) => {
    const isReq = mod.isRequired !== false;
    const progress = progressByModule.get(idx);

    if (progress && progress.status === 'Completed') {
      // If module has assessment, pass criteria must also be satisfied
      const passedAssessment = mod.hasAssessment ? progress.assessmentPassed === true : true;
      if (passedAssessment) {
        totalCompletedModules++;
        if (isReq) completedRequiredModules++;
      }
    }
  });

  const divisor = requiredModulesCount > 0 ? requiredModulesCount : totalModules;
  const progressPercentage = divisor > 0 ? Math.round((completedRequiredModules / divisor) * 100) : 0;

  enrollment.learningProgressPercentage = progressPercentage;
  await enrollment.save();

  return {
    enrollmentId: enrollment.id,
    learningProgressPercentage: progressPercentage,
    totalModules,
    requiredModules: requiredModulesCount,
    completedRequiredModules,
    totalCompletedModules,
  };
};

/**
 * 4. Course Completion Policy (Section 9)
 * Condition A: Minimum Attendance met (attendancePercentage >= course.minAttendancePercentage).
 * Condition B: Learning Completion (all required syllabus modules Completed and assessments passed).
 * Automatically checks and updates completion eligibility and status.
 */
export const evaluateCourseCompletion = async (enrollmentId) => {
  const enrollment = await Enrollment.findOne({ id: enrollmentId });
  if (!enrollment) throw new Error(`Enrollment "${enrollmentId}" not found`);

  const course = await Course.findOne({ slug: enrollment.courseSlug });
  const minAttendance = course?.minAttendancePercentage ?? 80;

  // Calculate fresh attendance and learning progress
  const attendanceStats = await calculateEnrollmentAttendance(enrollment.id, enrollment.courseSlug);
  const progressStats = await calculateEnrollmentProgress(enrollment.id, enrollment.courseSlug);

  const attendanceMet = attendanceStats.attendancePercentage >= minAttendance;
  const learningMet = progressStats.learningProgressPercentage >= 100;
  const eligible = attendanceMet && learningMet;

  enrollment.completionEligible = eligible;

  // Handle status transitions
  if (eligible && enrollment.status === 'Active') {
    enrollment.status = 'Completed';
    enrollment.completedAt = new Date();
  } else if (!eligible && enrollment.status === 'Completed') {
    // If subsequent attendance or module correction invalidated completion
    enrollment.status = 'Active';
    enrollment.completedAt = null;
  }

  await enrollment.save();

  return {
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    courseSlug: enrollment.courseSlug,
    status: enrollment.status,
    eligible,
    attendanceMet,
    learningMet,
    minAttendanceRequired: minAttendance,
    actualAttendancePercentage: attendanceStats.attendancePercentage,
    learningProgressPercentage: progressStats.learningProgressPercentage,
    completedAt: enrollment.completedAt,
    attendanceStats,
    progressStats,
  };
};

/**
 * 5. Initialize Module Progress records for a newly enrolled student
 */
export const initializeStudentModuleProgress = async (enrollment, course) => {
  if (!course || !course.modules || course.modules.length === 0) return [];

  const existing = await ModuleProgress.find({ enrollmentId: enrollment.id });
  if (existing.length > 0) return existing;

  const recordsToInsert = course.modules.map((mod, idx) => ({
    id: `MP-${enrollment.id}-${idx}`,
    enrollmentId: enrollment.id,
    studentId: enrollment.studentId,
    courseSlug: enrollment.courseSlug,
    moduleIndex: idx,
    moduleTitle: mod.title,
    isRequired: mod.isRequired !== false,
    status: 'Not Started',
    assessmentPassed: false,
    attempts: 0,
  }));

  return await ModuleProgress.insertMany(recordsToInsert);
};
