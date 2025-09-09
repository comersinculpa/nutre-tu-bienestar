import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  GamepadIcon, 
  Puzzle, 
  Brain, 
  Heart, 
  Target, 
  Star,
  Users,
  Lightbulb
} from 'lucide-react';

const games = [
  {
    id: 'cartas-lo-que-no-se-ve',
    title: 'Cartas: Lo que no se ve',
    description: 'Explora las emociones y pensamientos ocultos detrás de los comportamientos alimentarios',
    icon: Heart,
    difficulty: 'Fácil',
    duration: '10-15 min',
    color: 'bg-gradient-to-br from-pink-500 to-rose-400'
  },
  {
    id: 'historias-encadenadas',
    title: 'Historias Encadenadas',
    description: 'Construye narrativas positivas sobre tu relación con la comida y tu cuerpo',
    icon: Lightbulb,
    difficulty: 'Medio',
    duration: '15-20 min',
    color: 'bg-gradient-to-br from-slate-500 to-slate-600'
  },
  {
    id: 'roles-critica-interna',
    title: 'Roles de la Crítica Interna',
    description: 'Identifica y transforma los patrones de autocrítica destructiva',
    icon: Brain,
    difficulty: 'Medio',
    duration: '20-25 min',
    color: 'bg-gradient-to-br from-purple-500 to-violet-400'
  },
  {
    id: 'semaforo-emocional',
    title: 'Semáforo Emocional',
    description: 'Aprende a reconocer y gestionar tus estados emocionales',
    icon: Target,
    difficulty: 'Fácil',
    duration: '5-10 min',
    color: 'bg-gradient-to-br from-green-500 to-emerald-400'
  },
  {
    id: 'mi-cuerpo-mi-historia',
    title: 'Mi Cuerpo, Mi Historia',
    description: 'Desarrolla una relación más compasiva y respetuosa con tu cuerpo',
    icon: Heart,
    difficulty: 'Avanzado',
    duration: '25-30 min',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-400'
  },
  {
    id: 'si-mi-tca-hablara',
    title: 'Si mi TCA hablara...',
    description: 'Externaliza y comprende mejor los patrones del trastorno alimentario',
    icon: Users,
    difficulty: 'Avanzado',
    duration: '20-30 min',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-400'
  },
  {
    id: 'verdad-falso-mitos',
    title: 'Verdad o Falso: Mitos Alimentarios',
    description: 'Desmonta mitos y creencias erróneas sobre alimentación y peso',
    icon: Puzzle,
    difficulty: 'Medio',
    duration: '15-20 min',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-400'
  }
];

export default function JuegosPage() {
  const navigate = useNavigate();

  const handleGameSelect = (gameId: string) => {
    // Aquí se navegaría al juego específico
    navigate(`/juegos/${gameId}`);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Medio': return 'bg-slate-100 text-slate-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background-subpage pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al menú
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
              <GamepadIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Juegos Educativos</h1>
              <p className="text-muted-foreground">Aprende y crece jugando</p>
            </div>
          </div>
        </div>
      </div>

      {/* Introducción */}
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Aprendizaje Terapéutico a Través del Juego
                </h2>
                <p className="text-blue-700 leading-relaxed">
                  Estos juegos están diseñados específicamente para ayudarte en tu proceso de recuperación. 
                  Cada actividad combina elementos lúdicos con técnicas terapéuticas validadas, 
                  creando un espacio seguro para explorar, aprender y crecer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de juegos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Actividades Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              
              return (
                <Card 
                  key={game.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20"
                  onClick={() => handleGameSelect(game.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-14 h-14 rounded-xl ${game.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {game.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Duración: {game.duration}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary hover:text-primary/80"
                      >
                        Jugar →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Consejos */}
        <Card className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  Consejos para Aprovechar al Máximo los Juegos
                </h3>
                <ul className="text-green-700 space-y-2">
                  <li>• Tómate el tiempo que necesites, no hay prisa</li>
                  <li>• Está bien sentir emociones intensas, es parte del proceso</li>
                  <li>• Si algo te resulta muy difícil, puedes pausar y volver después</li>
                  <li>• Recuerda que no hay respuestas "correctas" o "incorrectas"</li>
                  <li>• Comparte tus reflexiones con tu terapeuta si tienes uno</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}