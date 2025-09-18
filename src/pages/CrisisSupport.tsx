import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/BackButton';
import { Avatar } from '@/components/Avatar';
import { 
  Shield, 
  Phone, 
  Heart,
  Clock,
  MapPin,
  ExternalLink,
  Info,
  Pause
} from 'lucide-react';

const emergencyContacts = [
  {
    number: '024',
    name: 'Línea de Atención al Suicidio',
    description: 'Apoyo emocional especializado 24/7',
    type: 'mental-health',
    available: '24 horas',
    free: true
  },
  {
    number: '112',
    name: 'Emergencias',
    description: 'Para situaciones de peligro inmediato',
    type: 'emergency',
    available: '24 horas',
    free: true
  }
];

const localResources = [
  {
    name: 'Teléfono de la Esperanza',
    description: 'Apoyo en crisis emocionales',
    contact: '717 003 717',
    hours: '24h',
    web: 'https://telefonodelaesperanza.org'
  },
  {
    name: 'SAPTEL',
    description: 'Sistema Nacional de Apoyo Psicológico',
    contact: '911 582 625',
    hours: '24h',
    web: 'https://saptel.org.mx'
  }
];

export default function CrisisSupport() {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingStep, setBreathingStep] = useState('inhale');

  const handleCall = (number: string) => {
    // Track crisis call
    const crisisEvent = {
      timestamp: new Date().toISOString(),
      action: `call_${number}`,
      type: 'crisis_action'
    };
    
    const existingEvents = JSON.parse(localStorage.getItem('crisisEvents') || '[]');
    existingEvents.push(crisisEvent);
    localStorage.setItem('crisisEvents', JSON.stringify(existingEvents));
    
    // Attempt to make call
    window.location.href = `tel:${number}`;
  };

  const startEmergencyBreathing = () => {
    setIsBreathing(true);
    let step = 0;
    const steps = ['inhale', 'hold', 'exhale', 'hold'];
    const durations = [4000, 4000, 4000, 4000]; // 4 seconds each
    
    const breathingCycle = () => {
      setBreathingStep(steps[step % 4]);
      step++;
      
      if (step < 20) { // 5 cycles
        setTimeout(breathingCycle, durations[(step - 1) % 4]);
      } else {
        setIsBreathing(false);
        setBreathingStep('complete');
      }
    };
    
    breathingCycle();
  };

  const getBreathingInstruction = () => {
    switch (breathingStep) {
      case 'inhale': return 'Inhala... 4 segundos';
      case 'hold': return 'Mantén... 4 segundos';
      case 'exhale': return 'Exhala... 4 segundos';
      case 'complete': return 'Respira normal. Estás bien.';
      default: return 'Respiremos juntas';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="text-red-700 font-semibold">Apoyo en Crisis</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            No estás sola
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Hay ayuda disponible ahora mismo. Tu vida tiene valor.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Emergency breathing */}
          <Card className="border-2 border-ochre-200 bg-gradient-to-r from-ochre-50 to-yellow-50">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className={`w-24 h-24 mx-auto rounded-full border-4 border-ochre-400 flex items-center justify-center transition-all duration-1000 ${
                  isBreathing ? 'scale-125' : 'scale-100'
                }`}>
                  <Heart className={`h-8 w-8 text-ochre-600 ${isBreathing ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isBreathing ? getBreathingInstruction() : 'Respiremos juntas 30 segundos'}
              </h3>
              
              <p className="text-muted-foreground mb-4">
                {isBreathing 
                  ? 'Sigue el ritmo. Estás segura.' 
                  : 'Mientras decides qué necesitas, vamos a respirar juntas'
                }
              </p>
              
              {!isBreathing && breathingStep !== 'complete' ? (
                <Button
                  onClick={startEmergencyBreathing}
                  className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Empezar respiración
                </Button>
              ) : breathingStep === 'complete' ? (
                <div className="text-center">
                  <p className="text-green-700 font-medium mb-3">
                    ✨ Bien hecho. ¿Te sientes un poco mejor?
                  </p>
                  <Button
                    onClick={() => {
                      setIsBreathing(false);
                      setBreathingStep('inhale');
                    }}
                    variant="outline"
                    className="border-ochre-300 text-ochre-700"
                  >
                    Repetir respiración
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Emergency contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground text-center">
              Ayuda profesional inmediata
            </h3>
            
            {emergencyContacts.map((contact) => (
              <Card 
                key={contact.number}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  contact.type === 'emergency' 
                    ? 'border-2 border-red-300 bg-gradient-to-r from-red-50 to-red-100'
                    : 'border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-100'
                }`}
                onClick={() => handleCall(contact.number)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        contact.type === 'emergency' 
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}>
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-2xl font-bold text-foreground">
                            {contact.number}
                          </h4>
                          {contact.free && (
                            <Badge variant="secondary" className="text-xs">
                              Gratuito
                            </Badge>
                          )}
                        </div>
                        <h5 className="font-semibold text-foreground mb-1">
                          {contact.name}
                        </h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          {contact.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{contact.available}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className={`${
                        contact.type === 'emergency' 
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white px-6 py-3 text-lg font-semibold`}
                    >
                      Llamar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional resources */}
          <Card className="border border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Recursos adicionales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {localResources.map((resource, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1">{resource.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono">{resource.contact}</span>
                      <Badge variant="outline" className="text-xs">
                        {resource.hours}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(resource.web, '_blank')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Web
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Important disclaimer */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <Shield className="h-12 w-12 text-amber-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">
                Aviso importante
              </h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                Esta aplicación no sustituye la atención médica o psicológica profesional. 
                Si sientes que tu vida está en peligro, llama inmediatamente al 112 o acude 
                al servicio de urgencias más cercano.
              </p>
            </CardContent>
          </Card>

          {/* Return actions */}
          <div className="text-center space-y-3">
            <Button
              onClick={() => navigate('/pausa-consciente')}
              className="w-full bg-gradient-brand text-white"
            >
              <Pause className="h-4 w-4 mr-2" />
              Hacer una pausa guiada
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}