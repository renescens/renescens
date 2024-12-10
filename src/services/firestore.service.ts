import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase.service';

export const addDocument = async <T extends { id?: string }>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const docId = data.id || doc(collection(db, collectionName)).id;
    const timestamp = serverTimestamp();
    
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      id: docId,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    return docId;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const updateDocument = async <T extends object>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getDocument = async <T>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, documentId));
    if (!docSnap.exists()) return null;
    
    return {
      ...docSnap.data(),
      id: docSnap.id
    } as T;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as T[];
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

export const createDocument = async <T extends { id?: string }>(
  collectionName: string,
  documentId: string,
  data: T
): Promise<void> => {
  try {
    const timestamp = serverTimestamp();
    await setDoc(doc(db, collectionName, documentId), {
      ...data,
      id: documentId,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};