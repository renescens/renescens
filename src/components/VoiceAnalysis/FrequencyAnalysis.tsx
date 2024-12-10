import React from 'react';
import { Activity, Heart, Zap } from 'lucide-react';
import { analyzeFrequencyEffects } from '../../utils/frequencyAnalysis';

interface FrequencyAnalysisProps {
  frequency: number | null;
}

const FrequencyAnalysis: React.FC<FrequencyAnalysisProps> = ({ frequency }) => {
  if (!frequency) return null;

  const analysis = analyzeFrequencyEffects(frequency);
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold mb-2">{analysis.range}</h4>
        <p className="text-purple-200/80">{analysis.frequency.toFixed(2)} Hz</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-purple-500/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-purple-300" />
            <h5 className="font-medium">Effets Physiques</h5>
          </div>
          <ul className="space-y-2 text-sm text-purple-200/80">
            {analysis.effects.physical.map((effect, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-300 mt-2" />
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-pink-500/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-300" />
            <h5 className="font-medium">Effets Émotionnels</h5>
          </div>
          <ul className="space-y-2 text-sm text-purple-200/80">
            {analysis.effects.emotional.map((effect, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-2" />
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/10 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-300" />
            <h5 className="font-medium">Effets Énergétiques</h5>
          </div>
          <ul className="space-y-2 text-sm text-purple-200/80">
            {analysis.effects.energetic.map((effect, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-2" />
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FrequencyAnalysis;