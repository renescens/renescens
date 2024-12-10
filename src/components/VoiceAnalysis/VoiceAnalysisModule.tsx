import React, { useState } from 'react';
import { Mic, BarChart2, PieChart, FileText, Crown, RefreshCw, Activity, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import AudioAnalyzer from './AudioAnalyzer';
import NoteDisplay from './NoteDisplay';
import NotePieChart from './NotePieChart';
import NoteReport from './NoteReport';
import DominantNoteAnalysis from './DominantNoteAnalysis';
import FrequencyAnalysis from './FrequencyAnalysis';
import AnalysisSender from './AnalysisSender';
import { DetectedNote } from './types';

const VoiceAnalysisModule = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [detectedNotes, setDetectedNotes] = useState<DetectedNote[]>([]);
  const [dominantNotes, setDominantNotes] = useState<{[key: string]: number}>({});
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);

  const handleNoteDetected = (note: DetectedNote) => {
    setDetectedNotes(prev => [...prev, note]);
    setDominantNotes(prev => ({
      ...prev,
      [note.note.name]: (prev[note.note.name] || 0) + 1
    }));
    setCurrentFrequency(note.note.frequency);
  };

  const handleReset = () => {
    setDetectedNotes([]);
    setDominantNotes({});
    setCurrentFrequency(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Analyseur Audio */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Mic className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl font-semibold">Analyse Vocale</h3>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
              title="Réinitialiser l'analyse"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Réinitialiser</span>
            </motion.button>
          </div>

          <AudioAnalyzer
            isRecording={isRecording}
            onNoteDetected={handleNoteDetected}
            onRecordingChange={setIsRecording}
          />
        </div>

        {/* Notes Détectées */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-6 h-6 text-purple-300" />
            <h3 className="text-xl font-semibold">Notes Détectées</h3>
          </div>

          <NoteDisplay notes={detectedNotes} />
        </div>
      </div>

      {/* Analyse des Fréquences */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Analyse des Fréquences</h3>
        </div>

        <FrequencyAnalysis frequency={currentFrequency} />
      </div>

      {/* Analyse des Notes Dominantes */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Analyse des Notes</h3>
        </div>

        <DominantNoteAnalysis 
          notes={detectedNotes}
          dominantNotes={dominantNotes}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Distribution des Notes */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-6 h-6 text-purple-300" />
            <h3 className="text-xl font-semibold">Distribution des Notes</h3>
          </div>

          <NotePieChart dominantNotes={dominantNotes} />
        </div>

        {/* Analyse Émotionnelle */}
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-purple-300" />
            <h3 className="text-xl font-semibold">Analyse Émotionnelle</h3>
          </div>

          <NoteReport notes={detectedNotes} dominantNotes={dominantNotes} />
        </div>
      </div>

      {/* Module d'envoi d'analyse */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-2 mb-6">
          <Send className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Envoi pour Analyse Approfondie</h3>
        </div>

        <AnalysisSender
          notes={detectedNotes}
          dominantNotes={dominantNotes}
          currentFrequency={currentFrequency}
          disabled={detectedNotes.length === 0 || isRecording}
        />
      </div>
    </div>
  );
};

export default VoiceAnalysisModule;