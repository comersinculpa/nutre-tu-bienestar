import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PenTool, Heart, Lightbulb, BookOpen, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ejercicio {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  prompt: string;
  contenido?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
}

const tiposEjercicio: Ejercicio[] = [
  {
    id: '1',
    tipo: 'gratitud',
    titulo: 'Diario de Gratitud',
    descripcion: 'Reconecta con lo positivo en tu día',
    prompt: 'Hoy estoy agradecida por... Escribe tres cosas que valoras de este día, por pequeñas que sean.'
  },
  {
    id: '2',
    tipo: 'autocompasion',
    titulo: 'Carta a Mi Yo Interior',
    descripcion: 'Practica la autocompasión contigo misma',
    prompt: 'Querida yo... Si fueras tu mejor amiga, ¿qué te dirías en este momento? Escribe una carta llena de comprensión y cariño.'
  },
  {
    id: '3',
    tipo: 'cuerpo',
    titulo: 'Carta a Mi Cuerpo',
    descripcion: 'Sana tu relación con tu cuerpo',
    prompt: 'Querido cuerpo... Es hora de hacer las paces. Escribe todo lo que quieras decirle a tu cuerpo, desde el amor y el respeto.'
  },
  {
    id: '4',
    tipo: 'reflexion',
    titulo: 'Reflexión Libre',
    descripcion: 'Deja que tus pensamientos fluyan',
    prompt: 'Hoy siento... Escribe libremente sobre lo que está pasando en tu mente y corazón ahora mismo.'
  }
];

export const EscrituraTerapeutica: React.FC = () => {
  const [ejerciciosGuardados, setEjerciciosGuardados] = useState<Ejercicio[]>([]);
  const [ejercicioActual, setEjercicioActual] = useState<Ejercicio | null>(null);
  const [contenido, setContenido] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar ejercicios guardados del localStorage
    const guardados = localStorage.getItem('ejercicios-escritura');
    if (guardados) {
      setEjerciciosGuardados(JSON.parse(guardados));
    }
  }, []);

  const iniciarEjercicio = (tipo: Ejercicio) => {
    setEjercicioActual({...tipo});
    setContenido('');
    setModoEdicion(true);
  };

  const editarEjercicio = (ejercicio: Ejercicio) => {
    setEjercicioActual(ejercicio);
    setContenido(ejercicio.contenido || '');
    setModoEdicion(true);
  };

  const guardarEjercicio = () => {
    if (!ejercicioActual || !contenido.trim()) return;

    const ejercicioCompleto: Ejercicio = {
      ...ejercicioActual,
      contenido,
      fechaCreacion: ejercicioActual.fechaCreacion || new Date(),
      fechaModificacion: new Date(),
      id: ejercicioActual.fechaCreacion ? ejercicioActual.id : Date.now().toString()
    };

    const nuevosEjercicios = ejercicioActual.fechaCreacion 
      ? ejerciciosGuardados.map(e => e.id === ejercicioCompleto.id ? ejercicioCompleto : e)
      : [...ejerciciosGuardados, ejercicioCompleto];

    setEjerciciosGuardados(nuevosEjercicios);
    localStorage.setItem('ejercicios-escritura', JSON.stringify(nuevosEjercicios));
    
    setModoEdicion(false);
    setEjercicioActual(null);
    setContenido('');

    toast({
      title: "Ejercicio guardado",
      description: "Tu escritura ha sido guardada de forma segura y privada.",
    });
  };

  const eliminarEjercicio = (id: string) => {
    const nuevosEjercicios = ejerciciosGuardados.filter(e => e.id !== id);
    setEjerciciosGuardados(nuevosEjercicios);
    localStorage.setItem('ejercicios-escritura', JSON.stringify(nuevosEjercicios));
    
    toast({
      title: "Ejercicio eliminado",
      description: "El ejercicio ha sido eliminado.",
    });
  };

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'gratitud': return <Heart className="text-pink-500" size={20} />;
      case 'autocompasion': return <Lightbulb className="text-yellow-500" size={20} />;
      case 'cuerpo': return <Heart className="text-green-500" size={20} />;
      default: return <PenTool className="text-blue-500" size={20} />;
    }
  };

  if (modoEdicion && ejercicioActual) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
            {getIconoTipo(ejercicioActual.tipo)}
            {ejercicioActual.titulo}
          </h3>
          <p className="text-muted-foreground">{ejercicioActual.descripcion}</p>
        </div>

        <Card>
          <CardHeader>
            <CardDescription className="text-base italic">
              "{ejercicioActual.prompt}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe aquí tus pensamientos..."
              className="min-h-[300px] resize-none text-base leading-relaxed"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setModoEdicion(false);
                  setEjercicioActual(null);
                  setContenido('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={guardarEjercicio} disabled={!contenido.trim()}>
                <Save size={16} className="mr-2" />
                Guardar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Escritura Terapéutica</h2>
        <p className="text-muted-foreground">
          Explora tus emociones a través de la escritura consciente
        </p>
      </div>

      {/* Ejercicios Disponibles */}
      <div className="grid gap-4 md:grid-cols-2">
        {tiposEjercicio.map(tipo => (
          <Card key={tipo.id} className="transition-all duration-300 hover:shadow-md cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                {getIconoTipo(tipo.tipo)}
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tipo.titulo}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {tipo.descripcion}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => iniciarEjercicio(tipo)}
                className="w-full"
                variant="outline"
              >
                <PenTool size={16} className="mr-2" />
                Comenzar a escribir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ejercicios Guardados */}
      {ejerciciosGuardados.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen size={20} />
            Mis Escritos
          </h3>
          
          <div className="grid gap-3">
            {ejerciciosGuardados.map(ejercicio => (
              <Card key={ejercicio.id} className="transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getIconoTipo(ejercicio.tipo)}
                      <div className="flex-1">
                        <CardTitle className="text-base">{ejercicio.titulo}</CardTitle>
                        <CardDescription className="mt-1">
                          {ejercicio.fechaCreacion && new Date(ejercicio.fechaCreacion).toLocaleDateString('es-ES')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <BookOpen size={14} className="mr-1" />
                            Leer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getIconoTipo(ejercicio.tipo)}
                              {ejercicio.titulo}
                            </DialogTitle>
                            <DialogDescription>
                              {ejercicio.fechaCreacion && new Date(ejercicio.fechaCreacion).toLocaleDateString('es-ES')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="whitespace-pre-wrap text-base leading-relaxed">
                            {ejercicio.contenido}
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button onClick={() => editarEjercicio(ejercicio)} variant="outline">
                              Editar
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => eliminarEjercicio(ejercicio.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {ejercicio.contenido && (
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {ejercicio.contenido}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};