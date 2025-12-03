import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  
  const { signIn, signUp, resetPassword, updatePassword, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Detect password recovery event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user && mode !== 'reset') {
      navigate('/');
    }
  }, [user, loading, navigate, mode]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    if (mode !== 'forgot') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
      
      if (mode === 'signup' && password !== confirmPassword) {
        newErrors.confirm = 'Las contraseñas no coinciden';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Email enviado',
            description: 'Revisa tu bandeja de entrada para restablecer tu contraseña'
          });
          setMode('login');
        }
      } else if (mode === 'reset') {
        if (password !== confirmPassword) {
          setErrors({ confirm: 'Las contraseñas no coinciden' });
          return;
        }
        const { error } = await updatePassword(password);
        if (error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Contraseña actualizada',
            description: 'Ya puedes iniciar sesión con tu nueva contraseña'
          });
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Error de acceso',
              description: 'Email o contraseña incorrectos',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: '¡Bienvenida de vuelta!',
            description: 'Has iniciado sesión correctamente'
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email ya registrado',
              description: 'Este email ya tiene una cuenta. Intenta iniciar sesión.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: '¡Cuenta creada!',
            description: 'Bienvenida a Comer Sin Culpa'
          });
          navigate('/onboarding');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Welcome */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Comer Sin Culpa</h1>
        <p className="text-muted-foreground">
            {mode === 'login' ? 'Bienvenida de vuelta' : mode === 'signup' ? 'Comienza tu viaje de sanación' : mode === 'reset' ? 'Crea tu nueva contraseña' : 'Recupera tu acceso'}
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">
              {mode === 'login' ? 'Iniciar sesión' : mode === 'signup' ? 'Crear cuenta' : mode === 'reset' ? 'Nueva contraseña' : 'Restablecer contraseña'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Ingresa tus datos para continuar' 
                : mode === 'signup'
                ? 'Completa el formulario para registrarte'
                : mode === 'reset'
                ? 'Ingresa tu nueva contraseña'
                : 'Te enviaremos un enlace para restablecer tu contraseña'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              )}

              {(mode !== 'forgot') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrors({});
                        }}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              )}

              {(mode === 'signup' || mode === 'reset') && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${errors.confirm ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirm && (
                    <p className="text-sm text-destructive">{errors.confirm}</p>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Iniciando sesión...' : mode === 'signup' ? 'Creando cuenta...' : mode === 'reset' ? 'Actualizando...' : 'Enviando...'}
                  </>
                ) : (
                  mode === 'login' ? 'Iniciar sesión' : mode === 'signup' ? 'Crear cuenta' : mode === 'reset' ? 'Guardar contraseña' : 'Enviar enlace'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {mode === 'forgot' || mode === 'reset' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Volver a iniciar sesión
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {mode === 'login' 
                    ? '¿No tienes cuenta? Regístrate' 
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Un espacio seguro para tu bienestar emocional 💙
        </p>
      </div>
    </div>
  );
}
