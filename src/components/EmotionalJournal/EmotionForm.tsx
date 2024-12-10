import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calendar } from 'lucide-react';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; 

const ACTIVITIES = [
  'Méditation',
  'Exercice physique',
  'Lecture',
  'Musique',
  'Travail',
  'Repos',
  'Social',
  'Nature',
  'Créativité',
];

const CYCLE_EXERCISES = [
  'Respiration consciente',
  'Méditation sonore',
  'Libération émotionnelle',
  'Harmonisation énergétique',
  'Ancrage',
  'Visualisation',
  'Expression vocale',
];

const EmotionForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    emotionalState: 5,
    energyLevel: 5,
    stressLevel: 5,
    notes: '',
    activities: [] as string[],
    cycleExercises: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userId = auth.currentUser?.uid; 
    if (!userId) {
      console.error('User not authenticated.');
      return;
    }
  
    try {
      const userProfileRef = doc(db, 'profiles', userId);
  
      const userProfileSnapshot = await getDoc(userProfileRef);
      if (!userProfileSnapshot.exists()) {
        await setDoc(userProfileRef, { createdAt: new Date().toISOString() });
      }
  
      const journalRef = collection(userProfileRef, 'journalEmotionnel');
  
      const logData = {
        emotionalState: formData.emotionalState,
        energyLevel: formData.energyLevel,
        stressLevel: formData.stressLevel,
        notes: formData.notes,
        activities: formData.activities,
        cycleExercises: formData.cycleExercises,
        date: new Date().toISOString(),
      };
  
      await addDoc(journalRef, logData);
  
      console.log('Emotion log saved successfully!', logData);
      onClose(); 
    } catch (error) {
      console.error('Error saving emotion log:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Nouvelle entrée</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emotional State */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">État émotionnel (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.emotionalState}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, emotionalState: parseInt(e.target.value) }))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Niveau d'énergie (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.energyLevel}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, energyLevel: parseInt(e.target.value) }))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Niveau de stress (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stressLevel: parseInt(e.target.value) }))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Cycle Exercises */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-300" />
              <label className="text-sm font-medium">Exercices du Cycle 21 Jours réalisés</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {CYCLE_EXERCISES.map((exercise) => (
                <button
                  key={exercise}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      cycleExercises: prev.cycleExercises.includes(exercise)
                        ? prev.cycleExercises.filter((e) => e !== exercise)
                        : [...prev.cycleExercises, exercise],
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.cycleExercises.includes(exercise)
                      ? 'bg-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium mb-2">Autres activités</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      activities: prev.activities.includes(activity)
                        ? prev.activities.filter((a) => a !== activity)
                        : [...prev.activities, activity],
                    }))
                  }
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.activities.includes(activity)
                      ? 'bg-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              rows={3}
              placeholder="Comment vous sentez-vous ? Qu'est-ce qui a influencé votre journée ?"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-white/10 rounded-lg">
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmotionForm;
