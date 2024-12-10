import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader } from 'lucide-react';

const ProfileSubscription: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    details: '',
    improvements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simuler l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En production, implémenter l'envoi réel de l'email ici
      console.log('Email de désabonnement envoyé à subscription@renescens.com');
      
      setSuccess(true);
      setFormData({ reason: '', details: '', improvements: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setLoading(false);
    }
  };

  const reasons = [
    'Je n\'utilise pas assez le service',
    'Le prix est trop élevé',
    'Je n\'ai plus le temps',
    'J\'ai trouvé une autre solution',
    'Le service ne répond pas à mes besoins',
    'Autre'
  ];

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Demande envoyée</h2>
        <p className="text-purple-200/80 mb-6">
          Nous avons bien reçu votre demande de désabonnement. Notre équipe la traitera dans les plus brefs délais.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm text-purple-200/60 hover:text-purple-200 transition-colors"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Demande de désabonnement</h2>
        <p className="text-purple-200/80">
          Nous sommes désolés de vous voir partir. Pourriez-vous nous aider à améliorer nos services en nous expliquant les raisons de votre départ ?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Raison principale du désabonnement
          </label>
          <select
            value={formData.reason}
            onChange={e => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            required
            className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
          >
            <option value="">Sélectionnez une raison</option>
            {reasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Pouvez-vous nous en dire plus ?
          </label>
          <textarea
            value={formData.details}
            onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
            required
            className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg min-h-[100px]"
            placeholder="Détaillez les raisons de votre désabonnement..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Comment pourrions-nous améliorer nos services ?
          </label>
          <textarea
            value={formData.improvements}
            onChange={e => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg min-h-[100px]"
            placeholder="Vos suggestions sont les bienvenues..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Envoyer la demande</span>
            </>
          )}
        </motion.button>

        <p className="text-sm text-center text-purple-200/60">
          Notre équipe traitera votre demande dans les plus brefs délais.
          <br />
          Vous recevrez une confirmation par email.
        </p>
      </form>
    </div>
  );
};

export default ProfileSubscription;