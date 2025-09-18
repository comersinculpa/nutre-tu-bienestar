import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import { Avatar } from '@/components/Avatar';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Timer,
  Waves,
  Eye,
  Heart,
  ArrowRight
} from 'lucide-react';

interface Technique {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  icon: any;
  color: string;
  steps: string[];
}

const techniques: Technique[] = [
  {
    id: 'respiracion-box',
    title: 'Respiración Box',
    description: 'Técnica de respiración cuadrada para calmar la ansiedad',
    duration: 120,
    icon: Waves,
    color: 'from-blue-400 to-blue-500',
    steps: [
      'Inhala durante 4 segundos',
      'Mantén el aire 4 segundos', 
      'Exhala durante 4 segundos',
      'Mantén vacío 4 segundos',
      'Repite el ciclo'
    ]
  },
  {
    id: 'cinco-sentidos',
    title: '5-4-3-2-1 Grounding',
    description: 'Conecta con el momento presente usando tus sentidos',
    duration: 180,
    icon: Eye,
    color: 'from-green-400 to-green-500',
    steps: [
      '5 cosas que puedes VER a tu alrededor',
      '4 cosas que puedes TOCAR',
      '3 sonidos que puedes ESCUCHAR',
      '2 aromas que puedes OLER',
      '1 sabor en tu BOCA'
    ]
  },
  {
    id: 'anclaje-somatico',
    title: 'Anclaje Somático',
    description: 'Reconecta con tu cuerpo y sensaciones físicas',
    duration: 150,
    icon: Heart,
    color: 'from-ochre-400 to-ochre-500',
    steps: [
      'Pon los pies firmemente en el suelo',
      'Siente el peso de tu cuerpo en la silla',
      'Nota la temperatura del aire en tu piel',
      'Respira profundamente hacia tu abdomen',
      'Observa las sensaciones sin juzgarlas'
    ]
  }
];

export default function PausaConsciente() {
  const navigate = useNavigate();
  const { addPoints, updateStats } = useGamification();
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            handlePauseCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && selectedTechnique) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTechniqueSelect = (technique: Technique) => {
    setSelectedTechnique(technique);
    setTimeLeft(technique.duration);
    setCurrentStep(0);
    setIsCompleted(false);
    setIsActive(false);
  };

  const handleStart = () => {
    if (!selectedTechnique) return;
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    if (!selectedTechnique) return;
    setTimeLeft(selectedTechnique.duration);
    setCurrentStep(0);
    setIsActive(false);
    setIsCompleted(false);
  };

  const handlePauseCompleted = () => {
    if (!selectedTechnique) return;
    
    // Vibración leve al completar respiración
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Save completed pause
    const pauseData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      technique: selectedTechnique.id,
      duration: selectedTechnique.duration,
      completed: true,
      type: 'conscious-pause'
    };

    const existingPauses = JSON.parse(localStorage.getItem('consciousPauses') || '[]');
    existingPauses.push(pauseData);
    localStorage.setItem('consciousPauses', JSON.stringify(existingPauses));

    // Update gamification
    updateStats('meditation', pauseData);
    addPoints(15, `Pausa consciente completada: ${selectedTechnique.title}`);

    toast.success("¡Respiración completada!", {
      description: "Tu cuerpo y mente te lo agradecen 💚"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedTechnique ? ((selectedTechnique.duration - timeLeft) / selectedTechnique.duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
            <Timer className="h-5 w-5 text-ochre-600" />
            <span className="text-ochre-700 font-semibold">Pausa Consciente</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Técnicas de 2-3 Minutos
          </h1>
          <p className="text-muted-foreground">
            Encuentra calma y claridad con ejercicios guiados
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {!selectedTechnique ? (
            <>
              {/* Avatar guidance */}
              <Avatar 
                message="Elige la técnica que más resuene contigo ahora. Todas son efectivas, solo sigue tu intuición."
                mood="supportive"
              />

              {/* Technique selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techniques.map((technique) => {
                  const Icon = technique.icon;
                  return (
                    <Card 
                      key={technique.id} 
                      className="glass-card hover:shadow-elegant transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => handleTechniqueSelect(technique)}
                    >
                      <CardHeader className="text-center pb-2">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${technique.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-lg">{technique.title}</CardTitle>
                        <Badge variant="secondary" className="mx-auto">
                          {Math.ceil(technique.duration / 60)} min
                        </Badge>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          {technique.description}
                        </p>
                        <Button 
                          className={`w-full bg-gradient-to-r ${technique.color} text-white hover:opacity-90`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Comenzar
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Timer and controls */}
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${selectedTechnique.color} flex items-center justify-center mb-4`}>
                    <selectedTechnique.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{selectedTechnique.title}</CardTitle>
                  <p className="text-muted-foreground">{selectedTechnique.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timer display */}
                  <div className="text-center">
                    <div className="text-6xl font-mono font-bold text-foreground mb-4">
                      {formatTime(timeLeft)}
                    </div>
                    <Progress value={progress} className="w-full h-3 mb-4" />
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-3">
                    {!isActive ? (
                      <Button
                        onClick={handleStart}
                        className="bg-gradient-brand text-white px-6 py-3"
                        disabled={timeLeft === 0}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {timeLeft === selectedTechnique.duration ? 'Comenzar' : 'Reanudar'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePause}
                        variant="outline"
                        className="px-6 py-3"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pausar
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="px-6 py-3"
                      disabled={isActive}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reiniciar
                    </Button>
                  </div>

                  {/* Steps guide */}
                  <div className="bg-gradient-card rounded-xl p-4">
                    <h4 className="font-semibold mb-3 text-foreground">Pasos a seguir:</h4>
                    <div className="space-y-2">
                      {selectedTechnique.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index <= currentStep ? 'bg-gradient-brand text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`text-sm ${
                            index <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                          }`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isCompleted && (
                <Card className="glass-card bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      ¡Pausa completada!
                    </h3>
                    <p className="text-green-700 mb-6">
                      Has dedicado {Math.ceil(selectedTechnique.duration / 60)} minutos a cuidarte. ¿Cómo te sientes ahora?
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate('/check-in-diario')}
                        className="bg-gradient-brand text-white"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Registrar cómo me siento
                      </Button>
                      <Button
                        onClick={() => setSelectedTechnique(null)}
                        variant="outline"
                      >
                        Otra técnica
                      </Button>
                      <Button
                        onClick={() => navigate('/dashboard')}
                        variant="outline"
                      >
                        Volver al inicio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reencuadre compasivo */}
              {!isCompleted && (
                <Card className="glass-card bg-gradient-to-r from-ochre-50 to-ochre-100 border-ochre-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre-800 mb-2">Recuerda:</h4>
                    <p className="text-ochre-700 text-sm">
                      Está bien si tu mente divaga. No hay forma "perfecta" de hacer esto. 
                      Cada momento que dedicas a pausar es un regalo para ti misma. 
                      Eres valiente por estar aquí, cuidándote.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}