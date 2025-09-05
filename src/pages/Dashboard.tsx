import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Lightbulb, Heart, TrendingUp, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    title: 'Recursos de Apoyo',
    description: 'Herramientas para tu autocuidado',
    icon: Heart,
    path: '/recursos',
    color: 'success',
    bgColor: 'bg-success-soft'
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
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
        <Avatar mood="encouraging" />

        {/* Progress Summary */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tu Progreso Hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Registro emocional</span>
              <span className="text-sm font-medium text-success">2/3 veces</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ejercicios de calma</span>
              <span className="text-sm font-medium text-primary">1 completado</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado de ánimo</span>
              <div className="flex items-center gap-1">
                <Smile className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Tranquilo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            ¿Qué te gustaría hacer hoy?
          </h2>
          
          {quickActions.map((action) => (
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
          ))}
        </div>

        {/* Daily Motivation */}
        <Card className="bg-gradient-warm shadow-warm border-0">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">
              💙 Pensamiento del Día
            </h3>
            <p className="text-foreground/80 italic">
              "Cada día es una nueva oportunidad para cuidarte con amor y compasión. 
              Tus emociones son válidas, tu bienestar importa."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}