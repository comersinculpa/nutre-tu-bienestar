import { useState } from 'react';
import { Button } from '@/components/ui/button';

const emotions = [
  { name: 'Alegría', color: 'bg-success', icon: '😊', category: 'positive' },
  { name: 'Gratitud', color: 'bg-warning', icon: '🙏', category: 'positive' },
  { name: 'Calma', color: 'bg-primary', icon: '😌', category: 'neutral' },
  { name: 'Curiosidad', color: 'bg-secondary', icon: '🤔', category: 'neutral' },
  { name: 'Tristeza', color: 'bg-accent', icon: '😢', category: 'difficult' },
  { name: 'Ansiedad', color: 'bg-warning', icon: '😰', category: 'difficult' },
  { name: 'Frustración', color: 'bg-destructive', icon: '😤', category: 'difficult' },
  { name: 'Culpa', color: 'bg-muted', icon: '😔', category: 'difficult' },
];

interface EmotionWheelProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion?: string;
}

export const EmotionWheel = ({ onEmotionSelect, selectedEmotion }: EmotionWheelProps) => {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-4 gap-3 p-6">
        {emotions.map((emotion) => (
          <Button
            key={emotion.name}
            variant="outline"
            className={`
              h-20 flex flex-col items-center justify-center gap-1 
              rounded-lg border-2 transition-all duration-300 hover:scale-105
              ${selectedEmotion === emotion.name 
                ? 'border-primary bg-primary/10 shadow-soft' 
                : 'border-border hover:border-primary/50 hover:shadow-card'
              }
              ${emotion.color} bg-opacity-10
            `}
            onClick={() => onEmotionSelect(emotion.name)}
            onMouseEnter={() => setHoveredEmotion(emotion.name)}
            onMouseLeave={() => setHoveredEmotion(null)}
          >
            <span className="text-2xl">{emotion.icon}</span>
            <span className="text-xs font-medium text-center leading-tight">
              {emotion.name}
            </span>
          </Button>
        ))}
      </div>
      
      {hoveredEmotion && (
        <div className="text-center mt-4 p-3 bg-secondary-soft rounded-lg">
          <p className="text-sm text-muted-foreground">
            Seleccionaste: <span className="font-medium text-foreground">{hoveredEmotion}</span>
          </p>
        </div>
      )}
    </div>
  );
};