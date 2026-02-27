import whatsappIcon from "@/assets/whatsapp-icon.png";

const WHATSAPP_URL = "https://wa.me/5511968359074?text=Olá,%20quero%20alugar";

const WhatsAppFloat = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-whatsapp px-5 py-4 text-whatsapp-foreground shadow-2xl transition-transform hover:scale-105 hover:bg-whatsapp-hover animate-pulse-green"
        aria-label="Abrir WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7" />
        <span className="hidden text-base font-bold sm:inline">WhatsApp</span>
      </a>
    </div>
  );
};

export default WhatsAppFloat;
