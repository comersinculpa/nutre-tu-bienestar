import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Brain, 
  Sparkles, 
  Heart, 
  Utensils,
  CheckCircle,
  Clock,
  Headphones,
  Settings,
  Loader2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { hypnosisScripts, formatScriptForTTS, type HypnosisSession } from '@/services/hypnosisScripts';

interface SessionProgress {
  [sessionId: string]: {
    completed: boolean;
    completedDate?: number;
    timesCompleted: number;
  };
}

export const ProgramaHipnosis: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.7]);
  const [generatedAudios, setGeneratedAudios] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({});
  const [showInstructions, setShowInstructions] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Placeholder for ElevenLabs - user needs to provide API key
  const ELEVENLABS_API_KEY = ''; // Usuario debe proporcionar su API key

  useEffect(() => {
    loadProgress();
    loadGeneratedAudios();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      if (currentSession) {
        markSessionCompleted(currentSession);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentSession]);

  const loadProgress = () => {
    const stored = localStorage.getItem('hypnosisProgress');
    if (stored) {
      setSessionProgress(JSON.parse(stored));
    }
  };

  const saveProgress = (progress: SessionProgress) => {
    localStorage.setItem('hypnosisProgress', JSON.stringify(progress));
    setSessionProgress(progress);
  };

  const loadGeneratedAudios = () => {
    const stored = localStorage.getItem('hypnosisAudios');
    if (stored) {
      setGeneratedAudios(JSON.parse(stored));
    }
  };

  const saveGeneratedAudio = (sessionId: string, audioUrl: string) => {
    const newAudios = { ...generatedAudios, [sessionId]: audioUrl };
    localStorage.setItem('hypnosisAudios', JSON.stringify(newAudios));
    setGeneratedAudios(newAudios);
  };

  const markSessionCompleted = (sessionId: string) => {
    const newProgress = { ...sessionProgress };
    
    if (!newProgress[sessionId]) {
      newProgress[sessionId] = {
        completed: true,
        completedDate: Date.now(),
        timesCompleted: 1
      };
    } else {
      newProgress[sessionId].timesCompleted += 1;
      newProgress[sessionId].completedDate = Date.now();
    }
    
    saveProgress(newProgress);
    
    toast({
      title: "¡Sesión Completada!",
      description: "Has completado una sesión de hipnosis. ¡Excelente trabajo!",
    });
  };

  const generateAudio = async (session: HypnosisSession) => {
    if (!ELEVENLABS_API_KEY) {
      toast({
        title: "API Key Requerida",
        description: "Necesitas configurar tu API key de ElevenLabs para generar los audios.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(prev => ({ ...prev, [session.id]: true }));

    try {
      // Format script for better TTS
      const formattedScript = formatScriptForTTS(session.script);
      
      // Call ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Aria', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: formattedScript,
          model_id: 'eleven_multilingual_v2',
          voice_settings: session.voiceSettings
        })
      });

      if (!response.ok) {
        throw new Error('Error generando audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      saveGeneratedAudio(session.id, audioUrl);
      
      toast({
        title: "Audio Generado",
        description: `La sesión "${session.title}" está lista para reproducir.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No pude generar el audio. Verifica tu API key e intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [session.id]: false }));
    }
  };

  const playSession = (sessionId: string) => {
    if (!generatedAudios[sessionId]) {
      toast({
        title: "Audio no disponible",
        description: "Primero debes generar el audio de esta sesión.",
        variant: "destructive"
      });
      return;
    }

    if (audioRef.current) {
      if (currentSession === sessionId && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = generatedAudios[sessionId];
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentSession(sessionId);
      }
    }
  };

  const resetSession = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = (sessionId: string) => {
    switch (sessionId) {
      case 'eliminar-atracones': return Utensils;
      case 'mentalidad-positiva': return Sparkles;
      case 'relacion-comida': return Heart;
      default: return Brain;
    }
  };

  const getSessionColor = (sessionId: string) => {
    switch (sessionId) {
      case 'eliminar-atracones': return 'bg-red-500/10 border-red-500/20 text-red-600';
      case 'mentalidad-positiva': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600';
      case 'relacion-comida': return 'bg-green-500/10 border-green-500/20 text-green-600';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
    }
  };

  const getTotalProgress = () => {
    const completed = Object.values(sessionProgress).filter(p => p.completed).length;
    return Math.round((completed / hypnosisScripts.length) * 100);
  };

  if (!ELEVENLABS_API_KEY && showInstructions) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl">Programa de Hipnosis Terapéutica</CardTitle>
            <p className="text-muted-foreground">
              3 sesiones profesionales de hipnosis para transformar tu relación con la comida
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-500/20 bg-orange-500/10">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                <strong>Configuración requerida:</strong> Para generar los audios de hipnosis necesitas:
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Una cuenta en <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ElevenLabs</a></li>
                  <li>Tu API key de ElevenLabs</li>
                  <li>Configúrala en el código reemplazando el campo ELEVENLABS_API_KEY</li>
                </ol>
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-3">
              {hypnosisScripts.map((session) => {
                const Icon = getSessionIcon(session.id);
                return (
                  <Card key={session.id} className={`border ${getSessionColor(session.id)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {session.duration}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {session.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Button 
              onClick={() => setShowInstructions(false)}
              variant="outline" 
              className="w-full"
            >
              Ver Programa Completo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
          <CardTitle className="text-xl">Programa de Hipnosis Terapéutica</CardTitle>
          <p className="text-muted-foreground mb-4">
            3 sesiones profesionales para transformar tu relación con la comida
          </p>
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-muted-foreground">{getTotalProgress()}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Instructions */}
      <Alert className="border-blue-500/20 bg-blue-500/10">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Recomendaciones para la práctica:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Busca un lugar tranquilo sin interrupciones</li>
            <li>• Usa auriculares para mejor experiencia</li>
            <li>• Practica en posición cómoda (sentada o acostada)</li>
            <li>• Evita escuchar mientras conduces o realizas otras actividades</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Sessions */}
      <div className="space-y-4">
        {hypnosisScripts.map((session, index) => {
          const Icon = getSessionIcon(session.id);
          const isGenerated = !!generatedAudios[session.id];
          const isCurrentlyPlaying = currentSession === session.id && isPlaying;
          const isGeneratingThis = isGenerating[session.id];
          const progress = sessionProgress[session.id];
          
          return (
            <Card key={session.id} className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${getSessionColor(session.id)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {session.title}
                        {progress?.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{session.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Sesión {index + 1}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{session.duration}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {session.category}
                    </Badge>
                  </div>
                  
                  {progress && (
                    <div className="text-xs text-muted-foreground">
                      Completada {progress.timesCompleted} {progress.timesCompleted === 1 ? 'vez' : 'veces'}
                    </div>
                  )}
                </div>

                {/* Audio Controls */}
                <div className="space-y-3">
                  {!isGenerated ? (
                    <Button
                      onClick={() => generateAudio(session)}
                      disabled={isGeneratingThis}
                      className="w-full"
                    >
                      {isGeneratingThis ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generando Audio...
                        </>
                      ) : (
                        <>
                          <Headphones className="w-4 h-4 mr-2" />
                          Generar Audio de Hipnosis
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => playSession(session.id)}
                          size="sm"
                          className="flex-1"
                        >
                          {isCurrentlyPlaying ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Reproducir
                            </>
                          )}
                        </Button>
                        
                        <Button onClick={resetSession} size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>

                      {currentSession === session.id && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                          <Progress 
                            value={duration > 0 ? (currentTime / duration) * 100 : 0} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {isGenerated && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Audio listo para reproducir
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Volume Control */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            <span className="text-sm text-muted-foreground w-12">
              {Math.round(volume[0] * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Beneficios de la Hipnosis Terapéutica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Reprogramación del subconsciente:</strong> Cambia patrones profundos de comportamiento con la comida.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Reducción de la ansiedad:</strong> Calma el sistema nervioso y reduce los impulsos compulsivos.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Fortalecimiento de la autoestima:</strong> Desarrolla una relación más amorosa contigo misma.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Alimentación consciente:</strong> Reconecta con las señales naturales de hambre y saciedad.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
};