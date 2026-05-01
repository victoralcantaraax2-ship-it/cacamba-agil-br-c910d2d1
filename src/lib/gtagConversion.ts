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

/**
 * Dispara evento de conversão "NORTEX BACK - 01" no Google Ads.
 * Usado quando o usuário tenta sair e o popup de retenção aparece.
 */
export const fireNortexBackConversion = (url?: string) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    const callback = function () {
      if (typeof url !== "undefined") {
        window.location.href = url;
      }
    };
    (window as any).gtag("event", "conversion", {
      send_to: "AW-18041138999/o0-UCNqYiqYcELfe15pD",
      event_callback: callback,
    });
    return false;
  }
  if (url) window.location.href = url;
  return false;
};
