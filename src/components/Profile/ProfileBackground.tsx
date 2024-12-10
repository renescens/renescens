import React from 'react';
import { motion } from 'framer-motion';
import { Music, BookOpen, Clock } from 'lucide-react';
import { UserProfile } from '../../types/user';

interface ProfileBackgroundProps {
  musicalBackground: UserProfile['musicalBackground'];
  onUpdate: (updates: Partial<UserProfile['musicalBackground']>) => void;
}

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({
  musicalBackground,
  onUpdate
}) => {
  const handleAddInstrument = (instrument: string) => {
    if (musicalBackground?.instruments.includes(instrument)) return;
    onUpdate({
      instruments: [...(musicalBackground?.instruments || []), instrument]
    });
  };

  const handleAddStyle = (style: string) => {
    if (musicalBackground?.styles.includes(style)) return;
    onUpdate({
      styles: [...(musicalBackground?.styles || []), style]
    });
  };

  const handleAddTraining = (training: string) => {
    if (musicalBackground?.training.includes(training)) return;
    onUpdate({
      training: [...(musicalBackground?.training || []), training]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Music className="w-5 h-5 text-purple-300" />
        <h3 className="text-lg font-semibold">Parcours Musical</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium mb-4">Expérience</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200/60 mb-1">
                Années de pratique
              </label>
              <input
                type="number"
                min="0"
                value={musicalBackground?.yearsOfExperience || 0}
                onChange={e => onUpdate({ yearsOfExperience: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-purple-200/60 mb-1">
                Instruments pratiqués
              </label>
              <div className="flex flex-wrap gap-2">
                {musicalBackground?.instruments.map(instrument => (
                  <span
                    key={instrument}
                    className="px-2 py-1 bg-purple-500/20 rounded-full text-sm"
                  >
                    {instrument}
                  </span>
                ))}
                <button
                  onClick={() => {
                    const instrument = prompt('Ajouter un instrument');
                    if (instrument) handleAddInstrument(instrument);
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium mb-4">Styles & Formation</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200/60 mb-1">
                Styles musicaux
              </label>
              <div className="flex flex-wrap gap-2">
                {musicalBackground?.styles.map(style => (
                  <span
                    key={style}
                    className="px-2 py-1 bg-purple-500/20 rounded-full text-sm"
                  >
                    {style}
                  </span>
                ))}
                <button
                  onClick={() => {
                    const style = prompt('Ajouter un style');
                    if (style) handleAddStyle(style);
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                >
                  + Ajouter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-purple-200/60 mb-1">
                Formation
              </label>
              <div className="flex flex-wrap gap-2">
                {musicalBackground?.training.map(training => (
                  <span
                    key={training}
                    className="px-2 py-1 bg-purple-500/20 rounded-full text-sm"
                  >
                    {training}
                  </span>
                ))}
                <button
                  onClick={() => {
                    const training = prompt('Ajouter une formation');
                    if (training) handleAddTraining(training);
                  }}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBackground;