const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const CHAT_ID = '5320472044';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const TELEGRAM_API_KEY = Deno.env.get('BLACKCAT_SECRET_KEY');
    if (!TELEGRAM_API_KEY) throw new Error('BLACKCAT_SECRET_KEY is not configured');

    const body = await req.json();
    const { tipo, nome, telefone, plano, quantidade, valor, cupom, endereco, bandeira, transacao_id } = body;

    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    let message = '';

    if (tipo === 'pix') {
      message = `💰 <b>NOVO PEDIDO VIA PIX</b>\n\n` +
        `👤 <b>Cliente:</b> ${escapeHtml(nome)}\n` +
        `📞 <b>Telefone:</b> ${escapeHtml(telefone)}\n` +
        `📦 <b>Plano:</b> ${escapeHtml(plano)}\n` +
        `🔢 <b>Quantidade:</b> ${quantidade}\n` +
        `💵 <b>Valor:</b> R$ ${Number(valor).toFixed(2)}\n` +
        (cupom ? `🎟️ <b>Cupom:</b> ${escapeHtml(cupom)}\n` : '') +
        (endereco ? `📍 <b>Endereço:</b> ${escapeHtml(endereco)}\n` : '') +
        (transacao_id ? `🆔 <b>Transação:</b> ${escapeHtml(transacao_id)}\n` : '') +
        `🕐 <b>Data/Hora:</b> ${now}`;
    } else if (tipo === 'cartao') {
      message = `💳 <b>TENTATIVA DE PAGAMENTO - CARTÃO</b>\n\n` +
        `👤 <b>Cliente:</b> ${escapeHtml(nome)}\n` +
        `📞 <b>Telefone:</b> ${escapeHtml(telefone)}\n` +
        `📦 <b>Plano:</b> ${escapeHtml(plano)}\n` +
        `🔢 <b>Quantidade:</b> ${quantidade}\n` +
        `💵 <b>Valor:</b> R$ ${Number(valor).toFixed(2)}\n` +
        (bandeira ? `🏷️ <b>Bandeira:</b> ${escapeHtml(bandeira)}\n` : '') +
        (cupom ? `🎟️ <b>Cupom:</b> ${escapeHtml(cupom)}\n` : '') +
        (endereco ? `📍 <b>Endereço:</b> ${escapeHtml(endereco)}\n` : '') +
        `🕐 <b>Data/Hora:</b> ${now}`;
    } else {
      return new Response(JSON.stringify({ error: 'Tipo inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Telegram API error [${response.status}]:`, JSON.stringify(data));
      return new Response(JSON.stringify({ error: 'Falha ao enviar notificação' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Notify telegram error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
