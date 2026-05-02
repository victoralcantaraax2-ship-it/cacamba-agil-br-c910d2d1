const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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

  for (const baseUrl of BLACKCAT_BASE_URLS) {
    const response = await fetch(`${baseUrl}/transactions/${transactionId}`, {
      method: 'GET',
      headers: getBlackCatHeaders(),
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text();
    lastResponse = response;
    lastText = text;

    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {}

    const errorCode = String(data?.code || '').toUpperCase();
    if (response.ok || (response.status !== 404 && errorCode !== 'NOT_FOUND')) {
      return { response, text, data, requestUrl: `${baseUrl}/transactions/${transactionId}` };
    }
  }

  return { response: lastResponse, text: lastText, data: null, requestUrl: 'unknown' };
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
      result = await requestBlackCatStatus(transaction_id);
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

    // Nitro can return status in various fields
    const txData = data?.data || data;
    const rawStatus = (
      txData.status ||
      txData.paymentStatus ||
      txData.payment_status ||
      ''
    ).toString().toLowerCase();

    // Map to simplified status
    let status = 'pending';
    if (['paid', 'approved', 'confirmed', 'completed', 'settled'].includes(rawStatus)) {
      status = 'paid';
    } else if (['expired', 'canceled', 'cancelled', 'refunded', 'failed', 'rejected'].includes(rawStatus)) {
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
