import React from 'react';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { DayContent } from './types';
import VideoPlayer from '../SoundLibrary/VideoPlayer';

interface DayCardProps {
  day: number;
  content: DayContent;
  isCompleted: boolean;
  isLocked: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onComplete: () => void;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  content,
  isCompleted,
  isLocked,
  isSelected,
  onSelect,
  onComplete
}) => {
  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      className={`p-4 rounded-xl cursor-pointer transition-colors ${
        isSelected
          ? 'bg-purple-500/30'
          : isCompleted
          ? 'bg-green-500/20'
          : isLocked
          ? 'bg-gray-500/20 cursor-not-allowed'
          : 'bg-white/10 hover:bg-white/20'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm text-purple-200/60 mb-1">Jour {day}</div>
          <h4 className="font-semibold">{content.title}</h4>
        </div>
        <div className="p-2 rounded-lg bg-white/5">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : (
            <PlayCircle className="w-5 h-5 text-purple-300" />
          )}
        </div>
      </div>

      {!isLocked && (
        <>
          {/* Video Player */}
          <div className="mb-4">
            <VideoPlayer videoId={content.videoUrl} />
          </div>

          <div className="space-y-2 mb-4">
            <h5 className="text-sm font-medium text-purple-200/80">Axes :</h5>
            <ul className="text-sm space-y-1 text-purple-200/60">
              {content.exercises.map((exercice, index) => (
                <li key={index}> {exercice} </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-medium text-purple-200/80 mb-2">
              Objectif du jour:
            </h5>
            <p className="text-sm text-purple-200/60">{content.objective}</p>
          </div>

          {!isCompleted && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="mt-4 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                       rounded-lg transition-colors text-sm font-medium"
            >
              Marquer comme terminé
            </motion.button>
          )}
        </>
      )}

      {isLocked && (
        <div className="mt-4 text-sm text-gray-400 text-center">
          Terminez le jour précédent pour débloquer
        </div>
      )}
    </motion.div>
  );
};

export default DayCard;