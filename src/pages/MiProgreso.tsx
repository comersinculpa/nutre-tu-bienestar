import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/Avatar';
import { 
  TrendingUp, 
  Heart, 
  Pause,
  Utensils,
  CheckCircle,
  Flame,
  Calendar,
  BarChart3,
  Lightbulb,
  Star,
  Target,
  Clock
} from 'lucide-react';

interface WeeklyInsight {
  streak: number;
  topEmotions: string[];
  topTriggers: string[];
  recommendation: string;
  totalActions: number;
  pausesCompleted: number;
  checkInsCompleted: number;
  mindfulMeals: number;
}

export default function MiProgreso() {
  const navigate = useNavigate();
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateWeeklyInsight();
  }, []);

  const generateWeeklyInsight = () => {
    setIsLoading(true);
    
    // Get data from last 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const dailyCheckIns = JSON.parse(localStorage.getItem('dailyCheckIns') || '[]');
    const consciousPauses = JSON.parse(localStorage.getItem('consciousPauses') || '[]');
    const mindfulEating = JSON.parse(localStorage.getItem('mindfulEatingEntries') || '[]');
    
    // Filter last week data
    const weekCheckIns = dailyCheckIns.filter((item: any) => 
      new Date(item.timestamp) >= weekAgo
    );
    
    const weekPauses = consciousPauses.filter((item: any) => 
      new Date(item.timestamp) >= weekAgo
    );
    
    const weekMeals = mindfulEating.filter((item: any) => 
      new Date(item.timestamp) >= weekAgo
    );
    
    // Calculate streak
    let streak = 0;
    const allActions = [...dailyCheckIns, ...consciousPauses, ...mindfulEating]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const actionsPerDay = new Map();
    allActions.forEach((action: any) => {
      const day = new Date(action.timestamp).toDateString();
      actionsPerDay.set(day, (actionsPerDay.get(day) || 0) + 1);
    });
    
    let checkDate = new Date();
    while (actionsPerDay.get(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // Analyze emotions
    const emotions = weekCheckIns.map((item: any) => item.emotion).filter(Boolean);
    const emotionCounts = emotions.reduce((acc: any, emotion: string) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
    
    const topEmotions = Object.entries(emotionCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 3)
      .map(([emotion]: any) => emotion);
    
    // Generate personalized recommendation
    let recommendation = "Sigue construyendo tu rutina de autocuidado día a día.";
    
    if (streak >= 7) {
      recommendation = "¡Increíble racha! Prueba añadir una pausa de 5 minutos por las tardes.";
    } else if (weekPauses.length > weekCheckIns.length) {
      recommendation = "Excelente con las pausas. ¿Qué tal más check-ins para mayor conciencia?";
    } else if (topEmotions.includes('ansiosa') || topEmotions.includes('irritada')) {
      recommendation = "Nota que aparece ansiedad. Las pausas de respiración pueden ayudar mucho.";
    } else if (weekMeals.length > 3) {
      recommendation = "Genial registrando comidas. Prueba la mini-pausa antes de comer.";
    }
    
    const insight: WeeklyInsight = {
      streak,
      topEmotions: topEmotions.slice(0, 3),
      topTriggers: ['17:00-20:00', 'Después del trabajo', 'Fines de semana'], // Simplified for MVP
      recommendation,
      totalActions: weekCheckIns.length + weekPauses.length + weekMeals.length,
      pausesCompleted: weekPauses.length,
      checkInsCompleted: weekCheckIns.length,
      mindfulMeals: weekMeals.length
    };
    
    setWeeklyInsight(insight);
    setIsLoading(false);
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Comienza tu primera racha hoy";
    if (streak === 1) return "¡Primera semilla plantada! 🌱";
    if (streak < 7) return `${streak} días consecutivos 💚`;
    if (streak < 14) return `¡${streak} días! Estás creando un hábito 🌿`;
    return `${streak} días seguidos. Eres increíble 🌟`;
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      'alegre': '😊',
      'tranquila': '😌',
      'ansiosa': '😰',
      'triste': '😔',
      'irritada': '😤',
      'cansada': '😴',
      'agradecida': '🙏',
      'otra': '💭'
    };
    return emojiMap[emotion] || '💙';
  };

  if (isLoading || !weeklyInsight) {
    return (
      <div className="min-h-screen bg-gradient-warm pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">Analizando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5 text-ochre-600" />
            <span className="text-ochre-700 font-semibold">Mi Progreso</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Pequeños actos, grandes cambios
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Tu semana en 10 segundos
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Avatar guidance */}
          <Avatar 
            message={
              weeklyInsight.totalActions > 0 
                ? `Has registrado ${weeklyInsight.totalActions} momentos de cuidado esta semana. Cada uno cuenta.`
                : "Aún no hay datos suficientes. Hoy puede ser un buen comienzo."
            }
            mood="supportive"
          />

          {/* Weekly summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Streak */}
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-ochre-400 to-ochre-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {weeklyInsight.streak}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getStreakMessage(weeklyInsight.streak)}
                </p>
              </CardContent>
            </Card>

            {/* Pausas */}
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Pause className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {weeklyInsight.pausesCompleted}
                </h3>
                <p className="text-sm text-muted-foreground">
                  pausas conscientes
                </p>
              </CardContent>
            </Card>

            {/* Check-ins */}
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {weeklyInsight.checkInsCompleted}
                </h3>
                <p className="text-sm text-muted-foreground">
                  check-ins diarios
                </p>
              </CardContent>
            </Card>

            {/* Mindful meals */}
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {weeklyInsight.mindfulMeals}
                </h3>
                <p className="text-sm text-muted-foreground">
                  comidas conscientes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top emotions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-ochre-600" />
                Tus 3 emociones más frecuentes
              </CardTitle>
              <CardDescription>
                Lo que has estado sintiendo esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyInsight.topEmotions.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {weeklyInsight.topEmotions.map((emotion, index) => (
                    <Badge 
                      key={emotion}
                      variant="secondary" 
                      className="text-sm bg-ochre-50 text-ochre-700 border-ochre-200 px-4 py-2"
                    >
                      <span className="mr-2 text-base">{getEmotionEmoji(emotion)}</span>
                      {emotion}
                      {index === 0 && <Star className="h-3 w-3 ml-1 text-ochre-500" />}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Registra más check-ins para ver tus patrones emocionales
                </p>
              )}
            </CardContent>
          </Card>

          {/* Personal recommendation */}
          <Card className="glass-card bg-gradient-to-r from-ochre-50 via-green-50 to-ochre-50 border-ochre-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-ochre-800 mb-2">
                    Recomendación personalizada
                  </h3>
                  <p className="text-ochre-700 text-sm leading-relaxed mb-4">
                    {weeklyInsight.recommendation}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => navigate('/pausa-consciente')}
                      className="bg-gradient-brand text-white text-xs"
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Hacer pausa ahora
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/check-in-diario')}
                      className="text-xs border-ochre-300 text-ochre-700"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Check-in rápido
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Momentos críticos identificados */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Patrones identificados
              </CardTitle>
              <CardDescription>
                Momentos donde sueles necesitar más apoyo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyInsight.topTriggers.map((trigger, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-sm text-foreground">{trigger}</span>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    💡 <strong>Tip:</strong> Considera programar una pausa consciente 
                    15 minutos antes de estos momentos críticos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/registrar')}
              className="bg-gradient-brand text-white p-6 h-auto"
            >
              <div className="text-left">
                <div className="font-semibold mb-1">Registrar ahora</div>
                <div className="text-sm opacity-90">Check-in o comer consciente</div>
              </div>
            </Button>
            
            <Button
              onClick={() => navigate('/pausa-consciente')}
              variant="outline"
              className="border-ochre-300 text-ochre-700 hover:bg-ochre-50 p-6 h-auto"
            >
              <div className="text-left">
                <div className="font-semibold mb-1">Pausa consciente</div>
                <div className="text-sm opacity-70">2-3 minutos de calma</div>
              </div>
            </Button>
          </div>

          {/* Motivational message */}
          <Card className="glass-card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="text-green-800 font-medium mb-2">
                Recuerda: no se trata de ser perfecta
              </p>
              <p className="text-green-700 text-sm leading-relaxed">
                Cada día que apareces para cuidarte, sin importar por cuánto tiempo o de qué forma, 
                es un acto de amor hacia ti misma. Un 1% de progreso también es progreso.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}