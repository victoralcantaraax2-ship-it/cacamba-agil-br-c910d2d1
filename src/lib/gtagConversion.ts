/**
 * Dispara evento de conversão "Pagamento PIX NORTEX" no Google Ads.
 */
export const firePixCopyConversion = () => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18059710630/ffbKCO35mJwcEKahxaND",
      transaction_id: "",
    });
  }
};
