const WHATSAPP_NUMBER = "5511969795930";
const WHATSAPP_MESSAGE = "Olá! Quero alugar uma caçamba. Pode me passar valores e disponibilidade?";

export const getWhatsAppUrl = () => {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};
