import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, CheckCircle, Clock, Heart, Sparkles, ChevronRight, BookOpen } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const talleres = [
  {
    id: 'autocuidado',
    title: 'Fundamentos del Autocuidado',
    description: 'Aprende a cuidarte con amabilidad y sin juicio',
    duration: '15 min',
    lessons: 5,
    completed: 2,
    category: 'Básico',
    color: 'bg-success-soft text-success-foreground',
    icon: Heart
  },
  {
    id: 'mindfulness',
    title: 'Alimentación Consciente',
    description: 'Conecta con tus señales de hambre y saciedad',
    duration: '20 min',
    lessons: 4,
    completed: 0,
    category: 'Intermedio',
    color: 'bg-primary-soft text-primary-foreground',
    icon: Sparkles
  },
  {
    id: 'emociones',
    title: 'Gestión Emocional',
    description: 'Herramientas para manejar emociones difíciles',
    duration: '25 min',
    lessons: 6,
    completed: 0,
    category: 'Avanzado',
    color: 'bg-accent-soft text-accent-foreground',
    icon: Heart
  },
  {
    id: 'hambre-emocional',
    title: 'Hambre Emocional vs Física',
    description: 'Aprende a distinguir y responder apropiadamente',
    duration: '18 min',
    lessons: 4,
    completed: 1,
    category: 'Intermedio',
    color: 'bg-warning-soft text-warning-foreground',
    icon: Sparkles
  }
];

const lecciones = {
  'autocuidado': [
    { 
      id: 1, 
      title: 'Qué es el autocuidado real', 
      completed: true, 
      duration: '3 min',
      content: {
        intro: 'El autocuidado real va más allá de los baños de burbujas y las mascarillas faciales.',
        sections: [
          {
            title: 'Definición auténtica',
            content: 'El autocuidado es la práctica intencional de atender tus necesidades físicas, emocionales y mentales de manera sostenible y compasiva.'
          },
          {
            title: 'No es solo placer',
            content: 'A veces el autocuidado implica hacer cosas difíciles pero necesarias: establecer límites, ir al médico, o tener conversaciones incómodas.'
          },
          {
            title: 'Es una responsabilidad',
            content: 'Cuidarte no es egoísta, es esencial. No puedes dar lo que no tienes.'
          }
        ],
        reflection: '¿Qué creías que era el autocuidado antes de esta lección? ¿Cómo ha cambiado tu perspectiva?'
      }
    },
    { 
      id: 2, 
      title: 'Desmontando mitos', 
      completed: true, 
      duration: '4 min',
      content: {
        intro: 'Existen muchos mitos sobre el autocuidado que pueden sabotear tus esfuerzos.',
        sections: [
          {
            title: 'Mito: "Es caro"',
            content: 'El autocuidado efectivo puede ser gratuito: caminar, respirar conscientemente, decir "no" cuando es necesario.'
          },
          {
            title: 'Mito: "Es tiempo perdido"',
            content: 'Cuidarte te hace más productivo y resiliente a largo plazo. Es una inversión, no un gasto.'
          },
          {
            title: 'Mito: "Es egoísta"',
            content: 'Cuando te cuidas, tienes más energía y paciencia para los demás. Es un acto de amor hacia ti y otros.'
          }
        ],
        reflection: '¿Cuál de estos mitos has creído? ¿Cómo puedes replantearte el autocuidado?'
      }
    },
    { 
      id: 3, 
      title: 'Práctica: Tu ritual matutino', 
      completed: false, 
      duration: '5 min',
      content: {
        intro: 'Crea un ritual matutino que nutra tu bienestar desde el inicio del día.',
        sections: [
          {
            title: 'Elementos clave',
            content: 'Un buen ritual matutino incluye: conexión contigo mismo, movimiento suave, intención para el día.'
          },
          {
            title: 'Personaliza tu ritual',
            content: 'Puede ser 5 minutos de respiración, escribir gratitudes, estiramientos suaves, o simplemente beber agua consciente.'
          },
          {
            title: 'Consistencia sobre perfección',
            content: 'Es mejor 2 minutos cada día que 30 minutos una vez a la semana. La constancia crea el hábito.'
          }
        ],
        reflection: '¿Qué elementos incluirás en tu ritual matutino? ¿A qué hora lo harás?'
      }
    },
    { 
      id: 4, 
      title: 'Autocuidado en días difíciles', 
      completed: false, 
      duration: '3 min',
      content: {
        intro: 'Los días difíciles son cuando más necesitas autocuidado, pero también cuando es más difícil practicarlo.',
        sections: [
          {
            title: 'Versión mínima viable',
            content: 'Ten una versión súper simple de autocuidado para días difíciles: 3 respiraciones profundas, beber agua, llamar a alguien.'
          },
          {
            title: 'Autocompasión primero',
            content: 'En lugar de juzgarte por tener un mal día, trátate como tratarías a un amigo querido.'
          },
          {
            title: 'Busca apoyo',
            content: 'Los días difíciles no son para atravesarlos solo. Pide ayuda cuando la necesites.'
          }
        ],
        reflection: '¿Cuál será tu plan de autocuidado para los días difíciles?'
      }
    },
  ],
  'mindfulness': [
    {
      id: 1,
      title: 'Las señales de tu cuerpo',
      completed: false,
      duration: '5 min',
      content: {
        intro: 'Tu cuerpo te envía constantemente señales sobre el hambre y la saciedad. Aprender a escucharlas es el primer paso.',
        sections: [
          {
            title: 'Reconociendo el hambre física',
            content: 'El hambre física aparece gradualmente: gruñidos del estómago, baja energía, dificultad para concentrarse. Es tu cuerpo pidiendo combustible.'
          },
          {
            title: 'Identificando la saciedad',
            content: 'La saciedad no es llenura completa. Es esa sensación sutil de satisfacción, cuando el hambre desaparece y te sientes cómodo.'
          },
          {
            title: 'Factores que interfieren',
            content: 'El estrés, las distracciones, comer muy rápido o estar desconectado de tu cuerpo pueden hacer que ignores estas señales.'
          }
        ],
        reflection: '¿Cuándo fue la última vez que realmente sentiste hambre física? ¿Cómo la diferencias de otros tipos de "hambre"?'
      }
    },
    {
      id: 2,
      title: 'Mindful eating: comer con atención',
      completed: false,
      duration: '6 min',
      content: {
        intro: 'Comer consciente significa prestar atención completa a la experiencia de alimentarse.',
        sections: [
          {
            title: 'Los 5 sentidos',
            content: 'Involucra vista, olfato, tacto, gusto y oído. Observa colores, texturas, aromas. Mastica lentamente y saborea cada bocado.'
          },
          {
            title: 'Sin distracciones',
            content: 'Apaga el teléfono, la TV, cierra el libro. La comida merece tu atención completa para que puedas registrar saciedad.'
          },
          {
            title: 'Gratitud por el alimento',
            content: 'Reconoce el camino que hizo la comida hasta llegar a ti. Esta conexión profundiza tu relación con la alimentación.'
          }
        ],
        reflection: '¿Qué distracciones sueles tener mientras comes? ¿Cómo puedes crear un ambiente más consciente?'
      }
    },
    {
      id: 3,
      title: 'Ejercicio práctico: La uva pasa',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'Un ejercicio clásico para experimentar la alimentación consciente usando todos los sentidos.',
        sections: [
          {
            title: 'Preparación',
            content: 'Toma una uva pasa (o cualquier alimento pequeño). Siéntate cómodamente y elimina distracciones.'
          },
          {
            title: 'Exploración sensorial',
            content: 'Observa: color, forma, textura. Toca: suavidad, rugosidad. Huele: ¿qué aromas detectas? Escucha: ¿hace algún sonido?'
          },
          {
            title: 'Degustación consciente',
            content: 'Colócala en tu boca sin masticar. Siente la textura. Mastica lentamente, notando cómo cambian sabor y textura. Traga conscientemente.'
          }
        ],
        reflection: '¿Qué descubriste en este ejercicio que nunca habías notado antes? ¿Cómo se sintió comer tan lentamente?'
      }
    },
    {
      id: 4,
      title: 'Implementando en la vida diaria',
      completed: false,
      duration: '5 min',
      content: {
        intro: 'Cómo llevar la alimentación consciente a tus comidas cotidianas sin que sea abrumador.',
        sections: [
          {
            title: 'Empezar pequeño',
            content: 'No necesitas hacer todas las comidas conscientes. Empieza con los primeros 3 bocados de cada comida.'
          },
          {
            title: 'Pausas durante la comida',
            content: 'Deja los cubiertos cada pocos bocados. Pregúntate: ¿Todavía tengo hambre? ¿Cómo me siento?'
          },
          {
            title: 'Ambiente propicio',
            content: 'Come sentado, en un lugar tranquilo cuando sea posible. Si comes parado o con prisa, al menos haz 3 respiraciones antes de empezar.'
          }
        ],
        reflection: '¿En qué comida del día te comprometes a practicar alimentación consciente esta semana?'
      }
    }
  ],
  'emociones': [
    {
      id: 1,
      title: 'Entendiendo tus emociones',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'Las emociones son mensajeros que nos dan información valiosa sobre nuestras necesidades.',
        sections: [
          {
            title: 'Las emociones no son el problema',
            content: 'Todas las emociones son válidas y tienen una función. El problema surge cuando no sabemos gestionarlas de manera saludable.'
          },
          {
            title: 'La rueda emocional',
            content: 'Existen emociones básicas (alegría, tristeza, miedo, ira) y matices más específicos (frustración, melancolía, ansiedad, euforia).'
          },
          {
            title: 'Emociones y cuerpo',
            content: 'Las emociones se sienten físicamente: tensión en hombros (estrés), nudo en estómago (ansiedad), calor en cara (ira).'
          }
        ],
        reflection: '¿Qué emociones te resultan más difíciles de manejar? ¿Cómo las sientes en tu cuerpo?'
      }
    },
    {
      id: 2,
      title: 'La técnica RAIN',
      completed: false,
      duration: '5 min',
      content: {
        intro: 'RAIN es una técnica de mindfulness para relacionarte con las emociones difíciles de manera compasiva.',
        sections: [
          {
            title: 'R - Reconocer',
            content: 'Pausa y nombra lo que está pasando: "Estoy sintiendo ansiedad" o "Hay tristeza aquí". No juzgues, solo reconoce.'
          },
          {
            title: 'A - Aceptar/Acoger',
            content: 'Permite que la emoción esté ahí sin tratar de cambiarla inmediatamente. "Está bien sentir esto". La resistencia amplifica el sufrimiento.'
          },
          {
            title: 'I - Investigar',
            content: 'Con curiosidad amable, explora: ¿Cómo se siente en mi cuerpo? ¿Qué pensamientos acompañan esta emoción? ¿Qué necesito ahora?'
          },
          {
            title: 'N - No identificarse',
            content: 'Recuerda que tú no eres la emoción. "Estoy experimentando tristeza" no "Soy una persona triste". Las emociones pasan.'
          }
        ],
        reflection: '¿Puedes pensar en una situación reciente donde RAIN te habría ayudado? ¿Qué paso te resulta más difícil?'
      }
    },
    {
      id: 3,
      title: 'Respiración para la regulación',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'La respiración es una herramienta poderosa y siempre disponible para regular el sistema nervioso.',
        sections: [
          {
            title: 'Respiración 4-7-8',
            content: 'Inhala por 4 segundos, mantén por 7, exhala por 8. Esta técnica activa el sistema nervioso parasimpático (relajación).'
          },
          {
            title: 'Respiración del corazón',
            content: 'Coloca una mano en el corazón. Respira como si el aire entrara y saliera del corazón. Imagina enviándote amor con cada respiración.'
          },
          {
            title: 'Cuándo usar cada una',
            content: '4-7-8 para ansiedad aguda o antes de dormir. Respiración del corazón para tristeza, autocrítica o cuando necesitas autocompasión.'
          }
        ],
        reflection: '¿Cuál de estas técnicas resuena más contigo? ¿En qué momentos del día podrías usarlas?'
      }
    },
    {
      id: 4,
      title: 'Autocompasión en momentos difíciles',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'La autocompasión no es autocomplacencia, es tratarte con la misma bondad que le ofrecerías a un buen amigo.',
        sections: [
          {
            title: 'Los tres componentes',
            content: 'Auto-bondad (en lugar de auto-crítica), humanidad común (no estás solo en esto), mindfulness (observar sin dramatizar).'
          },
          {
            title: 'Frases de autocompasión',
            content: '"Este es un momento difícil", "El sufrimiento es parte de la vida", "Que pueda ser bondadoso conmigo mismo ahora".'
          },
          {
            title: 'El toque suave',
            content: 'Coloca tu mano en el corazón, abraza tus brazos, o toca suavemente tu mejilla. El toque físico libera oxitocina y calma el sistema nervioso.'
          }
        ],
        reflection: '¿Cómo te hablas a ti mismo en momentos difíciles? ¿Qué cambiarías para ser más compasivo?'
      }
    },
    {
      id: 5,
      title: 'Journaling emocional',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'Escribir sobre las emociones ayuda a procesarlas y ganar claridad sobre lo que realmente está pasando.',
        sections: [
          {
            title: 'Escritura libre',
            content: 'Escribe durante 5-10 minutos sin parar, sin censurar. Deja que fluya todo lo que sientes. No importa si no tiene sentido.'
          },
          {
            title: 'Preguntas guía',
            content: '¿Qué estoy sintiendo ahora? ¿Qué necesito en este momento? ¿Qué me ayudaría a sentirme más en paz?'
          },
          {
            title: 'Patrón emocional',
            content: 'Con el tiempo, notarás patrones: situaciones que te activan, emociones recurrentes, estrategias que te funcionan.'
          }
        ],
        reflection: '¿Has notado que escribir sobre tus emociones te ayuda? ¿Qué descubres cuando pones sentimientos en palabras?'
      }
    },
    {
      id: 6,
      title: 'Plan de acción personalizado',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'Crea tu kit de herramientas personal para momentos emocionales difíciles.',
        sections: [
          {
            title: 'Identificar señales tempranas',
            content: '¿Cómo sabes que una emoción difícil se aproxima? Tensión muscular, cambios en el sueño, irritabilidad, etc.'
          },
          {
            title: 'Tu caja de herramientas',
            content: 'Lista 3-5 estrategias que funcionan para ti: llamar a alguien, caminar, música, baño caliente, respiración, escritura.'
          },
          {
            title: 'Red de apoyo',
            content: 'Identifica 2-3 personas a quienes puedes recurrir. Ten sus números disponibles. Practica pedir ayuda antes de necesitarla desesperadamente.'
          }
        ],
        reflection: '¿Cuáles son tus herramientas más efectivas? ¿Qué obstáculos te impiden usarlas cuando más las necesitas?'
      }
    }
  ],
  'hambre-emocional': [
    {
      id: 1,
      title: 'Diferencias clave: física vs emocional',
      completed: true,
      duration: '4 min',
      content: {
        intro: 'Aprender a distinguir entre hambre física y emocional es fundamental para una relación sana con la comida.',
        sections: [
          {
            title: 'Hambre física',
            content: 'Aparece gradualmente, cualquier comida la satisface, se siente en el estómago, aparece 3-5 horas después de comer.'
          },
          {
            title: 'Hambre emocional',
            content: 'Aparece súbitamente, busca comidas específicas (usualmente dulces/procesadas), se siente "en la cabeza", no se relaciona con tiempo desde la última comida.'
          },
          {
            title: 'Después de comer',
            content: 'Hambre física: satisfacción y energía. Hambre emocional: a menudo culpa, vergüenza, o la emoción original sigue ahí.'
          }
        ],
        reflection: '¿Puedes recordar un episodio reciente de hambre emocional? ¿Qué características tenía?'
      }
    },
    {
      id: 2,
      title: 'Emociones que activan el comer',
      completed: false,
      duration: '5 min',
      content: {
        intro: 'Identificar qué emociones te llevan a buscar comida es el primer paso para responder de manera diferente.',
        sections: [
          {
            title: 'Emociones comunes',
            content: 'Estrés, aburrimiento, soledad, tristeza, ansiedad, celebración, frustración. Cada persona tiene sus "triggers" específicos.'
          },
          {
            title: 'La comida como regulador',
            content: 'Usamos la comida para calmar, distraer, recompensar o llenar vacíos emocionales. Es una estrategia que funciona a corto plazo.'
          },
          {
            title: 'Identificando tu patrón',
            content: '¿Qué emociones te llevan a la comida? ¿En qué momentos del día? ¿Hay situaciones específicas que lo desencadenan?'
          }
        ],
        reflection: '¿Cuál es tu emoción "trigger" más común? ¿Qué tipo de comida buscas cuando la sientes?'
      }
    },
    {
      id: 3,
      title: 'La pausa consciente',
      completed: false,
      duration: '5 min',
      content: {
        intro: 'Crear un espacio entre el impulso y la acción te da la oportunidad de elegir conscientemente.',
        sections: [
          {
            title: 'El método STOP',
            content: 'S-Stop (para), T-Take a breath (respira), O-Observe (observa qué sientes), P-Proceed (procede conscientemente).'
          },
          {
            title: 'Preguntas poderosas',
            content: '¿Realmente tengo hambre? ¿Qué estoy sintiendo ahora? ¿Qué necesito realmente? ¿La comida resolverá esto?'
          },
          {
            title: 'Los primeros 10 minutos',
            content: 'Comprométete a esperar 10 minutos antes de comer cuando sospeches que es hambre emocional. A menudo el impulso pasa.'
          }
        ],
        reflection: '¿Qué te resulta más difícil: parar, respirar, observar o proceder conscientemente? ¿Por qué?'
      }
    },
    {
      id: 4,
      title: 'Alternativas saludables',
      completed: false,
      duration: '4 min',
      content: {
        intro: 'Desarrollar un repertorio de alternativas satisface las necesidades emocionales sin usar la comida.',
        sections: [
          {
            title: 'Para diferentes emociones',
            content: 'Estrés: respiración, movimiento. Aburrimiento: actividad creativa. Soledad: llamar a alguien. Tristeza: autocuidado gentil.'
          },
          {
            title: 'Lista de emergencia',
            content: 'Ten una lista visible de 10 alternativas: ducha caliente, música, mascotas, arte, caminar, té, llamada, estiramiento, lectura.'
          },
          {
            title: 'Si eliges comer',
            content: 'A veces elegirás comer y está bien. Hazlo conscientemente, sin culpa, disfrutando, y luego atiende la emoción subyacente.'
          }
        ],
        reflection: '¿Qué alternativas han funcionado para ti en el pasado? ¿Cuáles te gustaría probar?'
      }
    }
  ]
};

export default function Talleres() {
  const navigate = useNavigate();
  const [selectedTaller, setSelectedTaller] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  // Vista de contenido de lección específica
  if (selectedTaller && selectedLesson) {
    const taller = talleres.find(t => t.id === selectedTaller)!;
    const lessons = lecciones[selectedTaller as keyof typeof lecciones] || [];
    const lesson = lessons.find(l => l.id === selectedLesson)!;
    
    return (
      <div className="min-h-screen bg-background-subpage p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLesson(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {lesson.title}
            </h1>
            <div></div>
          </div>

          {/* Contenido de la lección */}
          <Card className="mb-6 bg-gradient-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-soft rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {lesson.duration}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{lesson.content.intro}</p>
              
              <div className="space-y-6">
                {lesson.content.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-heading font-medium text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reflexión */}
              <div className="mt-8 p-4 bg-accent-soft rounded-lg border border-accent/20">
                <h4 className="font-heading font-medium text-accent-foreground mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Reflexión
                </h4>
                <p className="text-sm text-accent-foreground/80">
                  {lesson.content.reflection}
                </p>
              </div>

              {/* Botón de completar */}
              {!lesson.completed && (
                <Button 
                  className="w-full mt-6"
                  onClick={() => {
                    // Aquí se podría agregar lógica para marcar como completada
                    setSelectedLesson(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como completada
                </Button>
              )}

              {/* Navegación entre lecciones */}
              <div className="flex justify-between mt-4">
                {selectedLesson > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedLesson(selectedLesson - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                )}
                {selectedLesson < lessons.length && (
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLesson(selectedLesson + 1)}
                    className="ml-auto"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedTaller) {
    const taller = talleres.find(t => t.id === selectedTaller)!;
    const lessons = lecciones[selectedTaller as keyof typeof lecciones] || [];

    return (
      <div className="min-h-screen bg-background-subpage p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedTaller(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              {taller.title}
            </h1>
            <div></div>
          </div>

          {/* Progreso del taller */}
          <Card className="mb-6 bg-gradient-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <taller.icon className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <h3 className="font-heading font-medium text-foreground">{taller.title}</h3>
                  <p className="text-sm text-muted-foreground">{taller.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {taller.completed} de {taller.lessons} lecciones
                  </span>
                  <span className="font-medium text-primary">
                    {getProgressPercentage(taller.completed, taller.lessons)}%
                  </span>
                </div>
                <Progress 
                  value={getProgressPercentage(taller.completed, taller.lessons)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

            {/* Lista de lecciones */}
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className={`transition-all duration-200 cursor-pointer ${
                    lesson.completed 
                      ? 'bg-success-soft border-success hover:shadow-card' 
                      : 'bg-gradient-card hover:shadow-card'
                  }`}
                  onClick={() => setSelectedLesson(lesson.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        lesson.completed 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.completed && (
                          <Badge className="bg-success-soft text-success-foreground">
                            Completada
                          </Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-subpage p-4 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">
            Talleres Interactivos
          </h1>
          <div></div>
        </div>

        {/* Avatar */}
        <div className="mb-6">
          <Avatar 
            message="Los talleres te ayudarán a desarrollar herramientas prácticas para tu bienestar. Ve a tu ritmo, sin presión."
            mood="encouraging"
          />
        </div>

        {/* Talleres */}
        <div className="space-y-4">
          {talleres.map((taller) => {
            const IconComponent = taller.icon;
            return (
              <Card 
                key={taller.id}
                className="bg-gradient-card hover:shadow-warm transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTaller(taller.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-soft rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-medium text-foreground">
                          {taller.title}
                        </h3>
                        <Badge className={taller.color}>
                          {taller.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {taller.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {taller.duration}
                          </span>
                          <span>{taller.lessons} lecciones</span>
                        </div>
                        {taller.completed > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress 
                                value={getProgressPercentage(taller.completed, taller.lessons)} 
                                className="h-1"
                              />
                            </div>
                            <span className="text-xs text-primary font-medium">
                              {getProgressPercentage(taller.completed, taller.lessons)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Próximamente */}
        <Card className="mt-6 bg-gradient-warm">
          <CardContent className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-accent-foreground mx-auto mb-2" />
            <h3 className="font-heading font-medium text-accent-foreground mb-1">
              Más talleres próximamente
            </h3>
            <p className="text-sm text-accent-foreground/80">
              Estamos preparando nuevos contenidos para apoyar tu crecimiento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}