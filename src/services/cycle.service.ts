import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  writeBatch,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { CycleEntry, CycleProgress } from '../types/cycle';
import { getUserProfile } from './database.service';

// Collection references
const cyclesCollection = collection(db, 'cycles');
const cycleProgressCollection = collection(db, 'cycleProgress');

export const initializeUserCycle = async (userId: string): Promise<void> => {
  const batch = writeBatch(db);

  try {
    // Fetch user profile
    const userProfileRef = doc(db, 'profiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);

    if (!userProfileSnap.exists()) {
      // If profile doesn't exist, throw an error
      throw new Error('User profile not found');
    }

    // Initialize cycle progress for this user
    const progressRef = doc(cycleProgressCollection, userId);
    const progressData: CycleProgress = {
      userId,
      profileId: userId, // Assuming the profile's ID is the same as userId
      completedDays: [],
      currentDay: 0, // Initialize currentDay to 0
      startedAt: new Date(),
      lastCompletedAt: null,
    };

    batch.set(progressRef, {
      ...progressData,
      startedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add `currentDay` to the profile document (if missing)
    if (!userProfileSnap.data().currentDay) {
      batch.update(userProfileRef, {
        currentDay: 0, // Set to 0 initially
      });
    }

    await batch.commit();
  } catch (error) {
    console.error('Error initializing user cycle:', error);
    throw error;
  }
};
export const saveCycleDay = async (
  userId: string,
  dayNumber: number,
  exercises: string[] = [],
  notes?: string
): Promise<void> => {
  const batch = writeBatch(db);

  try {
    // Get user profile reference
    const userProfileRef = doc(db, 'profiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);

    if (!userProfileSnap.exists()) throw new Error('User profile not found');

    const userProfile = userProfileSnap.data();

    // Create cycle entry
    const cycleEntryId = `${userId}_day${dayNumber}`;
    const entryRef = doc(cyclesCollection, cycleEntryId);

    const entry: CycleEntry = {
      id: cycleEntryId,
      userId,
      profileId: userId,
      dayNumber,
      completedAt: new Date(),
      exercises,
      notes,
    };

    batch.set(entryRef, {
      ...entry,
      completedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update cycle progress document
    const progressRef = doc(cycleProgressCollection, userId);
    const progressSnap = await getDoc(progressRef);

    let completedDays: number[] = [];
    let currentDay = userProfile.currentDay || 0;

    if (progressSnap.exists()) {
      const currentProgress = progressSnap.data() as CycleProgress;
      completedDays = [...new Set([...currentProgress.completedDays, dayNumber])]; // Ensure uniqueness

      // Increment currentDay by 1
      currentDay = Math.max(...completedDays) + 1;

      batch.update(progressRef, {
        completedDays,
        currentDay,
        lastCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Initialize a new progress document if it doesn't exist
      completedDays = [dayNumber];
      currentDay = dayNumber + 1;
      const newProgress: CycleProgress = {
        userId,
        profileId: userId,
        completedDays,
        currentDay,
        startedAt: serverTimestamp(),
        lastCompletedAt: serverTimestamp(),
      };
      batch.set(progressRef, newProgress);
    }

    // Update `currentDay` and `completedDays` in the profile document
    batch.update(userProfileRef, {
      currentDay,
      completedDays: [...(userProfile.completedDays || []), dayNumber], // Add completed day to the array
    });

    // Commit the batch
    await batch.commit();
  } catch (error) {
    console.error('Error saving cycle day:', error);
    throw error;
  }
};








export const getCycleProgress = async (userId: string): Promise<CycleProgress | null> => {
  try {
    const progressRef = doc(cycleProgressCollection, userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.log(`Cycle progress not found for user ${userId}, initializing...`);
      await initializeUserCycle(userId);
      return getCycleProgress(userId);
    }

    const data = progressSnap.data();
    return {
      ...data,
      startedAt: data.startedAt.toDate(),
      lastCompletedAt: data.lastCompletedAt?.toDate() || null
    } as CycleProgress;
  } catch (error) {
    console.error('Error getting cycle progress:', error);
    return null;
  }
};

export const getUserCycleDays = async (userId: string): Promise<CycleEntry[]> => {
  try {
    const q = query(cyclesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedAt: data.completedAt.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as CycleEntry;
    });
  } catch (error) {
    console.error('Error getting user cycle days:', error);
    return [];
  }
};
