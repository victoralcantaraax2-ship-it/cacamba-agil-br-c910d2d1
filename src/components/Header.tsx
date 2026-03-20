import { useState, memo } from "react";
import { Menu, X } from "lucide-react";
import phoneIcon from "@/assets/phone-icon.png";
import { handleWhatsAppClick } from "@/lib/whatsapp";

const navLinks = [
  { label: "Tamanhos", href: "#tamanhos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Avaliações", href: "#depoimentos" },
  { label: "Sobre nós", href: "#sobre-nos" },
  { label: "Dúvidas", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

const Header = memo(() => {
  const [open, setOpen] = useState(false);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="w-10" />

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#tamanhos")}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
          >
            Peça agora
          </button>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handleWhatsAppClick()}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
          >
            <img src={phoneIcon} alt="Telefone" className="h-4 w-4" width={16} height={16} />
            Cotação
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary-foreground"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-secondary-foreground/10 bg-secondary px-4 pb-4 pt-2 lg:hidden">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="block w-full py-3 text-left text-base font-medium text-secondary-foreground/80 transition-colors hover:text-secondary-foreground"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleClick("#tamanhos")}
            className="mt-2 w-full rounded-lg bg-primary py-3 text-center text-base font-bold text-primary-foreground"
          >
            Peça agora
          </button>
        </nav>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
