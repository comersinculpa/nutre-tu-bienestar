import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, Video, MoreHorizontal, Paperclip, Smile, Heart, Pause, FileText, AlertTriangle, Shield, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { chatbotService, type ChatMessage } from '@/services/chatbotService';

// Using ChatMessage from chatbotService instead of local interface

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  responseTime: string;
}

const TherapistChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [therapist] = useState<Therapist>({
    id: 'support-assistant',
    name: '¿En qué puedo ayudarte?',
    specialization: 'Apoyo emocional disponible',
    avatar: '/avatars/support.jpg',
    isOnline: true,
    responseTime: '< 4 horas'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load conversation on mount
    const conversation = chatbotService.getConversation();
    if (conversation.length === 0) {
      // Initialize with welcome messages
      const welcomeMessages: ChatMessage[] = [
        {
          id: '1',
          role: 'assistant',
          content: '¡Hola! Soy tu Acompañante CSC de comersinculpa.blog. Estoy aquí para apoyarte sin juicio. ¿Cómo te sientes hoy?',
          timestamp: new Date()
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Puedes hablarme sobre tus emociones, pedirme una pausa si sientes urgencia de comer, o simplemente compartir cómo ha sido tu día. Todo es válido aquí. 💙',
          timestamp: new Date()
        }
      ];
      setMessages(welcomeMessages);
    } else {
      setMessages(conversation);
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageToSend = newMessage;
    setNewMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Add user message to local state immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageToSend,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      
      // Send to chatbot service and get response
      const response = await chatbotService.sendMessage(messageToSend);
      
      // Add assistant response
      setMessages(prev => [...prev, response]);
      
      toast.success("Mensaje enviado");
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Error al enviar mensaje");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Quick action buttons
  const handleQuickAction = async (action: string) => {
    const quickMessages = {
      breathing: "Necesito hacer una pausa de respiración, me siento abrumada",
      crisis: "Necesito ayuda urgente, me siento muy mal",
      log_emotion: "Quiero registrar cómo me siento ahora",
      after_binge: "Acabo de tener un atracón y necesito cuidarme"
    };

    if (quickMessages[action as keyof typeof quickMessages]) {
      setNewMessage(quickMessages[action as keyof typeof quickMessages]);
      await sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: Date) => {
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
      <Card className="bg-gradient-card border-0 shadow-card">
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
                <span className="text-xs text-muted-foreground">
                  Acompañante especializado en TCA • Respuesta inmediata
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                IA Segura
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="flex-1 space-y-4 p-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div 
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.functionCall && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {message.functionCall.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg p-3 max-w-xs">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      Escribiendo...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-border">
            <div className="flex gap-2 mb-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickAction('breathing')}
                className="text-xs"
                disabled={isLoading}
              >
                <Pause className="h-3 w-3 mr-1" />
                Pausa
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickAction('log_emotion')}
                className="text-xs"
                disabled={isLoading}
              >
                <Heart className="h-3 w-3 mr-1" />
                Registrar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickAction('crisis')}
                className="text-xs"
                disabled={isLoading}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Crisis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickAction('after_binge')}
                className="text-xs"
                disabled={isLoading}
              >
                <FileText className="h-3 w-3 mr-1" />
                Post-atracón
              </Button>
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isLoading ? "Escribiendo..." : "Escribe tu mensaje..."}
                className="flex-1"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <Button 
                onClick={sendMessage} 
                size="sm"
                disabled={isLoading || !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Conversación privada y segura</span>
              <div className="ml-auto flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{messages.length} mensajes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistChat;