const WHATSAPP_NUMBER = "5511987604407";
const WHATSAPP_MESSAGE = "Olá! Tenho interesse em alugar uma caçamba. Podem informar valores e disponibilidade?";

export const getWhatsAppUrl = (customMessage?: string) => {
  const msg = customMessage || WHATSAPP_MESSAGE;
  const encodedMessage = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}&type=phone_number&app_absent=0`;
};

export const handleWhatsAppClick = (customMessage?: string) => {
  const url = getWhatsAppUrl(customMessage);
  const isFinalizacao = typeof window !== "undefined" && window.location.pathname === "/finalizacao";

  if (!isFinalizacao && typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-17997709520/wCcjCIPU5IMcENCB_YVD",
      value: 1.0,
      currency: "BRL",
      event_callback: () => {
        window.open(url, "_blank");
      },
    });
    // fallback caso o callback não dispare em 1s
    setTimeout(() => window.open(url, "_blank"), 1000);
  } else {
    window.open(url, "_blank");
  }
};
