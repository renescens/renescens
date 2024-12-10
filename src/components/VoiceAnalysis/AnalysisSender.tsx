import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader, AlertCircle } from 'lucide-react';
import { DetectedNote } from './types';
import { generateAIAnalysis } from '../../services/ai.service';
import LifeSpheresQuestionnaire, { LifeSpheresState } from './LifeSpheresQuestionnaire';
import AIAnalysisDisplay from './AIAnalysisDisplay';

interface AnalysisSenderProps {
  notes: DetectedNote[];
  dominantNotes: {[key: string]: number};
  currentFrequency: number | null;
  disabled: boolean;
}

const AnalysisSender: React.FC<AnalysisSenderProps> = ({
  notes,
  dominantNotes,
  currentFrequency,
  disabled
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [userState, setUserState] = useState({
    physicalState: 5,
    mentalState: 5,
    stressLevel: 5,
    sleepQuality: 5,
    notes: '',
    lifeSpheres: {
      health: {
        physicalHealth: '',
        mentalHealth: '',
        energyLevels: '',
        sleepQuality: '',
        stressManagement: ''
      },
      career: {
        satisfaction: '',
        workLifeBalance: '',
        growth: '',
        relationships: '',
        purpose: ''
      },
      financial: {
        stability: '',
        security: '',
        goals: '',
        management: '',
        satisfaction: ''
      },
      relationships: {
        personal: '',
        professional: '',
        familial: '',
        social: '',
        intimacy: ''
      }
    } as LifeSpheresState
  });

  const handleGenerateAnalysis = async () => {
    if (notes.length === 0) {
      setError('Veuillez enregistrer votre voix avant de générer une analyse');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await generateAIAnalysis({
        notes,
        dominantNotes,
        currentFrequency,
        userState
      });

      setAiAnalysis(analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* État actuel */}
        <div className="space-y-4">
          <h4 className="font-medium">État Actuel</h4>
          
          <div className="space-y-4">
            {/* Physical State */}
            <div>
              <label className="block text-sm text-purple-200/80 mb-2">
                État physique (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={userState.physicalState}
                onChange={e => setUserState(prev => ({ ...prev, physicalState: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-purple-200/60">
                <span>Faible</span>
                <span>{userState.physicalState}</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Mental State */}
            <div>
              <label className="block text-sm text-purple-200/80 mb-2">
                État mental (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={userState.mentalState}
                onChange={e => setUserState(prev => ({ ...prev, mentalState: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-purple-200/60">
                <span>Perturbé</span>
                <span>{userState.mentalState}</span>
                <span>Serein</span>
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-sm text-purple-200/80 mb-2">
                Niveau de stress (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={userState.stressLevel}
                onChange={e => setUserState(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-purple-200/60">
                <span>Calme</span>
                <span>{userState.stressLevel}</span>
                <span>Très stressé</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm text-purple-200/80 mb-2">
                Qualité du sommeil (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={userState.sleepQuality}
                onChange={e => setUserState(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-purple-200/60">
                <span>Mauvaise</span>
                <span>{userState.sleepQuality}</span>
                <span>Excellente</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm text-purple-200/80 mb-2">
                Notes complémentaires
              </label>
              <textarea
                value={userState.notes}
                onChange={e => setUserState(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
                rows={3}
                placeholder="Décrivez votre état général, vos sensations..."
              />
            </div>
          </div>
        </div>

        {/* Life Spheres Questionnaire */}
        <LifeSpheresQuestionnaire
          value={userState.lifeSpheres}
          onChange={lifeSpheres => setUserState(prev => ({ ...prev, lifeSpheres }))}
        />

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateAnalysis}
          disabled={disabled || loading}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            disabled || loading
              ? 'bg-gray-500/20 cursor-not-allowed'
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Brain className="w-5 h-5" />
              <span>Générer l'analyse IA</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Affichage de l'analyse */}
      {(loading || aiAnalysis) && (
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-6 h-6 text-purple-300" />
            <h3 className="text-xl font-semibold">Programme Journalier Personnalisé</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-300" />
              <p className="text-purple-200/60">Analyse en cours...</p>
            </div>
          ) : (
            <AIAnalysisDisplay analysis={aiAnalysis} />
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisSender;