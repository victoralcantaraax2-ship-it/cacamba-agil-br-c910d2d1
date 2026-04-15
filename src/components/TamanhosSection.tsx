import { memo, useState } from "react";
import { Check, Award, TrendingUp, ChevronRight } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const sizes = [
  {
    size: "3 m³",
    title: "Pequenas reformas",
    price: "R$ 230",
    bags: "20–25 sacos · 2 a 7 dias",
    idealFor: ["Reparos pontuais", "Remoção de piso e entulho leve"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Cabe em espaços compactos"],
  },
  {
    size: "4 m³",
    title: "Obras médias",
    price: "R$ 300",
    bags: "30–35 sacos · 2 a 7 dias",
    idealFor: ["Reformas de médio porte", "Resíduos de construção"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Boa relação custo-volume"],
  },
  {
    size: "5 m³",
    title: "Residencial completa",
    price: "R$ 360",
    bags: "40–45 sacos · 3 a 7 dias",
    idealFor: ["Obras em casas e apartamentos", "Contrapiso e reforma geral"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Melhor custo por m³"],
    badge: "Mais pedido",
    badgeIcon: Award,
  },
  {
    size: "7 m³",
    title: "Construção pesada",
    price: "R$ 460",
    bags: "60–70 sacos · 3 a 7 dias",
    idealFor: ["Grande volume de resíduos", "Demolições parciais"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Suporta grandes quantidades"],
    badge: "Melhor custo-benefício",
    badgeIcon: TrendingUp,
  },
  {
    size: "10 m³",
    title: "Grande volume",
    price: "R$ 620",
    bags: "90–100 sacos · 5 a 7 dias",
    idealFor: ["Demolições, telhas, madeira", "Descarte em larga escala"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Capacidade reforçada"],
  },
];

const SizeCard = memo(({ item, selected, onSelect }: { item: typeof sizes[0]; selected: boolean; onSelect: () => void }) => {
  const hasBadge = !!item.badge;
  const BadgeIcon = item.badgeIcon;

  return (
    <button
      onClick={onSelect}
      className={`relative flex flex-col rounded-2xl border-2 bg-card p-5 md:p-6 transition-all text-left cursor-pointer group
        ${selected
          ? "border-primary shadow-xl ring-2 ring-primary/20 scale-[1.02]"
          : hasBadge
            ? "border-primary/40 shadow-md hover:border-primary hover:shadow-lg"
            : "border-border hover:border-primary/40 hover:shadow-md"
        }`}
    >
      {hasBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-md whitespace-nowrap">
          {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
          {item.badge}
        </div>
      )}

      {/* Selection indicator */}
      <div className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
        ${selected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-primary/50"}`}>
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>

      <div className={`mb-3 ${hasBadge ? "mt-2" : ""}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-black text-foreground">{item.size}</span>
          <span className="text-sm font-medium text-muted-foreground">— {item.title}</span>
        </div>
        <p className="mt-2 text-2xl md:text-3xl font-black text-primary">{item.price}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/60">{item.bags}</p>
      </div>

      <div className="mb-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Uso recomendado:</p>
        {item.idealFor.map((text) => (
          <p key={text} className="text-sm text-card-foreground leading-relaxed">{text}</p>
        ))}
      </div>

      <ul className="flex-1 space-y-1">
        {item.checks.map((b) => (
          <li key={b} className="flex items-start gap-1.5 text-xs text-card-foreground/80">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
            {b}
          </li>
        ))}
      </ul>
    </button>
  );
});

SizeCard.displayName = "SizeCard";

const TamanhosSection = () => {
  const [selected, setSelected] = useState("5 m³");

  const handleSolicitar = () => {
    handleWhatsAppClick(`Olá! Tenho interesse em uma caçamba de ${selected}. Podem informar disponibilidade e valor?`);
  };

  return (
    <section id="tamanhos" className="bg-background py-10 md:py-16">
      <div className="container px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-3xl lg:text-4xl">
            Qual caçamba você precisa?
          </h2>
          <p className="mx-auto max-w-lg text-sm md:text-base text-muted-foreground">
            Selecione o tamanho ideal e solicite pelo WhatsApp.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sizes.map((item) => (
            <SizeCard
              key={item.size}
              item={item}
              selected={selected === item.size}
              onSelect={() => setSelected(item.size)}
            />
          ))}
        </div>

        {/* Single CTA */}
        <div className="mt-10 md:mt-14 flex flex-col items-center gap-3">
          <button
            onClick={handleSolicitar}
            className="inline-flex items-center gap-3 rounded-xl bg-whatsapp px-10 py-4 text-base font-extrabold uppercase text-white shadow-xl transition-all hover:scale-105 hover:bg-whatsapp-hover md:px-14 md:py-5 md:text-lg animate-pulse-green"
          >
            <img src={whatsappIcon} alt="WhatsApp" className="h-6 w-6" width={24} height={24} />
            SOLICITAR CAÇAMBA DE {selected}
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="text-xs text-muted-foreground">
            Resposta imediata · Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
};

export default TamanhosSection;
