import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { BackButton } from '@/components/BackButton';
import { Avatar } from '@/components/Avatar';
import { EmotionWheel } from '@/components/EmotionWheel';
import { useGamification } from '@/hooks/useGamification';
import { toast } from 'sonner';
import { 
  Clock, 
  Heart, 
  Brain, 
  Target, 
  CheckCircle,
  Battery,
  Apple,
  Zap
} from 'lucide-react';

interface HungerSignal {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const hungerSignals: HungerSignal[] = [
  {
    id: 'estomago-vacio',
    label: 'Estómago vacío',
    icon: Battery,
    description: 'Siento mi estómago vacío o gruñendo'
  },
  {
    id: 'poca-energia',
    label: 'Poca energía',
    icon: Zap,
    description: 'Me siento cansada o con poca energía'
  },
  {
    id: 'antojos',
    label: 'Antojos específicos',
    icon: Apple,
    description: 'Tengo ganas de algo específico'
  },
  {
    id: 'no-fisica',
    label: 'No es física',
    icon: Brain,
    description: 'No siento hambre física real'
  }
];

const intentions = [
  { id: 'comer-cuidado', label: 'Comer con cuidado', color: 'from-green-400 to-green-500' },
  { id: 'pausa', label: 'Hacer una pausa', color: 'from-ochre-400 to-ochre-500' },
  { id: 'no-comer', label: 'No comer aún', color: 'from-blue-400 to-blue-500' }
];

export default function CheckInDiario() {
  const navigate = useNavigate();
  const { updateStats, addPoints } = useGamification();
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Step 1: Emotions
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState<number[]>([3]);
  
  // Step 2: Hunger signals
  const [selectedHungerSignals, setSelectedHungerSignals] = useState<string[]>([]);
  
  // Step 3: Intention
  const [intention, setIntention] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  const handleHungerSignalToggle = (signalId: string) => {
    setSelectedHungerSignals(prev => 
      prev.includes(signalId)
        ? prev.filter(id => id !== signalId)
        : [...prev, signalId]
    );
  };

  const handleSubmit = () => {
    const checkInData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      emotion: selectedEmotion,
      emotionIntensity: emotionIntensity[0],
      hungerSignals: selectedHungerSignals,
      intention,
      duration: elapsedTime,
      type: 'daily-checkin'
    };

    // Save to localStorage
    const existingCheckIns = JSON.parse(localStorage.getItem('dailyCheckIns') || '[]');
    existingCheckIns.push(checkInData);
    localStorage.setItem('dailyCheckIns', JSON.stringify(existingCheckIns));

    // Update gamification
    updateStats('checkin', checkInData);
    addPoints(10, 'Check-in diario completado');

    toast.success("Check-in guardado", {
      description: "¡+10 puntos por cuidarte!"
    });

    // Navigate based on intention
    if (intention === 'comer-cuidado') {
      navigate('/comer-con-cuidado');
    } else if (intention === 'pausa') {
      navigate('/pausa');
    } else {
      navigate('/dashboard');
    }
  };

  const canSubmit = selectedEmotion && intention;
  const progress = ((selectedEmotion ? 1 : 0) + (selectedHungerSignals.length > 0 ? 1 : 0) + (intention ? 1 : 0)) / 3 * 100;

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header with timer and progress */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-glass backdrop-blur-sm px-6 py-3 rounded-full mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-ochre-600" />
              <span className="text-ochre-700 font-mono text-sm">
                {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
              </span>
            </div>
            <div className="h-4 w-px bg-ochre-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-ochre-200 rounded-full h-1">
                <div 
                  className="bg-gradient-brand h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-ochre-600">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¿Cómo te acompaño ahora?
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Un lugar para comer sin culpa y cuidarte con cariño
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar */}
          <Avatar 
            message="Tomemos un minuto para mirarte con cariño. No hay forma correcta de sentirse."
            mood="supportive"
          />

          {/* Step 1: Emotions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-brand text-white text-sm font-bold flex items-center justify-center">1</div>
                <Heart className="h-5 w-5 text-ochre-600" />
                ¿Cómo estás ahora?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmotionWheel
                selectedEmotion={selectedEmotion}
                onEmotionSelect={setSelectedEmotion}
              />
              
              {selectedEmotion && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Intensidad: {emotionIntensity[0]}/5
                  </label>
                  <Slider
                    value={emotionIntensity}
                    onValueChange={setEmotionIntensity}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Suave</span>
                    <span>Intensa</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Hunger Signals */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-brand text-white text-sm font-bold flex items-center justify-center">2</div>
                <Brain className="h-5 w-5 text-green-600" />
                Señales de hambre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona las señales que sientes ahora (puedes elegir varias)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hungerSignals.map((signal) => {
                  const Icon = signal.icon;
                  const isSelected = selectedHungerSignals.includes(signal.id);
                  return (
                    <button
                      key={signal.id}
                      onClick={() => handleHungerSignalToggle(signal.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-border hover:border-green-300 bg-card'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-green-500' : 'bg-muted'}`}>
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{signal.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{signal.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Intention */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-brand text-white text-sm font-bold flex items-center justify-center">3</div>
                <Target className="h-5 w-5 text-ochre-600" />
                ¿Cuál es tu intención ahora?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {intentions.map((intentionOption) => (
                  <button
                    key={intentionOption.id}
                    onClick={() => setIntention(intentionOption.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      intention === intentionOption.id
                        ? 'border-ochre-500 bg-ochre-50 shadow-md'
                        : 'border-border hover:border-ochre-300 bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${intentionOption.color} flex items-center justify-center`}>
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{intentionOption.label}</h4>
                      </div>
                      {intention === intentionOption.id && (
                        <CheckCircle className="h-5 w-5 text-ochre-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-gradient-brand hover:opacity-90 text-white px-8 py-3 text-lg rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Completar Check-in (+10 pts)
            </Button>
            
            {!canSubmit && (
              <p className="text-sm text-muted-foreground mt-2">
                Completa tu emoción e intención para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}