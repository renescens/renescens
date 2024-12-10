import React from 'react';
import { motion } from 'framer-motion';

interface PitchDisplayProps {
  frequency: number | null;
  targetFrequency: number;
}

const PitchDisplay: React.FC<PitchDisplayProps> = ({ frequency, targetFrequency }) => {
  if (!frequency) return null;

  const cents = Math.round(1200 * Math.log2(frequency / targetFrequency));
  const isInTune = Math.abs(cents) < 10;
  const isTooLow = cents < -10;

  return (
    <div className="mt-8 space-y-6">
      {/* Fréquences */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <p className="text-sm text-purple-200/60 mb-1">Votre voix</p>
          <p className="text-xl font-semibold">{frequency.toFixed(1)} Hz</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg text-center">
          <p className="text-sm text-purple-200/60 mb-1">Note cible</p>
          <p className="text-xl font-semibold">{targetFrequency.toFixed(1)} Hz</p>
        </div>
      </div>

      {/* Visualisation */}
      <div className="relative">
        {/* Échelle de référence */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-green-500/20 to-red-500/20" />
          <div className="absolute left-1/2 w-4 h-full -translate-x-1/2 bg-green-500/40" />
        </div>

        {/* Zone de tolérance */}
        <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 w-16 border-l border-r border-green-500/20" />

        {/* Indicateur */}
        <motion.div
          className={`absolute top-0 w-2 h-full ${
            isInTune ? 'bg-green-500' : 'bg-red-500'
          }`}
          initial={{ left: '50%' }}
          animate={{ 
            left: `${50 + Math.max(Math.min(cents, 50), -50)}%` 
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Conteneur */}
        <div className="h-16 bg-white/5 rounded-lg relative">
          {/* Graduations */}
          {[-50, -25, 0, 25, 50].map(mark => (
            <div
              key={mark}
              className="absolute top-0 h-full"
              style={{ left: `${50 + mark}%` }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-white/10" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs text-purple-200/40">
                {mark > 0 ? `+${mark}` : mark}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="text-center">
        <motion.p
          key={isInTune ? 'in-tune' : 'out-of-tune'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-medium ${
            isInTune 
              ? 'text-green-400' 
              : isTooLow 
                ? 'text-blue-400' 
                : 'text-red-400'
          }`}
        >
          {isInTune 
            ? '✨ Note parfaite !' 
            : isTooLow 
              ? '↑ Montez votre voix...' 
              : '↓ Descendez votre voix...'}
        </motion.p>
        <p className="text-sm text-purple-200/60 mt-2">
          Écart: {cents > 0 ? '+' : ''}{cents} cents
        </p>
      </div>

      {/* Guide */}
      <div className="p-4 bg-purple-500/10 rounded-lg">
        <ul className="space-y-2 text-sm text-purple-200/80">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Zone verte : Note juste (±10 cents)</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Zone bleue : Note trop basse</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Zone rouge : Note trop haute</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PitchDisplay;