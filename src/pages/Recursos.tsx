import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Headphones, PenTool, Palette, Music, ArrowLeft, Target, Sparkles } from 'lucide-react';
import { MeditacionesGuiadas } from '@/components/MeditacionesGuiadas';
import { EscrituraTerapeutica } from '@/components/EscrituraTerapeutica';
import { RespuestasConscientes } from '@/components/RespuestasConscientes';
import { RetosAutocuidado } from '@/components/RetosAutocuidado';

type SeccionRecurso = 'menu' | 'meditaciones' | 'escritura' | 'respuestas' | 'retos' | 'mandalas' | 'musica';

const recursos = [
  {
    id: 'meditaciones',
    categoria: 'Audio',
    titulo: 'Meditaciones Guiadas',
    descripcion: 'Sesiones de meditación para calmar la ansiedad y conectar con tu cuerpo',
    icono: Headphones,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'escritura',
    categoria: 'Escritura',
    titulo: 'Escritura Terapéutica',
    descripcion: 'Ejercicios de escritura consciente para explorar emociones',
    icono: PenTool,
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'respuestas',
    categoria: 'Apoyo',
    titulo: 'Respuestas Conscientes',
    descripcion: 'Mensajes de autocompasión para momentos difíciles',
    icono: Heart,
    color: 'bg-pink-50 text-pink-600'
  },
  {
    id: 'retos',
    categoria: 'Crecimiento',
    titulo: 'Retos de Autocuidado',
    descripcion: 'Desafíos suaves para desarrollar hábitos de bienestar',
    icono: Target,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'mandalas',
    categoria: 'Creatividad',
    titulo: 'Mandalas para Colorear',
    descripcion: 'Actividades creativas para reducir el estrés y encontrar calma',
    icono: Palette,
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'musica',
    categoria: 'Música',
    titulo: 'Playlists de Bienestar',
    descripcion: 'Música cuidadosamente seleccionada para diferentes estados emocionales',
    icono: Music,
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export default function Recursos() {
  const [seccionActiva, setSeccionActiva] = useState<SeccionRecurso>('menu');

  const volverAlMenu = () => setSeccionActiva('menu');

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'meditaciones':
        return <MeditacionesGuiadas />;
      case 'escritura':
        return <EscrituraTerapeutica />;
      case 'respuestas':
        return <RespuestasConscientes />;
      case 'retos':
        return <RetosAutocuidado />;
      case 'mandalas':
        return <MandalasParaColorear />;
      case 'musica':
        return <PlaylistsBienestar />;
      default:
        return null;
    }
  };

  if (seccionActiva !== 'menu') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 pt-8 space-y-6">
          <Button 
            variant="ghost" 
            onClick={volverAlMenu}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver a Recursos
          </Button>
          
          {renderSeccion()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 pt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Recursos de Bienestar</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Herramientas y recursos diseñados para apoyarte en tu proceso de sanación y autocuidado.
            Todo en un espacio seguro y privado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.map((recurso) => {
            const Icono = recurso.icono;
            return (
              <Card 
                key={recurso.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSeccionActiva(recurso.id as SeccionRecurso)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${recurso.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icono size={24} />
                  </div>
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    {recurso.categoria}
                  </Badge>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {recurso.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-6">
                    {recurso.descripcion}
                  </CardDescription>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explorar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Componente placeholder para Mandalas
const MandalasParaColorear: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
        <Palette className="text-orange-500" size={24} />
        Mandalas para Colorear
      </h2>
      <p className="text-muted-foreground">
        Encuentra calma y creatividad coloreando hermosos mandalas
      </p>
    </div>
    
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <Sparkles className="mx-auto mb-4 text-orange-500" size={48} />
        <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
        <p className="text-muted-foreground">
          Esta sección estará disponible muy pronto con una colección de mandalas terapéuticos.
        </p>
      </CardContent>
    </Card>
  </div>
);

// Componente placeholder para Playlists
const PlaylistsBienestar: React.FC = () => (
  <div className="text-center space-y-6">
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
        <Music className="text-indigo-500" size={24} />
        Playlists de Bienestar
      </h2>
      <p className="text-muted-foreground">
        Música curativa para acompañar tu proceso de sanación
      </p>
    </div>
    
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <Music className="mx-auto mb-4 text-indigo-500" size={48} />
        <h3 className="text-lg font-semibold mb-2">Integración con Spotify</h3>
        <p className="text-muted-foreground mb-4">
          Conectaremos con Spotify para ofrecerte playlists personalizadas según tu estado emocional.
        </p>
        <Button variant="outline" disabled>
          Conectar con Spotify
        </Button>
      </CardContent>
    </Card>
  </div>
);