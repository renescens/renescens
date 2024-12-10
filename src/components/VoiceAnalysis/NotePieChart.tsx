import React from 'react';
import { NotePieChartProps } from './types';

const NotePieChart: React.FC<NotePieChartProps> = ({ dominantNotes }) => {
  const total = Object.values(dominantNotes).reduce((a, b) => a + b, 0);
  let currentAngle = 0;

  const colors = [
    '#9333EA', '#A855F7', '#C084FC', '#D8B4FE', '#F3E8FF',
    '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3'
  ];

  return (
    <div className="flex flex-col items-center gap-6">
      <svg width="200" height="200" viewBox="-1 -1 2 2">
        {Object.entries(dominantNotes).map(([note, count], index) => {
          const percentage = count / total;
          const angle = percentage * Math.PI * 2;
          const largeArcFlag = percentage > 0.5 ? 1 : 0;
          
          const x1 = Math.cos(currentAngle);
          const y1 = Math.sin(currentAngle);
          const x2 = Math.cos(currentAngle + angle);
          const y2 = Math.sin(currentAngle + angle);

          const pathData = `
            M ${x1} ${y1}
            A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}
            L 0 0
          `;

          const slice = (
            <path
              key={note}
              d={pathData}
              fill={colors[index % colors.length]}
              opacity={0.8}
            />
          );

          currentAngle += angle;
          return slice;
        })}
      </svg>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(dominantNotes).map(([note, count], index) => (
          <div key={note} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm">
              {note} ({Math.round(count / total * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotePieChart;