import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[Sync RevenueCat] Solicitud recibida');

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variables de entorno no configuradas');
    }

    // Obtener token del header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Crear cliente con el token del usuario
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener revenuecatUserId del body
    const { revenuecatUserId } = await req.json();

    if (!revenuecatUserId) {
      return new Response(
        JSON.stringify({ success: false, error: 'revenuecatUserId es requerido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Sync RevenueCat] Vinculando usuario ${user.id} con RevenueCat ${revenuecatUserId}`);

    // Actualizar el revenuecat_user_id en la suscripción del usuario
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        revenuecat_user_id: revenuecatUserId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error(`[Sync RevenueCat] Error actualizando: ${updateError.message}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al sincronizar' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Sync RevenueCat] Usuario ${user.id} vinculado correctamente`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'RevenueCat sincronizado correctamente' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[Sync RevenueCat] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
