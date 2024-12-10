import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Book, Plus, TrendingUp, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { EmotionLog, EmotionChartData, EmotionStats } from '../../types/emotion';
import EmotionTrends from './EmotionTrends';
import EmotionCalendar from './EmotionCalendar';
import EmotionStatsView from './EmotionStats';
import EmotionForm from './EmotionForm';
import { useAuth } from '../../hooks/useAuth';
import { getEmotionLogsForUser } from '../../services/emotions.service';

const EmotionalJournal: React.FC = () => {
  const [view, setView] = useState<'chart' | 'calendar' | 'trends' | 'stats'>('chart');
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [chartData, setChartData] = useState<EmotionChartData[]>([]);
  const [stats, setStats] = useState<EmotionStats>({
    averageEmotional: 0,
    averageEnergy: 0,
    averageStress: 0,
    emotionalTrend: 'stable',
    energyTrend: 'stable',
    stressTrend: 'stable',
    totalEntries: 0,
    streakDays: 0,
    lastEntry: null
  });
  const auth = useAuth();

  useEffect(() => {
    const getChartData = async () => {
      const mockLogs = await getEmotionLogsForUser(auth.profile?.id);
      setLogs(mockLogs);
    };
    getChartData();
  }, [auth]);

  const handleAddLog = (newLog: Omit<EmotionLog, 'id'>) => {
    const logWithId: EmotionLog = {
      ...newLog,
      id: crypto.randomUUID()
    };

    setLogs((prevLogs) => [...prevLogs, logWithId]);
  };

  useEffect(() => {
    // Mettre à jour les données du graphique
    const formattedData = logs.map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      emotionalState: log.emotionalState,
      energyLevel: log.energyLevel,
      stressLevel: log.stressLevel,
      activities: log.activities
    }));

    setChartData(formattedData);

    // Mettre à jour les statistiques
    if (logs.length > 0) {
      const avgEmotional = logs.reduce((acc, log) => acc + log.emotionalState, 0) / logs.length;
      const avgEnergy = logs.reduce((acc, log) => acc + log.energyLevel, 0) / logs.length;
      const avgStress = logs.reduce((acc, log) => acc + log.stressLevel, 0) / logs.length;

      // Calculer les tendances
      const recentLogs = logs.slice(-5);
      const getTrend = (key: keyof Pick<EmotionLog, 'emotionalState' | 'energyLevel' | 'stressLevel'>) => {
        if (recentLogs.length < 2) return 'stable';
        const firstValue = recentLogs[0][key];
        const lastValue = recentLogs[recentLogs.length - 1][key];
        if (lastValue - firstValue > 0.5) return 'up';
        if (firstValue - lastValue > 0.5) return 'down';
        return 'stable';
      };

      setStats({
        averageEmotional: avgEmotional,
        averageEnergy: avgEnergy,
        averageStress: avgStress,
        emotionalTrend: getTrend('emotionalState'),
        energyTrend: getTrend('energyLevel'),
        stressTrend: getTrend('stressLevel'),
        totalEntries: logs.length,
        streakDays: 0, // Calculé dans EmotionStats
        lastEntry: logs[logs.length - 1].date
      });
    }
  }, [logs]);

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = new Date(log.date).toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, EmotionLog[]>);

  return (
    <div className="mt-16 space-y-8">
      {/* En-tête */}
      <div className="bg-white/10 rounded-xl p-8 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Book className="w-7 h-7 text-purple-300" />
            <h3 className="text-2xl font-semibold">Journal Émotionnel</h3>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-5 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle entrée</span>
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setView('chart')}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-lg transition-colors ${
              view === 'chart' ? 'bg-purple-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Évolution</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-lg transition-colors ${
              view === 'calendar' ? 'bg-purple-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            <span>Calendrier</span>
          </button>
          {/* <button
            onClick={() => setView('trends')}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-lg transition-colors ${
              view === 'trends' ? 'bg-purple-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Tendances</span>
          </button> */}
        </div>
      </div>

      {/* Contenu */}
      {view === 'chart' && (
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-lg">
          <h4 className="text-xl font-semibold mb-8">Évolution Émotionnelle</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)' }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  tickFormatter={(value) => {
                    switch (value) {
                      case 0:
                        return 'Très bas';
                      case 2:
                        return 'Bas';
                      case 4:
                        return 'Modéré bas';
                      case 6:
                        return 'Modéré haut';
                      case 8:
                        return 'Haut';
                      case 10:
                        return 'Très haut';
                      default:
                        return '';
                    }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 20, 60, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '12px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="emotionalState"
                  name="État émotionnel"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="energyLevel"
                  name="Énergie"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="stressLevel"
                  name="Stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'calendar' && <EmotionCalendar logs={logs} />}
      {view === 'trends' && <EmotionTrends stats={stats} />}
      {view === 'stats' && <EmotionStatsView stats={stats} />}

      {/* Affichage des logs groupés par date */}
      <div className="bg-white/10 rounded-xl p-8 backdrop-blur-lg">
        <h4 className="text-xl font-semibold mb-4">Historique des Journaux</h4>
        <div className="space-y-4">
          {Object.entries(groupedLogs).map(([date, logsForDate]) => (
            <div key={date} className="space-y-2">
              <h5 className="text-lg font-semibold">{date}</h5>
              <div className="space-y-1">
                {logsForDate.map((log) => (
                  <p key={log.id} className="text-sm">{`Emotions: ${log.emotionalState}, Energy: ${log.energyLevel}, Stress: ${log.stressLevel}`}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && <EmotionForm onAddLog={handleAddLog} onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default EmotionalJournal;
