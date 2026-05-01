import { fireWhatsAppConversion } from "@/lib/gtagConversion";

const WHATSAPP_NUMBER = "5511986847737";
const WHATSAPP_MESSAGE = "Olá! Tenho interesse em alugar uma caçamba. Podem informar valores e disponibilidade?";

export const getWhatsAppUrl = (customMessage?: string) => {
  const msg = customMessage || WHATSAPP_MESSAGE;
  const encodedMessage = encodeURIComponent(msg);
  return `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}&type=phone_number&app_absent=0`;
};

export const handleWhatsAppClick = (customMessage?: string) => {
  const url = getWhatsAppUrl(customMessage);

  fireWhatsAppConversion(() => window.open(url, "_blank"));
  // fallback caso o callback do gtag não dispare em 1s
  setTimeout(() => window.open(url, "_blank"), 1000);
};
