import { memo } from "react";
import { Clock, ShieldCheck, Leaf, Building2, HardHat, Home, Warehouse, Award, Users, Truck, Phone, Mail, MapPin } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const pillars = [
  { icon: Clock, label: "Pontualidade", desc: "Entrega e retirada no horário combinado. Sua obra não para por nossa causa." },
  { icon: ShieldCheck, label: "Transparência", desc: "Valores claros desde o primeiro contato. Sem taxas escondidas ou surpresas no final." },
  { icon: Leaf, label: "Descarte Legal", desc: "Resíduos destinados a locais licenciados, dentro de todas as normas ambientais." },
  { icon: Award, label: "Experiência", desc: "Anos de atuação no mercado paulista com milhares de atendimentos realizados." },
  { icon: Users, label: "Atendimento Humano", desc: "Fale direto com nossa equipe. Sem robôs, sem transferências, sem espera." },
  { icon: Truck, label: "Frota Própria", desc: "Veículos próprios e equipados para garantir agilidade em toda operação." },
];

const segments = [
  { icon: HardHat, label: "Construtoras" },
  { icon: Home, label: "Reformas Residenciais" },
  { icon: Building2, label: "Condomínios" },
  { icon: Warehouse, label: "Comércios e Indústrias" },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Sobre a NORTEX Caçambas
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed text-base md:text-lg">
            A <span className="font-bold text-foreground">NORTEX Caçambas</span> é referência em locação de caçambas estacionárias no estado de São Paulo. Com anos de experiência no mercado, construímos uma reputação sólida baseada em <span className="font-bold text-foreground">pontualidade, transparência e compromisso</span> com cada cliente.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Atendemos desde pequenas reformas residenciais até grandes obras de construtoras e condomínios — sempre com o mesmo padrão de qualidade, preço justo e atendimento direto pelo WhatsApp.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nossa missão é simples: <span className="font-bold text-foreground">resolver o descarte de entulho de forma rápida, segura e com o melhor custo-benefício</span>. É por isso que milhares de clientes em todo o estado confiam no nosso trabalho.
          </p>
        </div>

        {/* Segments */}
        <div className="mx-auto mb-12 flex flex-wrap items-center justify-center gap-3 max-w-2xl">
          {segments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {pillars.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-card-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>


        {/* CTA */}
        <div className="mx-auto mt-10 text-center">
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            Solicitar cotação grátis
          </button>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
