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
  Sparkles,
  ArrowRight,
  Play,
  ChevronRight,
  Zap,
  Sun
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
  // Featured options with warm food colors
  {
    id: 'apoyo-ia',
    title: 'Acompañante IA',
    description: 'Tu compañero inteligente disponible 24/7 para apoyo emocional y guía personalizada',
    icon: MessageSquare,
    path: '/apoyo',
    category: 'featured',
    color: 'from-orange-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-orange-400 to-orange-500',
    image: avatarCompanion,
    badge: '24/7',
    featured: true,
    interactive: true
  },
  {
    id: 'diario-emocional',
    title: 'Diario Emocional',
    description: 'Registra y comprende tus emociones con herramientas de análisis inteligente',
    icon: Heart,
    path: '/diario-emocional',
    category: 'featured',
    color: 'from-peach-300 to-peach-400',
    gradient: 'bg-gradient-to-br from-peach-300 to-peach-400',
    image: mentalHealthSupport,
    badge: 'Esencial',
    featured: true
  },

  // Principal tools with warm food colors
  {
    id: 'registro-alimentario',
    title: 'Registro Alimentario',
    description: 'Seguimiento consciente y sin juicios de tu relación con la comida',
    icon: Utensils,
    path: '/registro-alimentario',
    category: 'principal',
    color: 'from-green-400 to-green-500',
    gradient: 'bg-gradient-to-br from-green-400 to-green-500',
    image: vibrantNutrition,
    interactive: true
  },
  {
    id: 'crisis',
    title: 'Apoyo de Crisis',
    description: 'Ayuda inmediata y recursos de emergencia cuando más los necesitas',
    icon: AlertCircle,
    path: '/crisis',
    category: 'principal',
    color: 'from-coral-300 to-coral-400',
    gradient: 'bg-gradient-to-br from-coral-300 to-coral-400',
    image: crisisSupportWarm,
    badge: 'Urgente',
    interactive: true
  },
  {
    id: 'recursos-audio',
    title: 'Recursos de Audio',
    description: 'Meditaciones guiadas, ejercicios de respiración y contenido calmante',
    icon: Headphones,
    path: '/recursos',
    category: 'principal',
    color: 'from-honey-300 to-honey-400',
    gradient: 'bg-gradient-to-br from-honey-300 to-honey-400',
    image: audioColorful,
    interactive: true
  },

  // Wellness tools with warm food colors
  {
    id: 'pausa-mindful',
    title: 'Pausa Mindful',
    description: 'Técnicas de respiración y mindfulness para momentos de calma',
    icon: Pause,
    path: '/pausa',
    category: 'bienestar',
    color: 'from-cream-300 to-cream-400',
    gradient: 'bg-gradient-to-br from-cream-300 to-cream-400',
    image: breathingColorful,
    interactive: true
  },
  {
    id: 'detector-hambre',
    title: 'Detector de Hambre',
    description: 'Aprende a diferenciar entre hambre física y emocional',
    icon: Brain,
    path: '/detector-hambre',
    category: 'bienestar',
    color: 'from-orange-300 to-orange-400',
    gradient: 'bg-gradient-to-br from-orange-300 to-orange-400'
  },
  {
    id: 'check-in',
    title: 'Check-in Diario',
    description: 'Evaluación rápida de tu estado emocional y físico',
    icon: CheckCircle,
    path: '/check-in',
    category: 'bienestar',
    color: 'from-peach-300 to-peach-400',
    gradient: 'bg-gradient-to-br from-peach-300 to-peach-400',
    image: mindfulEating
  },

  // Community with warm food colors
  {
    id: 'comunidad',
    title: 'Comunidad',
    description: 'Conecta con personas que entienden tu proceso de recuperación',
    icon: Users,
    path: '/comunidad',
    category: 'comunidad',
    color: 'from-coral-300 to-coral-400',
    gradient: 'bg-gradient-to-br from-coral-300 to-coral-400',
    image: communitySupport
  },
  {
    id: 'talleres',
    title: 'Talleres Virtuales',
    description: 'Sesiones educativas y terapéuticas con expertos',
    icon: PenTool,
    path: '/talleres',
    category: 'comunidad',
    color: 'from-honey-300 to-honey-400',
    gradient: 'bg-gradient-to-br from-honey-300 to-honey-400'
  },
  {
    id: 'juegos-educativos',
    title: 'Actividades Interactivas',
    description: 'Juegos terapéuticos diseñados para tu crecimiento personal',
    icon: GamepadIcon,
    path: '/juegos',
    category: 'comunidad',
    color: 'from-orange-300 to-orange-400',
    gradient: 'bg-gradient-to-br from-orange-300 to-orange-400',
    image: interactiveGames,
    interactive: true
  },

  // Progress tracking with warm food colors
  {
    id: 'progreso',
    title: 'Mi Progreso',
    description: 'Visualiza tu evolución y celebra cada logro en tu camino',
    icon: TrendingUp,
    path: '/progreso',
    category: 'seguimiento',
    color: 'from-green-300 to-green-400',
    gradient: 'bg-gradient-to-br from-green-300 to-green-400',
    image: progressTracking
  },
  {
    id: 'cuestionarios',
    title: 'Evaluaciones',
    description: 'Herramientas de autoevaluación para conocerte mejor',
    icon: HelpCircle,
    path: '/cuestionarios',
    category: 'seguimiento',
    color: 'from-peach-300 to-peach-400',
    gradient: 'bg-gradient-to-br from-peach-300 to-peach-400'
  }
];

export default function MainMenu() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
          className="absolute w-96 h-96 bg-gradient-to-br from-orange-300/20 to-peach-300/20 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-coral-300/20 to-honey-300/20 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-br from-cream-300/20 to-orange-300/20 rounded-full blur-3xl transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        ></div>
      </div>

      {/* Modern Header with Warm Food Accent */}
      <div className="relative overflow-hidden bg-background-subpage/90 backdrop-blur-md border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-peach-300/5 to-coral-300/5"></div>
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-peach-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-coral-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-peach-600 to-coral-600 bg-clip-text text-transparent">
                {greeting} 🍎
              </h1>
              <p className="text-muted-foreground mt-1">¿En qué te puedo acompañar hoy?</p>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Dynamic Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroWellbeing} 
            alt="Healthy food and wellbeing" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-peach-400/20"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Sun className="w-8 h-8 text-orange-500 animate-spin" style={{animationDuration: '8s'}} />
              <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Tu espacio de <span className="bg-gradient-to-r from-orange-600 via-peach-600 to-coral-600 bg-clip-text text-transparent">bienestar alimentario</span>
              </h2>
              <Zap className="w-8 h-8 text-peach-500 animate-bounce" />
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Herramientas diseñadas con calidez para acompañarte en una relación saludable con la comida y las emociones
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleNavigation('/apoyo')}
                className="bg-gradient-to-r from-orange-400 via-peach-400 to-coral-400 hover:from-orange-500 hover:via-peach-500 hover:to-coral-500 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Encontrar apoyo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleNavigation('/diario-emocional')}
                className="border-2 border-orange-300 hover:border-orange-400 text-orange-700 px-8 py-3 text-lg rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="mr-2 h-5 w-5" />
                Registrar emociones
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* Featured Tools with Interactive Elements */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 via-peach-100 to-coral-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <span className="text-orange-700 font-semibold">Herramientas Principales</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Tus aliados para el bienestar</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hoveredCard === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className="group relative cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:rotate-1"
                  onClick={() => handleNavigation(option.path)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 ${option.gradient} opacity-90`}></div>
                  {option.image && (
                    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                      <img 
                        src={option.image} 
                        alt={option.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {option.interactive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                  <div className="relative z-10 p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                        <Icon className="w-8 h-8" />
                      </div>
                      {option.badge && (
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 animate-pulse">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-2xl font-bold mb-3">{option.title}</h4>
                    <p className="text-white/90 leading-relaxed mb-6">{option.description}</p>
                    <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="font-medium">Comenzar</span>
                      <ArrowRight className={`h-4 w-4 transition-transform duration-500 ${isHovered ? 'translate-x-2 scale-125' : ''}`} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Regular Tools Grid with Warm Food Colors */}
        <section>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-peach-600 to-coral-600 bg-clip-text text-transparent mb-2">
              Todas las herramientas de bienestar
            </h3>
            <p className="text-muted-foreground">Descubre todo lo que tenemos para acompañarte hacia una relación saludable con la comida</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOptions.map((option, index) => {
              const Icon = option.icon;
              const isHovered = hoveredCard === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-2 border-0 shadow-md overflow-hidden bg-white/80 backdrop-blur-sm"
                  onClick={() => handleNavigation(option.path)}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {option.image && (
                    <div className="h-32 overflow-hidden relative">
                      <img 
                        src={option.image} 
                        alt={option.title}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                      {option.interactive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${option.gradient} flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-45 transition-transform duration-500`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {option.badge && (
                        <Badge 
                          variant={option.badge === 'Urgente' ? 'destructive' : 'secondary'}
                          className="text-xs animate-bounce"
                        >
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {option.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {option.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                        {option.category === 'principal' && 'Herramienta Principal'}
                        {option.category === 'bienestar' && 'Bienestar'}
                        {option.category === 'comunidad' && 'Comunidad'}
                        {option.category === 'seguimiento' && 'Seguimiento'}
                      </span>
                      <ChevronRight className={`h-4 w-4 text-gray-400 group-hover:text-green-600 transition-all duration-500 ${isHovered ? 'translate-x-2 scale-125' : ''}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Rainbow Call to Action */}
        <section className="text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-green-200 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10"></div>
            <CardContent className="p-12 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    ¿Primera vez aquí?
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Te recomendamos empezar hablando con tu Acompañante IA. Está entrenado específicamente 
                    para ayudarte a encontrar la calma y navegar por todas las herramientas según tus necesidades del momento.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => handleNavigation('/apoyo')}
                      className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 hover:from-green-500 hover:via-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Empezar conversación
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleNavigation('/recursos')}
                      className="border-green-200 text-green-700 hover:bg-green-50 px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Ver recursos zen
                    </Button>
                  </div>
                </div>
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Heart className="w-16 h-16 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}