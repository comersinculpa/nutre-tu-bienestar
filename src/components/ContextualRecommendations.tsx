import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, AlertTriangle, Play, BookOpen, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecommendationProps {
  risk: 'low' | 'medium' | 'high';
  emotions: string[];
  triggers: string[];
  recommendations: string[];
  needsSupport: boolean;
}

export const ContextualRecommendations = ({ 
  risk, 
  emotions, 
  triggers, 
  recommendations, 
  needsSupport 
}: RecommendationProps) => {
  const { toast } = useToast();

  const handleRecommendationClick = (recommendation: string) => {
    const actions = {
      'Técnica de respiración inmediata': () => {
        toast({
          title: "Iniciando respiración guiada",
          description: "Respira conmigo: 4 segundos inhalar, 7 mantener, 8 exhalar",
        });
      },
      'Contactar con apoyo profesional': () => {
        toast({
          title: "Conectando con apoyo",
          description: "Te pondremos en contacto con un profesional",
          variant: "destructive"
        });
      },
      'Ejercicio de grounding 5-4-3-2-1': () => {
        toast({
          title: "Técnica 5-4-3-2-1",
          description: "Identifica: 5 cosas que ves, 4 que escuchas, 3 que tocas...",
        });
      },
      'Pausa guiada de emergencia': () => {
        window.location.href = '/pausa';
      },
      'Meditación de 5 minutos': () => {
        toast({
          title: "Meditación iniciada",
          description: "Encuentra tu centro con esta práctica guiada",
        });
      },
      'Técnica STOP': () => {
        toast({
          title: "Técnica STOP",
          description: "Para • Toma una respiración • Observa • Procede conscientemente",
        });
      }
    };

    const action = actions[recommendation as keyof typeof actions];
    if (action) {
      action();
    } else {
      toast({
        title: `Abriendo: ${recommendation}`,
        description: "Cargando recurso...",
      });
    }
  };

  const getRiskColor = () => {
    switch (risk) {
      case 'high': return 'border-destructive bg-destructive/5';
      case 'medium': return 'border-warning bg-warning/5';
      default: return 'border-success bg-success/5';
    }
  };

  const getRiskIcon = () => {
    switch (risk) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <Heart className="w-5 h-5 text-success" />;
    }
  };

  const getRiskMessage = () => {
    switch (risk) {
      case 'high': return 'He detectado que podrías necesitar apoyo inmediato. Aquí tienes recursos urgentes:';
      case 'medium': return 'Veo que estás pasando por un momento difícil. Te sugiero estos recursos:';
      default: return 'Reconozco tus emociones. Estos recursos pueden ayudarte:';
    }
  };

  return (
    <Card className={`${getRiskColor()} border-l-4 shadow-card`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          {getRiskIcon()}
          Recomendaciones Personalizadas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getRiskMessage()}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Analysis Summary */}
        <div className="grid grid-cols-2 gap-4">
          {emotions.length > 0 && (
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Emociones detectadas</p>
              <p className="text-sm font-medium capitalize">{emotions.join(', ')}</p>
            </div>
          )}
          
          {triggers.length > 0 && (
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Posibles disparadores</p>
              <p className="text-sm font-medium capitalize">{triggers.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Emergency Contact for high risk */}
        {needsSupport && (
          <Card className="bg-destructive/10 border-destructive">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-destructive" />
                <div className="flex-1">
                  <p className="font-medium text-destructive">Apoyo Inmediato Disponible</p>
                  <p className="text-xs text-destructive/80">No estás sola. Hablemos ahora.</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => handleRecommendationClick('Contactar con apoyo profesional')}
                >
                  Contactar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Recursos sugeridos:</p>
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors cursor-pointer"
              onClick={() => handleRecommendationClick(rec)}
            >
              <div className="flex items-center gap-3">
                {rec.includes('respiración') || rec.includes('Meditación') ? 
                  <Play className="w-4 h-4 text-success" /> :
                  <BookOpen className="w-4 h-4 text-primary" />
                }
                <span className="text-sm font-medium">{rec}</span>
              </div>
              <Button size="sm" variant="ghost">
                {rec.includes('respiración') || rec.includes('Meditación') ? 'Iniciar' : 'Ver'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};