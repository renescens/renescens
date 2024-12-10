import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioContext } from 'standardized-audio-context';
import { AudioState, AudioControls } from '../components/ExerciseModule/types';

export const useAudio = (): [AudioState, AudioControls] => {
  const [state, setState] = useState<AudioState>({
    isRecording: false,
    isPlaying: false,
    currentFrequency: null,
    error: null
  });

  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  // Initialize audio context
  const initContext = useCallback(async () => {
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContext();
    }

    if (audioContext.current.state === 'suspended') {
      try {
        await audioContext.current.resume();
      } catch (error) {
        console.error('Error resuming audio context:', error);
        setState(prev => ({ ...prev, error: "Error initializing audio" }));
      }
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (oscillator.current) {
      try {
        oscillator.current.stop();
        oscillator.current.disconnect();
      } catch (error) {
        console.error('Error stopping oscillator:', error);
      }
      oscillator.current = null;
    }

    if (gainNode.current) {
      gainNode.current.disconnect();
      gainNode.current = null;
    }

    if (audioContext.current && audioContext.current.state !== 'closed') {
      try {
        audioContext.current.close();
      } catch (error) {
        console.error('Error closing audio context:', error);
      }
      audioContext.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    try {
      await initContext();
      setState(prev => ({ ...prev, isRecording: true, error: null }));
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error starting recording" }));
    }
  }, [initContext]);

  const stopRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  const playSound = useCallback(async (frequency: number) => {
    try {
      await initContext();
      if (!audioContext.current) return;

      // Stop current sound if playing
      if (state.isPlaying) {
        stopSound();
      }

      // Create new oscillator
      oscillator.current = audioContext.current.createOscillator();
      gainNode.current = audioContext.current.createGain();

      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(frequency, audioContext.current.currentTime);

      gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode.current.gain.linearRampToValueAtTime(0.7, audioContext.current.currentTime + 0.01);
      gainNode.current.gain.linearRampToValueAtTime(0.5, audioContext.current.currentTime + 0.1);

      oscillator.current.connect(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);
      oscillator.current.start();

      setState(prev => ({ 
        ...prev, 
        isPlaying: true,
        currentFrequency: frequency,
        error: null 
      }));
    } catch (error) {
      console.error('Error playing sound:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Error playing sound',
        isPlaying: false 
      }));
    }
  }, [state.isPlaying, initContext]);

  const stopSound = useCallback(() => {
    if (!audioContext.current || !gainNode.current || !oscillator.current) return;

    try {
      gainNode.current.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.1);
      setTimeout(() => {
        if (oscillator.current) {
          oscillator.current.stop();
          oscillator.current.disconnect();
          oscillator.current = null;
        }
        if (gainNode.current) {
          gainNode.current.disconnect();
          gainNode.current = null;
        }
      }, 100);

      setState(prev => ({ 
        ...prev, 
        isPlaying: false,
        currentFrequency: null 
      }));
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }, []);

  return [
    state,
    {
      startRecording,
      stopRecording,
      playSound,
      stopSound
    }
  ];
};