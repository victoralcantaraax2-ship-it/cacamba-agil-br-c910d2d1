/**
 * Dispara evento de conversão "CLIQUE COPIAR PIX NORTEX" no Google Ads.
 */
export const firePixCopyConversion = () => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18041138999/rIBgCKWli6AcELfe15pD",
      value: 300.0,
      currency: "BRL",
    });
  }
};
