import React from 'react';
import { NoteDisplayProps } from './types';

const NoteDisplay: React.FC<NoteDisplayProps> = ({ notes }) => {
  const lastNotes = notes.slice(-10).reverse();

  return (
    <div className="space-y-2">
      {lastNotes.map((note, index) => (
        <div
          key={note.timestamp}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="font-mono">
              {note.note.name}{note.note.octave}
            </span>
          </div>
          <div className="text-sm text-purple-200/60">
            {note.note.frequency.toFixed(1)} Hz
          </div>
          <div 
            className="w-20 h-2 rounded-full bg-white/10 overflow-hidden"
            title={`Confiance: ${(note.confidence * 100).toFixed(1)}%`}
          >
            <div
              className="h-full bg-purple-400"
              style={{ width: `${note.confidence * 100}%` }}
            />
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <div className="text-center text-purple-200/60 py-8">
          Commencez l'enregistrement pour voir les notes détectées
        </div>
      )}
    </div>
  );
};

export default NoteDisplay;