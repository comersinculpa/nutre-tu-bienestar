import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Download, Play, BookOpen, Phone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmotionalAnalysis } from '@/hooks/useEmotionalAnalysis';
import { ContextualRecommendations } from '@/components/ContextualRecommendations';

const recursos = [
  {
    categoria: 'Técnicas de Calma',
    icono: Heart,
    color: 'success',
    bgColor: 'bg-success-soft',
    items: [
      { titulo: 'Respiración 4-7-8', tipo: 'audio', duracion: '5 min' },
      { titulo: 'Meditación para Ansiedad', tipo: 'audio', duracion: '10 min' },
      { titulo: 'Ejercicios de Grounding', tipo: 'guía', duracion: 'Lectura' }
    ]
  },
  {
    categoria: 'Manejo de Impulsos',
    icono: AlertTriangle,
    color: 'warning',
    bgColor: 'bg-warning-soft',
    items: [
      { titulo: 'Técnica STOP', tipo: 'guía', duracion: 'Lectura' },
      { titulo: 'Distracción Consciente', tipo: 'ejercicio', duracion: '3-5 min' },
      { titulo: 'Plan de Emergencia Personal', tipo: 'plantilla', duracion: 'Personalizar' }
    ]
  },
  {
    categoria: 'Alimentación Consciente',
    icono: BookOpen,
    color: 'primary',
    bgColor: 'bg-primary-soft',
    items: [
      { titulo: 'Guía de Hambre-Saciedad', tipo: 'guía', duracion: 'Lectura' },
      { titulo: 'Meditación Pre-Comida', tipo: 'audio', duracion: '3 min' },
      { titulo: 'Registro de Sensaciones', tipo: 'plantilla', duracion: 'Diario' }
    ]
  },
  {
    categoria: 'Autocuidado Emocional',
    icono: Heart,
    color: 'accent',
    bgColor: 'bg-accent-soft',
    items: [
      { titulo: 'Cartas de Compasión Personal', tipo: 'ejercicio', duracion: '15 min' },
      { titulo: 'Ritual de Autocuidado', tipo: 'guía', duracion: 'Lectura' },
      { titulo: 'Afirmaciones Positivas', tipo: 'audio', duracion: '7 min' }
    ]
  }
];

export default function Recursos() {
  const { toast } = useToast();
  const { analyzeText } = useEmotionalAnalysis();

  // Get user's recent emotional state from localStorage for contextual recommendations
  const getContextualRecommendations = () => {
    const recentEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const lastEntry = recentEntries[0];
    
    if (lastEntry?.analysis) {
      return lastEntry.analysis;
    }
    return null;
  };

  const contextualAnalysis = getContextualRecommendations();

  const handleResourceClick = (titulo: string, tipo: string) => {
    toast({
      title: `Abriendo ${titulo}`,
      description: `${tipo === 'audio' ? 'Reproduciendo' : 'Cargando'} recurso...`,
    });
  };

  const handleEmergencyContact = () => {
    toast({
      title: "Contacto de Emergencia",
      description: "Te conectaremos con apoyo profesional inmediato.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-6 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Recursos de Apoyo
          </h1>
          <p className="text-muted-foreground">
            Herramientas para tu bienestar emocional
          </p>
        </div>

        <Avatar 
          mood={contextualAnalysis?.risk === 'high' ? 'calming' : 'supportive'}
          message={
            contextualAnalysis?.needsSupport 
              ? "He notado que podrías necesitar apoyo extra hoy. Estos recursos están especialmente seleccionados para ti."
              : "Aquí tienes recursos que te pueden ayudar en diferentes momentos. Elige lo que necesites ahora."
          }
        />

        {/* Contextual Recommendations based on recent emotional state */}
        {contextualAnalysis && (
          <ContextualRecommendations 
            risk={contextualAnalysis.risk}
            emotions={contextualAnalysis.emotions}
            triggers={contextualAnalysis.triggers}
            recommendations={contextualAnalysis.recommendations}
            needsSupport={contextualAnalysis.needsSupport}
          />
        )}

        {/* Emergency Contact */}
        <Card className="bg-gradient-warm shadow-warm border-0 border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <Phone className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  ¿Necesitas ayuda urgente?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contacto inmediato con apoyo profesional
                </p>
              </div>
              <Button 
                onClick={handleEmergencyContact}
                className="bg-destructive hover:bg-destructive/90"
                size="sm"
              >
                Contactar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resource Categories */}
        {recursos.map((categoria, index) => {
          const IconoCategoria = categoria.icono;
          
          return (
            <Card key={index} className="bg-gradient-card shadow-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoria.bgColor}`}>
                    <IconoCategoria className={`w-5 h-5 text-${categoria.color}`} />
                  </div>
                  {categoria.categoria}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoria.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors cursor-pointer"
                    onClick={() => handleResourceClick(item.titulo, item.tipo)}
                  >
                    <div className="flex items-center gap-3">
                      {item.tipo === 'audio' && <Play className="w-4 h-4 text-success" />}
                      {item.tipo === 'guía' && <BookOpen className="w-4 h-4 text-primary" />}
                      {item.tipo === 'ejercicio' && <Heart className="w-4 h-4 text-warning" />}
                      {item.tipo === 'plantilla' && <Download className="w-4 h-4 text-accent" />}
                      
                      <div>
                        <h4 className="font-medium text-foreground">{item.titulo}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.tipo} • {item.duracion}
                        </p>
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost">
                      {item.tipo === 'audio' ? 'Reproducir' : 'Abrir'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        {/* Daily Resources */}
        <Card className="bg-gradient-warm shadow-warm border-0">
          <CardHeader>
            <CardTitle>💙 Recurso Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <p className="text-foreground/80">
                "Técnica de los 5 Sentidos para Ansiedad"
              </p>
              <p className="text-sm text-muted-foreground">
                Identifica: 5 cosas que ves, 4 que escuchas, 3 que tocas, 2 que hueles, 1 que saboreas
              </p>
              <Button 
                onClick={() => handleResourceClick('Técnica 5 Sentidos', 'ejercicio')}
                className="bg-gradient-primary shadow-soft"
              >
                Practicar Ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}