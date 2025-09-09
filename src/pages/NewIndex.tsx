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
    color: 'bg-gradient-primary text-white',
    gradient: 'from-primary to-primary-light',
  },
  {
    id: 'audio',
    title: 'Escuchar audio de calma',
    description: 'Aquí siempre hay un recurso listo para ti.',
    icon: Headphones,
    path: '/recursos',
    color: 'bg-gradient-warm text-secondary-foreground',
    gradient: 'from-secondary to-tertiary',
  },
  {
    id: 'community',
    title: 'Comunidad',
    description: 'Conecta con otras personas en tu mismo camino.',
    icon: Users,
    path: '/comunidad',
    color: 'bg-gradient-serene text-serenity-foreground',
    gradient: 'from-serenity to-growth',
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
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Elementos decorativos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-5 w-32 h-32 bg-primary/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 left-3 w-24 h-24 bg-secondary/4 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-60 right-12 w-40 h-40 bg-tertiary/3 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-80 left-8 w-28 h-28 bg-serenity/4 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        
        {/* Efectos de partículas sutiles */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse-soft"></div>
        <div className="absolute top-80 right-1/4 w-1 h-1 bg-secondary/30 rounded-full animate-pulse-soft" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-96 left-1/3 w-1.5 h-1.5 bg-tertiary/25 rounded-full animate-pulse-soft" style={{animationDelay: '0.8s'}}></div>
      </div>
      
      <div className="container mx-auto px-6 pt-16 space-y-12 relative z-10">
        {/* Saludo dinámico ultra mejorado */}
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-poppins font-bold gradient-text leading-tight">
              {greeting}{userName && `, ${userName}`} 
            </h1>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          <p className="text-2xl text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
            Hoy es un buen día para <span className="text-primary font-semibold">cuidarte</span>
          </p>
        </div>

        {/* Ilustración central ultra mejorada */}
        <div className="flex justify-center py-12">
          <div className="relative">
            {/* Anillos decorativos */}
            <div className="absolute inset-0 w-48 h-48 border border-primary/10 rounded-full animate-pulse-soft"></div>
            <div className="absolute inset-4 w-40 h-40 border border-secondary/10 rounded-full animate-pulse-soft" style={{animationDelay: '0.5s'}}></div>
            
            {/* Círculo principal */}
            <div className="w-44 h-44 bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in glow-primary shadow-strong">
              <div className="w-32 h-32 glass-card rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-xl">
                <Heart className="w-16 h-16 text-white animate-heart-beat drop-shadow-lg" />
              </div>
            </div>
            
            {/* Elementos flotantes mejorados */}
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-secondary to-tertiary rounded-full animate-bounce-gentle shadow-medium"></div>
            <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-tertiary to-secondary rounded-full animate-bounce-gentle shadow-medium" style={{animationDelay: '0.7s'}}></div>
            <div className="absolute top-1/2 -right-6 w-6 h-6 bg-gradient-to-br from-serenity to-growth rounded-full animate-bounce-gentle shadow-soft" style={{animationDelay: '0.3s'}}></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-gradient-to-br from-growth to-serenity rounded-full animate-bounce-gentle shadow-soft" style={{animationDelay: '1.2s'}}></div>
          </div>
        </div>

        {/* Accesos rápidos ultra mejorados */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-poppins font-bold text-foreground mb-3">
              ¿Qué necesitas ahora?
            </h2>
            <div className="w-16 h-0.5 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div 
                  key={action.id}
                  className="group relative animate-fade-in hover-lift"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => handleQuickAction(action.path)}
                >
                  <div className="glass-card rounded-4xl p-8 cursor-pointer border-gradient transition-all duration-500 hover:shadow-strong group-hover:scale-[1.02]">
                    <div className="flex items-center space-x-8">
                      <div className={`w-20 h-20 rounded-3xl ${action.color} flex items-center justify-center shadow-medium hover-scale group-hover:rotate-3 transition-all duration-300`}>
                        <Icon size={32} className="drop-shadow-sm" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-poppins font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensaje de apoyo ultra mejorado */}
        <div className="text-center py-12">
          <div className="card-feature max-w-lg mx-auto hover-lift">
            <div className="text-center relative">
              {/* Ícono decorativo mejorado */}
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium glow-primary">
                <Heart className="w-8 h-8 text-white animate-heart-beat" />
              </div>
              
              {/* Comillas decorativas */}
              <div className="text-6xl text-primary/20 font-poppins font-bold leading-none mb-4">"</div>
              
              <blockquote className="text-primary font-poppins font-semibold text-xl leading-relaxed -mt-8 mb-4">
                Este es tu espacio seguro. Aquí no hay juicios, solo comprensión y cuidado.
              </blockquote>
              
              <div className="text-6xl text-primary/20 font-poppins font-bold leading-none rotate-180">"</div>
            </div>
          </div>
        </div>

        {/* CTA mejorado */}
        <div className="text-center pb-12">
          <div className="space-y-6">
            <p className="text-muted-foreground mb-6 text-lg">
              ¿Primera vez aquí?
            </p>
            <button 
              onClick={() => navigate('/recursos')}
              className="btn-ghost text-lg px-10 py-4 hover-glow"
            >
              Descubre todas las herramientas ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}