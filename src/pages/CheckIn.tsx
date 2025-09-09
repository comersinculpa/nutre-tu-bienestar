import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, Save } from 'lucide-react';
import { EmotionWheel } from '@/components/EmotionWheel';
import { Avatar } from '@/components/Avatar';

const hungerTypes = [
  { id: 'fisica', label: 'Física', icon: '🍽️', desc: 'Tengo hambre real en el estómago' },
  { id: 'emocional', label: 'Emocional', icon: '💭', desc: 'Quiero comer por lo que siento' },
  { id: 'mixta', label: 'Mixta', icon: '🤔', desc: 'Un poco de ambas' },
  { id: 'nosure', label: 'No estoy segura', icon: '❓', desc: 'Me cuesta identificarlo' }
];

const bingeRiskLevels = [
  { value: 1, label: 'Muy bajo', color: 'text-success' },
  { value: 2, label: 'Bajo', color: 'text-success' },
  { value: 3, label: 'Moderado', color: 'text-warning' },
  { value: 4, label: 'Alto', color: 'text-destructive' },
  { value: 5, label: 'Muy alto', color: 'text-destructive' }
];

export default function CheckIn() {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState([3]);
  const [hungerType, setHungerType] = useState('');
  const [bingeRisk, setBingeRisk] = useState([1]);
  const [triggers, setTriggers] = useState('');
  const [foodThoughts, setFoodThoughts] = useState('');
  const [startTime] = useState(Date.now());

  const getElapsedTime = () => {
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const handleSubmit = () => {
    const checkInData = {
      timestamp: Date.now(),
      emotion,
      emotionIntensity: emotionIntensity[0],
      hungerType,
      bingeRisk: bingeRisk[0],
      triggers,
      foodThoughts,
      duration: getElapsedTime()
    };

    // Guardar en localStorage
    const existingData = JSON.parse(localStorage.getItem('checkIns') || '[]');
    existingData.push(checkInData);
    localStorage.setItem('checkIns', JSON.stringify(existingData));

    // Navegar según el riesgo de atracón
    if (bingeRisk[0] >= 3) {
      navigate('/pausa');
    } else {
      navigate('/dashboard');
    }
  };

  const canSubmit = emotion && hungerType;
  const elapsedTime = getElapsedTime();

  return (
    <div className="min-h-screen bg-background-subpage p-4">
      <div className="max-w-md mx-auto">
        {/* Header con tiempo */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Avatar de acompañamiento */}
        <div className="mb-6">
          <Avatar 
            message="¿Cómo te sientes ahora mismo? Tómate tu tiempo, estoy aquí contigo."
            mood="supportive"
          />
        </div>

        <div className="space-y-6">
          {/* 1. Emoción principal */}
          <Card className="p-4 bg-gradient-card">
            <h3 className="font-heading font-medium mb-4 text-foreground">
              ¿Cómo te sientes ahora?
            </h3>
            <EmotionWheel
              onEmotionSelect={setEmotion}
              selectedEmotion={emotion}
            />
            
            {emotion && (
              <div className="mt-4 space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Intensidad de {emotion}
                </label>
                <div className="px-3">
                  <Slider
                    value={emotionIntensity}
                    onValueChange={setEmotionIntensity}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Leve</span>
                    <span>Intensa</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* 2. Tipo de hambre */}
          <Card className="p-4 bg-gradient-card">
            <h3 className="font-heading font-medium mb-4 text-foreground">
              ¿Qué tipo de hambre sientes?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {hungerTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  className={`h-auto p-3 flex flex-col gap-2 text-left ${
                    hungerType === type.id
                      ? 'border-primary bg-primary-soft text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setHungerType(type.id)}
                >
                  <div className="text-xl">{type.icon}</div>
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs opacity-80">{type.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* 3. Riesgo de atracón */}
          <Card className="p-4 bg-gradient-card">
            <h3 className="font-heading font-medium mb-4 text-foreground">
              ¿Qué tan fuerte es tu deseo de comer sin control?
            </h3>
            <div className="space-y-3">
              <Slider
                value={bingeRisk}
                onValueChange={setBingeRisk}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Ninguno</span>
                <Badge 
                  variant="secondary" 
                  className={bingeRiskLevels[bingeRisk[0] - 1].color}
                >
                  {bingeRiskLevels[bingeRisk[0] - 1].label}
                </Badge>
                <span className="text-xs text-muted-foreground">Muy fuerte</span>
              </div>
            </div>
          </Card>

          {/* 4. Notas rápidas (opcional) */}
          <Card className="p-4 bg-gradient-card">
            <h3 className="font-heading font-medium mb-4 text-foreground">
              Notas rápidas (opcional)
            </h3>
            <div className="space-y-3">
              <Textarea
                placeholder="¿Qué ha pasado hoy? ¿Algo específico te ha activado?"
                value={triggers}
                onChange={(e) => setTriggers(e.target.value)}
                className="resize-none h-20 font-body"
                maxLength={200}
              />
              <div className="text-xs text-right text-muted-foreground">
                {triggers.length}/200
              </div>
            </div>
          </Card>

          {/* Botón de guardar */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full h-12 bg-gradient-primary text-white font-body font-medium shadow-warm transition-all hover:shadow-glow disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar check-in
          </Button>

          {bingeRisk[0] >= 3 && (
            <div className="text-center p-3 bg-warning-soft rounded-xl">
              <p className="text-sm text-warning-foreground font-body">
                Parece que necesitas un momento de pausa. Te guiaré a través de algunas técnicas que pueden ayudarte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}