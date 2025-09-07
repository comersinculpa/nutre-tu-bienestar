import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Heart, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrisisSupportProps {
  isVisible: boolean;
  onClose?: () => void;
}

const emergencyContacts = [
  {
    name: 'Teléfono de la Esperanza',
    number: '717 003 717',
    description: 'Atención emocional y prevención del suicidio',
    available: '24/7',
    type: 'phone'
  },
  {
    name: 'Fundación ANAR',
    number: '900 20 20 10',
    description: 'Ayuda para adultos y familias en crisis',
    available: '24/7',
    type: 'phone'
  },
  {
    name: 'Chat de Crisis',
    number: 'chat-crisis@ayuda.es',
    description: 'Apoyo inmediato por chat',
    available: 'Lun-Dom 10-22h',
    type: 'chat'
  }
];

const immediateTechniques = [
  {
    title: 'Respiración de Emergencia',
    description: 'Inhala 4 seg, mantén 4 seg, exhala 6 seg',
    duration: '2 min',
    action: 'breathing'
  },
  {
    title: 'Técnica 5-4-3-2-1',
    description: '5 cosas que ves, 4 que escuchas, 3 que tocas...',
    duration: '3 min',
    action: 'grounding'
  },
  {
    title: 'Llamar a un ser querido',
    description: 'Contacta con alguien de confianza',
    duration: 'Variable',
    action: 'contact'
  }
];

export const CrisisSupport = ({ isVisible, onClose }: CrisisSupportProps) => {
  const { toast } = useToast();

  if (!isVisible) return null;

  const handleEmergencyCall = (contact: typeof emergencyContacts[0]) => {
    if (contact.type === 'phone') {
      window.location.href = `tel:${contact.number}`;
    } else {
      window.location.href = `mailto:${contact.number}`;
    }
    
    toast({
      title: `Conectando con ${contact.name}`,
      description: "Te estamos poniendo en contacto con apoyo profesional",
      variant: "default"
    });
  };

  const handleImmediateTechnique = (technique: typeof immediateTechniques[0]) => {
    switch (technique.action) {
      case 'breathing':
        toast({
          title: "Respiración guiada iniciada",
          description: "Sigue las instrucciones: inhala 4, mantén 4, exhala 6",
        });
        break;
      case 'grounding':
        toast({
          title: "Técnica 5-4-3-2-1",
          description: "Identifica 5 cosas que ves alrededor tuyo...",
        });
        break;
      case 'contact':
        toast({
          title: "Contactar ser querido",
          description: "Es el momento de pedir apoyo a alguien cercano",
        });
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <Card className="bg-destructive/10 border-destructive rounded-b-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              Apoyo Inmediato Disponible
            </CardTitle>
            <p className="text-sm text-destructive/80">
              No estás sola. Hay personas esperando para ayudarte ahora mismo.
            </p>
          </CardHeader>
        </Card>

        {/* Emergency Contacts */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-destructive" />
              Contacto Inmediato
            </h3>
            
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{contact.available}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEmergencyCall(contact)}
                        className="bg-destructive hover:bg-destructive/90 ml-3"
                        size="sm"
                      >
                        {contact.type === 'phone' ? (
                          <>
                            <Phone className="w-4 h-4 mr-1" />
                            Llamar
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Immediate Techniques */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Técnicas Inmediatas
            </h3>
            
            <div className="space-y-2">
              {immediateTechniques.map((technique, index) => (
                <Card 
                  key={index} 
                  className="border-border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleImmediateTechnique(technique)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{technique.title}</h4>
                        <p className="text-xs text-muted-foreground">{technique.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {technique.duration}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Message */}
          <Card className="bg-primary/10 border-primary">
            <CardContent className="p-4">
              <p className="text-sm text-primary font-medium mb-2">
                💙 Recuerda: Esta crisis es temporal
              </p>
              <p className="text-xs text-primary/80">
                Los sentimientos intensos pasan. Cada momento que resistes es una victoria. 
                Tienes herramientas y personas que te apoyan.
              </p>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.location.href = '/pausa'}
              className="flex-1 bg-gradient-primary"
            >
              Ir a Pausa Guiada
            </Button>
            
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};