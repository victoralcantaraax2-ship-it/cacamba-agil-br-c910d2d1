import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function getActiveGateway(): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supa = createClient(url, key);
    const { data } = await supa.from('admin_settings').select('setting_value').eq('setting_key', 'active_gateway').single();
    return (data?.setting_value || 'blackcat').toLowerCase();
  } catch { return 'blackcat'; }
}

async function statusBlackcat(id: string) {
  const apiKey = Deno.env.get('BLACKCAT_SECRET_KEY');
  if (!apiKey) throw new Error('KEY_MISSING');
  const url = `https://api.blackcatpay.com.br/api/sales/${encodeURIComponent(id)}/status`;
  const res = await fetch(url, { headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  return { res, data, text };
}

async function statusNitro(id: string) {
  const sk = Deno.env.get('NITRO_SECRET_KEY');
  if (!sk) throw new Error('KEY_MISSING');
  const auth = btoa(`${sk}:x`);
  const url = `https://api.nitropagamentos.com/api/user/transactions/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` }, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  return { res, data, text };
}

async function statusZeroOne(id: string) {
  const tk = Deno.env.get('ZEROONEPAY_API_TOKEN');
  if (!tk) throw new Error('KEY_MISSING');
  const url = `https://api.zeroonepay.com.br/v1/transactions/${encodeURIComponent(id)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${tk}` }, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  return { res, data, text };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { transaction_id, gateway: gatewayHint } = await req.json();
    if (!transaction_id || typeof transaction_id !== 'string') {
      return new Response(JSON.stringify({ error: 'transaction_id obrigatório' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const gateway = (gatewayHint || await getActiveGateway()).toLowerCase();
    let result;
    try {
      if (gateway === 'nitro') result = await statusNitro(transaction_id);
      else if (gateway === 'zeroonepay' || gateway === 'zeroone') result = await statusZeroOne(transaction_id);
      else result = await statusBlackcat(transaction_id);
    } catch {
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { res, data, text } = result;
    console.log(`${gateway.toUpperCase()} STATUS:`, res.status, text.slice(0, 300));

    if (!res.ok || !data) {
      return new Response(JSON.stringify({ status: 'unknown', raw_status: res.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const txData = data?.data || data;
    const rawStatus = (txData.status || txData.paymentStatus || txData.payment_status || '').toString().toLowerCase();
    let status = 'pending';
    if (['paid', 'approved', 'confirmed', 'completed', 'settled', 'pago'].includes(rawStatus)) status = 'paid';
    else if (['expired', 'canceled', 'cancelled', 'refunded', 'failed', 'rejected', 'expirado', 'cancelado', 'reembolsado', 'recusado'].includes(rawStatus)) status = 'failed';

    return new Response(JSON.stringify({ status, raw_status: rawStatus, gateway }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(JSON.stringify({ error: 'Erro ao verificar status' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
