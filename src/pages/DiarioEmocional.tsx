import { useState } from 'react';
import { EmotionWheel } from '@/components/EmotionWheel';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Save, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DiarioEmocional() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [diaryText, setDiaryText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleSaveEntry = () => {
    if (!selectedEmotion || !diaryText.trim()) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona una emoción y escribe algo en tu diario.",
        variant: "destructive",
      });
      return;
    }

    // Here would be the logic to save to backend
    toast({
      title: "Entrada guardada",
      description: "Tu registro emocional ha sido guardado con éxito.",
    });

    // Reset form
    setSelectedEmotion('');
    setDiaryText('');
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Here would be voice recording logic
    if (!isRecording) {
      toast({
        title: "Grabación iniciada",
        description: "Habla libremente, tu voz está siendo registrada.",
      });
    } else {
      toast({
        title: "Grabación finalizada",
        description: "Tu nota de voz ha sido guardada.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-6 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tu Espacio Seguro
          </h1>
          <p className="text-muted-foreground">
            Aquí puedes expresar tus pensamientos y emociones libremente
          </p>
        </div>

        <Avatar 
          mood="supportive" 
          message="Este es tu espacio seguro. Comparte lo que sientes sin juicios."
        />

        {/* Emotion Selection */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              ¿Cómo te sientes ahora?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionWheel 
              onEmotionSelect={setSelectedEmotion}
              selectedEmotion={selectedEmotion}
            />
          </CardContent>
        </Card>

        {/* Diary Entry */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">
              Cuéntame qué está pasando...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Escribe aquí tus pensamientos, preocupaciones, o cualquier cosa que quieras compartir. No hay respuestas correctas o incorrectas, solo tu verdad..."
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              className="min-h-32 resize-none bg-background/50 border-border focus:border-primary"
            />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceRecord}
                className={`flex-1 ${isRecording ? 'bg-destructive/10 border-destructive text-destructive' : ''}`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'Detener grabación' : 'Nota de voz'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Añadir foto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Previous Entries Preview */}
        <Card className="bg-secondary-soft shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Entradas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Ayer, 8:30 PM</span>
                  <span className="text-sm">😌 Calma</span>
                </div>
                <p className="text-sm text-foreground">
                  Hoy logré tomar una pausa antes de comer. Me sentí más consciente...
                </p>
              </div>
              
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Hace 2 días, 2:15 PM</span>
                  <span className="text-sm">😰 Ansiedad</span>
                </div>
                <p className="text-sm text-foreground">
                  Trabajo estresante hoy. Sentí ganas de comer impulsivamente pero...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSaveEntry}
            className="flex-1 bg-gradient-primary shadow-soft hover:shadow-warm transition-all duration-300"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Entrada
          </Button>
        </div>
      </div>
    </div>
  );
}