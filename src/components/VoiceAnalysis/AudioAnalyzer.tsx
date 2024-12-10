import React, { useEffect, useRef, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { Play, Square, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { AudioAnalyzerProps, DetectedNote } from './types';
import { frequencyToNote } from '../../utils/audioUtils';

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({
  isRecording,
  onNoteDetected,
  onRecordingChange
}) => {
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const detector = useRef<PitchDetector | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrame = useRef<number>();
  const startTime = useRef<number>(0);

  const [error, setError] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisQuality, setAnalysisQuality] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      startTime.current = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setRecordingTime(elapsed);
        setAnalysisQuality(Math.min(elapsed / 60 * 100, 100));
      }, 1000);
    } else {
      setRecordingTime(0);
      setAnalysisQuality(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (isRecording) {
          if (!audioContext.current) {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          } else if (audioContext.current.state === 'suspended') {
            await audioContext.current.resume();
          }

          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStream.current = stream;

          analyser.current = audioContext.current.createAnalyser();
          analyser.current.fftSize = 2048;

          const source = audioContext.current.createMediaStreamSource(stream);
          source.connect(analyser.current);

          detector.current = PitchDetector.forFloat32Array(analyser.current.fftSize);
          
          updatePitch();
          drawWaveform();
        } else {
          cleanup();
        }
      } catch (err) {
        setError("Erreur d'accès au microphone");
        onRecordingChange(false);
      }
    };

    setupAudio();
    return () => {
      if (isRecording) {
        cleanup();
      }
    };
  }, [isRecording]);

  const cleanup = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = undefined;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }

    if (audioContext.current && audioContext.current.state !== 'closed') {
      try {
        audioContext.current.suspend();
      } catch (error) {
        console.warn('Error suspending AudioContext:', error);
      }
    }

    analyser.current = null;
    detector.current = null;
  };

  const updatePitch = () => {
    if (!analyser.current || !audioContext.current || !detector.current) return;

    const buffer = new Float32Array(analyser.current.fftSize);
    analyser.current.getFloatTimeDomainData(buffer);

    const [pitch, clarity] = detector.current.findPitch(buffer, audioContext.current.sampleRate);

    if (clarity > 0.8 && pitch >= 75) { // Ne détecter que les fréquences >= 75 Hz
      const { note, octave } = frequencyToNote(pitch);
      onNoteDetected({
        note: { frequency: pitch, name: note, octave },
        timestamp: Date.now(),
        confidence: clarity
      });
    }

    if (isRecording) {
      animationFrame.current = requestAnimationFrame(updatePitch);
    }
  };

  const drawWaveform = () => {
    if (!analyser.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyser.current) return;

      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      analyser.current.getFloatTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(30, 30, 30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(147, 51, 234)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 0.5;
        const y = (v * canvas.height / 2) + canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      if (isRecording) {
        animationFrame.current = requestAnimationFrame(draw);
      }
    };

    draw();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRecordingChange(!isRecording)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isRecording 
              ? 'bg-red-500/20 hover:bg-red-500/30' 
              : 'bg-purple-500/20 hover:bg-purple-500/30'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5" />
              <span>Arrêter</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Démarrer</span>
            </>
          )}
        </motion.button>

        {isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-purple-200">
              <Timer className="w-4 h-4" />
              <span className="font-mono">{formatTime(recordingTime)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs text-purple-200/60">
                Qualité de l'analyse: {Math.round(analysisQuality)}%
              </div>
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${analysisQuality}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas 
        ref={canvasRef} 
        className="w-full h-48 bg-black/20 rounded-lg"
        width={800}
        height={200}
      />

      {error && (
        <div className="p-4 bg-red-500/20 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isRecording && analysisQuality < 100 && (
        <div className="text-center text-sm text-purple-200/60">
          Continuez l'enregistrement pour une analyse plus précise
          {analysisQuality < 50 && " (minimum recommandé: 30 secondes)"}
        </div>
      )}
    </div>
  );
};

export default AudioAnalyzer;