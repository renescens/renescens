import React from 'react';
import { Heart, Briefcase, Coins, Users } from 'lucide-react';

export interface LifePillarsState {
  health: {
    exercise: string;
    diet: string;
    sleep: string;
    energy: string;
  };
  career: {
    satisfaction: string;
    growth: string;
    worklife: string;
    purpose: string;
  };
  financial: {
    stability: string;
    savings: string;
    income: string;
    security: string;
  };
  relationships: {
    family: string;
    friends: string;
    romantic: string;
    social: string;
  };
}

interface LifePillarsQCMProps {
  value: LifePillarsState;
  onChange: (value: LifePillarsState) => void;
}

const questions = {
  health: {
    exercise: {
      question: "Quelle est votre fréquence d'activité physique ?",
      options: [
        "Aucune activité régulière",
        "1-2 fois par semaine",
        "3-4 fois par semaine",
        "5+ fois par semaine"
      ]
    },
    diet: {
      question: "Comment qualifieriez-vous votre alimentation ?",
      options: [
        "Déséquilibrée",
        "Moyennement équilibrée",
        "Plutôt équilibrée",
        "Très équilibrée"
      ]
    },
    sleep: {
      question: "Comment est votre sommeil en général ?",
      options: [
        "Très perturbé",
        "Irrégulier",
        "Plutôt bon",
        "Excellent"
      ]
    },
    energy: {
      question: "Quel est votre niveau d'énergie quotidien ?",
      options: [
        "Très faible",
        "Variable",
        "Bon",
        "Excellent"
      ]
    }
  },
  career: {
    satisfaction: {
      question: "Êtes-vous satisfait(e) de votre situation professionnelle ?",
      options: [
        "Pas du tout satisfait(e)",
        "Peu satisfait(e)",
        "Plutôt satisfait(e)",
        "Très satisfait(e)"
      ]
    },
    growth: {
      question: "Comment évaluez-vous vos opportunités de croissance ?",
      options: [
        "Inexistantes",
        "Limitées",
        "Bonnes",
        "Excellentes"
      ]
    },
    worklife: {
      question: "Comment est votre équilibre vie pro/perso ?",
      options: [
        "Très déséquilibré",
        "Plutôt déséquilibré",
        "Plutôt équilibré",
        "Très équilibré"
      ]
    },
    purpose: {
      question: "Trouvez-vous du sens dans votre travail ?",
      options: [
        "Aucun sens",
        "Peu de sens",
        "Du sens",
        "Beaucoup de sens"
      ]
    }
  },
  financial: {
    stability: {
      question: "Comment évaluez-vous votre stabilité financière ?",
      options: [
        "Très instable",
        "Plutôt instable",
        "Plutôt stable",
        "Très stable"
      ]
    },
    savings: {
      question: "Arrivez-vous à épargner régulièrement ?",
      options: [
        "Jamais",
        "Rarement",
        "Régulièrement",
        "Très régulièrement"
      ]
    },
    income: {
      question: "Êtes-vous satisfait(e) de vos revenus ?",
      options: [
        "Pas du tout",
        "Peu satisfait(e)",
        "Satisfait(e)",
        "Très satisfait(e)"
      ]
    },
    security: {
      question: "Comment évaluez-vous votre sécurité financière ?",
      options: [
        "Très précaire",
        "Précaire",
        "Correcte",
        "Excellente"
      ]
    }
  },
  relationships: {
    family: {
      question: "Comment qualifiez-vous vos relations familiales ?",
      options: [
        "Très difficiles",
        "Difficiles",
        "Bonnes",
        "Excellentes"
      ]
    },
    friends: {
      question: "Comment est votre vie sociale avec vos amis ?",
      options: [
        "Inexistante",
        "Limitée",
        "Active",
        "Très active"
      ]
    },
    romantic: {
      question: "Comment évaluez-vous votre vie sentimentale ?",
      options: [
        "Insatisfaisante",
        "Peu satisfaisante",
        "Satisfaisante",
        "Très satisfaisante"
      ]
    },
    social: {
      question: "Comment vous sentez-vous dans vos interactions sociales ?",
      options: [
        "Très mal à l'aise",
        "Peu à l'aise",
        "À l'aise",
        "Très à l'aise"
      ]
    }
  }
};

export const LifePillarsQCM: React.FC<LifePillarsQCMProps> = ({ value, onChange }) => {
  const renderQuestionSection = (
    pillar: keyof LifePillarsState,
    icon: React.ReactNode,
    title: string
  ) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      
      <div className="space-y-4">
        {Object.entries(questions[pillar]).map(([key, { question, options }]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm text-purple-200/80">
              {question}
            </label>
            <select
              value={value[pillar][key as keyof typeof value[typeof pillar]]}
              onChange={(e) => {
                const newValue = { ...value };
                newValue[pillar][key as keyof typeof value[typeof pillar]] = e.target.value;
                onChange(newValue);
              }}
              className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg"
            >
              <option value="">Sélectionnez une réponse</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h4 className="font-medium text-lg">Les 4 Piliers de Vie</h4>
      
      {renderQuestionSection('health', 
        <Heart className="w-5 h-5 text-red-300" />, 
        "Santé & Bien-être"
      )}
      
      {renderQuestionSection('career', 
        <Briefcase className="w-5 h-5 text-blue-300" />, 
        "Carrière & Développement"
      )}
      
      {renderQuestionSection('financial', 
        <Coins className="w-5 h-5 text-green-300" />, 
        "Situation Financière"
      )}
      
      {renderQuestionSection('relationships', 
        <Users className="w-5 h-5 text-purple-300" />, 
        "Relations & Vie Sociale"
      )}
    </div>
  );
};

export default LifePillarsQCM;