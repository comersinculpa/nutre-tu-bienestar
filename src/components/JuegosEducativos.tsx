import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, Brain, Eye, MessageCircle, Lightbulb, BookOpen, Users } from 'lucide-react';

// Import individual game components
import { CartasLoQueNoSeVe } from './games/CartasLoQueNoSeVe';
import { VerdadFalsoMitos } from './games/VerdadFalsoMitos';
import { MiCuerpoMiHistoria } from './games/MiCuerpoMiHistoria';
import { SiMiTCAHablara } from './games/SiMiTCAHablara';
import { JuegoSemaforo } from './games/JuegoSemaforo';
import { HistoriasEncadenadas } from './games/HistoriasEncadenadas';
import { JuegoRolesCriticaInterna } from './games/JuegoRolesCriticaInterna';

type JuegoActivo = 'menu' | 'cartas' | 'verdad-falso' | 'mi-cuerpo' | 'voz-tca' | 'semaforo' | 'historias' | 'critica-interna';

const juegos = [
  {
    id: 'cartas',
    titulo: 'Cartas: Lo que no se ve',
    descripcion: 'Visualiza y comprende las emociones ocultas detrás de tus conductas alimentarias',
    icono: Eye,
    color: 'bg-blue-50 text-blue-600',
    categoria: 'Autoconocimiento'
  },
  {
    id: 'verdad-falso',
    titulo: 'Verdad o Falso: Mitos sobre los TCA',
    descripcion: 'Identifica y desafía creencias erróneas para reducir la culpa y el autoestigma',
    icono: Brain,
    color: 'bg-green-50 text-green-600',
    categoria: 'Educación'
  },
  {
    id: 'mi-cuerpo',
    titulo: 'Mi cuerpo, mi historia',
    descripcion: 'Reconstruye tu relación con tu cuerpo a través de una narrativa personal',
    icono: Heart,
    color: 'bg-pink-50 text-pink-600',
    categoria: 'Aceptación corporal'
  },
  {
    id: 'voz-tca',
    titulo: 'Si mi TCA hablara',
    descripcion: 'Diferencia la voz crítica del TCA de tu propia voz sana y compasiva',
    icono: MessageCircle,
    color: 'bg-purple-50 text-purple-600',
    categoria: 'Diálogo interno'
  },
  {
    id: 'semaforo',
    titulo: 'Juego del semáforo',
    descripcion: 'Identifica tus señales emocionales internas para gestionar mejor tus respuestas',
    icono: Lightbulb,
    color: 'bg-slate-50 text-slate-600',
    categoria: 'Autorregulación'
  },
  {
    id: 'historias',
    titulo: 'Historias encadenadas',
    descripcion: 'Explora diferentes respuestas ante situaciones desafiantes de forma creativa',
    icono: BookOpen,
    color: 'bg-indigo-50 text-indigo-600',
    categoria: 'Exploración'
  },
  {
    id: 'critica-interna',
    titulo: 'Juego de roles con la crítica interna',
    descripcion: 'Practica respuestas compasivas para debilitar el poder de tu crítica interna',
    icono: Users,
    color: 'bg-slate-50 text-slate-600',
    categoria: 'Autocompasión'
  }
];

export function JuegosEducativos() {
  const [juegoActivo, setJuegoActivo] = useState<JuegoActivo>('menu');

  const volverAlMenu = () => setJuegoActivo('menu');

  const renderJuego = () => {
    switch (juegoActivo) {
      case 'cartas':
        return <CartasLoQueNoSeVe />;
      case 'verdad-falso':
        return <VerdadFalsoMitos />;
      case 'mi-cuerpo':
        return <MiCuerpoMiHistoria />;
      case 'voz-tca':
        return <SiMiTCAHablara />;
      case 'semaforo':
        return <JuegoSemaforo />;
      case 'historias':
        return <HistoriasEncadenadas />;
      case 'critica-interna':
        return <JuegoRolesCriticaInterna />;
      default:
        return null;
    }
  };

  if (juegoActivo !== 'menu') {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={volverAlMenu}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a Juegos Educativos
        </Button>
        
        {renderJuego()}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Juegos Educativos para Fortalecer tu Autocuidado</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Camino de autodescubrimiento. He preparado con mucho cariño estas dinámicas para ti, 
          diseñadas para ser un espacio seguro y de reflexión en tu proceso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {juegos.map((juego) => {
          const Icono = juego.icono;
          return (
            <Card 
              key={juego.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setJuegoActivo(juego.id as JuegoActivo)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-full ${juego.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icono size={24} />
                </div>
                <Badge variant="outline" className="w-fit mx-auto mb-2">
                  {juego.categoria}
                </Badge>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {juego.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-6">
                  {juego.descripcion}
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Comenzar Dinámica
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg text-center">
        <p className="text-sm text-muted-foreground italic">
          "Hablar de tus emociones es un acto de valentía."
        </p>
      </div>
    </div>
  );
}