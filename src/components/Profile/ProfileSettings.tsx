import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Save, Loader } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { UserSettings } from '../../types/user';

const ProfileSettings: React.FC = () => {
  const { updateProfile, loading, error } = useProfile();
  const [settings, setSettings] = useState<UserSettings>({
    audio: {
      autoPlay: false,
      volume: 80,
      quality: 'high'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ settings });
    } catch (err) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Audio */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-5 h-5 text-purple-300" />
          <h3 className="text-lg font-semibold">Audio</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span>Lecture automatique</span>
            <input
              type="checkbox"
              checked={settings.audio.autoPlay}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                audio: {
                  ...prev.audio,
                  autoPlay: e.target.checked
                }
              }))}
              className="w-4 h-4 rounded border-purple-300/20"
            />
          </label>

          <div>
            <label className="block text-sm mb-2">Volume par défaut</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.audio.volume}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                audio: {
                  ...prev.audio,
                  volume: parseInt(e.target.value)
                }
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Qualité audio</label>
            <select
              value={settings.audio.quality}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                audio: {
                  ...prev.audio,
                  quality: e.target.value as 'low' | 'medium' | 'high'
                }
              }))}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            >
              <option value="low">Basse (économie de données)</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 rounded-lg text-sm">
          {error}
        </div>
      )}

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.95 }}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Enregistrer les paramètres</span>
          </>
        )}
      </motion.button>
    </form>
  );
};

export default ProfileSettings;