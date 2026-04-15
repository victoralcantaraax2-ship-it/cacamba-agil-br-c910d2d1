import { memo } from "react";
import { HardHat, Home, Building2, Warehouse } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import badgeAward from "@/assets/badge-award.png";
import iconHorario from "@/assets/icon-horario.png";
import iconDescarte from "@/assets/icon-descarte.png";
import iconPreco from "@/assets/icon-preco.png";
import iconAtendimento from "@/assets/icon-atendimento.png";
import iconFrota from "@/assets/icon-frota.png";

const pillars: { image: string; label: string; desc: string }[] = [
  { image: iconHorario, label: "Pontualidade garantida", desc: "Cumprimos rigorosamente os horários agendados para entrega e retirada." },
  { image: iconPreco, label: "Preço transparente", desc: "Sem taxas ocultas. Valores claros desde o primeiro contato." },
  { image: iconDescarte, label: "Descarte regularizado", desc: "Destinação ambientalmente correta, em conformidade com as normas vigentes." },
  { image: badgeAward, label: "Experiência consolidada", desc: "Anos de atuação no mercado com milhares de atendimentos realizados." },
  { image: iconAtendimento, label: "Atendimento especializado", desc: "Equipe qualificada para orientar a melhor solução para sua necessidade." },
  { image: iconFrota, label: "Frota própria", desc: "Maior agilidade e controle total sobre toda a operação logística." },
];

const segments = [
  { icon: HardHat, label: "Construtoras" },
  { icon: Home, label: "Reformas" },
  { icon: Building2, label: "Condomínios" },
  { icon: Warehouse, label: "Empresas" },
];

const AboutSection = memo(() => {
  return (
    <section id="sobre-nos" className="bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-2xl font-extrabold text-foreground md:text-3xl">
            Sobre a NORTEX Caçambas
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed text-base md:text-lg">
            A <span className="font-bold text-foreground">NORTEX Caçambas</span> é referência na locação de caçambas estacionárias para obras, reformas e demolições em São Paulo e Grande São Paulo.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Atuamos com foco em eficiência operacional, organização logística e responsabilidade ambiental, oferecendo soluções completas para clientes residenciais, construtoras, condomínios e empresas.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Nosso compromisso é proporcionar um atendimento ágil, transparente e desburocratizado — desde a solicitação até a retirada da caçamba.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Com frota própria e equipe experiente, garantimos entregas dentro do prazo e cumprimento rigoroso dos horários combinados.
          </p>
          <p className="text-muted-foreground leading-relaxed font-medium">
            Independentemente da dimensão do seu projeto, estamos preparados para atendê-lo com excelência, segurança e o melhor custo-benefício do mercado.
          </p>
        </div>

        <div className="mx-auto mb-12 flex flex-wrap items-center justify-center gap-3 max-w-2xl">
          {segments.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-card-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {pillars.map(({ image, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md">
              <img src={image} alt={label} className="h-12 w-12 object-contain" width={48} height={48} />
              <h3 className="text-base font-bold text-card-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-8 py-4 text-base font-extrabold uppercase text-white shadow-lg transition-all hover:scale-105 hover:bg-whatsapp-hover"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-5 w-5" width={20} height={20} />
            SOLICITAR ORÇAMENTO
          </button>
          <span className="text-xs text-muted-foreground">Atendimento imediato • Sem compromisso</span>
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
