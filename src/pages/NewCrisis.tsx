import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Headphones, MessageCircle, Heart, Plus, Edit3 } from 'lucide-react';
import { BreathingAudioPlayer } from '@/components/BreathingAudioPlayer';
const crisisOptions = [{
  id: 'audio',
  title: 'Audio de calma rápida',
  description: 'Escucha 3 minutos de respiración guiada',
  icon: Headphones,
  color: 'bg-secondary',
  action: 'openAudio'
}, {
  id: 'chat',
  title: 'Escribir al bot de apoyo',
  description: 'Conversa con nuestro asistente de crisis',
  icon: MessageCircle,
  color: 'bg-warm-green',
  action: () => {
    // Aquí se abriría el chat de crisis
    console.log('Abrir chat de crisis');
  }
}];
export default function NewCrisis() {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [tempContact, setTempContact] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  // Cargar contacto de emergencia del localStorage
  useEffect(() => {
    const savedContact = localStorage.getItem('emergencyContact');
    if (savedContact) {
      setEmergencyContact(savedContact);
    }
  }, []);
  React.useEffect(() => {
    if (breathingActive) {
      const interval = setInterval(() => {
        setBreathPhase(current => {
          if (current === 'inhale') return 'hold';
          if (current === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [breathingActive]);
  const handleEmergencyCall = () => {
    if (emergencyContact) {
      // Realizar llamada directa
      window.location.href = `tel:${emergencyContact}`;
      // Vibración de confirmación
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } else {
      // Mostrar modal para configurar contacto
      setShowContactModal(true);
    }
  };
  const handleSaveContact = () => {
    if (tempContact.trim()) {
      const cleanedContact = tempContact.replace(/\D/g, ''); // Solo números
      setEmergencyContact(cleanedContact);
      localStorage.setItem('emergencyContact', cleanedContact);
      setTempContact('');
      setShowContactModal(false);

      // Vibración de éxito
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };
  const handleOptionClick = (option: typeof crisisOptions[0]) => {
    if (option.action === 'openAudio') {
      setShowAudioPlayer(true);
      return;
    }

    // Vibración de confirmación
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    if (typeof option.action === 'function') {
      option.action();
    }
  };
  const startBreathing = () => {
    setBreathingActive(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };
  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('inhale');
  };
  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Inhala profundamente...';
      case 'hold':
        return 'Mantén el aire...';
      case 'exhale':
        return 'Exhala lentamente...';
    }
  };

  return (
    <div className="min-h-screen bg-background-subpage pb-24">
      <div className="container mx-auto px-4 pt-8 space-y-8">
        {/* Header urgente pero calmado */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-crisis/10 text-crisis rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-medium text-foreground">
            Respira, estás segura
          </h1>
          <p className="text-slate-950">
            Aquí tienes apoyo inmediato. No estás sola.
          </p>
        </div>

        {/* Respiración de emergencia */}
        <Card className="card-soft bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-4 text-amber-950">Respiración de emergencia</h3>
            
            {!breathingActive ? <Button onClick={startBreathing} className="btn-primary mb-4">
                Comenzar respiración guiada
              </Button> : <div className="space-y-4">
                <div className={`w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto transition-all duration-4000 ${breathPhase === 'inhale' ? 'scale-110' : breathPhase === 'hold' ? 'scale-110' : 'scale-90'}`}>
                  <div className="w-12 h-12 bg-primary/40 rounded-full"></div>
                </div>
                
                <p className="text-lg font-medium text-primary">
                  {getBreathingInstruction()}
                </p>
                
                <Button onClick={stopBreathing} variant="outline" size="sm">
                  Detener
                </Button>
              </div>}
            
            <p className="text-sm text-slate-950">
              Enfócate solo en tu respiración por un momento
            </p>
          </CardContent>
        </Card>

        {/* Contacto de emergencia */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground text-center">
            ¿Qué necesitas ahora mismo?
          </h2>
          
          {/* Botón de llamada de emergencia */}
          <Card className="card-soft cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in" onClick={handleEmergencyCall}>
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">
                  {emergencyContact ? 'Llamar contacto de confianza' : 'Configurar contacto de emergencia'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {emergencyContact ? `Llamar a ${emergencyContact}` : 'Añade un número para llamadas de emergencia'}
                </p>
              </div>
              {emergencyContact && <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              setShowContactModal(true);
              setTempContact(emergencyContact);
            }} className="p-2">
                  <Edit3 size={16} />
                </Button>}
            </CardContent>
          </Card>
          
          {/* Otras opciones */}
          {crisisOptions.map((option, index) => {
          const Icon = option.icon;
          return <Card key={option.id} className="card-soft cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in" style={{
            animationDelay: `${(index + 1) * 100}ms`
          }} onClick={() => handleOptionClick(option)}>
                <CardContent className="flex items-center space-x-4 p-6">
                  <div className={`w-14 h-14 rounded-2xl ${option.color} text-white flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Números de emergencia */}
        <Card className="bg-crisis/5 border-crisis/20">
          <CardContent className="p-6">
            <h3 className="font-medium text-crisis mb-4 text-center">
              Líneas de crisis 24/7
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Teléfono de la Esperanza:</span>
                <a href="tel:717003717" className="text-crisis font-medium">
                  717 003 717
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Emergencias:</span>
                <a href="tel:112" className="text-crisis font-medium">
                  112
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de apoyo */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-slate-950">
              "Este momento difícil pasará. Eres más fuerte de lo que crees, 
              y mereces todo el cuidado y amor del mundo."
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal para configurar contacto de emergencia */}
      {showContactModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>Contacto de Emergencia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Número de teléfono de confianza
                </label>
                <Input type="tel" placeholder="Ej: +34 600 123 456" value={tempContact} onChange={e => setTempContact(e.target.value)} className="text-center text-lg" />
                <p className="text-xs text-muted-foreground text-center">
                  Este número se guardará de forma segura en tu dispositivo
                </p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => {
              setShowContactModal(false);
              setTempContact('');
            }} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleSaveContact} disabled={!tempContact.trim()} className="flex-1 btn-primary">
                  <Heart className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-xs text-primary text-center">
                  💡 Tip: Habla con esta persona previamente sobre ser tu contacto de emergencia
                </p>
              </div>
            </CardContent>
          </Card>
        </div>}

      {/* Audio Player Modal */}
      {showAudioPlayer && <BreathingAudioPlayer onClose={() => setShowAudioPlayer(false)} />}
    </div>
  );
}