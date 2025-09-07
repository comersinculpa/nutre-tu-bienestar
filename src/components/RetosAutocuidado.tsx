import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle2, Circle, Calendar, Target, Heart, Leaf, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Actividad {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  reflexion?: string;
}

interface Reto {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'alimentacion' | 'autocompasion' | 'mindfulness';
  duracion: number;
  actividades: Actividad[];
  fechaInicio?: Date;
  fechaFin?: Date;
  activo: boolean;
  progreso: number;
}

const retosDisponibles: Reto[] = [
  {
    id: '1',
    titulo: 'Alimentación Consciente',
    descripcion: 'Desarrolla una relación más presente y amable con la comida',
    categoria: 'alimentacion',
    duracion: 7,
    activo: false,
    progreso: 0,
    actividades: [
      {
        id: '1-1',
        titulo: 'Comida sin distracciones',
        descripcion: 'Come una comida sin teléfono, TV o distracciones. Observa sabores, texturas y sensaciones.',
        completada: false
      },
      {
        id: '1-2',
        titulo: 'Pausa antes de comer',
        descripcion: 'Tómate 3 respiraciones profundas antes de comenzar a comer. Pregúntate: ¿Cómo me siento?',
        completada: false
      },
      {
        id: '1-3',
        titulo: 'Gratitud por los alimentos',
        descripcion: 'Agradece mentalmente por los alimentos que tienes. Reconoce el proceso que llegó hasta tu plato.',
        completada: false
      },
      {
        id: '1-4',
        titulo: 'Escuchar las señales del cuerpo',
        descripcion: 'Durante la comida, pausa y pregúntate: ¿Tengo hambre aún? ¿Estoy satisfecha?',
        completada: false
      },
      {
        id: '1-5',
        titulo: 'Masticar con consciencia',
        descripcion: 'Mastica cada bocado al menos 20 veces. Observa cómo cambian los sabores.',
        completada: false
      },
      {
        id: '1-6',
        titulo: 'Honrar los antojos',
        descripcion: 'Si tienes un antojo, pausa y pregúntate qué necesitas realmente. ¿Es hambre, sed, o una emoción?',
        completada: false
      },
      {
        id: '1-7',
        titulo: 'Reflexión semanal',
        descripcion: 'Reflexiona sobre tu semana de alimentación consciente. ¿Qué aprendiste sobre ti misma?',
        completada: false
      }
    ]
  },
  {
    id: '2',
    titulo: 'Autocompasión Diaria',
    descripcion: 'Cultiva una relación más amable contigo misma',
    categoria: 'autocompasion',
    duracion: 5,
    activo: false,
    progreso: 0,
    actividades: [
      {
        id: '2-1',
        titulo: 'Habla como a una buena amiga',
        descripcion: 'Cuando te critiques, pregúntate: ¿Qué le diría a una amiga en esta situación?',
        completada: false
      },
      {
        id: '2-2',
        titulo: 'Abrazo de autocompasión',
        descripcion: 'Cuando sientas dolor emocional, abraza tu pecho y di: "Este es un momento difícil, no estoy sola".',
        completada: false
      },
      {
        id: '2-3',
        titulo: 'Carta de perdón',
        descripcion: 'Escribe una carta perdonándote por algo que te reproches. Lee con compasión.',
        completada: false
      },
      {
        id: '2-4',
        titulo: 'Reconocer logros pequeños',
        descripcion: 'Al final del día, reconoce tres cosas que hiciste bien, por pequeñas que sean.',
        completada: false
      },
      {
        id: '2-5',
        titulo: 'Mantra de autocompasión',
        descripcion: 'Repite: "Me acepto como soy en este momento" cuando sientas autocrítica.',
        completada: false
      }
    ]
  },
  {
    id: '3',
    titulo: 'Presencia Mindful',
    descripcion: 'Conecta con el momento presente y reduce la ansiedad',
    categoria: 'mindfulness',
    duracion: 3,
    activo: false,
    progreso: 0,
    actividades: [
      {
        id: '3-1',
        titulo: 'Respiración 4-7-8',
        descripcion: 'Inhala 4 segundos, mantén 7, exhala 8. Repite 4 veces cuando sientas ansiedad.',
        completada: false
      },
      {
        id: '3-2',
        titulo: 'Escaneo corporal',
        descripcion: 'Dedica 5 minutos a observar las sensaciones en tu cuerpo, de la cabeza a los pies.',
        completada: false
      },
      {
        id: '3-3',
        titulo: 'Momento de gratitud',
        descripcion: 'Encuentra tres cosas en tu entorno inmediato por las que te sientes agradecida.',
        completada: false
      }
    ]
  }
];

export const RetosAutocuidado: React.FC = () => {
  const [retos, setRetos] = useState<Reto[]>(retosDisponibles);
  const [retoActivo, setRetoActivo] = useState<Reto | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar retos del localStorage
    const retosGuardados = localStorage.getItem('retos-autocuidado');
    if (retosGuardados) {
      setRetos(JSON.parse(retosGuardados));
    }
  }, []);

  useEffect(() => {
    // Encontrar reto activo
    const activo = retos.find(r => r.activo);
    setRetoActivo(activo || null);
  }, [retos]);

  const iniciarReto = (retoId: string) => {
    const nuevosRetos = retos.map(reto => {
      if (reto.id === retoId) {
        return {
          ...reto,
          activo: true,
          fechaInicio: new Date(),
          fechaFin: new Date(Date.now() + reto.duracion * 24 * 60 * 60 * 1000),
          progreso: 0
        };
      }
      return { ...reto, activo: false };
    });

    setRetos(nuevosRetos);
    localStorage.setItem('retos-autocuidado', JSON.stringify(nuevosRetos));
    
    toast({
      title: "¡Reto iniciado!",
      description: "Comienza tu viaje de autocuidado. ¡Tú puedes!",
    });
  };

  const completarActividad = (retoId: string, actividadId: string, reflexion?: string) => {
    const nuevosRetos = retos.map(reto => {
      if (reto.id === retoId) {
        const nuevasActividades = reto.actividades.map(actividad => {
          if (actividad.id === actividadId) {
            return { ...actividad, completada: true, reflexion };
          }
          return actividad;
        });

        const actividadesCompletadas = nuevasActividades.filter(a => a.completada).length;
        const progreso = (actividadesCompletadas / nuevasActividades.length) * 100;

        return {
          ...reto,
          actividades: nuevasActividades,
          progreso,
          activo: progreso < 100 ? reto.activo : false
        };
      }
      return reto;
    });

    setRetos(nuevosRetos);
    localStorage.setItem('retos-autocuidado', JSON.stringify(nuevosRetos));
    
    const reto = nuevosRetos.find(r => r.id === retoId);
    if (reto && reto.progreso === 100) {
      toast({
        title: "¡Reto completado! 🎉",
        description: `Has completado el reto "${reto.titulo}". ¡Felicidades por cuidarte!`,
      });
    } else {
      toast({
        title: "Actividad completada",
        description: "¡Gran trabajo! Cada paso cuenta en tu proceso de autocuidado.",
      });
    }
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'alimentacion': return <Leaf className="text-green-500" size={20} />;
      case 'autocompasion': return <Heart className="text-pink-500" size={20} />;
      case 'mindfulness': return <Compass className="text-purple-500" size={20} />;
      default: return <Target size={20} />;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'alimentacion': return 'bg-green-50 text-green-700 border-green-200';
      case 'autocompasion': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'mindfulness': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Vista del reto activo
  if (retoActivo) {
    const diasRestantes = retoActivo.fechaFin 
      ? Math.max(0, Math.ceil((new Date(retoActivo.fechaFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {getCategoriaIcon(retoActivo.categoria)}
            <h2 className="text-2xl font-bold text-foreground">{retoActivo.titulo}</h2>
          </div>
          <p className="text-muted-foreground">{retoActivo.descripcion}</p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className={getCategoriaColor(retoActivo.categoria)}>
              <Calendar size={14} className="mr-2" />
              {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Último día'}
            </Badge>
            <Badge variant="outline">
              {Math.round(retoActivo.progreso)}% completado
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progreso del Reto</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={retoActivo.progreso} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {retoActivo.actividades.filter(a => a.completada).length} de {retoActivo.actividades.length} actividades completadas
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Actividades del Reto</h3>
          
          {retoActivo.actividades.map((actividad, index) => (
            <Card key={actividad.id} className={cn(
              "transition-all duration-300",
              actividad.completada && "bg-muted/50 border-green-200"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => !actividad.completada && completarActividad(retoActivo.id, actividad.id)}
                    className="p-0 h-auto"
                    disabled={actividad.completada}
                  >
                    {actividad.completada ? 
                      <CheckCircle2 className="text-green-500" size={24} /> : 
                      <Circle className="text-muted-foreground" size={24} />
                    }
                  </Button>
                  
                  <div className="flex-1">
                    <CardTitle className={cn(
                      "text-base",
                      actividad.completada && "line-through text-muted-foreground"
                    )}>
                      Día {index + 1}: {actividad.titulo}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {actividad.descripcion}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {!actividad.completada && (
                <CardContent>
                  <ReflexionDialog 
                    actividad={actividad}
                    onCompletar={(reflexion) => completarActividad(retoActivo.id, actividad.id, reflexion)}
                  />
                </CardContent>
              )}
              
              {actividad.reflexion && (
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "Mi reflexión: {actividad.reflexion}"
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {retoActivo.progreso === 100 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 ¡Reto Completado!
              </h3>
              <p className="text-green-700">
                Has completado tu reto de autocuidado. ¡Es momento de celebrar este logro y elegir tu próximo reto!
              </p>
              <Button 
                onClick={() => setRetos(prev => prev.map(r => ({ ...r, activo: false })))}
                className="mt-4"
              >
                Elegir nuevo reto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Vista de selección de retos
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Retos de Autocuidado</h2>
        <p className="text-muted-foreground">
          Pequeños compromisos diarios que transforman tu relación contigo misma
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {retos.map(reto => (
          <Card key={reto.id} className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getCategoriaIcon(reto.categoria)}
                  <div className="flex-1">
                    <CardTitle className="text-xl">{reto.titulo}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {reto.descripcion}
                    </CardDescription>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-3">
                <Badge className={getCategoriaColor(reto.categoria)}>
                  {reto.categoria === 'alimentacion' && 'Alimentación Consciente'}
                  {reto.categoria === 'autocompasion' && 'Autocompasión'}
                  {reto.categoria === 'mindfulness' && 'Mindfulness'}
                </Badge>
                <Badge variant="outline">
                  {reto.duracion} días
                </Badge>
                {reto.progreso > 0 && (
                  <Badge variant="secondary">
                    {Math.round(reto.progreso)}% completado
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {reto.progreso === 100 ? (
                <Button onClick={() => iniciarReto(reto.id)} variant="outline" className="w-full">
                  Repetir reto
                </Button>
              ) : reto.progreso > 0 ? (
                <Button onClick={() => iniciarReto(reto.id)} className="w-full">
                  Continuar reto
                </Button>
              ) : (
                <Button onClick={() => iniciarReto(reto.id)} className="w-full">
                  Comenzar reto
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ReflexionDialog: React.FC<{
  actividad: Actividad;
  onCompletar: (reflexion?: string) => void;
}> = ({ actividad, onCompletar }) => {
  const [reflexion, setReflexion] = useState('');
  const [abierto, setAbierto] = useState(false);

  const completarConReflexion = () => {
    onCompletar(reflexion.trim() || undefined);
    setReflexion('');
    setAbierto(false);
  };

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Completar actividad
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actividad.titulo}</DialogTitle>
          <DialogDescription>
            {actividad.descripcion}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              Reflexiona sobre esta experiencia (opcional)
            </label>
            <Textarea
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              placeholder="¿Cómo te sentiste? ¿Qué aprendiste? ¿Qué fue desafiante?"
              className="mt-2"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button onClick={completarConReflexion}>
              ¡Completada!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};