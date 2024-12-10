import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { 
  saveCycleDay, 
  getCycleProgress, 
  getUserCycleDays,
  initializeUserCycle 
} from '../services/cycle.service';
import { CycleEntry, CycleProgress } from '../types/cycle';

export const useCycle = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log user ID to check the cycle progress initialization
      console.log(`Initializing cycle for user: ${user.uid}`);

      const progress = await getCycleProgress(user.uid);
      if (progress && progress.completedDays.length > 0) {
        console.log('Cycle already initialized with progress:', progress);
      } else {
        console.log('Cycle not initialized yet, setting up...');
        await initializeUserCycle(user.uid);
      }
    } catch (err: any) {
      console.error('Error initializing cycle:', err);
      setError(err.message || 'Error initializing cycle');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const completeDay = useCallback(async (dayNumber: number, exercises: string[] = [], notes?: string) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Completing day ${dayNumber} for user: ${user.uid}`);
      await saveCycleDay(user.uid, dayNumber, exercises, notes);
    } catch (err: any) {
      console.error('Error completing cycle day:', err);
      setError(err.message || 'Error completing day');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProgress = useCallback(async (): Promise<CycleProgress | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching progress for user: ${user.uid}`);
      return await getCycleProgress(user.uid);
    } catch (err: any) {
      console.error('Error getting cycle progress:', err);
      setError(err.message || 'Error getting progress');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getCycleDays = useCallback(async (): Promise<CycleEntry[]> => {
    if (!user) {
      setError('User not authenticated');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching cycle days for user: ${user.uid}`);
      return await getUserCycleDays(user.uid);
    } catch (err: any) {
      console.error('Error getting cycle days:', err);
      setError(err.message || 'Error getting cycle days');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    initialize,
    completeDay,
    getProgress,
    getCycleDays,
    loading,
    error
  };
};
