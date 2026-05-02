import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function getServiceClient() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
}

const BLACKCAT_BASE_URLS = [
  'https://api.blackcatpay.com.br/api',
  'https://api.blackcatpay.com.br',
];

function getBlackCatHeaders(): HeadersInit {
  const secretKey = Deno.env.get('BLACKCAT_SECRET_KEY');
  if (!secretKey) {
    throw new Error('BLACKCAT_KEY_MISSING');
  }

  return {
    'Authorization': `Bearer ${secretKey}`,
    'x-api-key': secretKey,
  };
}

async function requestBlackCatStatus(transactionId: string) {
  let lastResponse: Response | null = null;
  let lastText = '';
  let lastData: any = null;

  for (const baseUrl of BLACKCAT_BASE_URLS) {
    const response = await fetch(`${baseUrl}/transactions/${transactionId}`, {
      method: 'GET',
      headers: getBlackCatHeaders(),
      signal: AbortSignal.timeout(15000),
    });

    const rawText = await response.text();
    let data: any = null;
    try { data = JSON.parse(rawText); } catch {}

    lastResponse = response;
    lastText = rawText;
    lastData = data;

    const errorCode = String(data?.code || '').toUpperCase();
    if (response.ok || (response.status !== 404 && errorCode !== 'NOT_FOUND')) {
      return { response, rawText, data, requestUrl: `${baseUrl}/transactions/${transactionId}` };
    }
  }

  return { response: lastResponse, rawText: lastText, data: lastData, requestUrl: 'unknown' };
}

async function verifyAdminPassword(supabase: ReturnType<typeof createClient>, password: string): Promise<boolean> {
  const { data } = await supabase
    .from('admin_settings')
    .select('setting_value')
    .eq('setting_key', 'admin_password')
    .single();
  return data?.setting_value === password;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, password, ...params } = body;

    if (!password || typeof password !== 'string') {
      return new Response(JSON.stringify({ error: 'Senha obrigatória' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = getServiceClient();
    const isValid = await verifyAdminPassword(supabase, password);

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Senha incorreta' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result: any = null;

    switch (action) {
      case 'get_transactions': {
        let query = supabase
          .from('card_transactions')
          .select('*')
          .order('created_at', { ascending: false });
        if (params.filter === 'pending') {
          query = query.eq('status', 'pending');
        }
        const { data, error } = await query;
        if (error) throw error;
        result = data;
        break;
      }

      case 'update_transaction': {
        const { id, status } = params;
        const { error } = await supabase
          .from('card_transactions')
          .update({ status, processed_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'get_complaints': {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        result = data;
        break;
      }

      case 'update_complaint': {
        const { id, status } = params;
        const { error } = await supabase
          .from('complaints')
          .update({ status })
          .eq('id', id);
        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'get_pix_leads': {
        const { data, error } = await supabase
          .from('pix_leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        result = data;
        break;
      }

      case 'change_password': {
        const { new_password } = params;
        if (!new_password || new_password.length < 4) {
          return new Response(JSON.stringify({ error: 'Senha deve ter no mínimo 4 caracteres' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const { error } = await supabase
          .from('admin_settings')
          .update({ setting_value: new_password, updated_at: new Date().toISOString() })
          .eq('setting_key', 'admin_password');
        if (error) throw error;
        result = { success: true };
        break;
      }

      case 'verify_password': {
        result = { valid: true };
        break;
      }

      case 'check_pix_status': {
        const { transaction_id } = params;
        if (!transaction_id) {
          return new Response(JSON.stringify({ error: 'transaction_id obrigatório' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (!Deno.env.get('BLACKCAT_SECRET_KEY')) {
          return new Response(JSON.stringify({ error: 'Chave BlackCat não configurada' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { response: blackcatRes, rawText, data: blackcatData, requestUrl } = await requestBlackCatStatus(transaction_id);

        const txData = blackcatData?.data || blackcatData || {};
        const rawStatus = (txData.status || txData.paymentStatus || txData.payment_status || '').toString().toLowerCase();

        let mappedStatus = 'pending';
        if (['paid', 'approved', 'confirmed', 'completed', 'settled'].includes(rawStatus)) {
          mappedStatus = 'paid';
          // Update pix_leads status
          await supabase.from('pix_leads').update({ status: 'paid' }).eq('transaction_id', transaction_id);
        } else if (['expired', 'canceled', 'cancelled', 'refunded', 'failed', 'rejected'].includes(rawStatus)) {
          mappedStatus = 'failed';
          await supabase.from('pix_leads').update({ status: 'failed' }).eq('transaction_id', transaction_id);
        }

        result = {
          status: mappedStatus,
          raw_status: rawStatus,
          gateway_http: blackcatRes.status,
          gateway_url: requestUrl,
          transaction_id,
          raw_data: txData,
        };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Ação inválida' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
