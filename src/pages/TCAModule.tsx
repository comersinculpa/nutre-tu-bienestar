import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, TrendingUp, Award, AlertTriangle, Activity, BookOpen, Camera } from 'lucide-react';
import { GamificationPanel } from '@/components/GamificationPanel';
import { RiskAlerts } from '@/components/RiskAlerts';
import { MotivationalMessages } from '@/components/MotivationalMessages';
import { EnhancedAvatar } from '@/components/EnhancedAvatar';
import { ContextualRecommendations } from '@/components/ContextualRecommendations';
import { CrisisSupport } from '@/components/CrisisSupport';
import { useGamification } from '@/hooks/useGamification';
import { useRiskDetection } from '@/hooks/useRiskDetection';
import { Link } from 'react-router-dom';

interface TCAStats {
  dailyCheckins: number;
  weeklyProgress: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  treatmentDays: number;
  achievements: number;
}

const quickActions = [
  {
    title: 'Registro Emocional',
    description: 'Registra tu estado emocional actual',
    icon: Heart,
    path: '/check-in',
    color: 'primary',
    bgColor: 'bg-primary/10'
  },
  {
    title: 'Diario Terapéutico',
    description: 'Escribe sobre tus pensamientos y experiencias',
    icon: BookOpen,
    path: '/diario',
    color: 'accent',
    bgColor: 'bg-accent/10'
  },
  {
    title: 'Registro Alimentario',
    description: 'Documenta tus comidas con análisis inteligente',
    icon: Camera,
    path: '/registro-alimentario',
    color: 'success',
    bgColor: 'bg-success/10'
  },
  {
    title: 'Técnicas de Calma',
    description: 'Ejercicios de mindfulness y respiración',
    icon: Activity,
    path: '/pausa',
    color: 'secondary',
    bgColor: 'bg-secondary/10'
  }
];

export default function TCAModule() {
  const navigate = useNavigate();
  const { progress, checkAchievements } = useGamification();
  const { getActiveAlerts, detectPatterns, getRiskSummary } = useRiskDetection();
  
  const [stats, setStats] = useState<TCAStats>({
    dailyCheckins: 0,
    weeklyProgress: 0,
    riskLevel: 'low',
    treatmentDays: 0,
    achievements: 0
  });

  const activeAlerts = getActiveAlerts();
  const riskSummary = getRiskSummary();

  useEffect(() => {
    loadTCAStats();
    runAnalysis();
  }, []);

  const loadTCAStats = () => {
    // Load data from localStorage
    const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const startDate = localStorage.getItem('treatmentStartDate');
    
    const today = new Date().toDateString();
    const todayCheckins = checkIns.filter((c: any) => 
      new Date(c.timestamp).toDateString() === today
    ).length;

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const weeklyCheckins = checkIns.filter((c: any) => c.timestamp > oneWeekAgo).length;

    // Calculate treatment days
    const treatmentStart = startDate ? new Date(startDate) : new Date();
    const daysSinceStart = Math.floor((Date.now() - treatmentStart.getTime()) / (1000 * 60 * 60 * 24));

    // Determine risk level based on recent patterns
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskSummary.critical > 0) riskLevel = 'critical';
    else if (riskSummary.high > 0) riskLevel = 'high';
    else if (riskSummary.medium > 1) riskLevel = 'medium';

    setStats({
      dailyCheckins: todayCheckins,
      weeklyProgress: Math.min((weeklyCheckins / 7) * 100, 100),
      riskLevel,
      treatmentDays: Math.max(daysSinceStart, 0),
      achievements: progress.achievements.filter(a => a.unlocked).length
    });
  };

  const runAnalysis = () => {
    const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    const diaryEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const foodLogs = JSON.parse(localStorage.getItem('foodLogs') || '[]');

    // Detect patterns
    detectPatterns({ checkIns, diaryEntries, foodLogs });

    // Check achievements
    const streak = calculateStreak(checkIns);
    checkAchievements({
      checkIns,
      diaryEntries,
      meditations: parseInt(localStorage.getItem('totalMeditations') || '0'),
      streak
    });
  };

  const calculateStreak = (checkIns: any[]) => {
    if (checkIns.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const hasCheckIn = checkIns.some((checkIn: any) => {
        const checkInDate = new Date(checkIn.timestamp);
        checkInDate.setHours(0, 0, 0, 0);
        return checkInDate.getTime() === currentDate.getTime();
      });

      if (hasCheckIn) {
        streak++;
      } else if (streak === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getRiskColor = () => {
    switch (stats.riskLevel) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getRiskBgColor = () => {
    switch (stats.riskLevel) {
      case 'critical': return 'bg-destructive/10';
      case 'high': return 'bg-destructive/10';
      case 'medium': return 'bg-warning/10';
      default: return 'bg-success/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">Módulo TCA</h1>
          <div></div>
        </div>

        {/* Enhanced Avatar */}
        <div className="mb-6">
          <EnhancedAvatar 
            riskLevel={stats.riskLevel === 'critical' ? 'high' : stats.riskLevel}
            userEmotion={progress.streakDays > 7 ? 'Orgullosa' : 'Determinada'}
            message={`Día ${stats.treatmentDays + 1} de tu camino. Cada paso cuenta.`}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">Resumen</TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              Alertas
              {activeAlerts.length > 0 && (
                <Badge className="ml-1 h-4 w-4 p-0 text-xs">{activeAlerts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">Progreso</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">Acciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Treatment Overview */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  Estado de Tratamiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {stats.treatmentDays + 1}
                    </div>
                    <div className="text-xs text-muted-foreground">Días en tratamiento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">
                      {progress.streakDays}
                    </div>
                    <div className="text-xs text-muted-foreground">Días consecutivos</div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${getRiskBgColor()}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Nivel de riesgo actual</span>
                    <Badge className={`${getRiskColor()} bg-transparent border-current`}>
                      {stats.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso semanal</span>
                    <span className="font-medium">{Math.round(stats.weeklyProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${stats.weeklyProgress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Resumen de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary">
                    {stats.dailyCheckins}
                  </div>
                  <div className="text-xs text-muted-foreground">Check-ins</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-success">
                    {stats.achievements}
                  </div>
                  <div className="text-xs text-muted-foreground">Logros</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-accent">
                    {progress.level}
                  </div>
                  <div className="text-xs text-muted-foreground">Nivel</div>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <MotivationalMessages 
              category={stats.riskLevel === 'critical' ? 'crisis' : 
                       stats.achievements > 0 ? 'celebration' : 'general'} 
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <RiskAlerts />
            {activeAlerts.length === 0 && riskSummary.total === 0 && (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Todo se ve bien</h3>
                  <p className="text-sm text-muted-foreground">
                    No hay alertas activas. Sigue cuidándote como lo estás haciendo.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <GamificationPanel />
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Card className="bg-gradient-card border-0 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.bgColor}`}>
                          <action.icon className={`w-6 h-6 text-${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Emergency Actions */}
            <Card className="bg-destructive/10 border-destructive/20 border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Apoyo de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CrisisSupport />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Si sientes que estás en crisis, no dudes en buscar ayuda profesional inmediata.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contextual Recommendations */}
            <ContextualRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}