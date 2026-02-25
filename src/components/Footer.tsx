import { MessageCircle, Clock, Phone, Mail } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const Footer = () => {
  return (
    <footer className="bg-secondary py-10">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="mb-1 text-lg font-extrabold text-secondary-foreground">
              AMBA Central de Caçambas
            </h3>
            <p className="mb-3 max-w-sm text-sm text-secondary-foreground/60">
              Soluções rápidas para descarte de entulho.
            </p>
            <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="h-4 w-4" /> WhatsApp: (11) 96979-5930
              </a>
              <a
                href="mailto:contato@ambacacambas.com.br"
                className="flex items-center justify-center gap-1 transition-colors hover:text-primary md:justify-start"
              >
                <Mail className="h-4 w-4" /> contato@ambacacambas.com.br
              </a>
              <span className="flex items-center justify-center gap-1 md:justify-start">
                <Clock className="h-4 w-4" /> Atendimento: Seg–Sáb 7h às 18h
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
            Solicitar Orçamento
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-secondary-foreground/60">
          Atendimento em diversas regiões do Brasil.
        </p>

        <p className="mt-2 text-center text-xs text-secondary-foreground/50">
          © 2021–{new Date().getFullYear()} AMBA Central de Caçambas — Todos os direitos reservados.
        </p>
        <p
          className="mt-1 text-center text-xs text-secondary-foreground/40 select-none pointer-events-none"
          style={{ userSelect: "none", WebkitUserSelect: "none" }}
          aria-hidden="true"
        >
          CNPJ: 64.596.513/0001-90
        </p>
        <p className="mt-1 text-center text-xs text-secondary-foreground/40">
          Política de Privacidade | Termos de Uso
        </p>
      </div>
    </footer>
  );
};

export default Footer;
