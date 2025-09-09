import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Headphones, Users } from 'lucide-react';

const quickActions = [
  {
    id: 'emotion',
    title: 'Registrar emoción',
    description: '¿Cómo te sientes hoy? Regístralo en un minuto.',
    icon: Heart,
    path: '/diario-emocional',
    color: 'bg-primary/10 text-primary',
  },
  {
    id: 'audio',
    title: 'Escuchar audio de calma',
    description: 'Aquí siempre hay un recurso listo para ti.',
    icon: Headphones,
    path: '/recursos',
    color: 'bg-secondary/10 text-secondary-foreground',
  },
  {
    id: 'community',
    title: 'Comunidad',
    description: 'Conecta con otras personas en tu mismo camino.',
    icon: Users,
    path: '/comunidad',
    color: 'bg-warm-green/10 text-warm-green',
  },
];

export default function NewIndex() {
  const navigate = useNavigate();
  const [userName] = useState(''); // Aquí se podría obtener del contexto de usuario
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Buenos días');
    } else if (hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  const handleQuickAction = (path: string) => {
    navigate(path);
    // Vibración suave
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-8 space-y-8">
        {/* Saludo dinámico */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-2xl font-medium text-foreground">
            {greeting}{userName && `, ${userName}`} 💚
          </h1>
          <p className="text-lg text-muted-foreground">
            Hoy es un buen día para cuidarte
          </p>
        </div>

        {/* Ilustración abstracta */}
        <div className="flex justify-center py-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center animate-scale-in">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-center text-foreground mb-6">
            ¿Qué necesitas ahora?
          </h2>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={action.id}
                  className="card-soft cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleQuickAction(action.path)}
                >
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mensaje de apoyo */}
        <div className="text-center py-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-primary font-medium">
                "Este es tu espacio seguro. Aquí no hay juicios, solo comprensión y cuidado."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}