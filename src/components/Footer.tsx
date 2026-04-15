import { memo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Clock } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import logoAmba from "@/assets/logo-nortex-horizontal.png";
import sslLogo from "@/assets/ssl-blindado-logo.png";

const Footer = memo(() => {
  return (
    <footer id="contato" className="bg-secondary py-6">
      <div className="container px-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <img src={logoAmba} alt="NORTEX Caçambas" className="h-8 w-auto" width={120} height={32} loading="lazy" />

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-secondary-foreground/60">
            <a href="tel:1130172222" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" /> (11) 3017-2222
            </a>
            <button onClick={() => handleWhatsAppClick()} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" /> (11) 98684-7426
            </button>
            <a href="mailto:atendimento@nortexcacambas.com" className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" /> atendimento@nortexcacambas.com
            </a>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Seg–Sáb 06h–19h | Dom 07h–18h
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 border-t border-secondary-foreground/10 pt-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={sslLogo} alt="SSL Blindado" className="h-6 w-auto" />
            <p className="text-[10px] text-secondary-foreground/40">
              © 2021–{new Date().getFullYear()} NORTEX Locação de Caçambas LTDA
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-secondary-foreground/40">
            <span className="select-none pointer-events-none" aria-hidden="true">CNPJ: 02.268.402/0001-05</span>
            <span>·</span>
            <Link to="/politica-de-privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <span>·</span>
            <Link to="/termos-de-uso" className="hover:text-primary transition-colors">Termos</Link>
            <span>·</span>
            <Link to="/reclamacoes" className="hover:text-primary transition-colors">Reclame Aqui</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
