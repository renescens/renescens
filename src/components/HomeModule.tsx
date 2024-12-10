import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Music, Wrench, Users, Home, Calendar, Speech } from 'lucide-react';
import ModuleCard from './ModuleCard';
import EmotionalJournal from './EmotionalJournal/EmotionalJournal';
import { UserProfile } from '../types/user';
import { useAuth } from '../hooks/useAuth';

const HomeModule = () => {
  const { profile } = useAuth();
  const [UserProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setUserProfile(profile)
    };
    loadProfile();
  }, [UserProfile]);

  const modules = [
    {
      id: 'voice',
      title: "Analyse Vocale",
      description: "Analysez votre voix et obtenez des retours personnalisés pour améliorer votre technique vocale.",
      icon: <Mic className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-purple",
      path: "/voice"
    },
    {
      id: 'exercises',
      title: "Exercices",
      description: "Accédez à des exercices adaptés à votre niveau et à vos objectifs vocaux.",
      icon: <Speech className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-indigo",
      path: "/exercises"
    },
    {
      id: 'library',
      title: "Bibliothèque Sonore",
      description: "Explorez notre collection de ressources audio pour votre développement vocal.",
      icon: <Music className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-violet",
      path: "/library"
    },
    {
      id: 'tools',
      title: "Outils",
      description: "Utilisez nos outils spécialisés pour analyser et améliorer votre technique.",
      icon: <Wrench className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-fuchsia",
      path: "/tools"
    },
    {
      id: 'community',
      title: "Communauté",
      description: "Rejoignez une communauté passionnée et partagez votre parcours vocal.",
      icon: <Users className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-pink",
      path: "/community"
    },
    {
      id: 'cycle',
      title: "Cycle 21 Jours",
      description: "Suivez un programme intensif de développement vocal sur 21 jours.",
      icon: <Calendar className="w-6 h-6 text-purple-100" />,
      gradient: "gradient-orange",
      path: "/cycle"
    }
  ];

  return (
    <div className="space-y-16">
      <div>
        <h2 className="text-3xl font-bold mb-4">
          {profile?.firstName ? `Bienvenue ${profile.firstName} !` : 'Bienvenue sur Renescens !'}
        </h2>
        <p className="text-purple-200/80 mb-8">
          Nous sommes ravis de vous accompagner sur votre chemin vers l'harmonie intérieure et le bien-être global. Grâce à une approche innovante combinant sonorité et développement personnel, Renescens vous offre des outils pour explorer et équilibrer vos énergies internes.
          <br /><br />
          Plongez dans notre univers sonore, découvrez nos ressources personnalisées et prenez part à un voyage transformateur. Que vous souhaitiez réduire le stress, maximiser votre potentiel ou simplement trouver une paix intérieure, Renescens est là pour vous guider à chaque étape.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              gradient={module.gradient}
              path={module.path}
            />
          ))}
        </div>
      </div>

      <EmotionalJournal />
    </div>
  );
};

export default HomeModule;