/**
 * Dispara evento de conversão única no Google Ads (NORTEX).
 * Usada no clique de qualquer botão de WhatsApp.
 */
export const fireWhatsAppConversion = (callback?: () => void) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18041138999/o0-UCNqYiqYcELfe15pD",
      event_callback: callback,
    });
    return;
  }
  if (callback) callback();
};
