/**
 * Dispara evento de conversão no Google Ads (NORTEX BACK - 01).
 * Conta: AW-18041138999  |  Label: o0-UCNqYiqYcELfe15pD
 *
 * Deduplicação: dispara apenas UMA vez por sessão (sessionStorage)
 * para não inflar os dados da conta.
 */
const SESSION_KEY = "nortex_aw_conv_18041138999_fired";

export const fireWhatsAppConversion = (callback?: () => void) => {
  const gtag = typeof window !== "undefined" ? (window as any).gtag : undefined;

  let alreadyFired = false;
  try {
    alreadyFired = sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    // sessionStorage indisponível (modo privado/iframe restrito) — segue o fluxo
  }

  if (typeof gtag === "function" && !alreadyFired) {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    gtag("event", "conversion", {
      send_to: "AW-18041138999/o0-UCNqYiqYcELfe15pD",
      event_callback: callback,
    });
    return;
  }

  if (callback) callback();
};
