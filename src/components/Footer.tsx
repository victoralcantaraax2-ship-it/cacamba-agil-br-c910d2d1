import { memo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock, MapPin, Shield } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import logoAmba from "@/assets/logo-nortex-horizontal.png";
import sslLogo from "@/assets/ssl-blindado-logo.png";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const Footer = memo(() => {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-secondary">
      {/* Main content */}
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <img src={logoAmba} alt="NORTEX Caçambas" className="h-8 w-auto" width={120} height={32} loading="lazy" />
            <p className="text-xs text-secondary-foreground/50 text-center sm:text-left leading-relaxed max-w-[220px]">
              Locação de caçambas estacionárias para obras, reformas e demolições em São Paulo.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs font-bold text-secondary-foreground/70 uppercase tracking-wider mb-1">Contato</p>
            <button onClick={() => handleWhatsAppClick()} aria-label="Falar no WhatsApp (11) 98684-7426" className="flex items-center gap-2 text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
              <img src={whatsappIcon} alt="" className="h-3.5 w-3.5" /> (11) 98684-7426
            </button>
            <a href="mailto:atendimento@nortexcacambas.com" className="flex items-center gap-2 text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5" /> atendimento@nortexcacambas.com
            </a>
            <span className="flex items-center gap-2 text-xs text-secondary-foreground/60">
              <Clock className="h-3.5 w-3.5" /> Seg–Sáb 06h–19h · Dom 07h–18h
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <p className="text-xs font-bold text-secondary-foreground/70 uppercase tracking-wider mb-1">Institucional</p>
            <Link to="/politica-de-privacidade" className="text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/reclameaqui" className="text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
              Reclame Aqui
            </Link>
            <span className="flex items-center gap-2 text-xs text-secondary-foreground/50 mt-1">
              <MapPin className="h-3.5 w-3.5" /> São Paulo, SP
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/8">
        <div className="container px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[10px] text-secondary-foreground/35">
            © 2021–{year} NORTEX Locação de Caçambas LTDA
          </p>
          <p className="text-[10px] text-secondary-foreground/30 select-none pointer-events-none" aria-hidden="true">
            CNPJ: 02.268.402/0001-05
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
