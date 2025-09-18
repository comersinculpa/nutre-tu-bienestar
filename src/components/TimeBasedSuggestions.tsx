import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Sunset, 
  Moon, 
  Coffee,
  Utensils,
  Heart,
  Pause,
  MessageSquare,
  Timer
} from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  gradient: string;
  path: string;
  action?: string;
}

const getSuggestionsByTime = (hour: number): Suggestion[] => {
  // Morning (6-12)
  if (hour >= 6 && hour < 12) {
    return [
      {
        id: 'morning-checkin',
        title: 'Check-in matutino',
        subtitle: '¡Buenos días!',
        description: 'Empecemos el día conectando contigo',
        icon: Sun,
        gradient: 'from-yellow-400 to-orange-400',
        path: '/check-in-diario'
      },
      {
        id: 'morning-pause',
        title: 'Pausa energizante',
        subtitle: '3 minutos',
        description: 'Respiración para despertar con calma',
        icon: Coffee,
        gradient: 'from-green-400 to-green-500',
        path: '/pausa-consciente',
        action: 'energia'
      }
    ];
  }
  
  // Afternoon (12-18)
  if (hour >= 12 && hour < 18) {
    return [
      {
        id: 'lunch-mindful',
        title: 'Hora de comer consciente',
        subtitle: 'Antes de comer',
        description: 'Registra tu comida con atención plena',
        icon: Utensils,
        gradient: 'from-ochre-400 to-yellow-400',
        path: '/comer-con-cuidado'
      },
      {
        id: 'afternoon-support',
        title: 'Acompañante disponible',
        subtitle: 'Apoyo cuando lo necesites',
        description: 'Conversa si necesitas acompañamiento',
        icon: MessageSquare,
        gradient: 'from-blue-400 to-blue-500',
        path: '/ia-companion'
      }
    ];
  }
  
  // Evening (18-22)
  if (hour >= 18 && hour < 22) {
    return [
      {
        id: 'evening-cravings',
        title: 'Pausa para antojos',
        subtitle: 'Momento crítico',
        description: 'A esta hora suelen aparecer antojos intensos',
        icon: Pause,
        gradient: 'from-ochre-500 to-red-400',
        path: '/pausa-consciente',
        action: 'antojo'
      },
      {
        id: 'evening-reflection',
        title: 'Reflexión del día',
        subtitle: 'Cierre consciente',
        description: 'Registra cómo ha ido tu día',
        icon: Heart,
        gradient: 'from-purple-400 to-pink-400',
        path: '/check-in-diario'
      }
    ];
  }
  
  // Night (22-6)
  return [
    {
      id: 'night-sleep',
      title: 'Preparar para dormir',
      subtitle: 'Cierre del día',
      description: '3 respiraciones para soltar el día',
      icon: Moon,
      gradient: 'from-indigo-400 to-purple-500',
      path: '/pausa-consciente',
      action: 'sueño'
    },
    {
      id: 'night-gratitude',
      title: 'Momento de gratitud',
      subtitle: 'Antes de descansar',
      description: 'Un minuto para agradecer el día',
      icon: Heart,
      gradient: 'from-pink-400 to-rose-400',
      path: '/check-in-diario'
    }
  ];
};

export const TimeBasedSuggestions: React.FC = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateSuggestions = () => {
      const now = new Date();
      setCurrentTime(now);
      setSuggestions(getSuggestionsByTime(now.getHours()));
    };

    updateSuggestions();
    
    // Update every hour
    const interval = setInterval(updateSuggestions, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Store the suggested action for context
    if (suggestion.action) {
      localStorage.setItem('suggestedAction', suggestion.action);
    }
    
    navigate(suggestion.path);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const getTimeOfDayMessage = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 18) return 'Buenas tardes';
    if (hour >= 18 && hour < 22) return 'Buenas noches';
    return 'Es tarde, cuídate';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {getTimeOfDayMessage()}
        </h3>
        <p className="text-sm text-muted-foreground">
          Sugerencias personalizadas para este momento
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          
          return (
            <Card
              key={suggestion.id}
              className="cursor-pointer hover:shadow-elegant transition-all duration-300 transform hover:scale-105 border-0 overflow-hidden"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-90`} />
              <CardContent className="relative p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{suggestion.title}</h4>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        {suggestion.subtitle}
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Time-specific tip */}
      <Card className="bg-gradient-to-r from-ochre-50 via-green-50 to-ochre-50 border-ochre-100">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {currentTime.getHours() >= 17 && currentTime.getHours() < 20 
              ? "💡 A esta hora suelen aparecer antojos. Una pausa de 2 minutos puede cambiar toda la ecuación."
              : currentTime.getHours() >= 21 || currentTime.getHours() < 6
              ? "🌙 Es momento de cerrar el día con cariño. Mañana será un nuevo comienzo."
              : "🌱 Cada momento que dedicas a cuidarte es una semilla de bienestar que plantas para tu futuro."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};