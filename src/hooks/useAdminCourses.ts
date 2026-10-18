import { useState, useEffect, useCallback } from 'react';
import { cmsStore, type Course } from '../admin/cmsStore';
import { apiService } from '../services/api';

export interface UseAdminCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to retrieve and observe courses managed in the SSCI Admin Panel.
 *
 * - Automatically connects to the CMS store (and database via apiService).
 * - Reactively re-renders whenever courses are created, edited, or deleted in admin.
 * - Handles loading, empty, and error states gracefully.
 */
export function useAdminCourses(): UseAdminCoursesResult {
  const [courses, setCourses] = useState<Course[]>(() => cmsStore.getCourses() || []);
  const [loading, setLoading] = useState<boolean>(() => (cmsStore.getCourses()?.length ? false : true));
  const [error, setError] = useState<string | null>(null);

  const syncCourses = useCallback(async () => {
    try {
      const res = await apiService.getCourses();
      if (res?.success && Array.isArray(res.courses)) {
        setCourses(res.courses);
        setError(null);
      } else if (!res?.success && cmsStore.getCourses().length === 0) {
        setError(res?.message || 'Unable to fetch courses from the server.');
      }
    } catch (err: any) {
      if (cmsStore.getCourses().length === 0) {
        setError(err?.message || 'Network error while loading courses.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Subscribe to real-time changes in cmsStore
    const unsubscribe = cmsStore.subscribe(() => {
      const updated = cmsStore.getCourses() || [];
      setCourses([...updated]);
      if (updated.length > 0) {
        setError(null);
      }
    });

    // 2. Fetch fresh courses from backend
    syncCourses();

    return () => {
      unsubscribe();
    };
  }, [syncCourses]);

  return {
    courses,
    loading,
    error,
    refresh: syncCourses,
  };
}
