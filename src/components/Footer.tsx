import { MessageCircle, Clock, MapPin } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const Footer = () => {
  return (
    <footer className="bg-secondary py-10">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="mb-1 text-lg font-extrabold text-secondary-foreground">
              Central de Caçambas
            </h3>
            <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
              <span className="flex items-center justify-center gap-1 md:justify-start">
                <MapPin className="h-4 w-4" /> Atendimento nacional
              </span>
              <span className="flex items-center justify-center gap-1 md:justify-start">
                <Clock className="h-4 w-4" /> Seg a Sáb — 7h às 18h
              </span>
            </div>
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-whatsapp-foreground transition-colors hover:bg-whatsapp-hover"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Fale pelo WhatsApp
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-secondary-foreground/50">
          Disponibilidade varia conforme região. © {new Date().getFullYear()} Central de Caçambas.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
