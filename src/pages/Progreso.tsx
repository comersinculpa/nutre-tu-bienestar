import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { GamificationPanel } from '@/components/GamificationPanel';
import { useGamification } from '@/hooks/useGamification';

interface CheckInData {
  timestamp: number;
  emotion: string;
  emotionIntensity: number;
  hungerType: string;
  bingeRisk: number;
  triggers?: string;
  foodThoughts?: string;
}

const emotionColors = {
  'Alegría': 'bg-success',
  'Gratitud': 'bg-warning',
  'Calma': 'bg-primary',
  'Curiosidad': 'bg-secondary',
  'Tristeza': 'bg-accent',
  'Ansiedad': 'bg-warning',
  'Frustración': 'bg-destructive',
  'Culpa': 'bg-muted'
};

const achievements = [
  { id: 'first-checkin', title: 'Primer check-in', description: 'Has completado tu primer registro emocional', icon: '🌱', unlocked: true },
  { id: 'week-streak', title: 'Una semana cuidándote', description: '7 días consecutivos registrando emociones', icon: '🌟', unlocked: false },
  { id: 'pause-master', title: 'Maestra de la pausa', description: 'Has usado 10 veces la función "Pausa con Cuidado"', icon: '🧘‍♀️', unlocked: false },
  { id: 'self-compassion', title: 'Autocompasión', description: 'Has elegido cuidarte en momentos difíciles', icon: '💝', unlocked: true }
];

export default function Progreso() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { progress, checkAchievements } = useGamification();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('checkIns') || '[]');
    setCheckIns(data);
    
    // Calcular racha actual
    calculateStreak(data);
    const streak = currentStreak;
    
    // Check achievements with current data
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const meditations = parseInt(localStorage.getItem('totalMeditations') || '0');
    
    checkAchievements({
      checkIns: data,
      diaryEntries,
      meditations,
      streak
    });
  }, [checkAchievements]);

  const calculateStreak = (data: CheckInData[]) => {
    if (data.length === 0) {
      setCurrentStreak(0);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const hasCheckIn = data.some(checkIn => {
        const checkInDate = new Date(checkIn.timestamp);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === currentDate.getTime();
      });

      if (hasCheckIn) {
        streak++;
      } else if (streak === 0) {
        // Si no hay check-in hoy pero ya empezó la racha, seguimos
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    setCurrentStreak(streak);
  };

  const getEmotionStats = () => {
    const emotionCounts = checkIns.reduce((acc, checkIn) => {
      acc[checkIn.emotion] = (acc[checkIn.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getWeeklyProgress = () => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weekData = checkIns.filter(checkIn => checkIn.timestamp > oneWeekAgo);
    
    const avgEmotionIntensity = weekData.length > 0 
      ? weekData.reduce((sum, checkIn) => sum + checkIn.emotionIntensity, 0) / weekData.length
      : 0;
    
    const avgBingeRisk = weekData.length > 0
      ? weekData.reduce((sum, checkIn) => sum + checkIn.bingeRisk, 0) / weekData.length
      : 0;

    return {
      totalCheckIns: weekData.length,
      avgEmotionIntensity: Math.round(avgEmotionIntensity * 10) / 10,
      avgBingeRisk: Math.round(avgBingeRisk * 10) / 10
    };
  };

  const emotionStats = getEmotionStats();
  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen bg-background-subpage p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">Tu Progreso</h1>
          <div></div>
        </div>

        {/* Avatar motivacional */}
        <div className="mb-6">
          <Avatar 
            message={currentStreak > 0 
              ? `¡Llevas ${currentStreak} días cuidándote! Tu constancia merece celebrarse.`
              : "Cada pequeño paso cuenta. Estás progresando maravillosamente."
            }
            mood="celebrating"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="font-body">Resumen</TabsTrigger>
            <TabsTrigger value="emotions" className="font-body">Emociones</TabsTrigger>
            <TabsTrigger value="achievements" className="font-body">Logros</TabsTrigger>
            <TabsTrigger value="gamification" className="font-body">Progreso</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Racha actual */}
            <Card className="p-6 text-center bg-gradient-card">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-1">
                {currentStreak} días
              </h3>
              <p className="text-muted-foreground font-body">
                {currentStreak === 0 ? 'Comienza tu racha hoy' : 'Racha de autocuidado'}
              </p>
              {currentStreak > 0 && (
                <Badge className="mt-3 bg-success-soft text-success-foreground">
                  ¡Sigue así!
                </Badge>
              )}
            </Card>

            {/* Progreso semanal */}
            <Card className="p-4 bg-gradient-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-medium text-foreground">Esta semana</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold text-primary mb-1">
                    {weeklyProgress.totalCheckIns}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Check-ins</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-accent mb-1">
                    {weeklyProgress.avgEmotionIntensity}/5
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Intensidad promedio</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-success mb-1">
                    {weeklyProgress.avgBingeRisk}/5
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Riesgo promedio</div>
                </div>
              </div>
            </Card>

            {/* Próximo objetivo */}
            <Card className="p-4 bg-gradient-warm">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-accent-foreground" />
                <div>
                  <h3 className="font-heading font-medium text-accent-foreground">
                    Próximo objetivo
                  </h3>
                  <p className="text-sm text-accent-foreground/80 font-body">
                    {currentStreak < 7 ? `${7 - currentStreak} días más para completar tu primera semana` : 'Mantén tu racha y sigue creciendo'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            <Card className="p-4 bg-gradient-card">
              <h3 className="font-heading font-medium mb-4 text-foreground">
                Tus emociones más frecuentes
              </h3>
              
              <div className="space-y-3">
                {emotionStats.map(([emotion, count], index) => (
                  <div key={emotion} className="flex items-center gap-3">
                    <div className="text-lg">{index === 0 ? '👑' : `${index + 1}.`}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground font-body">{emotion}</span>
                        <span className="text-sm text-muted-foreground">{count} veces</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${emotionColors[emotion as keyof typeof emotionColors] || 'bg-primary'}`}
                          style={{ width: `${Math.min((count / Math.max(...emotionStats.map(([,c]) => c))) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {emotionStats.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground font-body">
                    Completa algunos check-ins para ver tus patrones emocionales
                  </p>
                </div>
              )}
            </Card>

            {checkIns.length > 0 && (
              <Card className="p-4 bg-gradient-card">
                <h3 className="font-heading font-medium mb-4 text-foreground">
                  Última semana
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const hasData = checkIns.some(checkIn => {
                      const checkInDate = new Date(checkIn.timestamp);
                      return checkInDate.toDateString() === date.toDateString();
                    });
                    
                    return (
                      <div key={i} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1 font-body">
                          {date.toLocaleDateString('es', { weekday: 'short' })}
                        </div>
                        <div className={`w-8 h-8 rounded-lg mx-auto ${
                          hasData ? 'bg-primary' : 'bg-muted'
                        }`} />
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground text-center font-body">
                  Días con registro de emociones
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 ${achievement.unlocked ? 'bg-gradient-card border-success' : 'bg-muted/30 opacity-60'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-heading font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && (
                          <Badge className="bg-success-soft text-success-foreground">
                            <Award className="w-3 h-3 mr-1" />
                            Desbloqueado
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm font-body ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center p-4 bg-secondary-soft rounded-xl">
              <p className="text-sm text-secondary-foreground font-body">
                Sigue usando la aplicación para desbloquear más logros y celebrar tu progreso.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-4">
            <GamificationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}