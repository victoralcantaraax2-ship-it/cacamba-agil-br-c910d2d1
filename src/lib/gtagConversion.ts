/**
 * Dispara evento de conversão "Pagamento PIX NORTEX" no Google Ads.
 */
export const firePixCopyConversion = () => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    // Evento existente
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18059710630/ffbKCO35mJwcEKahxaND",
      transaction_id: "",
    });
    
    // Novo evento: CLIQUE COPIAR PIX NORTEX
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18041138999/rIBgCKWli6AcELfe15pD",
      value: 300.0,
      currency: "BRL",
    });
  }
};
