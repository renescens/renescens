import React from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { EmotionLog } from '../../types/emotion';

interface EmotionTrendsProps {
  logs: EmotionLog[];
}

const EmotionTrends: React.FC<EmotionTrendsProps> = ({ logs }) => {
  const getActivityImpact = (activity: string) => {
    const logsWithActivity = logs.filter(log => log.activities.includes(activity));
    if (logsWithActivity.length === 0) return null;

    const avgEmotional = logsWithActivity.reduce((acc, log) => acc + log.emotionalState, 0) / logsWithActivity.length;
    const avgEnergy = logsWithActivity.reduce((acc, log) => acc + log.energyLevel, 0) / logsWithActivity.length;
    const avgStress = logsWithActivity.reduce((acc, log) => acc + log.stressLevel, 0) / logsWithActivity.length;

    const overallAvgEmotional = logs.reduce((acc, log) => acc + log.emotionalState, 0) / logs.length;
    const overallAvgEnergy = logs.reduce((acc, log) => acc + log.energyLevel, 0) / logs.length;
    const overallAvgStress = logs.reduce((acc, log) => acc + log.stressLevel, 0) / logs.length;

    return {
      emotional: avgEmotional - overallAvgEmotional,
      energy: avgEnergy - overallAvgEnergy,
      stress: avgStress - overallAvgStress
    };
  };

  const activities = Array.from(new Set(logs.flatMap(log => log.activities)));
  const activityImpacts = activities.map(activity => ({
    activity,
    impact: getActivityImpact(activity)
  })).filter(({ impact }) => impact !== null);

  return (
    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-300" />
        <h3 className="text-xl font-semibold">Impact des Activités</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activityImpacts.map(({ activity, impact }) => (
          <div key={activity} className="bg-white/5 rounded-lg p-4">
            <h4 className="font-medium mb-3">{activity}</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/60">État émotionnel</span>
                <div className="flex items-center gap-1">
                  {impact!.emotional > 0.5 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : impact!.emotional < -0.5 ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-purple-300" />
                  )}
                  <span className="text-sm">
                    {impact!.emotional > 0 ? '+' : ''}{impact!.emotional.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/60">Énergie</span>
                <div className="flex items-center gap-1">
                  {impact!.energy > 0.5 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : impact!.energy < -0.5 ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-purple-300" />
                  )}
                  <span className="text-sm">
                    {impact!.energy > 0 ? '+' : ''}{impact!.energy.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200/60">Stress</span>
                <div className="flex items-center gap-1">
                  {impact!.stress < -0.5 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : impact!.stress > 0.5 ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-purple-300" />
                  )}
                  <span className="text-sm">
                    {impact!.stress > 0 ? '+' : ''}{impact!.stress.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionTrends;