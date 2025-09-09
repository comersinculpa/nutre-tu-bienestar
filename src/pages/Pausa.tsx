import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Heart, Droplets, FootprintsIcon } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const pauseActivities = [
  {
    id: 'breathe',
    title: 'Respirar contigo',
    description: 'Respiración guiada de 3 minutos',
    icon: Heart,
    duration: 180,
    color: 'bg-primary-soft text-primary-foreground'
  },
  {
    id: 'water',
    title: 'Beber agua templada',
    description: 'Un vaso de agua despacio, saboreando',
    icon: Droplets,
    duration: 120,
    color: 'bg-accent-soft text-accent-foreground'
  },
  {
    id: 'walk',
    title: 'Caminar 5 minutos',
    description: 'Una vuelta corta, preferiblemente al aire libre',
    icon: FootprintsIcon,
    duration: 300,
    color: 'bg-success-soft text-success-foreground'
  }
];

export default function Pausa() {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'timer' | 'activities' | 'reflection'>('intro');
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [activityTimer, setActivityTimer] = useState(0);
  const [isActivityRunning, setIsActivityRunning] = useState(false);

  // Timer principal de 30 segundos
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setCurrentPhase('activities');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Timer para actividades
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActivityRunning && selectedActivity) {
      const targetDuration = pauseActivities.find(a => a.id === selectedActivity)?.duration || 0;
      if (activityTimer < targetDuration) {
        interval = setInterval(() => {
          setActivityTimer((prev) => {
            if (prev >= targetDuration - 1) {
              setIsActivityRunning(false);
              setCurrentPhase('reflection');
              return targetDuration;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isActivityRunning, selectedActivity, activityTimer]);

  const startTimer = () => {
    setIsTimerRunning(true);
    setCurrentPhase('timer');
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(30);
    setCurrentPhase('intro');
  };

  const startActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    setActivityTimer(0);
    setIsActivityRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getActivityProgress = () => {
    if (!selectedActivity) return 0;
    const targetDuration = pauseActivities.find(a => a.id === selectedActivity)?.duration || 0;
    return (activityTimer / targetDuration) * 100;
  };

  return (
    <div className="min-h-screen bg-background-subpage p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">Pausa con Cuidado</h1>
          <div></div>
        </div>

        {/* Avatar de acompañamiento */}
        <div className="mb-6">
          <Avatar 
            message="Respira conmigo 30 segundos. Luego elegimos juntas el siguiente gesto de cuidado."
            mood="calming"
          />
        </div>

        {/* Fase de introducción */}
        {currentPhase === 'intro' && (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-card">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-heading text-xl font-medium mb-3 text-foreground">
                Vamos a pausar juntas
              </h2>
              <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                Antes de tomar cualquier decisión sobre comer, vamos a conectar contigo misma.
                Solo necesitamos 30 segundos para empezar.
              </p>
              <Button
                onClick={startTimer}
                className="w-full h-12 bg-gradient-primary text-white font-body font-medium shadow-warm transition-all hover:shadow-glow"
              >
                <Play className="w-4 h-4 mr-2" />
                Comenzar pausa de 30s
              </Button>
            </Card>
          </div>
        )}

        {/* Fase de timer de 30 segundos */}
        {currentPhase === 'timer' && (
          <div className="space-y-6">
            <Card className="p-8 text-center bg-gradient-card">
              <div className="mb-6">
                <div className="text-6xl font-mono font-bold text-primary mb-2">
                  {timerSeconds}
                </div>
                <p className="text-muted-foreground font-body">
                  Respira profundo y lento
                </p>
              </div>
              
              <Progress value={((30 - timerSeconds) / 30) * 100} className="mb-6" />
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex-1"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" onClick={resetTimer}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </Card>
            
            <div className="text-center p-4 bg-secondary-soft rounded-xl">
              <p className="text-sm text-secondary-foreground font-body">
                Inhala por 4 segundos, mantén por 4, exhala por 6. Siente tu respiración.
              </p>
            </div>
          </div>
        )}

        {/* Fase de actividades */}
        {currentPhase === 'activities' && (
          <div className="space-y-6">
            <Card className="p-4 text-center bg-gradient-card">
              <h2 className="font-heading text-lg font-medium mb-3 text-foreground">
                ¿Qué te apetece hacer ahora?
              </h2>
              <p className="text-muted-foreground font-body mb-4">
                Elige una actividad que te haga sentir cuidada
              </p>
            </Card>

            <div className="space-y-3">
              {pauseActivities.map((activity) => {
                const IconComponent = activity.icon;
                const isSelected = selectedActivity === activity.id;
                
                return (
                  <Card
                    key={activity.id}
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'border-primary bg-primary-soft shadow-warm'
                        : 'border-border hover:border-primary/50 hover:shadow-card'
                    }`}
                    onClick={() => !isActivityRunning ? startActivity(activity.id) : null}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-medium text-foreground">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground font-body">{activity.description}</p>
                        {isSelected && isActivityRunning && (
                          <div className="mt-3">
                            <Progress value={getActivityProgress()} className="mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {formatTime(activityTimer)} / {formatTime(activity.duration)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              onClick={() => navigate('/recursos')}
              variant="outline"
              className="w-full font-body"
            >
              Explorar más recursos de cuidado
            </Button>
          </div>
        )}

        {/* Fase de reflexión */}
        {currentPhase === 'reflection' && (
          <div className="space-y-6">
            <Card className="p-6 text-center bg-gradient-card">
              <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-success-foreground" />
              </div>
              <h2 className="font-heading text-lg font-medium mb-3 text-foreground">
                Qué bien cuidarte así
              </h2>
              <p className="text-muted-foreground font-body mb-6">
                Has dado un paso importante para conectar contigo. ¿Cómo te sientes ahora?
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('/check-in')}
                variant="outline"
                className="h-12 font-body"
              >
                Nuevo check-in
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="h-12 bg-gradient-primary text-white font-body font-medium"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}