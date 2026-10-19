export interface GenerateSessionsResult {
  success: boolean;
  message: string;
  totalSessions: number;
  newCreatedCount: number;
  preservedCount: number;
  sessions: any[];
}

export interface AttendanceCalculationResult {
  enrollmentId: string;
  studentId: string;
  courseSlug: string;
  attendancePercentage: number;
  attendedSessions: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  excusedCount: number;
  notMarkedCount: number;
  evaluatedSessions: number;
  eligibleSessionsCount: number;
}

export interface ProgressCalculationResult {
  enrollmentId: string;
  learningProgressPercentage: number;
  totalModules: number;
  requiredModules: number;
  completedRequiredModules: number;
  totalCompletedModules: number;
}

export interface CourseCompletionResult {
  enrollmentId: string;
  studentId: string;
  courseSlug: string;
  status: string;
  eligible: boolean;
  attendanceMet: boolean;
  learningMet: boolean;
  minAttendanceRequired: number;
  actualAttendancePercentage: number;
  learningProgressPercentage: number;
  completedAt: Date | null;
  attendanceStats: AttendanceCalculationResult;
  progressStats: ProgressCalculationResult;
}

export function formatDateStr(d: any): string;
export function generateCourseSessions(course: any): Promise<GenerateSessionsResult>;
export function calculateEnrollmentAttendance(enrollmentId: string, courseSlug?: string, studentAdmissionDate?: string): Promise<AttendanceCalculationResult>;
export function calculateEnrollmentProgress(enrollmentId: string, courseSlug?: string): Promise<ProgressCalculationResult>;
export function evaluateCourseCompletion(enrollmentId: string): Promise<CourseCompletionResult>;
export function initializeStudentModuleProgress(enrollment: any, course: any): Promise<any[]>;
