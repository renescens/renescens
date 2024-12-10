import { UserProgress } from '../types/progress';
import { createDocument, updateDocument, getDocument } from './database.service';

export const initializeProgress = async (userId: string): Promise<void> => {
  const initialProgress: UserProgress = {
    userId,
    totalTime: 0,
    completedExercises: 0,
    lastActivity: new Date(),
    achievements: []
  };
  
  await createDocument('progress', userId, initialProgress);
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const progress = await getDocument('progress', userId);
  return progress as UserProgress | null;
};

export const updateProgress = async (userId: string, data: Partial<UserProgress>): Promise<void> => {
  await updateDocument('progress', userId, data);
};