import { useState } from 'react';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Heart, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const questions = [
  {
    id: 1,
    question: "¿Cuándo fue la última vez que comiste?",
    options: [
      { text: "Hace menos de 2 horas", value: "emotional" },
      { text: "Hace 2-4 horas", value: "neutral" },
      { text: "Hace más de 4 horas", value: "physical" }
    ]
  },
  {
    id: 2,
    question: "¿Cómo describirías la sensación en tu estómago?",
    options: [
      { text: "No siento nada especial", value: "emotional" },
      { text: "Ligera sensación vacía", value: "neutral" },
      { text: "Rugidos y sensación clara de vacío", value: "physical" }
    ]
  },
  {
    id: 3,
    question: "¿Qué tipo de comida se te antoja?",
    options: [
      { text: "Algo específico y reconfortante", value: "emotional" },
      { text: "No tengo preferencia clara", value: "neutral" },
      { text: "Cualquier cosa que me llene", value: "physical" }
    ]
  },
  {
    id: 4,
    question: "¿Cómo te sientes emocionalmente ahora?",
    options: [
      { text: "Estresado/a, triste o ansioso/a", value: "emotional" },
      { text: "Normal, ni muy bien ni muy mal", value: "neutral" },
      { text: "Tranquilo/a y equilibrado/a", value: "physical" }
    ]
  },
  {
    id: 5,
    question: "Si tuvieras que esperar 20 minutos, ¿cómo te sentirías?",
    options: [
      { text: "Muy incómodo/a, necesito comer ya", value: "emotional" },
      { text: "Podría esperar sin problemas", value: "neutral" },
      { text: "Prefiero no esperar, pero puedo hacerlo", value: "physical" }
    ]
  }
];

export default function DetectorHambre() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const emotionalCount = newAnswers.filter(a => a === 'emotional').length;
      const physicalCount = newAnswers.filter(a => a === 'physical').length;
      
      if (emotionalCount > physicalCount) {
        setResult('emotional');
      } else if (physicalCount > emotionalCount) {
        setResult('physical');
      } else {
        setResult('mixed');
      }
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const getResultContent = () => {
    switch (result) {
      case 'emotional':
        return {
          icon: Heart,
          title: 'Hambre Emocional',
          description: 'Parece que tus ganas de comer están más relacionadas con tus emociones que con una necesidad física.',
          color: 'accent',
          bgColor: 'bg-accent-soft',
          suggestions: [
            'Prueba técnicas de respiración profunda',
            'Haz una actividad que te relaje (caminar, música)',
            'Escribe en tu diario emocional',
            'Bebe un vaso de agua despacio'
          ]
        };
      case 'physical':
        return {
          icon: Utensils,
          title: 'Hambre Física',
          description: 'Tu cuerpo está pidiendo nutrición. Es momento de alimentarte conscientemente.',
          color: 'success',
          bgColor: 'bg-success-soft',
          suggestions: [
            'Elige alimentos nutritivos y equilibrados',
            'Come despacio y con atención',
            'Incluye proteínas y fibra en tu comida',
            'Disfruta cada bocado sin culpa'
          ]
        };
      default:
        return {
          icon: Heart,
          title: 'Señales Mixtas',
          description: 'Hay componentes tanto físicos como emocionales en tus ganas de comer.',
          color: 'warning',
          bgColor: 'bg-warning-soft',
          suggestions: [
            'Tómate unos minutos para reflexionar',
            'Come algo ligero y saludable',
            'Presta atención a cómo te sientes después',
            'Considera hablar con alguien de confianza'
          ]
        };
    }
  };

  if (result) {
    const resultData = getResultContent();
    const ResultIcon = resultData.icon;

    return (
      <div className="min-h-screen bg-gradient-calm pb-20">
        <div className="px-6 py-6 space-y-6">
          <div className="text-center pt-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Resultado del Detector
            </h1>
          </div>

          <Avatar 
            mood="supportive" 
            message="He analizado tus respuestas. Aquí tienes algunas sugerencias personalizadas."
          />

          <Card className={`shadow-warm border-0 ${resultData.bgColor}`}>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <ResultIcon className={`w-16 h-16 mx-auto text-${resultData.color}`} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {resultData.title}
              </h2>
              <p className="text-foreground/80 mb-6">
                {resultData.description}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle>Sugerencias Personalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resultData.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={resetTest}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Hacer Test de Nuevo
            </Button>
            <Button 
              onClick={() => toast({ title: "Guardado", description: "Resultado guardado en tu historial" })}
              className="flex-1 bg-gradient-primary"
              size="lg"
            >
              Guardar Resultado
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-6 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Detector de Hambre
          </h1>
          <p className="text-muted-foreground">
            Te ayudo a identificar si es hambre física o emocional
          </p>
        </div>

        <Avatar 
          mood="calming" 
          message="Responde con sinceridad. No hay respuestas correctas o incorrectas."
        />

        {/* Progress */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="text-sm font-medium">{currentQuestion + 1} de {questions.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-4 h-auto text-left justify-start hover:bg-primary/10 hover:border-primary transition-all duration-300"
                onClick={() => handleAnswer(option.value)}
              >
                <Circle className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="flex-1">{option.text}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Previous answers indicator */}
        {answers.length > 0 && (
          <Card className="bg-secondary-soft shadow-card border-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Pregunta {currentQuestion + 1} de {questions.length} • {answers.length} respuestas guardadas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}