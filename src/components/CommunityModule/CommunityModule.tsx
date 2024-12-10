import React from 'react';
import { Users, ExternalLink, MessageCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityModule = () => {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Communauté Renescens</h3>
        </div>
        
        <p className="text-purple-200/80 mb-8">
          Rejoignez notre communauté dynamique sur Circle pour partager vos expériences,
          poser vos questions et échanger avec d'autres passionnés du développement vocal.
        </p>

        <div className="flex justify-center">
          <motion.a
            href="https://renescens.circle.so/join?invitation_token=b74a32f2133f901b2e9292346f29ac2242016a56-16f117bc-dc74-444f-bf1d-f8428ba98019"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 
                     rounded-lg transition-colors group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Rejoindre la Communauté sur Circle</span>
            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.a>
        </div>
      </div>

      {/* Avantages de la communauté */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <h4 className="text-lg font-semibold mb-4">Pourquoi nous rejoindre ?</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-1 text-purple-300" />
              <span className="text-purple-200/80">
                Échangez avec une communauté passionnée par le développement vocal
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 mt-1 text-purple-300" />
              <span className="text-purple-200/80">
                Partagez vos expériences et apprenez des autres membres
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 mt-1 text-purple-300" />
              <span className="text-purple-200/80">
                Bénéficiez du soutien et des conseils de la communauté
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
          <h4 className="text-lg font-semibold mb-4">Sur Circle, vous pourrez :</h4>
          <ul className="space-y-3 text-purple-200/80">
            <li>• Partager vos progrès vocaux</li>
            <li>• Poser vos questions techniques</li>
            <li>• Découvrir des exercices communautaires</li>
            <li>• Participer à des discussions thématiques</li>
            <li>• Recevoir des retours personnalisés</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityModule;