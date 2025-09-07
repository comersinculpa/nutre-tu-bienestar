import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Meditacion {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: number;
  objetivo: string;
  audioUrl: string;
  favorita?: boolean;
}

const meditaciones: Meditacion[] = [
  {
    id: '1',
    titulo: 'Respiración para la Ansiedad',
    descripcion: 'Una práctica suave para calmar la mente cuando sientes ansiedad',
    duracion: 10,
    objetivo: 'ansiedad',
    audioUrl: '/audio/respiracion-ansiedad.mp3'
  },
  {
    id: '2',
    titulo: 'Aceptación Corporal',
    descripcion: 'Conecta con tu cuerpo desde el amor y la compasión',
    duracion: 15,
    objetivo: 'autocompasion',
    audioUrl: '/audio/aceptacion-corporal.mp3'
  },
  {
    id: '3',
    titulo: 'Calma antes de Comer',
    descripcion: 'Prepara tu mente y cuerpo para una comida consciente',
    duracion: 8,
    objetivo: 'alimentacion',
    audioUrl: '/audio/calma-comer.mp3'
  }
];

const objetivos = [
  { value: 'todos', label: 'Todos' },
  { value: 'ansiedad', label: 'Ansiedad' },
  { value: 'autocompasion', label: 'Autocompasión' },
  { value: 'alimentacion', label: 'Alimentación' },
  { value: 'sueno', label: 'Sueño' }
];

export const MeditacionesGuiadas: React.FC = () => {
  const [filtroObjetivo, setFiltroObjetivo] = useState('todos');
  const [reproduciendo, setReproduciendo] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [duracionActual, setDuracionActual] = useState(0);
  const [favoritas, setFavoritas] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const meditacionesFiltradas = meditaciones.filter(
    m => filtroObjetivo === 'todos' || m.objetivo === filtroObjetivo
  );

  const reproducir = (meditacion: Meditacion) => {
    if (reproduciendo === meditacion.id) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
    } else {
      setReproduciendo(meditacion.id);
      if (audioRef.current) {
        audioRef.current.src = meditacion.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const toggleFavorita = (id: string) => {
    setFavoritas(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const actualizarProgreso = () => {
      const progresoPorcentaje = (audio.currentTime / audio.duration) * 100;
      setProgreso(progresoPorcentaje);
      setDuracionActual(audio.currentTime);
    };

    const alTerminar = () => {
      setReproduciendo(null);
      setProgreso(0);
      setDuracionActual(0);
    };

    audio.addEventListener('timeupdate', actualizarProgreso);
    audio.addEventListener('ended', alTerminar);

    return () => {
      audio.removeEventListener('timeupdate', actualizarProgreso);
      audio.removeEventListener('ended', alTerminar);
    };
  }, []);

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Meditaciones Guiadas</h2>
        <p className="text-muted-foreground">
          Encuentra calma y equilibrio con nuestras prácticas guiadas
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {objetivos.map(objetivo => (
          <Button
            key={objetivo.value}
            variant={filtroObjetivo === objetivo.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroObjetivo(objetivo.value)}
            className="rounded-full"
          >
            {objetivo.label}
          </Button>
        ))}
      </div>

      {/* Lista de Meditaciones */}
      <div className="space-y-4">
        {meditacionesFiltradas.map(meditacion => (
          <Card key={meditacion.id} className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{meditacion.titulo}</CardTitle>
                  <CardDescription className="mt-1">
                    {meditacion.descripcion}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{meditacion.duracion} min</Badge>
                    <Badge variant="outline">{objetivos.find(o => o.value === meditacion.objetivo)?.label}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorita(meditacion.id)}
                  className={cn(
                    "ml-2 transition-colors",
                    favoritas.includes(meditacion.id) && "text-red-500 hover:text-red-600"
                  )}
                >
                  <Heart 
                    size={20} 
                    className={favoritas.includes(meditacion.id) ? "fill-current" : ""} 
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => reproducir(meditacion)}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                >
                  {reproduciendo === meditacion.id && !audioRef.current?.paused ? 
                    <Pause size={20} /> : <Play size={20} />
                  }
                </Button>

                {reproduciendo === meditacion.id && (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatearTiempo(duracionActual)}</span>
                      <span>{formatearTiempo(meditacion.duracion * 60)}</span>
                    </div>
                    <Slider
                      value={[progreso]}
                      max={100}
                      step={1}
                      className="flex-1"
                      onValueChange={([value]) => {
                        if (audioRef.current) {
                          const newTime = (value / 100) * audioRef.current.duration;
                          audioRef.current.currentTime = newTime;
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  );
};