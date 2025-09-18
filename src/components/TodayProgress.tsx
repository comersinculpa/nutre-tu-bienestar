import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, CheckCircle, Zap } from 'lucide-react';

interface TodayProgressProps {
  className?: string;
}

export const TodayProgress: React.FC<TodayProgressProps> = ({ className = '' }) => {
  const [todayActions, setTodayActions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Count today's actions
    const today = new Date().toDateString();
    
    const dailyCheckIns = JSON.parse(localStorage.getItem('dailyCheckIns') || '[]');
    const consciousPauses = JSON.parse(localStorage.getItem('consciousPauses') || '[]');
    const mindfulEating = JSON.parse(localStorage.getItem('mindfulEatingEntries') || '[]');
    
    const todayCheckIns = dailyCheckIns.filter((item: any) => 
      new Date(item.timestamp).toDateString() === today
    ).length;
    
    const todayPauses = consciousPauses.filter((item: any) => 
      new Date(item.timestamp).toDateString() === today
    ).length;
    
    const todayEating = mindfulEating.filter((item: any) => 
      new Date(item.timestamp).toDateString() === today
    ).length;
    
    const totalActions = todayCheckIns + todayPauses + todayEating;
    setTodayActions(totalActions);

    // Calculate streak (simplified - count consecutive days with actions)
    let currentStreak = 0;
    const allActions = [...dailyCheckIns, ...consciousPauses, ...mindfulEating]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Simple streak calculation
    const actionsPerDay = new Map();
    allActions.forEach((action: any) => {
      const day = new Date(action.timestamp).toDateString();
      actionsPerDay.set(day, (actionsPerDay.get(day) || 0) + 1);
    });
    
    let checkDate = new Date();
    while (actionsPerDay.get(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    setStreak(currentStreak);
    
    // Show confetti for 7-day streak
    if (currentStreak >= 7 && currentStreak % 7 === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, []);

  const getMotivationalMessage = () => {
    if (todayActions === 0) {
      return "¡Empieza tu día con cuidado! 🌅";
    } else if (todayActions === 1) {
      return `Hoy ya cuidaste de ti ${todayActions} vez 💚`;
    } else {
      return `Hoy ya cuidaste de ti ${todayActions} veces 💚`;
    }
  };

  const getStreakMessage = () => {
    if (streak === 0) {
      return "Comienza tu racha de autocuidado";
    } else if (streak === 1) {
      return "¡1 día cuidándote! 🌱";
    } else if (streak < 7) {
      return `${streak} días consecutivos 🌿`;
    } else {
      return `¡${streak} días! Eres increíble 🌟`;
    }
  };

  return (
    <Card className={`glass-card border-0 shadow-elegant relative overflow-hidden ${className}`}>
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-ochre-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 right-4 w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {getMotivationalMessage()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {getStreakMessage()}
              </p>
            </div>
          </div>
          
          {streak >= 7 && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              ¡Racha!
            </Badge>
          )}
        </div>

        {/* Progress visualization */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i < todayActions 
                      ? 'bg-gradient-brand animate-pulse' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {todayActions}/5 momentos de cuidado hoy
            </span>
          </div>

          {todayActions > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                En marcha
              </Badge>
              {streak > 0 && (
                <Badge variant="secondary" className="text-xs bg-ochre-50 text-ochre-700 border-ochre-200">
                  <Zap className="h-3 w-3 mr-1" />
                  {streak} días seguidos
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Encouraging message */}
        <div className="mt-4 p-3 bg-gradient-to-r from-ochre-50 to-green-50 rounded-xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {todayActions === 0 
              ? "Ya sea en el súper, en la oficina o en casa con los peques, siempre hay un momento para ti. Cada pequeño gesto cuenta."
              : "Recuerda: no hay forma perfecta de cuidarse. Cada momento que dedicas a tu bienestar es valioso, sin importar dónde estés o cómo te sientes."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};