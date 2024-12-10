import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfileFormData } from '../types/user';
import { createUserProfile } from './database.service';
import { serverTimestamp } from 'firebase/firestore';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const signUp = async (email: string, password: string, profileData: UserProfileFormData) => {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore with proper timestamps
    await createUserProfile(user.uid, {
      ...profileData,
      email: user.email || email,
      userId: user.uid,
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : profileData.dateOfBirth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return user;
  } catch (error: any) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    // Fetch the user's profile from Firestore
    const profileRef = doc(db, 'profiles', user.uid); // 'profiles' collection
    const profileSnapshot = await getDoc(profileRef);

    if (!profileSnapshot.exists()) {
      throw new Error("Profile not found.");
    }

    const profileData = profileSnapshot.data();

    // Return the profile with the relevant fields, including cycleProgress and currentDay
    const userProfile = {
      ...profileData,
      cycleProgress: profileData.cycleProgress || [],
      currentDay: profileData.currentDay || 0,
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth.seconds * 1000) : null,
      createdAt: profileData.createdAt ? new Date(profileData.createdAt.seconds * 1000) : null,
      updatedAt: profileData.updatedAt ? new Date(profileData.updatedAt.seconds * 1000) : null,
    };

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};