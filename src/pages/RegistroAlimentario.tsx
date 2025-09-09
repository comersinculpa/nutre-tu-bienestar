import { useState } from 'react';
import { Avatar } from '@/components/Avatar';
import { EmotionWheel } from '@/components/EmotionWheel';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextualRecommendations } from '@/components/ContextualRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Save, Camera, Clock, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmotionalAnalysis } from '@/hooks/useEmotionalAnalysis';

export default function RegistroAlimentario() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState([5]);
  const [hungerLevel, setHungerLevel] = useState([5]);
  const [foodItems, setFoodItems] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<string>('');
  const [foodAnalysis, setFoodAnalysis] = useState<any>(null);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<any>(null);
  const [showFoodUpload, setShowFoodUpload] = useState(false);
  
  const { toast } = useToast();
  const { analyzeText, isAnalyzing } = useEmotionalAnalysis();

  const handleSaveEntry = async () => {
    if (!selectedEmotion || (!foodItems.trim() && !foodAnalysis)) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona una emoción y registra qué comiste.",
        variant: "destructive",
      });
      return;
    }

    // Analyze emotional state and notes
    const analysis = await analyzeText(notes, selectedEmotion);
    setEmotionalAnalysis(analysis);

    // Create complete registry entry
    const entryData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      emotion: selectedEmotion,
      emotionIntensity: emotionIntensity[0],
      hungerLevel: hungerLevel[0],
      foods: foodItems || (foodAnalysis?.foods?.join(', ') || ''),
      foodCategory: foodAnalysis?.category || 'no-categorizada',
      location,
      notes,
      emotionalAnalysis: analysis,
      foodAnalysis,
      hasEmotionalTrigger: foodAnalysis?.emotionalTrigger || false
    };

    // Save to localStorage
    const existingEntries = JSON.parse(localStorage.getItem('foodEntries') || '[]');
    const updatedEntries = [entryData, ...existingEntries];
    localStorage.setItem('foodEntries', JSON.stringify(updatedEntries));

    toast({
      title: "Registro guardado",
      description: "Tu registro alimentario y emocional ha sido guardado con análisis completo.",
    });
  };

  const handleFoodImageAnalysis = (result: any) => {
    setFoodAnalysis(result);
    setFoodItems(result.foods.join(', '));
    
    toast({
      title: `Comida detectada: ${result.foods.join(', ')}`,
      description: `Categoría: ${result.category}${result.emotionalTrigger ? ' - Posible disparador emocional' : ''}`,
    });
  };

  const canSubmit = selectedEmotion && (foodItems.trim() || foodAnalysis);
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-6 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Registro Alimentario
          </h1>
          <p className="text-muted-foreground">
            Conecta con tus emociones y patrones alimentarios
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
        </div>

        <Avatar 
          mood="supportive" 
          message="Registremos juntas este momento. Sin juicios, solo observación consciente."
        />

        {/* Emotion Selection */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg text-center">
              ¿Cómo te sientes antes/durante/después de comer?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionWheel 
              onEmotionSelect={setSelectedEmotion}
              selectedEmotion={selectedEmotion}
            />
            
            {selectedEmotion && (
              <div className="mt-4 space-y-3">
                <Label className="text-sm font-medium">
                  Intensidad de {selectedEmotion}: {emotionIntensity[0]}/10
                </Label>
                <Slider
                  value={emotionIntensity}
                  onValueChange={setEmotionIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hunger Level */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">
              Nivel de hambre física: {hungerLevel[0]}/10
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={hungerLevel}
              onValueChange={setHungerLevel}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Nada de hambre</span>
              <span>Hambre extrema</span>
            </div>
          </CardContent>
        </Card>

        {/* Food Registration */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">¿Qué comiste?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Alimentos (describe o usa la cámara)</Label>
              <Input
                placeholder="Ej: Ensalada, pollo, chocolate, etc."
                value={foodItems}
                onChange={(e) => setFoodItems(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFoodUpload(!showFoodUpload)}
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              {showFoodUpload ? 'Ocultar cámara' : 'Tomar foto de la comida'}
            </Button>

            {showFoodUpload && (
              <ImageUpload 
                type="food"
                onAnalysisComplete={handleFoodImageAnalysis}
              />
            )}

            {foodAnalysis && (
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  Análisis de comida:
                </p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Alimentos:</span> {foodAnalysis.foods.join(', ')}</p>
                  <p><span className="text-muted-foreground">Categoría:</span> {foodAnalysis.category}</p>
                  {foodAnalysis.emotionalTrigger && (
                    <p className="text-warning font-medium">⚠️ Posible disparador emocional</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location and Context */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contexto del momento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>¿Dónde estás? (opcional)</Label>
              <Input
                placeholder="Ej: Casa, trabajo, restaurante..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Notas adicionales</Label>
              <Textarea
                placeholder="¿Qué estaba pasando? ¿Cómo te sentías? ¿Había algún disparador?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-20 resize-none bg-background/50 border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contextual Recommendations */}
        {emotionalAnalysis && (
          <ContextualRecommendations />
        )}

        {/* Food Analysis Suggestions */}
        {foodAnalysis?.suggestions && (
          <Card className="bg-secondary-soft shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Sugerencias nutricionales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {foodAnalysis.suggestions.map((suggestion: string, index: number) => (
                  <p key={index} className="text-sm text-foreground">
                    • {suggestion}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSaveEntry}
            disabled={!canSubmit || isAnalyzing}
            className="flex-1 bg-gradient-primary shadow-soft hover:shadow-warm transition-all duration-300"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isAnalyzing ? 'Analizando...' : 'Guardar Registro'}
          </Button>
        </div>
      </div>
    </div>
  );
}