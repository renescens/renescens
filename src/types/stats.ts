export interface UserStats {
  totalTime: string;
  activeDays: number;
  globalScore: number;
  level: string;
  
  voiceAnalysis: {
    total: number;
    totalDuration: number;
    totalNotes: number;
    lastAnalysis: string;
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
    lastEntry: string;
  };
  
  weeklyActivity: Array<{
    day: string;
    value: number;
  }>;
}