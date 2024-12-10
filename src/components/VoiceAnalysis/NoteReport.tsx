import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { NoteReportProps } from './types';

const emotionalAnalysis: { [key: string]: string } = {
  'C': "Expression personnelle et créativité",
  'D': "Confiance et affirmation de soi",
  'E': "Communication et relations",
  'F': "Émotions et intuition",
  'G': "Harmonie et équilibre",
  'A': "Vérité et authenticité",
  'B': "Spiritualité et connexion"
};

const NoteReport: React.FC<NoteReportProps> = ({ notes, dominantNotes }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center text-purple-200/60 py-8">
        Commencez l'enregistrement pour voir l'analyse
      </div>
    );
  }

  const dominantNote = Object.entries(dominantNotes)
    .sort(([,a], [,b]) => b - a)[0]?.[0]?.charAt(0);

  const analysis = emotionalAnalysis[dominantNote] || "Analyse en cours...";

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5 text-purple-300" />
          <div>
            <h4 className="font-semibold mb-1">Situation Actuelle</h4>
            <p className="text-sm text-purple-200/80">{analysis}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-red-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-300" />
          <div>
            <h4 className="font-semibold mb-1">Points de Blocage Potentiels</h4>
            <ul className="text-sm text-purple-200/80 space-y-1">
              <li>• Tension dans l'expression vocale</li>
              <li>• Respiration superficielle</li>
              <li>• Retenue émotionnelle</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-300" />
          <div>
            <h4 className="font-semibold mb-1">Solutions Recommandées</h4>
            <ul className="text-sm text-purple-200/80 space-y-1">
              <li>• Exercices de respiration profonde</li>
              <li>• Vocalises douces et progressives</li>
              <li>• Méditation sonore guidée</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteReport;