import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, LogIn, LogOut, Settings, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserData>({
    name: '',
    email: '',
    avatar: '',
    isLoggedIn: false
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de login (aquí se conectaría con Supabase)
    setTimeout(() => {
      if (loginForm.email && loginForm.password) {
        setUser({
          name: loginForm.email.split('@')[0],
          email: loginForm.email,
          avatar: '',
          isLoggedIn: true
        });
        setIsLoginOpen(false);
        toast.success('¡Bienvenida! Has iniciado sesión correctamente');
        // Guardar en localStorage para persistencia
        localStorage.setItem('csc_user', JSON.stringify({
          name: loginForm.email.split('@')[0],
          email: loginForm.email,
          isLoggedIn: true
        }));
      } else {
        toast.error('Por favor completa todos los campos');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser({
      name: '',
      email: '',
      avatar: '',
      isLoggedIn: false
    });
    localStorage.removeItem('csc_user');
    toast.success('Has cerrado sesión');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUser(prev => ({ ...prev, avatar: result }));
        // Guardar avatar en localStorage
        const storedUser = JSON.parse(localStorage.getItem('csc_user') || '{}');
        localStorage.setItem('csc_user', JSON.stringify({ ...storedUser, avatar: result }));
        toast.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  };

  // Cargar usuario del localStorage al montar
  React.useEffect(() => {
    const storedUser = localStorage.getItem('csc_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    }
  }, []);

  if (!user.isLoggedIn) {
    return (
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Iniciar sesión
            </DialogTitle>
            <DialogDescription>
              Accede a tu espacio personal de comersinculpa.blog
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>¿No tienes cuenta? <button type="button" className="text-primary hover:underline">Regístrate</button></p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Badge variant="secondary" className="hidden sm:flex">
        ¡Hola, {user.name}!
      </Badge>
      
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 border-2 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Mi perfil
            </DialogTitle>
            <DialogDescription>
              Gestiona tu información personal y preferencias
            </DialogDescription>
          </DialogHeader>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-4 border-primary/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Upload className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Conectada
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Miembro desde</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('es-ES')}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};