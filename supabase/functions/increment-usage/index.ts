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

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type } = await req.json() as { type: UsageType };

    // Use anon client to get user
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuario no autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to update subscription
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    const column = type === 'recipe' ? 'monthly_recipe_count' : 'monthly_audio_count';

    const { data: current, error: fetchError } = await supabaseService
      .from('subscriptions')
      .select(column)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching subscription:', fetchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al obtener la suscripción' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newCount = (current[column] || 0) + 1;

    const { error: updateError } = await supabaseService
      .from('subscriptions')
      .update({ [column]: newCount })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating usage:', updateError);
      return new Response(
        JSON.stringify({ success: false, error: 'Error al actualizar el uso' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, new_count: newCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en increment-usage:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
