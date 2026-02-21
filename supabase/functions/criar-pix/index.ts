import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const precos: Record<string, number> = {
  cacamba_3m: 17999,
  cacamba_5m: 25999,
  cacamba_6m: 28999,
  cacamba_8m: 33999,
  cacamba_10m: 38900,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, cpf, email, telefone, plano, quantidade } = await req.json();

    // Validate required fields
    if (!nome || !cpf || !email || !telefone) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios não informados' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate plan
    if (!plano || !precos[plano]) {
      return new Response(JSON.stringify({ error: 'Plano inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate quantity
    const qty = Number(quantidade);
    if (!qty || qty < 1 || qty > 10 || !Number.isInteger(qty)) {
      return new Response(JSON.stringify({ error: 'Quantidade inválida (1-10)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amount = precos[plano] * qty;

    const BLACKCAT_API_KEY = Deno.env.get('BLACKCAT_SECRET_KEY');
    if (!BLACKCAT_API_KEY) {
      console.error('BLACKCAT_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const blackcatResponse = await fetch('https://api.blackcatpagamentos.online/api/sales/create-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLACKCAT_API_KEY,
      },
      body: JSON.stringify({
        customer_name: nome,
        customer_document: cpf.replace(/\D/g, ''),
        customer_email: email,
        customer_phone: telefone.replace(/\D/g, ''),
        amount,
        payment_method: 'pix',
        metadata: {
          plano,
          quantidade: qty,
        },
      }),
    });

    const data = await blackcatResponse.json();

    if (!blackcatResponse.ok) {
      console.error('BlackCat error:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return only safe data — never expose internal details
    return new Response(JSON.stringify({
      qr_code: data.qr_code || data.pixQrCode || '',
      pix_code: data.pix_code || data.pixCode || '',
      transaction_id: data.transaction_id || data.id || '',
      valor_final: amount,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
