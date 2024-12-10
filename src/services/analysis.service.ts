import { DetectedNote } from '../components/VoiceAnalysis/types';

interface UserState {
  physicalState: number;
  mentalState: number;
  stressLevel: number;
  sleepQuality: number;
  notes: string;
}

interface AnalysisData {
  userId: string;
  date: Date;
  notes: DetectedNote[];
  dominantNotes: { [key: string]: number };
  currentFrequency: number | null;
  userState: UserState;
}

// Simuler le stockage local
let analyses: AnalysisData[] = [];
const STORAGE_KEY = 'renescens_analyses';

// Charger les analyses depuis le localStorage
const loadAnalyses = (): AnalysisData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des analyses:', error);
    return [];
  }
};

// Sauvegarder les analyses dans le localStorage
const saveAnalyses = (data: AnalysisData[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des analyses:', error);
  }
};

export const sendAnalysis = async (data: AnalysisData): Promise<boolean> => {
  try {
    analyses = loadAnalyses();
    
    // Vérifier la limite mensuelle
    const count = await getMonthlyAnalysisCount(data.userId);
    if (count >= 4) {
      throw new Error('Limite de 4 analyses par mois atteinte');
    }

    // Ajouter la nouvelle analyse
    analyses.push({
      ...data,
      date: new Date(data.date)
    });
    
    saveAnalyses(analyses);
    return true;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'analyse:', error);
    throw error;
  }
};

export const getMonthlyAnalysisCount = async (userId: string): Promise<number> => {
  try {
    analyses = loadAnalyses();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return analyses.filter(analysis => 
      analysis.userId === userId && 
      new Date(analysis.date) >= startOfMonth
    ).length;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'analyses:', error);
    return 0;
  }
};

export const getAnalyses = async (userId: string): Promise<AnalysisData[]> => {
  try {
    analyses = loadAnalyses();
    return analyses.filter(analysis => analysis.userId === userId);
  } catch (error) {
    console.error('Erreur lors de la récupération des analyses:', error);
    return [];
  }
};