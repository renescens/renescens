import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';

export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection references
export const cyclesCollection = collection(db, 'cycles');
export const cycleProgressCollection = collection(db, 'cycleProgress');

// Helper functions for cycles collection
export const createCycleDocument = async (cycleId: string, data: any) => {
  await setDoc(doc(cyclesCollection, cycleId), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const updateCycleDocument = async (cycleId: string, data: any) => {
  await updateDoc(doc(cyclesCollection, cycleId), {
    ...data,
    updatedAt: new Date()
  });
};

export const getCycleDocument = async (cycleId: string) => {
  const docSnap = await getDoc(doc(cyclesCollection, cycleId));
  return docSnap.exists() ? docSnap.data() : null;
};

// Helper functions for cycle progress collection
export const createProgressDocument = async (userId: string, data: any) => {
  await setDoc(doc(cycleProgressCollection, userId), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const updateProgressDocument = async (userId: string, data: any) => {
  await updateDoc(doc(cycleProgressCollection, userId), {
    ...data,
    updatedAt: new Date()
  });
};

export const getProgressDocument = async (userId: string) => {
  const docSnap = await getDoc(doc(cycleProgressCollection, userId));
  return docSnap.exists() ? docSnap.data() : null;
};