import { MessageCircle, Clock, Truck, FileText } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.jpg";
import logoAmba from "@/assets/logo-amba.png";

const badges = [
  { icon: Clock, label: "Atendimento 24h" },
  { icon: Truck, label: "Entrega rápida" },
  { icon: FileText, label: "Orçamento online" },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden md:min-h-screen">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Canteiro de obras com caçamba estacionária"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-secondary/85" />
      </div>

      <div className="container relative z-10 px-4 py-16 text-center md:py-24">
        <img
          src={logoAmba}
          alt="AMBA Caçambas"
          className="mx-auto mb-4 h-14 w-auto md:h-[70px]"
        />
        <p className="mb-6 text-sm font-medium text-secondary-foreground/60 tracking-wide">
          Atendimento rápido e seguro
        </p>
        <span className="mb-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-extrabold uppercase text-primary-foreground">
          Entrega em até 24h
        </span>

        <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-secondary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Locação de Caçambas com
          <br />
          <span className="text-primary">Atendimento Rápido pelo WhatsApp</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base text-secondary-foreground/80 md:text-lg">
          Solicite seu orçamento em poucos minutos.
          Entrega rápida e atendimento online.
        </p>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl bg-whatsapp px-8 py-5 text-lg font-extrabold uppercase text-whatsapp-foreground shadow-2xl transition-all hover:scale-105 hover:bg-whatsapp-hover animate-bounce-subtle md:px-12 md:py-6 md:text-xl"
        >
          <MessageCircle className="h-7 w-7 fill-current" />
          Solicitar Orçamento
        </a>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-lg bg-secondary-foreground/10 px-4 py-2"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-secondary-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
