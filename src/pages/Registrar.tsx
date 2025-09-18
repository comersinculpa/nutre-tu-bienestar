import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/Avatar';
import { 
  CheckCircle, 
  Heart, 
  Edit3,
  ArrowRight,
  Timer,
  Utensils,
  Camera
} from 'lucide-react';

const registrationOptions = [
  {
    id: 'check-in-diario',
    title: 'Check-in Diario',
    subtitle: '60-90 segundos',
    description: 'Conecta contigo: emoción, señales corporales e intención',
    icon: CheckCircle,
    path: '/check-in-diario',
    gradient: 'from-ochre-400 to-ochre-500',
    benefits: ['Conciencia emocional', 'Señales del cuerpo', 'Próximo mejor paso']
  },
  {
    id: 'comer-con-cuidado',
    title: 'Comer con Cuidado',
    subtitle: 'Antes, durante y después',
    description: 'Registro consciente: señales, foto opcional, mini-pausa',
    icon: Utensils,
    path: '/comer-con-cuidado',
    gradient: 'from-yellow-400 to-yellow-500',
    benefits: ['Sin contar calorías', 'Escuchar tu cuerpo', 'Elecciones conscientes']
  },
  {
    id: 'diario-emocional',
    title: 'Diario Emocional',
    subtitle: 'Texto libre',
    description: 'Espacio para desahogarte y procesar con sugerencias',
    icon: Edit3,
    path: '/diario-emocional',
    gradient: 'from-green-400 to-green-500',
    benefits: ['Expresión libre', 'Procesamiento', 'Sugerencias amables']
  }
];

export default function Registrar() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center gap-2 bg-gradient-brand/10 px-4 py-2 rounded-full mb-4">
            <Heart className="h-5 w-5 text-ochre-600" />
            <span className="text-ochre-700 font-semibold">Registrar</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tomemos un minuto para mirarte con cariño
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Elige la forma de registro que más resuene contigo ahora
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar guidance */}
          <Avatar 
            message="No hay forma correcta de registrarse. Tu experiencia es válida tal como es. ¿Qué sientes que necesitas ahora?"
            mood="supportive"
          />

          {/* Registration options */}
          <div className="space-y-4">
            {registrationOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected ? 'ring-2 ring-ochre-500 shadow-elegant' : 'hover:shadow-elegant'
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    setTimeout(() => handleNavigate(option.path), 200);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-soft`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{option.title}</h3>
                          <Badge variant="secondary" className="text-xs bg-ochre-50 text-ochre-700 border-ochre-200">
                            <Timer className="h-3 w-3 mr-1" />
                            {option.subtitle}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {option.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {option.benefits.map((benefit, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs bg-white/50 border-muted"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2 text-ochre-600 font-medium">
                          <span>Comenzar</span>
                          <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${
                            isSelected ? 'translate-x-2' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick tips */}
          <Card className="bg-gradient-to-r from-ochre-50 via-green-50 to-ochre-50 border-ochre-100">
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-ochre-600" />
                Recuerda
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Registrarte no es una tarea más en tu lista. Es un momento de conexión contigo misma. 
                Puedes hacerlo desde el súper, en el baño de la oficina, o mientras los peques ven la tele. 
                Cada registro cuenta, sin importar cuán breve sea.
              </p>
            </CardContent>
          </Card>
          
          {/* Alternative action */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground border-muted hover:border-ochre-300"
            >
              No hoy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}