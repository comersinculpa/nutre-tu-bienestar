import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, CheckCircle, Calendar, Heart, Brain } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const cuestionarios = [
  {
    id: 'eat-40',
    title: 'Evaluación EAT-40',
    description: 'Cuestionario de actitudes alimentarias para identificar patrones de riesgo',
    duration: '10-15 min',
    lastTaken: null,
    frequency: 'Mensual',
    icon: FileText,
    questions: 40
  },
  {
    id: 'bienestar',
    title: 'Bienestar Emocional',
    description: 'Evalúa tu estado emocional y relación con el autocuidado',
    duration: '5-8 min',
    lastTaken: '2024-01-15',
    frequency: 'Semanal',
    icon: Heart,
    questions: 15
  },
  {
    id: 'tipo-comedor',
    title: '¿Qué tipo de comedor eres?',
    description: 'Basado en el Cuestionario de Comedor Emocional de Garaulet (CCE)',
    duration: '8-10 min',
    lastTaken: null,
    frequency: 'Trimestral',
    icon: Brain,
    questions: 18
  },
  {
    id: 'relacion-comida',
    title: 'Descubre tu relación con la comida',
    description: 'Identifica si eres un comedor emocional, restrictivo o consciente',
    duration: '5-7 min',
    lastTaken: null,
    frequency: 'Mensual',
    icon: CheckCircle,
    questions: 10
  }
];

const eat40Questions = [
  "Me aterroriza tener sobrepeso",
  "Evito comer cuando tengo hambre",
  "Me obsesiono con la comida",
  "He sufrido atracones donde siento que no puedo parar de comer",
  "Corto la comida en pequeños trozos",
  "Soy consciente del contenido calórico de los alimentos que como",
  "Evito especialmente los alimentos con alto contenido en carbohidratos",
  "Siento que otros preferirían que comiera más",
  "Vomito después de haber comido",
  "Me siento extremadamente culpable después de comer"
];

const bienestarQuestions = [
  "En general, me siento satisfecho/a con mi vida",
  "Soy capaz de manejar el estrés de manera efectiva",
  "Tengo relaciones cercanas y significativas en mi vida",
  "Me siento cómodo/a expresando mis emociones",
  "Dedico tiempo regularmente al autocuidado",
  "Tengo confianza en mi capacidad para superar desafíos",
  "Me siento conectado/a con mi propósito en la vida",
  "Duermo bien la mayoría de las noches",
  "Soy compasivo/a conmigo mismo/a cuando cometo errores",
  "Me siento energizado/a y motivado/a la mayor parte del tiempo",
  "Tengo estrategias saludables para lidiar con emociones difíciles",
  "Me siento apoyado/a por las personas importantes en mi vida",
  "Puedo establecer límites saludables en mis relaciones",
  "Practico la gratitud y aprecio las cosas buenas de mi vida",
  "Me siento capaz de adaptarme a los cambios y transiciones"
];

const tipoComedorQuestions = [
  "Cuando veo comida apetitosa, siento la necesidad de comerla aunque no tenga hambre",
  "Como más cuando estoy estresado/a o ansioso/a",
  "Si veo a otros comiendo, me dan ganas de comer también",
  "Cuando estoy triste o deprimido/a, busco comida para sentirme mejor",
  "Me resulta difícil resistir la comida cuando la huelo o la veo",
  "Como más de lo habitual cuando estoy aburrido/a",
  "La publicidad de comida me influye para querer comer",
  "Cuando estoy enfadado/a o irritado/a, tiendo a comer más",
  "Si hay comida disponible en mi entorno, siento la tentación de comerla",
  "Como para celebrar cuando estoy contento/a o emocionado/a",
  "Me resulta difícil parar de comer una vez que empiezo",
  "Uso la comida como recompensa cuando he tenido un buen día",
  "Como más en situaciones sociales, aunque no tenga hambre",
  "Cuando algo me preocupa, busco comida para distraerme",
  "Si veo mi comida favorita, la como aunque haya comido recientemente",
  "Como cuando me siento solo/a o necesito compañía",
  "Me influye mucho el ambiente donde como (restaurantes, fiestas, etc.)",
  "Como más cuando tengo emociones intensas, positivas o negativas"
];

const relacionComidaQuestions = [
  "Cuando como, presto atención a las señales de hambre y saciedad de mi cuerpo",
  "Como principalmente cuando tengo hambre física, no por otras razones",
  "Me siento culpable después de comer ciertos alimentos",
  "Uso la comida para sentirme mejor cuando estoy triste, estresado o aburrido",
  "Tengo reglas estrictas sobre qué alimentos puedo o no puedo comer",
  "Disfruto de la comida sin juzgarme a mí mismo por lo que como",
  "A menudo como más de lo que mi cuerpo necesita",
  "Paso mucho tiempo pensando en calorías, peso o restricciones alimentarias",
  "Como de manera equilibrada sin prohibirme alimentos específicos",
  "Siento ansiedad o estrés relacionado con la comida y las decisiones alimentarias"
];

const respuestasEAT = [
  { value: '0', label: 'Nunca' },
  { value: '1', label: 'Raramente' },
  { value: '2', label: 'A veces' },
  { value: '3', label: 'A menudo' },
  { value: '4', label: 'Muy a menudo' },
  { value: '5', label: 'Siempre' }
];

const respuestasBienestar = [
  { value: '1', label: 'Totalmente en desacuerdo' },
  { value: '2', label: 'En desacuerdo' },
  { value: '3', label: 'Neutral' },
  { value: '4', label: 'De acuerdo' },
  { value: '5', label: 'Totalmente de acuerdo' }
];

const respuestasTipoComedor = [
  { value: '1', label: 'Nunca' },
  { value: '2', label: 'Raramente' },
  { value: '3', label: 'A veces' },
  { value: '4', label: 'Frecuentemente' },
  { value: '5', label: 'Siempre' }
];

const respuestasRelacionComida = [
  { value: '1', label: 'Nunca' },
  { value: '2', label: 'Casi nunca' },
  { value: '3', label: 'A veces' },
  { value: '4', label: 'Casi siempre' },
  { value: '5', label: 'Siempre' }
];

export default function Cuestionarios() {
  const navigate = useNavigate();
  const [selectedCuestionario, setSelectedCuestionario] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex: number, value: string) => {
    setRespuestas(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const nextQuestion = () => {
    const questionsLength = selectedCuestionario === 'eat-40' 
      ? eat40Questions.length 
      : selectedCuestionario === 'bienestar' 
        ? bienestarQuestions.length 
        : selectedCuestionario === 'tipo-comedor'
          ? tipoComedorQuestions.length
          : relacionComidaQuestions.length;
    
    if (currentQuestion < questionsLength - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateEATScore = () => {
    const score = Object.values(respuestas).reduce((sum, value) => sum + parseInt(value), 0);
    return score;
  };

  const calculateBienestarScore = () => {
    const score = Object.values(respuestas).reduce((sum, value) => sum + parseInt(value), 0);
    return score;
  };

  const calculateTipoComedorScore = () => {
    const respuestasArray = Object.values(respuestas).map(value => parseInt(value));
    
    // Categorizar preguntas por tipo
    // Comedor Externo: preguntas 1,3,5,7,9,11,13,15,17 (influenciado por estímulos externos)
    const externoQuestions = [0,2,4,6,8,10,12,14,16];
    // Comedor Emocional: preguntas 2,4,6,8,10,12,14,16,18 (come por emociones)
    const emocionalQuestions = [1,3,5,7,9,11,13,15,17];
    
    const externoScore = externoQuestions.reduce((sum, index) => {
      return sum + (respuestasArray[index] || 0);
    }, 0);
    
    const emocionalScore = emocionalQuestions.reduce((sum, index) => {
      return sum + (respuestasArray[index] || 0);
    }, 0);
    
    return { externoScore, emocionalScore, totalScore: externoScore + emocionalScore };
  };

  const calculateRelacionComidaScore = () => {
    const respuestasArray = Object.values(respuestas).map(value => parseInt(value));
    
    // Preguntas que indican Comedor Consciente: 1, 2, 6, 9 (respuestas altas son buenas)
    const conscienteQuestions = [0, 1, 5, 8];
    // Preguntas que indican Comedor Emocional: 4, 7 (respuestas altas son problemáticas)  
    const emocionalQuestions = [3, 6];
    // Preguntas que indican Comedor Restrictivo: 3, 5, 8, 10 (respuestas altas son problemáticas)
    const restrictivoQuestions = [2, 4, 7, 9];
    
    const conscienteScore = conscienteQuestions.reduce((sum, index) => {
      return sum + (respuestasArray[index] || 0);
    }, 0);
    
    // Para emocional y restrictivo, puntuación alta indica mayor problemática
    const emocionalScore = emocionalQuestions.reduce((sum, index) => {
      return sum + (respuestasArray[index] || 0);
    }, 0);
    
    const restrictivoScore = restrictivoQuestions.reduce((sum, index) => {
      return sum + (respuestasArray[index] || 0);
    }, 0);
    
    return { conscienteScore, emocionalScore, restrictivoScore };
  };

  const getEATInterpretation = (score: number) => {
    if (score >= 30) {
      return {
        level: 'Alto riesgo',
        message: 'Los resultados sugieren la presencia de patrones alimentarios que pueden requerir atención profesional. Te recomendamos buscar apoyo especializado.',
        color: 'text-destructive',
        bgColor: 'bg-destructive-soft',
        recommendations: [
          'Considera hablar con un profesional de la salud',
          'Usa nuestros recursos de "Pausa con Cuidado"',
          'Practica ejercicios de respiración diarios'
        ]
      };
    } else if (score >= 20) {
      return {
        level: 'Riesgo moderado',
        message: 'Hay algunas áreas de tu relación con la comida que podrían beneficiarse de atención y cuidado.',
        color: 'text-warning',
        bgColor: 'bg-warning-soft',
        recommendations: [
          'Explora nuestros talleres de alimentación consciente',
          'Usa el detector de hambre regularmente',
          'Practica el autocuidado diario'
        ]
      };
    } else {
      return {
        level: 'Bajo riesgo',
        message: 'Tus respuestas indican una relación relativamente saludable con la comida. ¡Sigue cuidándote!',
        color: 'text-success',
        bgColor: 'bg-success-soft',
        recommendations: [
          'Mantén tus hábitos de autocuidado',
          'Continúa con el registro emocional',
          'Celebra tus avances'
        ]
      };
    }
  };

  const getBienestarInterpretation = (score: number) => {
    // Puntuación máxima: 75 (15 preguntas x 5 puntos)
    const percentage = (score / 75) * 100;
    
    if (percentage >= 80) {
      return {
        level: 'Excelente bienestar',
        message: 'Tu bienestar emocional está en un nivel muy saludable. Tienes herramientas sólidas para manejar la vida y te sientes generalmente satisfecho/a.',
        color: 'text-success',
        bgColor: 'bg-success-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Mantén tus prácticas actuales de autocuidado',
          'Comparte tus estrategias con otros',
          'Considera ser mentor de alguien que necesite apoyo',
          'Continúa cultivando tu crecimiento personal'
        ]
      };
    } else if (percentage >= 60) {
      return {
        level: 'Buen bienestar',
        message: 'Tu bienestar emocional está en un nivel saludable, con algunas áreas donde puedes seguir creciendo y fortaleciéndote.',
        color: 'text-primary',
        bgColor: 'bg-primary-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Explora nuestros talleres de gestión emocional',
          'Dedica más tiempo al autocuidado diario',
          'Practica técnicas de mindfulness regularmente',
          'Fortalece tus relaciones cercanas'
        ]
      };
    } else if (percentage >= 40) {
      return {
        level: 'Bienestar moderado',
        message: 'Hay varias áreas de tu bienestar emocional que se beneficiarían de atención y cuidado. Es un buen momento para implementar nuevas estrategias.',
        color: 'text-warning',
        bgColor: 'bg-warning-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Considera hablar con un profesional de salud mental',
          'Usa nuestros recursos de autocuidado diariamente',
          'Practica ejercicios de respiración y relajación',
          'Busca apoyo en tu comunidad o círculo cercano'
        ]
      };
    } else {
      return {
        level: 'Necesita atención',
        message: 'Tu bienestar emocional indica que podrías beneficiarte significativamente de apoyo adicional y estrategias de cuidado personal.',
        color: 'text-destructive',
        bgColor: 'bg-destructive-soft',
        percentage: Math.round(percentage),
        recommendations: [
          'Te recomendamos encarecidamente buscar apoyo profesional',
          'Usa nuestros recursos de crisis si es necesario',
          'Contacta con personas de confianza en tu vida',
          'Practica el autocuidado básico: sueño, alimentación, hidratación'
        ]
      };
    }
  };

  const getTipoComedorInterpretation = (scores: { externoScore: number; emocionalScore: number; totalScore: number }) => {
    const { externoScore, emocionalScore } = scores;
    const externoPercentage = (externoScore / 45) * 100; // 9 preguntas x 5 puntos máx
    const emocionalPercentage = (emocionalScore / 45) * 100; // 9 preguntas x 5 puntos máx
    
    let tipoComedor = '';
    let descripcion = '';
    let color = '';
    let bgColor = '';
    let estrategias: string[] = [];
    
    if (externoScore > emocionalScore) {
      if (externoPercentage >= 70) {
        tipoComedor = 'Comedor Externo Intenso';
        descripcion = 'Te influyen mucho los estímulos externos como ver comida, olores, publicidad o el ambiente. Comes principalmente por factores del entorno, no por hambre real.';
        color = 'text-warning';
        bgColor = 'bg-warning-soft';
        estrategias = [
          'Evita tener comida visible en casa y trabajo',
          'Planifica tus comidas y snacks con anticipación',
          'Practica mindful eating para conectar con tu hambre real',
          'Usa técnicas de distracción cuando veas comida tentadora',
          'Come en ambientes tranquilos sin distracciones'
        ];
      } else {
        tipoComedor = 'Comedor Externo Moderado';
        descripcion = 'Algunas veces te influyen los estímulos externos, pero tienes cierto control sobre tus impulsos alimentarios.';
        color = 'text-primary';
        bgColor = 'bg-primary-soft';
        estrategias = [
          'Sé consciente de los momentos donde más te influyen los estímulos',
          'Practica técnicas de pausa antes de comer impulsivamente',
          'Organiza tu entorno para reducir tentaciones',
          'Desarrolla estrategias específicas para situaciones sociales'
        ];
      }
    } else if (emocionalScore > externoScore) {
      if (emocionalPercentage >= 70) {
        tipoComedor = 'Comedor Emocional Intenso';
        descripcion = 'Usas la comida como manera principal de gestionar tus emociones, tanto positivas como negativas. Tu estado emocional determina cuándo y cuánto comes.';
        color = 'text-destructive';
        bgColor = 'bg-destructive-soft';
        estrategias = [
          'Identifica qué emociones te llevan a comer más frecuentemente',
          'Desarrolla alternativas saludables para gestionar emociones',
          'Practica técnicas de regulación emocional (respiración, mindfulness)',
          'Considera buscar apoyo psicológico especializado',
          'Lleva un diario emocional-alimentario para identificar patrones'
        ];
      } else {
        tipoComedor = 'Comedor Emocional Moderado';
        descripcion = 'A veces usas la comida para gestionar emociones, pero también puedes comer por hambre física. Tienes cierta conciencia sobre este patrón.';
        color = 'text-warning';
        bgColor = 'bg-warning-soft';
        estrategias = [
          'Practica la pausa consciente antes de comer cuando estés emocional',
          'Desarrolla una lista de actividades alternativas para cada emoción',
          'Aprende técnicas básicas de gestión emocional',
          'Usa nuestros recursos de detección de hambre emocional'
        ];
      }
    } else {
      tipoComedor = 'Comedor Equilibrado';
      descripcion = 'Tienes un patrón alimentario relativamente equilibrado. Aunque a veces te pueden influir factores externos o emocionales, generalmente comes por hambre física.';
      color = 'text-success';
      bgColor = 'bg-success-soft';
      estrategias = [
        'Mantén tus buenos hábitos alimentarios actuales',
        'Sigue practicando la alimentación consciente',
        'Mantente atento a cambios en tus patrones por estrés o cambios vitales',
        'Comparte tus estrategias saludables con otros'
      ];
    }
    
    return {
      tipoComedor,
      descripcion,
      color,
      bgColor,
      externoPercentage: Math.round(externoPercentage),
      emocionalPercentage: Math.round(emocionalPercentage),
      estrategias
    };
  };

  const getRelacionComidaInterpretation = (scores: { conscienteScore: number; emocionalScore: number; restrictivoScore: number }) => {
    const { conscienteScore, emocionalScore, restrictivoScore } = scores;
    
    // Determinar el tipo dominante
    let tipoComedor = '';
    let descripcion = '';
    let color = '';
    let bgColor = '';
    let estrategias: string[] = [];
    let porcentajes = {
      consciente: (conscienteScore / 20) * 100, // 4 preguntas x 5 puntos máx
      emocional: (emocionalScore / 10) * 100,  // 2 preguntas x 5 puntos máx
      restrictivo: (restrictivoScore / 20) * 100 // 4 preguntas x 5 puntos máx
    };

    // Lógica para determinar el tipo predominante
    if (porcentajes.consciente >= 70 && porcentajes.emocional < 60 && porcentajes.restrictivo < 60) {
      tipoComedor = 'Comedor Consciente';
      descripcion = 'Tienes una relación saludable con la comida. Escuchas las señales de tu cuerpo, comes con atención plena y disfrutas de la alimentación sin culpa ni restricciones extremas.';
      color = 'text-success';
      bgColor = 'bg-success-soft';
      estrategias = [
        'Continúa practicando la alimentación consciente',
        'Mantén tu conexión con las señales de hambre y saciedad',
        'Sigue disfrutando de la comida sin juicio',
        'Comparte tus estrategias saludables con otros',
        'Mantente flexible ante cambios en tu rutina alimentaria'
      ];
    } else if (porcentajes.emocional >= 70 || (emocionalScore >= restrictivoScore && emocionalScore >= conscienteScore)) {
      tipoComedor = 'Comedor Emocional';
      descripcion = 'Tiendes a usar la comida como una forma de gestionar tus emociones. Comes en respuesta al estrés, tristeza, aburrimiento o celebración, más que por hambre física real.';
      color = 'text-warning';
      bgColor = 'bg-warning-soft';
      estrategias = [
        'Identifica qué emociones desencadenan el comer emocional',
        'Desarrolla alternativas saludables para cada emoción (caminar, llamar a alguien, respirar)',
        'Practica técnicas de pausa antes de comer cuando estés emocional',
        'Lleva un diario emocional-alimentario para identificar patrones',
        'Busca apoyo profesional si sientes que no puedes controlarlo'
      ];
    } else if (porcentajes.restrictivo >= 70 || (restrictivoScore >= emocionalScore && restrictivoScore >= conscienteScore)) {
      tipoComedor = 'Comedor Restrictivo';
      descripcion = 'Tiendes a tener reglas estrictas sobre la comida, sientes culpa al comer ciertos alimentos y pasas mucho tiempo preocupándote por las calorías o el peso. Esta relación puede generar ansiedad.';
      color = 'text-destructive';
      bgColor = 'bg-destructive-soft';
      estrategias = [
        'Trabaja en reducir las reglas alimentarias rígidas gradualmente',
        'Practica la autocompasión cuando comes alimentos "prohibidos"',
        'Considera buscar ayuda de un profesional especializado en alimentación',
        'Enfócate en cómo te sientes en lugar de en las calorías',
        'Desafía los pensamientos negativos sobre la comida y tu cuerpo'
      ];
    } else {
      tipoComedor = 'Comedor Mixto';
      descripcion = 'Tu relación con la comida combina diferentes patrones. A veces comes conscientemente, otras emocionalmente, y ocasionalmente de forma restrictiva. Es normal tener variaciones según las circunstancias.';
      color = 'text-primary';
      bgColor = 'bg-primary-soft';
      estrategias = [
        'Trabaja en identificar qué situaciones activan cada patrón',
        'Desarrolla estrategias específicas para tus momentos más desafiantes',
        'Practica la alimentación consciente como base',
        'Sé compasivo contigo mismo durante el proceso de cambio',
        'Considera qué área te gustaría mejorar primero'
      ];
    }

    return {
      tipoComedor,
      descripcion,
      color,
      bgColor,
      porcentajes: {
        consciente: Math.round(porcentajes.consciente),
        emocional: Math.round(porcentajes.emocional),
        restrictivo: Math.round(porcentajes.restrictivo)
      },
      estrategias
    };
  };

  const resetQuestionario = () => {
    setShowResults(false);
    setSelectedCuestionario(null);
    setCurrentQuestion(0);
    setRespuestas({});
  };

  // Resultados para Tipo de Comedor
  if (showResults && selectedCuestionario === 'tipo-comedor') {
    const scores = calculateTipoComedorScore();
    const interpretation = getTipoComedorInterpretation(scores);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Tu Tipo de Comedor
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className={`font-heading text-lg font-semibold mb-2 ${interpretation.color}`}>
                  {interpretation.tipoComedor}
                </h3>
                <p className={`text-sm leading-relaxed ${interpretation.color}`}>
                  {interpretation.descripcion}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Análisis detallado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Comedor Externo</span>
                    <span className="text-sm font-bold text-primary">{interpretation.externoPercentage}%</span>
                  </div>
                  <Progress value={interpretation.externoPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Comedor Emocional</span>
                    <span className="text-sm font-bold text-primary">{interpretation.emocionalPercentage}%</span>
                  </div>
                  <Progress value={interpretation.emocionalPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Estrategias personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interpretation.estrategias.map((estrategia, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{estrategia}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-gradient-primary text-white"
              >
                Ver recursos
              </Button>
              <Button 
                variant="outline"
                onClick={resetQuestionario}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resultados para Relación con la Comida
  if (showResults && selectedCuestionario === 'relacion-comida') {
    const scores = calculateRelacionComidaScore();
    const interpretation = getRelacionComidaInterpretation(scores);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Tu Relación con la Comida
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className={`font-heading text-lg font-semibold mb-2 ${interpretation.color}`}>
                  {interpretation.tipoComedor}
                </h3>
                <p className={`text-sm leading-relaxed ${interpretation.color}`}>
                  {interpretation.descripcion}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Análisis detallado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Alimentación Consciente</span>
                    <span className="text-sm font-bold text-success">{interpretation.porcentajes.consciente}%</span>
                  </div>
                  <Progress value={interpretation.porcentajes.consciente} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Patrón Emocional</span>
                    <span className="text-sm font-bold text-warning">{interpretation.porcentajes.emocional}%</span>
                  </div>
                  <Progress value={interpretation.porcentajes.emocional} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Patrón Restrictivo</span>
                    <span className="text-sm font-bold text-destructive">{interpretation.porcentajes.restrictivo}%</span>
                  </div>
                  <Progress value={interpretation.porcentajes.restrictivo} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Estrategias personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interpretation.estrategias.map((estrategia, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{estrategia}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-gradient-primary text-white"
              >
                Ver recursos
              </Button>
              <Button 
                variant="outline"
                onClick={resetQuestionario}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resultados para Bienestar Emocional
  if (showResults && selectedCuestionario === 'bienestar') {
    const score = calculateBienestarScore();
    const interpretation = getBienestarInterpretation(score);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Resultados Bienestar
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-xs text-white/80">{interpretation.percentage}%</div>
                  </div>
                </div>
                <h3 className={`font-heading text-lg font-semibold mb-2 ${interpretation.color}`}>
                  {interpretation.level}
                </h3>
                <p className={`text-sm leading-relaxed ${interpretation.color}`}>
                  {interpretation.message}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Recomendaciones personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interpretation.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-gradient-primary text-white"
              >
                Ver recursos
              </Button>
              <Button 
                variant="outline"
                onClick={resetQuestionario}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Resultados para EAT-40
  if (showResults && selectedCuestionario === 'eat-40') {
    const score = calculateEATScore();
    const interpretation = getEATInterpretation(score);

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Resultados EAT-40
            </h1>
            <div></div>
          </div>

          <div className="space-y-6">
            <Card className={`${interpretation.bgColor} border-0`}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{score}</span>
                </div>
                <h3 className={`font-heading text-lg font-semibold mb-2 ${interpretation.color}`}>
                  {interpretation.level}
                </h3>
                <p className={`text-sm leading-relaxed ${interpretation.color}`}>
                  {interpretation.message}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-heading text-foreground">
                  Recomendaciones personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interpretation.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/recursos')}
                className="flex-1 bg-gradient-primary text-white"
              >
                Ver recursos
              </Button>
              <Button 
                variant="outline"
                onClick={resetQuestionario}
                className="flex-1"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista del cuestionario activo
  if (selectedCuestionario) {
    const questions = selectedCuestionario === 'eat-40' 
      ? eat40Questions 
      : selectedCuestionario === 'bienestar' 
        ? bienestarQuestions 
        : selectedCuestionario === 'tipo-comedor'
          ? tipoComedorQuestions
          : relacionComidaQuestions;
    
    const respuestasOptions = selectedCuestionario === 'eat-40' 
      ? respuestasEAT 
      : selectedCuestionario === 'bienestar' 
        ? respuestasBienestar 
        : selectedCuestionario === 'tipo-comedor'
          ? respuestasTipoComedor
          : respuestasRelacionComida;
    
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={resetQuestionario}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {selectedCuestionario === 'eat-40' 
                ? 'EAT-40' 
                : selectedCuestionario === 'bienestar' 
                  ? 'Bienestar Emocional' 
                  : selectedCuestionario === 'tipo-comedor'
                    ? 'Tipo de Comedor'
                    : 'Relación con la Comida'}
            </h1>
            <div className="text-sm text-muted-foreground">
              {currentQuestion + 1}/{questions.length}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Progress value={progress} className="h-2 mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}% completado
              </p>
            </div>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="font-heading text-lg font-medium text-foreground mb-6">
                  {questions[currentQuestion]}
                </h3>

                <RadioGroup 
                  value={respuestas[currentQuestion] || ''} 
                  onValueChange={(value) => handleAnswer(currentQuestion, value)}
                >
                  <div className="space-y-3">
                    {respuestasOptions.map((respuesta) => (
                      <div key={respuesta.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={respuesta.value} id={respuesta.value} />
                        <Label 
                          htmlFor={respuesta.value}
                          className="font-body text-foreground cursor-pointer flex-1"
                        >
                          {respuesta.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button 
              onClick={nextQuestion}
              disabled={!respuestas[currentQuestion]}
              className="w-full h-12 bg-gradient-primary text-white disabled:opacity-50"
            >
              {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal de cuestionarios
  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">
            Cuestionarios
          </h1>
          <div></div>
        </div>

        <div className="mb-6">
          <Avatar 
            message="Los cuestionarios te ayudan a conocerte mejor y identificar áreas de crecimiento. Responde con honestidad y sin juicio."
            mood="supportive"
          />
        </div>

        <div className="space-y-4">
          {cuestionarios.map((cuestionario) => {
            const IconComponent = cuestionario.icon;
            return (
              <Card 
                key={cuestionario.id}
                className="bg-gradient-card hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCuestionario(cuestionario.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-soft rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-medium text-foreground mb-1">
                        {cuestionario.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {cuestionario.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Duración: {cuestionario.duration}
                          </div>
                          <div>Frecuencia: {cuestionario.frequency}</div>
                        </div>
                        
                        {cuestionario.lastTaken ? (
                          <span className="text-xs text-success">
                            Último: {new Date(cuestionario.lastTaken).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No realizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}