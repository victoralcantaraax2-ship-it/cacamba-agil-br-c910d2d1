import { memo } from "react";
import { Clock, ShieldCheck, Leaf, Building2, HardHat, Home, Warehouse } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const values = [
  { icon: Clock, label: "Entrega no prazo combinado", desc: "Chegamos no horário certo, sem atrasos. Sua obra não para por nossa causa." },
  { icon: ShieldCheck, label: "Preço claro e sem surpresa", desc: "Você sabe exatamente quanto vai pagar. Sem taxas escondidas ou reajustes." },
  { icon: Leaf, label: "Descarte dentro das normas", desc: "Resíduos destinados corretamente para locais licenciados, com responsabilidade ambiental." },
];

const segments = [
  { icon: HardHat, label: "Construtoras e Empreiteiras" },
  { icon: Home, label: "Reformas Residenciais" },
  { icon: Building2, label: "Condomínios e Prédios" },
  { icon: Warehouse, label: "Comércios e Indústrias" },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Sobre a NORTEX Caçambas
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Atendemos <span className="font-bold text-foreground">todo o estado de São Paulo</span> com aluguel de caçambas, entrega rápida e atendimento direto pelo WhatsApp. Trabalhamos de forma simples, sem burocracia e com total transparência nos valores.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            De pequenas reformas a grandes obras, de residências a condomínios e empresas — nossa missão é facilitar o descarte de entulho com rapidez e transparência.
          </p>
          <p className="mb-10 text-muted-foreground leading-relaxed">
            Nosso foco é resolver o seu problema de descarte de forma rápida, segura e com o melhor custo-benefício da região.
          </p>
        </div>

        {/* Segmentos atendidos */}
        <div className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-3 max-w-2xl">
          {segments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-base font-bold text-card-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 text-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-whatsapp-foreground shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            Solicitar cotação grátis
          </a>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
