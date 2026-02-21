import { MessageCircle, Star } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden md:min-h-screen">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Canteiro de obras com caçamba"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-secondary/85" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-16 text-center md:py-24">
        <h1 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tight text-secondary-foreground text-shadow-hero sm:text-4xl md:text-5xl lg:text-6xl">
          Aluguel de Caçambas
          <br />
          <span className="text-primary">Rápido e Sem Complicação</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base text-secondary-foreground/80 md:text-lg">
          Atendimento rápido • Parceiros em várias regiões • Solicite agora pelo WhatsApp
        </p>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl bg-whatsapp px-8 py-5 text-lg font-extrabold uppercase text-whatsapp-foreground shadow-2xl transition-all hover:scale-105 hover:bg-whatsapp-hover animate-bounce-subtle md:px-12 md:py-6 md:text-xl"
        >
          <MessageCircle className="h-7 w-7 fill-current" />
          Pedir Caçamba Agora
        </a>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-star text-star" />
            ))}
          </div>
          <p className="text-sm font-semibold text-secondary-foreground/90">
            Clientes satisfeitos em todo o Brasil
          </p>
          <p className="text-xs text-secondary-foreground/60">
            Resposta rápida em poucos minutos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
