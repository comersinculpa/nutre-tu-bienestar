import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Calendar } from 'lucide-react';

const emotions = [
  { emoji: '😊', name: 'Alegría', color: 'bg-slate-100 text-slate-800' },
  { emoji: '😢', name: 'Tristeza', color: 'bg-blue-100 text-blue-800' },
  { emoji: '😰', name: 'Ansiedad', color: 'bg-slate-100 text-slate-800' },
  { emoji: '😡', name: 'Enfado', color: 'bg-red-100 text-red-800' },
  { emoji: '😴', name: 'Cansancio', color: 'bg-purple-100 text-purple-800' },
  { emoji: '🤔', name: 'Confusión', color: 'bg-gray-100 text-gray-800' },
  { emoji: '😌', name: 'Calma', color: 'bg-green-100 text-green-800' },
];

const sampleEntries = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    emotion: { emoji: '😰', name: 'Ansiedad' },
    feeling: 'Me sentí abrumada después de la reunión de trabajo...',
    food: 'Comí chocolate, pero no por hambre',
  },
  {
    id: 2,
    date: '2024-01-14',
    time: '09:15',
    emotion: { emoji: '😌', name: 'Calma' },
    feeling: 'Desperté sintiendo paz. Hice mi rutina matutina.',
    food: 'Desayuné tranquila, escuchando a mi cuerpo',
  }
];

export default function NewDiario() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<typeof emotions[0] | null>(null);
  const [feelingText, setFeelingText] = useState('');
  const [foodText, setFoodText] = useState('');
  const [entries] = useState(sampleEntries);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  const handleSave = () => {
    if (selectedEmotion) {
      // Aquí se guardaría la entrada
      console.log({ emotion: selectedEmotion, feeling: feelingText, food: foodText });
      
      // Feedback visual y haptico
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      
      // Reset form
      setSelectedEmotion(null);
      setFeelingText('');
      setFoodText('');
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 pt-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-2xl font-medium text-foreground">Tu Diario Emocional</h1>
          <p className="text-muted-foreground">
            Pon en palabras lo que sientes, aunque sea una palabra
          </p>
        </div>

        {/* Botón principal */}
        <div className="flex justify-center py-6">
          <Button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full max-w-sm animate-scale-in"
          >
            <Plus size={20} className="mr-2" />
            Registrar emoción
          </Button>
        </div>

        {/* Timeline de entradas */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Tus registros recientes</h2>
          
          {entries.map((entry, index) => (
            <Card 
              key={entry.id}
              className="card-soft cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{entry.emotion.emoji}</span>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {entry.emotion.name}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar size={12} className="mr-1" />
                        {entry.date} • {entry.time}
                      </div>
                    </div>
                  </div>
                </div>
                
                {expandedEntry === entry.id && (
                  <div className="space-y-3 pt-3 border-t border-border/50 animate-fade-in">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Sensaciones:</p>
                      <p className="text-sm text-muted-foreground">{entry.feeling}</p>
                    </div>
                    {entry.food && (
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Comida:</p>
                        <p className="text-sm text-muted-foreground">{entry.food}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje de refuerzo */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-primary">
              "Tu diario es solo tuyo. No hay respuestas correctas, escribe lo que salga."
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal de registro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>¿Cómo te sientes?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selector de emociones */}
              <div className="grid grid-cols-4 gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.name}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      selectedEmotion?.name === emotion.name
                        ? 'bg-primary text-primary-foreground scale-105'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="text-2xl mb-1">{emotion.emoji}</div>
                    <div className="text-xs font-medium">{emotion.name}</div>
                  </button>
                ))}
              </div>

              {/* Campo de sensaciones */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Qué pasó o cómo lo sientes en tu cuerpo?
                </label>
                <Textarea
                  placeholder="Ej: Siento un nudo en el estómago, estoy preocupada por..."
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Campo opcional de comida */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  ¿Qué comiste o qué deseabas comer? (opcional)
                </label>
                <Textarea
                  placeholder="Ej: Comí galletas sin hambre, o deseaba algo dulce..."
                  value={foodText}
                  onChange={(e) => setFoodText(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!selectedEmotion}
                  className="flex-1 btn-primary"
                >
                  <Heart className="w-4 h-4 mr-2 animate-heart-beat" />
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}