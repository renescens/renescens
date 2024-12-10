import { AudioContext } from 'standardized-audio-context';

// Constants for frequency calculations
const A4_FREQUENCY = 440; // A4 = 440 Hz
const SEMITONE_RATIO = Math.pow(2, 1/12);

// Note frequencies lookup table
const NOTE_FREQUENCIES: { [key: string]: number } = {
  'C2': 65.41,
  'C#2': 69.30,
  'D2': 73.42,
  'D#2': 77.78,
  'E2': 82.41,
  'F2': 87.31,
  'F#2': 92.50,
  'G2': 98.00,
  'G#2': 103.83,
  'A2': 110.00,
  'A#2': 116.54,
  'B2': 123.47,
  'C3': 130.81,
  'C#3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'B3': 246.94,
  'C4': 261.63,
  'C#4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'B4': 493.88,
  'C5': 523.25
};

let audioContext: AudioContext | null = null;

export const initAudioContext = async (): Promise<AudioContext> => {
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (error) {
      console.error('Error resuming audio context:', error);
      throw error;
    }
  }

  return audioContext;
};

export const cleanupAudioContext = () => {
  if (audioContext && audioContext.state !== 'closed') {
    try {
      audioContext.close();
      audioContext = null;
    } catch (error) {
      console.error('Error closing audio context:', error);
    }
  }
};

export const createOscillator = (
  context: AudioContext,
  frequency: number
): [OscillatorNode, GainNode] => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.7, context.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
  
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  return [oscillator, gainNode];
};

export const stopOscillator = (
  context: AudioContext,
  gainNode: GainNode,
  oscillator: OscillatorNode
) => {
  try {
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.1);
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
    }, 100);
  } catch (error) {
    console.error('Error stopping oscillator:', error);
  }
};

export const calculateCents = (frequency: number, targetFrequency: number): number => {
  return Math.round(1200 * Math.log2(frequency / targetFrequency));
};

export const isInTune = (cents: number, tolerance: number = 10): boolean => {
  return Math.abs(cents) < tolerance;
};

export const getPitchDirection = (cents: number): 'up' | 'down' | 'perfect' => {
  if (Math.abs(cents) < 10) return 'perfect';
  return cents < 0 ? 'up' : 'down';
};

export const formatFrequency = (frequency: number): string => {
  return frequency.toFixed(1);
};

export const frequencyToNote = (frequency: number): { note: string; octave: number; cents: number } => {
  let closestNote = 'A4';
  let minDiff = Infinity;

  for (const [note, freq] of Object.entries(NOTE_FREQUENCIES)) {
    const diff = Math.abs(frequency - freq);
    if (diff < minDiff) {
      minDiff = diff;
      closestNote = note;
    }
  }

  const noteName = closestNote.slice(0, -1);
  const octave = parseInt(closestNote.slice(-1));
  const exactFreq = NOTE_FREQUENCIES[closestNote];
  const cents = calculateCents(frequency, exactFreq);

  return { note: noteName, octave, cents };
};

export const noteToFrequency = (note: string, octave: number): number => {
  const noteWithOctave = `${note}${octave}`;
  return NOTE_FREQUENCIES[noteWithOctave] || 0;
};

export const getClosestNote = (frequency: number): string => {
  const { note, octave } = frequencyToNote(frequency);
  return `${note}${octave}`;
};

export const getNoteRange = (minFreq: number, maxFreq: number): string[] => {
  return Object.entries(NOTE_FREQUENCIES)
    .filter(([_, freq]) => freq >= minFreq && freq <= maxFreq)
    .map(([note]) => note);
};

export const isAudioAvailable = (): boolean => {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};