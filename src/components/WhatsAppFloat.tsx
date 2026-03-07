import whatsappIcon from "@/assets/whatsapp-icon.png";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { memo } from "react";

const WhatsAppFloat = memo(() => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <button
        onClick={() => handleWhatsAppClick()}
        className="flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-whatsapp-foreground shadow-2xl transition-transform hover:scale-105 hover:bg-whatsapp-hover animate-pulse-green"
        aria-label="Abrir WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7" width={28} height={28} loading="lazy" />
        <span className="hidden text-base font-bold sm:inline">Cotação</span>
      </button>
    </div>
  );
});

WhatsAppFloat.displayName = "WhatsAppFloat";

export default WhatsAppFloat;
