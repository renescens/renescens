import { DetectedNote } from '../components/VoiceAnalysis/types';
import { LifePillarsState } from '../components/VoiceAnalysis/LifePillarsQCM';

interface UserState {
  physicalState: number;
  mentalState: number;
  stressLevel: number;
  sleepQuality: number;
  notes: string;
  lifePillars: LifePillarsState;
}

export const generateAnalysisReport = (
  notes: DetectedNote[],
  dominantNotes: { [key: string]: number },
  currentFrequency: number | null,
  userState: UserState
): string => {
  const formatDate = (date: Date): string => {
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSection = (title: string, content: string): string => {
    return `\n=== ${title} ===\n${content}\n`;
  };

  let report = `RAPPORT D'ANALYSE VOCALE RENESCENS\nDate: ${formatDate(new Date())}\n`;

  // Analyse vocale
  const vocalAnalysis = [
    `Fréquence dominante: ${currentFrequency ? `${currentFrequency.toFixed(2)} Hz` : 'Non détectée'}`,
    '\nNotes détectées:',
    ...Object.entries(dominantNotes)
      .sort(([,a], [,b]) => b - a)
      .map(([note, count]) => `- ${note}: ${count} occurrences`)
  ].join('\n');

  report += formatSection('ANALYSE VOCALE', vocalAnalysis);

  // État actuel
  const currentState = [
    `État physique: ${userState.physicalState}/10`,
    `État mental: ${userState.mentalState}/10`,
    `Niveau de stress: ${userState.stressLevel}/10`,
    `Qualité du sommeil: ${userState.sleepQuality}/10`
  ].join('\n');

  report += formatSection('ÉTAT ACTUEL', currentState);

  // Piliers de vie
  const formatPillar = (title: string, data: Record<string, string>): string => {
    return [
      title,
      ...Object.entries(data).map(([key, value]) => `- ${key}: ${value || 'Non renseigné'}`)
    ].join('\n');
  };

  const lifePillars = [
    formatPillar('Santé & Bien-être:', userState.lifePillars.health),
    '',
    formatPillar('Carrière & Développement:', userState.lifePillars.career),
    '',
    formatPillar('Situation Financière:', userState.lifePillars.financial),
    '',
    formatPillar('Relations & Vie Sociale:', userState.lifePillars.relationships)
  ].join('\n');

  report += formatSection('PILIERS DE VIE', lifePillars);

  // Notes complémentaires
  if (userState.notes) {
    report += formatSection('NOTES COMPLÉMENTAIRES', userState.notes);
  }

  // Données techniques pour l'IA
  const technicalData = [
    'Données techniques pour analyse IA:',
    `Total notes détectées: ${notes.length}`,
    `Plage de fréquences: ${Math.min(...notes.map(n => n.note.frequency))} - ${Math.max(...notes.map(n => n.note.frequency))} Hz`,
    `Confiance moyenne: ${(notes.reduce((acc, n) => acc + n.confidence, 0) / notes.length * 100).toFixed(1)}%`,
    '\nDistribution des notes:',
    ...Object.entries(dominantNotes)
      .sort(([,a], [,b]) => b - a)
      .map(([note, count]) => `${note}: ${(count / notes.length * 100).toFixed(1)}%`)
  ].join('\n');

  report += formatSection('DONNÉES TECHNIQUES', technicalData);

  return report;
};

export const downloadReport = (content: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analyse-vocale-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};