import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';
import DayCard from './DayCard';
import { DayContent } from './types';
import { useCycle } from '../../hooks/useCycle';
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth } from '../../firebase'; 

const CycleModule: React.FC = () => {
  const [user] = useAuthState(auth); 
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const { completeDay, getProgress, loading } = useCycle();
  const [progress, setProgress] = useState({
    userId: user?.uid || '', 
    completedDays: [],
    currentDay: 1,
    startedAt: new Date(),
    lastCompletedAt: null
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (user?.uid) {
        const currentProgress = await getProgress(user.uid); 
        if (currentProgress) {
          setProgress(currentProgress);
          setSelectedDay(currentProgress.currentDay);
        }
      }
    };
    loadProgress();
  }, [getProgress, user]);

  const cycleContent: DayContent[] = [
    {
      day: 1,
      title: "La voix, source d’énergie",
      exercises: [
        "1. Comprendre comment la voix impacte votre niveau d’énergie.",
        "2. Introduire vos codes de résonance (affirmations positives) comme outil d’alignement énergétique.",
        "3. Exercice : créer vos codes de résonance personnels puissants."
      ],
      objective: "Établir votre point de départ et comprendre votre voix naturelle",
      videoUrl: "dQw4w9WgXcQ"
    },
    {
      day: 2,
      title: "Définir vos valeurs pour un alignement énergétique",
      exercises: [
        "Lien entre vos valeurs et vos sphères vitales.",
        "Test introspectif pour clarifier vos valeurs essentielles.",
        "Exercice : la méthode pour définir vos 5 valeurs qui vous inspirent."
      ],
      objective: "Maîtriser les bases de la respiration pour le chant",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 3,
      title: "La perception des autres comme miroir énergétique",
      exercises: [
        "Solliciter 3 questions auprès de vos amis pour révéler vos forces cachées.",
        "Analyser les réponses pour détecter les convergences.",
        "Exercice : identifier une qualité unique que vous sous-estimez."
      ],
      objective: "Découvrir les différents espaces de résonance",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 4,
      title: "Détecter les fuites énergétiques",
      exercises: [
        "Identifier les activités, relations ou pensées qui consomment votre énergie.",
        "Comprendre le rôle des fuites sur votre quotidien.",
        "Exercice : noter vos 3 principales fuites et définir une action correctrice."
      ],
      objective: "Améliorer la clarté de l'articulation",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 5,
      title: "Dessiner votre bonheur personnel",
      exercises: [
        "Répondre aux 7 questions essentielles pour définir le bonheur.",
        "Lien entre bonheur, énergie et vos sphères vitales.",
        "Exercice : écrire une phrase résumant votre vision du bonheur."
      ],
      objective: "Développer le contrôle du souffle",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 6,
      title: "Disjoncteurs de votre destinée",
      exercises: [
        "Comprendre comment vos croyances limitantes affectent vos choix.",
        "Noter et évaluer 10 affirmations sur votre vie (0-10).",
        "Exercice : reformuler une croyance limitante en opportunité."
      ],
      objective: "Unifier les registres vocaux",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 7,
      title: "Le bilan de votre énergie",
      exercises: [
        "Synthèse des apprentissages de la semaine.",
        "Prioriser vos objectifs énergétiques.",
        "Exercice : écrire une intention pour la semaine à venir."
      ],
      objective: "Consolider les acquis de la première semaine",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 8,
      title: "La vibration de la voix comme guérison émotionnelle",
      exercises: [
        "Présentation de Réinitialisation émotionnelle (Ho’oponopono) et son impact vibratoire.",
        "Relier pardon, gratitude et voix.",
        "Exercice : structure de formulation de Réinitialisation émotionnelle et application 10 fois en pleine conscience."
      ],
      objective: "Développer la projection naturelle de la voix",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 9,
      title: "Le grand ménage émotionnel",
      exercises: [
        "Identifier 10 actions ou comportements à éliminer.",
        "Comprendre l’effet cathartique du reset émotionnel.",
        "Exercice : choisir une action à supprimer dès aujourd’hui."
      ],
      objective: "Améliorer la souplesse et l'agilité vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 10,
      title: "Le pouvoir des mots sur votre quotidien",
      exercises: [
        "Décoder les mots négatifs fréquents dans votre langage.",
        "Apprendre à reformuler positivement vos pensées.",
        "Exercice : noter 5 phrases négatives et proposer une reformulation positive."
      ],
      objective: "Explorer l'expression des émotions par la voix",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 11,
      title: "La gratitude comme moteur émotionnel",
      exercises: [
        "Importance de reconnaître les petites victoires quotidiennes.",
        "Pratiquer la gratitude pour recharger émotionnellement.",
        "Exercice : chaque soir l’art de la formulation : les 3 bonnes choses."
      ],
      objective: "Enrichir le timbre vocal",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 12,
      title: "Sources d’énergie émotionnelle",
      exercises: [
        "Identifier les 10 choses/personnes qui vous élèvent ou vous drainent.",
        "Comprendre l’impact des relations sur vos émotions.",
        "Exercice : choisir une relation à cultiver et une à limiter."
      ],
      objective: "Renforcer la stabilité vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 13,
      title: "Recharge émotionnelle active",
      exercises: [
        "Techniques d’écriture pour clarifier vos émotions.",
        "Positionner vos réussites comme levier de motivation.",
        "Exercice : écrire une lettre de gratitude à votre 'vous du passé' et un journal booster."
      ],
      objective: "Développer la créativité vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 14,
      title: "Décharge complète des tensions émotionnelles",
      exercises: [
        "Analyser et libérer vos émotions négatives restantes.",
        "Bilan émotionnel de la semaine.",
        "Exercice : définir une émotion à cultiver pour la semaine suivante."
      ],
      objective: "Évaluer les progrès et ajuster les objectifs",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 15,
      title: "Le mouvement pour dynamiser votre voix",
      exercises: [
        "Présenter la séquence matinale comme booster énergétique.",
        "Importance du mouvement pour libérer la voix.",
        "Exercice : réaliser une séquence de mouvement et activation vocale."
      ],
      objective: "Approfondir la technique vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 16,
      title: "Échauffements vocaux et Audio Scan",
      exercises: [
        "Présentation des exercices d’échauffement vocal.",
        "Utilisation de l’outil Audio Scan pour ajuster vos fréquences.",
        "Exercice : pratiquer 3 échauffements vocaux simples."
      ],
      objective: "Développer l'endurance vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 17,
      title: "Libérez votre corps à travers le son",
      exercises: [
        "Sélectionner des musiques qui déclenchent des émotions positives.",
        "Laisser votre corps s’exprimer librement par le mouvement.",
        "Exercice : s’activer sur un morceau choisi en pleine conscience."
      ],
      objective: "Affirmer son style vocal",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 18,
      title: "L’eau, énergie et intention",
      exercises: [
        "Expérience de l’eau et impact des intentions.",
        "Comprendre le mouvement de l’eau dans le corps.",
        "Exercice : boire un verre d’eau en y plaçant une intention positive."
      ],
      objective: "Renforcer la présence vocale",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 19,
      title: "Sons réparateurs et fréquences personnelles",
      exercises: [
        "Découverte des fréquences réparatrices pour le corps.",
        "Choisir une fréquence en fonction de vos besoins.",
        "Exercice : écouter une fréquence pendant 10 minutes et noter vos ressentis."
      ],
      objective: "Intégrer tous les aspects du travail vocal",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 20,
      title: "Optimisation de votre séquence matinale",
      exercises: [
        "Structurer une routine matinale pour durer.",
        "Intégrer les outils découverts (voix, mouvement, intentions).",
        "Exercice : définir 3 actions clés pour votre matinée."
      ],
      objective: "Maintenir une pratique vocale régulière",
      videoUrl: "iCwMQJnKk2c"
    },
    {
      day: 21,
      title: "Routine post-21 jours",
      exercises: [
        "Bilan global et analyse des transformations observées.",
        "Structurer une routine quotidienne pérenne avec les 3 outils.",
        "Exercice : écrire vos engagements pour les 30 prochains jours."
      ],
      objective: "Préparer le terrain pour une pratique vocale autonome",
      videoUrl: "iCwMQJnKk2c"
    }
  ];
  

  const handleDayComplete = async (day: number) => {
    const dayContent = cycleContent.find(c => c.day === day);
    if (dayContent && user?.uid) {
      await completeDay(day, dayContent.exercises, user.uid); 
      const updatedProgress = await getProgress(user.uid); 
      if (updatedProgress) {
        setProgress(updatedProgress);
      }
    }
  };

  const isLocked = (day: number) => {
    if (!progress) return day > 1;
    return day > 1 && !progress.completedDays.includes(day - 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/10 rounded-xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Cycle 21 Jours</h3>
        </div>
        
        <p className="text-purple-200/80">
          Le cycle de 21 jours Renescens est un programme conçu pour favoriser la libération et l'amélioration des blocages émotionnels. Chaque jour, vous serez guidé à travers des exercices ciblés qui vous aideront à explorer et à transformer vos émotions, ouvrant ainsi la voie à un bien-être émotionnel et mental renforcé.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm">
              {progress?.completedDays.length || 0} jour{(progress?.completedDays.length || 0) > 1 ? 's' : ''} terminé{(progress?.completedDays.length || 0) > 1 ? 's' : ''}
            </span>
          </div>
          <div className="h-4 w-px bg-purple-200/20" />
          <div className="text-sm text-purple-200/60">
            {21 - (progress?.completedDays.length || 0)} jours restants
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((progress?.completedDays.length || 0) / 21) * 100}%` }}
          />
        </div>
        <div className="absolute -top-6 text-sm text-purple-200/60">
          Progression: {Math.round(((progress?.completedDays.length || 0) / 21) * 100)}%
        </div>
      </div>

      {/* Days grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cycleContent.map((content) => (
          <DayCard
            key={content.day}
            day={content.day}
            content={content}
            isCompleted={progress?.completedDays.includes(content.day) || false}
            isLocked={isLocked(content.day)}
            isSelected={selectedDay === content.day}
            onSelect={() => !isLocked(content.day) && setSelectedDay(content.day)}
            onComplete={() => handleDayComplete(content.day)}
          />
        ))}
      </div>
    </div>
  );
};

export default CycleModule;
