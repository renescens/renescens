import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types/user';

export const createUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    
    const profileData = {
      ...data,
      id: userId,
      userId: userId, // Important: Add userId field
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(profileRef, profileData);
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return null;
    }

    const data = profileSnap.data();
    return {
      ...data,
      id: profileSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    } as UserProfile;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
export const updateCycleProgress = async (uid: string, progress) => {
  try {
    const userRef = doc(db, 'profiles', uid); // Reference to the 'profiles' collection
    await updateDoc(userRef, {
      cycleProgress: progress // Update cycleProgress field
    });
  } catch (err) {
    console.error('Error updating cycle progress:', err);
  }
};