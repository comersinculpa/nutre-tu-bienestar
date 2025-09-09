import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, MessageCircle, Heart, Share2, Lock } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const testimonios = [
  {
    id: 1,
    texto: "Llevo 3 semanas usando la app y por primera vez en meses me siento acompañada en mi proceso. El avatar me ayuda mucho en momentos difíciles.",
    fecha: "2024-01-20",
    etiquetas: ["autocuidado", "apoyo emocional"],
    likes: 12
  },
  {
    id: 2,
    texto: "La función de 'Pausa con Cuidado' me salvó de varios atracones. Respirar 30 segundos realmente marca la diferencia.",
    fecha: "2024-01-19",
    etiquetas: ["pausa", "mindfulness"],
    likes: 8
  },
  {
    id: 3,
    texto: "Me encanta poder ver mi progreso sin comparaciones. Cada pequeño paso cuenta y la app me lo recuerda siempre.",
    fecha: "2024-01-18",
    etiquetas: ["progreso", "motivación"],
    likes: 15
  }
];

const recursos = [
  {
    id: 1,
    tipo: 'Audio',
    titulo: 'Meditación: Amor propio',
    descripcion: 'Una meditación guiada de 10 minutos para cultivar la compasión hacia ti misma',
    duracion: '10 min',
    compartidoPor: 'Comunidad',
    fecha: '2024-01-21'
  },
  {
    id: 2,
    tipo: 'Guía',
    titulo: 'Mi ritual de autocuidado matutino',
    descripcion: 'Una rutina sencilla de 5 minutos que me ayuda a empezar el día con amabilidad',
    duracion: '5 min',
    compartidoPor: 'Usuario anónimo',
    fecha: '2024-01-20'
  },
  {
    id: 3,
    tipo: 'Audio',
    titulo: 'Respiración consciente para la ansiedad',
    descripcion: 'Ejercicio de respiración guiada para momentos de ansiedad antes de comer',
    duracion: '8 min',
    compartidoPor: 'María L.',
    fecha: '2024-01-19'
  },
  {
    id: 4,
    tipo: 'Ejercicio',
    titulo: 'Check-in corporal de 3 minutos',
    descripcion: 'Una práctica rápida para conectar con las sensaciones de hambre y saciedad',
    duracion: '3 min',
    compartidoPor: 'Comunidad',
    fecha: '2024-01-18'
  },
  {
    id: 5,
    tipo: 'Guía',
    titulo: 'Cómo hacer las paces con el espejo',
    descripcion: 'Pasos gentiles para mejorar tu relación con tu imagen corporal',
    duracion: '7 min',
    compartidoPor: 'Ana Sofia',
    fecha: '2024-01-17'
  },
  {
    id: 6,
    tipo: 'Audio',
    titulo: 'Mantras para momentos difíciles',
    descripcion: 'Frases poderosas para repetir cuando sientes culpa o vergüenza por comer',
    duracion: '6 min',
    compartidoPor: 'Comunidad',
    fecha: '2024-01-16'
  },
  {
    id: 7,
    tipo: 'Lista',
    titulo: 'Alternativas para el comer emocional',
    descripcion: '20 actividades que puedes hacer cuando sientes ganas de comer por emociones',
    duracion: '2 min',
    compartidoPor: 'Claudia M.',
    fecha: '2024-01-15'
  },
  {
    id: 8,
    tipo: 'Ejercicio',
    titulo: 'La práctica de la uva pasa',
    descripcion: 'Ejercicio completo de mindful eating que cambió mi relación con la comida',
    duracion: '12 min',
    compartidoPor: 'Usuario anónimo',
    fecha: '2024-01-14'
  },
  {
    id: 9,
    tipo: 'Audio',
    titulo: 'Meditación para la autocompasión',
    descripcion: 'Cultivar una voz interna más amable y comprensiva hacia ti misma',
    duracion: '15 min',
    compartidoPor: 'Comunidad',
    fecha: '2024-01-13'
  },
  {
    id: 10,
    tipo: 'Guía',
    titulo: 'Mi rutina nocturna de autocuidado',
    descripcion: 'Cómo termino cada día honrando mi cuerpo y mis emociones',
    duracion: '8 min',
    compartidoPor: 'Valentina R.',
    fecha: '2024-01-12'
  },
  {
    id: 11,
    tipo: 'Reflexión',
    titulo: 'Preguntas para conocer tu hambre emocional',
    descripcion: 'Una serie de preguntas que me ayudaron a identificar mis patrones',
    duracion: '5 min',
    compartidoPor: 'Laura C.',
    fecha: '2024-01-11'
  },
  {
    id: 12,
    tipo: 'Audio',
    titulo: 'Visualización: Mi cuerpo sabio',
    descripcion: 'Un ejercicio para reconectar con la sabiduría natural de tu cuerpo',
    duracion: '11 min',
    compartidoPor: 'Comunidad',
    fecha: '2024-01-10'
  },
  {
    id: 13,
    tipo: 'Lista',
    titulo: 'Afirmaciones para cada comida',
    descripcion: 'Frases positivas que me repito antes de desayunar, almorzar y cenar',
    duracion: '3 min',
    compartidoPor: 'Sofía P.',
    fecha: '2024-01-09'
  },
  {
    id: 14,
    tipo: 'Ejercicio',
    titulo: 'La técnica del semáforo emocional',
    descripcion: 'Un método simple para pausar antes de comer impulsivamente',
    duracion: '4 min',
    compartidoPor: 'Usuario anónimo',
    fecha: '2024-01-08'
  },
  {
    id: 15,
    tipo: 'Guía',
    titulo: 'Cómo crear un espacio seguro para comer',
    descripcion: 'Tips para transformar tu entorno y hacer de cada comida un momento de paz',
    duracion: '6 min',
    compartidoPor: 'Isabella M.',
    fecha: '2024-01-07'
  }
];

export default function Comunidad() {
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-calm p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-lg font-medium text-foreground">
              Comunidad
            </h1>
            <div></div>
          </div>

          <div className="mb-6">
            <Avatar 
              message="La comunidad es un espacio opcional donde puedes conectar con otras personas en procesos similares. Tu privacidad siempre está protegida."
              mood="supportive"
            />
          </div>

          <Card className="bg-gradient-card mb-6">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="font-heading text-foreground">
                Únete a nuestra comunidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-center text-sm">
                Un espacio seguro y anónimo donde compartir experiencias, recursos y apoyo mutuo en tu camino hacia una relación más sana con la comida.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Completamente anónimo</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Testimonios y experiencias</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Share2 className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Recursos compartidos</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Apoyo sin juicio</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setIsJoined(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  Unirme a la comunidad
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="w-full mt-2"
                >
                  Tal vez más tarde
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warm">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-accent-foreground">
                Recuerda: La comunidad es opcional. Puedes usar todas las funciones de la app sin unirte.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-heading text-lg font-medium text-foreground">
            Comunidad
          </h1>
          <div></div>
        </div>

        <Tabs defaultValue="testimonios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testimonios" className="font-body">Testimonios</TabsTrigger>
            <TabsTrigger value="recursos" className="font-body">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="testimonios" className="space-y-4">
            <Card className="bg-gradient-card">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-heading font-medium text-foreground mb-1">
                  Experiencias compartidas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Lee testimonios anónimos de la comunidad
                </p>
              </CardContent>
            </Card>

            {testimonios.map((testimonio) => (
              <Card key={testimonio.id} className="bg-gradient-card">
                <CardContent className="p-4">
                  <p className="text-foreground mb-4 leading-relaxed">
                    "{testimonio.texto}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {testimonio.etiquetas.map((etiqueta) => (
                      <Badge key={etiqueta} variant="secondary" className="text-xs">
                        {etiqueta}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(testimonio.fecha).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{testimonio.likes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recursos" className="space-y-4">
            <Card className="bg-gradient-card">
              <CardContent className="p-4 text-center">
                <Share2 className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-heading font-medium text-foreground mb-1">
                  Recursos compartidos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Herramientas y contenidos creados por la comunidad
                </p>
              </CardContent>
            </Card>

            {recursos.map((recurso) => (
              <Card key={recurso.id} className="bg-gradient-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-primary-soft text-primary-foreground">
                      {recurso.tipo}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-heading font-medium text-foreground mb-1">
                        {recurso.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {recurso.descripcion}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Por {recurso.compartidoPor}</span>
                        <span>{recurso.duracion}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}