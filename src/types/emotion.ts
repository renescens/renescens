// types/emotion.ts
export interface EmotionLog {
  id: string;
  date: string;
  emotionalState: number; // Scale 1-10
  energyLevel: number; // Scale 1-10
  stressLevel: number; // Scale 1-10
  activities: string[];
  notes?: string;
}

export interface EmotionChartData {
  date: string;
  emotionalState: number;
  energyLevel: number;
  stressLevel: number;
  activities: string[];
}

export interface EmotionStats {
  averageEmotional: number;
  averageEnergy: number;
  averageStress: number;
  emotionalTrend: 'up' | 'down' | 'stable';
  energyTrend: 'up' | 'down' | 'stable';
  stressTrend: 'up' | 'down' | 'stable';
  totalEntries: number;
  streakDays: number;
  lastEntry: string | null;
}
