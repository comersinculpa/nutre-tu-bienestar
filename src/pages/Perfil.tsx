import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Target,
  Save,
  Loader2,
  Crown,
  ChevronRight
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, loading } = useAuth();
  const { subscription, getTierInfo } = useSubscription();
  const { toast } = useToast();
  
  const [nombre, setNombre] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
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

  // Load profile data
  useEffect(() => {
    if (profile) {
      setNombre(profile.name || '');
      setObjetivo(profile.main_goal || '');
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const estadisticas = [
    { label: 'Días registrando', valor: '12', icono: Calendar, color: 'primary' },
    { label: 'Entradas en diario', valor: '28', icono: User, color: 'accent' },
    { label: 'Tests completados', valor: '8', icono: Target, color: 'warning' },
    { label: 'Recursos utilizados', valor: '15', icono: Heart, color: 'success' }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        name: nombre,
        main_goal: objetivo
      });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo guardar los cambios",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Perfil actualizado",
          description: "Tus cambios se han guardado correctamente"
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-subpage">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-subpage pb-20">
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
          message={`¡Hola${nombre ? `, ${nombre}` : ''}! Me alegra ver tu progreso. Aquí puedes ajustar todo a tu medida.`}
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
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre preferido</Label>
              <Input 
                id="nombre"
                placeholder="¿Cómo te gustaría que te llamemos?" 
                className="bg-background/50"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objetivo">Mi objetivo principal</Label>
              <Input 
                id="objetivo"
                placeholder="Ej: Mejorar mi relación con la comida" 
                className="bg-background/50"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
              />
            </div>

            {profile?.relationship_level && (
              <div className="space-y-2">
                <Label>Nivel de relación con la comida</Label>
                <p className="text-sm text-muted-foreground capitalize p-2 bg-muted/30 rounded">
                  {profile.relationship_level}
                </p>
              </div>
            )}

            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
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

        {/* Subscription */}
        <Card 
          className="bg-gradient-card shadow-card border-0 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/suscripcion')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent" />
              Mi Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Plan {subscription ? getTierInfo(subscription.tier).name : 'Gratuito'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.tier === 'FREE' 
                    ? 'Mejora tu plan para más funciones'
                    : `${subscription?.features.recipes_remaining === -1 ? '∞' : subscription?.features.recipes_remaining} recetas restantes`
                  }
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
