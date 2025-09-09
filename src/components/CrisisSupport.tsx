import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Phone, Heart, MessageCircle, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrisisResource {
  name: string;
  phone: string;
  description: string;
  available: string;
  type: 'hotline' | 'emergency' | 'text' | 'chat';
  icon: React.ElementType;
}

const crisisResources: CrisisResource[] = [
  {
    name: 'Línea de Crisis Nacional',
    phone: '1-800-273-8255',
    description: 'Apoyo emocional gratuito y confidencial las 24 horas',
    available: '24/7',
    type: 'hotline',
    icon: Phone
  },
  {
    name: 'Emergencias',
    phone: '911',
    description: 'Para situaciones de emergencia médica o riesgo inmediato',
    available: '24/7',
    type: 'emergency',
    icon: AlertTriangle
  },
  {
    name: 'Chat de Crisis',
    phone: 'crisis-chat.org',
    description: 'Apoyo por chat en tiempo real',
    available: '24/7',
    type: 'chat',
    icon: MessageCircle
  },
  {
    name: 'Línea TCA Especializada',
    phone: '1-800-931-2237',
    description: 'Especializada en trastornos de la conducta alimentaria',
    available: 'Lun-Vie 9AM-9PM',
    type: 'hotline',
    icon: Heart
  }
];

const copingStrategies = [
  {
    title: 'Técnica de respiración 4-7-8',
    description: 'Inhala 4 segundos, mantén 7, exhala 8. Repite 4 veces.',
    duration: '2-3 minutos'
  },
  {
    title: 'Técnica 5-4-3-2-1',
    description: 'Nombra 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.',
    duration: '3-5 minutos'
  },
  {
    title: 'Música calmante',
    description: 'Escucha una canción que te tranquilice y enfócate en la melodía.',
    duration: '3-4 minutos'
  },
  {
    title: 'Contacto con agua fría',
    description: 'Salpica agua fría en tu cara o sostén cubos de hielo.',
    duration: '1-2 minutos'
  }
];

export function CrisisSupport({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'assessment' | 'resources' | 'coping' | 'followup'>('assessment');
  const [crisisLevel, setCrisisLevel] = useState<'mild' | 'moderate' | 'severe' | null>(null);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleCrisisAssessment = (level: 'mild' | 'moderate' | 'severe') => {
    setCrisisLevel(level);
    
    // Log crisis event
    const crisisLog = JSON.parse(localStorage.getItem('crisis_log') || '[]');
    crisisLog.push({
      timestamp: Date.now(),
      level,
      notes: notes || 'Sin notas adicionales'
    });
    localStorage.setItem('crisis_log', JSON.stringify(crisisLog));

    if (level === 'severe') {
      setCurrentStep('resources');
      toast({
        title: '🚨 Situación crítica detectada',
        description: 'Por favor, considera buscar ayuda profesional inmediata.',
        duration: 10000,
      });
    } else if (level === 'moderate') {
      setCurrentStep('coping');
    } else {
      setCurrentStep('coping');
    }
  };

  const handleResourceUsed = (resource: CrisisResource) => {
    const resourceLog = JSON.parse(localStorage.getItem('resource_usage') || '[]');
    resourceLog.push({
      timestamp: Date.now(),
      resource: resource.name,
      type: resource.type
    });
    localStorage.setItem('resource_usage', JSON.stringify(resourceLog));

    toast({
      title: '📞 Recurso registrado',
      description: `Contacto con ${resource.name} registrado.`,
      duration: 5000,
    });
  };

  const DefaultTrigger = () => (
    <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
      <AlertTriangle className="w-4 h-4 mr-2" />
      Necesito apoyo ahora
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <DefaultTrigger />}
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Shield className="w-5 h-5" />
            Apoyo de Crisis
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'assessment' && (
          <div className="space-y-4">
            <Alert>
              <Heart className="w-4 h-4" />
              <AlertDescription>
                Tu seguridad y bienestar son lo más importante. Vamos a encontrar la ayuda que necesitas.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">¿Cómo te sientes en este momento?</h4>
              
              <Textarea
                placeholder="Comparte cómo te sientes (opcional, pero puede ayudarnos a darte mejor apoyo)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleCrisisAssessment('mild')}
                >
                  <div>
                    <div className="font-medium">Me siento abrumada pero segura</div>
                    <div className="text-sm text-muted-foreground">Necesito técnicas de calma</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleCrisisAssessment('moderate')}
                >
                  <div>
                    <div className="font-medium">Tengo pensamientos difíciles</div>
                    <div className="text-sm text-muted-foreground">Necesito apoyo y estrategias</div>
                  </div>
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleCrisisAssessment('severe')}
                >
                  <div>
                    <div className="font-medium">Estoy en crisis o peligro</div>
                    <div className="text-sm text-destructive-foreground">Necesito ayuda inmediata</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'resources' && (
          <div className="space-y-4">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <strong>Ayuda inmediata disponible:</strong> No estás sola. Hay profesionales listos para apoyarte.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {crisisResources.map((resource) => (
                <Card key={resource.name} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <resource.icon className="w-4 h-4 text-destructive" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{resource.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.available}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {resource.description}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            handleResourceUsed(resource);
                            if (resource.type === 'emergency' || resource.type === 'hotline') {
                              window.open(`tel:${resource.phone}`, '_self');
                            } else if (resource.type === 'chat') {
                              window.open(`https://${resource.phone}`, '_blank');
                            }
                          }}
                        >
                          {resource.type === 'emergency' || resource.type === 'hotline' ? (
                            <>
                              <Phone className="w-4 h-4 mr-2" />
                              Llamar {resource.phone}
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Abrir chat
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentStep('coping')}
            >
              También mostrar técnicas de calma
            </Button>
          </div>
        )}

        {currentStep === 'coping' && (
          <div className="space-y-4">
            <Alert>
              <Heart className="w-4 h-4" />
              <AlertDescription>
                Estas técnicas pueden ayudarte a sentirte más estable. Elige la que más te resuene.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {copingStrategies.map((strategy, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{strategy.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {strategy.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {strategy.description}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: '✨ Técnica iniciada',
                          description: `Comenzando: ${strategy.title}`,
                          duration: 3000,
                        });
                      }}
                    >
                      Empezar técnica
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setCurrentStep('resources')}
              >
                Ver recursos de apoyo profesional
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Me siento mejor, cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}