import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/components/UserProfile';
import { TodayProgress } from '@/components/TodayProgress';
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
  Sparkles,
  ArrowRight,
  Play,
  ChevronRight,
  Zap,
  Timer
} from 'lucide-react';

// Import food/nutrition images
import heroWellbeing from '@/assets/hero-wellbeing.jpg';
import mindfulEating from '@/assets/mindful-eating.jpg';
import communitySupport from '@/assets/community-support.jpg';
import vibrantNutrition from '@/assets/vibrant-nutrition.jpg';
import progressTracking from '@/assets/progress-tracking.jpg';
import avatarCompanion from '@/assets/avatar-companion.jpg';
import crisisSupportWarm from '@/assets/crisis-support-warm.jpg';
import audioColorful from '@/assets/audio-colorful.jpg';
import breathingColorful from '@/assets/breathing-colorful.jpg';
import interactiveGames from '@/assets/interactive-games.jpg';
import mentalHealthSupport from '@/assets/mental-health-support.jpg';
import virtualWorkshops from '@/assets/virtual-workshops.jpg';
import evaluationTools from '@/assets/evaluation-tools.jpg';
import hungerAwareness from '@/assets/hunger-awareness.jpg';

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  category: string;
  color: string;
  gradient: string;
  image?: string;
  badge?: string;
  featured?: boolean;
  interactive?: boolean;
}

const menuOptions: MenuOption[] = [
  // Core Loop Principal - Check-in → Pausa → Registrar → Recompensa → Progreso
  {
    id: 'check-in-diario',
    title: 'Check-in Diario (60-90s)',
    description: 'Conexión rápida contigo: emoción, hambre, intención',
    icon: CheckCircle,
    path: '/check-in-diario',
    category: 'core',
    color: 'from-ochre-400 to-ochre-500',
    gradient: 'bg-gradient-brand',
    image: mindfulEating,
    badge: 'Diario',
    featured: true,
    interactive: true
  },
  {
    id: 'pausa-consciente',
    title: 'Pausa Consciente',
    description: 'Técnicas de 2-3 min: respiración, grounding, anclaje somático',
    icon: Pause,
    path: '/pausa-consciente',
    category: 'core',
    color: 'from-green-400 to-green-500',
    gradient: 'bg-gradient-green',
    image: breathingColorful,
    badge: 'Calma',
    featured: true,
    interactive: true
  },
  {
    id: 'comer-consciente',
    title: 'Comer con Cuidado',
    description: 'Registro unificado de emociones, hambre y alimentación consciente',
    icon: Heart,
    path: '/comer-con-cuidado',
    category: 'core',
    color: 'from-yellow-400 to-yellow-500',
    gradient: 'bg-gradient-yellow',
    image: vibrantNutrition,
    badge: 'Mindful',
    featured: true,
    interactive: true
  },
  {
    id: 'progreso',
    title: 'Mis Logros',
    description: 'Visualiza tu evolución y celebra cada paso en tu camino de bienestar',
    icon: TrendingUp,
    path: '/progreso',
    category: 'core',
    color: 'from-green-300 to-green-400',
    gradient: 'bg-gradient-green',
    image: progressTracking,
    badge: 'Logros',
    featured: true
  },

  // Apoyo esencial
  {
    id: 'apoyo-ia',
    title: 'Acompañante IA (24/7)',
    description: 'Apoyo inmediato con chips rápidos: ansiedad, pausar atracón, compañía',
    icon: MessageSquare,
    path: '/ia-companion',
    category: 'apoyo',
    color: 'from-ochre-300 to-ochre-400',
    gradient: 'bg-gradient-primary',
    image: avatarCompanion,
    badge: '24/7'
  },
  {
    id: 'recursos-audio',
    title: 'Escuchar',
    description: 'Meditaciones guiadas, ejercicios de respiración y audios relajantes',
    icon: Headphones,
    path: '/recursos',
    category: 'apoyo',
    color: 'from-yellow-300 to-yellow-400',
    gradient: 'bg-gradient-yellow',
    image: audioColorful
  },
  {
    id: 'comunidad',
    title: 'Comunidad',
    description: 'Conecta con personas que comprenden tu proceso de recuperación',
    icon: Users,
    path: '/comunidad',
    category: 'apoyo',
    color: 'from-green-300 to-green-400',
    gradient: 'bg-gradient-green',
    image: communitySupport
  },

  // Laboratorio - Herramientas adicionales
  {
    id: 'laboratorio',
    title: 'Laboratorio',
    description: 'Herramientas experimentales: mandalas, cocina, talleres y más',
    icon: Sparkles,
    path: '/laboratorio',
    category: 'extra',
    color: 'from-ochre-200 to-ochre-300',
    gradient: 'bg-gradient-warm',
    image: interactiveGames,
    badge: 'Extra'
  }
];

export default function MainMenu() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const featuredOptions = menuOptions.filter(option => option.featured);
  const regularOptions = menuOptions.filter(option => !option.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subpage to-background-submenu pb-24 relative overflow-hidden">
      {/* Interactive Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-ochre-300/10 to-ochre-400/10 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-300/10 to-green-400/10 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-300/10 to-yellow-400/10 rounded-full blur-3xl transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
      </div>

      {/* Modern Header with Warm Earth Tones */}
      <div className="relative overflow-hidden bg-background-subpage/90 backdrop-blur-md border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-ochre-400/5 via-green-300/5 to-yellow-300/5"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-ochre-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-ochre-600 via-green-600 to-yellow-600 bg-clip-text text-transparent">
                {greeting} 🌱
              </h1>
              <p className="text-muted-foreground mt-1">¿Cómo te quieres cuidar hoy?</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Hero Section marca comersinculpa */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroWellbeing} 
            alt="Bienestar y alimentación consciente" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-brand/5"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-ochre-500 rounded-full animate-pulse"></div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                <span className="bg-gradient-brand bg-clip-text text-transparent">Comer sin culpa</span>
              </h2>
              <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Tu espacio seguro para cultivar una relación saludable con la comida y las emociones
            </p>
            
            {/* Two main CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <Button 
                onClick={() => {
                  handleNavigation('/pausa-consciente');
                  // Vibración leve al iniciar pausa
                  if ('vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100]);
                  }
                }}
                className="group bg-gradient-to-r from-ochre-500 to-ochre-600 hover:from-ochre-600 hover:to-ochre-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:scale-110 hover:-rotate-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                    <Pause className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">Hacer una pausa ahora</div>
                    <div className="text-sm opacity-90">Respiración • 2-3 minutos</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={() => handleNavigation('/check-in-diario')}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 text-xl font-semibold rounded-2xl shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:scale-110 hover:rotate-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">Registrar cómo me siento</div>
                    <div className="text-sm opacity-90">Check-in • 60-90 segundos</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12 relative z-10">
        {/* Today's Progress */}
        <TodayProgress className="max-w-2xl mx-auto" />
        
        {/* Quick access to more tools */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Otras herramientas de apoyo</h3>
            <p className="text-muted-foreground">
              Cuando necesites acompañamiento adicional o quieras explorar
            </p>
          </div>

          {/* Simplified grid of support tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[...featuredOptions.slice(2), ...regularOptions.slice(0, 3)].map((option) => {
              const Icon = option.icon;
              
              return (
                <Card 
                  key={option.id}
                  className="group cursor-pointer hover:shadow-elegant transition-all duration-300 transform hover:scale-105 border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  onClick={() => handleNavigation(option.path)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${option.gradient} flex items-center justify-center shadow-soft`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {option.badge && (
                        <Badge 
                          variant="secondary"
                          className="text-xs bg-ochre-50 text-ochre-700 border-ochre-200"
                        >
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">
                      {option.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Inclusive message */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="p-6 bg-gradient-to-r from-ochre-50 via-green-50 to-ochre-50 rounded-2xl border border-ochre-100">
            <Heart className="h-8 w-8 text-ochre-600 mx-auto mb-3" />
            <p className="text-foreground font-medium mb-2">
              Tu bienestar, a tu ritmo
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              No importa si estás en casa preparando la cena, en la oficina entre reuniones, o cuidando de los peques. 
              Cada momento que dedicas a ti misma es válido y valioso. No hay una forma "correcta" de cuidarse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}