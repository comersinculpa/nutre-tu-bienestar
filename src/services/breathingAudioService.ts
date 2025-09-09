import { supabase } from '@/lib/supabase';

// Script de respiración guiada de 3 minutos
export const breathingGuidanceScript = `
Hola, respira conmigo. Vamos a dedicar estos 3 minutos solo para ti, para calmarte y centrarte.

Encuentra una posición cómoda, ya sea sentada o de pie. Cierra los ojos si te sientes cómoda haciéndolo.

Vamos a comenzar con respiraciones profundas y conscientes.

Inhala lentamente por la nariz... 2... 3... 4... Mantén el aire... 2... 3... Y exhala suavemente por la boca... 2... 3... 4... 5... 6.

Muy bien. Otra vez. Inhala profundamente... 2... 3... 4... Retén... 2... 3... Y exhala despacio... 2... 3... 4... 5... 6.

Siente cómo tu cuerpo se relaja con cada exhalación. Estás segura. Estás en calma.

Continúa respirando a tu propio ritmo natural. Si tu mente se distrae, simplemente vuelve tu atención a la respiración. No te juzgues, es normal.

Inhala calma... y exhala tensión. Inhala seguridad... y exhala preocupación.

Ahora, pon una mano en tu corazón y otra en tu abdomen. Siente el movimiento natural de tu respiración.

Repite conmigo mentalmente: "Estoy segura. Estoy en calma. Este momento difícil pasará."

Respira profundamente... Inhala... 2... 3... 4... Retén... 2... 3... Exhala lentamente... 2... 3... 4... 5... 6.

Continúa con este patrón. Cada respiración te trae más calma y claridad.

Inhala... 2... 3... 4... Retén... 2... 3... Exhala... 2... 3... 4... 5... 6.

Si sientes emociones intensas, está bien. Respira con ellas, no contra ellas. Tu respiración es tu ancla de seguridad.

Otro ciclo más. Inhala profundamente... Mantén... Y exhala completamente, liberando cualquier tensión.

Ahora respira naturalmente. Observa cómo te sientes. Has creado un espacio de calma dentro de ti.

Mueve suavemente los dedos de las manos y los pies. Cuando estés lista, abre los ojos lentamente.

Recuerda: tu respiración está siempre contigo. Es tu herramienta de calma disponible en cualquier momento.

Has hecho algo muy valioso por ti misma. Eres valiente y mereces cuidado.
`;

export class BreathingAudioService {
  private static instance: BreathingAudioService;
  private audioUrl: string | null = null;
  private isGenerating: boolean = false;

  static getInstance(): BreathingAudioService {
    if (!BreathingAudioService.instance) {
      BreathingAudioService.instance = new BreathingAudioService();
    }
    return BreathingAudioService.instance;
  }

  async generateBreathingAudio(): Promise<string> {
    if (this.audioUrl) {
      return this.audioUrl;
    }

    if (this.isGenerating) {
      // Esperar hasta que termine de generar
      while (this.isGenerating) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.audioUrl || '';
    }

    this.isGenerating = true;

    try {
      const { data, error } = await supabase.functions.invoke('generate-breathing-audio', {
        body: {
          text: breathingGuidanceScript,
          voice_id: 'Aria', // Voz calmada y femenina
          model_id: 'eleven_multilingual_v2'
        }
      });

      if (error) {
        throw new Error(`Error generating breathing audio: ${error.message}`);
      }

      // Convertir ArrayBuffer a Blob
      const audioBlob = new Blob([data], { type: 'audio/mpeg' });
      this.audioUrl = URL.createObjectURL(audioBlob);
      
      return this.audioUrl;
    } catch (error) {
      console.error('Error generating breathing audio:', error);
      throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  clearAudioCache() {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
  }
}