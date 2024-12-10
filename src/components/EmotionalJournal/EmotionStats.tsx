import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Calendar, BarChart2 } from 'lucide-react';
import { EmotionStats, EmotionLog } from '../../types/emotion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface EmotionStatsProps {
  stats: EmotionStats;
  logs: EmotionLog[];
}

const EmotionStatsView: React.FC<EmotionStatsProps> = ({ stats, logs }) => {
  // Function to calculate the streak of consecutive logs
  const getStreakDays = () => {
    if (logs.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedLogs = logs
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const lastLogDate = new Date(sortedLogs[0].date);
    lastLogDate.setHours(0, 0, 0, 0);
    
    if (lastLogDate.getTime() !== today.getTime()) return 0;
    
    for (let i = 1; i < sortedLogs.length; i++) {
      const currentDate = new Date(sortedLogs[i].date);
      currentDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Chart data setup
  const data = {
    labels: logs.map(log => new Date(log.date).toLocaleDateString()), // Dates on x-axis
    datasets: [
      {
        label: 'État émotionnel',
        data: logs.map(log => log.emotionalState),
        borderColor: 'rgba(75, 192, 192, 1)', // Line color for emotional state
        fill: false,
      },
      {
        label: 'Énergie',
        data: logs.map(log => log.energyLevel),
        borderColor: 'rgba(255, 159, 64, 1)', // Line color for energy level
        fill: false,
      },
      {
        label: 'Stress',
        data: logs.map(log => log.stressLevel),
        borderColor: 'rgba(153, 102, 255, 1)', // Line color for stress level
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Average Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-300" />
            <h4 className="font-medium">État émotionnel moyen</h4>
          </div>
          <p className="text-2xl font-bold">{stats.averageEmotional.toFixed(1)}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-purple-300" />
            <h4 className="font-medium">Niveau d'énergie moyen</h4>
          </div>
          <p className="text-2xl font-bold">{stats.averageEnergy.toFixed(1)}</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-purple-300" />
            <h4 className="font-medium">Niveau de stress moyen</h4>
          </div>
          <p className="text-2xl font-bold">{stats.averageStress.toFixed(1)}</p>
        </div>
      </div>

      {/* Follow-up Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-300" />
            <h4 className="font-medium">Suivi</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">Entrées totales</span>
              <span className="font-bold">{stats.totalEntries}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">Jours consécutifs</span>
              <span className="font-bold">{getStreakDays()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">Dernière entrée</span>
              <span className="font-bold">
                {stats.lastEntry ? new Date(stats.lastEntry).toLocaleDateString() : 'Aucune'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-300" />
            <h4 className="font-medium">Tendances</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">État émotionnel</span>
              <div className="flex items-center gap-1">
                {stats.emotionalTrend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : stats.emotionalTrend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-purple-300" />
                )}
                <span>
                  {stats.emotionalTrend === 'up' ? 'En hausse' :
                   stats.emotionalTrend === 'down' ? 'En baisse' :
                   'Stable'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">Énergie</span>
              <div className="flex items-center gap-1">
                {stats.energyTrend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : stats.energyTrend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-purple-300" />
                )}
                <span>
                  {stats.energyTrend === 'up' ? 'En hausse' :
                   stats.energyTrend === 'down' ? 'En baisse' :
                   'Stable'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-purple-200/60">Stress</span>
              <div className="flex items-center gap-1">
                {stats.stressTrend === 'up' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : stats.stressTrend === 'down' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <Minus className="w-4 h-4 text-purple-300" />
                )}
                <span>
                  {stats.stressTrend === 'up' ? 'En hausse' :
                   stats.stressTrend === 'down' ? 'En baisse' :
                   'Stable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emotion Chart */}
      <div className="bg-white/10 rounded-xl p-4" style={{ height: '300px' }}>
        <h4 className="font-medium mb-4">Tendances</h4>
        <Line data={data} />
      </div>
    </div>
  );
};

export default EmotionStatsView;
