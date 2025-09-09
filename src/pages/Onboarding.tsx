import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Shield } from 'lucide-react';

const relationshipLevels = [
  {
    id: 'leve',
    title: 'Leve',
    description: 'A veces siento culpa o ansiedad con la comida, pero no interfiere mucho en mi día a día.',
    icon: '🌱',
    color: 'bg-success-soft text-success-foreground'
  },
  {
    id: 'moderado',
    title: 'Moderado',
    description: 'Tengo pensamientos frecuentes sobre la comida y a veces como por emociones.',
    icon: '🌸',
    color: 'bg-warning-soft text-warning-foreground'
  },
  {
    id: 'intenso',
    title: 'Intenso',
    description: 'Mi relación con la comida me genera mucha ansiedad y afecta mi bienestar.',
    icon: '🦋',
    color: 'bg-accent-soft text-accent-foreground'
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [userName, setUserName] = useState('');

  const steps = [
    {
      title: "Bienvenida a tu espacio seguro",
      content: (
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              Estoy aquí contigo
            </h1>
            <p className="text-muted-foreground font-body leading-relaxed">
              Demos un paso pequeño y amable hacia una relación más sana con la comida.
              Este es tu espacio seguro, sin juicios.
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Badge variant="secondary" className="bg-primary-soft text-primary-foreground">
              <Shield className="w-3 h-3 mr-1" />
              Privado y seguro
            </Badge>
            <Badge variant="secondary" className="bg-accent-soft text-accent-foreground">
              <Sparkles className="w-3 h-3 mr-1" />
              Sin juicios
            </Badge>
          </div>
        </div>
      )
    },
    {
      title: "Cuéntame tu nombre",
      content: (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-xl font-medium text-foreground">
              ¿Cómo te gustaría que te llamara?
            </h2>
            <p className="text-muted-foreground font-body">
              Solo tu nombre, para hacer esto más personal y cálido.
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all font-body"
            />
          </div>
        </div>
      )
    },
    {
      title: "Tu relación con la comida",
      content: (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-xl font-medium text-foreground">
              ¿Cómo describirías tu relación actual con la comida?
            </h2>
            <p className="text-muted-foreground font-body">
              Esto me ayuda a personalizar tu experiencia de la mejor manera.
            </p>
          </div>
          <div className="space-y-3">
            {relationshipLevels.map((level) => (
              <Card
                key={level.id}
                className={`p-4 cursor-pointer transition-all duration-300 border-2 ${
                  selectedLevel === level.id
                    ? 'border-primary bg-primary-soft shadow-warm'
                    : 'border-border hover:border-primary/50 hover:shadow-card'
                }`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{level.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-heading font-medium text-foreground">{level.title}</h3>
                      <Badge className={level.color}>{level.title}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Guardar datos y navegar al dashboard
      localStorage.setItem('userOnboarded', 'true');
      localStorage.setItem('userName', userName);
      localStorage.setItem('relationshipLevel', selectedLevel);
      navigate('/');
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return userName.trim().length > 0;
    if (currentStep === 2) return selectedLevel !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-background-subpage p-4 flex items-center">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6 bg-gradient-card shadow-warm">
          {steps[currentStep].content}
          
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 h-12 font-body"
              >
                Anterior
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 h-12 bg-gradient-primary text-white font-body font-medium shadow-warm transition-all hover:shadow-glow disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? 'Comenzar mi viaje' : 'Continuar'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}