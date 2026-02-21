import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const WhatsAppFloat = () => {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-whatsapp-foreground shadow-2xl transition-transform hover:scale-105 hover:bg-whatsapp-hover animate-pulse-green md:bottom-8 md:right-8"
      aria-label="Abrir WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
      <span className="hidden text-base font-bold sm:inline">WhatsApp</span>
    </a>
  );
};

export default WhatsAppFloat;
