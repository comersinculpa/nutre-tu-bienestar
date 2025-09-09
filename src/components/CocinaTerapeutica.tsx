import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ChefHat, Clock, Users, CheckCircle, Star, BookOpen } from 'lucide-react';
import { BlogRecetas } from './BlogRecetas';

const cursosGuiados = [
  {
    id: 'introduccion',
    titulo: 'Bienvenida a tu cocina sin juicios',
    descripcion: 'Redescubre el placer de cocinar para ti',
    duracion: '5 min',
    completado: false,
    contenido: {
      introduccion: `¡Bienvenida a tu espacio de cocina terapéutica! 
      
      Aquí no hay reglas estrictas, no hay comidas "buenas" o "malas". Solo hay tu curiosidad, tu creatividad y el cuidado hacia ti misma.

      Cocinar puede ser un acto de amor propio, una meditación en movimiento, un momento de presencia total.`,
      principios: [
        'No existe la comida perfecta, solo existe tu experiencia',
        'Escucha a tu cuerpo, no a las reglas externas',
        'El placer y la nutrición pueden coexistir',
        'Cada comida es una oportunidad de cuidarte'
      ]
    }
  },
  {
    id: 'mindful-cooking',
    titulo: 'Cocina Consciente: Los 5 Sentidos',
    descripcion: 'Aprende a cocinar con presencia y conexión',
    duracion: '8 min',
    completado: false,
    contenido: {
      introduccion: `Cocinar conscientemente significa estar presente con cada paso del proceso.`,
      ejercicio: `Ejercicio práctico:
      
      1. **Vista**: Observa los colores, formas y texturas de tus ingredientes
      2. **Olfato**: Inhala los aromas mientras cocinas
      3. **Tacto**: Siente las texturas al tocar los alimentos
      4. **Oído**: Escucha los sonidos de la cocción
      5. **Gusto**: Prueba con curiosidad, sin juicio`
    }
  },
  {
    id: 'intuitive-recipes',
    titulo: 'Recetas Intuitivas',
    descripcion: 'Cocina guiándote por lo que tu cuerpo necesita',
    duracion: '12 min',
    completado: false,
    recetas: true
  }
];

const recetasNeutrales = [
  {
    id: 'pasta-cremosa',
    nombre: 'Pasta Cremosa de la Intuición',
    descripcion: 'Una pasta que se adapta a lo que sientes hoy',
    tiempo: '15 min',
    porciones: '2',
    ingredientes: [
      '200g de pasta (la forma que más te apetezca hoy)',
      '1 huevo',
      '50g de queso rallado',
      '2 cucharadas de aceite de oliva',
      'Sal y pimienta al gusto',
      'Opcional: lo que tengas en la nevera que te llame la atención'
    ],
    pasos: [
      'Pon agua a hervir. Mientras esperas, respira y pregúntate: ¿cómo quiero que sepa esta comida?',
      'Cocina la pasta según el paquete. No hay tiempo perfecto, confía en tu intuición.',
      'En un bol, mezcla el huevo con el queso. Añade amor a la mezcla.',
      'Escurre la pasta y mézcala con la preparación del huevo fuera del fuego.',
      'Agrega el aceite y los condimentos que tu cuerpo te pida hoy.',
      'Sirve y come con presencia. Cada bocado es un regalo para ti.'
    ],
    refuerzo: '¡Cocinaste escuchando a tu cuerpo! Eso es intuición alimentaria en acción 💚'
  },
  {
    id: 'tostada-creativa',
    nombre: 'Tostada de la Creatividad',
    descripcion: 'Una base simple para tu expresión del momento',
    tiempo: '5 min',
    porciones: '1',
    ingredientes: [
      '1-2 rebanadas de pan (el que tengas y te apetezca)',
      'Aceite de oliva o mantequilla',
      'Los toppings que te inspiren hoy'
    ],
    pasos: [
      'Tuesta el pan como a ti te guste: más o menos dorado, tú decides.',
      'Unta con aceite o mantequilla. Siente la textura.',
      'Añade lo que te pida el cuerpo: tomate, queso, aguacate, mermelada, lo que sea.',
      'Come despacio, saboreando cada textura y sabor.',
      'No pienses en si está "bien" o "mal", solo disfruta tu creación.'
    ],
    refuerzo: '¡Transformaste ingredientes simples en algo especial! Tu creatividad no tiene límites 🌟'
  },
  {
    id: 'smoothie-intuitivo',
    nombre: 'Smoothie del Momento Presente',
    descripcion: 'Una bebida que refleja tu estado de ánimo actual',
    tiempo: '3 min',
    porciones: '1',
    ingredientes: [
      '1 fruta que te apetezca (plátano, manzana, fresas...)',
      '1 vaso de líquido (leche, agua, bebida vegetal)',
      'Opcionales: yogur, miel, canela, o lo que te inspire'
    ],
    pasos: [
      'Elige la fruta que más te llame la atención hoy. No hay elección incorrecta.',
      'Añade el líquido. Si quieres más cremoso, menos líquido. Si más ligero, más líquido.',
      'Agrega los extras que sientas que necesitas hoy.',
      'Mezcla todo mientras piensas en algo bonito.',
      'Bebe despacio, notando cómo se siente en tu cuerpo.'
    ],
    refuerzo: '¡Le diste a tu cuerpo exactamente lo que necesitaba en este momento! Qué sabia eres 💙'
  },
  {
    id: 'sopa-reconfortante',
    nombre: 'Sopa del Autocuidado',
    descripcion: 'Calor líquido para días que necesitas mimo',
    tiempo: '20 min',
    porciones: '3',
    ingredientes: [
      '1 litro de caldo o agua',
      'Verduras que tengas (cebolla, zanahoria, apio...)',
      'Pasta pequeña, arroz o legumbres',
      'Aceite de oliva',
      'Especias que te gusten'
    ],
    pasos: [
      'Corta las verduras como te salga, no tienen que ser perfectas.',
      'Calienta aceite en una olla y añade las verduras. Escucha cómo chisporrotean.',
      'Añade el caldo y lo que hayas elegido (pasta, arroz, legumbres).',
      'Cocina hasta que todo esté tierno. Prueba y ajusta sabores.',
      'Sirve en tu tazón favorito. Esta sopa está hecha con cariño hacia ti.'
    ],
    refuerzo: '¡Creaste calor y nutrición para tu cuerpo! Esto es amor propio en forma de sopa 🍲'
  }
];

const mensajesRefuerzo = [
  "¡Hoy cocinaste por ti, bien hecho! 🌟",
  "Cada vez que cocinas, estás practicando el autocuidado 💚",
  "Tu intuición culinaria es más sabia de lo que crees ✨",
  "No hay forma incorrecta de nutrir tu cuerpo 🤗",
  "Cocinaste con amor, y eso se nota en cada bocado 💕",
  "¡Qué valiente eres al escuchar las necesidades de tu cuerpo! 🦋",
  "Tu creatividad en la cocina es hermosa 🎨",
  "Cada comida que preparas es un acto de rebeldía contra la dieta cultural 💪"
];

export function CocinaTerapeutica() {
  const [cursoActivo, setCursoActivo] = useState<string | null>(null);
  const [recetaActiva, setRecetaActiva] = useState<string | null>(null);
  const [progresoCursos, setProgresoCursos] = useState<string[]>([]);
  const [recetasCompletadas, setRecetasCompletadas] = useState<string[]>([]);

  const completarCurso = (cursoId: string) => {
    if (!progresoCursos.includes(cursoId)) {
      setProgresoCursos([...progresoCursos, cursoId]);
    }
    setCursoActivo(null);
    
    // Vibración de éxito
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const completarReceta = (recetaId: string) => {
    if (!recetasCompletadas.includes(recetaId)) {
      setRecetasCompletadas([...recetasCompletadas, recetaId]);
    }
    
    // Vibración de éxito
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const getMensajeRefuerzoAleatorio = () => {
    return mensajesRefuerzo[Math.floor(Math.random() * mensajesRefuerzo.length)];
  };

  const renderCurso = (curso: typeof cursosGuiados[0]) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ChefHat className="w-6 h-6 text-primary" />
            <CardTitle>{curso.titulo}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {curso.contenido?.introduccion && (
            <div className="space-y-3">
              <p className="text-muted-foreground whitespace-pre-line">
                {curso.contenido.introduccion}
              </p>
            </div>
          )}

          {curso.contenido?.principios && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Principios fundamentales:</h4>
              <ul className="space-y-2">
                {curso.contenido.principios.map((principio, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Heart className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span className="text-sm text-muted-foreground">{principio}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {curso.contenido?.ejercicio && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-primary whitespace-pre-line">
                {curso.contenido.ejercicio}
              </p>
            </div>
          )}

          <Button 
            onClick={() => completarCurso(curso.id)}
            className="w-full btn-primary"
          >
            Completar Lección
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderReceta = (receta: typeof recetasNeutrales[0]) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{receta.nombre}</CardTitle>    
            {recetasCompletadas.includes(receta.id) && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle size={12} className="mr-1" />
                Completada
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{receta.descripcion}</p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{receta.tiempo}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span>{receta.porciones} porción(es)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Ingredientes:</h4>
            <ul className="space-y-1">
              {receta.ingredientes.map((ingrediente, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {ingrediente}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Pasos:</h4>
            <ol className="space-y-3">
              {receta.pasos.map((paso, index) => (
                <li key={index} className="flex space-x-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{paso}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium">
              {receta.refuerzo}
            </p>
          </div>

          <Button 
            onClick={() => completarReceta(receta.id)}
            className="w-full btn-primary"
            disabled={recetasCompletadas.includes(receta.id)}
          >
            {recetasCompletadas.includes(receta.id) ? '¡Ya la hice!' : '¡La cocinaré!'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (cursoActivo) {
    const curso = cursosGuiados.find(c => c.id === cursoActivo);
    if (curso) {
      return (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setCursoActivo(null)}
            className="mb-4"
          >
            ← Volver al curso
          </Button>
          {renderCurso(curso)}
        </div>
      );
    }
  }

  if (recetaActiva) {
    const receta = recetasNeutrales.find(r => r.id === recetaActiva);
    if (receta) {
      return (
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setRecetaActiva(null)}
            className="mb-4"
          >
            ← Volver a recetas
          </Button>
          {renderReceta(receta)}
        </div>
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Cocina Terapéutica</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Reconecta con la comida desde el placer y la intuición. Aquí no hay etiquetas, 
          solo hay cuidado, creatividad y amor hacia ti misma.
        </p>
      </div>

      <Tabs defaultValue="curso" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="curso" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Curso & Recetas
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Blog Comunitario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curso" className="space-y-8">

      {/* Progreso general */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-primary">Tu Progreso</h3>
            <Badge variant="outline">
              {progresoCursos.length + recetasCompletadas.length} completadas
            </Badge>
          </div>
          <Progress 
            value={((progresoCursos.length + recetasCompletadas.length) / (cursosGuiados.length + recetasNeutrales.length)) * 100} 
            className="mb-2"
          />
          <p className="text-xs text-primary">
            {getMensajeRefuerzoAleatorio()}
          </p>
        </CardContent>
      </Card>

      {/* Curso Guiado */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Curso Guiado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cursosGuiados.map((curso) => (
            <Card 
              key={curso.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setCursoActivo(curso.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">{curso.duracion}</Badge>
                  {progresoCursos.includes(curso.id) && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                  {curso.titulo}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {curso.descripcion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recetas Neutrales */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Recetas Intuitivas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recetasNeutrales.map((receta) => (
            <Card 
              key={receta.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setRecetaActiva(receta.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Badge variant="outline">{receta.tiempo}</Badge>
                    <Badge variant="outline">{receta.porciones} porción(es)</Badge>
                  </div>
                  {recetasCompletadas.includes(receta.id) && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <h4 className="font-medium mb-2 group-hover:text-primary transition-colors">
                  {receta.nombre}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {receta.descripcion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mensaje motivacional */}
      <Card className="bg-rose-50 border-rose-200">
        <CardContent className="p-6 text-center">
          <Heart className="w-8 h-8 text-rose-600 mx-auto mb-4" />
          <h3 className="font-medium text-rose-800 mb-2">Recuerda</h3>
          <p className="text-sm text-rose-700">
            Cada vez que cocinas con amor hacia ti misma, estás sanando tu relación con la comida. 
            No hay comida perfecta, solo hay momentos perfectos de cuidado personal.
          </p>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="blog">
          <BlogRecetas />
        </TabsContent>
      </Tabs>
    </div>
  );
}