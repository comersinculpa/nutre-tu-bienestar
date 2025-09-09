import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Heart, Lightbulb, Volume2 } from 'lucide-react';

const mensajesCriticosComunes = [
  "No eres lo suficientemente buena",
  "Siempre arruinas las cosas", 
  "Nadie te va a querer si no cambias",
  "Eres un desastre",
  "No mereces ser feliz",
  "Todos se dan cuenta de tus errores",
  "Nunca vas a cambiar"
];

export function JuegoRolesCriticaInterna() {
  const [paso, setPaso] = useState(1);
  const [mensajeCritico, setMensajeCritico] = useState('');
  const [respuestaCompasiva, setRespuestaCompasiva] = useState('');
  const [dialogosCreados, setDialogosCreados] = useState<Array<{mensaje: string, respuesta: string}>>([]);
  const [completado, setCompletado] = useState(false);

  const seleccionarMensaje = (mensaje: string) => {
    setMensajeCritico(mensaje);
    setPaso(2);
  };

  const guardarDialogo = () => {
    const nuevoDialogo = {
      mensaje: mensajeCritico,
      respuesta: respuestaCompasiva
    };
    setDialogosCreados([...dialogosCreados, nuevoDialogo]);
    
    if (dialogosCreados.length >= 2) {
      setCompletado(true);
    } else {
      // Resetear para crear otro diálogo
      setMensajeCritico('');
      setRespuestaCompasiva('');
      setPaso(1);
    }
  };

  const reiniciar = () => {
    setPaso(1);
    setMensajeCritico('');
    setRespuestaCompasiva('');
    setDialogosCreados([]);
    setCompletado(false);
  };

  const obtenerRespuestaSugerida = (mensaje: string) => {
    const respuestasCompasivas: { [key: string]: string } = {
      "No eres lo suficientemente buena": "Entiendo que tengas miedo de no ser suficiente. Pero ser 'suficiente' no es algo que necesites demostrar. Tu valor es inherente, no depende de tu rendimiento. Estás haciendo lo mejor que puedes en este momento.",
      "Siempre arruinas las cosas": "Todos cometemos errores; es parte de ser humano. Tus errores no definen quién eres. De hecho, cada error es una oportunidad de crecer. Mereces compasión, especialmente de ti misma.",
      "Nadie te va a querer si no cambias": "El amor verdadero no viene con condiciones sobre cómo debes ser. Las personas que te aman de verdad te aceptan como eres, en tu proceso de crecimiento. Tú también mereces amarte incondicionalmente.",
      "Eres un desastre": "Estar pasando por momentos difíciles no te convierte en un desastre. Eres una persona compleja navegando la vida lo mejor que puedes. Tienes fortalezas y vulnerabilidades, como todos.",
      "No mereces ser feliz": "Por supuesto que mereces ser feliz. Todos los seres humanos merecen momentos de alegría y paz. Tu felicidad importa y es válida, sin importar lo que hayas hecho o dejado de hacer.",
      "Todos se dan cuenta de tus errores": "La mayoría de las personas están demasiado ocupadas con sus propias vidas para juzgar cada movimiento tuyo. Y aquellos que realmente te conocen y te aman entienden que eres humana.",
      "Nunca vas a cambiar": "El cambio es posible en cualquier momento. Ya has cambiado muchas veces en tu vida, y seguirás evolucionando. El crecimiento toma tiempo, y mereces paciencia contigo misma durante este proceso."
    };
    return respuestasCompasivas[mensaje] || "Esa voz crítica está tratando de protegerte del dolor, pero juzgarte no es la solución. Mereces tratarte con la misma compasión que le mostrarías a una buena amiga.";
  };

  if (completado) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-600" />
              <CardTitle>Tus diálogos compasivos</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Has practicado interrumpir la crítica interna con autocompasión
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {dialogosCreados.map((dialogo, indice) => (
                <div key={indice} className="space-y-3">
                  <Badge variant="outline">Diálogo {indice + 1}</Badge>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-red-800">Crítica interna</span>
                        </div>
                        <p className="text-sm text-red-700 italic">"{dialogo.mensaje}"</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800">Aliada compasiva</span>
                        </div>
                        <p className="text-sm text-green-700 italic">"{dialogo.respuesta}"</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Reflexiones finales:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• ¿Cómo se siente darle una respuesta compasiva a tu crítica interna?</p>
                <p>• ¿Qué tono de voz tiene tu aliada compasiva? ¿Qué te transmite?</p>
                <p>• ¿Qué mensaje de tu aliada compasiva necesitas escuchar más a menudo?</p>
                <p>• ¿Puedes imaginarte usando estas respuestas en tu vida diaria?</p>
              </div>
            </div>

            <div className="bg-background-submenu p-4 rounded-lg">
              <p className="text-sm text-sage-700">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                <strong>Recuerda:</strong> Este ejercicio te entrena para interrumpir activamente los ciclos 
                de autocrítica. Al desarrollar una voz interna compasiva, construyes resiliencia emocional 
                y creas una base de seguridad interna que te sostiene en los momentos difíciles.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={reiniciar} className="flex-1">
                Practicar más diálogos
              </Button>
            </div>
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
            <Users className="w-6 h-6 text-orange-600" />
            <CardTitle>Juego de roles con la crítica interna</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Identifica los mensajes de tu crítica interna y practica respuestas basadas en la autocompasión.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Badge variant="outline" className="mb-4">
            Diálogo {dialogosCreados.length + 1} - Paso {paso} de 2
          </Badge>

          {paso === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Piensa en un mensaje que tu "crítica interna" te dice a menudo. 
                Puedes elegir uno de estos ejemplos comunes o escribir el tuyo propio:
              </p>

              <div className="grid grid-cols-1 gap-2">
                {mensajesCriticosComunes.map((mensaje, indice) => (
                  <Button
                    key={indice}
                    variant="outline"
                    className="text-left justify-start h-auto p-4 hover:bg-red-50 hover:border-red-200"
                    onClick={() => seleccionarMensaje(mensaje)}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-sm">"{mensaje}"</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">O escribe tu propio mensaje crítico:</p>
                <Textarea
                  placeholder="Ej: No puedes hacer nada bien..."
                  value={mensajeCritico}
                  onChange={(e) => setMensajeCritico(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => setPaso(2)} 
                className="w-full"
                disabled={!mensajeCritico.trim()}
              >
                Crear respuesta compasiva
              </Button>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-800">Tu crítica interna dice:</span>
                  </div>
                  <p className="text-sm text-red-700 italic">"{mensajeCritico}"</p>
                </CardContent>
              </Card>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">💡 Respuesta compasiva sugerida:</p>
                <p className="text-sm text-blue-800 italic">
                  "{obtenerRespuestaSugerida(mensajeCritico)}"
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Ahora es el turno de tu "aliada compasiva". ¿Qué le respondería a esa crítica?
                </p>
                <p className="text-xs text-muted-foreground">
                  Su objetivo no es pelear, sino ofrecer una perspectiva más amable, realista y de apoyo.
                  Imagina qué le dirías a una amiga muy querida que estuviera pasando por lo mismo.
                </p>
                <Textarea
                  placeholder="Ej: Entiendo que tengas miedo, pero juzgarte no te ayuda. Estás haciendo lo mejor que puedes..."
                  value={respuestaCompasiva}
                  onChange={(e) => setRespuestaCompasiva(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setPaso(1)}
                  className="flex-1"
                >
                  Elegir otro mensaje
                </Button>
                <Button 
                  onClick={guardarDialogo} 
                  className="flex-1"
                  disabled={!respuestaCompasiva.trim()}
                >
                  {dialogosCreados.length < 2 ? 'Crear otro diálogo' : 'Finalizar práctica'}
                </Button>
              </div>
            </div>
          )}

          {dialogosCreados.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ✅ Has creado {dialogosCreados.length} diálogo{dialogosCreados.length > 1 ? 's' : ''} compasivo{dialogosCreados.length > 1 ? 's' : ''}
                {dialogosCreados.length < 3 && ' (puedes crear más para practicar)'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}