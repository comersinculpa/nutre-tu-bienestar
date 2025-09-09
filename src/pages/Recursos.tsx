import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MeditacionesGuiadas } from '@/components/MeditacionesGuiadas';
import { EscrituraTerapeutica } from '@/components/EscrituraTerapeutica';
import { RespuestasConscientes } from '@/components/RespuestasConscientes';
import { RetosAutocuidado } from '@/components/RetosAutocuidado';
import { SpotifyIntegration } from '@/components/SpotifyIntegration';
import { ProgramaHipnosis } from '@/components/ProgramaHipnosis';
import { MandalasParaColorear } from '@/components/MandalasParaColorear';
import { JuegosEducativos } from '@/components/JuegosEducativos';
import { CocinaTerapeutica } from '@/components/CocinaTerapeutica';
import { MindfulEating } from '@/components/MindfulEating';

// Import icons separately to avoid conflicts
import { 
  Heart as HeartIcon, 
  BookOpen as BookOpenIcon, 
  Headphones as HeadphonesIcon, 
  PenTool as PenToolIcon, 
  Palette as PaletteIcon, 
  Music as MusicIcon, 
  Target as TargetIcon, 
  Sparkles as SparklesIcon, 
  Brain as BrainIcon,
  Utensils as UtensilsIcon
} from 'lucide-react';

type SeccionRecurso = 'menu' | 'meditaciones' | 'escritura' | 'respuestas' | 'retos' | 'mandalas' | 'musica' | 'hipnosis' | 'juegos-educativos' | 'cocina-terapeutica' | 'mindful-eating';

const recursos = [
  {
    id: 'meditaciones',
    categoria: 'Audio',
    titulo: 'Meditaciones Guiadas',
    descripcion: 'Sesiones de meditación para calmar la ansiedad y conectar con tu cuerpo',
    icono: HeadphonesIcon,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: 'escritura',
    categoria: 'Escritura',
    titulo: 'Escritura Terapéutica',
    descripcion: 'Ejercicios de escritura consciente para explorar emociones',
    icono: PenToolIcon,
    color: 'bg-green-50 text-green-600'
  },
  {
    id: 'respuestas',
    categoria: 'Apoyo',
    titulo: 'Respuestas Conscientes',
    descripcion: 'Mensajes de autocompasión para momentos difíciles',
    icono: HeartIcon,
    color: 'bg-pink-50 text-pink-600'
  },
  {
    id: 'retos',
    categoria: 'Crecimiento',
    titulo: 'Retos de Autocuidado',
    descripcion: 'Desafíos suaves para desarrollar hábitos de bienestar',
    icono: TargetIcon,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'mandalas',
    categoria: 'Creatividad',
    titulo: 'Mandalas para Colorear',
    descripcion: 'Actividades creativas para reducir el estrés y encontrar calma',
    icono: PaletteIcon,
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'musica',
    categoria: 'Música',
    titulo: 'Playlists de Bienestar',
    descripcion: 'Música cuidadosamente seleccionada para diferentes estados emocionales',
    icono: MusicIcon,
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    id: 'hipnosis',
    categoria: 'Terapia',
    titulo: 'Hipnosis Terapéutica',
    descripcion: 'Sesiones profesionales de hipnosis para transformar tu relación con la comida',
    icono: BrainIcon,
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'juegos-educativos',
    categoria: 'Crecimiento Personal',
    titulo: 'Juegos Educativos para Fortalecer tu Autocuidado',
    descripcion: 'Dinámicas interactivas para el autodescubrimiento en un espacio seguro de reflexión',
    icono: SparklesIcon,
    color: 'bg-teal-50 text-teal-600'
  },
  {
    id: 'cocina-terapeutica',
    categoria: 'Bienestar',
    titulo: 'Cocina Terapéutica',
    descripcion: 'Reconecta con la comida desde el placer y la intuición, sin etiquetas ni control',
    icono: HeartIcon,
    color: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'mindful-eating',
    categoria: 'Alimentación Consciente',
    titulo: 'Mindful Eating',
    descripcion: 'Audios breves para practicar alimentación consciente y conectar con tus sensaciones',
    icono: UtensilsIcon,
    color: 'bg-emerald-50 text-emerald-600'
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
        return <SpotifyIntegration />;
      case 'hipnosis':
        return <ProgramaHipnosis />;
      case 'juegos-educativos':
        return <JuegosEducativos />;
      case 'cocina-terapeutica':
        return <CocinaTerapeutica />;
      case 'mindful-eating':
        return <MindfulEating />;
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
