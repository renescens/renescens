export interface NoteInfo {
  frequency: number;
  name: string;
  octave: number;
}

export interface DetectedNote {
  note: NoteInfo;
  timestamp: number;
  confidence: number;
}

export interface AudioAnalyzerProps {
  isRecording: boolean;
  onNoteDetected: (note: DetectedNote) => void;
  onRecordingChange: (isRecording: boolean) => void;
}

export interface NoteDisplayProps {
  notes: DetectedNote[];
}

export interface NotePieChartProps {
  dominantNotes: {[key: string]: number};
}

export interface NoteReportProps {
  notes: DetectedNote[];
  dominantNotes: {[key: string]: number};
}