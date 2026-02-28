const WHATSAPP_NUMBER = "5511968359074";
const WHATSAPP_MESSAGE = "Olá! Quero alugar uma caçamba. Pode me passar valores e disponibilidade?";

export const getWhatsAppUrl = (customMessage?: string) => {
  const msg = customMessage || WHATSAPP_MESSAGE;
  const encodedMessage = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}&type=phone_number&app_absent=0`;
};

export const handleWhatsAppClick = (customMessage?: string) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "conversion", {
      send_to: "AW-17982986700/6SafCNzr-_4bEP7kyvtC",
    });
  }
  window.open(getWhatsAppUrl(customMessage), "_blank");
};
