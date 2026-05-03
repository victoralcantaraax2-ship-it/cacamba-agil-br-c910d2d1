const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BLACKCAT_BASE_URL = 'https://api.blackcatpay.com.br/api';

function getBlackcatHeaders(): HeadersInit {
  const apiKey = Deno.env.get('BLACKCAT_SECRET_KEY');
  if (!apiKey) {
    throw new Error('BLACKCAT_KEY_MISSING');
  }
  return {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  };
}

async function requestBlackcatStatus(transactionId: string) {
  const url = `${BLACKCAT_BASE_URL}/sales/${encodeURIComponent(transactionId)}/status`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getBlackcatHeaders(),
    signal: AbortSignal.timeout(15000),
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = JSON.parse(text);
  } catch {}

  return { response, text, data, requestUrl: url };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction_id } = await req.json();

    if (!transaction_id || typeof transaction_id !== 'string') {
      return new Response(JSON.stringify({ error: 'transaction_id obrigatório' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;
    try {
      result = await requestBlackcatStatus(transaction_id);
    } catch {
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { response, text, data, requestUrl } = result;
    console.log('BLACKCAT STATUS RESPONSE:', response.status, text.slice(0, 500));
    console.log('BLACKCAT STATUS URL:', requestUrl);

    if (!response.ok || !data) {
      return new Response(JSON.stringify({ status: 'unknown', raw_status: response.status, gateway_message: data?.message || data?.error || null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const txData = data?.data || data;
    const rawStatus = (
      txData.status ||
      txData.paymentStatus ||
      txData.payment_status ||
      ''
    ).toString().toLowerCase();

    // Map to simplified status (Blackcat: PENDING, PAID, CANCELLED)
    let status = 'pending';
    if (['paid', 'approved', 'confirmed', 'completed', 'settled', 'pago'].includes(rawStatus)) {
      status = 'paid';
    } else if (['expired', 'canceled', 'cancelled', 'refunded', 'failed', 'rejected', 'expirado', 'cancelado', 'reembolsado', 'recusado'].includes(rawStatus)) {
      status = 'failed';
    }

    return new Response(JSON.stringify({ status, raw_status: rawStatus }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(JSON.stringify({ error: 'Erro ao verificar status' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
