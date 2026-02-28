import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const precos: Record<string, { amount: number; title: string }> = {
  cacamba_3m: { amount: 23000, title: "Caçamba 3m³" },
  cacamba_4m: { amount: 30000, title: "Caçamba 4m³" },
  cacamba_5m: { amount: 36000, title: "Caçamba 5m³" },
  cacamba_7m: { amount: 45000, title: "Caçamba 7m³" },
  cacamba_10m: { amount: 59000, title: "Caçamba 10m³" },
};

function generateUniqueCpf(): string {
  const rand = () => Math.floor(Math.random() * 9) + 1;
  const digits = Array.from({ length: 9 }, rand);
  const calc = (arr: number[], factor: number) => {
    const sum = arr.reduce((s, d, i) => s + d * (factor - i), 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };
  digits.push(calc(digits, 10));
  digits.push(calc(digits, 11));
  return digits.join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nome, telefone, plano, quantidade, cupom } = body;
    console.log("PIX REQUEST RECEIVED", JSON.stringify(body));

    // Validate required fields
    if (!nome || !telefone) {
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

    const planData = precos[plano];
    let amount = planData.amount * qty;

    // Apply coupon discount server-side
    const validCoupons: Record<string, number> = { AMBA10: 0.10, AMBA15: 0.15 };
    const couponCode = typeof cupom === 'string' ? cupom.trim().toUpperCase() : '';
    const discountRate = validCoupons[couponCode] || 0;
    const discountAmount = Math.round(amount * discountRate);
    amount = amount - discountAmount;
    console.log("COUPON:", couponCode, "DISCOUNT:", discountAmount, "FINAL AMOUNT:", amount);

    const BLACKCAT_API_KEY = Deno.env.get('BLACKCAT_SECRET_KEY');
    if (!BLACKCAT_API_KEY) {
      console.error('BLACKCAT_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uniqueCpf = generateUniqueCpf();
    console.log("USING CPF:", uniqueCpf);

    const blackcatResponse = await fetch('https://api.blackcatpagamentos.online/api/sales/create-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLACKCAT_API_KEY,
      },
      body: JSON.stringify({
        amount,
        currency: 'BRL',
        paymentMethod: 'pix',
        expiresIn: 3600,
        items: [
          {
            title: planData.title,
            quantity: qty,
            tangible: false,
          },
        ],
        customer: {
          name: nome,
          email: `${telefone.replace(/\D/g, '')}@cliente.amba.com.br`,
          document: {
            number: uniqueCpf,
            type: 'cpf',
          },
          phone: telefone.replace(/\D/g, ''),
        },
      }),
    });

    const data = await blackcatResponse.json();
    console.log("BLACKCAT RESPONSE:", blackcatResponse.status, JSON.stringify(data));

    if (!blackcatResponse.ok) {
      console.error('BlackCat error - status:', blackcatResponse.status, 'body:', JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map BlackCat nested response: data.data.paymentData
    const paymentData = data?.data?.paymentData || {};
    const result = {
      qr_code: paymentData.qrCode || paymentData.qrCodeBase64 || paymentData.qrCodeUrl || '',
      pix_code: paymentData.copyPaste || paymentData.qrCode || '',
      transaction_id: data?.data?.transactionId || '',
      invoice_url: data?.data?.invoiceUrl || '',
      valor_final: amount,
    };
    console.log("RETURNING TO FRONTEND:", JSON.stringify(result));
    return new Response(JSON.stringify(result), {
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
