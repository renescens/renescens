import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Mic, Info } from 'lucide-react';
import PitchDetector from './ExerciseModule/PitchDetector';
import AudioVisualizer from './ExerciseModule/AudioVisualizer';
import PitchDisplay from './ExerciseModule/PitchDisplay';
import FrequencySelector from './ExerciseModule/FrequencySelector';
import { FrequencyRange } from './ExerciseModule/types';
import { useAudio } from '../hooks/useAudio';

const frequencyRanges: FrequencyRange[] = [
  {
    name: "Graves",
    range: "75-150 Hz",
    notes: [
      { name: "Ré2", frequency: 73.42 },
      { name: "Ré#2", frequency: 77.78 },
      { name: "Mi2", frequency: 82.41 },
      { name: "Fa2", frequency: 87.31 },
      { name: "Fa#2", frequency: 92.50 },
      { name: "Sol2", frequency: 98.00 },
      { name: "Sol#2", frequency: 103.83 },
      { name: "La2", frequency: 110.00 },
      { name: "La#2", frequency: 116.54 },
      { name: "Si2", frequency: 123.47 },
      { name: "Do3", frequency: 130.81 }
    ]
  },
  {
    name: "Médium-graves",
    range: "150-300 Hz",
    notes: [
      { name: "Do#3", frequency: 138.59 },
      { name: "Ré3", frequency: 146.83 },
      { name: "Ré#3", frequency: 155.56 },
      { name: "Mi3", frequency: 164.81 },
      { name: "Fa3", frequency: 174.61 },
      { name: "Fa#3", frequency: 185.00 },
      { name: "Sol3", frequency: 196.00 },
      { name: "Sol#3", frequency: 207.65 },
      { name: "La3", frequency: 220.00 },
      { name: "La#3", frequency: 233.08 },
      { name: "Si3", frequency: 246.94 }
    ]
  },
  {
    name: "Médium",
    range: "300-600 Hz",
    notes: [
      { name: "Do4", frequency: 261.63 },
      { name: "Do#4", frequency: 277.18 },
      { name: "Ré4", frequency: 293.66 },
      { name: "Ré#4", frequency: 311.13 },
      { name: "Mi4", frequency: 329.63 },
      { name: "Fa4", frequency: 349.23 },
      { name: "Fa#4", frequency: 369.99 },
      { name: "Sol4", frequency: 392.00 },
      { name: "Sol#4", frequency: 415.30 },
      { name: "La4", frequency: 440.00 },
      { name: "La#4", frequency: 466.16 },
      { name: "Si4", frequency: 493.88 }
    ]
  }
];

const ExerciseModule = () => {
  const [selectedRange, setSelectedRange] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [audioState, audioControls] = useAudio();

  const targetFrequency = frequencyRanges
    .flatMap(range => range.notes)
    .find(note => note.name === selectedNote)?.frequency || 0;

  const handleFrequencyChange = (frequency: number | null) => {
    if (frequency && frequency >= 75 && frequency <= 600) {
      setCurrentFrequency(frequency);
    } else {
      setCurrentFrequency(null);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsRecording(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Left Panel: Selection and Control */}
      <div className="space-y-6">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <h3 className="text-xl font-semibold mb-6">Exercice d'écoute des fréquences</h3>
          
          <FrequencySelector
            ranges={frequencyRanges}
            selectedRange={selectedRange}
            selectedNote={selectedNote}
            onRangeChange={setSelectedRange}
            onNoteChange={setSelectedNote}
            onPlay={audioControls.playSound}
            isPlaying={audioState.isPlaying}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Right Panel: Analysis and Visualization */}
      <div className="space-y-6">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl font-semibold">Calibration vocale</h3>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRecording(!isRecording)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500/20 hover:bg-red-500/30' 
                  : 'bg-purple-500/20 hover:bg-purple-500/30'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? 'Arrêter' : 'Démarrer'}</span>
            </motion.button>
          </div>

          <PitchDetector
            isRecording={isRecording}
            onFrequencyChange={handleFrequencyChange}
            onError={handleError}
          />

          {currentFrequency && targetFrequency > 0 && (
            <PitchDisplay
              frequency={currentFrequency}
              targetFrequency={targetFrequency}
            />
          )}
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-1 text-purple-300" />
            <div>
              <h4 className="font-medium mb-2">Guide d'utilisation</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-purple-100/80">
                <li>Commencez par les fréquences graves qui sont plus faciles à entendre</li>
                <li>Écoutez chaque note attentivement et essayez de la reproduire vocalement</li>
                <li>Prenez votre temps pour explorer différentes plages de fréquences</li>
                <li>Faites des pauses régulières pour reposer vos oreilles et votre voix</li>
                <li>Les fréquences sont limitées entre 75 Hz et 600 Hz pour une meilleure précision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModule;