// Scripts de hipnosis terapéutica para TCA
// Cada sesión está diseñada para durar aproximadamente 15 minutos

export interface HypnosisSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  script: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export const hypnosisScripts: HypnosisSession[] = [
  {
    id: 'eliminar-atracones',
    title: 'Liberación de Atracones',
    description: 'Sesión de hipnosis para superar los impulsos de atracones y recuperar el control',
    duration: '15 min',
    category: 'Control de Impulsos',
    script: `Bienvenida a esta sesión de hipnosis para liberarte de los atracones y recuperar tu poder personal.

Encuentra una posición cómoda... puede ser sentada o acostada... lo que sea más confortable para ti en este momento. Permite que tus ojos se cierren suavemente... como si fueran pétalos de una flor que se cierra al final del día.

Comenzamos llevando tu atención a tu respiración... Sin forzar nada... simplemente observando cómo el aire entra y sale de tu cuerpo de forma natural... Con cada respiración, permites que tu cuerpo se relaje un poco más...

PAUSA DE 10 SEGUNDOS

Inhala profundamente... y al exhalar, libera cualquier tensión que puedas estar sintiendo... Inhala paz... exhala preocupación... Inhala calma... exhala ansiedad...

Ahora imagina que estás en un hermoso jardín... Un lugar seguro y tranquilo que es completamente tuyo... Puedes ver flores de colores vibrantes... escuchar el suave murmullo de una fuente de agua... sentir la calidez del sol en tu piel...

En este jardín hay un sendero... y decides caminar por él... Con cada paso que das, te sientes más relajada... más en paz... más conectada contigo misma...

PAUSA DE 5 SEGUNDOS

Al final del sendero encuentras un hermoso árbol... Es el árbol de tu sabiduría interior... Bajo sus ramas hay un lugar perfecto para sentarte... Te sientas cómodamente y sientes cómo la energía del árbol te tranquiliza completamente...

Desde este lugar de calma profunda... quiero que visualices una versión de ti misma... Una versión que tiene una relación completamente equilibrada con la comida... Esta versión de ti come cuando tiene hambre... se detiene cuando está satisfecha... elige alimentos que nutren su cuerpo y su alma...

PAUSA DE 5 SEGUNDOS

Observa cómo esta versión equilibrada de ti misma maneja las emociones... Cuando siente estrés, ansiedad o tristeza... en lugar de buscar comida... respira profundamente... se conecta con sus emociones... las acepta con compasión... y busca maneras saludables de procesarlas...

Tal vez sale a caminar... llama a un amigo... escribe en su diario... o simplemente se permite sentir sin juzgarse... Observa cómo es libre... cómo es poderosa... cómo confía en sí misma...

Ahora quiero que te veas fusionándote con esta versión equilibrada... Sientes cómo su sabiduría se convierte en tu sabiduría... su fortaleza se convierte en tu fortaleza... su libertad se convierte en tu libertad...

PAUSA DE 10 SEGUNDOS

Desde este estado de integración... vamos a programar nuevas respuestas en tu mente subconsciente... Repite mentalmente estas afirmaciones... permitiendo que cada palabra se grabe profundamente en tu ser:

"Soy libre de los atracones... Mi cuerpo me habla con claridad y yo escucho... Como cuando tengo hambre... me detengo cuando estoy satisfecha... Confío en las señales de mi cuerpo..."

PAUSA DE 5 SEGUNDOS

"Cuando siento emociones intensas... respiro profundamente... me conecto conmigo misma... y encuentro maneras saludables de procesarlas... Soy más fuerte que cualquier impulso... Soy dueña de mis decisiones..."

PAUSA DE 5 SEGUNDOS

"Mi relación con la comida es de respeto y equilibrio... Cada día me siento más libre... más en control... más en paz conmigo misma... Merezco una vida libre de atracones... y esa vida es posible para mí..."

Ahora imagina que el árbol de la sabiduría te regala una semilla especial... Esta semilla contiene todo el poder que necesitas para mantener estos cambios... La plantas en tu corazón... y sientes cómo comienza a crecer... llenándote de determinación y autocompasión...

PAUSA DE 10 SEGUNDOS

Visualiza tu futuro... Los próximos días... semanas... meses... Te ves comiendo con tranquilidad... disfrutando de los alimentos... sintiéndote en control... libre... poderosa... Esta es tu nueva realidad...

Cuando estés lista... comenzarás a regresar a la conciencia normal... Sabes que llevas contigo todo lo que has experimentado aquí... Estas nuevas creencias y comportamientos son ahora parte de ti...

Cuenta mentalmente del 1 al 5... Con cada número te sientes más alerta... más presente... 1... comenzando a regresar... 2... sintiendo tu cuerpo... 3... más alerta... 4... casi completamente despierta... 5... abre los ojos cuando estés lista... sintiendo te completamente renovada y empoderada.

Felicidades por dar este paso hacia tu libertad.`,
    voiceSettings: {
      stability: 0.8,
      similarity_boost: 0.7,
      style: 0.2,
      use_speaker_boost: true
    }
  },
  {
    id: 'mentalidad-positiva',
    title: 'Mentalidad Positiva y Autoestima',
    description: 'Sesión para cultivar una mentalidad positiva y fortalecer la autoestima',
    duration: '15 min',
    category: 'Autoestima',
    script: `Bienvenida a esta sesión de hipnosis para cultivar una mentalidad positiva y fortalecer tu autoestima.

Permite que tu cuerpo encuentre una posición completamente cómoda... Cierra suavemente tus ojos... y comienza a conectarte con tu respiración natural...

Con cada exhalación... liberas cualquier pensamiento negativo... cualquier autocrítica... cualquier duda sobre ti misma... Con cada inhalación... invitas paz... amor propio... y positividad a tu ser...

PAUSA DE 10 SEGUNDOS

Imagina que estás de pie frente a un hermoso lago al amanecer... El agua está completamente en calma... reflejando como un espejo los colores dorados y rosados del cielo... Este lago representa tu mente... clara... serena... llena de posibilidades...

Te acercas al borde del agua... y mientras miras tu reflejo... en lugar de ver defectos... ves belleza... fortaleza... sabiduría... Ves a una mujer valiosa... única... digna de amor y respeto...

PAUSA DE 5 SEGUNDOS

Una suave brisa acaricia tu rostro... y con ella llegan susurros de verdades sobre ti... Escuchas claramente: "Eres suficiente... exactamente como eres... Eres valiosa... Tienes dones únicos que ofrecer al mundo..."

Estos susurros se convierten en una melodía hermosa... una canción de amor hacia ti misma... Permite que esta melodía llene cada célula de tu cuerpo... cada pensamiento de tu mente... cada latido de tu corazón...

Ahora visualiza un jardín interior... un lugar sagrado dentro de ti donde solo crecen pensamientos positivos... Caminas por este jardín... y ves flores que representan tus cualidades: fortaleza... compasión... inteligencia... creatividad... coraje...

PAUSA DE 5 SEGUNDOS

Cada flor es más hermosa que la anterior... y te das cuenta de que este jardín siempre ha estado ahí... solo necesitabas recordar cómo acceder a él... Ahora sabes que puedes venir aquí siempre que necesites recordar tu verdadero valor...

En el centro del jardín hay una fuente de agua cristalina... Te acercas y bebes de esta agua... Es el agua de la autocompasión... Con cada gota que bebes... sientes cómo se disuelven años de autocrítica... de comparaciones... de pensamientos que te limitaban...

PAUSA DE 10 SEGUNDOS

Ahora quiero que repitas mentalmente estas afirmaciones... permitiendo que cada palabra se integre profundamente en tu subconsciente:

"Me amo y me acepto completamente... Soy digna de amor... respeto... y felicidad... Mis pensamientos crean mi realidad... y elijo pensamientos que me empoderan..."

PAUSA DE 5 SEGUNDOS

"Cada día me veo con más compasión... Celebro mis logros sin importar qué tan pequeños sean... Soy mi mejor amiga... mi mayor apoyo... Confío en mi capacidad de crecer y sanar..."

PAUSA DE 5 SEGUNDOS

"Mi valor no depende de mi apariencia... mi peso... o la aprobación de otros... Soy valiosa por el simple hecho de existir... Merezco tratarme con el mismo amor que le daría a mi mejor amiga..."

Visualiza ahora tu vida diaria... Te ves despertando cada mañana con gratitud... Te hablas con amabilidad frente al espejo... Comes con amor hacia tu cuerpo... Te moves de maneras que te dan alegría...

Te ves estableciendo límites saludables... diciendo no cuando necesitas... pidiendo ayuda cuando la necesitas... Celebrando tus pequeños triunfos diarios... Siendo paciente contigo misma en los días difíciles...

PAUSA DE 10 SEGUNDOS

Imagina que tienes una varita mágica... y con ella puedes transformar cualquier pensamiento negativo en uno positivo... Cada vez que aparezca una autocrítica... simplemente tocas tu corazón con esta varita imaginaria... y el pensamiento se transforma automáticamente...

Esta varita siempre está contigo... es el poder de tu elección consciente... el poder de dirigir tus pensamientos hacia el amor propio... hacia la positividad... hacia la confianza en ti misma...

Visualiza tu futuro... Los próximos meses... años... Te ves irradiando confianza... amor propio... positividad... Las personas a tu alrededor se sienten inspiradas por tu energía... por tu autenticidad... por tu amor propio...

PAUSA DE 5 SEGUNDOS

Sabes que todos estos cambios positivos ya están en marcha... Ya están sucediendo en tu vida... Cada día te sientes más segura... más positiva... más enamorada de quien eres...

Ahora es momento de regresar... llevando contigo todas estas verdades... todos estos sentimientos positivos... toda esta autoestima renovada...

Cuenta mentalmente del 1 al 5... 1... comenzando a regresar... sintiendo gratitud por este tiempo contigo misma... 2... más alerta... llevando contigo todo el amor propio... 3... más presente... sintiendo confianza... 4... casi completamente despierta... recordando cuán valiosa eres... 5... abre los ojos cuando estés lista... sintiéndote radiante y llena de amor propio.

Tu mentalidad positiva es tu superpoder. Úsalo todos los días.`,
    voiceSettings: {
      stability: 0.85,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true
    }
  },
  {
    id: 'relacion-comida',
    title: 'Transformar la Relación con la Comida',
    description: 'Sesión para sanar y transformar tu relación con la alimentación',
    duration: '15 min',
    category: 'Alimentación Consciente',
    script: `Bienvenida a esta poderosa sesión de hipnosis para transformar tu relación con la comida.

Encuentra tu posición más cómoda... Permite que tus ojos se cierren naturalmente... como si fueras a dormir la siesta más reparadora de tu vida...

Comienza a respirar lentamente... profundamente... Con cada respiración... permites que tu cuerpo se relaje completamente... Imagina que con cada exhalación... liberás años de conflicto con la comida... años de culpa... de miedo... de confusión...

PAUSA DE 10 SEGUNDOS

Ahora te invito a imaginar que estás en una hermosa cocina... No es cualquier cocina... es la cocina de tu corazón... un lugar sagrado donde la comida y el amor se encuentran...

Esta cocina está llena de luz cálida... huele a hierbas frescas... a pan recién horneado... a especias aromáticas... Todo aquí representa nutrición... amor... cuidado personal...

En el centro de esta cocina hay una mesa hermosa... Te sientas en ella... y frente a ti aparece un plato... Pero este no es un plato común... es el plato de la sabiduría nutricional... y en él solo aparecen los alimentos que tu cuerpo verdaderamente necesita en este momento...

PAUSA DE 5 SEGUNDOS

Observas estos alimentos... y sientes una conexión profunda con ellos... No hay culpa... no hay miedo... solo gratitud... solo amor... Entiendes que los alimentos son energía... son vida... son medicina para tu cuerpo y tu alma...

Tomas el primer bocado... lentamente... conscientemente... Sientes cada textura... cada sabor... Tu cuerpo te susurra "gracias"... Tu mente está en paz... Tu corazón está lleno de amor...

Con cada bocado... sientes cómo tu cuerpo te comunica exactamente lo que necesita... Cuando está satisfecho... naturalmente dejas de comer... No hay fuerza... no hay control externo... solo una comunicación amorosa entre tú y tu cuerpo...

PAUSA DE 10 SEGUNDOS

Ahora quiero que visualices todas las creencias limitantes que has tenido sobre la comida... Tal vez pensamientos como "la comida es mi enemiga"... "no puedo confiar en mí misma con la comida"... "comer es peligroso"...

Imagina que cada una de estas creencias es como una hoja seca... y hay una suave brisa que las levanta... las lleva lejos... muy lejos... hasta que desaparecen completamente... Ya no son parte de ti... Ya no tienen poder sobre ti...

En su lugar... nuevas creencias comienzan a florecer... como flores primaverales después del invierno... Repite mentalmente estas nuevas verdades:

"La comida es mi aliada... Mi cuerpo es sabio y me guía... Como con conciencia y gratitud... La comida nutre mi cuerpo... mi mente... y mi espíritu..."

PAUSA DE 5 SEGUNDOS

"Confío en las señales de mi cuerpo... Sé cuándo tengo hambre... sé cuándo estoy satisfecha... Como lo que mi cuerpo necesita... en las cantidades que necesita... Soy libre en mi relación con la comida..."

PAUSA DE 5 SEGUNDOS

"Cada comida es una oportunidad de amarme... de nutrirme... de celebrar la vida... No hay alimentos buenos o malos... solo alimentos que me sirven mejor en diferentes momentos... Soy flexible... soy compasiva conmigo misma..."

Visualiza ahora cómo será tu nueva relación con la comida... Te ves despertando por la mañana... escuchando a tu cuerpo... preparando alimentos con amor... comiendo sin prisa... saboreando cada bocado...

Te ves en situaciones sociales... disfrutando de la comida sin ansiedad... sin culpa... compartiendo momentos hermosos con otros... sintiéndote libre... natural... en paz...

PAUSA DE 5 SEGUNDOS

Imaginas las comidas familiares... las celebraciones... los momentos de estrés... En todas estas situaciones... mantienes esa conexión amorosa con la comida... esa confianza en tu cuerpo... esa paz interior...

Ahora visualiza un cofre del tesoro dentro de tu corazón... Dentro de este cofre guardas todas las herramientas que necesitas para mantener esta nueva relación... La paciencia... la compasión... la consciencia... la confianza... el amor propio...

PAUSA DE 10 SEGUNDOS

Cada vez que necesites recordar cómo relacionarte sanamente con la comida... simplemente llevas tu mano a tu corazón... respiras profundamente... y accedes a este cofre del tesoro... Todas las herramientas siempre están ahí... disponibles para ti...

Te ves en el futuro... meses... años desde ahora... Tu relación con la comida es completamente natural... fluida... amorosa... Las personas a tu alrededor notan tu paz... tu equilibrio... tu libertad...

Comes cuando tienes hambre... disfrutas cada bocado... te detienes cuando estás satisfecha... Tu peso se equilibra naturalmente... Tu energía es estable... Tu mente está en paz...

PAUSA DE 5 SEGUNDOS

Esta nueva relación con la comida ya está comenzando... Ya está transformándose... Con cada día que pasa... se hace más fuerte... más natural... más parte de quien eres...

Ahora es momento de regresar... llevando contigo esta transformación... esta nueva sabiduría... esta libertad...

Cuenta mentalmente del 1 al 5... 1... comenzando a emerger... sintiendo gratitud por esta transformación... 2... más consciente... llevando contigo la paz con la comida... 3... más alerta... sintiendo confianza en tu cuerpo... 4... casi completamente despierta... recordando tu nueva relación amorosa con la alimentación... 5... abre los ojos cuando estés lista... sintiéndote libre... equilibrada... y en paz con la comida.

Tu nueva relación con la comida es de amor... respeto... y sabiduría. Confía en este proceso.`,
    voiceSettings: {
      stability: 0.75,
      similarity_boost: 0.8,
      style: 0.25,
      use_speaker_boost: true
    }
  }
];

// Función para obtener la duración estimada en minutos basada en el conteo de palabras
export const getEstimatedDuration = (script: string): number => {
  const wordsPerMinute = 150; // Velocidad promedio de lectura para hipnosis (más lenta)
  const wordCount = script.split(' ').length;
  return Math.round(wordCount / wordsPerMinute);
};

// Función para formatear el script para mejor lectura de TTS
export const formatScriptForTTS = (script: string): string => {
  return script
    .replace(/\.\.\./g, '... <break time="1s"/>') // Pausas para puntos suspensivos
    .replace(/PAUSA DE (\d+) SEGUNDOS/g, '<break time="$1s"/>') // Pausas específicas
    .replace(/\n\n/g, ' <break time="0.5s"/> ') // Pausas entre párrafos
    .replace(/\n/g, ' ') // Eliminar saltos de línea simples
    .trim();
};