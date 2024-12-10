// services/emotion.service.ts

import { db } from '../firebase';
import { EmotionLog } from '../types/emotion'; // Assuming you have types defined
import { collection, doc, getDocs, query } from 'firebase/firestore';

export const getEmotionLogsForUser = async (userId: string): Promise<EmotionLog[]> => {
  const logsRef = collection(db, 'profiles', userId, 'journalEmotionnel');
  const q = query(logsRef);
  
  const querySnapshot = await getDocs(q);
  const logs: EmotionLog[] = [];
  
  querySnapshot.forEach(doc => {
    logs.push({
      id: doc.id,
      userId,
      ...doc.data(), // Assuming you have fields like date, emotionalState, energyLevel, stressLevel, activities
    } as EmotionLog);
  });

  return logs;
};
