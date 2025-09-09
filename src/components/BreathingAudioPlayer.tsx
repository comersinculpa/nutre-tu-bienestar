import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { BreathingAudioService } from '@/services/breathingAudioService';

interface BreathingAudioPlayerProps {
  onClose?: () => void;
}

export function BreathingAudioPlayer({ onClose }: BreathingAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const initializeAudio = async () => {
    if (audioRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const audioService = BreathingAudioService.getInstance();
      const audioUrl = await audioService.generateBreathingAudio();
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.volume = volume;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      audio.addEventListener('error', () => {
        setError('Error al cargar el audio. Inténtalo de nuevo.');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error initializing audio:', error);
      setError('No se pudo cargar el audio de respiración.');
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) {
      await initializeAudio();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        
        // Vibración suave al iniciar
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setError('Error al reproducir el audio.');
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newTime = clickRatio * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md animate-scale-in">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              Respiración Guiada
            </h3>
            <p className="text-sm text-muted-foreground">
              3 minutos de calma y tranquilidad
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive text-center">{error}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              ref={progressRef}
              className="w-full h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              disabled={isLoading}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>

            <Button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="w-16 h-16 rounded-full btn-primary"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </Button>

            <div className="flex items-center space-x-2">
              <VolumeX size={16} className="text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 accent-primary"
                disabled={isLoading}
              />
              <Volume2 size={16} className="text-muted-foreground" />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-xs text-primary text-center">
              💙 Encuentra un lugar cómodo, respira profundo y déjate guiar por la voz.
              Puedes cerrar los ojos si te ayuda a relajarte.
            </p>
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Cerrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}