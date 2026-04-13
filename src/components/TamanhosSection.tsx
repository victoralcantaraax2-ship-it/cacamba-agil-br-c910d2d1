import { memo } from "react";
import { Check } from "lucide-react";
import { handleWhatsAppClick } from "@/lib/whatsapp";
import whatsappIcon from "@/assets/whatsapp-icon.webp";

const sizes = [
  {
    size: "3 m³",
    title: "Pequenas reformas",
    price: "R$ 230,00",
    bags: "20 a 25 sacos · 2 a 7 dias",
    idealFor: ["Reparos pontuais", "Remoção de piso e entulho leve"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Cabe em espaços compactos"],
  },
  {
    size: "4 m³",
    title: "Obras médias",
    price: "R$ 300,00",
    bags: "30 a 35 sacos · 2 a 7 dias",
    idealFor: ["Reformas de médio porte", "Resíduos de construção"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Boa relação custo-volume"],
  },
  {
    size: "5 m³",
    title: "Residencial completa",
    price: "R$ 360,00",
    bags: "40 a 45 sacos · 3 a 7 dias",
    idealFor: ["Obras em casas e apartamentos", "Contrapiso e reforma geral"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Melhor custo por m³"],
  },
  {
    size: "7 m³",
    title: "Construção pesada",
    price: "R$ 460,00",
    bags: "60 a 70 sacos · 3 a 7 dias",
    idealFor: ["Grande volume de resíduos", "Demolições parciais"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Suporta grandes quantidades"],
  },
  {
    size: "10 m³",
    title: "Grande volume",
    price: "R$ 620,00",
    bags: "90 a 100 sacos · 5 a 7 dias",
    idealFor: ["Demolições, telhas, madeira", "Descarte em larga escala"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Capacidade reforçada"],
  },
  {
    size: "26 m³",
    title: "Obra de grande porte",
    price: "Sob consulta",
    bags: "200+ sacos · sob consulta",
    idealFor: ["Demolições totais", "Projetos comerciais e industriais"],
    checks: ["Entrega em até 2h", "Retirada agendada", "Máxima capacidade"],
  },
];

const SizeCard = memo(({ item, onSelect }: { item: typeof sizes[0]; onSelect: (size: string) => void }) => (
  <div className="relative flex flex-col rounded-2xl border-2 bg-card p-5 md:p-6 transition-all hover:shadow-xl border-border hover:border-primary/40">
    <div className="mb-3 text-center">
      <span className="text-3xl md:text-4xl font-black text-foreground">{item.size}</span>
      <span className="ml-1 text-sm font-medium text-muted-foreground">— {item.title}</span>
      <p className="mt-2 text-2xl font-black text-primary">{item.price}</p>
      <p className="mt-0.5 text-xs text-muted-foreground/70">{item.bags}</p>
    </div>

    <div className="mb-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Uso recomendado:</p>
      <ul className="space-y-1">
        {item.idealFor.map((text) => (
          <li key={text} className="text-sm text-card-foreground">{text}</li>
        ))}
      </ul>
    </div>

    <ul className="mb-5 flex-1 space-y-1.5">
      {item.checks.map((b) => (
        <li key={b} className="flex items-start gap-1.5 text-xs md:text-sm text-card-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
          {b}
        </li>
      ))}
    </ul>

    <button
      onClick={() => onSelect(item.size)}
      className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-bold uppercase text-white transition-all active:scale-95 hover:scale-105 hover:brightness-110"
    >
      Solicitar Agora
    </button>
  </div>
));

SizeCard.displayName = "SizeCard";

const TamanhosSection = () => {
  const handleSizeClick = (size: string) => {
    handleWhatsAppClick(`Olá! Tenho interesse em uma caçamba de ${size}. Podem informar disponibilidade e valor?`);
  };

  return (
    <section id="tamanhos" className="bg-background py-10 md:py-16">
      <div className="container px-4">
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="mb-2 text-2xl font-extrabold text-foreground md:text-3xl lg:text-4xl">
            Qual caçamba você precisa?
          </h2>
          <p className="mx-auto max-w-lg text-sm md:text-base text-muted-foreground">
            Veja os tamanhos e chama a gente no WhatsApp.
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
            <img src={whatsappIcon} alt="WhatsApp" className="h-4 w-4" width={16} height={16} loading="lazy" />
            Não sabe qual escolher? Chama no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default TamanhosSection;
