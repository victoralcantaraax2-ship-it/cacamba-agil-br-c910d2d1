import { memo } from "react";
import { Check, Star } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import phoneIcon from "@/assets/phone-icon.png";

const sizes = [
  {
    size: "3 m³",
    title: "Reformas simples",
    bags: "20 a 25 sacos · 2 a 7 dias",
    popular: false,
    idealFor: ["Reparos pontuais", "Remoção de piso e entulho leve"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Ideal para espaços compactos"],
  },
  {
    size: "4 m³",
    title: "Obras moderadas",
    bags: "30 a 35 sacos · 2 a 7 dias",
    popular: false,
    idealFor: ["Reformas intermediárias", "Resíduos de construção"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Ótima relação custo-volume"],
  },
  {
    size: "5 m³",
    title: "Projetos residenciais",
    bags: "40 a 45 sacos · 3 a 7 dias",
    popular: true,
    popularLabel: "Mais escolhida pelos clientes",
    idealFor: ["Obras em casas e apartamentos", "Contrapiso e reformas completas"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Melhor custo por m³"],
  },
  {
    size: "7 m³",
    title: "Alto volume",
    bags: "60 a 70 sacos · 7 dias",
    popular: false,
    idealFor: ["Grande volume de resíduos", "Demolições parciais"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Comporta grandes quantidades"],
  },
  {
    size: "10 m³",
    title: "Demolições e limpezas",
    bags: "90 a 100 sacos · 7 dias",
    popular: false,
    idealFor: ["Demolições, telhas, madeira", "Descarte em grande escala"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Capacidade extra"],
  },
  {
    size: "26 m³",
    title: "Obras de grande porte",
    bags: "200+ sacos · sob consulta",
    popular: false,
    idealFor: ["Demolições totais", "Projetos comerciais e industriais"],
    checks: ["Entrega ágil na sua região", "Coleta agendada", "Máxima capacidade"],
  },
];

const SizeCard = memo(({ item, onSelect }: { item: typeof sizes[0]; onSelect: (size: string) => void }) => (
  <div
    className={`relative flex flex-col rounded-2xl border-2 bg-card p-5 md:p-6 transition-all hover:shadow-xl ${
      item.popular
        ? "border-primary shadow-lg scale-[1.02] animate-border-glow"
        : "border-border hover:border-primary/40"
    }`}
  >
    {item.popular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-[10px] md:text-xs font-bold uppercase text-primary-foreground flex items-center gap-1 animate-badge-shimmer">
        <Star className="h-3 w-3 fill-current" />
        {item.popularLabel}
      </span>
    )}

    <div className="mb-3 text-center">
      <span className="text-3xl md:text-4xl font-black text-foreground">{item.size}</span>
      <span className="ml-1 text-sm font-medium text-muted-foreground">— {item.title}</span>
      <p className="mt-1 text-xs text-muted-foreground/70">{item.bags}</p>
    </div>

    <div className="mb-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Indicado para:</p>
      <ul className="space-y-1">
        {item.idealFor.map((text) => (
          <li key={text} className="text-sm text-card-foreground">{text}</li>
        ))}
      </ul>
    </div>

    <ul className="mb-5 flex-1 space-y-1.5">
      {item.checks.map((b) => (
        <li key={b} className="flex items-start gap-1.5 text-xs md:text-sm text-card-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          {b}
        </li>
      ))}
    </ul>

    <button
      onClick={() => onSelect(item.size)}
      className={`block w-full rounded-lg py-3 text-center text-sm font-bold uppercase transition-all active:scale-95 hover:scale-105 ${
        item.popular
          ? "bg-primary text-primary-foreground shadow-lg animate-btn-breathe"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {item.popular ? "Solicitar agora" : "Pedir cotação"}
    </button>
  </div>
));

SizeCard.displayName = "SizeCard";

const TamanhosSection = () => {
  const handleSizeClick = (size: string) => {
    handleWhatsAppClick(`Olá! Tenho interesse em uma caçamba de ${size}. Podem informar disponibilidade e valor?`);
  };

  return (
    <section id="tamanhos" className="bg-background py-12 md:py-24">
      <div className="container px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-3xl lg:text-4xl">
            Qual Caçamba Você Precisa?
          </h2>
          <p className="mx-auto max-w-lg text-sm md:text-base text-muted-foreground">
            Compare as opções e encontre o tamanho ideal para a sua obra.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sizes.map((item) => (
            <SizeCard key={item.size} item={item} onSelect={handleSizeClick} />
          ))}
        </div>

        <div className="mt-8 md:mt-10 text-center">
          <button
            onClick={() => handleWhatsAppClick()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-whatsapp transition-colors hover:underline"
          >
            <img src={phoneIcon} alt="WhatsApp" className="h-4 w-4" width={16} height={16} loading="lazy" />
            Tem dúvidas? Fale pelo WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default TamanhosSection;
