import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const precos: Record<string, { amount: number; title: string; tamanho: string }> = {
  cacamba_3m: { amount: 18000, title: "Caçamba 3m³", tamanho: "3m³" },
  cacamba_4m: { amount: 26000, title: "Caçamba 4m³", tamanho: "4m³" },
  cacamba_5m: { amount: 34000, title: "Caçamba 5m³", tamanho: "5m³" },
  cacamba_7m: { amount: 46000, title: "Caçamba 7m³", tamanho: "7m³" },
  cacamba_10m: { amount: 72000, title: "Caçamba 10m³", tamanho: "10m³" },
  cacamba_26m: { amount: 124000, title: "Caçamba 26m³", tamanho: "26m³" },
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

async function parseGatewayResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();

  if (!text) {
    return { data: null, rawText: '' };
  }

  try {
    return { data: JSON.parse(text), rawText: text };
  } catch (error) {
    console.error(
      'Invalid JSON response from gateway. Status:',
      response.status,
      'Content-Type:',
      contentType,
      'Preview:',
      text.slice(0, 500),
    );
    return { data: null, rawText: text };
  }
}

function buildBasicAuth(): string {
  const publicKey = Deno.env.get('NITRO_PUBLIC_KEY');
  const secretKey = Deno.env.get('NITRO_SECRET_KEY');
  if (!publicKey || !secretKey) {
    throw new Error('NITRO_KEYS_MISSING');
  }
  const credentials = `${publicKey}:${secretKey}`;
  return btoa(credentials);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nome, telefone, plano, quantidade, cupom, valor_custom, descricao_custom } = body;
    console.log("PIX REQUEST RECEIVED", JSON.stringify(body));

    // Validate required fields
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
      // Custom amount mode (admin)
      amount = Math.round(valor_custom * 100); // convert BRL to cents
      itemQty = 1;
      description = descricao_custom || 'Prestação de Serviço – Avulso';
      itemTitle = descricao_custom || 'Cobrança Avulsa';
    } else {
      // Normal checkout mode
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

      // Apply coupon discount server-side
      const validCoupons: Record<string, number> = { AMBA10: 0.10, AMBA15: 0.15, AMBA20: 0.20, AMBA25: 0.25 };
      const couponCode = typeof cupom === 'string' ? cupom.trim().toUpperCase() : '';
      const discountRate = validCoupons[couponCode] || 0;
      const discountAmount = Math.round(amount * discountRate);
      amount = amount - discountAmount;
      console.log("COUPON:", couponCode, "DISCOUNT:", discountAmount, "FINAL AMOUNT:", amount);
    }

    let encodedAuth: string;
    try {
      encodedAuth = buildBasicAuth();
    } catch {
      console.error('Nitro payment keys not configured');
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uniqueCpf = generateUniqueCpf();
    console.log("USING CPF:", uniqueCpf);

    const amountDecimal = amount / 100; // Nitro expects amount in BRL (e.g. 230.00), not cents

    const nitroPayload = {
      amount: amountDecimal,
      payment_method: 'pix',
      description: description,
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
        email: `${telefone.replace(/\D/g, '')}@cliente.amba.com.br`,
        phone: telefone.replace(/\D/g, ''),
        document: uniqueCpf,
      },
    };

    const createSale = async (payload: Record<string, unknown>) => {
      const response = await fetch('https://api.nitropagamento.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedAuth}`,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(90000),
      });

      const parsed = await parseGatewayResponse(response);
      return { response, data: parsed.data, rawText: parsed.rawText };
    };

    const { response: gatewayResponse, data, rawText } = await createSale(nitroPayload);
    console.log("NITRO RESPONSE:", gatewayResponse.status, data ? JSON.stringify(data) : rawText.slice(0, 300));

    if (!gatewayResponse.ok) {
      console.error(
        'Nitro error - status:',
        gatewayResponse.status,
        'body:',
        data ? JSON.stringify(data) : rawText.slice(0, 500),
      );
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!data) {
      console.error('Nitro returned success status but invalid JSON body:', rawText.slice(0, 500));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map response (supports old and new Nitro formats)
    const gatewayData = data?.data || {};
    const paymentData = gatewayData.paymentData || gatewayData;
    const result = {
      qr_code: paymentData.qrCode || paymentData.qrCodeBase64 || paymentData.qrCodeUrl || paymentData.pix_qr_code || '',
      pix_code: paymentData.copyPaste || paymentData.qrCode || paymentData.pix_code || paymentData.pix_qr_code || '',
      transaction_id: gatewayData.transactionId || gatewayData.id || '',
      invoice_url: gatewayData.invoiceUrl || gatewayData.invoice_url || '',
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
