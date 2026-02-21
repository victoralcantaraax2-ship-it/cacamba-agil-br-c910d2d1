import { MessageCircle, Zap } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const UrgencySection = () => {
  return (
    <section className="bg-primary py-12 md:py-16">
      <div className="container px-4 text-center">
        <Zap className="mx-auto mb-3 h-10 w-10 text-primary-foreground" />
        <h2 className="mb-3 text-2xl font-black uppercase text-primary-foreground md:text-3xl">
          Precisa de caçamba hoje?
        </h2>
        <p className="mx-auto mb-6 max-w-md text-primary-foreground/80">
          Nossa equipe encontra rapidamente uma disponibilidade próxima.
        </p>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-base font-extrabold uppercase text-secondary-foreground shadow-lg transition-all hover:scale-105 hover:bg-secondary/90"
        >
          <MessageCircle className="h-5 w-5" />
          Chamar no WhatsApp Agora
        </a>
      </div>
    </section>
  );
};

export default UrgencySection;
