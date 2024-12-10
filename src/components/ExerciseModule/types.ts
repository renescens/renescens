export interface Note {
  name: string;
  frequency: number;
}

export interface FrequencyRange {
  name: string;
  range: string;
  notes: Note[];
}

export interface PitchData {
  frequency: number;
  note: string;
  cents: number;
}

export interface FrequencyRangeData {
  ranges: FrequencyRange[];
  selectedRange: string;
  selectedNote: string;
  onRangeChange: (range: string) => void;
  onNoteChange: (note: string) => void;
  onPlay: (frequency: number) => void;
  isPlaying: boolean;
}

export interface PitchDisplayData {
  frequency: number | null;
  targetFrequency: number;
}

export interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  currentFrequency: number | null;
  error: string | null;
}

export interface AudioControls {
  startRecording: () => void;
  stopRecording: () => void;
  playSound: (frequency: number) => void;
  stopSound: () => void;
}