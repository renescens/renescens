import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {  updateMockProfile } from '../services/mockData.service';
import { UserProfile } from '../types/user';

export const useProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    if (!user) {
      setError('Utilisateur non authentifié');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const profile = getProfile();
      return profile;
    } catch (err: any) {
      console.error('Error getting profile:', err);
      setError(err.message || 'Erreur lors de la récupération du profil');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) {
      setError('Utilisateur non authentifié');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      updateMockProfile(data);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    getProfile,
    updateProfile,
    loading,
    error
  };
};