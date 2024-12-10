import React, { useState } from 'react';
import { ChevronDown, Volume2, Info, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { FrequencyRangeData } from './types';

const FrequencySelector: React.FC<FrequencyRangeData> = ({
  ranges,
  selectedRange,
  selectedNote,
  onRangeChange,
  onNoteChange,
  onPlay,
  isPlaying
}) => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const currentRange = ranges.find(range => 
    range.name.toLowerCase().replace(/[^a-z]/g, '') === selectedRange
  );

  const selectedNoteData = currentRange?.notes.find(note => note.name === selectedNote);

  const handleInitAudio = async () => {
    try {
      // Créer un court son silencieux pour initialiser l'audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      gainNode.gain.value = 0; // Son silencieux
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.001);
      
      setAudioInitialized(true);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation audio:', error);
    }
  };

  const handlePlayClick = async () => {
    if (!audioInitialized) {
      await handleInitAudio();
    }
    if (selectedNoteData) {
      onPlay(selectedNoteData.frequency);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5 text-purple-300" />
          <div>
            <h4 className="font-medium mb-2">Instructions</h4>
            <p className="text-sm text-purple-200/80">
              Sélectionnez une plage de fréquences et une note spécifique pour travailler votre voix. 
              Les notes sont organisées pour vous aider à corriger et améliorer votre tessiture vocale.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            1. Choisissez une plage de fréquences
          </label>
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => onRangeChange(e.target.value)}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-3 appearance-none"
            >
              <option value="">Sélectionnez une plage de fréquences</option>
              {ranges.map((range) => (
                <option 
                  key={range.name} 
                  value={range.name.toLowerCase().replace(/[^a-z]/g, '')}
                >
                  {range.name} ({range.range})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/60" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            2. Choisissez une note à travailler
          </label>
          <div className="relative">
            <select
              value={selectedNote}
              onChange={(e) => onNoteChange(e.target.value)}
              className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-2 px-3 appearance-none"
              disabled={!currentRange}
            >
              <option value="">Sélectionnez une note</option>
              {currentRange?.notes.map((note) => (
                <option key={note.name} value={note.name}>
                  {note.name} ({note.frequency.toFixed(2)} Hz)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/60" />
          </div>
        </div>

        {selectedNoteData && (
          <motion.button
            onClick={handlePlayClick}
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg transition-colors ${
              isPlaying 
                ? 'bg-purple-500/30 text-purple-100' 
                : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-100/80'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>
              {isPlaying ? 'Arrêter' : 'Jouer'} {selectedNoteData.frequency.toFixed(2)} Hz
            </span>
          </motion.button>
        )}

        {!audioInitialized && (
          <p className="text-sm text-center text-purple-200/60">
            Appuyez sur le bouton pour activer l'audio
          </p>
        )}
      </div>
    </div>
  );
};

export default FrequencySelector;