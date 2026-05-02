import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const precos: Record<string, { amount: number; title: string; tamanho: string }> = {
  cacamba_3m: { amount: 19000, title: "Caçamba 3m³", tamanho: "3m³" },
  cacamba_4m: { amount: 28000, title: "Caçamba 4m³", tamanho: "4m³" },
  cacamba_5m: { amount: 36000, title: "Caçamba 5m³", tamanho: "5m³" },
  cacamba_7m: { amount: 45000, title: "Caçamba 7m³", tamanho: "7m³" },
  cacamba_10m: { amount: 59000, title: "Caçamba 10m³", tamanho: "10m³" },
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

const BLACKCAT_BASE_URL = 'https://api.blackcatpay.com.br/api';

function getBlackCatHeaders(): HeadersInit {
  const secretKey = Deno.env.get('BLACKCAT_SECRET_KEY');
  if (!secretKey) {
    throw new Error('BLACKCAT_KEY_MISSING');
  }

  return {
    'Content-Type': 'application/json',
    'X-API-Key': secretKey,
  };
}

async function requestBlackCat(path: string, init: RequestInit) {
  const url = `${BLACKCAT_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(90000),
  });
  const parsed = await parseGatewayResponse(response);
  return { response, data: parsed.data, rawText: parsed.rawText, requestUrl: url };
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

    let headers: HeadersInit;
    try {
      headers = getBlackCatHeaders();
    } catch {
      console.error('Nitro payment keys not configured');
      return new Response(JSON.stringify({ error: 'Chave de pagamento não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uniqueCpf = generateUniqueCpf();
    console.log("USING CPF:", uniqueCpf);

    // BlackCat: amount em CENTAVOS, paymentMethod camelCase, document como objeto
    const blackcatPayload = {
      amount: amount,
      currency: 'BRL',
      paymentMethod: 'pix',
      pix: {
        expiresInDays: 1,
      },
      customer: {
        name: nome,
        email: `${telefone.replace(/\D/g, '')}@nortexlocacao.com.br`,
        phone: telefone.replace(/\D/g, ''),
        document: {
          number: uniqueCpf,
          type: 'cpf',
        },
      },
      items: [
        {
          title: itemTitle,
          unitPrice: amount,
          quantity: itemQty,
          tangible: false,
        },
      ],
    };

    const { response: gatewayResponse, data, rawText, requestUrl } = await requestBlackCat('/sales/create-sale', {
      method: 'POST',
      headers,
      body: JSON.stringify(blackcatPayload),
    });
    console.log("BLACKCAT RESPONSE:", requestUrl, gatewayResponse?.status, data ? JSON.stringify(data) : rawText.slice(0, 500));

    if (!gatewayResponse?.ok) {
      console.error(
        'BlackCat error - status:',
        gatewayResponse?.status,
        'url:',
        requestUrl,
        'body:',
        data ? JSON.stringify(data) : rawText.slice(0, 500),
      );
      const gatewayMessage = (data as any)?.message || (data as any)?.error || null;
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.', gateway_status: gatewayResponse?.status || 0, gateway_message: gatewayMessage }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!data) {
      console.error('BlackCat returned success status but invalid JSON body:', rawText.slice(0, 500));
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // BlackCat response: { success, data: { transactionId, paymentData: { qrCode, qrCodeBase64, copyPaste }, invoiceUrl } }
    const gatewayData = (data as any)?.data || data || {};
    const paymentData = gatewayData.paymentData || gatewayData.pix || {};
    const pixCodeValue =
      paymentData.copyPaste ||
      paymentData.qrCode ||
      paymentData.qrcode ||
      paymentData.pix_code ||
      gatewayData.copyPaste ||
      '';
    let qrCodeValue =
      paymentData.qrCodeBase64 ||
      paymentData.qrcodeBase64 ||
      paymentData.qrCode ||
      paymentData.qrcode ||
      pixCodeValue;
    if (typeof qrCodeValue === 'string' && qrCodeValue.startsWith('iVBOR') && !qrCodeValue.startsWith('data:')) {
      qrCodeValue = `data:image/png;base64,${qrCodeValue}`;
    }
    const result = {
      qr_code: qrCodeValue,
      pix_code: pixCodeValue,
      transaction_id: String(gatewayData.transactionId || gatewayData.id || ''),
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
