import React, { useEffect, useRef, useState } from 'react';
import { PitchDetector as PitchyDetector } from 'pitchy';
import { Music2, StopCircle, Timer, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { frequencyToNote } from '../../utils/audioUtils';

interface PitchDetectorProps {
  isRecording: boolean;
  onFrequencyChange: (frequency: number | null) => void;
  onError: (error: string) => void;
}

const PitchDetector = ({ isRecording, onFrequencyChange, onError }: PitchDetectorProps) => {
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const detector = useRef<PitchyDetector | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrame = useRef<number>();
  const startTime = useRef<number>(0);
  
  const [elapsedTime, setElapsedTime] = useState<string>("0:00");
  const [currentNote, setCurrentNote] = useState<string>("");
  const [currentFreq, setCurrentFreq] = useState<number>(0);
  const [cents, setCents] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout;

    if (isRecording) {
      startTime.current = Date.now();
      timeInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setElapsedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [isRecording]);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (isRecording) {
          if (!audioContext.current || audioContext.current.state === 'closed') {
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });

          mediaStream.current = stream;
          analyser.current = audioContext.current.createAnalyser();
          analyser.current.fftSize = 2048;

          const source = audioContext.current.createMediaStreamSource(stream);
          source.connect(analyser.current);

          detector.current = PitchyDetector.forFloat32Array(analyser.current.fftSize);
          
          updatePitch();
          drawWaveform();
        } else {
          cleanup();
        }
      } catch (error) {
        onError('Une erreur est survenue lors de l\'accès au microphone');
        cleanup();
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

    if (audioContext.current?.state !== 'closed') {
      audioContext.current?.close().catch(() => {
        // Ignore errors when closing AudioContext
      });
    }
    audioContext.current = null;
    analyser.current = null;
    detector.current = null;

    setElapsedTime("0:00");
    setCurrentNote("");
    setCurrentFreq(0);
    setCents(0);
    setConfidence(0);
  };

  const drawWaveform = () => {
    if (!analyser.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const draw = () => {
      if (!analyser.current) return;
      
      analyser.current.getFloatTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#9333EA';
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

  const updatePitch = () => {
    if (!analyser.current || !audioContext.current || !detector.current) return;

    const buffer = new Float32Array(analyser.current.fftSize);
    analyser.current.getFloatTimeDomainData(buffer);

    const [pitch, clarity] = detector.current.findPitch(buffer, audioContext.current.sampleRate);

    if (clarity > 0.8 && pitch > 0) {
      const { note, octave, cents: detectedCents } = frequencyToNote(pitch);
      setCurrentNote(note + octave);
      setCurrentFreq(Math.round(pitch * 10) / 10);
      setCents(detectedCents);
      setConfidence(clarity);
      onFrequencyChange(pitch);
    }

    if (isRecording) {
      animationFrame.current = requestAnimationFrame(updatePitch);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec timer et contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Timer className="w-5 h-5 text-purple-300" />
          <span className="font-mono text-xl">{elapsedTime}</span>
        </div>
      </div>

      {/* Affichage de la note détectée */}
      <div className="bg-white/5 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Music className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold">Note Détectée</h3>
        </div>

        {currentNote ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold text-purple-300">{currentNote}</div>
            <div className="text-xl text-purple-200/80">{currentFreq} Hz</div>
            <div className="flex items-center justify-center gap-2 text-sm text-purple-200/60">
              <span>Précision: {Math.round(confidence * 100)}%</span>
              <span>•</span>
              <span>Cents: {cents > 0 ? `+${cents}` : cents}</span>
            </div>
          </motion.div>
        ) : (
          <div className="text-purple-200/60">
            En attente de détection...
          </div>
        )}
      </div>

      {/* Visualisation de la forme d'onde */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-32 bg-white/5 rounded-lg"
      />
    </div>
  );
};

export default PitchDetector;