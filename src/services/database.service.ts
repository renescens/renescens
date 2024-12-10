import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  writeBatch, 
  Timestamp, 
  DocumentData, 
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types/user';
import { CycleProgress } from '../types/cycle';

// Collection references
export const profilesCollection = collection(db, 'profiles');
export const cyclesCollection = collection(db, 'cycles');
export const cycleProgressCollection = collection(db, 'cycleProgress');
export const progressCollection = collection(db, 'progress');

export const createUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  const batch = writeBatch(db);

  try {
    // Create profile document
    const profileRef = doc(profilesCollection, userId);
    batch.set(profileRef, {
      ...data,
      id: userId,
      userId: userId,
      dateOfBirth: data.dateOfBirth ? Timestamp.fromDate(new Date(data.dateOfBirth)) : data.dateOfBirth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      cycleProgress: [] // Initialize with an empty array for cycle progress
    });

    // Initialize cycle progress
    const cycleProgressRef = doc(cycleProgressCollection, userId);
    const cycleProgress: CycleProgress = {
      userId,
      profileId: userId,
      completedDays: [],
      currentDay: 1,
      startedAt: new Date(),
      lastCompletedAt: null
    };

    // Add cycle progress reference to profile document
    batch.set(cycleProgressRef, {
      ...cycleProgress,
      startedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add reference to cycle progress in profile document
    batch.update(profileRef, {
      cycleProgress: arrayUnion(cycleProgressRef) // Using arrayUnion to add a reference to the cycleProgress array
    });

    // Initialize user progress
    const progressRef = doc(progressCollection, userId);
    batch.set(progressRef, {
      userId,
      profileId: userId,
      totalTime: 0,
      completedExercises: 0,
      lastActivity: serverTimestamp(),
      achievements: [],
      stats: {
        voiceAnalysis: {
          total: 0,
          totalDuration: 0,
          totalNotes: 0,
          lastAnalysis: null
        },
        listening: {
          totalSessions: 0,
          totalDuration: 0,
          completedExercises: 0,
          averageAccuracy: 0
        },
        calibration: {
          total: 0,
          notesHit: 0,
          averageAccuracy: 0,
          bestStreak: 0
        },
        emotionalJournal: {
          totalEntries: 0,
          streakDays: 0,
          averageEmotional: 0,
          lastEntry: null
        }
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};
export const getUserProfile = async (userId: string): Promise<{ id: string; [key: string]: any } | null> => {
  try {
    const profileRef = doc(collection(db, 'profiles'), userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      console.error(`No profile found for userId: ${userId}`);
      return null;
    }

    return { id: profileSnap.id, ...profileSnap.data() };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};


export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const profileRef = doc(profilesCollection, userId);
    
    const updateData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? Timestamp.fromDate(new Date(data.dateOfBirth)) : data.dateOfBirth,
      updatedAt: serverTimestamp()
    };

    await updateDoc(profileRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update cycle progress (this might be part of your service)
export const updateCycleProgress = async (userId: string, progress: CycleProgress): Promise<void> => {
  const userRef = doc(profilesCollection, userId);

  try {
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();
    const cycleProgressRef = doc(cycleProgressCollection, userId);

    // Ensure cycleProgress is initialized properly
    const cycleProgressData = userData?.cycleProgress || [];
    const updatedCycleProgress = [...cycleProgressData, progress];

    await updateDoc(userRef, {
      cycleProgress: updatedCycleProgress
    });

    await setDoc(cycleProgressRef, {
      ...progress,
      userId,
      profileId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

  } catch (error) {
    console.error('Error updating cycle progress:', error);
    throw error;
  }
};
