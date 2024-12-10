import React from 'react';
import { Heart, Briefcase, Coins, Users } from 'lucide-react';

export interface LifeSpheresState {
  health: {
    physicalHealth: string;
    mentalHealth: string;
    energyLevels: string;
    sleepQuality: string;
    stressManagement: string;
  };
  career: {
    satisfaction: string;
    workLifeBalance: string;
    growth: string;
    relationships: string;
    purpose: string;
  };
  financial: {
    stability: string;
    security: string;
    goals: string;
    management: string;
    satisfaction: string;
  };
  relationships: {
    personal: string;
    professional: string;
    familial: string;
    social: string;
    intimacy: string;
  };
}

interface LifeSpheresQuestionnaireProps {
  value: LifeSpheresState;
  onChange: (value: LifeSpheresState) => void;
}

const questions = {
  health: {
    physicalHealth: {
      question: "Comment évaluez-vous votre santé physique actuelle ?",
      options: ["Excellente", "Bonne", "Moyenne", "Faible"]
    },
    mentalHealth: {
      question: "Comment décririez-vous votre état mental ?",
      options: ["Très stable", "Stable", "Variable", "Instable"]
    },
    energyLevels: {
      question: "Quel est votre niveau d'énergie quotidien ?",
      options: ["Très élevé", "Bon", "Modéré", "Faible"]
    },
    sleepQuality: {
      question: "Comment qualifiez-vous votre sommeil ?",
      options: ["Excellent", "Bon", "Moyen", "Perturbé"]
    },
    stressManagement: {
      question: "Comment gérez-vous le stress ?",
      options: ["Très bien", "Bien", "Avec difficulté", "Mal"]
    }
  },
  career: {
    satisfaction: {
      question: "Êtes-vous satisfait(e) de votre situation professionnelle ?",
      options: ["Très satisfait(e)", "Satisfait(e)", "Peu satisfait(e)", "Insatisfait(e)"]
    },
    workLifeBalance: {
      question: "Comment évaluez-vous votre équilibre vie pro/perso ?",
      options: ["Excellent", "Bon", "Déséquilibré", "Très déséquilibré"]
    },
    growth: {
      question: "Comment percevez-vous vos opportunités de croissance ?",
      options: ["Nombreuses", "Satisfaisantes", "Limitées", "Inexistantes"]
    },
    relationships: {
      question: "Comment sont vos relations professionnelles ?",
      options: ["Excellentes", "Bonnes", "Tendues", "Difficiles"]
    },
    purpose: {
      question: "Trouvez-vous du sens dans votre travail ?",
      options: ["Beaucoup", "Assez", "Peu", "Pas du tout"]
    }
  },
  financial: {
    stability: {
      question: "Comment évaluez-vous votre stabilité financière ?",
      options: ["Très stable", "Stable", "Instable", "Très instable"]
    },
    security: {
      question: "Comment percevez-vous votre sécurité financière ?",
      options: ["Très sécurisée", "Sécurisée", "Précaire", "Très précaire"]
    },
    goals: {
      question: "Atteignez-vous vos objectifs financiers ?",
      options: ["Toujours", "Souvent", "Parfois", "Rarement"]
    },
    management: {
      question: "Comment gérez-vous votre budget ?",
      options: ["Très bien", "Bien", "Avec difficulté", "Mal"]
    },
    satisfaction: {
      question: "Êtes-vous satisfait(e) de votre situation financière ?",
      options: ["Très satisfait(e)", "Satisfait(e)", "Peu satisfait(e)", "Insatisfait(e)"]
    }
  },
  relationships: {
    personal: {
      question: "Comment évaluez-vous vos relations personnelles ?",
      options: ["Excellentes", "Bonnes", "Difficiles", "Très difficiles"]
    },
    professional: {
      question: "Comment qualifiez-vous vos relations professionnelles ?",
      options: ["Excellentes", "Bonnes", "Tendues", "Conflictuelles"]
    },
    familial: {
      question: "Comment sont vos relations familiales ?",
      options: ["Excellentes", "Bonnes", "Compliquées", "Difficiles"]
    },
    social: {
      question: "Comment évaluez-vous votre vie sociale ?",
      options: ["Très active", "Active", "Limitée", "Isolée"]
    },
    intimacy: {
      question: "Comment qualifiez-vous vos relations intimes ?",
      options: ["Très satisfaisantes", "Satisfaisantes", "Peu satisfaisantes", "Insatisfaisantes"]
    }
  }
};

const LifeSpheresQuestionnaire: React.FC<LifeSpheresQuestionnaireProps> = ({ value, onChange }) => {
  const renderQuestionSection = (
    sphere: keyof LifeSpheresState,
    icon: React.ReactNode,
    title: string
  ) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      
      <div className="space-y-4">
        {Object.entries(questions[sphere]).map(([key, { question, options }]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm text-purple-200/80">
              {question}
            </label>
            <select
              value={value[sphere][key as keyof typeof value[typeof sphere]]}
              onChange={(e) => {
                const newValue = { ...value };
                newValue[sphere][key as keyof typeof value[typeof sphere]] = e.target.value;
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
      <h4 className="font-medium text-lg">Évaluation des 4 Sphères de Vie</h4>
      
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

export default LifeSpheresQuestionnaire;