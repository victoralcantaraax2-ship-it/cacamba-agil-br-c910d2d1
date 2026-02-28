import { Truck, Leaf, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.jpg";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import logoAmba from "@/assets/logo-amba-vertical.jpeg";
import { Star, Users, Zap } from "lucide-react";

const badges = [
  { icon: Truck, label: "Entrega rápida" },
  { icon: MessageCircle, label: "Atendimento via WhatsApp" },
  { icon: Leaf, label: "Descarte responsável" },
];

const trustItems = [
  { icon: Star, label: "Nota 4.8 no Google" },
  { icon: Users, label: "Clientes recorrentes" },
  { icon: Zap, label: "Atendimento rápido" },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const HeroSection = () => {
  return (
    <>
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-16 md:min-h-screen">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Canteiro de obras com caçamba estacionária"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-secondary/90" />
        </div>

        <div className="container relative z-10 px-4 py-16 text-center md:py-24">
          <img src={logoAmba} alt="AMBA Caçambas" className="mx-auto mb-8 h-28 w-auto md:h-36 lg:h-40" />
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-secondary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Locação de Caçambas com
            <br />
            <span className="text-primary">Entrega Rápida</span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base text-secondary-foreground/80 md:text-lg">
            Solicite online. Entrega em até 2h. Retirada programada.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg bg-secondary-foreground/10 px-4 py-2"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-secondary-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              onClick={() => scrollTo("#tamanhos")}
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-extrabold uppercase text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:bg-primary/90 md:px-12 md:py-5 md:text-xl"
            >
              Escolher tamanho
            </button>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-4 text-base font-bold text-whatsapp-foreground shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover md:px-8 md:py-5 md:text-lg"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Trust mini-block */}
      <div className="bg-secondary border-t border-secondary-foreground/10">
        <div className="container px-4 py-5">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-secondary-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
