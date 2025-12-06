import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type UsageType = 'recipe' | 'audio';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Increment Usage] Solicitud recibida');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verificar autenticación
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Debes iniciar sesión' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener tipo del body
    const { type } = await req.json() as { type: UsageType };

    if (!type || !['recipe', 'audio'].includes(type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tipo inválido. Debe ser "recipe" o "audio"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Increment Usage] Usuario: ${user.id}, Tipo: ${type}`);

    // Usar service role para actualizar
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Obtener suscripción actual
    const { data: subscription, error: subError } = await supabaseService
      .from('subscriptions')
      .select('monthly_recipe_count, monthly_audio_count, last_reset_date')
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError || !subscription) {
      console.error('[Increment Usage] Suscripción no encontrada');
      return new Response(
        JSON.stringify({ success: false, error: 'Suscripción no encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si necesita reset mensual
    const now = new Date();
    const lastReset = new Date(subscription.last_reset_date);
    const isNewMonth = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();

    const updateData: Record<string, unknown> = {
      updated_at: now.toISOString()
    };

    if (isNewMonth) {
      // Resetear contadores y luego incrementar
      updateData.monthly_recipe_count = type === 'recipe' ? 1 : 0;
      updateData.monthly_audio_count = type === 'audio' ? 1 : 0;
      updateData.last_reset_date = now.toISOString().split('T')[0];
    } else {
      // Solo incrementar
      if (type === 'recipe') {
        updateData.monthly_recipe_count = (subscription.monthly_recipe_count || 0) + 1;
      } else {
        updateData.monthly_audio_count = (subscription.monthly_audio_count || 0) + 1;
      }
    }

    const { error: updateError } = await supabaseService
      .from('subscriptions')
      .update(updateData)
      .eq('user_id', user.id);

    if (updateError) {
      console.error(`[Increment Usage] Error actualizando: ${updateError.message}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al actualizar el uso' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newCount = type === 'recipe' 
      ? (updateData.monthly_recipe_count as number)
      : (updateData.monthly_audio_count as number);

    console.log(`[Increment Usage] ${type} incrementado a ${newCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        type,
        new_count: newCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Increment Usage] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
