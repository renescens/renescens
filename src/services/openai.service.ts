import OpenAI from 'openai';
import { DetectedNote } from '../components/VoiceAnalysis/types';
import { LifeSpheresState } from '../components/VoiceAnalysis/LifeSpheresQuestionnaire';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

interface AIAnalysisRequest {
  notes: DetectedNote[];
  dominantNotes: { [key: string]: number };
  currentFrequency: number | null;
  userState: {
    physicalState: number;
    mentalState: number;
    stressLevel: number;
    sleepQuality: number;
    notes: string;
    lifeSpheres: LifeSpheresState;
  };
}

export const generateAIAnalysis = async (data: AIAnalysisRequest): Promise<string> => {
  try {
    const timeOfDay = new Date().getHours() < 12 ? "matin" : new Date().getHours() < 18 ? "après-midi" : "soir";
    const dominantFrequency = data.currentFrequency;
    
    const prompt = `En tant qu'expert en analyse énergétique et développement personnel, génère un programme personnalisé pour la journée basé sur les données suivantes :

Données vocales :
- Fréquence dominante : ${dominantFrequency} Hz
- Notes dominantes : ${Object.entries(data.dominantNotes).map(([note, count]) => `${note} (${count} fois)`).join(', ')}

État actuel :
- État physique : ${data.userState.physicalState}/10
- État mental : ${data.userState.mentalState}/10
- Niveau de stress : ${data.userState.stressLevel}/10
- Qualité du sommeil : ${data.userState.sleepQuality}/10

Sphères de vie :
Santé : ${Object.entries(data.userState.lifeSpheres.health).map(([k, v]) => `${k}: ${v}`).join(', ')}
Carrière : ${Object.entries(data.userState.lifeSpheres.career).map(([k, v]) => `${k}: ${v}`).join(', ')}
Finances : ${Object.entries(data.userState.lifeSpheres.financial).map(([k, v]) => `${k}: ${v}`).join(', ')}
Relations : ${Object.entries(data.userState.lifeSpheres.relationships).map(([k, v]) => `${k}: ${v}`).join(', ')}

Notes supplémentaires : ${data.userState.notes}

Génère un programme détaillé pour ce ${timeOfDay} incluant :
1. Une analyse de l'état actuel et de la signature vocale
2. Un programme d'exercices et d'activités adapté au moment de la journée
3. Des recommandations personnalisées basées sur les sphères de vie
4. Des points de vigilance et d'attention particulière
5. Des suggestions de suivi et d'ajustements

Le format doit être structuré avec des sections numérotées et des listes à puces utilisant des émojis pertinents.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse énergétique et développement personnel, spécialisé dans l'analyse des fréquences vocales et leur impact sur l'équilibre global. Tu fournis des recommandations précises et personnalisées."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return completion.choices[0].message.content || "Analyse non disponible";
  } catch (error) {
    console.error('Erreur lors de l\'analyse IA:', error);
    throw new Error('Impossible de générer l\'analyse. Veuillez réessayer.');
  }
};