const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NITRO_BASE_URL = 'https://api.nitropagamento.app';

function getNitroHeaders(): HeadersInit {
  const publicKey = Deno.env.get('NITRO_PUBLIC_KEY');
  const secretKey = Deno.env.get('NITRO_SECRET_KEY');
  if (!publicKey || !secretKey) {
    throw new Error('NITRO_KEYS_MISSING');
  }

  return {
    'Authorization': `Basic ${btoa(`${publicKey}:${secretKey}`)}`,
    'Content-Type': 'application/json',
  };
}

async function requestNitroStatus(transactionId: string) {
  const url = `${NITRO_BASE_URL}/transactions/${encodeURIComponent(transactionId)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getNitroHeaders(),
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
      result = await requestNitroStatus(transaction_id);
    } catch {
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { response, text, data, requestUrl } = result;
    console.log('NITRO STATUS RESPONSE:', response.status, text.slice(0, 500));
    console.log('NITRO STATUS URL:', requestUrl);

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

    // Map to simplified status
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
