import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageUpload } from '@/components/ImageUpload';
import { useImageRecognition } from '@/hooks/useImageRecognition';
import { Plus, Heart, MessageCircle, Clock, Camera, Send, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

interface RecetaBlog {
  id: string;
  usuario: string;
  avatar: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  ingredientes: string[];
  preparacion: string;
  tiempo: string;
  fechaCreacion: Date;
  likes: number;
  comentarios: number;
  hasLiked: boolean;
}

const recetasEjemplo: RecetaBlog[] = [
  {
    id: '1',
    usuario: 'Ana M.',
    avatar: '👩‍🍳',
    titulo: 'Mi Bowl de Paz Interior',
    descripcion: 'Hoy cocine escuchando mi cuerpo. Quería texturas suaves y sabores reconfortantes.',
    imagen: '/api/placeholder/400/300',
    ingredientes: ['Quinoa', 'Aguacate', 'Tomates cherry', 'Hummus casero', 'Semillas de girasol'],
    preparacion: 'Preparé cada ingrediente con cariño, pensando en lo que mi cuerpo necesitaba hoy. Sin prisas, solo disfrutando el proceso.',
    tiempo: '15 min',
    fechaCreacion: new Date('2024-01-15'),
    likes: 12,
    comentarios: 3,
    hasLiked: false
  },
  {
    id: '2',
    usuario: 'Sofia L.',
    avatar: '🌟',
    titulo: 'Pasta de la Intuición',
    descripcion: 'Una receta que nació de lo que tenía en casa y mucha creatividad. ¡El resultado me sorprendió!',
    ingredientes: ['Pasta', 'Brócoli', 'Ajo', 'Aceite de oliva', 'Queso parmesano', 'Pimienta negra'],
    preparacion: 'Cociné el brócoli hasta que estuviera tierno pero con textura. Lo salteé con ajo y lo mezclé con la pasta. Simple pero delicioso.',
    tiempo: '20 min',
    fechaCreacion: new Date('2024-01-14'),
    likes: 8,
    comentarios: 5,
    hasLiked: true
  }
];

export function BlogRecetas() {
  const [recetas, setRecetas] = useState<RecetaBlog[]>(recetasEjemplo);
  const [isCreatingReceta, setIsCreatingReceta] = useState(false);
  const [nuevaReceta, setNuevaReceta] = useState({
    titulo: '',
    descripcion: '',
    ingredientes: '',
    preparacion: '',
    tiempo: '',
    imagen: ''
  });
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const { analyzeFoodImage, isAnalyzing } = useImageRecognition();

  const handleImageUpload = async (file: File) => {
    setNuevaImagen(file);
    try {
      const analysis = await analyzeFoodImage(file);
      
      // Auto-llenar sugerencias basadas en la imagen
      if (analysis.foods.length > 0) {
        setNuevaReceta(prev => ({
          ...prev,
          ingredientes: analysis.foods.join(', '),
          titulo: prev.titulo || `Mi ${analysis.foods[0]}`
        }));
      }
      
      toast.success('¡Imagen analizada! He sugerido algunos ingredientes basados en tu foto.');
    } catch (error) {
      console.error('Error analizando imagen:', error);
    }
  };

  const handleSubmitReceta = () => {
    if (!nuevaReceta.titulo.trim() || !nuevaReceta.descripcion.trim()) {
      toast.error('Por favor completa al menos el título y la descripción');
      return;
    }

    const receta: RecetaBlog = {
      id: Date.now().toString(),
      usuario: 'Tú',
      avatar: '💚',
      titulo: nuevaReceta.titulo,
      descripcion: nuevaReceta.descripcion,
      imagen: nuevaImagen ? URL.createObjectURL(nuevaImagen) : undefined,
      ingredientes: nuevaReceta.ingredientes.split(',').map(i => i.trim()).filter(i => i),
      preparacion: nuevaReceta.preparacion,
      tiempo: nuevaReceta.tiempo,
      fechaCreacion: new Date(),
      likes: 0,
      comentarios: 0,
      hasLiked: false
    };

    setRecetas([receta, ...recetas]);
    setNuevaReceta({
      titulo: '',
      descripcion: '',
      ingredientes: '',
      preparacion: '',
      tiempo: '',
      imagen: ''
    });
    setNuevaImagen(null);
    setIsCreatingReceta(false);
    
    toast.success('¡Receta compartida! Gracias por inspirar a la comunidad 💚');
  };

  const handleLike = (recetaId: string) => {
    setRecetas(recetas.map(receta => {
      if (receta.id === recetaId) {
        return {
          ...receta,
          hasLiked: !receta.hasLiked,
          likes: receta.hasLiked ? receta.likes - 1 : receta.likes + 1
        };
      }
      return receta;
    }));
  };

  const mensajesMotivacion = [
    "Cada receta compartida es un acto de valentía y amor 💕",
    "Tu experiencia culinaria puede inspirar a alguien más hoy 🌟",
    "No hay receta pequeña cuando viene del corazón ✨",
    "Compartir tu cocina es compartir tu cuidado personal 🤗"
  ];

  return (
    <div className="space-y-6">
      {/* Header del blog */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">Blog Comunitario</h3>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comparte tus creaciones culinarias y descubre las recetas intuitivas de nuestra comunidad.
          Aquí celebramos cada plato hecho con amor propio.
        </p>
      </div>

      {/* Botón para crear nueva receta */}
      <div className="flex justify-center">
        <Dialog open={isCreatingReceta} onOpenChange={setIsCreatingReceta}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Compartir mi receta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comparte tu receta intuitiva</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm text-primary">
                  {mensajesMotivacion[Math.floor(Math.random() * mensajesMotivacion.length)]}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Título de tu creación</label>
                <Input
                  value={nuevaReceta.titulo}
                  onChange={(e) => setNuevaReceta({...nuevaReceta, titulo: e.target.value})}
                  placeholder="Ej: Mi bowl de felicidad, Pasta del domingo..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comparte tu experiencia</label>
                <Textarea
                  value={nuevaReceta.descripcion}
                  onChange={(e) => setNuevaReceta({...nuevaReceta, descripcion: e.target.value})}
                  placeholder="¿Qué te inspiró a cocinar esto? ¿Cómo te sentiste preparándolo?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Foto de tu plato (opcional)</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="image-upload"
                    disabled={isAnalyzing}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {isAnalyzing ? 'Analizando...' : 'Subir foto'}
                  </Button>
                </div>
                {isAnalyzing && (
                  <p className="text-sm text-muted-foreground">
                    Analizando tu imagen para sugerir ingredientes...
                  </p>
                )}
                {nuevaImagen && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(nuevaImagen)} 
                      alt="Vista previa" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ingredientes (opcional)</label>
                  <Textarea
                    value={nuevaReceta.ingredientes}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, ingredientes: e.target.value})}
                    placeholder="Separa con comas: tomate, pasta, aceite..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiempo aproximado</label>
                  <Input
                    value={nuevaReceta.tiempo}
                    onChange={(e) => setNuevaReceta({...nuevaReceta, tiempo: e.target.value})}
                    placeholder="Ej: 15 min, 30 min..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tu proceso (opcional)</label>
                <Textarea
                  value={nuevaReceta.preparacion}
                  onChange={(e) => setNuevaReceta({...nuevaReceta, preparacion: e.target.value})}
                  placeholder="Cuéntanos cómo lo preparaste, sin presión por ser perfecto..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setIsCreatingReceta(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitReceta}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feed de recetas */}
      <div className="space-y-6">
        {recetas.map((receta) => (
          <Card key={receta.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {receta.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{receta.usuario}</h4>
                  <p className="text-sm text-muted-foreground">
                    {receta.fechaCreacion.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
                {receta.tiempo && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{receta.tiempo}</span>
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">{receta.titulo}</h3>
                <p className="text-muted-foreground">{receta.descripcion}</p>
              </div>

              {receta.imagen && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={receta.imagen} 
                    alt={receta.titulo}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {receta.ingredientes.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Ingredientes:</h5>
                  <div className="flex flex-wrap gap-1">
                    {receta.ingredientes.map((ingrediente, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {ingrediente}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {receta.preparacion && (
                <div>
                  <h5 className="font-medium mb-2">Preparación:</h5>
                  <p className="text-sm text-muted-foreground">{receta.preparacion}</p>
                </div>
              )}

              <div className="flex items-center space-x-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(receta.id)}
                  className={`flex items-center space-x-1 ${
                    receta.hasLiked ? 'text-red-500 hover:text-red-600' : ''
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${receta.hasLiked ? 'fill-current' : ''}`} 
                  />
                  <span>{receta.likes}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{receta.comentarios}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recetas.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Aún no hay recetas compartidas
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            ¡Sé la primera en compartir tu creación culinaria!
          </p>
          <Button 
            onClick={() => setIsCreatingReceta(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Compartir mi primera receta
          </Button>
        </div>
      )}
    </div>
  );
}