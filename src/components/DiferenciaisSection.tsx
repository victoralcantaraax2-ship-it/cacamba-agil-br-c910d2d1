import { memo } from "react";
import { Truck, Clock, MessageCircle, FileCheck, DollarSign, CalendarCheck } from "lucide-react";

const diferenciais = [
  { icon: Truck, title: "Entrega em até 2 horas", desc: "Agilidade na entrega em São Paulo e região." },
  { icon: CalendarCheck, title: "Retirada programada", desc: "Você escolhe o dia e horário da retirada." },
  { icon: MessageCircle, title: "Atendimento imediato", desc: "Resposta em minutos pelo WhatsApp." },
  { icon: FileCheck, title: "Sem burocracia", desc: "Processo simples do pedido à entrega." },
  { icon: DollarSign, title: "Melhor custo-benefício", desc: "Preço competitivo sem comprometer qualidade." },
  { icon: Clock, title: "Prazo garantido", desc: "Cumprimos o horário combinado, sempre." },
];

const DiferenciaisSection = memo(() => {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-extrabold text-foreground md:text-3xl">
            Por Que Escolher a NORTEX
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
          {diferenciais.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl border border-border transition-all hover:border-primary/30 hover:shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground md:text-base">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

DiferenciaisSection.displayName = "DiferenciaisSection";

export default DiferenciaisSection;
