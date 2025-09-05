import { useState } from 'react';
import { Avatar } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Lock, 
  Trash2, 
  Download, 
  BarChart3,
  Heart,
  Calendar,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Perfil() {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    emotionalCheck: true,
    resources: false,
    progress: true
  });
  
  const [privacy, setPrivacy] = useState({
    biometrics: false,
    dataBackup: true,
    analytics: true
  });

  const { toast } = useToast();

  const estadisticas = [
    { label: 'Días registrando', valor: '12', icono: Calendar, color: 'primary' },
    { label: 'Entradas en diario', valor: '28', icono: User, color: 'accent' },
    { label: 'Tests completados', valor: '8', icono: Target, color: 'warning' },
    { label: 'Recursos utilizados', valor: '15', icono: Heart, color: 'success' }
  ];

  const handleExportData = () => {
    toast({
      title: "Exportando datos",
      description: "Tu información se está preparando para descarga.",
    });
  };

  const handleDeleteData = () => {
    toast({
      title: "Eliminar datos",
      description: "¿Estás segura? Esta acción no se puede deshacer.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="px-6 py-6 space-y-6">
        <div className="text-center pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tu Perfil
          </h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia de bienestar
          </p>
        </div>

        <Avatar 
          mood="celebrating" 
          message="¡Me alegra ver tu progreso! Aquí puedes ajustar todo a tu medida."
        />

        {/* User Info */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre preferido</Label>
              <Input 
                id="nombre"
                placeholder="¿Cómo te gustaría que te llamemos?" 
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objetivo">Mi objetivo principal</Label>
              <Input 
                id="objetivo"
                placeholder="Ej: Mejorar mi relación con la comida" 
                className="bg-background/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-success" />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {estadisticas.map((stat, index) => {
                const IconoStat = stat.icono;
                return (
                  <div 
                    key={index}
                    className="text-center p-4 bg-background/30 rounded-lg"
                  >
                    <IconoStat className={`w-6 h-6 mx-auto mb-2 text-${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.valor}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recordatorio diario</p>
                <p className="text-sm text-muted-foreground">Te recordamos escribir en tu diario</p>
              </div>
              <Switch 
                checked={notifications.dailyReminder}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({...prev, dailyReminder: checked}))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chequeo emocional</p>
                <p className="text-sm text-muted-foreground">Preguntamos cómo te sientes</p>
              </div>
              <Switch 
                checked={notifications.emotionalCheck}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({...prev, emotionalCheck: checked}))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recursos sugeridos</p>
                <p className="text-sm text-muted-foreground">Te enviamos recursos personalizados</p>
              </div>
              <Switch 
                checked={notifications.resources}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({...prev, resources: checked}))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Privacidad y Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Bloqueo biométrico</p>
                <p className="text-sm text-muted-foreground">Usa huella o Face ID</p>
              </div>
              <Switch 
                checked={privacy.biometrics}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({...prev, biometrics: checked}))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Respaldo automático</p>
                <p className="text-sm text-muted-foreground">Guarda tu información de forma segura</p>
              </div>
              <Switch 
                checked={privacy.dataBackup}
                onCheckedChange={(checked) => 
                  setPrivacy(prev => ({...prev, dataBackup: checked}))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-secondary-soft shadow-card border-0">
          <CardHeader>
            <CardTitle>Gestión de Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar mis datos
            </Button>
            
            <Button 
              onClick={handleDeleteData}
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar todos los datos
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-gradient-warm shadow-warm border-0">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-foreground mb-2">
              ¿Necesitas Ayuda?
            </h3>
            <p className="text-sm text-foreground/80 mb-4">
              Estamos aquí para apoyarte en tu proceso de bienestar
            </p>
            <Button className="bg-gradient-primary">
              Contactar Soporte
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}