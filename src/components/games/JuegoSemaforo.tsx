import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Circle } from 'lucide-react';

const coloresDefinicion = {
  verde: {
    titulo: "Verde - Abierta",
    descripcion: "Te sientes tranquila, conectada contigo y con tus necesidades. Puedes tomar decisiones desde la calma.",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  amarillo: {
    titulo: "Amarillo - Atenta", 
    descripcion: "Empiezas a sentirte incómoda, ansiosa o surgen pensamientos críticos. Es una señal de alerta para prestar atención.",
    color: "bg-slate-50 text-slate-600 border-slate-200"
  },
  rojo: {
    titulo: "Rojo - Bloqueada",
    descripcion: "Te sientes abrumada, desconectada o a punto de actuar desde un impulso intenso. Es una señal para detenerte y buscar seguridad.",
    color: "bg-red-50 text-red-600 border-red-200"
  }
};

export function JuegoSemaforo() {
  const [paso, setPaso] = useState(1);
  const [momentoVerde, setMomentoVerde] = useState('');
  const [momentoAmarillo, setMomentoAmarillo] = useState('');
  const [momentoRojo, setMomentoRojo] = useState('');
  const [estrategiasAmarillo, setEstrategiasAmarillo] = useState('');
  const [estrategiasRojo, setEstrategiasRojo] = useState('');
  const [completado, setCompletado] = useState(false);

  const siguientePaso = () => {
    setPaso(paso + 1);
  };

  const finalizar = () => {
    setCompletado(true);
  };

  const reiniciar = () => {
    setPaso(1);
    setMomentoVerde('');
    setMomentoAmarillo('');
    setMomentoRojo('');
    setEstrategiasAmarillo('');
    setEstrategiasRojo('');
    setCompletado(false);
  };

  if (completado) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <CardTitle>Tu mapa emocional del semáforo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-green-500 text-green-500" />
                    <span className="font-semibold text-green-800">Verde - Momento de calma</span>
                  </div>
                  <p className="text-sm text-green-700">{momentoVerde}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-slate-500 text-slate-500" />
                    <span className="font-semibold text-slate-800">Gris - Momento de alerta</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{momentoAmarillo}</p>
                  <div className="bg-slate-100 p-2 rounded text-xs">
                    <strong>Estrategias para volver al verde:</strong> {estrategiasAmarillo}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-red-500 text-red-500" />
                    <span className="font-semibold text-red-800">Rojo - Momento intenso</span>
                  </div>
                  <p className="text-sm text-red-700 mb-2">{momentoRojo}</p>
                  <div className="bg-red-100 p-2 rounded text-xs">
                    <strong>Cuidado de emergencia:</strong> {estrategiasRojo}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Reflexiones para ti:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• ¿Qué situaciones o pensamientos suelen llevarte al amarillo?</p>
                <p>• ¿Puedes identificar señales tempranas de que estás saliendo del verde?</p>
                <p>• ¿Cómo te sientes al tener un plan de acción para cada color?</p>
              </div>
            </div>

            <div className="bg-background-submenu p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                <strong>Recuerda:</strong> Puedes usar esta herramienta varias veces al día. 
                Simplemente pregúntate: "¿En qué color estoy ahora?". Este chequeo aumenta 
                tu conciencia emocional y te ayuda a cuidarte antes de llegar a crisis.
              </p>
            </div>

            <Button onClick={reiniciar} className="w-full">
              Hacer nuevo mapa del día
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <CardTitle>Juego del semáforo</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Identifica tus señales emocionales internas para gestionar mejor tus respuestas.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {paso === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Imagina un semáforo interno. Vamos a asignarle un significado a cada color:
              </p>

              <div className="space-y-3">
                {Object.entries(coloresDefinicion).map(([color, info]) => (
                  <Card key={color} className={info.color}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Circle className={`w-4 h-4 fill-current`} />
                        <span className="font-semibold">{info.titulo}</span>
                      </div>
                      <p className="text-sm">{info.descripcion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={siguientePaso} className="w-full">
                Empezar a identificar mis momentos
              </Button>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Identificando momentos - Verde
              </Badge>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-green-500 text-green-500" />
                    <span className="font-semibold text-green-800">Momento Verde</span>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Piensa en tu día de hoy o ayer. ¿Cuándo te sentiste tranquila, conectada contigo y en calma?
                  </p>
                </CardContent>
              </Card>

              <Textarea
                placeholder="Ej: Esta mañana mientras tomaba mi café, me sentí tranquila y presente..."
                value={momentoVerde}
                onChange={(e) => setMomentoVerde(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!momentoVerde.trim()}
              >
                Continuar con Amarillo
              </Button>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Identificando momentos - Amarillo
              </Badge>

              <Card className="bg-background-submenu border-sage-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-slate-500 text-slate-500" />
                    <span className="font-semibold text-slate-800">Momento Gris</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    ¿Qué situación te puso en "amarillo"? ¿Cuándo empezaste a sentirte incómoda o ansiosa?
                  </p>
                </CardContent>
              </Card>

              <Textarea
                placeholder="Ej: Cuando vi un comentario en redes sociales que me hizo compararme con otros..."
                value={momentoAmarillo}
                onChange={(e) => setMomentoAmarillo(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!momentoAmarillo.trim()}
              >
                Continuar con Rojo
              </Button>
            </div>
          )}

          {paso === 4 && (
            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Identificando momentos - Rojo
              </Badge>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Circle className="w-4 h-4 fill-red-500 text-red-500" />
                    <span className="font-semibold text-red-800">Momento Rojo</span>
                  </div>
                  <p className="text-sm text-red-700 mb-3">
                    ¿Hubo algún momento en que te sentiste abrumada o a punto de actuar desde un impulso?
                  </p>
                </CardContent>
              </Card>

              <Textarea
                placeholder="Ej: Por la tarde, después de una discusión, me sentí completamente abrumada y quería aislarme..."
                value={momentoRojo}
                onChange={(e) => setMomentoRojo(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                onClick={siguientePaso} 
                className="w-full"
                disabled={!momentoRojo.trim()}
              >
                Crear estrategias de cuidado
              </Button>
            </div>
          )}

          {paso === 5 && (
            <div className="space-y-4">
              <Badge variant="outline" className="mb-4">
                Estrategias de cuidado
              </Badge>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Cuando estés en amarillo, ¿qué podrías hacer para volver al verde?
                  </label>
                  <Textarea
                    placeholder="Ej: Respirar profundo, escuchar una canción que me guste, escribir en mi diario..."
                    value={estrategiasAmarillo}
                    onChange={(e) => setEstrategiasAmarillo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-red-700 mb-2 block">
                    Cuando estés en rojo, ¿qué es lo mínimo que podrías hacer para cuidarte?
                  </label>
                  <Textarea
                    placeholder="Ej: Salir de la habitación, llamar a alguien de confianza, tomar un vaso de agua..."
                    value={estrategiasRojo}
                    onChange={(e) => setEstrategiasRojo(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={finalizar} 
                className="w-full"
                disabled={!estrategiasAmarillo.trim() || !estrategiasRojo.trim()}
              >
                Completar mi semáforo emocional
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}