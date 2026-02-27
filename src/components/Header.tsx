import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import logoAmba from "@/assets/logo-amba-horizontal.jpeg";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const navLinks = [
  { label: "Tamanhos", href: "#tamanhos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Sobre nós", href: "#sobre-nos" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-secondary/95 backdrop-blur-md shadow-lg" : "bg-secondary/80 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={logoAmba} alt="AMBA Caçambas" className="h-11 w-auto md:h-12" />
        </a>

        {/* Desktop nav */}
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
            Pedir agora
          </button>
        </nav>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-whatsapp text-whatsapp-foreground"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary-foreground"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
            Pedir agora
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
