import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface EmotionalLog {
  emotion: string;
  intensity: number;
  context: string;
  food?: string;
  timestamp: Date;
}

class ChatbotService {
  private static instance: ChatbotService;
  private conversations: Map<string, ChatMessage[]> = new Map();

  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  async sendMessage(message: string, userId?: string): Promise<ChatMessage> {
    const sessionId = userId || 'anonymous';
    const conversation = this.conversations.get(sessionId) || [];

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    conversation.push(userMessage);

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chatbot-csc', {
        body: {
          messages: conversation.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId
        }
      });

      if (error) throw error;

      // Create assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        functionCall: data.functionCall
      };

      conversation.push(assistantMessage);
      this.conversations.set(sessionId, conversation);

      // Save to localStorage for persistence
      localStorage.setItem(`csc_chat_${sessionId}`, JSON.stringify(conversation));

      return assistantMessage;

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Lo siento, hay un problema técnico. ¿Podrías intentar de nuevo? Mientras tanto, recuerda que puedes respirar profundo. Estoy aquí para acompañarte. 💙',
        timestamp: new Date()
      };

      conversation.push(fallbackMessage);
      this.conversations.set(sessionId, conversation);

      return fallbackMessage;
    }
  }

  getConversation(userId?: string): ChatMessage[] {
    const sessionId = userId || 'anonymous';
    
    // Try to load from localStorage first
    const stored = localStorage.getItem(`csc_chat_${sessionId}`);
    if (stored) {
      try {
        const messages = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        this.conversations.set(sessionId, messages);
        return messages;
      } catch (e) {
        console.error('Error loading conversation:', e);
      }
    }

    return this.conversations.get(sessionId) || [];
  }

  clearConversation(userId?: string): void {
    const sessionId = userId || 'anonymous';
    this.conversations.delete(sessionId);
    localStorage.removeItem(`csc_chat_${sessionId}`);
  }

  // Emotional logging
  logEmotion(emotionData: Omit<EmotionalLog, 'timestamp'>): void {
    const log: EmotionalLog = {
      ...emotionData,
      timestamp: new Date()
    };

    const existingLogs = this.getEmotionalLogs();
    existingLogs.push(log);
    
    // Keep only last 50 logs
    const recentLogs = existingLogs.slice(-50);
    localStorage.setItem('csc_emotional_logs', JSON.stringify(recentLogs));
  }

  getEmotionalLogs(): EmotionalLog[] {
    const stored = localStorage.getItem('csc_emotional_logs');
    if (stored) {
      try {
        return JSON.parse(stored).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      } catch (e) {
        console.error('Error loading emotional logs:', e);
      }
    }
    return [];
  }

  // Get recent emotional patterns for context
  getRecentEmotionalContext(): string {
    const logs = this.getEmotionalLogs();
    const recent = logs.slice(-5); // Last 5 entries

    if (recent.length === 0) return '';

    const patterns = recent.map(log => 
      `${log.emotion} (${log.intensity}/10) - ${log.context}`
    ).join('; ');

    return `Contexto emocional reciente: ${patterns}`;
  }

  // Quick access methods for common interactions
  async startBreathingPause(): Promise<ChatMessage> {
    return this.sendMessage('Necesito hacer una pausa de respiración, me siento abrumada');
  }

  async requestCrisisSupport(): Promise<ChatMessage> {
    return this.sendMessage('Necesito ayuda urgente, me siento muy mal');
  }

  async logMealEmotion(emotion: string, intensity: number, context: string, food?: string): Promise<ChatMessage> {
    const message = `Quiero registrar que me siento ${emotion} (${intensity}/10) en el contexto de ${context}${food ? `. Estoy pensando en comer ${food}` : ''}`;
    return this.sendMessage(message);
  }
}

export const chatbotService = ChatbotService.getInstance();
