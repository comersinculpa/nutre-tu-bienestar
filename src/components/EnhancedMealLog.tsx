import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ImageUpload } from '@/components/ImageUpload';
import { 
  Camera, 
  Heart, 
  Clock, 
  MapPin, 
  Users, 
  Thermometer,
  AlertCircle,
  TrendingUp,
  Calendar,
  Utensils,
  Brain,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MealEntry {
  id: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  portions: { [key: string]: number };
  photos: string[];
  emotions: {
    before: { emotion: string; intensity: number; };
    after: { emotion: string; intensity: number; };
  };
  physicalSensations: {
    hunger: number;
    fullness: number;
    satisfaction: number;
  };
  context: {
    location: string;
    company: string;
    environment: string;
    triggers: string[];
  };
  thoughts: {
    before: string;
    during: string;
    after: string;
  };
  behaviors: {
    eatingSpeed: number;
    mindfulness: number;
    distractions: string[];
  };
  challenges: string[];
  victories: string[];
  notes: string;
  timestamp: number;
}

const emotionOptions = [
  { value: 'tranquilo', label: 'Tranquilo/a', icon: Smile, color: 'text-green-500' },
  { value: 'ansioso', label: 'Ansioso/a', icon: Frown, color: 'text-yellow-500' },
  { value: 'triste', label: 'Triste', icon: Frown, color: 'text-blue-500' },
  { value: 'estresado', label: 'Estresado/a', icon: Frown, color: 'text-red-500' },
  { value: 'feliz', label: 'Feliz', icon: Smile, color: 'text-green-500' },
  { value: 'neutral', label: 'Neutral', icon: Meh, color: 'text-gray-500' },
  { value: 'culpable', label: 'Culpable', icon: Frown, color: 'text-purple-500' },
  { value: 'satisfecho', label: 'Satisfecho/a', icon: Smile, color: 'text-green-500' }
];

const mealTypes = [
  { value: 'breakfast', label: 'Desayuno', icon: '🌅' },
  { value: 'lunch', label: 'Almuerzo', icon: '☀️' },
  { value: 'dinner', label: 'Cena', icon: '🌙' },
  { value: 'snack', label: 'Merienda', icon: '🍎' }
];

export const EnhancedMealLog: React.FC = () => {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<MealEntry>>({
    type: 'lunch',
    foods: [],
    photos: [],
    emotions: {
      before: { emotion: 'neutral', intensity: 5 },
      after: { emotion: 'neutral', intensity: 5 }
    },
    physicalSensations: {
      hunger: 5,
      fullness: 5,
      satisfaction: 5
    },
    context: {
      location: '',
      company: '',
      environment: '',
      triggers: []
    },
    thoughts: {
      before: '',
      during: '',
      after: ''
    },
    behaviors: {
      eatingSpeed: 5,
      mindfulness: 5,
      distractions: []
    },
    challenges: [],
    victories: [],
    notes: ''
  });
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const storedEntries = localStorage.getItem('enhancedMealLog');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  };

  const saveEntry = () => {
    if (!currentEntry.foods || currentEntry.foods.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, añade al menos un alimento.",
        variant: "destructive"
      });
      return;
    }

    const entry: MealEntry = {
      ...currentEntry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    } as MealEntry;

    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    localStorage.setItem('enhancedMealLog', JSON.stringify(updatedEntries));

    // Reset form
    setCurrentEntry({
      type: 'lunch',
      foods: [],
      photos: [],
      emotions: {
        before: { emotion: 'neutral', intensity: 5 },
        after: { emotion: 'neutral', intensity: 5 }
      },
      physicalSensations: {
        hunger: 5,
        fullness: 5,
        satisfaction: 5
      },
      context: {
        location: '',
        company: '',
        environment: '',
        triggers: []
      },
      thoughts: {
        before: '',
        during: '',
        after: ''
      },
      behaviors: {
        eatingSpeed: 5,
        mindfulness: 5,
        distractions: []
      },
      challenges: [],
      victories: [],
      notes: ''
    });

    setActiveTab('basic');

    toast({
      title: "Registro guardado",
      description: "Tu entrada ha sido guardada exitosamente.",
    });
  };

  const addFood = (food: string) => {
    if (food.trim()) {
      setCurrentEntry(prev => ({
        ...prev,
        foods: [...(prev.foods || []), food.trim()]
      }));
    }
  };

  const removeFood = (index: number) => {
    setCurrentEntry(prev => ({
      ...prev,
      foods: prev.foods?.filter((_, i) => i !== index) || []
    }));
  };

  const updateEmotion = (timing: 'before' | 'after', field: 'emotion' | 'intensity', value: string | number) => {
    setCurrentEntry(prev => ({
      ...prev,
      emotions: {
        ...prev.emotions,
        [timing]: {
          ...prev.emotions?.[timing],
          [field]: value
        }
      }
    }));
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionData = emotionOptions.find(e => e.value === emotion);
    return emotionData ? emotionData.icon : Meh;
  };

  const getEmotionColor = (emotion: string) => {
    const emotionData = emotionOptions.find(e => e.value === emotion);
    return emotionData ? emotionData.color : 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-background-subpage pb-20">
      <div className="px-6 py-4">
        <div className="mb-6 pt-4">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Registro Alimentario Inteligente
          </h1>
          <p className="text-muted-foreground">
            Documenta tu experiencia alimentaria completa con contexto emocional
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="basic" className="text-xs">Básico</TabsTrigger>
            <TabsTrigger value="emotions" className="text-xs">Emociones</TabsTrigger>
            <TabsTrigger value="context" className="text-xs">Contexto</TabsTrigger>
            <TabsTrigger value="reflection" className="text-xs">Reflexión</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tipo de Comida */}
                <div className="space-y-2">
                  <Label>Tipo de Comida</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mealTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={currentEntry.type === type.value ? 'default' : 'outline'}
                        onClick={() => setCurrentEntry(prev => ({ ...prev, type: type.value as any }))}
                        className="justify-start"
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Alimentos */}
                <div className="space-y-2">
                  <Label>Alimentos Consumidos</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Añadir alimento..."
                        className="flex-1 px-3 py-2 border rounded-md"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addFood(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Añadir alimento..."]') as HTMLInputElement;
                          if (input) {
                            addFood(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        Añadir
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {currentEntry.foods?.map((food, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeFood(index)}
                        >
                          {food} ✕
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fotos */}
                <div className="space-y-2">
                  <Label>Fotos de la Comida (Opcional)</Label>
                  <ImageUpload
                    type="food"
                    onAnalysisComplete={(result) => {
                      if (result.imageUrl) {
                        setCurrentEntry(prev => ({
                          ...prev,
                          photos: [...(prev.photos || []), result.imageUrl]
                        }));
                      }
                    }}
                    className="w-full h-32"
                  />
                  {currentEntry.photos && currentEntry.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {currentEntry.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Comida ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Estado Emocional y Físico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emociones Antes */}
                <div className="space-y-3">
                  <Label>¿Cómo te sentías ANTES de comer?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotionOptions.map((emotion) => {
                      const Icon = emotion.icon;
                      return (
                        <Button
                          key={emotion.value}
                          variant={currentEntry.emotions?.before.emotion === emotion.value ? 'default' : 'outline'}
                          onClick={() => updateEmotion('before', 'emotion', emotion.value)}
                          className="justify-start"
                        >
                          <Icon className={`w-4 h-4 mr-2 ${emotion.color}`} />
                          {emotion.label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Intensidad (1-10)</Label>
                    <Slider
                      value={[currentEntry.emotions?.before.intensity || 5]}
                      onValueChange={(value) => updateEmotion('before', 'intensity', value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      {currentEntry.emotions?.before.intensity || 5}/10
                    </div>
                  </div>
                </div>

                {/* Sensaciones Físicas */}
                <div className="space-y-4">
                  <Label>Sensaciones Físicas</Label>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Nivel de Hambre (1-10)</Label>
                      <Slider
                        value={[currentEntry.physicalSensations?.hunger || 5]}
                        onValueChange={(value) => setCurrentEntry(prev => ({
                          ...prev,
                          physicalSensations: { ...prev.physicalSensations!, hunger: value[0] }
                        }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {currentEntry.physicalSensations?.hunger || 5}/10
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Sensación de Saciedad (1-10)</Label>
                      <Slider
                        value={[currentEntry.physicalSensations?.fullness || 5]}
                        onValueChange={(value) => setCurrentEntry(prev => ({
                          ...prev,
                          physicalSensations: { ...prev.physicalSensations!, fullness: value[0] }
                        }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {currentEntry.physicalSensations?.fullness || 5}/10
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Satisfacción General (1-10)</Label>
                      <Slider
                        value={[currentEntry.physicalSensations?.satisfaction || 5]}
                        onValueChange={(value) => setCurrentEntry(prev => ({
                          ...prev,
                          physicalSensations: { ...prev.physicalSensations!, satisfaction: value[0] }
                        }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {currentEntry.physicalSensations?.satisfaction || 5}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emociones Después */}
                <div className="space-y-3">
                  <Label>¿Cómo te sientes DESPUÉS de comer?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotionOptions.map((emotion) => {
                      const Icon = emotion.icon;
                      return (
                        <Button
                          key={emotion.value}
                          variant={currentEntry.emotions?.after.emotion === emotion.value ? 'default' : 'outline'}
                          onClick={() => updateEmotion('after', 'emotion', emotion.value)}
                          className="justify-start"
                        >
                          <Icon className={`w-4 h-4 mr-2 ${emotion.color}`} />
                          {emotion.label}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Intensidad (1-10)</Label>
                    <Slider
                      value={[currentEntry.emotions?.after.intensity || 5]}
                      onValueChange={(value) => updateEmotion('after', 'intensity', value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      {currentEntry.emotions?.after.intensity || 5}/10
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Contexto de la Comida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>¿Dónde comiste?</Label>
                  <input
                    type="text"
                    value={currentEntry.context?.location || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      context: { ...prev.context!, location: e.target.value }
                    }))}
                    placeholder="Ej: En casa, restaurante, trabajo..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>¿Con quién comiste?</Label>
                  <input
                    type="text"
                    value={currentEntry.context?.company || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      context: { ...prev.context!, company: e.target.value }
                    }))}
                    placeholder="Ej: Solo/a, familia, amigos..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ambiente/Situación</Label>
                  <input
                    type="text"
                    value={currentEntry.context?.environment || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      context: { ...prev.context!, environment: e.target.value }
                    }))}
                    placeholder="Ej: Tranquilo, estresante, festivo..."
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Comportamientos Durante la Comida</Label>
                  
                  <div>
                    <Label className="text-sm">Velocidad al Comer (1=Muy lento, 10=Muy rápido)</Label>
                    <Slider
                      value={[currentEntry.behaviors?.eatingSpeed || 5]}
                      onValueChange={(value) => setCurrentEntry(prev => ({
                        ...prev,
                        behaviors: { ...prev.behaviors!, eatingSpeed: value[0] }
                      }))}
                      max={10}
                      min={1}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {currentEntry.behaviors?.eatingSpeed || 5}/10
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Nivel de Atención Plena (1=Muy distraído, 10=Muy presente)</Label>
                    <Slider
                      value={[currentEntry.behaviors?.mindfulness || 5]}
                      onValueChange={(value) => setCurrentEntry(prev => ({
                        ...prev,
                        behaviors: { ...prev.behaviors!, mindfulness: value[0] }
                      }))}
                      max={10}
                      min={1}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {currentEntry.behaviors?.mindfulness || 5}/10
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflection" className="space-y-4">
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Reflexión y Pensamientos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pensamientos ANTES de comer</Label>
                  <Textarea
                    value={currentEntry.thoughts?.before || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      thoughts: { ...prev.thoughts!, before: e.target.value }
                    }))}
                    placeholder="¿Qué pensabas antes de comer? ¿Tenías preocupaciones o expectativas?"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pensamientos DURANTE la comida</Label>
                  <Textarea
                    value={currentEntry.thoughts?.during || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      thoughts: { ...prev.thoughts!, during: e.target.value }
                    }))}
                    placeholder="¿En qué pensabas mientras comías? ¿Pudiste disfrutar la comida?"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pensamientos DESPUÉS de comer</Label>
                  <Textarea
                    value={currentEntry.thoughts?.after || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      thoughts: { ...prev.thoughts!, after: e.target.value }
                    }))}
                    placeholder="¿Cómo te sientes ahora? ¿Hay algún juicio o preocupación?"
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Desafíos o Dificultades</Label>
                  <Textarea
                    value={currentEntry.challenges?.join(', ') || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      challenges: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    placeholder="¿Qué fue difícil durante esta experiencia alimentaria?"
                    className="min-h-16"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Victorias o Logros</Label>
                  <Textarea
                    value={currentEntry.victories?.join(', ') || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      victories: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    placeholder="¿Qué hiciste bien? ¿De qué te sientes orgulloso/a?"
                    className="min-h-16"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notas Adicionales</Label>
                  <Textarea
                    value={currentEntry.notes || ''}
                    onChange={(e) => setCurrentEntry(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    placeholder="Cualquier otra observación o reflexión..."
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botones de Acción */}
        <div className="flex gap-2 mt-6">
          <Button onClick={saveEntry} className="flex-1">
            Guardar Registro
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentEntry({
                type: 'lunch',
                foods: [],
                photos: [],
                emotions: {
                  before: { emotion: 'neutral', intensity: 5 },
                  after: { emotion: 'neutral', intensity: 5 }
                },
                physicalSensations: {
                  hunger: 5,
                  fullness: 5,
                  satisfaction: 5
                },
                context: {
                  location: '',
                  company: '',
                  environment: '',
                  triggers: []
                },
                thoughts: {
                  before: '',
                  during: '',
                  after: ''
                },
                behaviors: {
                  eatingSpeed: 5,
                  mindfulness: 5,
                  distractions: []
                },
                challenges: [],
                victories: [],
                notes: ''
              });
              setActiveTab('basic');
            }}
          >
            Limpiar
          </Button>
        </div>

        {/* Entradas Recientes */}
        {entries.length > 0 && (
          <Card className="bg-gradient-card border-0 shadow-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Registros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entries.slice(-3).reverse().map((entry) => (
                <div key={entry.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {mealTypes.find(t => t.value === entry.type)?.icon}
                      </span>
                      <span className="font-medium">
                        {mealTypes.find(t => t.value === entry.type)?.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    <strong>Alimentos:</strong> {entry.foods.join(', ')}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {React.createElement(getEmotionIcon(entry.emotions.before.emotion), {
                        className: `w-3 h-3 ${getEmotionColor(entry.emotions.before.emotion)}`
                      })}
                      <span>Antes: {entry.emotions.before.emotion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {React.createElement(getEmotionIcon(entry.emotions.after.emotion), {
                        className: `w-3 h-3 ${getEmotionColor(entry.emotions.after.emotion)}`
                      })}
                      <span>Después: {entry.emotions.after.emotion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};