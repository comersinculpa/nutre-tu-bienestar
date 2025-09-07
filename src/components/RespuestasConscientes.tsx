import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Heart, Pause, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RespuestaConsciente {
  id: string;
  mensaje: string;
  categoria: 'autocompasion' | 'regulacion' | 'aceptacion' | 'mindfulness';
  estadoEmocional: string[];
}

const respuestasConscientes: RespuestaConsciente[] = [
  {
    id: '1',
    mensaje: 'Estás haciendo lo mejor que puedes en este momento, y eso es suficiente.',
    categoria: 'autocompasion',
    estadoEmocional: ['ansiedad', 'culpa', 'tristeza']
  },
  {
    id: '2',
    mensaje: 'Tu valor no depende de lo que comes o dejas de comer. Eres valiosa tal como eres.',
    categoria: 'aceptacion',
    estadoEmocional: ['culpa', 'vergüenza']
  },
  {
    id: '3',
    mensaje: 'Respira profundamente. Este momento difícil también pasará.',
    categoria: 'regulacion',
    estadoEmocional: ['ansiedad', 'pánico', 'estrés']
  },
  {
    id: '4',
    mensaje: 'Cada paso que das hacia el autocuidado es un acto de valentía.',
    categoria: 'autocompasion',
    estadoEmocional: ['desánimo', 'tristeza']
  },
  {
    id: '5',
    mensaje: 'Observa tus pensamientos con curiosidad, no con juicio.',
    categoria: 'mindfulness',
    estadoEmocional: ['ansiedad', 'pensamientos negativos']
  },
  {
    id: '6',
    mensaje: 'Tu cuerpo es tu hogar, trátalo con el amor que merece.',
    categoria: 'aceptacion',
    estadoEmocional: ['insatisfacción corporal', 'autocrítica']
  },
  {
    id: '7',
    mensaje: 'No necesitas ser perfecta para ser digna de amor y cuidado.',
    categoria: 'autocompasion',
    estadoEmocional: ['perfeccionismo', 'autocrítica']
  },
  {
    id: '8',
    mensaje: 'Pausa. Conecta con tu respiración. Estás segura en este momento.',
    categoria: 'regulacion',
    estadoEmocional: ['pánico', 'ansiedad', 'urgencia']
  },
  {
    id: '9',
    mensaje: 'Tus emociones son válidas y merecen ser escuchadas con compasión.',
    categoria: 'aceptacion',
    estadoEmocional: ['culpa', 'confusión emocional']
  },
  {
    id: '10',
    mensaje: 'En este momento, todo lo que necesitas es estar presente contigo misma.',
    categoria: 'mindfulness',
    estadoEmocional: ['ansiedad', 'estrés', 'abrumación']
  }
];

const categorias = [
  { value: 'todas', label: 'Todas', icon: Sparkles },
  { value: 'autocompasion', label: 'Autocompasión', icon: Heart },
  { value: 'regulacion', label: 'Regulación', icon: Pause },
  { value: 'aceptacion', label: 'Aceptación', icon: Heart },
  { value: 'mindfulness', label: 'Mindfulness', icon: Compass }
];

export const RespuestasConscientes: React.FC = () => {
  const [respuestaActual, setRespuestaActual] = useState<RespuestaConsciente | null>(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');
  const [favoritas, setFavoritas] = useState<string[]>([]);

  const respuestasFiltradas = respuestasConscientes.filter(
    r => categoriaFiltro === 'todas' || r.categoria === categoriaFiltro
  );

  const obtenerRespuestaAleatoria = () => {
    const respuestasDisponibles = respuestasFiltradas.length > 0 ? respuestasFiltradas : respuestasConscientes;
    const indiceAleatorio = Math.floor(Math.random() * respuestasDisponibles.length);
    setRespuestaActual(respuestasDisponibles[indiceAleatorio]);
  };

  const toggleFavorita = (id: string) => {
    setFavoritas(prev => {
      const nuevasFavoritas = prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('respuestas-favoritas', JSON.stringify(nuevasFavoritas));
      return nuevasFavoritas;
    });
  };

  useEffect(() => {
    // Cargar favoritas del localStorage
    const favoritasGuardadas = localStorage.getItem('respuestas-favoritas');
    if (favoritasGuardadas) {
      setFavoritas(JSON.parse(favoritasGuardadas));
    }
    
    // Mostrar una respuesta inicial
    obtenerRespuestaAleatoria();
  }, []);

  useEffect(() => {
    // Actualizar respuesta cuando cambie el filtro
    if (categoriaFiltro !== 'todas') {
      obtenerRespuestaAleatoria();
    }
  }, [categoriaFiltro]);

  const getCategoriaIcon = (categoria: string) => {
    const cat = categorias.find(c => c.value === categoria);
    const Icon = cat?.icon || Sparkles;
    return <Icon size={16} />;
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'autocompasion': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'regulacion': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'aceptacion': return 'text-green-600 bg-green-50 border-green-200';
      case 'mindfulness': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Respuestas Conscientes</h2>
        <p className="text-muted-foreground">
          Mensajes de apoyo y comprensión para acompañarte
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categorias.map(categoria => {
          const Icon = categoria.icon;
          return (
            <Button
              key={categoria.value}
              variant={categoriaFiltro === categoria.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaFiltro(categoria.value)}
              className="rounded-full"
            >
              <Icon size={14} className="mr-2" />
              {categoria.label}
            </Button>
          );
        })}
      </div>

      {/* Respuesta Actual */}
      {respuestaActual && (
        <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl opacity-20 select-none">"</div>
            
            <blockquote className="text-xl font-medium leading-relaxed text-foreground px-4">
              {respuestaActual.mensaje}
            </blockquote>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge 
                variant="secondary" 
                className={cn("gap-1", getCategoriaColor(respuestaActual.categoria))}
              >
                {getCategoriaIcon(respuestaActual.categoria)}
                {categorias.find(c => c.value === respuestaActual.categoria)?.label}
              </Badge>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={obtenerRespuestaAleatoria} className="rounded-full">
                <RefreshCw size={16} className="mr-2" />
                Nueva respuesta
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toggleFavorita(respuestaActual.id)}
                className={cn(
                  "rounded-full transition-colors",
                  favoritas.includes(respuestaActual.id) && "text-red-500 hover:text-red-600"
                )}
              >
                <Heart 
                  size={16} 
                  className={cn(
                    "mr-2",
                    favoritas.includes(respuestaActual.id) && "fill-current"
                  )} 
                />
                {favoritas.includes(respuestaActual.id) ? 'En favoritas' : 'Favorita'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Respuestas Favoritas */}
      {favoritas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground text-center">
            Mis Respuestas Favoritas
          </h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {respuestasConscientes
              .filter(r => favoritas.includes(r.id))
              .map(respuesta => (
                <Card key={respuesta.id} className="transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm leading-relaxed">
                      "{respuesta.mensaje}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCategoriaColor(respuesta.categoria))}
                      >
                        {getCategoriaIcon(respuesta.categoria)}
                        <span className="ml-1">
                          {categorias.find(c => c.value === respuesta.categoria)?.label}
                        </span>
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorita(respuesta.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Heart size={14} className="fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};