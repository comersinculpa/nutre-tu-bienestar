import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import avatarImage from '@/assets/avatar-companion.jpg';

interface EnhancedAvatarProps {
  message?: string;
  mood?: 'supportive' | 'encouraging' | 'calming' | 'celebrating' | 'concerned' | 'crisis';
  userEmotion?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  onInteraction?: () => void;
}

const contextualMessages = {
  supportive: {
    default: [
      "Estoy aquí contigo. Respira profundo.",
      "Tus sentimientos son válidos. Te acompaño.",
      "Este momento pasará. Eres más fuerte de lo que crees."
    ],
    morning: [
      "Buenos días. ¿Cómo empezamos este día con cariño hacia ti?",
      "Un nuevo día es una nueva oportunidad para cuidarte.",
      "Empecemos el día recordando tu fortaleza interior."
    ],
    evening: [
      "¿Cómo ha sido tu día? Estoy aquí para escucharte.",
      "Es momento de hacer balance del día con compasión.",
      "Reconozcamos todo lo que has logrado hoy."
    ]
  },
  encouraging: [
    "¡Cada pequeño paso cuenta! Estás progresando.",
    "Me enorgullece ver cómo te cuidas cada día.",
    "Confío en ti. Puedes con esto y más."
  ],
  calming: [
    "Vamos a tomarnos un momento para respirar juntos.",
    "Encuentra tu tranquilidad. No hay prisa.",
    "Tu bienestar es lo más importante ahora."
  ],
  celebrating: [
    "¡Qué maravilloso progreso! Te felicito.",
    "¡Lo lograste! Estoy muy orgullosa de ti.",
    "Tu dedicación está dando frutos. ¡Sigue así!"
  ],
  concerned: [
    "He notado que podrías estar pasando por un momento difícil.",
    "Tu bienestar me importa. ¿Podemos hablar de cómo te sientes?",
    "Reconozco que las cosas pueden estar siendo complicadas ahora."
  ],
  crisis: [
    "Quiero que sepas que no estás sola en este momento.",
    "Tu seguridad es lo más importante. Busquemos ayuda juntas.",
    "Este dolor que sientes es temporal. Hay apoyo disponible para ti."
  ]
};

const emotionalResponses = {
  ansiedad: "Siento tu ansiedad. Vamos a encontrar calma juntas.",
  tristeza: "Es válido sentir tristeza. Te acompaño en este momento.",
  culpa: "La culpa es pesada, pero no define quién eres. Eres valiosa.",
  alegría: "¡Me encanta verte así! Celebremos este momento contigo.",
  calma: "Qué hermoso verte en paz. Mantengamos esta serenidad.",
  ira: "Entiendo tu enojo. Es una emoción válida que podemos explorar.",
  miedo: "El miedo puede ser abrumador. Estoy aquí contigo para atravesarlo."
};

const riskResponses = {
  high: [
    "He notado señales que me preocupan. Tu seguridad es prioridad.",
    "Quiero asegurarme de que tengas todo el apoyo que necesitas ahora.",
    "No tienes que enfrentar esto sola. Hay ayuda disponible inmediatamente."
  ],
  medium: [
    "Veo que podrías necesitar apoyo extra hoy.",
    "Reconozco que las cosas pueden estar siendo desafiantes.",
    "Cuidemos especialmente de ti en este momento."
  ],
  low: [
    "Me alegra ver que estás en un buen lugar emocional.",
    "Tu estabilidad emocional es algo hermoso de observar.",
    "Sigues cuidándote tan bien. Estoy orgullosa."
  ]
};

export const EnhancedAvatar = ({ 
  message, 
  mood = 'supportive', 
  userEmotion,
  riskLevel,
  timeOfDay,
  onInteraction 
}: EnhancedAvatarProps) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [avatarMood, setAvatarMood] = useState(mood);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine current time of day if not provided
  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getContextualMessage = () => {
    // Priority 1: Crisis or high risk
    if (riskLevel === 'high') {
      return riskResponses.high[Math.floor(Math.random() * riskResponses.high.length)];
    }

    // Priority 2: Custom message
    if (message) return message;

    // Priority 3: Emotion-based response
    if (userEmotion && emotionalResponses[userEmotion as keyof typeof emotionalResponses]) {
      return emotionalResponses[userEmotion as keyof typeof emotionalResponses];
    }

    // Priority 4: Risk level response
    if (riskLevel && riskResponses[riskLevel]) {
      return riskResponses[riskLevel][Math.floor(Math.random() * riskResponses[riskLevel].length)];
    }

    // Priority 5: Time-based contextual message
    const time = timeOfDay || getCurrentTimeOfDay();
    if (mood === 'supportive' && contextualMessages.supportive[time as keyof typeof contextualMessages.supportive]) {
      const timeMessages = contextualMessages.supportive[time as keyof typeof contextualMessages.supportive];
      return Array.isArray(timeMessages) 
        ? timeMessages[Math.floor(Math.random() * timeMessages.length)]
        : timeMessages;
    }

    // Priority 6: Default mood message
    const moodMessages = contextualMessages[mood as keyof typeof contextualMessages];
    if (Array.isArray(moodMessages)) {
      return moodMessages[Math.floor(Math.random() * moodMessages.length)];
    }

    return contextualMessages.supportive.default[0];
  };

  useEffect(() => {
    // Adjust avatar mood based on risk level
    if (riskLevel === 'high') {
      setAvatarMood('crisis');
    } else if (riskLevel === 'medium') {
      setAvatarMood('concerned');
    } else {
      setAvatarMood(mood);
    }

    setCurrentMessage(getContextualMessage());
  }, [mood, userEmotion, riskLevel, timeOfDay, message]);

  const handleAvatarClick = () => {
    setIsAnimating(true);
    setCurrentMessage(getContextualMessage());
    onInteraction?.();
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getAvatarBorderColor = () => {
    switch (avatarMood) {
      case 'crisis': return 'border-destructive shadow-destructive/20';
      case 'concerned': return 'border-warning shadow-warning/20';
      case 'celebrating': return 'border-success shadow-success/20';
      case 'calming': return 'border-primary shadow-primary/20';
      default: return 'border-primary/30 shadow-primary/10';
    }
  };

  const getCardBackground = () => {
    switch (avatarMood) {
      case 'crisis': return 'bg-gradient-warm border-l-4 border-l-destructive';
      case 'concerned': return 'bg-gradient-warm border-l-4 border-l-warning';
      case 'celebrating': return 'bg-gradient-warm border-l-4 border-l-success';
      default: return 'bg-gradient-card';
    }
  };

  return (
    <Card className={`${getCardBackground()} shadow-card border-0`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div 
            className={`
              w-16 h-16 rounded-full overflow-hidden border-2 cursor-pointer 
              transition-all duration-300 hover:scale-105
              ${getAvatarBorderColor()}
              ${isAnimating ? 'scale-110' : ''}
            `}
            onClick={handleAvatarClick}
          >
            <img 
              src={avatarImage} 
              alt="Tu compañera de bienestar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {avatarMood === 'crisis' ? 'Apoyo inmediato' : 'Tu compañera de bienestar'}
            </p>
            <p className={`
              leading-relaxed transition-all duration-300
              ${avatarMood === 'crisis' ? 'text-destructive font-medium' : 'text-foreground'}
              ${avatarMood === 'concerned' ? 'text-warning' : ''}
              ${avatarMood === 'celebrating' ? 'text-success font-medium' : ''}
            `}>
              {currentMessage}
            </p>
            
            {riskLevel === 'high' && (
              <p className="text-xs text-destructive/80 mt-2 italic">
                Toca mi imagen si necesitas palabras de apoyo adicionales
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};