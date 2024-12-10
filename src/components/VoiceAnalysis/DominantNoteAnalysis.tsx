import React from 'react';
import { Crown, TrendingUp, TrendingDown, Music } from 'lucide-react';
import { DetectedNote } from './types';

interface DominantNoteAnalysisProps {
  notes: DetectedNote[];
  dominantNotes: {[key: string]: number};
}

const DominantNoteAnalysis: React.FC<DominantNoteAnalysisProps> = ({ notes, dominantNotes }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center text-purple-200/60 py-8">
        Commencez l'enregistrement pour voir l'analyse des notes dominantes
      </div>
    );
  }

  // Filtrer les notes en dessous de 75 Hz
  const filteredNotes = notes.filter(note => note.note.frequency >= 75);
  
  // Recalculer les notes dominantes après filtrage
  const filteredDominantNotes: {[key: string]: number} = {};
  filteredNotes.forEach(note => {
    const noteName = note.note.name;
    filteredDominantNotes[noteName] = (filteredDominantNotes[noteName] || 0) + 1;
  });

  // Trouver la note dominante (la plus fréquente)
  const dominantNote = Object.entries(filteredDominantNotes)
    .sort(([,a], [,b]) => b - a)[0];

  // Créer un Map pour stocker les notes uniques
  const uniqueNotes = new Map<string, DetectedNote>();
  
  // Regrouper les notes
  filteredNotes.forEach(note => {
    const key = `${note.note.name}${note.note.octave}`;
    if (!uniqueNotes.has(key) || note.note.frequency > uniqueNotes.get(key)!.note.frequency) {
      uniqueNotes.set(key, note);
    }
  });

  // Convertir le Map en array et trier
  const sortedNotes = Array.from(uniqueNotes.values())
    .sort((a, b) => b.note.frequency - a.note.frequency);

  // Obtenir les 3 plus hautes et plus basses notes
  const highestNotes = sortedNotes.slice(0, 3);
  const lowestNotes = sortedNotes.slice(-3).reverse();

  // Obtenir les notes dominantes triées par occurrence
  const sortedDominantNotes = Object.entries(filteredDominantNotes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Note Dominante */}
      <div className="p-4 bg-indigo-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <Music className="w-5 h-5 mt-0.5 text-indigo-300" />
          <div>
            <h4 className="font-semibold mb-3">Note Dominante</h4>
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
              <span className="text-2xl font-bold text-indigo-300">
                {dominantNote ? dominantNote[0] : 'N/A'}
              </span>
              <div className="text-sm text-purple-200/60">
                {dominantNote ? `${dominantNote[1]} occurrences` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Dominantes */}
      <div className="p-4 bg-amber-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 mt-0.5 text-amber-300" />
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Notes Dominantes</h4>
            <div className="grid gap-2">
              {sortedDominantNotes.map(([note, count], index) => (
                <div 
                  key={note}
                  className="flex items-center justify-between bg-white/5 p-2 rounded-lg"
                >
                  <span className="font-mono">{note}</span>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-purple-200/60">
                      {count} détections
                    </div>
                    <div 
                      className="w-20 h-2 rounded-full bg-white/10 overflow-hidden"
                    >
                      <div
                        className="h-full bg-amber-400/60"
                        style={{ 
                          width: `${(count / Object.values(filteredDominantNotes).reduce((a, b) => a + b, 0)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes les plus hautes */}
      <div className="p-4 bg-blue-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 mt-0.5 text-blue-300" />
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Notes les Plus Hautes</h4>
            <div className="grid gap-2">
              {highestNotes.map((note) => (
                <div 
                  key={`${note.note.name}${note.note.octave}`}
                  className="flex items-center justify-between bg-white/5 p-2 rounded-lg"
                >
                  <span className="font-mono">{note.note.name}{note.note.octave}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes les plus basses */}
      <div className="p-4 bg-emerald-500/10 rounded-lg">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 mt-0.5 text-emerald-300" />
          <div className="flex-1">
            <h4 className="font-semibold mb-3">Notes les Plus Basses</h4>
            <div className="grid gap-2">
              {lowestNotes.map((note) => (
                <div 
                  key={`${note.note.name}${note.note.octave}`}
                  className="flex items-center justify-between bg-white/5 p-2 rounded-lg"
                >
                  <span className="font-mono">{note.note.name}{note.note.octave}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DominantNoteAnalysis;