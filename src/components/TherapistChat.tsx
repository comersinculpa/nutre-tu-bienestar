import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, Shield, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderType: 'patient' | 'therapist';
  content: string;
  timestamp: number;
  isRead: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  encrypted: boolean;
}

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: number;
  responseTime: string;
}

export const TherapistChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [therapist] = useState<Therapist>({
    id: 'support-assistant',
    name: '¿En qué puedo ayudarte?',
    specialization: 'Apoyo emocional disponible',
    avatar: '/avatars/support.jpg',
    isOnline: true,
    responseTime: '< 4 horas'
  });
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    simulateTherapistResponse();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = localStorage.getItem('therapistMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Mensajes de ejemplo iniciales
      const initialMessages: Message[] = [
        {
          id: '1',
          senderId: 'therapist-001',
          senderType: 'therapist',
          content: 'Hola! Soy la Dra. Elena Martínez. Estoy aquí para acompañarte en tu proceso de recuperación. ¿Cómo te sientes hoy?',
          timestamp: Date.now() - 3600000,
          isRead: true,
          encrypted: true
        },
        {
          id: '2',
          senderId: 'patient',
          senderType: 'patient',
          content: 'Hola doctora, gracias por estar disponible. Hoy ha sido un día difícil para mí.',
          timestamp: Date.now() - 3000000,
          isRead: true,
          encrypted: true
        }
      ];
      setMessages(initialMessages);
      localStorage.setItem('therapistMessages', JSON.stringify(initialMessages));
    }
  };

  const saveMessages = (updatedMessages: Message[]) => {
    localStorage.setItem('therapistMessages', JSON.stringify(updatedMessages));
    setMessages(updatedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'patient',
      senderType: 'patient',
      content: newMessage,
      timestamp: Date.now(),
      isRead: false,
      encrypted: true
    };

    const updatedMessages = [...messages, message];
    saveMessages(updatedMessages);
    setNewMessage('');

    // Simular respuesta del terapeuta
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        simulateTherapistResponse(newMessage);
        setIsTyping(false);
      }, 2000);
    }, 1000);

    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado de forma segura a tu terapeuta.",
    });
  };

  const simulateTherapistResponse = (userMessage?: string) => {
    const responses = [
      "Entiendo cómo te sientes. Es normal tener días difíciles durante el proceso de recuperación. ¿Puedes contarme más sobre lo que específicamente te está costando hoy?",
      "Gracias por compartir eso conmigo. Tu honestidad es muy valiosa para tu proceso. ¿Has podido practicar alguna de las técnicas que hemos discutido?",
      "Me alegra saber que estás utilizando estas herramientas. Recuerda que cada pequeño paso cuenta. ¿Cómo te sientes después de completar tu registro de hoy?",
      "Es completamente comprensible que sientas eso. La recuperación no es lineal, y está bien tener momentos de dificultad. ¿Te gustaría que programemos una sesión adicional esta semana?",
      "Veo que has estado muy constante con tus registros. Eso habla muy bien de tu compromiso con la recuperación. ¿Hay algo específico en lo que te gustaría que nos enfoquemos en nuestra próxima sesión?"
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    setTimeout(() => {
      const therapistMessage: Message = {
        id: Date.now().toString(),
        senderId: therapist.id,
        senderType: 'therapist',
        content: response,
        timestamp: Date.now(),
        isRead: false,
        encrypted: true
      };

      const updatedMessages = [...messages, therapistMessage];
      saveMessages(updatedMessages);
    }, 3000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-card border-0 shadow-card rounded-b-none">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={therapist.avatar} alt="Asistente de apoyo" />
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                💚
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{therapist.name}</h3>
                {therapist.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Responde en {therapist.responseTime}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Seguro
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 bg-gradient-card border-0 shadow-card rounded-none border-t-0">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const isNewDay = index === 0 || 
                formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
              
              return (
                <div key={message.id}>
                  {isNewDay && (
                    <div className="text-center my-4">
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        {formatDate(message.timestamp)}
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`flex ${message.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${message.senderType === 'patient' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.senderType === 'patient'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            message.senderType === 'patient' 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {message.encrypted && (
                            <Shield className={`w-3 h-3 ${
                              message.senderType === 'patient' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {therapist.name} está escribiendo...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="bg-gradient-card border-0 shadow-card rounded-t-none border-t-0">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí... Recuerda que esta conversación está cifrada y es confidencial."
              className="min-h-[60px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || isTyping}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Conversación cifrada de extremo a extremo</span>
            <div className="ml-auto flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{messages.length} mensajes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};