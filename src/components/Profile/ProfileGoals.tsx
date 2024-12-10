import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, Flag, Clock, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { UserProfile } from '../../types/user';

interface ProfileGoalsProps {
  goals: UserProfile['goals'];
  onAddGoal: (goal: Omit<UserProfile['goals'][0], 'id' | 'status' | 'progress' | 'createdAt' | 'completedAt'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<UserProfile['goals'][0]>) => void;
  onDeleteGoal: (goalId: string) => void;
}

const ProfileGoals: React.FC<ProfileGoalsProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'technique' as const,
    priority: 'medium' as const,
    targetDate: undefined as Date | undefined
  });

  const categories = {
    technique: 'Technique Vocale',
    repertoire: 'Répertoire',
    performance: 'Performance',
    theory: 'Théorie Musicale',
    other: 'Autre'
  };

  const priorities = {
    low: { label: 'Basse', color: 'bg-blue-500/20' },
    medium: { label: 'Moyenne', color: 'bg-yellow-500/20' },
    high: { label: 'Haute', color: 'bg-red-500/20' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGoal(newGoal);
    setNewGoal({
      title: '',
      description: '',
      category: 'technique',
      priority: 'medium',
      targetDate: undefined
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-300" />
          <h3 className="text-lg font-semibold">Objectifs</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un objectif</span>
        </motion.button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newGoal.description}
              onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={newGoal.category}
                onChange={e => setNewGoal(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              >
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priorité</label>
              <select
                value={newGoal.priority}
                onChange={e => setNewGoal(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
              >
                {Object.entries(priorities).map(([value, { label }]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date cible</label>
            <input
              type="date"
              onChange={e => setNewGoal(prev => ({ 
                ...prev, 
                targetDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm"
            >
              Ajouter
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="bg-white/5 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{goal.title}</h4>
                <p className="text-sm text-purple-200/60 mt-1">{goal.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateGoal(goal.id, {
                    status: goal.status === 'completed' ? 'active' : 'completed',
                    completedAt: goal.status === 'completed' ? undefined : new Date()
                  })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    goal.status === 'completed'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className={`px-2 py-1 rounded-full ${priorities[goal.priority].color}`}>
                {priorities[goal.priority].label}
              </div>
              <div className="flex items-center gap-1 text-purple-200/60">
                <Flag className="w-4 h-4" />
                <span>{categories[goal.category]}</span>
              </div>
              {goal.targetDate && (
                <div className="flex items-center gap-1 text-purple-200/60">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {goal.status !== 'completed' && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-purple-200/60">Progression</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {goals.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-purple-200/60">
            Aucun objectif défini. Ajoutez-en un pour suivre votre progression !
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileGoals;