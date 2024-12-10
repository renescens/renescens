import { EmotionLog } from '../types/emotion';
import { UserProfile } from '../types/user';
import { CycleProgress } from '../types/cycle';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Local Storage Keys
const STORAGE_KEYS = {
  EMOTIONS: 'renescens_emotions',
  USER_PROFILE: 'renescens_profile',
  CYCLE_PROGRESS: 'renescens_cycle'
};

// Default profile template
const defaultProfile: UserProfile = {
  id: '1',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  photoURL: '',
  dateOfBirth: null,
  phoneNumber: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
  vocalRange: {
    min: 0,
    max: 0
  },
  experience: 'beginner',
  interests: [],
  goals: [],
  availability: {
    practiceFrequency: 'weekly',
    practiceLength: 30,
    preferredTimes: []
  },
  musicalBackground: {
    yearsOfExperience: 0,
    instruments: [],
    styles: [],
    training: []
  },
  settings: {
    notifications: true,
    emailUpdates: true,
    language: 'fr',
    theme: 'auto'
  },
  stats: {
    totalPracticeTime: 0,
    sessionsCompleted: 0,
    averageAccuracy: 0,
    lastSession: null
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// Create mock profile
export const createMockProfile = (data: Partial<UserProfile>): void => {
  try {
    const profile: UserProfile = {
      ...defaultProfile,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error creating mock profile:', error);
    throw error;
  }
};

// Generate mock emotion logs
export const getMockEmotionLogs = (): EmotionLog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EMOTIONS);
    if (stored) {
      const logs = JSON.parse(stored);
      return logs.map((log: any) => ({
        ...log,
        date: new Date(log.date)
      }));
    }

    // Generate initial mock data
    const logs: EmotionLog[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      logs.push({
        id: crypto.randomUUID(),
        date,
        emotionalState: Math.floor(Math.random() * 5) + 5,
        energyLevel: Math.floor(Math.random() * 5) + 5,
        stressLevel: Math.floor(Math.random() * 5) + 3,
        notes: 'Entrée générée automatiquement',
        tags: ['mock'],
        activities: ['Méditation', 'Exercice'],
        cycleExercises: ['Respiration', 'Vocalises']
      });
    }

    localStorage.setItem(STORAGE_KEYS.EMOTIONS, JSON.stringify(logs));
    return logs;
  } catch (error) {
    console.error('Error getting mock emotion logs:', error);
    return [];
  }
};
export const getEmotionLogsFromFirestore = async (): Promise<EmotionLog[]> => {
  const auth = useAuth();  // Assuming useAuth provides the logged-in user
  const user = auth;  // Get the current authenticated user
  
  if (user && user.profile && user.profile.id) {
    try {
      // Get the user's emotion logs from Firestore
      const logsRef = collection(db, 'profiles', user.profile.id, 'journalEmotionnel');
      const q = query(logsRef, where('date', '!=', null)); // Example: filter based on date if needed
      const querySnapshot = await getDocs(q);
      
      const fetchedLogs: EmotionLog[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedLogs.push(doc.data() as EmotionLog); // Assume doc.data() is the format you need
      });
      
      return fetchedLogs;
    } catch (error) {
      console.error("Error fetching emotion logs from Firestore:", error);
      return [];
    }
  } else {
    console.error("User is not authenticated or profile ID is missing.");
    return [];
  }
};

// Get mock user profile
export const getMockProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (stored) {
      const profile = JSON.parse(stored);
      return {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : profile.dateOfBirth,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt),
        stats: {
          ...profile.stats,
          lastSession: profile.stats.lastSession ? new Date(profile.stats.lastSession) : null
        }
      };
    }

    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (error) {
    console.error('Error getting mock profile:', error);
    return defaultProfile;
  }
};

// Update mock profile
export const updateMockProfile = (updates: Partial<UserProfile>): void => {
  try {
    const current = getMockProfile();
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date()
    };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating mock profile:', error);
  }
};

// Get mock cycle progress
export const getMockCycleProgress = (): CycleProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CYCLE_PROGRESS);
    const profile = getMockProfile();
    
    if (stored) {
      const progress = JSON.parse(stored);
      return {
        ...progress,
        profileId: profile.id,
        startedAt: new Date(progress.startedAt),
        lastCompletedAt: progress.lastCompletedAt ? new Date(progress.lastCompletedAt) : null
      };
    }

    const initialProgress: CycleProgress = {
      userId: '1',
      profileId: profile.id,
      completedDays: [],
      currentDay: 1,
      startedAt: new Date(),
      lastCompletedAt: null
    };

    localStorage.setItem(STORAGE_KEYS.CYCLE_PROGRESS, JSON.stringify(initialProgress));
    return initialProgress;
  } catch (error) {
    console.error('Error getting mock cycle progress:', error);
    return {
      userId: '1',
      profileId: '1',
      completedDays: [],
      currentDay: 1,
      startedAt: new Date(),
      lastCompletedAt: null
    };
  }
};

// Update mock cycle progress
export const updateMockCycleProgress = (updates: Partial<CycleProgress>): void => {
  try {
    const current = getMockCycleProgress();
    const profile = getMockProfile();
    
    const updated = {
      ...current,
      ...updates,
      profileId: profile.id,
      lastCompletedAt: new Date()
    };
    
    localStorage.setItem(STORAGE_KEYS.CYCLE_PROGRESS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating mock cycle progress:', error);
  }
};