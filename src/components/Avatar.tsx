import { useState } from 'react';
import avatarImage from '@/assets/avatar-companion.jpg';

interface AvatarProps {
  message?: string;
  mood?: 'supportive' | 'encouraging' | 'calming' | 'celebrating';
}

const moodMessages = {
  supportive: [
    "Estoy aquí contigo. Respira profundo.",
    "Tus sentimientos son válidos. Te acompaño.",
    "Este momento pasará. Eres más fuerte de lo que crees."
  ],
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
  ]
};

export const Avatar = ({ message, mood = 'supportive' }: AvatarProps) => {
  const [currentMessage, setCurrentMessage] = useState(
    message || moodMessages[mood][0]
  );

  const getRandomMessage = () => {
    const messages = moodMessages[mood];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-card rounded-lg shadow-card">
      <div 
        className="w-16 h-16 rounded-full overflow-hidden shadow-soft cursor-pointer hover:shadow-warm transition-all duration-300"
        onClick={getRandomMessage}
      >
        <img 
          src={avatarImage} 
          alt="Tu compañera de bienestar" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          Tu compañera de bienestar
        </p>
        <p className="text-foreground leading-relaxed">
          {currentMessage}
        </p>
      </div>
    </div>
  );
};