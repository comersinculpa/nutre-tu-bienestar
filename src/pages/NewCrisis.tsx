import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Headphones, MessageCircle, Heart } from 'lucide-react';

const crisisOptions = [
  {
    id: 'call',
    title: 'Llamar contacto de confianza',
    description: 'Habla con alguien que te comprende',
    icon: Phone,
    color: 'bg-primary',
    action: () => {
      // Aquí se abriría el selector de contactos
      console.log('Abrir contactos de emergencia');
    }
  },
  {
    id: 'audio',
    title: 'Audio de calma rápida',
    description: 'Escucha 3 minutos de respiración guiada',
    icon: Headphones,
    color: 'bg-secondary',
    action: () => {
      // Aquí se reproduciría audio de emergencia
      console.log('Reproducir audio de calma');
    }
  },
  {
    id: 'chat',
    title: 'Escribir al bot de apoyo',
    description: 'Conversa con nuestro asistente de crisis',
    icon: MessageCircle,
    color: 'bg-warm-green',
    action: () => {
      // Aquí se abriría el chat de crisis
      console.log('Abrir chat de crisis');
    }
  }
];

export default function NewCrisis() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  React.useEffect(() => {
    if (breathingActive) {
      const interval = setInterval(() => {
        setBreathPhase(current => {
          if (current === 'inhale') return 'hold';
          if (current === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [breathingActive]);

  const handleOptionClick = (option: typeof crisisOptions[0]) => {
    // Vibración de confirmación
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    option.action();
  };

  const startBreathing = () => {
    setBreathingActive(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('inhale');
  };

  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Inhala profundamente...';
      case 'hold': return 'Mantén el aire...';
      case 'exhale': return 'Exhala lentamente...';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-8 space-y-8">
        {/* Header urgente pero calmado */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-crisis/10 text-crisis rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-medium text-foreground">
            Respira, estás segura
          </h1>
          <p className="text-muted-foreground">
            Aquí tienes apoyo inmediato. No estás sola.
          </p>
        </div>

        {/* Respiración de emergencia */}
        <Card className="card-soft bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium text-primary mb-4">Respiración de emergencia</h3>
            
            {!breathingActive ? (
              <Button 
                onClick={startBreathing}
                className="btn-primary mb-4"
              >
                Comenzar respiración guiada
              </Button>
            ) : (
              <div className="space-y-4">
                <div className={`w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto transition-all duration-4000 ${
                  breathPhase === 'inhale' ? 'scale-110' : 
                  breathPhase === 'hold' ? 'scale-110' : 'scale-90'
                }`}>
                  <div className="w-12 h-12 bg-primary/40 rounded-full"></div>
                </div>
                
                <p className="text-lg font-medium text-primary">
                  {getBreathingInstruction()}
                </p>
                
                <Button 
                  onClick={stopBreathing}
                  variant="outline"
                  size="sm"
                >
                  Detener
                </Button>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Enfócate solo en tu respiración por un momento
            </p>
          </CardContent>
        </Card>

        {/* Opciones de ayuda */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground text-center">
            ¿Qué necesitas ahora mismo?
          </h2>
          
          {crisisOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.id}
                className="card-soft cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleOptionClick(option)}
              >
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className={`w-14 h-14 rounded-2xl ${option.color} text-white flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Números de emergencia */}
        <Card className="bg-crisis/5 border-crisis/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-crisis mb-4 text-center">
              Líneas de crisis 24/7
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Teléfono de la Esperanza:</span>
                <a href="tel:717003717" className="text-crisis font-medium">
                  717 003 717
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Emergencias:</span>
                <a href="tel:112" className="text-crisis font-medium">
                  112
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de apoyo */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-primary font-medium">
              "Este momento difícil pasará. Eres más fuerte de lo que crees, 
              y mereces todo el cuidado y amor del mundo."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}