import whatsappIcon from "@/assets/whatsapp-icon.webp";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import { memo } from "react";

const WhatsAppFloat = memo(() => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:bottom-6 sm:left-auto sm:right-6 sm:p-0">
      <button
        onClick={() => handleWhatsAppClick()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-4 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-whatsapp-hover animate-pulse-green sm:w-auto sm:rounded-full sm:px-5"
        aria-label="Chamar no WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7" width={28} height={28} loading="lazy" />
        <span className="text-base font-extrabold uppercase">CHAMAR NO WHATSAPP AGORA</span>
      </button>
    </div>
  );
});

WhatsAppFloat.displayName = "WhatsAppFloat";

export default WhatsAppFloat;
