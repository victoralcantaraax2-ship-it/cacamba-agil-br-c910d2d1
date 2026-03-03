import { MessageCircle, Clock, Phone, Mail } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import logoAmba from "@/assets/logo-amba.png";

const Footer = () => {
  return (
    <footer id="contato" className="bg-secondary py-12">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <img src={logoAmba} alt="AMBA Caçambas" className="mx-auto mb-3 h-12 w-auto md:mx-0" />
            <p className="mb-4 max-w-sm text-sm text-secondary-foreground/60">
              Soluções rápidas e confiáveis para descarte de entulho.
            </p>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/70">
              <a
                href="tel:1120851441"
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="h-4 w-4" /> Fixo: (11) 2085-1441
              </a>
              <button
                onClick={() => handleWhatsAppClick()}
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="h-4 w-4" /> WhatsApp: (11) 96835-9162
              </button>
              <a
                href="mailto:contato@ambacacambas.com.br"
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Mail className="h-4 w-4" /> contato@ambacacambas.com.br
              </a>
              <span className="flex items-center justify-center gap-2 md:justify-start">
                <Clock className="h-4 w-4" /> Seg–Sáb 7h às 18h
              </span>
            </div>
          </div>

          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-whatsapp-foreground transition-colors hover:bg-whatsapp-hover"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Solicitar Orçamento
          </button>
        </div>

        <div className="mt-8 border-t border-secondary-foreground/10 pt-6">
          <p className="text-center text-xs text-secondary-foreground/50">
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
      </div>
    </footer>
  );
};

export default Footer;
