import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Lightbulb, Heart, TrendingUp, Smile, FileText, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GamificationPanel } from '@/components/GamificationPanel';
import { RiskAlerts } from '@/components/RiskAlerts';
import { MotivationalMessages } from '@/components/MotivationalMessages';
import { useGamification } from '@/hooks/useGamification';
import { useRiskDetection } from '@/hooks/useRiskDetection';
import heroImage from '@/assets/hero-wellbeing.jpg';

const quickActions = [
  {
    title: 'Diario Emocional',
    description: 'Registra tus emociones y pensamientos del día',
    icon: BookOpen,
    path: '/diario',
    color: 'accent',
    bgColor: 'bg-accent-soft'
  },
  {
    title: 'Detector de Hambre',
    description: '¿Es hambre física o emocional?',
    icon: Lightbulb,
    path: '/detector',
    color: 'warning',
    bgColor: 'bg-warning-soft'
  },
  {
    title: 'Talleres Interactivos',
    description: 'Aprende técnicas prácticas de autocuidado',
    icon: BookOpen,
    path: '/talleres',
    color: 'accent',
    bgColor: 'bg-accent-soft'
  },
  {
    title: 'Cuestionarios',
    description: 'Evalúa tu bienestar y patrones alimentarios',
    icon: FileText,
    path: '/cuestionarios',
    color: 'secondary',
    bgColor: 'bg-secondary-soft'
  },
  {
    title: 'Emocionario',
    description: 'Explora y comprende tus emociones',
    icon: Smile,
    path: 'https://emocionar-ezleya.manus.space',
    color: 'primary',
    bgColor: 'bg-primary-soft',
    external: true
  },
  {
    title: 'Comunidad',
    description: 'Conecta con otras personas en procesos similares',
    icon: Users,
    path: '/comunidad',
    color: 'warning',
    bgColor: 'bg-warning-soft'
  },
  {
    title: 'Recursos de Apoyo',
    description: 'Herramientas para tu autocuidado',
    icon: Heart,
    path: '/recursos',
    color: 'success',
    bgColor: 'bg-success-soft'
  }
];

export default function Dashboard() {
  const { progress } = useGamification();
  const { getActiveAlerts } = useRiskDetection();
  const activeAlerts = getActiveAlerts();

  return (
    <div className="min-h-screen bg-background-subpage pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Bienestar emocional" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Comer Sin Culpa
          </h1>
          <p className="text-primary-foreground/90 text-lg">
            Tu espacio seguro para el bienestar emocional
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Avatar Greeting */}
        <Avatar 
          mood="encouraging"
          message={progress.level > 1 ? 
            `¡Nivel ${progress.level}! Estás progresando increíblemente.` : 
            "¡Bienvenida! Cada paso cuenta en tu camino de bienestar."
          }
        />

        {/* Mission Statement */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-soft rounded-full mb-2">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                  "Reconocer, sentir y comer con conciencia"
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nuestro objetivo es ayudarte a reconectar con tu cuerpo y emociones, 
                  registrar tu relación con la comida y aprender a comer desde el cuidado, 
                  no desde la culpa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        {activeAlerts.length > 0 && (
          <RiskAlerts />
        )}

        {/* Motivational Message */}
        <MotivationalMessages />

        {/* Gamification Panel */}
        <GamificationPanel />

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            ¿Qué te gustaría hacer hoy?
          </h2>
          
          {quickActions.map((action) => {
            if (action.external) {
              return (
                <a 
                  key={action.path} 
                  href={action.path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Card className="bg-gradient-card border-0 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.bgColor}`}>
                          <action.icon className={`w-6 h-6 text-${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              );
            } else {
              return (
                <Link key={action.path} to={action.path}>
                  <Card className="bg-gradient-card border-0 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-[1.02]">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${action.bgColor}`}>
                          <action.icon className={`w-6 h-6 text-${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            }
          })}
        </div>

        {/* TCA Module Access */}
        <Card className="bg-gradient-primary shadow-warm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Módulo TCA Especializado
                </h3>
                <p className="text-white/80 text-sm">
                  Herramientas avanzadas para tu tratamiento de TCA
                </p>
              </div>
              <Link to="/tca-module">
                <Button variant="secondary" size="sm">
                  Acceder
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}