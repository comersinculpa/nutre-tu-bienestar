import { useState } from 'react';
import { EmotionWheel } from '@/components/EmotionWheel';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Save, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmotionalAnalysis } from '@/hooks/useEmotionalAnalysis';
import { ContextualRecommendations } from '@/components/ContextualRecommendations';
import { ImageUpload } from '@/components/ImageUpload';

const motivationalPhrases = [
  // Self-compassion & Acceptance
  "Tu valor no depende de lo que comes, sino de quien eres",
  "Eres digno de amor y cuidado, especialmente de ti mismo",
  "Cada día es una nueva oportunidad para tratarte con bondad",
  "Tu cuerpo es tu hogar, trátalo con respeto y cariño",
  "No eres tus pensamientos, eres el observador de tus pensamientos",
  "Permítete sentir sin juzgar, todas las emociones son válidas",
  "La sanación no es lineal, sé paciente contigo mismo",
  "Tu progreso importa, sin importar cuán pequeño parezca",
  "Mereces ocupar espacio en este mundo",
  "La autocompasión es el primer paso hacia la transformación",
  
  // Strength & Resilience  
  "Has superado días difíciles antes, puedes hacerlo de nuevo",
  "Tu fuerza interior es más poderosa de lo que imaginas",
  "Cada respiración consciente es un acto de valentía",
  "No tienes que ser perfecto para ser suficiente",
  "Tu capacidad de sanar está dentro de ti",
  "Eres más fuerte que tus miedos",
  "Cada pequeño paso cuenta en tu camino de bienestar",
  "Tu resiliencia te ha traído hasta aquí",
  "Confía en tu proceso, aunque no veas el final del camino",
  "Tu historia de superación está escribiéndose ahora",
  
  // Mindful Eating & Body Wisdom
  "Tu cuerpo sabe lo que necesita, aprende a escucharlo",
  "Comer con conciencia es un acto de amor propio",
  "No hay alimentos buenos o malos, solo decisiones conscientes",
  "Tu hambre física es una señal sabia de tu cuerpo",
  "Come cuando tengas hambre, para cuando te sientas satisfecho",
  "La comida es nutrición para tu cuerpo y placer para tu alma",
  "Cada bocado consciente es una práctica de presencia",
  "Tu cuerpo merece ser alimentado, no castigado",
  "La verdadera nutrición incluye alimentar tu alma",
  "Honra las señales de tu cuerpo sin juicio",
  
  // Emotional Growth
  "Tus emociones son mensajeras, no enemigas",
  "Sentir profundamente es un regalo, no una carga",
  "La vulnerabilidad es la cuna de la valentía",
  "Cada lágrima te acerca más a tu auténtico ser",
  "No tienes que cargar solo con tus emociones",
  "Tu sensibilidad es una fortaleza, no una debilidad",
  "Está bien no estar bien todo el tiempo",
  "Tu corazón sabe cómo sanar, dale tiempo",
  "Cada emoción tiene algo que enseñarte",
  "Eres capaz de sostener tu propia ternura",
  
  // Inner Peace & Mindfulness
  "En este momento, todo lo que necesitas está dentro de ti",
  "La paz no está en la perfección, sino en la aceptación",
  "Respira. Este momento es todo lo que tienes",
  "Tu presencia es el regalo más valioso que puedes darte",
  "La calma vive en tu respiración",
  "Cada momento consciente es una victoria",
  "El silencio interior contiene todas las respuestas",
  "Tu mente puede ser tu refugio de paz",
  "La atención plena transforma lo ordinario en sagrado",
  "En la quietud encuentras tu verdadero poder",
  
  // Growth & Healing
  "Crecer duele, pero estancarse duele más",
  "Tu sanación beneficia a todos los que te rodean",
  "No tienes que ser quien eras ayer",
  "Cada día puedes elegir comenzar de nuevo",
  "El cambio verdadero nace del amor, no del miedo",
  "Tu herida puede convertirse en tu sabiduría",
  "Sanar no significa olvidar, significa integrar",
  "Eres tanto la tormenta como la calma que viene después",
  "Tu crecimiento no tiene límites",
  "La transformación es tu derecho de nacimiento",
  
  // Hope & Future
  "Tu futuro yo te agradecerá el cuidado que te das hoy",
  "Cada amanecer trae nuevas posibilidades",
  "Siembras esperanza cada vez que eliges el amor sobre el miedo",
  "Tu historia está llena de capítulos hermosos por escribir",
  "El mejor momento para plantar un árbol fue hace 20 años, el segundo mejor momento es ahora",
  "Tu luz brilla más fuerte después de la oscuridad",
  "Confía en el proceso, incluso cuando no entiendas el plan",
  "Mañana será diferente, y tú tienes el poder de influir en cómo",
  "Tu esperanza es más fuerte que cualquier miedo",
  "El universo conspira a favor de tu bienestar",
  
  // Self-Love & Worth
  "Te amas cuando te das lo que necesitas, no lo que quieres",
  "Tu amor propio no es negociable",
  "Eres suficiente, exactamente como eres ahora",
  "No necesitas ganarte tu propio amor",
  "Tu relación más importante es contigo mismo",
  "Mírate con los mismos ojos con que miras a quien más amas",
  "Tu corazón merece la gentileza que das a otros",
  "Eres tanto el jardín como el jardinero de tu vida",
  "Tu presencia en este mundo hace la diferencia",
  "Te mereces toda la felicidad que puedas crear",
  
  // Connection & Support
  "No estás solo en este camino, hay manos tendidas hacia ti",
  "Pedir ayuda es un acto de valentía, no de debilidad",
  "Tu vulnerabilidad crea puentes hacia otros corazones",
  "Compartir tu carga la hace más ligera",
  "Hay personas que entienden tu lucha sin palabras",
  "Tu historia puede ser el bálsamo que alguien más necesita",
  "En comunidad somos más fuertes",
  "Tu sanación inspira la sanación de otros",
  "No tienes que fingir que estás bien para ser amado",
  "Existe un lugar en este mundo donde encajas perfectamente",
  
  // Progress & Celebration
  "Celebra cada pequeña victoria, todas cuentan",
  "El progreso no siempre es visible, pero siempre es real",
  "Has llegado más lejos de lo que creías posible",
  "Cada 'no' que te das es un 'sí' a tu bienestar",
  "Tu esfuerzo de hoy es la base de tu libertad de mañana",
  "No subestimes el poder de los cambios pequeños y constantes",
  "Cada vez que eliges el cuidado sobre la crítica, creces",
  "Tu determinación es más fuerte que cualquier obstáculo",
  "Mírate con orgullo: has elegido sanar",
  "Eres prueba viviente de que la transformación es posible"
];

const getDailyMotivationalPhrase = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const phraseIndex = dayOfYear % motivationalPhrases.length;
  return motivationalPhrases[phraseIndex];
};

export default function DiarioEmocional() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [diaryText, setDiaryText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { toast } = useToast();
  const { analyzeText, isAnalyzing } = useEmotionalAnalysis();

  const handleSaveEntry = async () => {
    if (!selectedEmotion || !diaryText.trim()) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona una emoción y escribe algo en tu diario.",
        variant: "destructive",
      });
      return;
    }

    // Analyze text for emotional patterns and risk
    const emotionalAnalysis = await analyzeText(diaryText, selectedEmotion);
    setAnalysis(emotionalAnalysis);

    // Save to localStorage with analysis
    const entryData = {
      id: Date.now(),
      date: new Date().toISOString(),
      emotion: selectedEmotion,
      text: diaryText,
      analysis: emotionalAnalysis
    };

    const existingEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
    const updatedEntries = [entryData, ...existingEntries];
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));

    toast({
      title: "Entrada guardada y analizada",
      description: "He revisado tu texto y tengo algunas recomendaciones para ti.",
    });

    // Don't reset form immediately so user can see analysis
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
    <div className="min-h-screen bg-background-subpage pb-20">
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

        {/* Daily Motivational Phrase */}
        <Card className="bg-gradient-warm shadow-card border-0">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-foreground/80 mb-2 uppercase tracking-wider">
                  Frase del día {new Date().getDate()} de {new Date().toLocaleDateString('es-ES', { month: 'long' })}
                </h3>
                <p className="text-lg font-medium text-accent-foreground leading-relaxed">
                  {getDailyMotivationalPhrase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                onClick={() => setShowImageUpload(!showImageUpload)}
              >
                <Camera className="w-4 h-4 mr-2" />
                {showImageUpload ? 'Ocultar cámara' : 'Añadir foto'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload for Selfie Emotion Detection */}
        {showImageUpload && (
          <ImageUpload 
            type="selfie"
            onAnalysisComplete={(result) => {
              setSelectedEmotion(result.primaryEmotion);
              toast({
                title: "Emoción detectada",
                description: `He detectado ${result.primaryEmotion} con ${result.confidence}% de confianza`,
              });
            }}
          />
        )}

        {/* Contextual Recommendations based on Analysis */}
        {analysis && (
          <ContextualRecommendations />
        )}

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
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-primary shadow-soft hover:shadow-warm transition-all duration-300"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isAnalyzing ? 'Analizando...' : 'Guardar y Analizar'}
          </Button>
          
          {analysis && (
            <Button 
              onClick={() => {
                setSelectedEmotion('');
                setDiaryText('');
                setAnalysis(null);
                setShowImageUpload(false);
              }}
              variant="outline"
              size="lg"
            >
              Nueva Entrada
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}