import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Zap, Heart, Shield, Trophy, Sparkles, Flame } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const levels = [
  { id: 1, name: 'Principiante', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-500/10', minPoints: 0, maxPoints: 100 },
  { id: 2, name: 'Explorador', icon: Star, color: 'text-blue-500', bgColor: 'bg-blue-500/10', minPoints: 100, maxPoints: 300 },
  { id: 3, name: 'Determinado', icon: Shield, color: 'text-green-500', bgColor: 'bg-green-500/10', minPoints: 300, maxPoints: 600 },
  { id: 4, name: 'Valiente', icon: Zap, color: 'text-slate-500', bgColor: 'bg-slate-500/10', minPoints: 600, maxPoints: 1000 },
  { id: 5, name: 'Resiliente', icon: Trophy, color: 'text-purple-500', bgColor: 'bg-purple-500/10', minPoints: 1000, maxPoints: 1500 },
  { id: 6, name: 'Guerrero', icon: Flame, color: 'text-slate-500', bgColor: 'bg-slate-500/10', minPoints: 1500, maxPoints: 2200 },
  { id: 7, name: 'Maestro', icon: Sparkles, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', minPoints: 2200, maxPoints: 3000 },
  { id: 8, name: 'Mítico', icon: Crown, color: 'text-slate-600', bgColor: 'bg-slate-600/10', minPoints: 3000, maxPoints: Infinity }
];

export const TCALevelSystem: React.FC = () => {
  const { progress, getNextLevelProgress } = useGamification();
  const nextLevelProgress = getNextLevelProgress();
  
  const currentLevel = levels.find(level => 
    progress.totalPoints >= level.minPoints && progress.totalPoints < level.maxPoints
  ) || levels[0];
  
  const nextLevel = levels.find(level => level.id === currentLevel.id + 1);
  
  const currentLevelProgress = progress.totalPoints - currentLevel.minPoints;
  const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
  const progressPercentage = currentLevel.id === 8 ? 100 : (currentLevelProgress / levelRange) * 100;

  return (
    <div className="space-y-6">
      {/* Current Level Card */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader className="text-center pb-3">
          <div className={`w-16 h-16 rounded-full ${currentLevel.bgColor} flex items-center justify-center mx-auto mb-4`}>
            <currentLevel.icon className={`w-8 h-8 ${currentLevel.color}`} />
          </div>
          <CardTitle className="text-2xl font-bold">
            Nivel {currentLevel.id}: {currentLevel.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {progress.totalPoints} puntos totales
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {nextLevel && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso al siguiente nivel</span>
                <span className="font-medium">
                  {Math.round(progressPercentage)}% ({currentLevelProgress}/{levelRange} puntos)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {levelRange - currentLevelProgress} puntos hasta <strong>{nextLevel.name}</strong>
              </div>
            </>
          )}
          
          {currentLevel.id === 8 && (
            <div className="text-center py-4">
              <Badge className="bg-sage-200 text-sage-700 border-sage-300">
                ¡Nivel Máximo Alcanzado! 🎉
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Has alcanzado el nivel más alto. ¡Sigue manteniendo tu progreso!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level Grid */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Todos los Niveles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {levels.map((level) => {
              const isUnlocked = progress.totalPoints >= level.minPoints;
              const isCurrent = level.id === currentLevel.id;
              
              return (
                <div
                  key={level.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrent 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : isUnlocked 
                        ? 'border-muted bg-muted/30' 
                        : 'border-muted bg-muted/10 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${level.bgColor} flex items-center justify-center`}>
                      <level.icon className={`w-5 h-5 ${isUnlocked ? level.color : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${isCurrent ? 'text-primary' : isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {level.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {level.minPoints}+ pts
                      </div>
                    </div>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        Actual
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Level Benefits */}
      <Card className="bg-gradient-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Beneficios del Nivel {currentLevel.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {currentLevel.id >= 1 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Acceso al sistema de seguimiento básico</span>
              </div>
            )}
            {currentLevel.id >= 2 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Herramientas de análisis emocional</span>
              </div>
            )}
            {currentLevel.id >= 3 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Recomendaciones personalizadas</span>
              </div>
            )}
            {currentLevel.id >= 4 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Técnicas avanzadas de mindfulness</span>
              </div>
            )}
            {currentLevel.id >= 5 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Comunicación directa con terapeutas</span>
              </div>
            )}
            {currentLevel.id >= 6 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Análisis predictivo de patrones</span>
              </div>
            )}
            {currentLevel.id >= 7 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Programa de mentoría con otros usuarios</span>
              </div>
            )}
            {currentLevel.id >= 8 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Acceso VIP a contenido exclusivo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};