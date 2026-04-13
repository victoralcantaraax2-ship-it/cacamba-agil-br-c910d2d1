const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function buildBasicAuth(): string {
  const publicKey = Deno.env.get('NITRO_PUBLIC_KEY');
  const secretKey = Deno.env.get('NITRO_SECRET_KEY');
  if (!publicKey || !secretKey) {
    throw new Error('NITRO_KEYS_MISSING');
  }
  return btoa(`${publicKey}:${secretKey}`);
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

    let encodedAuth: string;
    try {
      encodedAuth = buildBasicAuth();
    } catch {
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query Nitro API for transaction status
    const response = await fetch(`https://api.nitropagamento.app/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
      },
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text();
    console.log('NITRO STATUS RESPONSE:', response.status, text.slice(0, 500));

    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Invalid JSON from Nitro status check');
    }

    if (!response.ok || !data) {
      return new Response(JSON.stringify({ status: 'unknown', raw_status: response.status }), {
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
