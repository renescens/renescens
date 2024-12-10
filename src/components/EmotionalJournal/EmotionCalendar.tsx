import React from 'react';
import { Calendar } from 'lucide-react';
import { EmotionLog } from '../../types/emotion';

interface EmotionCalendarProps {
  logs: EmotionLog[];
}

const EmotionCalendar: React.FC<EmotionCalendarProps> = ({ logs }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const getLogForDay = (day: number) => {
    return logs.find(log => {
      const logDate = new Date(log.date);
      return logDate.getDate() === day &&
             logDate.getMonth() === today.getMonth() &&
             logDate.getFullYear() === today.getFullYear();
    });
  };

  const getEmotionColor = (log: EmotionLog) => {
    const avgScore = (log.emotionalState + log.energyLevel + (10 - log.stressLevel)) / 3;
    if (avgScore >= 7) return 'bg-green-500/30';
    if (avgScore >= 5) return 'bg-yellow-500/30';
    return 'bg-red-500/30';
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-purple-300" />
        <h3 className="text-xl font-semibold">Calendrier Émotionnel</h3>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="text-center text-sm text-purple-200/60 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const log = getLogForDay(day);
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg ${
                log ? getEmotionColor(log) : 'bg-white/5'
              } ${isToday ? 'ring-2 ring-purple-500' : ''} p-2`}
            >
              <div className="text-sm">{day}</div>
              {log && (
                <div className="mt-1 text-xs">
                  {log.activities.length > 0 && '•'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionCalendar;