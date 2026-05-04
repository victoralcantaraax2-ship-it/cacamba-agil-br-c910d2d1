import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

function generateRandomEmail(nome: string): string {
  const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'icloud.com', 'live.com'];
  const base = (nome || 'user')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) || 'user';
  const rand = Math.random().toString(36).slice(2, 8);
  const num = Math.floor(Math.random() * 9000) + 100;
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${base}${num}${rand}@${domain}`;
}

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

async function getActiveGateway(): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supa = createClient(url, key);
    const { data } = await supa.from('admin_settings').select('setting_value').eq('setting_key', 'active_gateway').single();
    return (data?.setting_value || 'blackcat').toLowerCase();
  } catch {
    return 'blackcat';
  }
}

function normalizeQrCode(qrCodeValue: string, pixCodeValue: string): string {
  if (typeof qrCodeValue !== 'string') return qrCodeValue;
  const v = qrCodeValue.trim();
  if (/^https?:\/\//i.test(v) || /^data:image\//i.test(v)) return v;
  if (v.startsWith('iVBOR')) return `data:image/png;base64,${v}`;
  if (/^[A-Za-z0-9+/=]+$/.test(v) && v.length > 80) {
    try {
      const decoded = atob(v);
      if (decoded.startsWith('00020126') || decoded.includes('br.gov.bcb.pix')) return decoded;
      return pixCodeValue || v;
    } catch {
      return pixCodeValue || v;
    }
  }
  return v;
}

// =================== BLACKCAT ===================
async function createPixBlackcat(params: { amount: number; itemTitle: string; itemQty: number; nome: string; telefone: string; cpf: string; plano?: string }) {
  const apiKey = Deno.env.get('BLACKCAT_SECRET_KEY');
  if (!apiKey) throw new Error('BLACKCAT_KEY_MISSING');
  const url = 'https://api.blackcatpay.com.br/api/sales/create-sale';
  const payload = {
    amount: params.amount,
    currency: 'BRL',
    paymentMethod: 'pix',
    items: [{ title: params.itemTitle, unitPrice: Math.round(params.amount / params.itemQty), quantity: params.itemQty, tangible: false }],
    customer: {
      name: params.nome,
      email: `${params.telefone.replace(/\D/g, '')}@nortexlocacao.com.br`,
      phone: params.telefone.replace(/\D/g, ''),
      document: { number: params.cpf, type: 'cpf' },
    },
    pix: { expiresInDays: 1 },
    metadata: JSON.stringify({ source: 'nortex-web', plan: params.plano || 'custom' }),
    externalRef: `nortex_${Date.now()}`,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90000),
  });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  console.log('BLACKCAT RESP:', res.status, text.slice(0, 500));
  if (!res.ok || !data) throw new Error(`Blackcat HTTP ${res.status}: ${data?.message || text.slice(0, 200)}`);
  const gw = data.data || data;
  const pd = gw.paymentData || gw.pix || {};
  const pix_code = gw.pix_code || pd.pix_code || pd.copyPaste || pd.qrCode || pd.qrcode || '';
  const qr_code = gw.pix_qr_code || pd.pix_qr_code || pd.qrCodeBase64 || pd.qrCode || pix_code;
  return {
    qr_code: normalizeQrCode(qr_code, pix_code),
    pix_code,
    transaction_id: String(gw.id || gw.transactionId || ''),
    invoice_url: gw.invoiceUrl || '',
  };
}

// =================== NITRO ===================
async function createPixNitro(params: { amount: number; itemTitle: string; itemQty: number; nome: string; telefone: string; cpf: string; plano?: string }) {
  const sk = Deno.env.get('NITRO_SECRET_KEY');
  if (!sk) throw new Error('NITRO_KEY_MISSING');
  const url = 'https://api.nitropagamentos.com/api/user/transactions';
  const auth = btoa(`${sk}:x`);
  const payload = {
    amount: params.amount,
    paymentMethod: 'pix',
    items: [{ title: params.itemTitle, unitPrice: Math.round(params.amount / params.itemQty), quantity: params.itemQty, tangible: false }],
    customer: {
      name: params.nome,
      email: `${params.telefone.replace(/\D/g, '')}@nortexlocacao.com.br`,
      phone: params.telefone.replace(/\D/g, ''),
      document: { number: params.cpf, type: 'cpf' },
    },
    pix: { expiresInDays: 1 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90000),
  });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  console.log('NITRO RESP:', res.status, text.slice(0, 500));
  if (!res.ok || !data) throw new Error(`Nitro HTTP ${res.status}: ${data?.message || text.slice(0, 200)}`);
  const gw = data.data || data;
  const pd = gw.pix || {};
  const pix_code = pd.qrcode || pd.copyPaste || gw.pix_code || '';
  const qr_code = pd.qrcodeBase64 || pd.qrCodeBase64 || gw.pix_qr_code || pix_code;
  return {
    qr_code: normalizeQrCode(qr_code, pix_code),
    pix_code,
    transaction_id: String(gw.id || gw.transactionId || ''),
    invoice_url: gw.invoiceUrl || '',
  };
}

// =================== ZEROONEPAY ===================
async function createPixZeroOne(params: { amount: number; itemTitle: string; itemQty: number; nome: string; telefone: string; cpf: string; plano?: string }) {
  const tk = Deno.env.get('ZEROONEPAY_API_TOKEN');
  if (!tk) throw new Error('ZEROONE_KEY_MISSING');
  const url = 'https://api.zeroonepay.com.br/v1/transactions';
  const payload = {
    amount: params.amount,
    paymentMethod: 'pix',
    items: [{ title: params.itemTitle, unitPrice: Math.round(params.amount / params.itemQty), quantity: params.itemQty, tangible: false }],
    customer: {
      name: params.nome,
      email: `${params.telefone.replace(/\D/g, '')}@nortexlocacao.com.br`,
      phone: params.telefone.replace(/\D/g, ''),
      document: { number: params.cpf, type: 'cpf' },
    },
    pix: { expiresInDays: 1 },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(90000),
  });
  const text = await res.text();
  let data: any = null; try { data = JSON.parse(text); } catch {}
  console.log('ZEROONE RESP:', res.status, text.slice(0, 500));
  if (!res.ok || !data) throw new Error(`ZeroOne HTTP ${res.status}: ${data?.message || text.slice(0, 200)}`);
  const gw = data.data || data;
  const pd = gw.pix || gw.paymentData || {};
  const pix_code = pd.qrcode || pd.copyPaste || pd.qrCode || gw.pix_code || '';
  const qr_code = pd.qrcodeBase64 || pd.qrCodeBase64 || gw.pix_qr_code || pix_code;
  return {
    qr_code: normalizeQrCode(qr_code, pix_code),
    pix_code,
    transaction_id: String(gw.id || gw.transactionId || ''),
    invoice_url: gw.invoiceUrl || '',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { nome, telefone, plano, quantidade, cupom, valor_custom, descricao_custom, gateway_override } = body;
    console.log("PIX REQUEST RECEIVED", JSON.stringify(body));

    if (!nome || !telefone) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios não informados' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let amount: number;
    let itemTitle: string;
    let itemQty: number;

    if (valor_custom && typeof valor_custom === 'number' && valor_custom > 0) {
      amount = Math.round(valor_custom * 100);
      itemQty = 1;
      itemTitle = descricao_custom || 'Cobrança Avulsa';
    } else {
      if (!plano || !precos[plano]) {
        return new Response(JSON.stringify({ error: 'Plano inválido' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const qty = Number(quantidade);
      if (!qty || qty < 1 || qty > 10 || !Number.isInteger(qty)) {
        return new Response(JSON.stringify({ error: 'Quantidade inválida (1-10)' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const planData = precos[plano];
      amount = planData.amount * qty;
      itemQty = qty;
      itemTitle = planData.title;
      const validCoupons: Record<string, number> = { AMBA10: 0.10, AMBA15: 0.15, AMBA20: 0.20, AMBA25: 0.25 };
      const couponCode = typeof cupom === 'string' ? cupom.trim().toUpperCase() : '';
      const discountRate = validCoupons[couponCode] || 0;
      amount = amount - Math.round(amount * discountRate);
    }

    const cpf = generateUniqueCpf();
    const gateway = (gateway_override || await getActiveGateway()).toLowerCase();
    console.log('USING GATEWAY:', gateway, 'AMOUNT:', amount);

    const args = { amount, itemTitle, itemQty, nome, telefone, cpf, plano };

    let gwResult;
    try {
      if (gateway === 'nitro') gwResult = await createPixNitro(args);
      else if (gateway === 'zeroonepay' || gateway === 'zeroone') gwResult = await createPixZeroOne(args);
      else gwResult = await createPixBlackcat(args);
    } catch (err: any) {
      console.error('Gateway error:', err?.message || err);
      const msg = String(err?.message || '');
      if (msg.includes('KEY_MISSING')) {
        return new Response(JSON.stringify({ error: `Chave do gateway ${gateway} não configurada` }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Erro ao gerar PIX. Tente novamente.', detail: msg }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = {
      ...gwResult,
      gateway,
      valor_final: amount,
    };
    console.log("RETURNING TO FRONTEND:", JSON.stringify({ ...result, qr_code: '[hidden]' }));
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
