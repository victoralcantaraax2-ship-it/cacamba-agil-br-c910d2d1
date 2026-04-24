import { memo, useState, useMemo } from "react";
import { Check, TrendingUp, ChevronRight, Calendar, Package } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";
import badgeMaisSolicitado from "@/assets/badge-mais-solicitado.png";

const sizes = [
  {
    size: "3 m³",
    title: "Pequenas reformas em casa",
    price: "R$ 190",
    capacity: "20–25 sacos",
    period: "2 a 7 dias úteis",
    idealFor: ["Reformas rápidas em apartamentos e casas", "Troca de pisos, azulejos e pequenos reparos"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Cabe em vagas e ruas estreitas"],
  },
  {
    size: "4 m³",
    title: "Reformas residenciais",
    price: "R$ 280",
    capacity: "30–35 sacos",
    period: "2 a 7 dias úteis",
    idealFor: ["Reformas de cozinha, banheiro e quintal", "Pequenos comércios e escritórios"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Excelente custo-volume"],
  },
  {
    size: "5 m³",
    title: "Reforma completa da casa",
    price: "R$ 360",
    capacity: "40–45 sacos",
    period: "3 a 7 dias úteis",
    idealFor: ["Reformas completas em residências", "Contrapiso, telhado e ampliações"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Melhor custo por m³"],
    badge: "Padrão",
  },
  {
    size: "7 m³",
    title: "Grandes reformas e obras",
    price: "R$ 450",
    capacity: "60–70 sacos",
    period: "3 a 7 dias úteis",
    idealFor: ["Reformas estruturais em casas e sobrados", "Pequenas obras comerciais"],
    checks: ["Entrega rápida", "Retirada programada", "Suporte por WhatsApp"],
  },
  {
    size: "10 m³",
    title: "Demolições e grande volume",
    price: "R$ 590",
    capacity: "90–100 sacos",
    period: "5 a 7 dias úteis",
    idealFor: ["Demolições residenciais e limpeza de terrenos", "Construtoras e obras de maior porte"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Capacidade reforçada"],
  },
];

const SizeCard = memo(({ item, selected, onSelect }: { item: typeof sizes[0]; selected: boolean; onSelect: () => void }) => {
  const hasBadge = !!item.badge;
  const BadgeIcon = (item as any).badgeIcon;

  return (
    <button
      onClick={onSelect}
      aria-label={`Selecionar caçamba de ${item.size} - ${item.title} - ${item.price}`}
      aria-pressed={selected}
      className={`relative flex flex-col rounded-2xl border-2 bg-card p-4 md:p-6 transition-all text-left cursor-pointer group
        ${selected
          ? "border-primary shadow-xl ring-2 ring-primary/20 scale-[1.02]"
          : hasBadge
            ? "border-primary/40 shadow-md hover:border-primary hover:shadow-lg"
            : "border-border hover:border-primary/40 hover:shadow-md"
        }`}
    >
      {hasBadge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wide text-white shadow-lg whitespace-nowrap bg-primary">
          {item.badge}
        </div>
      )}

      {/* Selection indicator */}
      <div className={`absolute top-4 right-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
        ${selected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-primary/50"}`}>
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>

      <div className={`mb-4 ${hasBadge ? "mt-2" : ""}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-black text-foreground">{item.size}</span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-muted-foreground">{item.title}</p>
        <p className="mt-3 text-2xl md:text-3xl font-black text-primary">{item.price}</p>
      </div>

      {/* Specs */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5 text-primary/60" />
          {item.capacity}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary/60" />
          {item.period}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Aplicação recomendada</p>
        {item.idealFor.map((text) => (
          <p key={text} className="text-sm text-card-foreground leading-relaxed">{text}</p>
        ))}
      </div>

      <ul className="flex-1 space-y-1.5 pt-3 border-t border-border/50">
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
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState("5 m³");

  const mobileOrder = ["5 m³", "7 m³", "4 m³", "10 m³", "3 m³"];
  const orderedSizes = useMemo(() => {
    if (!isMobile) return sizes;
    return mobileOrder.map((s) => sizes.find((item) => item.size === s)!);
  }, [isMobile]);

  const handleSolicitar = () => {
    handleWhatsAppClick(`Olá! Tenho interesse na locação de uma caçamba de ${selected}. Poderiam informar disponibilidade e valor?`);
  };

  return (
    <section id="tamanhos" className="bg-background py-10 md:py-16">
      <div className="container px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-3xl lg:text-4xl">
            Qual caçamba atende sua necessidade?
          </h2>
          <p className="mx-auto max-w-lg text-sm md:text-base text-muted-foreground">
            Selecione o tamanho ideal para o seu projeto e solicite pelo WhatsApp.
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 sm:gap-5">
          {orderedSizes.map((item) => (
            <div key={item.size} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)]">
              <SizeCard
                item={item}
                selected={selected === item.size}
                onSelect={() => setSelected(item.size)}
              />
            </div>
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
            Atendimento imediato · Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
};

export default TamanhosSection;
