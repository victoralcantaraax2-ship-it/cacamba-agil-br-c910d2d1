import { memo } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Clock, Phone, Mail } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import logoAmba from "@/assets/logo-amba-nova.webp";
import sslLogo from "@/assets/ssl-blindado-logo.png";

const Footer = memo(() => {
  return (
    <footer id="contato" className="bg-secondary py-12">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <img src={logoAmba} alt="NORTEX Caçambas" className="mx-auto mb-3 h-12 w-auto md:mx-0" width={160} height={48} loading="lazy" />
            <p className="mb-4 max-w-sm text-sm text-secondary-foreground/60">
              Atendemos todo o estado de São Paulo e região. Logística ágil e descarte regularizado.
            </p>
            <div className="flex flex-col gap-2 text-sm text-secondary-foreground/70">
              <a
                href="tel:1120854224"
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="h-4 w-4" /> Fixo: (11) 2085-4224
              </a>
              <button
                onClick={() => handleWhatsAppClick()}
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Phone className="h-4 w-4" /> WhatsApp: (11) 96835-9162
              </button>
              <a
                href="mailto:atendimento@ambalocacao.com"
                className="flex items-center justify-center gap-2 transition-colors hover:text-primary md:justify-start"
              >
                <Mail className="h-4 w-4" /> atendimento@ambalocacao.com
              </a>
              <span className="flex items-center justify-center gap-2 md:justify-start">
                <Clock className="h-4 w-4" /> Seg–Sáb 06h às 19h | Dom 07h às 18h
              </span>
            </div>
          </div>

          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-bold text-whatsapp-foreground transition-colors hover:bg-whatsapp-hover"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            Pedir Cotação
          </button>
        </div>

        <div className="mt-8 border-t border-secondary-foreground/10 pt-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={sslLogo} alt="SSL Blindado" className="h-10 w-auto" />
          </div>
          <p className="text-center text-xs text-secondary-foreground/50">
            © 2021–{new Date().getFullYear()} NORTEX Caçambas — Todos os direitos reservados.
          </p>
          <p
            className="mt-1 text-center text-xs text-secondary-foreground/40 select-none pointer-events-none"
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
            aria-hidden="true"
          >
            CNPJ: 61.774.679/0001-60
          </p>
          <p className="mt-1 text-center text-xs text-secondary-foreground/40 space-x-1">
            <Link to="/politica-de-privacidade" className="hover:text-primary hover:underline transition-colors">Política de Privacidade</Link>
            <span>|</span>
            <Link to="/termos-de-uso" className="hover:text-primary hover:underline transition-colors">Termos de Uso</Link>
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
