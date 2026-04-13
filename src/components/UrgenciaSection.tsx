import { memo } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const UrgenciaSection = memo(() => {
  return (
    <section className="bg-primary py-10 md:py-14">
      <div className="container px-4 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
          <AlertTriangle className="h-4 w-4 text-white" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Vagas limitadas</span>
        </div>
        <h2 className="mb-3 text-2xl font-extrabold text-white md:text-3xl lg:text-4xl">
          PRECISA PARA HOJE?
        </h2>
        <p className="mb-6 text-base text-white/80 md:text-lg">
          Entrega rápida e vagas limitadas. Garanta sua caçamba agora!
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => handleWhatsAppClick("Olá! Preciso de uma caçamba URGENTE para hoje. Podem me atender?")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-extrabold uppercase text-primary shadow-xl transition-all hover:scale-105"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            CHAMAR NO WHATSAPP AGORA
          </button>
          <div className="flex items-center gap-1.5 text-white/70">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Respondemos em minutos</span>
          </div>
        </div>
      </div>
    </section>
  );
});

UrgenciaSection.displayName = "UrgenciaSection";

export default UrgenciaSection;
