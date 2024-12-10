import { UserStats } from '../types/stats';

// Fonction pour formater la date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long'
  });
};

// Fonction pour obtenir les statistiques de l'utilisateur
export const getUserStats = async (userId: string): Promise<UserStats> => {
  // Simulation de données pour le développement
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const today = new Date();
  
  return {
    totalTime: '24h 30m',
    activeDays: 15,
    globalScore: 850,
    level: 'Intermédiaire',
    
    voiceAnalysis: {
      total: 28,
      totalDuration: 140,
      totalNotes: 1250,
      lastAnalysis: formatDate(today)
    },
    
    listening: {
      totalSessions: 45,
      totalDuration: 180,
      completedExercises: 32,
      averageAccuracy: 85
    },
    
    calibration: {
      total: 56,
      notesHit: 234,
      averageAccuracy: 78,
      bestStreak: 12
    },
    
    emotionalJournal: {
      totalEntries: 22,
      streakDays: 7,
      averageEmotional: 7.5,
      lastEntry: formatDate(today)
    },
    
    weeklyActivity: weekDays.map(day => ({
      day,
      value: Math.floor(Math.random() * 100)
    }))
  };
};