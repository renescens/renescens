export interface UserProgress {
  userId: string;
  profileId: string;
  totalTime: number;
  completedExercises: number;
  lastActivity: Date;
  achievements: Achievement[];
  stats: {
    voiceAnalysis: {
      total: number;
      totalDuration: number;
      totalNotes: number;
      lastAnalysis: Date | null;
    };
    listening: {
      totalSessions: number;
      totalDuration: number;
      completedExercises: number;
      averageAccuracy: number;
    };
    calibration: {
      total: number;
      notesHit: number;
      averageAccuracy: number;
      bestStreak: number;
    };
    emotionalJournal: {
      totalEntries: number;
      streakDays: number;
      averageEmotional: number;
      lastEntry: Date | null;
    };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  type: 'cycle' | 'emotion' | 'voice' | 'exercise';
}