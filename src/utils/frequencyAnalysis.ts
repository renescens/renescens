// Plages de fréquences et leurs correspondances
export const frequencyRanges = {
  FIRST_OCTAVE: {
    range: [75, 150],
    name: "Premier Octave",
    effects: {
      physical: [
        "Ancrage",
        "Stabilité",
        "Connexion à la terre"
      ],
      emotional: [
        "Sécurité",
        "Confiance de base",
        "Stabilité émotionnelle"
      ],
      energetic: [
        "Énergie vitale",
        "Force physique",
        "Résistance"
      ]
    }
  },
  SECOND_OCTAVE: {
    range: [150, 300],
    name: "Deuxième Octave",
    effects: {
      physical: [
        "Vitalité",
        "Énergie créatrice",
        "Expression corporelle"
      ],
      emotional: [
        "Créativité",
        "Joie de vivre",
        "Expression émotionnelle"
      ],
      energetic: [
        "Fluidité énergétique",
        "Dynamisme",
        "Circulation"
      ]
    }
  },
  THIRD_OCTAVE: {
    range: [300, 600],
    name: "Troisième Octave",
    effects: {
      physical: [
        "Équilibre",
        "Harmonie corporelle",
        "Coordination"
      ],
      emotional: [
        "Harmonie émotionnelle",
        "Paix intérieure",
        "Sérénité"
      ],
      energetic: [
        "Équilibre énergétique",
        "Harmonisation",
        "Alignement"
      ]
    }
  }
};

export const getFrequencyRange = (frequency: number) => {
  if (frequency >= 75 && frequency <= 150) return frequencyRanges.FIRST_OCTAVE;
  if (frequency > 150 && frequency <= 300) return frequencyRanges.SECOND_OCTAVE;
  if (frequency > 300 && frequency <= 600) return frequencyRanges.THIRD_OCTAVE;
  return null;
};

export const analyzeFrequencyEffects = (frequency: number) => {
  const range = getFrequencyRange(frequency);
  if (!range) return null;

  return {
    range: range.name,
    frequency,
    effects: range.effects
  };
};