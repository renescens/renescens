import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { UserProfile } from '../../types/user';

interface ProfileAvailabilityProps {
  availability: UserProfile['availability'];
  onUpdate: (updates: Partial<UserProfile['availability']>) => void;
}

const ProfileAvailability: React.FC<ProfileAvailabilityProps> = ({
  availability,
  onUpdate
}) => {
  const frequencies = {
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
    occasional: 'Occasionnelle'
  };

  const timeSlots = [
    'Matin (6h-9h)',
    'Matinée (9h-12h)',
    'Midi (12h-14h)',
    'Après-midi (14h-17h)',
    'Soirée (17h-20h)',
    'Nuit (20h-23h)'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-300" />
        <h3 className="text-lg font-semibold">Disponibilités</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium mb-4">Fréquence de pratique</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-purple-200/60 mb-2">
                Fréquence
              </label>
              <select
                value={availability.practiceFrequency}
                onChange={e => onUpdate({ practiceFrequency: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              >
                {Object.entries(frequencies).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-purple-200/60 mb-2">
                Durée moyenne de pratique (minutes)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={availability.practiceLength}
                onChange={e => onUpdate({ practiceLength: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-medium mb-4">Créneaux horaires préférés</h4>
          <div className="space-y-2">
            {timeSlots.map(slot => (
              <label key={slot} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={availability.preferredTimes.includes(slot)}
                  onChange={e => {
                    const newTimes = e.target.checked
                      ? [...availability.preferredTimes, slot]
                      : availability.preferredTimes.filter(t => t !== slot);
                    onUpdate({ preferredTimes: newTimes });
                  }}
                  className="rounded border-purple-300/20"
                />
                <span className="text-sm">{slot}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvailability;