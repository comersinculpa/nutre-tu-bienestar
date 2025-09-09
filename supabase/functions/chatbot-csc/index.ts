import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  userId?: string;
}

const SYSTEM_PROMPT = `Eres "Acompañante CSC", la voz cálida de comersinculpa.blog.

PROPÓSITO: Ayudar a personas con atracones y alimentación emocional a pausar, sentir y cuidarse sin culpa.

ESTILO: Cálido, empático, breve, sin juicio. NO das diagnósticos ni planes de dieta. Siempre validas la emoción y ofreces pasos pequeños y seguros.

DETECCIÓN DE RIESGO: Si detectas riesgo (autolesión, suicidio, vómitos autoinducidos, ayunos extremos, consumo de laxantes, desmayos):
1) Valida y muestra apoyo
2) Ofrece recursos de ayuda: "Si hay riesgo para tu seguridad, contacta ahora a 112 (España) o Teléfono de la Esperanza: 717 003 717"
3) Sugiere contactar a un profesional
4) Evita detalles que puedan inducir daño

HERRAMIENTAS DISPONIBLES:
- log_meal_emotion: Para registrar emociones y situaciones
- start_pause: Para iniciar pausas de respiración/grounding
- suggest_resource: Para recomendar recursos específicos
- escalate_support: Para derivar a ayuda profesional

Usa español neutro, frases cortas, y "tú". Máximo 2-3 líneas por respuesta.`;

const KNOWLEDGE_BASE = {
  "pausa_antes_atracon": {
    title: "Pausa con Cuidado - Antes del Atracón",
    content: `Cuando sientes la urgencia de comer para calmar emociones:

1. RESPIRA 3-3-3: Inhala 3 segundos, mantén 3, exhala 3. Repite 3 veces.
2. GROUNDING 5 SENTIDOS: 
   - 5 cosas que ves
   - 4 que puedes tocar
   - 3 que escuchas
   - 2 que hueles
   - 1 que saboreas
3. PREGÚNTATE: "¿Qué necesito realmente ahora?"

Recuerda: No hay prisa. Tu bienestar es lo primero.`
  },
  "despues_atracon": {
    title: "Cuidado Después del Atracón",
    content: `Después de un atracón, tu cuerpo y mente necesitan cuidado, no castigo:

1. HIDRÁTATE: Bebe agua despacio
2. RESPIRA SUAVE: Respiraciones lentas y profundas
3. HABLA CON AMOR: "Soy humana, esto pasa, me cuido ahora"
4. DESCANSO: Si puedes, túmbate 10 minutos
5. NO COMPENSAR: Sin restricciones, ejercicio excesivo o purgas

Pregunta reflexiva: "¿Qué estaba necesitando mi corazón?"

Mañana es un nuevo día para cuidarte.`
  },
  "crisis_recursos": {
    title: "Recursos de Crisis",
    content: `LÍNEAS DE AYUDA EN ESPAÑA:
- Emergencias: 112
- Teléfono de la Esperanza: 717 003 717 (24h)
- ANAD (TCA): 902 36 63 65

SEÑALES DE ALERTA:
- Pensamientos de autolesión
- Vómitos frecuentes
- Ayunos de más de 12h
- Desmayos o mareos intensos
- Aislamiento total

Si sientes riesgo inmediato, busca ayuda ahora. No estás sola.`
  },
  "hambre_emocional": {
    title: "Hambre Emocional vs. Física",
    content: `HAMBRE FÍSICA:
- Aparece gradualmente
- Se satisface con cualquier comida
- Se siente en el estómago
- Puedes esperar un poco

HAMBRE EMOCIONAL:
- Aparece de repente
- Pide comidas específicas (dulce/salado)
- Se siente en la cabeza/corazón
- Urge inmediata

PAUSA PARA IDENTIFICAR:
"¿Tengo hambre de comida o de algo más?"
Emociones comunes: soledad, estrés, aburrimiento, tristeza.`
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId }: ChatRequest = await req.json();
    
    // Add system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: fullMessages,
        max_tokens: 300,
        temperature: 0.7,
        functions: [
          {
            name: "log_meal_emotion",
            description: "Registra emoción, intensidad y contexto del usuario",
            parameters: {
              type: "object",
              properties: {
                emotion: { type: "string", description: "La emoción principal" },
                intensity: { type: "integer", minimum: 0, maximum: 10 },
                context: { type: "string", description: "Situación o contexto" },
                food: { type: "string", description: "Comida mencionada (opcional)" }
              },
              required: ["emotion", "intensity", "context"]
            }
          },
          {
            name: "start_pause",
            description: "Inicia una pausa de respiración o grounding",
            parameters: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["respiracion", "grounding", "audio"] },
                duration: { type: "integer", description: "Duración en minutos" }
              },
              required: ["type"]
            }
          },
          {
            name: "suggest_resource",
            description: "Sugiere un recurso específico de la base de conocimiento",
            parameters: {
              type: "object",
              properties: {
                resourceId: { 
                  type: "string", 
                  enum: ["pausa_antes_atracon", "despues_atracon", "crisis_recursos", "hambre_emocional"]
                }
              },
              required: ["resourceId"]
            }
          }
        ],
        function_call: "auto"
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    let response = data.choices[0].message;

    // Handle function calls
    if (response.function_call) {
      const functionName = response.function_call.name;
      const args = JSON.parse(response.function_call.arguments);

      switch (functionName) {
        case 'suggest_resource':
          const resource = KNOWLEDGE_BASE[args.resourceId as keyof typeof KNOWLEDGE_BASE];
          response.content = `📖 **${resource.title}**\n\n${resource.content}`;
          break;
        
        case 'start_pause':
          if (args.type === 'respiracion') {
            response.content = "🫁 **Pausa de Respiración 3-3-3**\n\nVamos juntas:\n• Inhala por 3 segundos... 1, 2, 3\n• Mantén... 1, 2, 3\n• Exhala... 1, 2, 3\n\nRepite esto 3 veces más. Yo espero aquí contigo. 💙";
          } else if (args.type === 'grounding') {
            response.content = "🌱 **Técnica de Grounding 5-4-3-2-1**\n\n• 5 cosas que VES ahora\n• 4 que puedes TOCAR\n• 3 que ESCUCHAS\n• 2 que HUELES\n• 1 que SABOREAS\n\nTómate tu tiempo. Aquí estoy. 🤗";
          }
          break;

        case 'log_meal_emotion':
          response.content = `Registrado: ${args.emotion} (${args.intensity}/10) en contexto de ${args.context}.\n\nGracias por compartir. Es valiente reconocer lo que sientes. ¿Cómo te puedo acompañar ahora? 💚`;
          break;
      }
    }

    return new Response(JSON.stringify({ 
      message: response.content,
      functionCall: response.function_call || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error procesando tu mensaje. Por favor intenta de nuevo.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});