export interface CycleEntry {
  id: string;
  userId: string;
  dayNumber: number;
  completedAt: Date;
  exercises: string[];
  notes?: string;
  profileId: string; // Ajout de la référence au profil
}

export interface CycleProgress {
  userId: string;
  profileId: string; // Ajout de la référence au profil
  completedDays: number[];
  currentDay: number;
  startedAt: Date;
  lastCompletedAt: Date | null;
}

export interface CycleWithProfile extends CycleEntry {
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
  };
}