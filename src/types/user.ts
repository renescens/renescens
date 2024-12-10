export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL: string;
  dateOfBirth: Date | string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  vocalRange: {
    min: number;
    max: number;
  };
  experience: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  goals: Array<{
    id: string;
    title: string;
    description: string;
    status: 'active' | 'completed';
    progress: number;
    createdAt: Date;
    completedAt?: Date;
  }>;
  availability: {
    practiceFrequency: 'daily' | 'weekly' | 'occasional';
    practiceLength: number;
    preferredTimes: string[];
  };
  musicalBackground: {
    yearsOfExperience: number;
    instruments: string[];
    styles: string[];
    training: string[];
  };
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    totalPracticeTime: number;
    sessionsCompleted: number;
    averageAccuracy: number;
    lastSession: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  experience?: 'beginner' | 'intermediate' | 'advanced';
  interests?: string[];
  goals?: string[];
}