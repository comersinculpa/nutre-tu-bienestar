import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, Clock, Leaf, Heart, Utensils, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MindfulAudioService } from '@/services/mindfulAudioService';

interface AudioMindful {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  categoria: 'preparacion' | 'durante' | 'despues' | 'general';
  contenido: string;
  objetivos: string[];
}

const audiosMindfulEating: AudioMindful[] = [
  {
    id: 'antes-de-comer',
    titulo: 'Preparación Consciente',
    descripcion: 'Conecta con tu cuerpo antes de comer',
    duracion: '3 min',
    categoria: 'preparacion',
    contenido: `
      Respira profundo y permítete estar presente. 

      Observa tu plato con curiosidad, sin juicio. ¿Qué colores ves? ¿Qué texturas percibes?

      Pregúntate suavemente: ¿Cómo está mi cuerpo ahora? ¿Tengo hambre física?

      No hay respuesta correcta, solo observación amorosa hacia ti misma.

      Toma otro respiro y prepárate para nutrir tu cuerpo con consciencia y cuidado.
    `,
    objetivos: ['Conectar con el hambre real', 'Reducir automatismos', 'Crear espacio mental']
  },
  {
    id: 'primer-bocado',
    titulo: 'El Primer Bocado Consciente',
    descripcion: 'Experimenta plenamente el primer sabor',
    duracion: '2 min',
    categoria: 'durante',
    contenido: `
      Toma tu primer bocado y mastica muy lentamente.

      ¿Qué sabor notas primero? ¿Dulce, salado, amargo?

      Siente las texturas en tu boca. ¿Es cremoso, crujiente, suave?

      Observa cómo cambian los sabores mientras masticas.

      Este primer bocado te conecta con el placer natural de nutrir tu cuerpo.

      No tienes que comer perfectamente, solo conscientemente.
    `,
    objetivos: ['Despertar los sentidos', 'Reducir velocidad', 'Encontrar satisfacción']
  },
  {
    id: 'durante-comida',
    titulo: 'Comiendo con Presencia',
    descripcion: 'Mantén la consciencia durante toda la comida',
    duracion: '4 min',
    categoria: 'durante',
    contenido: `
      Cada bocado es una oportunidad de volver al presente.

      Si tu mente se distrae, simplemente vuelve suavemente a los sabores.

      Pausa entre bocados. Respira. Observa cómo se siente tu estómago.

      ¿Tu cuerpo todavía tiene hambre? ¿Está satisfecho?

      No juzgues tus sensaciones, solo obsérvalas con curiosidad amorosa.

      Esto no es perfección, es práctica. Y cada momento consciente cuenta.
    `,
    objetivos: ['Mantener presencia', 'Escuchar al cuerpo', 'Reducir ansiedad']
  },
  {
    id: 'señales-saciedad',
    titulo: 'Reconociendo la Saciedad',
    descripcion: 'Aprende a identificar cuándo tu cuerpo está satisfecho',
    duracion: '3 min',
    categoria: 'durante',
    contenido: `
      Pausa por un momento y respira profundamente.

      Lleva tu atención a tu estómago. ¿Cómo se siente ahora?

      La saciedad es sutil al principio. No es llenura completa.

      Es una sensación de satisfacción, como si tu cuerpo dijera "gracias, es suficiente por ahora".

      Si aún tienes hambre física, continúa comiendo conscientemente.

      Si sientes saciedad, honra esa sabiduría de tu cuerpo.
    `,
    objetivos: ['Reconocer saciedad', 'Honrar al cuerpo', 'Reducir restricción']
  },
  {
    id: 'despues-comer',
    titulo: 'Gratitud Post-Comida',
    descripcion: 'Cierre consciente después de comer',
    duracion: '2 min',
    categoria: 'despues',
    contenido: `
      Has terminado de comer. Respira profundamente.

      Agradece a tu cuerpo por haberte comunicado sus necesidades.

      Agradece a los alimentos por nutrir tu cuerpo.

      Si comiste más o menos de lo planeado, está bien. No hay perfección en este proceso.

      Lo importante es que practicaste la consciencia y el autocuidado.

      Llevate esta sensación de paz contigo el resto del día.
    `,
    objetivos: ['Practicar gratitud', 'Reducir culpa', 'Integrar la experiencia']
  },
  {
    id: 'ansiedad-alimentaria',
    titulo: 'Calma para la Ansiedad Alimentaria',
    descripcion: 'Audio de apoyo para momentos de ansiedad con la comida',
    duracion: '5 min',
    categoria: 'general',
    contenido: `
      Estás en un momento difícil y está bien sentir lo que sientes.

      Tu relación con la comida está sanando, pero no es lineal.

      Respira conmigo: inhala por 4, mantén por 4, exhala por 6.

      Recuerda: no hay emergencia. Tu cuerpo está seguro. La comida no es tu enemiga.

      Esta ansiedad pasará. Has superado momentos difíciles antes.

      Eres más fuerte de lo que crees y mereces comer sin miedo.

      Un día a la vez, un bocado consciente a la vez.
    `,
    objetivos: ['Reducir ansiedad', 'Brindar seguridad', 'Recordar fortaleza personal']
  }
];

const categorias = {
  preparacion: { nombre: 'Preparación', color: 'bg-blue-100 text-blue-800' },
  durante: { nombre: 'Durante la Comida', color: 'bg-green-100 text-green-800' },
  despues: { nombre: 'Después de Comer', color: 'bg-purple-100 text-purple-800' },
  general: { nombre: 'Apoyo General', color: 'bg-slate-100 text-slate-800' }
};

export function MindfulEating() {
  const [audioActivo, setAudioActivo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audiosCompletados, setAudiosCompletados] = useState<string[]>([]);
  const [audioUrls, setAudioUrls] = useState<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayAudio = async (audioId: string) => {
    const audio = audiosMindfulEating.find(a => a.id === audioId);
    if (!audio) return;

    try {
      setIsGenerating(true);
      
      // Verificar si ya tenemos el audio generado
      let audioUrl = audioUrls.get(audioId);
      
      if (!audioUrl) {
        toast({
          title: "Generando audio personalizado",
          description: "Creando tu sesión de mindful eating...",
        });

        // Generar el audio con ElevenLabs
        const response = await MindfulAudioService.generateAudio({
          text: audio.contenido,
          voiceId: 'Sarah' // Voz cálida y serena para mindful eating
        });

        audioUrl = MindfulAudioService.createAudioUrl(response.audio);
        setAudioUrls(new Map(audioUrls.set(audioId, audioUrl)));
      }

      setIsGenerating(false);
      setAudioActivo(audioId);
      setIsPlaying(true);

      // Reproducir el audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;
      
      audioElement.onended = () => {
        setIsPlaying(false);
        setAudioActivo(null);
        if (!audiosCompletados.includes(audioId)) {
          setAudiosCompletados([...audiosCompletados, audioId]);
        }
        toast({
          title: "Sesión completada",
          description: "¡Excelente práctica de mindful eating! 🌟",
        });
      };

      audioElement.onerror = () => {
        toast({
          title: "Error de reproducción",
          description: "No se pudo reproducir el audio. Intenta de nuevo.",
          variant: "destructive"
        });
        setIsPlaying(false);
        setAudioActivo(null);
        setIsGenerating(false);
      };

      await audioElement.play();
      
      toast({
        title: "Reproduciendo",
        description: `${audio.titulo} - ${audio.duracion}`,
      });

    } catch (error) {
      console.error('Error playing audio:', error);
      setIsGenerating(false);
      setIsPlaying(false);
      setAudioActivo(null);
      
      toast({
        title: "Error al generar audio",
        description: "No se pudo crear el audio. Verifica tu conexión.",
        variant: "destructive"
      });
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setAudioActivo(null);
  };

  const getIconoCategoria = (categoria: string) => {
    switch (categoria) {
      case 'preparacion': return Leaf;
      case 'durante': return Utensils;
      case 'despues': return Heart;
      case 'general': return Volume2;
      default: return Volume2;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Utensils className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Mindful Eating</h2>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Audios breves para practicar alimentación consciente. Cada audio te guía para conectar 
          con tus sensaciones, reducir la ansiedad alimentaria y desarrollar una relación más amorosa con la comida.
        </p>
      </div>

      {/* Progreso general */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">Tu Progreso en Mindful Eating</h3>
            <Badge variant="outline">
              {audiosCompletados.length} / {audiosMindfulEating.length} completados
            </Badge>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-3 mb-2">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(audiosCompletados.length / audiosMindfulEating.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-primary/80">
            Cada práctica te acerca más a una relación consciente y amorosa con la comida
          </p>
        </CardContent>
      </Card>

      {/* Audios por categoría */}
      {Object.entries(categorias).map(([categoriaKey, categoriaInfo]) => {
        const audiosCategoria = audiosMindfulEating.filter(audio => audio.categoria === categoriaKey);
        if (audiosCategoria.length === 0) return null;

        return (
          <div key={categoriaKey} className="space-y-4">
            <div className="flex items-center space-x-3">
              <Badge className={categoriaInfo.color}>
                {categoriaInfo.nombre}
              </Badge>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            
            <div className="grid gap-4">
              {audiosCategoria.map((audio) => {
                const IconoCategoria = getIconoCategoria(audio.categoria);
                const isCompleted = audiosCompletados.includes(audio.id);
                const isCurrentlyPlaying = audioActivo === audio.id && isPlaying;
                
                return (
                  <Card 
                    key={audio.id} 
                    className={`transition-all duration-300 hover:shadow-lg ${
                      isCurrentlyPlaying ? 'ring-2 ring-primary shadow-lg' : ''
                    } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${
                            isCompleted ? 'bg-green-100' : ''
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            ) : (
                              <IconoCategoria className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{audio.titulo}</CardTitle>
                            <p className="text-muted-foreground text-sm mb-3">{audio.descripcion}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{audio.duracion}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Objetivos del audio */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2 text-foreground">Este audio te ayuda a:</h4>
                        <div className="flex flex-wrap gap-1">
                          {audio.objetivos.map((objetivo, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {objetivo}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Contenido del audio (vista previa) */}
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground italic">
                          "{audio.contenido.substring(0, 100)}..."
                        </p>
                      </div>
                      
                      {/* Controles de audio */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {isCurrentlyPlaying ? (
                            <Button
                              size="sm"
                              onClick={handlePauseAudio}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pausar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handlePlayAudio(audio.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                              disabled={(audioActivo !== null && audioActivo !== audio.id) || isGenerating}
                            >
                              {isGenerating && audioActivo === audio.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generando...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  {isCompleted ? 'Escuchar de nuevo' : 'Reproducir'}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Completado
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Mensaje motivacional */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-primary text-xl mb-4">Recuerda</h3>
          <p className="text-muted-foreground leading-relaxed">
            El mindful eating no es perfección, es práctica. Cada momento consciente con la comida 
            es un paso hacia una relación más amorosa contigo misma. Sé paciente y compasiva en este proceso.
          </p>
        </CardContent>
      </Card>

      {/* Nota sobre funcionalidad */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Volume2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-2">🎵 Audios Activos</h4>
              <p className="text-green-700 text-sm">
                Los audios se generan con tecnología de voz AI ultra-natural de ElevenLabs. 
                Cada sesión se crea personalmente para ti con una voz cálida y serena, perfecta para mindful eating.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}