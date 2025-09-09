import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, Brain, Activity, ChevronRight } from 'lucide-react';
import { useRiskDetection } from '@/hooks/useRiskDetection';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'coping' | 'nutrition' | 'emotional' | 'behavioral';
  priority: 'low' | 'medium' | 'high';
  icon: React.ElementType;
  action?: string;
  helpful?: boolean;
}

const categoryIcons = {
  coping: Activity,
  nutrition: Heart,
  emotional: Brain,
  behavioral: Lightbulb
};

const categoryColors = {
  coping: 'text-primary',
  nutrition: 'text-success',
  emotional: 'text-accent',
  behavioral: 'text-secondary'
};

const categoryBgColors = {
  coping: 'bg-primary/10',
  nutrition: 'bg-success/10',
  emotional: 'bg-accent/10',
  behavioral: 'bg-secondary/10'
};

const baseRecommendations: Recommendation[] = [
  {
    id: 'breathing',
    title: 'Técnica de respiración',
    description: 'Practica respiración profunda para reducir la ansiedad',
    category: 'coping',
    priority: 'high',
    icon: Activity,
    action: 'Prueba ahora'
  },
  {
    id: 'mindful-eating',
    title: 'Alimentación consciente',
    description: 'Come despacio y presta atención a las señales de tu cuerpo',
    category: 'nutrition',
    priority: 'medium',
    icon: Heart
  },
  {
    id: 'emotion-naming',
    title: 'Nombra tus emociones',
    description: 'Identifica y acepta lo que sientes sin juzgarte',
    category: 'emotional',
    priority: 'medium',
    icon: Brain
  },
  {
    id: 'distraction',
    title: 'Actividad de distracción',
    description: 'Busca una actividad que disfrutes para cambiar el foco',
    category: 'behavioral',
    priority: 'low',
    icon: Lightbulb
  }
];

export function ContextualRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const { getRiskSummary, patterns } = useRiskDetection();

  useEffect(() => {
    generateRecommendations();
    loadFeedback();
  }, [patterns]);

  const loadFeedback = () => {
    const savedFeedback = localStorage.getItem('recommendation_feedback');
    if (savedFeedback) {
      setFeedback(JSON.parse(savedFeedback));
    }
  };

  const saveFeedback = (recommendationId: string, helpful: boolean) => {
    const newFeedback = { ...feedback, [recommendationId]: helpful };
    setFeedback(newFeedback);
    localStorage.setItem('recommendation_feedback', JSON.stringify(newFeedback));
  };

  const generateRecommendations = () => {
    const riskSummary = getRiskSummary();
    let contextualRecs: Recommendation[] = [...baseRecommendations];

    // Add high-priority recommendations based on risk patterns
    if (riskSummary.high > 0 || riskSummary.critical > 0) {
      contextualRecs.unshift({
        id: 'crisis-support',
        title: 'Busca apoyo profesional',
        description: 'Se detectaron patrones de riesgo. Considera contactar a tu terapeuta',
        category: 'emotional',
        priority: 'high',
        icon: Heart,
        action: 'Contactar'
      });

      contextualRecs.push({
        id: 'grounding',
        title: 'Técnica de conexión',
        description: 'Usa la técnica 5-4-3-2-1 para mantenerte presente',
        category: 'coping',
        priority: 'high',
        icon: Activity,
        action: 'Practicar'
      });
    }

    // Check for emotional patterns
    const emotionalPatterns = patterns.filter(p => p.type === 'emotional');
    if (emotionalPatterns.length > 0) {
      contextualRecs.push({
        id: 'emotional-validation',
        title: 'Validación emocional',
        description: 'Tus emociones son válidas. Permítete sentir sin criticarte',
        category: 'emotional',
        priority: 'medium',
        icon: Brain
      });
    }

    // Check for behavioral patterns
    const behavioralPatterns = patterns.filter(p => p.type === 'behavioral');
    if (behavioralPatterns.length > 0) {
      contextualRecs.push({
        id: 'behavioral-alternative',
        title: 'Comportamiento alternativo',
        description: 'Cuando sientas el impulso, prueba escribir o llamar a alguien',
        category: 'behavioral',
        priority: 'high',
        icon: Lightbulb,
        action: 'Ver opciones'
      });
    }

    // Temporal patterns
    const temporalPatterns = patterns.filter(p => p.type === 'temporal');
    if (temporalPatterns.length > 0) {
      contextualRecs.push({
        id: 'sleep-hygiene',
        title: 'Higiene del sueño',
        description: 'Establece una rutina relajante antes de dormir',
        category: 'coping',
        priority: 'medium',
        icon: Activity
      });
    }

    // Sort by priority and limit to top 6
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const sortedRecs = contextualRecs
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 6);

    setRecommendations(sortedRecs);
  };

  const handleRecommendationAction = (recommendation: Recommendation) => {
    if (recommendation.action) {
      // Track engagement
      const engagement = JSON.parse(localStorage.getItem('recommendation_engagement') || '{}');
      engagement[recommendation.id] = (engagement[recommendation.id] || 0) + 1;
      localStorage.setItem('recommendation_engagement', JSON.stringify(engagement));

      // Could navigate to specific modules or show more detailed content
      if (recommendation.id === 'breathing') {
        // Could integrate with meditation module
        window.location.href = '/pausa';
      } else if (recommendation.id === 'crisis-support') {
        // Could show crisis support dialog
        alert('Si sientes que estás en crisis, busca ayuda profesional inmediata o llama a una línea de crisis.');
      }
    }
  };

  const markHelpful = (recommendationId: string, helpful: boolean) => {
    saveFeedback(recommendationId, helpful);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Recomendaciones Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = categoryIcons[rec.category];
          const isHelpful = feedback[rec.id];

          return (
            <div
              key={rec.id}
              className="p-4 rounded-lg border border-border/50 bg-gradient-subtle hover:shadow-warm transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${categoryBgColors[rec.category]}`}>
                  <IconComponent className={`w-4 h-4 ${categoryColors[rec.category]}`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs h-5"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">¿Te fue útil?</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={isHelpful === true ? "default" : "ghost"}
                          className="h-6 px-2 text-xs"
                          onClick={() => markHelpful(rec.id, true)}
                        >
                          👍
                        </Button>
                        <Button
                          size="sm"
                          variant={isHelpful === false ? "default" : "ghost"}
                          className="h-6 px-2 text-xs"
                          onClick={() => markHelpful(rec.id, false)}
                        >
                          👎
                        </Button>
                      </div>
                    </div>

                    {rec.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => handleRecommendationAction(rec)}
                      >
                        {rec.action}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}