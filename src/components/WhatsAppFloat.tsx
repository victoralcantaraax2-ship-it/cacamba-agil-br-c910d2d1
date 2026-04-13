import whatsappIcon from "@/assets/whatsapp-icon.webp";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { memo } from "react";

const WhatsAppFloat = memo(() => {
  return (
    <button
      onClick={() => handleWhatsAppClick()}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-lg transition-transform hover:scale-110 hover:bg-whatsapp-hover sm:h-16 sm:w-16"
      aria-label="Chamar no WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7 sm:h-8 sm:w-8" width={28} height={28} loading="lazy" />
    </button>
  );
});

WhatsAppFloat.displayName = "WhatsAppFloat";

export default WhatsAppFloat;
