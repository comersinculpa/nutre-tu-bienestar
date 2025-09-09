import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/components/UserProfile';
import { 
  Heart, 
  Headphones, 
  Users, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  AlertCircle,
  TrendingUp,
  User,
  HelpCircle,
  Wrench,
  Camera,
  Utensils,
  CheckCircle,
  PenTool,
  GamepadIcon,
  Palette,
  Music,
  Pause,
  Sparkles
} from 'lucide-react';

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
  color: string;
  badge?: string;
}

const menuOptions: MenuOption[] = [
  // Herramientas principales
  {
    id: 'diario-emocional',
    title: 'Diario Emocional',
    description: 'Registra y comprende tus emociones diarias',
    icon: Heart,
    path: '/diario-emocional',
    category: 'principal',
    color: 'bg-gradient-to-br from-pink-500 to-rose-400',
    badge: 'Esencial'
  },
  {
    id: 'apoyo-ia',
    title: 'Acompañante IA',
    description: 'Chatbot especializado para apoyo emocional 24/7',
    icon: MessageSquare,
    path: '/apoyo',
    category: 'principal',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    badge: 'Nuevo'
  },
  {
    id: 'registro-alimentario',
    title: 'Registro Alimentario',
    description: 'Lleva un seguimiento consciente de tu alimentación',
    icon: Utensils,
    path: '/registro-alimentario',
    category: 'principal',
    color: 'bg-gradient-to-br from-green-500 to-emerald-400'
  },
  {
    id: 'crisis',
    title: 'Apoyo de Crisis',
    description: 'Ayuda inmediata cuando más lo necesitas',
    icon: AlertCircle,
    path: '/crisis',
    category: 'principal',
    color: 'bg-gradient-to-br from-red-500 to-orange-400',
    badge: 'Urgente'
  },

  // Herramientas de bienestar
  {
    id: 'recursos-audio',
    title: 'Recursos de Audio',
    description: 'Meditaciones, respiraciones y contenido calmante',
    icon: Headphones,
    path: '/recursos',
    category: 'bienestar',
    color: 'bg-gradient-to-br from-purple-500 to-violet-400'
  },
  {
    id: 'pausa-mindful',
    title: 'Pausa Mindful',
    description: 'Técnicas de respiración y mindfulness',
    icon: Pause,
    path: '/pausa',
    category: 'bienestar',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-400'
  },
  {
    id: 'detector-hambre',
    title: 'Detector de Hambre',
    description: 'Identifica hambre física vs emocional',
    icon: Brain,
    path: '/detector-hambre',
    category: 'bienestar',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-400'
  },
  {
    id: 'check-in',
    title: 'Check-in Diario',
    description: 'Evaluación rápida de tu estado actual',
    icon: CheckCircle,
    path: '/check-in',
    category: 'bienestar',
    color: 'bg-gradient-to-br from-amber-500 to-orange-400'
  },

  // Comunidad y aprendizaje
  {
    id: 'comunidad',
    title: 'Comunidad',
    description: 'Conecta con otras personas en recuperación',
    icon: Users,
    path: '/comunidad',
    category: 'comunidad',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-400'
  },
  {
    id: 'talleres',
    title: 'Talleres',
    description: 'Talleres educativos y terapéuticos',
    icon: PenTool,
    path: '/talleres',
    category: 'comunidad',
    color: 'bg-gradient-to-br from-rose-500 to-pink-400'
  },
  {
    id: 'juegos-educativos',
    title: 'Juegos Educativos',
    description: 'Aprende jugando con actividades terapéuticas',
    icon: GamepadIcon,
    path: '/juegos',
    category: 'comunidad',
    color: 'bg-gradient-to-br from-yellow-500 to-amber-400'
  },

  // Seguimiento y progreso
  {
    id: 'progreso',
    title: 'Mi Progreso',
    description: 'Visualiza tu evolución y logros',
    icon: TrendingUp,
    path: '/progreso',
    category: 'seguimiento',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-400'
  },
  {
    id: 'cuestionarios',
    title: 'Cuestionarios',
    description: 'Evaluaciones y test de autoevaluación',
    icon: HelpCircle,
    path: '/cuestionarios',
    category: 'seguimiento',
    color: 'bg-gradient-to-br from-violet-500 to-purple-400'
  },
  {
    id: 'perfil',
    title: 'Mi Perfil',
    description: 'Configuración personal y preferencias',
    icon: User,
    path: '/perfil',
    category: 'seguimiento',
    color: 'bg-gradient-to-br from-slate-500 to-gray-400'
  }
];

const categories = {
  principal: { name: 'Herramientas Principales', icon: Sparkles },
  bienestar: { name: 'Bienestar y Mindfulness', icon: Heart },
  comunidad: { name: 'Comunidad y Aprendizaje', icon: Users },
  seguimiento: { name: 'Seguimiento y Progreso', icon: TrendingUp }
};

export default function MainMenu() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Buenos días');
    } else if (hour < 18) {
      setGreeting('Buenas tardes');
    } else {
      setGreeting('Buenas noches');
    }
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const groupedOptions = Object.entries(categories).map(([key, category]) => ({
    category: key,
    ...category,
    options: menuOptions.filter(option => option.category === key)
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header con usuario */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting} 👋
            </h1>
            <p className="text-muted-foreground">¿Qué necesitas hoy?</p>
          </div>
          <UserProfile />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Mensaje de bienvenida */}
        <div className="text-center space-y-4 py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Tu espacio de cuidado personal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aquí tienes todas las herramientas para acompañarte en tu proceso de recuperación y bienestar. 
            Cada paso cuenta, cada momento importa.
          </p>
        </div>

        {/* Menú por categorías */}
        <div className="space-y-12">
          {groupedOptions.map((group) => {
            const CategoryIcon = group.icon;
            
            return (
              <div key={group.category} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {group.name}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.options.map((option) => {
                    const Icon = option.icon;
                    
                    return (
                      <Card 
                        key={option.id}
                        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20"
                        onClick={() => handleNavigation(option.path)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            {option.badge && (
                              <Badge 
                                variant={option.badge === 'Urgente' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {option.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed">
                            {option.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje de apoyo */}
        <div className="text-center py-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">
                  Recuerda siempre
                </h3>
                <p className="text-muted-foreground italic">
                  "Este es tu espacio seguro. Aquí no hay juicios, solo comprensión y cuidado. 
                  Cada herramienta está diseñada para acompañarte con amor y respeto."
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => handleNavigation('/apoyo')}
                >
                  Hablar con mi Acompañante IA 💙
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}