const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ZEROONEPAY_BASE_URL = 'https://api.zeroonepay.com.br/api/public/v1';

const precos: Record<string, { amount: number; title: string; tamanho: string }> = {
  cacamba_3m: { amount: 23000, title: "Caçamba 3m³", tamanho: "3m³" },
  cacamba_4m: { amount: 30000, title: "Caçamba 4m³", tamanho: "4m³" },
  cacamba_5m: { amount: 36000, title: "Caçamba 5m³", tamanho: "5m³" },
  cacamba_7m: { amount: 46000, title: "Caçamba 7m³", tamanho: "7m³" },
  cacamba_10m: { amount: 62000, title: "Caçamba 10m³", tamanho: "10m³" },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nome, telefone, plano, quantidade, cupom, valor_custom, descricao_custom } = body;
    console.log("PIX REQUEST RECEIVED", JSON.stringify(body));

    if (!nome || !telefone) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios não informados' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let amount: number;
    let description: string;
    let itemTitle: string;
    let itemQty: number;

    if (valor_custom && typeof valor_custom === 'number' && valor_custom > 0) {
      amount = Math.round(valor_custom * 100);
      itemQty = 1;
      description = descricao_custom || 'Prestação de Serviço – Avulso';
      itemTitle = descricao_custom || 'Cobrança Avulsa';
    } else {
      if (!plano || !precos[plano]) {
        return new Response(JSON.stringify({ error: 'Plano inválido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const qty = Number(quantidade);
      if (!qty || qty < 1 || qty > 10 || !Number.isInteger(qty)) {
        return new Response(JSON.stringify({ error: 'Quantidade inválida (1-10)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const planData = precos[plano];
      amount = planData.amount * qty;
      itemQty = qty;
      description = `Prestação de Serviço – ${planData.tamanho}`;
      itemTitle = planData.title;

      const validCoupons: Record<string, number> = { AMBA10: 0.10, AMBA15: 0.15, AMBA20: 0.20, AMBA25: 0.25 };
      const couponCode = typeof cupom === 'string' ? cupom.trim().toUpperCase() : '';
      const discountRate = validCoupons[couponCode] || 0;
      const discountAmount = Math.round(amount * discountRate);
      amount = amount - discountAmount;
      console.log("COUPON:", couponCode, "DISCOUNT:", discountAmount, "FINAL AMOUNT:", amount);
    }

    const apiToken = Deno.env.get('ZEROONEPAY_API_TOKEN');
    if (!apiToken) {
      console.error('ZEROONEPAY_API_TOKEN not configured');
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const phone = telefone.replace(/\D/g, '');

    const payload = {
      paymentMethod: 'pix',
      amount: amount,
      pix: {
        expiresInDays: 1,
      },
      items: [
        {
          title: 'PAGAMENTO LTDA',
          unitPrice: amount,
          quantity: itemQty,
          tangible: false,
        },
      ],
      customer: {
        name: nome,
        email: `${phone}@cliente.amba.com.br`,
        phone: phone,
      },
    };

    console.log("ZEROONEPAY PAYLOAD:", JSON.stringify(payload));

    const response = await fetch(`${ZEROONEPAY_BASE_URL}/transactions?api_token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(90000),
    });

    const rawText = await response.text();
    console.log("ZEROONEPAY RESPONSE STATUS:", response.status);
    console.log("ZEROONEPAY RESPONSE BODY:", rawText.slice(0, 1000));

    let data: any = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error('Invalid JSON from ZeroOnePay:', rawText.slice(0, 500));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      console.error('ZeroOnePay error:', response.status, JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract PIX data from response - try multiple known field paths
    const txData = data?.data || data?.transaction || data || {};
    const pixData = txData?.pix || txData?.paymentData || txData || {};

    const pixCode = pixData?.copyPaste || pixData?.qrCode || pixData?.pix_code || pixData?.emv || txData?.copyPaste || txData?.qrCode || txData?.emv || '';
    const qrCodeImage = pixData?.qrCodeBase64 || pixData?.qrCodeUrl || pixData?.qrCodeImage || pixData?.qr_code_url || '';
    const transactionId = txData?.hash || txData?.transactionId || txData?.id || txData?.transaction_hash || '';

    const result = {
      qr_code: qrCodeImage || pixCode,
      pix_code: pixCode,
      transaction_id: transactionId,
      invoice_url: txData?.invoiceUrl || txData?.invoice_url || '',
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
